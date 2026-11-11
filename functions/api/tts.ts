/**
 * Cloudflare Pages Function: GET /api/tts?voice=zh-CN-XiaoxiaoNeural&rate=-2%&text=...&ts=...&sig=...
 *
 * 通用在线 AI 神经网络真人语音网关（多音色白名单 + 6 层防盗刷安全架构）：
 * 1. 服务端密钥隔离：AZURE_SPEECH_KEY 仅存于 Cloudflare Secrets，前端零密钥暴露；
 * 2. Origin / Referer 严格同项目与专属域名白名单：严禁 *.github.io / *.pages.dev 全网通配，仅放行当前 Pages 项目自身域名（含预览分支）、ruixuandai.github.io、ALLOWED_TTS_HOSTS 与本地局域网调试 IP，边缘直接拦截盗链与裸调（403 零额度消耗）；
 * 3. 动态时间戳 + 恒定时间 SHA-256 签名校验 (ts + sig)：URL 查询参数传递 ±300s 时间戳与签名（保持 CORS Simple Request，零 OPTIONS 预检延迟），恒定时间比对防侧信道与参数篡改；
 * 4. 音色白名单 + 80 字截断 + 棋类专属词库正则锁 (LOCKED_TEXT_REGEX / ALLOWED_TEXT_REGEX)：杜绝长文本消耗，锁死儿童三子棋专属句式，彻底消除逆向白嫖价值；
 * 5. Cloudflare 全球边缘缓存优先 (caches.default, 1 年 immutable)：验签后剥离 ts/sig 构造标准缓存键，命中缓存消耗 0 个 Azure 字符且不计入限流；
 * 6. 单 IP + 全局桶双重「未命中缓存」限流器：仅对需实际调用 Azure 的新句子限流（单 IP 20次/分、150次/时；单节点全局 60次/分、600次/时），严防脚本与代理池刷空 Free F0 月度 50 万免费字符。
 */

const ALLOWED_VOICES = new Set([
  // 中文精选自然神经音色
  "zh-CN-XiaoxiaoNeural",         // 👩 晓晓 · 温柔自然女声（默认推荐）
  "zh-CN-XiaoyiNeural",           // 👧 晓伊 · 甜美童趣绘本音
  "zh-CN-YunxiaNeural",           // 👦 云夏 · 元气阳光少年
  "zh-CN-liaoning-XiaobeiNeural", // 🎭 晓北 · 亲切幽默东北腔
  "zh-CN-YunjianNeural",          // 🦁 云健 · 温暖浑厚鼓励男声
  "zh-CN-YunxiNeural",            // 🧑 云希 · 清朗故事青年男声
  "zh-CN-shaanxi-XiaoniNeural",   // 🏮 晓妮 · 俏皮陕西腔女声
  // 英文精选自然神经音色
  "en-US-AnaNeural",              // 👧 Ana · 英文纯真童声
  "en-US-JennyNeural",            // 👩 Jenny · 英文亲切女声
  "en-US-GuyNeural",              // 🧑 Guy · 英文自然男声
]);
const DEFAULT_VOICE = "zh-CN-XiaoxiaoNeural";
const DEFAULT_CLIENT_SECRET = "kmg-tts-2026-guard-v1";
const MAX_TEXT_LEN = 80;
const MAX_MISS_PER_MINUTE = 20;
const MAX_MISS_PER_HOUR = 150;
const GLOBAL_MAX_MISS_PER_MINUTE = 60;
const GLOBAL_MAX_MISS_PER_HOUR = 600;

// 针对儿童三子棋专属台词词库锁定允许合成的句式正则（彻底杜绝逆向签名后合成小说/外部商业文本）
const LOCKED_TEXT_REGEX: RegExp | null =
  /(?:^你好$|三子棋|下棋|棋盘|棋局|闪光格|中间|角落|连胜|赢啦|再来一局|平局|玩家|轮到|电脑|猫头鹰|小狐|小猴|勋章|解锁|扭蛋|抽到了|霸王龙|独角兽|小熊猫|蓝鲸|狮子王|垂耳兔|小神龙|小企鹅|树袋熊|宇航员|晓晓|晓伊|云夏|晓北|老妹儿|云健|保持专注|离线语音|语音已开启|安全网关)/u;

const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const EDGE_HTTPS_WS_URL = "https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1";
const SEC_MS_GEC_VERSION = "2-143.0.3650.96";
const EDGE_COPYRIGHT = "Copyright (C) Microsoft Corporation. All rights reserved.";

const SWAP_FIRST_WORD = { swappedWord: 0xef0569fb, swappedSum: 0x76f50f34, swappedProduct: 0xc3efea97 };
const SWAP_SECOND_WORD = { swappedWord: 0xc31713db, swappedSum: 0x1881ce3c, swappedProduct: 0x35bd1ec9 };
const MIX_FIRST_WORD = [0xcf98b111, 0x87085b9f, 0x12ceb96d, 0x257e1d83];
const MIX_SECOND_WORD = [0xa27416f5, 0xd38396ff, 0x7c932b89, 0xbfa49f69];

const ipRateMap = new Map<string, { minBucket: number; minCount: number; hourBucket: number; hourCount: number }>();
const globalQuota = { minBucket: 0, minCount: 0, hourBucket: 0, hourCount: 0 };

export interface PagesEnv {
  AZURE_SPEECH_KEY?: string;
  AZURE_SPEECH_REGION?: string;
  TTS_CLIENT_SECRET?: string;
  ALLOWED_TTS_HOSTS?: string;
  ALLOWED_TEXT_REGEX?: string;
}

export interface PagesContext {
  request: Request;
  env?: PagesEnv;
  waitUntil(promise: Promise<unknown>): void;
}

function getPagesProjectBaseHost(reqHostname: string): string | null {
  const lower = reqHostname.toLowerCase();
  if (!lower.endsWith(".pages.dev")) return null;
  const parts = lower.split(".");
  if (parts.length >= 3) {
    return parts.slice(-3).join(".");
  }
  return null;
}

function isAllowedOriginUrl(rawUrl: string, reqHostname: string, extraHostsCsv?: string): boolean {
  if (!rawUrl) return false;
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();
    const normalizedReqHost = reqHostname.toLowerCase();
    const pagesBase = getPagesProjectBaseHost(normalizedReqHost);

    // 严格限制仅允许：当前请求所属域名/Pages 项目自身（含预览子域名）、本人 GitHub Pages 及局域网调试 IP
    if (
      host === normalizedReqHost ||
      (pagesBase !== null && (host === pagesBase || host.endsWith(`.${pagesBase}`))) ||
      host === "ruixuandai.github.io" ||
      host === "kid-tic-tac-toe.pages.dev" ||
      host.endsWith(".kid-tic-tac-toe.pages.dev") ||
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.startsWith("192.168.") ||
      host.startsWith("10.")
    ) {
      return true;
    }
    if (extraHostsCsv) {
      const extra = extraHostsCsv
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      for (const rule of extra) {
        if (rule.startsWith(".") ? host.endsWith(rule) || host === rule.slice(1) : host === rule) {
          return true;
        }
      }
    }
    return false;
  } catch {
    return false;
  }
}

function buildCorsHeaders(request: Request, extraHostsCsv?: string): Record<string, string> {
  const origin = request.headers.get("Origin") ?? "";
  const reqUrl = new URL(request.url);
  const allowedOrigin = isAllowedOriginUrl(origin, reqUrl.hostname, extraHostsCsv) ? origin : reqUrl.origin;
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Expose-Headers": "X-TTS-Provider",
    Vary: "Origin",
  };
}

export async function onRequestOptions(context: PagesContext): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: buildCorsHeaders(context.request, context.env?.ALLOWED_TTS_HOSTS),
  });
}

async function verifySignature(
  ts: string,
  sig: string,
  voice: string,
  rate: string,
  cleanedText: string,
  secret: string,
): Promise<boolean> {
  if (!ts || !sig) return false;
  const tsNum = Number(ts);
  const nowSec = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(tsNum) || Math.abs(nowSec - tsNum) > 300) {
    return false;
  }
  const raw = `${ts}|${voice}|${rate}|${cleanedText}|${secret}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  const expected = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
  if (sig.length !== expected.length) return false;
  // 恒定时间比较 (Constant-Time Comparison)，防范计时侧信道猜解
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

function checkAndIncrementIpQuota(ip: string): boolean {
  const nowSec = Math.floor(Date.now() / 1000);
  const minBucket = Math.floor(nowSec / 60);
  const hourBucket = Math.floor(nowSec / 3600);

  // 全局熔断限流桶：防范多 IP 代理池在同一边缘节点并发刷量
  if (globalQuota.minBucket !== minBucket) {
    globalQuota.minBucket = minBucket;
    globalQuota.minCount = 0;
  }
  if (globalQuota.hourBucket !== hourBucket) {
    globalQuota.hourBucket = hourBucket;
    globalQuota.hourCount = 0;
  }
  if (
    globalQuota.minCount >= GLOBAL_MAX_MISS_PER_MINUTE ||
    globalQuota.hourCount >= GLOBAL_MAX_MISS_PER_HOUR
  ) {
    return false;
  }

  let record = ipRateMap.get(ip);
  if (!record) {
    record = { minBucket, minCount: 0, hourBucket, hourCount: 0 };
    if (ipRateMap.size > 2000) {
      const firstKey = ipRateMap.keys().next().value;
      if (firstKey) ipRateMap.delete(firstKey);
    }
    ipRateMap.set(ip, record);
  }

  if (record.minBucket !== minBucket) {
    record.minBucket = minBucket;
    record.minCount = 0;
  }
  if (record.hourBucket !== hourBucket) {
    record.hourBucket = hourBucket;
    record.hourCount = 0;
  }

  if (record.minCount >= MAX_MISS_PER_MINUTE || record.hourCount >= MAX_MISS_PER_HOUR) {
    return false;
  }

  record.minCount += 1;
  record.hourCount += 1;
  globalQuota.minCount += 1;
  globalQuota.hourCount += 1;
  return true;
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const corsHeaders = buildCorsHeaders(request, env?.ALLOWED_TTS_HOSTS);

  // 1. 校验 Origin / Referer 专属域名白名单，边缘直接拦截外部网站盗链与无头脚本直刷（0 额度消耗）
  const origin = request.headers.get("Origin") ?? "";
  const referer = request.headers.get("Referer") ?? "";

  if (
    !isAllowedOriginUrl(origin, url.hostname, env?.ALLOWED_TTS_HOSTS) &&
    !isAllowedOriginUrl(referer, url.hostname, env?.ALLOWED_TTS_HOSTS)
  ) {
    return jsonError(403, "Forbidden: unauthorized origin", corsHeaders);
  }

  // 2. 校验与清洗文本（限制 <= 80 字符，必须含有效中英文或数字，且校验词库正则锁）
  const rawText = url.searchParams.get("text") ?? "";
  const cleaned = cleanTtsInput(rawText);
  if (!cleaned || !/[0-9\u4e00-\u9fa5a-zA-Z]/.test(cleaned)) {
    return jsonError(400, "Invalid or empty text", corsHeaders);
  }
  const customPattern = env?.ALLOWED_TEXT_REGEX?.trim();
  let activeRegex: RegExp | null = LOCKED_TEXT_REGEX;
  if (customPattern) {
    try {
      activeRegex = new RegExp(customPattern, "u");
    } catch {
      activeRegex = LOCKED_TEXT_REGEX;
    }
  }
  if (activeRegex && !activeRegex.test(cleaned)) {
    return jsonError(403, "Forbidden: text outside allowed vocabulary", corsHeaders);
  }

  // 3. 校验音色白名单与语速
  const reqVoice = url.searchParams.get("voice") ?? DEFAULT_VOICE;
  const voice = ALLOWED_VOICES.has(reqVoice) ? reqVoice : DEFAULT_VOICE;
  const reqRate = url.searchParams.get("rate") ?? "-2%";
  const rate = /^[+-]?\d{1,2}%$/.test(reqRate) ? reqRate : "-2%";

  // 4. 校验时间戳与防篡改签名 (ts + sig)
  const ts = url.searchParams.get("ts") ?? "";
  const sig = url.searchParams.get("sig") ?? "";
  const secret = env?.TTS_CLIENT_SECRET?.trim() || DEFAULT_CLIENT_SECRET;
  const validSig = await verifySignature(ts, sig, voice, rate, cleaned, secret);
  if (!validSig) {
    return jsonError(403, "Forbidden: invalid or expired signature", corsHeaders);
  }

  // 5. 优先查询 Cloudflare 全球边缘节点缓存（命中缓存不消耗任何 Azure 额度）
  const cacheUrl = new URL("/__tts_cache_v1", url.origin);
  cacheUrl.searchParams.set("v", voice);
  cacheUrl.searchParams.set("r", rate);
  cacheUrl.searchParams.set("t", cleaned);
  const cacheKey = new Request(cacheUrl.toString(), { method: "GET" });
  const edgeCache = (caches as unknown as { default?: Cache }).default;

  if (edgeCache) {
    const hit = await edgeCache.match(cacheKey);
    if (hit) {
      const headers = new Headers(hit.headers);
      for (const [k, v] of Object.entries(corsHeaders)) {
        headers.set(k, v);
      }
      return new Response(hit.body, {
        status: hit.status,
        headers,
      });
    }
  }

  // 6. 缓存未命中时，按客户端真实 IP + 节点全局桶执行严格限流（防止恶意构造随机文本耗尽月度免费额度）
  const clientIp = request.headers.get("CF-Connecting-IP") ?? "unknown";
  if (!checkAndIncrementIpQuota(clientIp)) {
    return jsonError(429, "Rate limit exceeded for new speech synthesis", corsHeaders);
  }

  const azureKey = env?.AZURE_SPEECH_KEY?.trim() ?? "";
  const azureRegion = env?.AZURE_SPEECH_REGION?.trim() ?? "";
  const useAzure = Boolean(azureKey && azureRegion);

  try {
    const mp3 = useAzure
      ? await synthesizeAzureMp3(azureKey, azureRegion, voice, cleaned, rate)
      : await synthesizeEdgeMp3(voice, cleaned, rate);
    const body = new Uint8Array(mp3).buffer;
    const response = new Response(body, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Content-Length": String(mp3.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-TTS-Provider": useAzure ? "azure-neural" : "edge-readaloud",
      },
    });
    if (edgeCache) {
      context.waitUntil(edgeCache.put(cacheKey, response.clone()));
    }
    return response;
  } catch (err) {
    return jsonError(502, err instanceof Error ? err.message : String(err), corsHeaders);
  }
}

async function synthesizeAzureMp3(
  apiKey: string,
  region: string,
  voice: string,
  text: string,
  rate: string,
): Promise<Uint8Array> {
  const cleanRegion = region.toLowerCase();
  if (!/^[a-z0-9-]+$/.test(cleanRegion)) {
    throw new Error("Invalid AZURE_SPEECH_REGION format");
  }

  const xmlLang = voice.startsWith("en-") ? "en-US" : "zh-CN";
  const endpoint = `https://${cleanRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
  const ssml =
    `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='${xmlLang}'>` +
    `<voice name='${voice}'><prosody pitch='+0Hz' rate='${rate}' volume='+0%'>${escapeXml(text)}</prosody></voice>` +
    `</speak>`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "WebOnlineTTS/1.0",
      },
      body: ssml,
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Azure Speech HTTP ${res.status}`);
    }

    const buf = new Uint8Array(await res.arrayBuffer());
    if (buf.byteLength < 128) {
      throw new Error("Azure Speech returned empty audio");
    }
    return buf;
  } finally {
    clearTimeout(timer);
  }
}

function jsonError(status: number, error: string, corsHeaders: Record<string, string>): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function cleanTtsInput(raw: string): string {
  return raw
    .replace(/(\d{1,2}):00/g, "$1点整")
    .replace(/(\d{1,2}):30/g, "$1点半")
    .replace(/(\d{1,2}):(\d{2})/g, "$1点$2分")
    .replace(/\p{Extended_Pictographic}/gu, " ")
    .replace(/[\uFE00-\uFE0F\u200D\u20E3]/g, "")
    .replace(/[✓✔✕✖✗▶◀▲▼•·|]/g, " ")
    .replace(/\+/g, " 加 ")
    .replace(/[−-]/g, " 减 ")
    .replace(/[×*]/g, " 乘 ")
    .replace(/[÷]/g, " 除以 ")
    .replace(/=/g, " 等于 ")
    .replace(/(\d+)\s*\/\s*(\d+)/g, "$2个里完成了$1个")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_TEXT_LEN);
}

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function synthesizeEdgeMp3(voice: string, text: string, rate: string): Promise<Uint8Array> {
  const connId = crypto.randomUUID();
  const secMsGec = await generateSecMsGec();
  const wsTarget =
    `${EDGE_HTTPS_WS_URL}?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}` +
    `&Sec-MS-GEC=${secMsGec}&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}&ConnectionId=${connId}`;

  const upgradeRes = await fetch(wsTarget, {
    headers: {
      Upgrade: "websocket",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0",
      Origin: "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
    },
  });

  const ws = (upgradeRes as Response & { webSocket?: WebSocket }).webSocket;
  if (!ws) {
    throw new Error(`Edge TTS upgrade failed: HTTP ${upgradeRes.status}`);
  }
  (ws as WebSocket & { accept(): void }).accept();

  const xmlLang = voice.startsWith("en-") ? "en-US" : "zh-CN";
  const reqId = randomHex(16);
  const configFrame =
    "Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n" +
    JSON.stringify({
      context: {
        synthesis: {
          audio: {
            metadataoptions: { sentenceBoundaryEnabled: "false", wordBoundaryEnabled: "false" },
            outputFormat: "audio-24khz-48kbitrate-mono-mp3",
          },
        },
      },
    });

  const ssml =
    `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${xmlLang}'>` +
    `<voice name='${voice}'><prosody pitch='+0Hz' rate='${rate}' volume='+0%'>${escapeXml(text)}</prosody></voice>` +
    `</speak>`;
  const ssmlFrame = `X-RequestId:${reqId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n${ssml}`;

  return new Promise<Uint8Array>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    let settled = false;
    const decoder = new TextDecoder();
    const audioDelim = new TextEncoder().encode("Path:audio\r\n");

    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        ws.close();
      } catch {
        // ignore
      }
      fn();
    };

    const timer = setTimeout(() => {
      finish(() => reject(new Error("Edge TTS synthesis timeout")));
    }, 3500);

    ws.addEventListener("message", (ev: MessageEvent) => {
      if (typeof ev.data === "string") {
        if (ev.data.includes("Path:turn.end")) {
          const total = chunks.reduce((s, c) => s + c.byteLength, 0);
          if (total < 128) {
            finish(() => reject(new Error("Empty audio received")));
            return;
          }
          const merged = new Uint8Array(total);
          let offset = 0;
          for (const c of chunks) {
            merged.set(c, offset);
            offset += c.byteLength;
          }
          finish(() => resolve(merged));
        }
        return;
      }

      if (ev.data instanceof ArrayBuffer) {
        const bytes = new Uint8Array(ev.data);
        const idx = indexOfBytes(bytes, audioDelim);
        if (idx >= 0) {
          const audioPart = bytes.subarray(idx + audioDelim.byteLength);
          if (audioPart.byteLength > 0) chunks.push(audioPart);
        } else {
          const asText = decoder.decode(bytes);
          if (asText.includes("Path:turn.end")) {
            const total = chunks.reduce((s, c) => s + c.byteLength, 0);
            const merged = new Uint8Array(total);
            let offset = 0;
            for (const c of chunks) {
              merged.set(c, offset);
              offset += c.byteLength;
            }
            finish(() => (merged.byteLength >= 128 ? resolve(merged) : reject(new Error("Empty audio"))));
          }
        }
      }
    });

    ws.addEventListener("error", () => {
      finish(() => reject(new Error("Edge TTS WebSocket error")));
    });

    ws.addEventListener("close", () => {
      finish(() => reject(new Error("Edge TTS closed before turn.end")));
    });

    ws.send(configFrame);
    ws.send(ssmlFrame);
  });
}

function indexOfBytes(haystack: Uint8Array, needle: Uint8Array): number {
  outer: for (let i = 0; i <= haystack.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) continue outer;
    }
    return i;
  }
  return -1;
}

async function generateSecMsGec(): Promise<string> {
  const ticks = Math.floor(Date.now() / 1000) + 11644473600;
  const rounded = ticks - (ticks % 300);
  const windowsTicks = rounded * 10000000;
  const message = new TextEncoder().encode(`${EDGE_COPYRIGHT}${windowsTicks}${TRUSTED_CLIENT_TOKEN}`);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", message));
  return `${toUpperHex(cs64(message, digest))}-${toUpperHex(digest)}`;
}

function cs64(message: Uint8Array, digest: Uint8Array): Uint8Array {
  const digestView = new DataView(digest.buffer, digest.byteOffset, digest.byteLength);
  const firstKey = (digestView.getUint32(0, true) | 1) >>> 0;
  const secondKey = (digestView.getUint32(4, true) | 1) >>> 0;
  const padded = new Uint8Array(Math.ceil(message.length / 8) * 8);
  padded.set(message);
  const words = new DataView(padded.buffer);
  let swapSum = 0;
  let lastSwap = 0;
  let mix = 0;
  let mixSum = 0;
  for (let offset = 0; offset < padded.length; offset += 8) {
    const firstWord = words.getUint32(offset, true);
    const secondWord = words.getUint32(offset + 4, true);
    const firstSwap = swapTerm(firstWord, firstKey, SWAP_FIRST_WORD);
    lastSwap = swapTerm(secondWord, secondKey, SWAP_SECOND_WORD);
    swapSum = (swapSum + firstSwap + lastSwap) >>> 0;
    mix = swapAndMultiply(Math.imul(mix + firstWord, firstKey), MIX_FIRST_WORD);
    mixSum = (mixSum + mix) >>> 0;
    mix = swapAndMultiply(Math.imul(mix + secondWord, secondKey), MIX_SECOND_WORD);
    mixSum = (mixSum + mix) >>> 0;
  }
  const checksum = new Uint8Array(8);
  const checksumView = new DataView(checksum.buffer);
  checksumView.setUint32(0, lastSwap ^ mix, true);
  checksumView.setUint32(4, swapSum ^ mixSum, true);
  return checksum;
}

function swapTerm(
  word: number,
  key: number,
  multipliers: { swappedWord: number; swappedSum: number; swappedProduct: number },
): number {
  const sum = Math.imul(word, key) + Math.imul(swapHalves(word), multipliers.swappedWord);
  const product = Math.imul(swapHalves(sum), multipliers.swappedSum) >>> 0;
  return (Math.imul(swapHalves(product), multipliers.swappedProduct) + product) >>> 0;
}

function swapAndMultiply(value: number, multipliers: number[]): number {
  let cur = value;
  for (const m of multipliers) {
    cur = Math.imul(swapHalves(cur), m) >>> 0;
  }
  return cur;
}

function swapHalves(value: number): number {
  return ((value << 16) | (value >>> 16)) >>> 0;
}

function toUpperHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

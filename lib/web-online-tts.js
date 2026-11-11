/**
 * WebOnlineTTS (`web-online-tts.js`)
 * 全栈在线 AI 神经网络真人语音客户端 + 防刷签名保护 + 边缘缓存 + 本机离线自动兜底 (UMD / Browser Global)
 *
 * 特性：
 * 1. 默认精选「👩 晓晓 · 温柔姐姐」(zh-CN-XiaoxiaoNeural)，同时内置晓伊、云夏、晓北、云健等多款真人神经音色可供切换或单音色锁定，仅在断网/接口不可达或用户主动选择 `local` 时降级本机离线语音；
 * 2. 区分浏览器未交互自动播放拦截 (NotAllowedError) 与网络故障：首屏未点击时的自动读题会先静默预加载神经语音 MP3，绝不误触 25s 熔断或退回旧版机械音，并在用户首次点击空白处时立即补播；
 * 3. 内置防盗刷安全机制：每次请求携带时间戳 `ts` + SHA-256 签名 `sig`（含非 HTTPS 局域网纯 JS SHA-256 兜底），配合服务端 Origin/Referer 白名单与单 IP 限流，严防黑客盗刷耗尽 Free Tier；
 * 4. iPad / iPhone Safari 100% 兼容：首次真实手势通过 44 字节静音 WAV 解锁并全局复用单 HTMLAudioElement。
 */
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    const exported = factory();
    global.OnlineNeuralTTS = exported.OnlineNeuralTTS;
    global.TTS_VOICE_OPTIONS = exported.TTS_VOICE_OPTIONS;
  }
})(this, function () {
  'use strict';

  const DEFAULT_VOICE = 'zh-CN-XiaoxiaoNeural';
  const TTS_CLIENT_SECRET = 'kmg-tts-2026-guard-v1';

  const TTS_VOICE_OPTIONS = [
    {
      id: 'zh-CN-XiaoxiaoNeural',
      emoji: '👩',
      shortLabel: '晓晓',
      name: '晓晓 · 温柔姐姐',
      hint: 'AI 真人神经语音 · 自然柔和故事音（默认推荐）',
      sample: '你好呀，我是温柔姐姐晓晓，今天也要开开心心哦。'
    },
    {
      id: 'zh-CN-XiaoyiNeural',
      emoji: '👧',
      shortLabel: '晓伊',
      name: '晓伊 · 甜美童趣',
      hint: 'AI 真人神经语音 · 卡通绘本感',
      sample: '嗨！我是晓伊，我们一起来闯关吧！'
    },
    {
      id: 'zh-CN-YunxiaNeural',
      emoji: '👦',
      shortLabel: '云夏',
      name: '云夏 · 元气少年',
      hint: 'AI 真人神经语音 · 阳光活力童声',
      sample: '冲呀！我是元气少年云夏，这道题难不倒你！'
    },
    {
      id: 'zh-CN-liaoning-XiaobeiNeural',
      emoji: '🎭',
      shortLabel: '晓北',
      name: '晓北 · 幽默东北腔',
      hint: 'AI 真人神经语音 · 亲切搞笑东北话',
      sample: '哎呀妈呀，老妹儿老弟你太厉害了，继续加油嗷！'
    },
    {
      id: 'zh-CN-YunjianNeural',
      emoji: '🦁',
      shortLabel: '云健',
      name: '云健 · 温暖鼓励叔',
      hint: 'AI 真人神经语音 · 沉稳阳光男声',
      sample: '干得漂亮！保持专注，你已经越来越棒了！'
    },
    {
      id: 'local',
      emoji: '📱',
      shortLabel: '离线',
      name: '本机离线语音',
      hint: '零流量 · 使用设备自带语音引擎',
      sample: '当前已切换为本机离线语音播报。'
    }
  ];

  const STORAGE_KEY = 'web-online-tts-settings';
  const DEFAULT_CLOUDFLARE_ENDPOINT = 'https://kid-tic-tac-toe.pages.dev/api/tts';
  const SILENT_WAV =
    'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

  function isStaticOnlyHost() {
    if (typeof window === 'undefined' || !window.location) return false;
    const host = (window.location.hostname || '').toLowerCase();
    const proto = window.location.protocol || '';
    return proto === 'file:' || host.endsWith('.github.io') || host === 'github.io';
  }

  function sha256PureJs(ascii) {
    const rightRotate = (v, a) => (v >>> a) | (v << (32 - a));
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let result = '';
    const words = [];
    const asciiBitLength = ascii.length * 8;
    let hash = [];
    const k = [];
    let primeCounter = 0;
    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (let i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    ascii += '\x80';
    while ((ascii.length % 64) - 56) ascii += '\x00';
    for (let i = 0; i < ascii.length; i++) {
      const j = ascii.charCodeAt(i);
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;
    for (let j = 0; j < words.length; ) {
      const w = words.slice(j, (j += 16));
      const oldHash = hash.slice(0);
      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const a = hash[0], e = hash[4];
        const temp1 =
          hash[7] +
          (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
          ((e & hash[5]) ^ (~e & hash[6])) +
          k[i] +
          (w[i] =
            i < 16
              ? w[i]
              : (w[i - 16] +
                  (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                  w[i - 7] +
                  (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
                0);
        const temp2 =
          (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
          ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
        hash.pop();
      }
      for (let i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    for (let i = 0; i < 8; i++) {
      for (let j = 3; j + 1; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? 0 : '') + b.toString(16);
      }
    }
    return result;
  }

  async function signTtsRequest(voice, rate, text) {
    const ts = String(Math.floor(Date.now() / 1000));
    const raw = `${ts}|${voice}|${rate}|${text}|${TTS_CLIENT_SECRET}`;
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
      const hex = Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, 32);
      return { ts, sig: hex };
    }
    const utf8Str = unescape(encodeURIComponent(raw));
    return { ts, sig: sha256PureJs(utf8Str).slice(0, 32) };
  }

  class OnlineNeuralTTS {
    constructor(options = {}) {
      const persisted = this._loadSettings();
      this.endpoint = options.endpoint || persisted.endpoint || '/api/tts';
      this.fallbackEndpoint = options.fallbackEndpoint || DEFAULT_CLOUDFLARE_ENDPOINT;
      this.voice = options.voice || persisted.voice || DEFAULT_VOICE;
      this.rate = options.rate || persisted.rate || '-2%';
      this.muted = options.muted !== undefined ? Boolean(options.muted) : Boolean(persisted.muted);
      this.maxBlobCache = options.maxBlobCache || 80;
      this.backoffMs = options.backoffMs || 25000;

      this.blobCache = new Map();
      this.inflightClient = new Map();
      this.sharedAudio = null;
      this.audioUnlocked = false;
      this.activeSeq = 0;
      this.activeAbort = null;
      this._finishActivePlay = null;
      this.neuralBackoffUntil = 0;
      this.lastExplicitSpeakAt = 0;
      this.pendingBlobUrl = null;
      this.preferFallbackEndpoint = isStaticOnlyHost();

      const NaturalTTSClass =
        (typeof window !== 'undefined' && window.NaturalTTS) ||
        (typeof globalThis !== 'undefined' && globalThis.NaturalTTS) ||
        null;

      this.offlineTts = NaturalTTSClass
        ? new NaturalTTSClass({
            lang: 'zh-CN',
            rate: 0.94,
            pitch: 1.0,
            volume: 1.0,
            filterEmojis: true,
            normalizeMath: true,
            cancelPrevious: true,
            autoUnlock: false
          })
        : null;

      if (typeof window !== 'undefined' && options.autoUnlock !== false) {
        this._bindGestureUnlock();
      }
    }

    _bindGestureUnlock() {
      const onGesture = () => {
        this.unlockAudio();
        if (this.audioUnlocked) {
          document.removeEventListener('pointerdown', onGesture);
          document.removeEventListener('touchstart', onGesture);
          document.removeEventListener('click', onGesture);
          document.removeEventListener('keydown', onGesture);
        }
      };
      document.addEventListener('pointerdown', onGesture, { passive: true });
      document.addEventListener('touchstart', onGesture, { passive: true });
      document.addEventListener('click', onGesture, { passive: true });
      document.addEventListener('keydown', onGesture, { passive: true });
    }

    _loadSettings() {
      if (typeof window === 'undefined' || !window.localStorage) return {};
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    _saveSettings() {
      if (typeof window === 'undefined' || !window.localStorage) return;
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            voice: this.voice,
            muted: this.muted,
            rate: this.rate,
            endpoint: this.endpoint
          })
        );
      } catch (e) {
        // ignore quota errors
      }
    }

    getVoices() {
      return TTS_VOICE_OPTIONS;
    }

    getActiveVoiceOption() {
      return TTS_VOICE_OPTIONS.find(v => v.id === this.voice) || TTS_VOICE_OPTIONS[0];
    }

    getSharedAudio() {
      if (typeof window === 'undefined' || typeof Audio === 'undefined') return null;
      if (!this.sharedAudio) {
        this.sharedAudio = new Audio();
        this.sharedAudio.preload = 'auto';
      }
      return this.sharedAudio;
    }

    /**
     * 仅在真实用户交互手势 (pointerdown/touchstart/click/keydown) 中调用以解锁 HTMLAudioElement
     */
    unlockAudio() {
      const el = this.getSharedAudio();
      if (!el) return;

      const schedulePendingPlay = () => {
        if (!this.pendingBlobUrl || this.muted) return;
        const pendingUrl = this.pendingBlobUrl;
        const seqAtUnlock = this.activeSeq;
        setTimeout(() => {
          if (this.activeSeq !== seqAtUnlock || this.muted || !this.pendingBlobUrl) return;
          this.pendingBlobUrl = null;
          el.muted = false;
          el.src = pendingUrl;
          el.currentTime = 0;
          el.play().catch(() => {});
        }, 90);
      };

      if (this.audioUnlocked) {
        schedulePendingPlay();
        return;
      }

      if (this._unlocking) return;

      if (el.src && el.src.startsWith('blob:') && !el.paused) {
        this.audioUnlocked = true;
        return;
      }

      this._unlocking = true;
      try {
        el.muted = true;
        el.src = SILENT_WAV;
        const p = el.play();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            this._unlocking = false;
            this.audioUnlocked = true;
            if (!el.src || el.src === SILENT_WAV || el.src.startsWith('data:audio/wav')) {
              el.pause();
              el.muted = false;
              el.currentTime = 0;
            }
            schedulePendingPlay();
          }).catch(() => {
            this._unlocking = false;
            el.muted = false;
          });
        } else {
          this._unlocking = false;
          this.audioUnlocked = true;
          el.muted = false;
          schedulePendingPlay();
        }
      } catch (e) {
        this._unlocking = false;
        el.muted = false;
      }
    }

    cleanText(raw) {
      if (!raw || typeof raw !== 'string') return '';
      return raw
        .replace(/(\d{1,2}):00/g, '$1点整')
        .replace(/(\d{1,2}):30/g, '$1点半')
        .replace(/(\d{1,2}):(\d{2})/g, '$1点$2分')
        .replace(/[\p{Extended_Pictographic}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F6FF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{2300}-\u{23FF}\u{2B50}]/gu, ' ')
        .replace(/[✓✔✕✖✗▶◀▲▼•·|]/g, ' ')
        .replace(/\+/g, ' 加 ')
        .replace(/[−-]/g, ' 减 ')
        .replace(/[×*]/g, ' 乘 ')
        .replace(/[÷]/g, ' 除以 ')
        .replace(/=/g, ' 等于 ')
        .replace(/(\d+)\s*\/\s*(\d+)/g, '$2个里完成了$1个')
        .replace(/\?/g, '？')
        .replace(/!/g, '！')
        .replace(/[！!]+/g, '！')
        .replace(/[？?]+/g, '？')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 80);
    }

    _cacheBlobUrl(key, url) {
      if (this.blobCache.has(key)) {
        this.blobCache.delete(key);
      } else if (this.blobCache.size >= this.maxBlobCache) {
        const oldestKey = this.blobCache.keys().next().value;
        if (oldestKey) {
          const oldUrl = this.blobCache.get(oldestKey);
          this.blobCache.delete(oldestKey);
          if (oldUrl) URL.revokeObjectURL(oldUrl);
        }
      }
      this.blobCache.set(key, url);
    }

    async _fetchFromUrl(baseUrl, paramsStr, signal) {
      const res = await fetch(`${baseUrl}?${paramsStr}`, { signal });
      if (!res.ok) throw new Error(`TTS HTTP ${res.status}`);
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('audio')) throw new Error('Non-audio TTS response');
      const blob = await res.blob();
      if (blob.size < 128) throw new Error('Empty TTS audio');
      return URL.createObjectURL(blob);
    }

    async _fetchNeuralBlobUrl(voice, cleanedText, signal) {
      const key = `${voice}|${this.rate}|${cleanedText}`;
      const cached = this.blobCache.get(key);
      if (cached) {
        this.blobCache.delete(key);
        this.blobCache.set(key, cached);
        return cached;
      }

      const existing = this.inflightClient.get(key);
      if (existing) return existing;

      const task = (async () => {
        try {
          const { ts, sig } = await signTtsRequest(voice, this.rate, cleanedText);
          const params = new URLSearchParams({
            voice,
            rate: this.rate,
            text: cleanedText,
            ts,
            sig
          });
          const paramsStr = params.toString();

          const primaryUrl = this.preferFallbackEndpoint ? this.fallbackEndpoint : this.endpoint;
          try {
            const url = await this._fetchFromUrl(primaryUrl, paramsStr, signal);
            this._cacheBlobUrl(key, url);
            return url;
          } catch (primaryErr) {
            if (signal && signal.aborted) throw primaryErr;
            if (!this.preferFallbackEndpoint && this.fallbackEndpoint && this.fallbackEndpoint !== this.endpoint) {
              const fallbackUrl = await this._fetchFromUrl(this.fallbackEndpoint, paramsStr, signal);
              this.preferFallbackEndpoint = true;
              this._cacheBlobUrl(key, fallbackUrl);
              return fallbackUrl;
            }
            throw primaryErr;
          }
        } finally {
          this.inflightClient.delete(key);
        }
      })();

      this.inflightClient.set(key, task);
      return task;
    }

    prewarm(phrases = [], voiceOverride = null) {
      const voice = voiceOverride || this.voice || DEFAULT_VOICE;
      if (voice === 'local' || typeof window === 'undefined' || Date.now() < this.neuralBackoffUntil) return;
      const run = async () => {
        for (const p of phrases) {
          if (Date.now() < this.neuralBackoffUntil) break;
          const cleaned = this.cleanText(p);
          const key = `${voice}|${this.rate}|${cleaned}`;
          if (cleaned && !this.blobCache.has(key)) {
            try {
              await this._fetchNeuralBlobUrl(voice, cleaned);
            } catch (_) {}
          }
        }
      };
      setTimeout(run, 2200);
    }

    async speak(rawText, voiceOverride = null) {
      this.lastExplicitSpeakAt = Date.now();
      if (this.muted) return;
      const cleaned = this.cleanText(rawText);
      if (!cleaned) return;

      this.pendingBlobUrl = null;
      this.activeSeq += 1;
      const seq = this.activeSeq;
      if (this.activeAbort) {
        this.activeAbort.abort();
        this.activeAbort = null;
      }
      if (typeof this._finishActivePlay === 'function') {
        const prevFinish = this._finishActivePlay;
        this._finishActivePlay = null;
        prevFinish();
      }
      const el = this.getSharedAudio();
      if (el && !el.paused && el.src && el.src.startsWith('blob:')) {
        try {
          el.pause();
          el.currentTime = 0;
        } catch (_) {}
      }
      if (this.offlineTts) this.offlineTts.stop();

      const voice = voiceOverride || this.voice || DEFAULT_VOICE;

      if (voice !== 'local' && el && Date.now() >= this.neuralBackoffUntil) {
        const controller = new AbortController();
        this.activeAbort = controller;
        const timeoutId = window.setTimeout(() => controller.abort(), 5000);
        let blobUrl = null;

        try {
          blobUrl = await this._fetchNeuralBlobUrl(voice, cleaned, controller.signal);
          window.clearTimeout(timeoutId);
        } catch (fetchErr) {
          window.clearTimeout(timeoutId);
          if (this.activeAbort === controller) this.activeAbort = null;
          if (seq !== this.activeSeq) return;
          this.neuralBackoffUntil = Date.now() + this.backoffMs;
        } finally {
          if (this.activeAbort === controller) this.activeAbort = null;
        }

        if (seq !== this.activeSeq) return;

        if (blobUrl) {
          try {
            try {
              el.pause();
            } catch (_) {}
            el.muted = false;
            el.src = blobUrl;
            el.currentTime = 0;
            await new Promise((resolve, reject) => {
              const cleanup = () => {
                el.onended = null;
                el.onerror = null;
                if (this._finishActivePlay === finish) {
                  this._finishActivePlay = null;
                }
              };
              const finish = () => {
                cleanup();
                resolve();
              };
              this._finishActivePlay = finish;
              el.onended = finish;
              el.onerror = () => {
                cleanup();
                reject(new Error('Audio playback error'));
              };
              const playPromise = el.play();
              if (playPromise && typeof playPromise.then === 'function') {
                playPromise
                  .then(() => {
                    this.audioUnlocked = true;
                    if (seq !== this.activeSeq || this.muted) {
                      try {
                        el.pause();
                      } catch (_) {}
                      finish();
                    }
                  })
                  .catch(err => {
                    cleanup();
                    reject(err);
                  });
              } else {
                this.audioUnlocked = true;
                finish();
              }
            });
          } catch (playErr) {
            if (playErr && playErr.name === 'NotAllowedError') {
              this.pendingBlobUrl = blobUrl;
            }
          }
          return;
        }
      }

      if (seq !== this.activeSeq) return;
      if (this.offlineTts) {
        await this.offlineTts.speak(cleaned).catch(() => {});
      }
    }

    stop() {
      this.lastExplicitSpeakAt = Date.now();
      this.pendingBlobUrl = null;
      this.activeSeq += 1;
      if (this.activeAbort) {
        this.activeAbort.abort();
        this.activeAbort = null;
      }
      if (typeof this._finishActivePlay === 'function') {
        const prevFinish = this._finishActivePlay;
        this._finishActivePlay = null;
        prevFinish();
      }
      if (this.sharedAudio) {
        try {
          this.sharedAudio.pause();
          this.sharedAudio.currentTime = 0;
        } catch (_) {}
      }
      if (this.offlineTts) this.offlineTts.stop();
    }

    setVoice(voiceId) {
      const valid = TTS_VOICE_OPTIONS.find(v => v.id === voiceId);
      this.voice = valid ? valid.id : DEFAULT_VOICE;
      this.neuralBackoffUntil = 0;
      this._saveSettings();
      return this.getActiveVoiceOption();
    }

    cycleVoice(includeOffline = false) {
      const pool = includeOffline
        ? TTS_VOICE_OPTIONS
        : TTS_VOICE_OPTIONS.filter(v => v.id !== 'local');
      const idx = pool.findIndex(v => v.id === this.voice);
      const next = pool[(idx + 1) % pool.length] || pool[0];
      return this.setVoice(next.id);
    }

    setMuted(muted) {
      this.muted = Boolean(muted);
      if (this.muted) this.stop();
      this._saveSettings();
      return this.muted;
    }
  }

  return {
    OnlineNeuralTTS,
    TTS_VOICE_OPTIONS
  };
});

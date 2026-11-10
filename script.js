/* =========================================================
   Super Fun Tic-Tac-Toe - Tablet, PWA & Kids Edition Game Engine
   Featuring: Online AI Neural TTS (Xiaoxiao), Classic & Infinite 3-Piece Modes,
              Smart Coach Hints, SVG Winning Laser, Star Bank & Gashapon!
   ========================================================= */

// --- THEMES CONFIGURATION ---
const THEMES = {
  pets: {
    name: '萌宠王国',
    p1: { symbol: '🐶', name: '小狗' },
    p2: { symbol: '🐱', name: '小猫' }
  },
  space: {
    name: '星际太空',
    p1: { symbol: '🚀', name: '火箭' },
    p2: { symbol: '👽', name: '外星人' }
  },
  dino: {
    name: '恐龙探险',
    p1: { symbol: '🦖', name: '暴龙' },
    p2: { symbol: '🌋', name: '火山' }
  },
  magic: {
    name: '魔法独角兽',
    p1: { symbol: '🦄', name: '独角兽' },
    p2: { symbol: '🌈', name: '彩虹' }
  },
  sea: {
    name: '深海萌友',
    p1: { symbol: '🐳', name: '小蓝鲸' },
    p2: { symbol: '🦀', name: '小红蟹' }
  },
  sweet: {
    name: '甜蜜甜点',
    p1: { symbol: '🍦', name: '冰淇淋' },
    p2: { symbol: '🍩', name: '甜甜圈' }
  },
  classic: {
    name: '经典对决',
    p1: { symbol: '❌', name: '红叉(❌)' },
    p2: { symbol: '⭕', name: '蓝圈(⭕)' }
  }
};

// --- REWARD BADGES CONFIGURATION ---
const BADGES_CONFIG = [
  {
    id: 'first_win',
    emoji: '🎈',
    title: '初出茅庐',
    desc: '赢得第 1 场棋局胜利'
  },
  {
    id: 'streak_3',
    emoji: '🔥',
    title: '连胜小霸王',
    desc: '势如破竹达成 3 连胜'
  },
  {
    id: 'streak_5',
    emoji: '⚡',
    title: '无敌连胜王',
    desc: '所向披靡达成 5 连胜'
  },
  {
    id: 'bot_win',
    emoji: '🤖',
    title: '智斗小机灵',
    desc: '在单人模式战胜机器人'
  },
  {
    id: 'hard_bot',
    emoji: '🦉',
    title: '智慧小军师',
    desc: '击败大师级猫头鹰'
  },
  {
    id: 'infinite_win',
    emoji: '🌀',
    title: '灵动幻影师',
    desc: '在满3消1灵动模式获胜'
  },
  {
    id: 'star_20',
    emoji: '⭐',
    title: '闪耀收藏家',
    desc: '累计获得 20 颗星星'
  },
  {
    id: 'king_10',
    emoji: '👑',
    title: '棋盘大统领',
    desc: '累计获得 10 次棋局胜利'
  }
];

// --- GASHAPON COLLECTIBLE STICKERS (12 Cute Companions) ---
const GASHAPON_STICKERS = [
  { id: 'pet_trex', emoji: '🦖', name: '霸王龙大王', story: '嗷呜！我是霸王龙大王，最喜欢在棋盘正中间威风凛凛地守卫胜利！' },
  { id: 'pet_unicorn', emoji: '🦄', name: '星空独角兽', story: '闪耀彩虹魔法！我是星空独角兽，祝你每一局都好运连连！' },
  { id: 'pet_panda', emoji: '🐼', name: '功夫小熊猫', story: '嘿哈！我是爱吃竹子的功夫小熊猫，下棋可要沉着冷静哦！' },
  { id: 'pet_fox', emoji: '🦊', name: '智慧小狐狸', story: '机智如我！下棋的时候不仅要看自己的棋子，还要留意对手哦！' },
  { id: 'pet_whale', emoji: '🐳', name: '深海蓝鲸王', story: '哗啦啦！我是深海蓝鲸王，心胸宽广，赢了开心，输了也不气馁！' },
  { id: 'pet_lion', emoji: '🦁', name: '黄金狮子王', story: '勇敢冲锋！我是黄金狮子王，为你每一次精彩的落子喝彩！' },
  { id: 'pet_bunny', emoji: '🐰', name: '甜心垂耳兔', story: '蹦蹦跳跳！我是甜心垂耳兔，今天也要开开心心动脑筋呀！' },
  { id: 'pet_dragon', emoji: '🐲', name: '祥云小神龙', story: '呼风唤雨！我是祥云小神龙，乘着云朵陪你一起勇闯棋盘！' },
  { id: 'pet_owl', emoji: '🦉', name: '博士猫头鹰', story: '咕咕！我是博士猫头鹰，掌握角落和中心，你就是三子棋大师！' },
  { id: 'pet_penguin', emoji: '🐧', name: '极地小企鹅', story: '摇摇摆摆！我是极地小企鹅，最喜欢和你一起玩满三消一模式啦！' },
  { id: 'pet_koala', emoji: '🐨', name: '抱抱树袋熊', story: '暖暖拥抱！我是树袋熊，不管战局如何，你都是最棒的小棋手！' },
  { id: 'pet_astro', emoji: '🧑🚀', name: '星际宇航员', story: '飞向宇宙浩瀚无垠！让我们在星际棋盘上探索无限可能吧！' }
];

// --- PLAYER RANKS & TITLES ---
const RANKS = [
  { minStars: 0, title: '棋艺小萌芽', avatar: '🌱', nextStars: 10 },
  { minStars: 10, title: '探索小新星', avatar: '🥉', nextStars: 25 },
  { minStars: 25, title: '进阶小高手', avatar: '🥈', nextStars: 50 },
  { minStars: 50, title: '智慧小棋王', avatar: '🥇', nextStars: 100 },
  { minStars: 100, title: '终极棋圣', avatar: '👑', nextStars: 9999 }
];

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// --- WEB AUDIO SYNTHESIZER ---
class SoundController {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playPop(player) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    const baseFreq = player === 'X' ? 440 : 587.33;

    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playWinFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const startTime = now + idx * 0.12;
      const duration = idx === notes.length - 1 ? 0.45 : 0.15;

      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.28, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  playStarChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [880, 1174.66, 1318.51, 1760];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const startTime = now + idx * 0.08;
      const duration = 0.25;

      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  playGashaponRoll() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const seq = [392, 440, 493.88, 523.25, 587.33, 659.25, 783.99, 1046.5];
    const now = this.ctx.currentTime;
    seq.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.075;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.008, t + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.085);
    });
  }

  playTieSound() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.3);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }
}

// --- AI NEURAL NATURAL VOICE ANNOUNCER (WebOnlineTTS + WebNaturalTTS Fallback) ---
class VoiceAnnouncer {
  constructor() {
    this.enabled = true;
    this.prewarmed = false;
    this.onlineTts = null;
    this.naturalTts = null;

    if (typeof window !== 'undefined' && typeof window.OnlineNeuralTTS === 'function') {
      this.onlineTts = new window.OnlineNeuralTTS({
        endpoint: '/api/tts',
        fallbackEndpoint: 'https://kid-tic-tac-toe.pages.dev/api/tts',
        rate: '-2%',
        autoUnlock: true
      });
      this.enabled = !this.onlineTts.muted;
      this.naturalTts = this.onlineTts.offlineTts || null;
    } else if (typeof window !== 'undefined' && typeof window.NaturalTTS === 'function') {
      this.naturalTts = new window.NaturalTTS({
        lang: 'zh-CN',
        rate: 0.94,
        pitch: 1.0,
        volume: 1.0,
        filterEmojis: true,
        normalizeMath: true,
        cancelPrevious: true,
        autoUnlock: true
      });
    }
  }

  primeAudio() {
    if (this.onlineTts && typeof this.onlineTts.unlockAudio === 'function') {
      this.onlineTts.unlockAudio();
      if (!this.prewarmed) {
        this.prewarmed = true;
        this.onlineTts.prewarm([
          '好棋！电脑下好啦，该你啦！',
          '太棒啦！你战胜了电脑小伙伴，奖励三颗星星！',
          '势均力敌！你和电脑打成平手啦！',
          '电脑小伙伴获胜啦！别灰心，马上赢回来吧！',
          '新的一局开始，请你先下棋！',
          '新的一局开始，电脑先下好啦，轮到你啦！',
          '快看闪光格！下在这里就能直接连成三颗获胜啦！',
          '小心哦！对手快连成三颗了，快点闪光的位置堵住它！'
        ]);
      }
    } else if (this.naturalTts && typeof this.naturalTts.unlock === 'function') {
      this.naturalTts.unlock();
    }
  }

  getVoices() {
    if (this.onlineTts && typeof this.onlineTts.getVoices === 'function') {
      return this.onlineTts.getVoices();
    }
    return [
      {
        id: 'local',
        emoji: '📱',
        shortLabel: '离线',
        name: '本机自然语音',
        hint: '零流量 · 调用设备自带语音',
        sample: '你好呀，一起来下三子棋吧！'
      }
    ];
  }

  getActiveVoiceOption() {
    if (this.onlineTts && typeof this.onlineTts.getActiveVoiceOption === 'function') {
      return this.onlineTts.getActiveVoiceOption();
    }
    return this.getVoices()[0];
  }

  setVoice(voiceId) {
    if (this.onlineTts && typeof this.onlineTts.setVoice === 'function') {
      return this.onlineTts.setVoice(voiceId);
    }
    return this.getActiveVoiceOption();
  }

  cycleVoice() {
    if (this.onlineTts && typeof this.onlineTts.cycleVoice === 'function') {
      return this.onlineTts.cycleVoice(true);
    }
    return this.getActiveVoiceOption();
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    if (this.onlineTts && typeof this.onlineTts.setMuted === 'function') {
      this.onlineTts.setMuted(!this.enabled);
    } else if (!this.enabled) {
      this.stop();
    }
  }

  speak(text, priority = false) {
    if (!this.enabled || !text) return Promise.resolve();
    if (this.onlineTts) {
      return Promise.resolve(this.onlineTts.speak(text)).catch(() => {});
    }
    if (this.naturalTts) {
      return Promise.resolve(this.naturalTts.speak(text)).catch(() => {});
    }
    return Promise.resolve();
  }

  stop() {
    if (this.onlineTts) {
      this.onlineTts.stop();
    } else if (this.naturalTts) {
      this.naturalTts.stop();
    }
  }
}

// --- CONFETTI CANNON SYSTEM ---
class ConfettiCannon {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(count = 100) {
    const colors = ['#ff3366', '#0284c7', '#f59e0b', '#10b981', '#8b5cf6', '#f43f5e', '#ec4899'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 80,
        y: this.canvas.height * 0.45 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 15 - 5,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        gravity: 0.45,
        alpha: 1,
        shape: Math.random() > 0.4 ? 'circle' : 'rect'
      });
    }

    if (!this.animationId) {
      this.loop();
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.985;
      p.rotation += p.vRot;
      p.alpha -= 0.012;

      if (p.alpha <= 0 || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);

      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.loop());
    } else {
      this.animationId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// --- MAIN GAME CONTROLLER ---
class TicTacToeGame {
  constructor() {
    this.board = Array(9).fill(null);
    this.moveHistory = { X: [], O: [] }; // Used for Infinite 3-Piece sliding mode
    this.currentPlayer = 'X';
    this.gameActive = true;
    this.gameMode = 'ai';
    this.ruleMode = 'classic'; // 'classic' | 'infinite'
    this.firstTurnMode = 'player'; // 'player' | 'alternate' | 'bot'
    this.lastStarter = 'O';
    this.aiDifficulty = 'auto';
    this.currentThemeKey = 'pets';
    this.scores = { X: 0, O: 0, ties: 0 };
    this.isBotThinking = false;
    this.botMoveTimer = null;
    this.deferredInstallPrompt = null;
    this._pwaAutoPromptShown = false;
    this._toastTimer = null;
    this._lockedViewportWidth = 0;
    this._minObservedInnerHeight = 0;

    this.screenMode = 'normal';
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('screen') === 'normal') {
        this.screenMode = 'normal';
        localStorage.setItem('ttt_screen_mode', 'normal');
      } else {
        this.screenMode =
          localStorage.getItem('ttt_screen_mode') === 'fullscreen' ? 'fullscreen' : 'normal';
      }
    } catch (_) {
      this.screenMode = 'normal';
    }
    window.__tttAllowFullscreen = this.screenMode === 'fullscreen';

    // Load persistent reward data
    this.loadRewardsData();

    this.sound = new SoundController();
    this.voice = new VoiceAnnouncer();
    this.sound.enabled = this.voice.enabled;
    this.confetti = new ConfettiCannon('confettiCanvas');

    this.cacheDOMElements();
    this.renderVoiceOptionsGrid();
    this.bindEvents();
    this.syncSoundButtonUI();
    this.updateThemeUI();
    this.updateTurnUI();
    this.updateRewardsUI();
    this.updateDynamicDifficultyUI();
    this.initViewportAutoScale();
    this.initPWA();
  }

  loadRewardsData() {
    try {
      this.stars = parseInt(localStorage.getItem('ttt_stars') || '0', 10);
      const savedSpendable = localStorage.getItem('ttt_spendable_stars');
      this.spendableStars = savedSpendable !== null ? parseInt(savedSpendable, 10) : this.stars;
      this.streak = parseInt(localStorage.getItem('ttt_streak') || '0', 10);
      this.maxStreak = parseInt(localStorage.getItem('ttt_max_streak') || '0', 10);
      this.totalWins = parseInt(localStorage.getItem('ttt_total_wins') || '0', 10);

      const savedBadges = localStorage.getItem('ttt_unlocked_badges');
      this.unlockedBadges = savedBadges ? JSON.parse(savedBadges) : [];

      const savedStickers = localStorage.getItem('ttt_unlocked_stickers');
      this.unlockedStickers = savedStickers ? JSON.parse(savedStickers) : [];

      const savedThemes = localStorage.getItem('ttt_themes_used');
      this.themesUsed = savedThemes ? new Set(JSON.parse(savedThemes)) : new Set(['pets']);
    } catch (e) {
      this.stars = 0;
      this.spendableStars = 0;
      this.streak = 0;
      this.maxStreak = 0;
      this.totalWins = 0;
      this.unlockedBadges = [];
      this.unlockedStickers = [];
      this.themesUsed = new Set(['pets']);
    }
  }

  saveRewardsData() {
    try {
      localStorage.setItem('ttt_stars', this.stars.toString());
      localStorage.setItem('ttt_spendable_stars', this.spendableStars.toString());
      localStorage.setItem('ttt_streak', this.streak.toString());
      localStorage.setItem('ttt_max_streak', this.maxStreak.toString());
      localStorage.setItem('ttt_total_wins', this.totalWins.toString());
      localStorage.setItem('ttt_unlocked_badges', JSON.stringify(this.unlockedBadges));
      localStorage.setItem('ttt_unlocked_stickers', JSON.stringify(this.unlockedStickers));
      localStorage.setItem('ttt_themes_used', JSON.stringify(Array.from(this.themesUsed)));
    } catch (e) {
      console.warn('Storage saving failed', e);
    }
  }

  cacheDOMElements() {
    this.layoutContainer = document.getElementById('layoutContainer') || document.querySelector('.tablet-layout-container');
    this.cells = document.querySelectorAll('.cell');
    this.boardEl = document.getElementById('board');
    this.winLaserLine = document.getElementById('winLaserLine');
    this.statusBanner = document.getElementById('statusBanner');
    this.statusEmoji = document.getElementById('statusEmoji');
    this.statusText = document.getElementById('statusText');
    this.replayVoiceBtn = document.getElementById('replayVoiceBtn');

    // Header & Rewards
    this.ruleQuickOptions = document.querySelectorAll('.rule-pill-option');
    this.headerStarCount = document.getElementById('headerStarCount');
    this.rewardBtnLabel = document.getElementById('rewardBtnLabel');
    this.openRewardBtn = document.getElementById('openRewardBtn');
    this.headerInstallPwaBtn = document.getElementById('headerInstallPwaBtn');
    this.playerRankAvatar = document.getElementById('playerRankAvatar');
    this.playerRankTitle = document.getElementById('playerRankTitle');
    this.activeVoiceBadge = document.getElementById('activeVoiceBadge');
    this.streakText = document.getElementById('streakText');
    this.rankProgressBar = document.getElementById('rankProgressBar');
    this.rankProgressLabel = document.getElementById('rankProgressLabel');

    // Header Sound & Settings
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.soundIcon = document.getElementById('soundIcon');
    this.openSettingsBtn = document.getElementById('openSettingsBtn');

    // Scoreboard
    this.cardPlayerX = document.getElementById('cardPlayerX');
    this.cardPlayerO = document.getElementById('cardPlayerO');
    this.avatarXEl = document.getElementById('avatarX');
    this.avatarOEl = document.getElementById('avatarO');
    this.namePlayerXEl = document.getElementById('namePlayerX');
    this.namePlayerOEl = document.getElementById('namePlayerO');
    this.scoreXEl = document.getElementById('scoreX');
    this.scoreOEl = document.getElementById('scoreO');
    this.scoreTiesEl = document.getElementById('scoreTies');

    // Match Info Card & Coach Hint
    this.matchInfoIcon = document.getElementById('matchInfoIcon');
    this.matchInfoTitle = document.getElementById('matchInfoTitle');
    this.matchInfoDesc = document.getElementById('matchInfoDesc');
    this.hintCoachBtn = document.getElementById('hintCoachBtn');
    this.quickSettingsBtn = document.getElementById('quickSettingsBtn');

    // Sidebar Action Buttons
    this.resetRoundBtn = document.getElementById('resetRoundBtn');
    this.resetScoresBtn = document.getElementById('resetScoresBtn');

    // Settings Modal
    this.settingsModal = document.getElementById('settingsModal');
    this.closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
    this.settingsDoneBtn = document.getElementById('settingsDoneBtn');
    this.modePvPBtn = document.getElementById('modePvPBtn');
    this.modeAiBtn = document.getElementById('modeAiBtn');
    this.ruleCardBtns = document.querySelectorAll('.rule-card-btn');
    this.aiDifficultySection = document.getElementById('aiDifficultySection');
    this.diffButtons = document.querySelectorAll('.diff-btn-large');
    this.dynamicLevelTag = document.getElementById('dynamicLevelTag');
    this.dynamicStatusBar = document.getElementById('dynamicStatusBar');
    this.dynamicTierIcon = document.getElementById('dynamicTierIcon');
    this.dynamicTierHint = document.getElementById('dynamicTierHint');
    this.voiceChipsGrid = document.getElementById('voiceChipsGrid');
    this.testVoiceBtn = document.getElementById('testVoiceBtn');
    this.themeChips = document.querySelectorAll('.theme-card-btn');
    this.pwaInstallBtn = document.getElementById('pwaInstallBtn');
    this.fullscreenBtn = document.getElementById('fullscreenBtn');
    this.fullscreenIcon = document.getElementById('fullscreenIcon');
    this.fullscreenLabel = document.getElementById('fullscreenLabel');
    this.webapkFsNotice = document.getElementById('webapkFsNotice');
    this.openNormalBrowserBtn = document.getElementById('openNormalBrowserBtn');
    this.updateAppBtn = document.getElementById('updateAppBtn');
    this.firstTurnToggleBtn = document.getElementById('firstTurnToggleBtn');
    this.firstTurnLabel = document.getElementById('firstTurnLabel');

    // Reset Confirm Modal
    this.confirmResetModal = document.getElementById('confirmResetModal');
    this.cancelResetBtn = document.getElementById('cancelResetBtn');
    this.confirmResetActionBtn = document.getElementById('confirmResetActionBtn');

    // Win Modal
    this.resultModal = document.getElementById('resultModal');
    this.modalEmoji = document.getElementById('modalEmoji');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalSubtitle = document.getElementById('modalSubtitle');
    this.rewardGainBanner = document.getElementById('rewardGainBanner');
    this.rewardGainSub = document.getElementById('rewardGainSub');
    this.modalPlayAgainBtn = document.getElementById('modalPlayAgainBtn');

    // Reward, Gashapon & Badges Modal
    this.rewardModal = document.getElementById('rewardModal');
    this.closeRewardModalBtn = document.getElementById('closeRewardModalBtn');
    this.rewardCloseActionBtn = document.getElementById('rewardCloseActionBtn');
    this.rewardModalStars = document.getElementById('rewardModalStars');
    this.rewardModalWins = document.getElementById('rewardModalWins');
    this.rewardModalBadgesCount = document.getElementById('rewardModalBadgesCount');
    this.rewardModalStickersCount = document.getElementById('rewardModalStickersCount');
    this.rewardTabBtns = document.querySelectorAll('.reward-tab-btn');
    this.tabPanelGashapon = document.getElementById('tabPanelGashapon');
    this.tabPanelBadges = document.getElementById('tabPanelBadges');
    this.gashaponOrb = document.getElementById('gashaponOrb');
    this.gashaponMsg = document.getElementById('gashaponMsg');
    this.drawGashaponBtn = document.getElementById('drawGashaponBtn');
    this.stickersGrid = document.getElementById('stickersGrid');
    this.badgesGrid = document.getElementById('badgesGrid');
    this.starFlyContainer = document.getElementById('starFlyContainer');

    // PWA 1-Step Install Reminder Modal & Toast
    this.pwaInstallModal = document.getElementById('pwaInstallModal');
    this.closePwaModalBtn = document.getElementById('closePwaModalBtn');
    this.pwaModalStatusTip = document.getElementById('pwaModalStatusTip');
    this.pwaModalInstallBtn = document.getElementById('pwaModalInstallBtn');
    this.pwaModalDismissBtn = document.getElementById('pwaModalDismissBtn');
    this.appToast = document.getElementById('appToast');
  }

  initViewportAutoScale() {
    if (this.layoutContainer) {
      this.layoutContainer.style.transform = '';
    }
    this.applyScreenModeBodyClass();
    this.fitViewportScale(true);

    window.addEventListener('resize', () => {
      this.fitViewportScale(false);
    });
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.fitViewportScale(true), 180);
    });
  }

  fitViewportScale(forceReset = false) {
    const w = window.innerWidth || document.documentElement.clientWidth || 380;
    const h = window.innerHeight || document.documentElement.clientHeight || 680;
    const widthChangedSignificantly = Math.abs(w - this._lockedViewportWidth) > 45;

    if (forceReset || widthChangedSignificantly || !this._minObservedInnerHeight) {
      this._lockedViewportWidth = w;
      this._minObservedInnerHeight = h;
    } else if (h < this._minObservedInnerHeight) {
      // Record the smaller non-fullscreen height when system status/navigation bars are visible
      this._minObservedInnerHeight = h;
    }

    // In Non-Fullscreen mode ('normal'), NEVER expand --app-vh when innerHeight increases
    // (e.g., 2 seconds after exiting fullscreen when Android WebAPK hides system bars).
    let targetVh = h;
    if (this.screenMode !== 'fullscreen') {
      const baseH = this._minObservedInnerHeight || h;
      const screenH = window.screen && window.screen.height ? window.screen.height : h;
      const nonFsCap = baseH >= screenH - 20 ? Math.round(screenH - 56) : baseH;
      targetVh = Math.max(460, Math.min(baseH, nonFsCap));
    }

    document.documentElement.style.setProperty('--app-vh', `${targetVh}px`);
  }

  isDomFullscreen() {
    const doc = window.document;
    return Boolean(
      doc.fullscreenElement ||
        doc.mozFullScreenElement ||
        doc.webkitFullscreenElement ||
        doc.msFullscreenElement
    );
  }

  isForcedFullscreenWebAPK() {
    const inDisplayFs = Boolean(
      window.matchMedia && window.matchMedia('(display-mode: fullscreen)').matches
    );
    return inDisplayFs && !this.isDomFullscreen();
  }

  applyScreenModeBodyClass() {
    const isFs = this.screenMode === 'fullscreen';
    document.body.classList.toggle('mode-fullscreen', isFs);
    document.body.classList.toggle('mode-non-fullscreen', !isFs);
    if (this.fullscreenIcon) {
      this.fullscreenIcon.textContent = isFs ? '⛶' : '🗔';
    }
    if (this.fullscreenLabel) {
      this.fullscreenLabel.textContent = isFs
        ? '当前：全屏（点此设为非全屏）'
        : '当前：非全屏（点此进入全屏）';
    }
    if (this.fullscreenBtn) {
      this.fullscreenBtn.classList.toggle('fs-active-btn', isFs);
    }
    if (this.webapkFsNotice) {
      this.webapkFsNotice.classList.toggle(
        'hidden',
        !(this.isForcedFullscreenWebAPK() && !isFs)
      );
    }
  }

  isStandaloneMode() {
    return Boolean(
      (window.matchMedia &&
        (window.matchMedia('(display-mode: standalone)').matches ||
          window.matchMedia('(display-mode: fullscreen)').matches ||
          window.matchMedia('(display-mode: minimal-ui)').matches)) ||
      window.navigator.standalone === true ||
      window.location.search.includes('source=pwa')
    );
  }

  isIOSDevice() {
    const ua = navigator.userAgent || '';
    if (/iPad|iPhone|iPod/i.test(ua)) return true;
    if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true;
    return false;
  }

  showToast(message, durationMs = 2800) {
    if (!this.appToast) return;
    this.appToast.textContent = message;
    this.appToast.classList.remove('hidden');
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.appToast.classList.add('hidden');
    }, durationMs);
  }

  syncPwaModalUI(showFallbackTip = false) {
    if (!this.pwaModalStatusTip || !this.pwaModalInstallBtn) return;

    const hasNativePrompt = Boolean(this.deferredInstallPrompt || window.__deferredPwaPrompt);
    if (hasNativePrompt) {
      this.pwaModalStatusTip.hidden = false;
      this.pwaModalStatusTip.innerHTML = '🚀 <strong>已就绪：</strong>点击下方绿色按钮，即可<strong>一步添加</strong>到手机或平板桌面全屏畅玩！';
      this.pwaModalInstallBtn.innerHTML = '<span>📲 一步安装到桌面</span>';
      return;
    }

    if (this.isIOSDevice()) {
      this.pwaModalStatusTip.hidden = false;
      this.pwaModalStatusTip.innerHTML =
        '🍎 <strong>iPhone / iPad 快捷安装：</strong>点击浏览器栏的 <strong>【⎋ 分享】</strong> ➔ 选择 <strong>【➕ 添加到主屏幕】</strong>，即可生成全屏 App！';
      this.pwaModalInstallBtn.innerHTML = '<span>👌 我知道了，去试试</span>';
      return;
    }

    if (showFallbackTip) {
      this.pwaModalStatusTip.hidden = false;
      this.pwaModalStatusTip.innerHTML =
        '💡 若浏览器未直接弹出安装框，说明桌面可能已安装，或请点浏览器右上角/底部 <strong>【⋮ 菜单】➔【安装应用 / 添加到主屏幕】</strong> 即可一步完成！';
      this.pwaModalInstallBtn.innerHTML = '<span>📲 再试一次一步安装</span>';
    } else {
      this.pwaModalStatusTip.hidden = false;
      this.pwaModalStatusTip.innerHTML =
        '✨ <strong>推荐添加到桌面：</strong>全屏自动缩放免滚动，无浏览器地址栏干扰，断网也能离线玩！';
      this.pwaModalInstallBtn.innerHTML = '<span>📲 一步安装到桌面</span>';
    }
  }

  openPwaInstallModal(showFallbackTip = false) {
    if (this.isStandaloneMode() || !this.pwaInstallModal) return;
    this.syncPwaModalUI(showFallbackTip);
    this.pwaInstallModal.classList.remove('hidden');
  }

  dismissPwaInstallModal() {
    if (this.pwaInstallModal) {
      this.pwaInstallModal.classList.add('hidden');
    }
    try {
      sessionStorage.setItem('ttt_pwa_prompt_dismissed', 'true');
    } catch (_) {}
  }

  async triggerPWAInstall(fromModal = false) {
    if (this.isStandaloneMode()) {
      this.showToast('✅ 当前已经在桌面独立 App 模式下全屏运行啦！');
      return;
    }

    this.closeSettingsModal();

    let promptEvt = this.deferredInstallPrompt || window.__deferredPwaPrompt;

    // Wait briefly up to 450ms in case Service Worker just finished registering
    if (!promptEvt && !this.isIOSDevice()) {
      for (let i = 0; i < 5; i++) {
        await new Promise((r) => setTimeout(r, 90));
        promptEvt = this.deferredInstallPrompt || window.__deferredPwaPrompt;
        if (promptEvt) break;
      }
    }

    if (promptEvt) {
      try {
        promptEvt.prompt();
        const { outcome } = await promptEvt.userChoice;
        this.deferredInstallPrompt = null;
        window.__deferredPwaPrompt = null;
        if (outcome === 'accepted') {
          this.dismissPwaInstallModal();
          this.showToast('🎉 已成功将「儿童三子棋」安装到桌面！');
        }
      } catch (err) {
        console.warn('PWA install prompt error:', err);
      }
      return;
    }

    if (fromModal && this.isIOSDevice()) {
      this.dismissPwaInstallModal();
      return;
    }

    this.openPwaInstallModal(true);
  }

  initPWA() {
    if (window.__deferredPwaPrompt) {
      this.deferredInstallPrompt = window.__deferredPwaPrompt;
    }

    const markInstalled = () => {
      if (this.headerInstallPwaBtn) {
        this.headerInstallPwaBtn.style.display = 'none';
      }
      if (this.pwaInstallBtn) {
        this.pwaInstallBtn.textContent = '✅ 已安装为桌面全屏 App';
        this.pwaInstallBtn.disabled = true;
      }
      if (this.pwaInstallModal) {
        this.pwaInstallModal.classList.add('hidden');
      }
    };

    if (this.isStandaloneMode()) {
      markInstalled();
      return;
    }

    const onPromptCaptured = (e) => {
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
        this.deferredInstallPrompt = e;
        window.__deferredPwaPrompt = e;
      } else if (window.__deferredPwaPrompt) {
        this.deferredInstallPrompt = window.__deferredPwaPrompt;
      }

      this.syncPwaModalUI(false);

      if (!this.isStandaloneMode() && !this._pwaAutoPromptShown) {
        let dismissed = false;
        try {
          dismissed = sessionStorage.getItem('ttt_pwa_prompt_dismissed') === 'true';
        } catch (_) {}
        if (!dismissed) {
          this._pwaAutoPromptShown = true;
          this.openPwaInstallModal(false);
        }
      }
    };

    window.addEventListener('beforeinstallprompt', onPromptCaptured);
    window.addEventListener('pwa-prompt-ready', () => onPromptCaptured(null));

    if (this.deferredInstallPrompt) {
      onPromptCaptured(null);
    } else {
      // Automatically show the 1-step PWA install reminder when opening the web page
      setTimeout(() => {
        if (this.isStandaloneMode() || this._pwaAutoPromptShown) return;
        let dismissed = false;
        try {
          dismissed = sessionStorage.getItem('ttt_pwa_prompt_dismissed') === 'true';
        } catch (_) {}
        if (!dismissed) {
          this._pwaAutoPromptShown = true;
          this.openPwaInstallModal(false);
        }
      }, 450);
    }

    window.addEventListener('appinstalled', () => {
      this.deferredInstallPrompt = null;
      window.__deferredPwaPrompt = null;
      markInstalled();
      this.showToast('🎉 已成功安装「儿童三子棋」到桌面！');
    });
  }

  renderVoiceOptionsGrid() {
    if (!this.voiceChipsGrid) return;
    const voices = this.voice.getVoices();
    const active = this.voice.getActiveVoiceOption();
    this.voiceChipsGrid.innerHTML = '';

    voices.forEach((v) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `voice-chip-btn ${v.id === active.id ? 'active' : ''}`;
      btn.dataset.voiceId = v.id;
      btn.innerHTML = `
        <span class="voice-chip-emoji">${v.emoji}</span>
        <span class="voice-chip-info">
          <span class="voice-chip-name">${v.name}</span>
          <span class="voice-chip-sub">${v.shortLabel}</span>
        </span>
      `;
      btn.addEventListener('click', () => {
        this.sound.playClick();
        const chosen = this.voice.setVoice(v.id);
        this.updateVoiceUI();
        if (!this.voice.enabled) {
          this.toggleSound(true);
        }
        this.voice.speak(chosen.sample || `你好呀，我是${chosen.shortLabel}！`, true);
      });
      this.voiceChipsGrid.appendChild(btn);
    });

    this.updateVoiceUI();
  }

  updateVoiceUI() {
    const active = this.voice.getActiveVoiceOption();
    if (this.activeVoiceBadge) {
      this.activeVoiceBadge.textContent = `${active.emoji} ${active.shortLabel}`;
    }
    if (this.voiceChipsGrid) {
      this.voiceChipsGrid.querySelectorAll('.voice-chip-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.voiceId === active.id);
      });
    }
  }

  bindEvents() {
    // Cell clicks
    this.cells.forEach((cell) => {
      cell.addEventListener('click', (e) => this.handleCellClick(e));
    });

    // Quick Rule Mode Switcher in Header & Settings
    this.ruleQuickOptions.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.sound.playClick();
        this.setRuleMode(btn.dataset.rule);
      });
    });

    this.ruleCardBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.sound.playClick();
        this.setRuleMode(btn.dataset.rule);
      });
    });

    // Replay Voice Button in Banner
    if (this.replayVoiceBtn) {
      this.replayVoiceBtn.addEventListener('click', () => {
        this.voice.primeAudio();
        this.sound.playClick();
        if (!this.voice.enabled) {
          this.toggleSound(true);
        }
        this.voice.speak(this.statusText.textContent, true);
      });
    }

    // Active Voice Mini Badge quick cycle
    if (this.activeVoiceBadge) {
      this.activeVoiceBadge.addEventListener('click', () => {
        this.voice.primeAudio();
        this.sound.playClick();
        const next = this.voice.cycleVoice();
        this.updateVoiceUI();
        this.voice.speak(next.sample || `已切换为${next.shortLabel}语音！`, true);
      });
    }

    // Smart Coach Hint Button
    if (this.hintCoachBtn) {
      this.hintCoachBtn.addEventListener('click', () => {
        this.voice.primeAudio();
        this.sound.playClick();
        this.triggerSmartHint();
      });
    }

    // Theme selector (inside Settings Modal)
    this.themeChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        this.sound.playClick();
        this.setTheme(chip.dataset.theme);
      });
    });

    // Mode toggles
    this.modePvPBtn.addEventListener('click', () => this.setMode('pvp'));
    this.modeAiBtn.addEventListener('click', () => this.setMode('ai'));

    // Difficulty buttons
    this.diffButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.sound.playClick();
        this.setDifficulty(btn.dataset.diff);
      });
    });

    // Test Voice Button in Settings
    if (this.testVoiceBtn) {
      this.testVoiceBtn.addEventListener('click', () => {
        this.voice.primeAudio();
        this.sound.playClick();
        if (!this.voice.enabled) this.toggleSound(true);
        const active = this.voice.getActiveVoiceOption();
        this.voice.speak(active.sample || '你好呀，今天也要开开心心下三子棋哦！', true);
      });
    }

    // Sound toggle
    this.soundToggleBtn.addEventListener('click', () => this.toggleSound());

    // Fullscreen / Non-Fullscreen toggle (inside Settings Modal)
    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => {
        this.sound.playClick();
        this.toggleFullscreen();
      });
    }

    if (this.openNormalBrowserBtn) {
      this.openNormalBrowserBtn.addEventListener('click', () => {
        this.sound.playClick();
        this.escapeFullscreenWebAPK();
      });
    }

    const onFullscreenChange = () => {
      const doc = window.document;
      const inDomFs = this.isDomFullscreen();
      const cancelFullScreen =
        doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen;

      if (this.screenMode !== 'fullscreen' && inDomFs) {
        // User locked Non-Fullscreen mode: immediately block/exit any unexpected auto-fullscreen!
        window.__tttAllowFullscreen = false;
        if (cancelFullScreen) {
          cancelFullScreen.call(doc).catch(() => {});
        }
      } else if (this.screenMode === 'fullscreen' && !inDomFs) {
        // User exited fullscreen via system Back gesture or Esc: lock into Non-Fullscreen mode
        this.screenMode = 'normal';
        window.__tttAllowFullscreen = false;
        try {
          localStorage.setItem('ttt_screen_mode', 'normal');
        } catch (_) {}
      }

      this.applyScreenModeBodyClass();
      this.fitViewportScale(false);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);

    // Force Update / Clear Cache Button in Settings
    if (this.updateAppBtn) {
      this.updateAppBtn.addEventListener('click', async () => {
        this.sound.playWinFanfare();
        this.updateAppBtn.textContent = '⏳ 正在清理缓存并更新...';
        this.updateAppBtn.disabled = true;
        this.showToast('🚀 正在为您清理旧缓存并获取最新版本...');
        try {
          if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map((k) => caches.delete(k)));
          }
          if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            await Promise.all(regs.map((r) => r.update().catch(() => {})));
          }
        } catch (_) {}
        setTimeout(() => {
          const freshUrl = window.location.origin + window.location.pathname + '?v=' + Date.now();
          window.location.replace(freshUrl);
        }, 280);
      });
    }

    // First Turn Rule Toggle
    if (this.firstTurnToggleBtn) {
      this.firstTurnToggleBtn.addEventListener('click', () => {
        this.sound.playClick();
        const order = ['player', 'alternate', 'bot'];
        const labels = {
          player: '我方先手',
          alternate: '轮流先手',
          bot: '对手先手'
        };
        const idx = order.indexOf(this.firstTurnMode);
        this.firstTurnMode = order[(idx + 1) % order.length];
        this.firstTurnLabel.textContent = labels[this.firstTurnMode];
        this.voice.speak(`先手规则已设为${labels[this.firstTurnMode]}！`, true);
      });
    }

    // PWA 1-Step Install Triggers (Header Button, Settings Button, Auto Modal)
    if (this.headerInstallPwaBtn) {
      this.headerInstallPwaBtn.addEventListener('click', () => {
        this.sound.playClick();
        this.triggerPWAInstall(false);
      });
    }

    if (this.pwaInstallBtn) {
      this.pwaInstallBtn.addEventListener('click', () => {
        this.sound.playClick();
        this.triggerPWAInstall(false);
      });
    }

    if (this.pwaModalInstallBtn) {
      this.pwaModalInstallBtn.addEventListener('click', () => {
        this.sound.playClick();
        this.triggerPWAInstall(true);
      });
    }

    if (this.pwaModalDismissBtn) {
      this.pwaModalDismissBtn.addEventListener('click', () => {
        this.sound.playClick();
        this.dismissPwaInstallModal();
      });
    }

    if (this.closePwaModalBtn) {
      this.closePwaModalBtn.addEventListener('click', () => {
        this.sound.playClick();
        this.dismissPwaInstallModal();
      });
    }

    if (this.pwaInstallModal) {
      this.pwaInstallModal.addEventListener('click', (e) => {
        if (e.target === this.pwaInstallModal) {
          this.dismissPwaInstallModal();
        }
      });
    }

    // Settings Modal Triggers
    this.openSettingsBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.openSettingsModal();
    });

    this.quickSettingsBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.openSettingsModal();
    });

    this.closeSettingsModalBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.closeSettingsModal();
    });

    this.settingsDoneBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.closeSettingsModal();
      this.voice.speak('设置好啦，开始下棋！', true);
    });

    this.settingsModal.addEventListener('click', (e) => {
      if (e.target === this.settingsModal) {
        this.closeSettingsModal();
      }
    });

    // Reset Round button
    this.resetRoundBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.resetRound();
    });

    // Child-Safe Reset Scores button with confirmation
    this.resetScoresBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.confirmResetModal.classList.remove('hidden');
    });

    this.cancelResetBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.confirmResetModal.classList.add('hidden');
    });

    this.confirmResetModal.addEventListener('click', (e) => {
      if (e.target === this.confirmResetModal) {
        this.confirmResetModal.classList.add('hidden');
      }
    });

    this.confirmResetActionBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.confirmResetModal.classList.add('hidden');
      this.resetScores();
      this.voice.speak('比分已清零，开始新的对局！', true);
    });

    // Win Modal
    this.modalPlayAgainBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.closeResultModal();
      this.resetRound();
    });

    // Reward & Gashapon Modal
    this.openRewardBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.openRewardModal();
    });

    this.closeRewardModalBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.closeRewardModal();
    });

    this.rewardCloseActionBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.closeRewardModal();
    });

    this.rewardTabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.sound.playClick();
        const tab = btn.dataset.rewardTab;
        this.rewardTabBtns.forEach((b) => b.classList.toggle('active', b === btn));
        this.tabPanelGashapon.classList.toggle('hidden', tab !== 'gashapon');
        this.tabPanelBadges.classList.toggle('hidden', tab !== 'badges');
      });
    });

    if (this.drawGashaponBtn) {
      this.drawGashaponBtn.addEventListener('click', () => {
        this.drawGashaponPrize();
      });
    }
  }

  get theme() {
    return THEMES[this.currentThemeKey];
  }

  get currentRank() {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (this.stars >= RANKS[i].minStars) {
        return RANKS[i];
      }
    }
    return RANKS[0];
  }

  toggleFullscreen() {
    const doc = window.document;
    const docEl = doc.documentElement;
    const requestFullScreen =
      docEl.requestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.webkitRequestFullScreen ||
      docEl.msRequestFullscreen;
    const cancelFullScreen =
      doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;

    const nextMode = this.screenMode === 'fullscreen' ? 'normal' : 'fullscreen';
    this.screenMode = nextMode;
    window.__tttAllowFullscreen = nextMode === 'fullscreen';
    try {
      localStorage.setItem('ttt_screen_mode', nextMode);
    } catch (_) {}

    if (nextMode === 'normal') {
      // Switch to Non-Fullscreen mode and lock height so it never jumps back to fullscreen
      if (this.isDomFullscreen() && cancelFullScreen) {
        cancelFullScreen.call(doc).catch(() => {});
      }
      this.applyScreenModeBodyClass();
      this.fitViewportScale(false);
      this.showToast('🗔 已锁定为「非全屏模式」，不会再自动跳回全屏！');
      this.voice.speak('已锁定为非全屏模式！', true);
    } else {
      // Explicitly enter Fullscreen mode
      this.applyScreenModeBodyClass();
      this.fitViewportScale(true);
      if (requestFullScreen && !this.isDomFullscreen()) {
        requestFullScreen.call(docEl).catch(() => {});
      }
      this.showToast('⛶ 已开启「全屏模式」');
      this.voice.speak('已开启全屏模式！', true);
    }
  }

  escapeFullscreenWebAPK() {
    this.screenMode = 'normal';
    window.__tttAllowFullscreen = false;
    try {
      localStorage.setItem('ttt_screen_mode', 'normal');
    } catch (_) {}

    const targetUrl =
      window.location.origin +
      window.location.pathname +
      '?screen=normal&v=' +
      Date.now();
    const isAndroid = /Android/i.test(navigator.userAgent || '');

    if (isAndroid) {
      const noProto = targetUrl.replace(/^https?:\/\//i, '');
      const intentUrl =
        'intent://' +
        noProto +
        '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' +
        encodeURIComponent(targetUrl) +
        ';end';
      window.location.href = intentUrl;
    } else {
      window.open(targetUrl, '_blank');
    }
  }

  setRuleMode(rule) {
    if (this.ruleMode === rule) return;
    this.ruleMode = rule === 'infinite' ? 'infinite' : 'classic';

    this.ruleQuickOptions.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.rule === this.ruleMode);
    });
    this.ruleCardBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.rule === this.ruleMode);
    });

    this.updateMatchInfoUI();
    this.resetRound(true);

    if (this.ruleMode === 'infinite') {
      this.voice.speak('开启满三消一灵动模式！每人最多保留三颗棋子，下第四颗时最早的一颗会消失，永不平局哦！', true);
    } else {
      this.voice.speak('切换为经典三子棋模式！', true);
    }
  }

  openSettingsModal() {
    this.applyScreenModeBodyClass();
    this.settingsModal.classList.remove('hidden');
    this.voice.speak('进入游戏设置，挑选你喜欢的角色、语音和玩法！', true);
  }

  closeSettingsModal() {
    this.settingsModal.classList.add('hidden');
  }

  setTheme(themeKey) {
    if (!THEMES[themeKey]) return;
    this.currentThemeKey = themeKey;
    this.themesUsed.add(themeKey);
    this.saveRewardsData();
    this.checkBadges();

    this.themeChips.forEach((chip) => {
      chip.classList.toggle('active', chip.dataset.theme === themeKey);
    });

    this.boardEl.className = `board theme-${themeKey}`;

    this.updateThemeUI();
    this.updateBoardSymbols();
    this.updateTurnUI();
    this.voice.speak(`换成${this.theme.name}主题啦！`, true);
  }

  updateThemeUI() {
    const t = this.theme;
    this.avatarXEl.textContent = t.p1.symbol;
    this.avatarOEl.textContent = t.p2.symbol;

    if (this.gameMode === 'ai') {
      this.namePlayerXEl.textContent = `你 (${t.p1.name})`;
      this.namePlayerOEl.textContent = `电脑 (${t.p2.name})`;
    } else {
      this.namePlayerXEl.textContent = `玩家1 (${t.p1.name})`;
      this.namePlayerOEl.textContent = `玩家2 (${t.p2.name})`;
    }

    this.updateMatchInfoUI();
  }

  updateMatchInfoUI() {
    const t = this.theme;
    const ruleTag = this.ruleMode === 'infinite' ? '满3消1' : '经典';
    if (this.gameMode === 'ai') {
      const effective = this.getEffectiveAiDifficulty();
      const diffNames = { easy: '贪玩小猴', medium: '机灵小狐', hard: '猫头鹰' };
      const diffIcons = { easy: '🐒', medium: '🦊', hard: '🦉' };

      this.matchInfoIcon.textContent = diffIcons[effective] || '🤖';
      this.matchInfoTitle.textContent = `${diffNames[effective]} · ${ruleTag}模式`;
      if (this.ruleMode === 'infinite') {
        this.matchInfoDesc.textContent = '每人最多留3子，下第4子消第1子！';
      } else if (this.aiDifficulty === 'auto') {
        this.matchInfoDesc.textContent = '动态进阶中 · 连胜自动升级变强！';
      } else {
        this.matchInfoDesc.textContent = `已锁定为${diffNames[effective]}陪练`;
      }
    } else {
      this.matchInfoIcon.textContent = '👥';
      this.matchInfoTitle.textContent = `双人对战 · ${ruleTag}模式`;
      this.matchInfoDesc.textContent = `${t.p1.name} vs ${t.p2.name}，轮流点格子！`;
    }
  }

  updateBoardSymbols() {
    const t = this.theme;
    this.cells.forEach((cell, idx) => {
      const val = this.board[idx];
      cell.classList.remove('cell-x', 'cell-o');
      if (val === 'X') {
        cell.textContent = t.p1.symbol;
        cell.classList.add('cell-x');
      } else if (val === 'O') {
        cell.textContent = t.p2.symbol;
        cell.classList.add('cell-o');
      }
    });
  }

  setMode(mode) {
    if (this.gameMode === mode) return;
    this.sound.playClick();
    this.gameMode = mode;

    this.modePvPBtn.classList.toggle('active', mode === 'pvp');
    this.modeAiBtn.classList.toggle('active', mode === 'ai');

    if (mode === 'ai') {
      this.aiDifficultySection.style.display = 'flex';
      this.updateDynamicDifficultyUI();
      this.voice.speak('开启单人挑战，和电脑小伙伴下棋！', true);
    } else {
      this.aiDifficultySection.style.display = 'none';
      this.voice.speak('开启双人对战，和小伙伴一起下棋！', true);
    }

    this.updateThemeUI();
    this.resetRound(true);
  }

  setDifficulty(diff) {
    this.aiDifficulty = diff;
    this.diffButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.diff === diff);
    });
    if (diff === 'auto') {
      this.voice.speak('开启动态进阶模式，小伙伴会随你的连胜一起成长升级！', true);
    } else if (diff === 'easy') {
      this.voice.speak('已锁定为贪玩小猴简单模式！', true);
    } else if (diff === 'medium') {
      this.voice.speak('已锁定为机灵小狐中等模式！', true);
    } else if (diff === 'hard') {
      this.voice.speak('已挑战猫头鹰大师模式！', true);
    }
    this.updateDynamicDifficultyUI();
    this.resetRound(true);
  }

  syncSoundButtonUI() {
    if (this.sound.enabled) {
      this.soundToggleBtn.classList.remove('muted');
      this.soundIcon.textContent = '🔊';
    } else {
      this.soundToggleBtn.classList.add('muted');
      this.soundIcon.textContent = '🔇';
    }
  }

  toggleSound(forceState) {
    const nextState = typeof forceState === 'boolean' ? forceState : !this.sound.enabled;
    this.sound.enabled = nextState;
    this.voice.setEnabled(nextState);
    this.syncSoundButtonUI();

    if (nextState) {
      this.sound.init();
      this.sound.playClick();
      this.voice.speak('AI真人语音与音效已开启！', true);
    }
  }

  clearCoachHints() {
    this.cells.forEach((cell) => cell.classList.remove('coach-hint-cell'));
  }

  triggerSmartHint() {
    if (!this.gameActive || this.isBotThinking) return;
    this.clearCoachHints();

    const player = this.currentPlayer;
    const opponent = player === 'X' ? 'O' : 'X';
    const available = this.board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    if (available.length === 0) return;

    // 1. Check immediate winning move for currentPlayer
    for (const idx of available) {
      const simBoard = this.simulateBoardAfterMove(this.board, player, idx);
      if (this.checkWin(simBoard, player)) {
        this.highlightCoachCell(idx);
        this.voice.speak('快看闪光格！下在这里就能直接连成三颗获胜啦！', true);
        return;
      }
    }

    // 2. Check immediate threat from opponent
    for (const idx of available) {
      const simBoard = this.simulateBoardAfterMove(this.board, opponent, idx);
      if (this.checkWin(simBoard, opponent)) {
        this.highlightCoachCell(idx);
        this.voice.speak('小心哦！对手快连成三颗了，快点闪光的位置堵住它！', true);
        return;
      }
    }

    // 3. Center cell if available
    if (available.includes(4)) {
      this.highlightCoachCell(4);
      this.voice.speak('占领正中间的黄金格，四面八方都更容易连成线哦！', true);
      return;
    }

    // 4. Corner or strategic move
    const corners = [0, 2, 6, 8].filter((c) => available.includes(c));
    const bestIdx = corners.length > 0 ? corners[0] : available[0];
    this.highlightCoachCell(bestIdx);
    this.voice.speak('试试闪光的角落格，悄悄布下双面夹击阵法吧！', true);
  }

  highlightCoachCell(idx) {
    if (this.cells[idx]) {
      this.cells[idx].classList.add('coach-hint-cell');
    }
  }

  simulateBoardAfterMove(boardArr, player, targetIdx) {
    const copy = [...boardArr];
    if (this.ruleMode === 'infinite' && this.moveHistory[player].length >= 3) {
      const oldestIdx = this.moveHistory[player][0];
      copy[oldestIdx] = null;
    }
    copy[targetIdx] = player;
    return copy;
  }

  handleCellClick(e) {
    this.voice.primeAudio();
    const index = parseInt(e.currentTarget.dataset.index, 10);

    if (this.board[index] !== null || !this.gameActive || this.isBotThinking) {
      return;
    }

    this.makeMove(index, this.currentPlayer);

    if (this.gameActive && this.gameMode === 'ai' && this.currentPlayer === 'O') {
      this.triggerBotMove();
    }
  }

  makeMove(index, player, options = {}) {
    this.clearCoachHints();

    // Infinite 3-Piece Mode: If player already has 3 pieces on board, vanish the oldest one!
    if (this.ruleMode === 'infinite' && this.moveHistory[player].length >= 3) {
      const oldestIdx = this.moveHistory[player].shift();
      this.board[oldestIdx] = null;
      const oldCell = this.cells[oldestIdx];
      oldCell.textContent = '';
      oldCell.className = 'cell';
    }

    this.board[index] = player;
    this.moveHistory[player].push(index);

    const cell = this.cells[index];
    const symbol = player === 'X' ? this.theme.p1.symbol : this.theme.p2.symbol;

    cell.textContent = symbol;
    cell.removeAttribute('data-preview');
    cell.classList.remove('cell-x', 'cell-o', 'fading-next');
    cell.classList.add('filled', 'pop-in', player === 'X' ? 'cell-x' : 'cell-o');
    this.sound.playPop(player);

    const winCombo = this.checkWin(this.board, player);
    if (winCombo) {
      this.clearFadingMarkers();
      this.handleWin(player, winCombo);
      return;
    }

    if (this.checkTie(this.board)) {
      this.handleTie();
      return;
    }

    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    this.updateFadingPieceMarkers();
    this.updateTurnUI();

    if (options.silent) return;

    // Non-overlapping narration for moves:
    // In AI mode, when player X places a piece and the game continues, the bot moves ~500ms later.
    // Do NOT start a separate speech on X's half-turn so it never overlaps with the bot's move speech!
    if (this.gameMode === 'ai') {
      if (player === 'O') {
        if (options.isOpeningBotMove) {
          this.voice.speak('新的一局开始，电脑先下好啦，轮到你啦！');
        } else {
          this.voice.speak('好棋！电脑下好啦，该你啦！');
        }
      }
    } else {
      const nextP = this.currentPlayer === 'X' ? '玩家1' : '玩家2';
      this.voice.speak(`轮到${nextP}啦！`);
    }
  }

  clearFadingMarkers() {
    this.cells.forEach((cell) => cell.classList.remove('fading-next'));
  }

  updateFadingPieceMarkers() {
    this.clearFadingMarkers();
    if (this.ruleMode !== 'infinite' || !this.gameActive) return;

    // Highlight the oldest piece of whichever player is about to move (if they have 3 pieces)
    ['X', 'O'].forEach((p) => {
      if (this.moveHistory[p].length >= 3) {
        const oldestIdx = this.moveHistory[p][0];
        if (this.cells[oldestIdx] && p === this.currentPlayer) {
          this.cells[oldestIdx].classList.add('fading-next');
        }
      }
    });
  }

  triggerBotMove(options = {}) {
    if (this.botMoveTimer) {
      clearTimeout(this.botMoveTimer);
      this.botMoveTimer = null;
    }
    this.isBotThinking = true;
    const botName = this.theme.p2.name;
    this.statusBanner.className = 'status-banner bot-thinking';
    this.statusEmoji.textContent = '🤔';
    this.statusText.textContent = `${botName} 正在动脑筋思考中...`;

    this.botMoveTimer = setTimeout(() => {
      this.botMoveTimer = null;
      if (!this.gameActive) {
        this.isBotThinking = false;
        return;
      }

      const botIndex = this.calculateBestMove();
      this.isBotThinking = false;

      if (botIndex !== -1 && botIndex !== undefined) {
        this.makeMove(botIndex, 'O', options);
      }
    }, 520);
  }

  getEffectiveAiDifficulty() {
    if (this.aiDifficulty !== 'auto') {
      return this.aiDifficulty;
    }
    if (this.streak >= 2) return 'hard';
    if (this.streak === 1) return 'medium';
    return 'easy';
  }

  updateDynamicDifficultyUI(showVoiceAnnouncement = false) {
    if (!this.dynamicStatusBar || !this.dynamicTierIcon || !this.dynamicTierHint) return;

    if (this.aiDifficulty === 'auto') {
      const effective = this.getEffectiveAiDifficulty();
      if (this.dynamicLevelTag) {
        if (effective === 'hard') this.dynamicLevelTag.textContent = '🔥 战力: 大师';
        else if (effective === 'medium') this.dynamicLevelTag.textContent = '⚡ 战力: 中等';
        else this.dynamicLevelTag.textContent = '🌱 战力: 简单';
      }

      if (effective === 'hard') {
        this.dynamicTierIcon.textContent = '🦉';
        this.dynamicTierHint.textContent = `达成 ${this.streak} 连胜！猫头鹰使出大师战力，看谁能三连！🔥`;
        if (showVoiceAnnouncement) {
          this.voice.speak('太厉害啦！连胜升级，猫头鹰使出大师全力啦！', true);
        }
      } else if (effective === 'medium') {
        this.dynamicTierIcon.textContent = '🦊';
        this.dynamicTierHint.textContent = '达成 1 连胜！升级为机灵小狐，开始认真防守啦！';
        if (showVoiceAnnouncement) {
          this.voice.speak('恭喜连胜！电脑升级为机灵小狐，开始认真动脑筋啦！', true);
        }
      } else {
        this.dynamicTierIcon.textContent = '🐒';
        this.dynamicTierHint.textContent = '当前伙伴：贪玩小猴陪练中，连胜即可升级为机灵小狐！';
        if (showVoiceAnnouncement && this.streak === 0) {
          this.voice.speak('别灰心！电脑小伙伴放慢了脚步，再来一局赢回来！', true);
        }
      }
    } else {
      const names = { easy: '贪玩小猴 (简单)', medium: '机灵小狐 (中等)', hard: '猫头鹰 (大师)' };
      const icons = { easy: '🐒', medium: '🦊', hard: '🦉' };
      if (this.dynamicLevelTag) this.dynamicLevelTag.textContent = '🔒 固定模式';
      this.dynamicTierIcon.textContent = icons[this.aiDifficulty] || '🔒';
      this.dynamicTierHint.textContent = `已锁定模式：${names[this.aiDifficulty] || ''}（不随战绩变动）`;
    }

    this.updateMatchInfoUI();
  }

  calculateBestMove() {
    const available = this.board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    if (available.length === 0) return -1;

    const diff = this.getEffectiveAiDifficulty();

    // EASY: 85% playful random moves
    if (diff === 'easy') {
      if (Math.random() < 0.85) {
        return available[Math.floor(Math.random() * available.length)];
      }
    }

    // 1. Check if bot can win immediately (accounting for infinite mode piece disappearance)
    for (const idx of available) {
      const sim = this.simulateBoardAfterMove(this.board, 'O', idx);
      if (this.checkWin(sim, 'O')) {
        return idx;
      }
    }

    // 2. Check if bot needs to block player X from winning immediately
    for (const idx of available) {
      const sim = this.simulateBoardAfterMove(this.board, 'X', idx);
      if (this.checkWin(sim, 'X')) {
        if (diff === 'medium' && Math.random() < 0.15) {
          continue;
        }
        return idx;
      }
    }

    // MEDIUM or Infinite heuristic
    if (diff === 'medium' || this.ruleMode === 'infinite') {
      if (available.includes(4) && Math.random() > 0.25) return 4;
      const corners = [0, 2, 6, 8].filter((c) => available.includes(c));
      if (corners.length > 0 && Math.random() > 0.35) {
        return corners[Math.floor(Math.random() * corners.length)];
      }
      return available[Math.floor(Math.random() * available.length)];
    }

    // HARD (Classic mode): Minimax
    return this.minimaxBestMove();
  }

  minimaxBestMove() {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) {
        this.board[i] = 'O';
        const score = this.minimax(this.board, 0, false);
        this.board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  minimax(board, depth, isMaximizing) {
    if (this.checkWin(board, 'O')) return 10 - depth;
    if (this.checkWin(board, 'X')) return depth - 10;
    if (this.checkTie(board)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          const score = this.minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          const score = this.minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  checkWin(board, player) {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (board[a] === player && board[b] === player && board[c] === player) {
        return combo;
      }
    }
    return null;
  }

  checkTie(board) {
    return board.every((cell) => cell !== null);
  }

  drawWinLaser(combo) {
    if (!this.winLaserLine || !combo || combo.length < 3) return;
    const startIdx = combo[0];
    const endIdx = combo[2];

    const c1 = { x: (startIdx % 3) * 100 + 50, y: Math.floor(startIdx / 3) * 100 + 50 };
    const c2 = { x: (endIdx % 3) * 100 + 50, y: Math.floor(endIdx / 3) * 100 + 50 };

    // Extend 18 units outward along the line vector for a dramatic sweep
    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = (dx / len) * 18;
    const uy = (dy / len) * 18;

    this.winLaserLine.setAttribute('x1', String(c1.x - ux));
    this.winLaserLine.setAttribute('y1', String(c1.y - uy));
    this.winLaserLine.setAttribute('x2', String(c2.x + ux));
    this.winLaserLine.setAttribute('y2', String(c2.y + uy));
    this.winLaserLine.classList.add('active');
  }

  hideWinLaser() {
    if (this.winLaserLine) {
      this.winLaserLine.classList.remove('active');
    }
  }

  handleWin(winner, combo) {
    this.gameActive = false;
    this.scores[winner]++;
    this.updateScoreboard();

    combo.forEach((idx) => {
      this.cells[idx].classList.add('winning-cell');
    });
    this.drawWinLaser(combo);

    const isP1 = winner === 'X';
    const winnerChar = isP1 ? this.theme.p1 : this.theme.p2;

    let starsEarned = 3;
    let bonusText = '获胜奖励！';

    if (this.gameMode === 'ai') {
      if (isP1) {
        const prevDiff = this.getEffectiveAiDifficulty();
        this.totalWins++;
        this.streak++;
        if (this.streak > this.maxStreak) this.maxStreak = this.streak;
        const newDiff = this.getEffectiveAiDifficulty();
        const diffUpgraded = this.aiDifficulty === 'auto' && prevDiff !== newDiff;

        if (this.streak >= 2) {
          starsEarned += 2;
          bonusText = `连胜奖励！🔥 达成 ${this.streak} 连胜！`;
        }

        if (diffUpgraded) {
          const newName = newDiff === 'hard' ? '猫头鹰 (大师)' : '机灵小狐 (中等)';
          bonusText = `战力进阶！🔥 电脑小伙伴升级为【${newName}】！`;
        }

        this.unlockBadge('bot_win');
        if (this.getEffectiveAiDifficulty() === 'hard') {
          this.unlockBadge('hard_bot');
        }
        if (this.ruleMode === 'infinite') {
          this.unlockBadge('infinite_win');
        }

        this.stars += starsEarned;
        this.spendableStars += starsEarned;
        this.checkBadges();
        this.saveRewardsData();
        this.updateRewardsUI();
        this.updateDynamicDifficultyUI(false);

        this.sound.playWinFanfare();
        setTimeout(() => this.sound.playStarChime(), 400);
        this.confetti.burst(130);
        if (diffUpgraded) {
          const newName = newDiff === 'hard' ? '猫头鹰大师' : '机灵小狐';
          this.voice.speak(`太棒啦！达成连胜，电脑小伙伴自动升级为${newName}啦！`, true);
        } else {
          this.voice.speak('太棒啦！你战胜了电脑小伙伴，奖励三颗星星！', true);
        }

        this.statusEmoji.textContent = '🏆';
        this.statusText.textContent = '🎉 太棒啦！你战胜了电脑小伙伴！';

        this.spawnFlyingStars(starsEarned);

        setTimeout(() => {
          this.modalEmoji.textContent = '👑';
          this.modalTitle.textContent = '🎉 你赢啦！太棒了！';
          this.modalSubtitle.textContent = `恭喜你机智战胜了电脑（${this.theme.p2.name}）！连成三颗一排！`;
          this.rewardGainBanner.querySelector('.gain-stars').textContent = `⭐ +${starsEarned} 颗星星`;
          this.rewardGainSub.textContent = bonusText;
          this.resultModal.classList.remove('hidden');
        }, 750);
      } else {
        const prevDiff = this.getEffectiveAiDifficulty();
        this.streak = 0;
        starsEarned = 1;
        bonusText = '努力挑战奖励！不要气馁哦！';
        const newDiff = this.getEffectiveAiDifficulty();
        const diffDowngraded = this.aiDifficulty === 'auto' && prevDiff !== newDiff;

        if (diffDowngraded) {
          bonusText = '贴心调整：小伙伴放慢了难度，马上赢回来！';
        }

        this.stars += starsEarned;
        this.spendableStars += starsEarned;
        this.checkBadges();
        this.saveRewardsData();
        this.updateRewardsUI();
        this.updateDynamicDifficultyUI(false);

        this.sound.playTieSound();
        if (diffDowngraded) {
          this.voice.speak('别灰心！电脑小伙伴放慢了脚步，再来一局赢回来吧！', true);
        } else {
          this.voice.speak('电脑小伙伴获胜啦！别灰心，马上赢回来吧！', true);
        }
        this.statusEmoji.textContent = '🤖';
        this.statusText.textContent = `🤖 电脑（${this.theme.p2.name}）获胜！点击再来一局赢回来！`;

        this.spawnFlyingStars(1);

        setTimeout(() => {
          this.modalEmoji.textContent = '🤖';
          this.modalTitle.textContent = '🤖 电脑小伙伴获胜啦！';
          this.modalSubtitle.textContent = '电脑这次抢先连成了三排！差一点点就赢了，马上赢回来吧！';
          this.rewardGainBanner.querySelector('.gain-stars').textContent = '⭐ +1 颗星星';
          this.rewardGainSub.textContent = bonusText;
          this.resultModal.classList.remove('hidden');
        }, 750);
      }
    } else {
      if (isP1) {
        this.totalWins++;
        this.streak++;
        if (this.streak > this.maxStreak) this.maxStreak = this.streak;
        if (this.streak >= 2) {
          starsEarned += 2;
          bonusText = `连胜奖励！🔥 达成 ${this.streak} 连胜！`;
        }
      } else {
        this.streak = 0;
      }

      if (this.ruleMode === 'infinite') {
        this.unlockBadge('infinite_win');
      }

      this.stars += starsEarned;
      this.spendableStars += starsEarned;
      this.checkBadges();
      this.saveRewardsData();
      this.updateRewardsUI();

      this.sound.playWinFanfare();
      setTimeout(() => this.sound.playStarChime(), 400);
      this.confetti.burst(120);

      const pLabel = isP1 ? '玩家 1' : '玩家 2';
      this.voice.speak(`恭喜${pLabel}获胜！连成三颗一排！`, true);
      this.statusEmoji.textContent = '🏆';
      this.statusText.textContent = `🎉 恭喜！${pLabel}（${winnerChar.name}）获胜！`;

      this.spawnFlyingStars(starsEarned);

      setTimeout(() => {
        this.modalEmoji.textContent = winnerChar.symbol;
        this.modalTitle.textContent = `🎉 ${pLabel} 获胜啦！`;
        this.modalSubtitle.textContent = `恭喜 ${pLabel}（${winnerChar.name}）连成三排！实力超强！`;
        this.rewardGainBanner.querySelector('.gain-stars').textContent = `⭐ +${starsEarned} 颗星星`;
        this.rewardGainSub.textContent = bonusText;
        this.resultModal.classList.remove('hidden');
      }, 750);
    }
  }

  handleTie() {
    this.gameActive = false;
    this.scores.ties++;
    this.updateScoreboard();

    this.stars += 1;
    this.spendableStars += 1;
    this.checkBadges();
    this.saveRewardsData();
    this.updateRewardsUI();

    this.sound.playTieSound();
    this.statusEmoji.textContent = '🤝';

    if (this.gameMode === 'ai') {
      this.voice.speak('势均力敌！你和电脑打成平手啦！', true);
      this.statusText.textContent = '🤝 你和电脑打成平手！棋逢对手！';
      setTimeout(() => {
        this.modalEmoji.textContent = '🤝';
        this.modalTitle.textContent = '🤝 握手言和！平局！';
        this.modalSubtitle.textContent = '你和电脑小伙伴旗鼓相当！试试顶部的「⚡满3消1」模式，永不平局哦！';
        this.rewardGainBanner.querySelector('.gain-stars').textContent = '⭐ +1 颗星星';
        this.rewardGainSub.textContent = '平局鼓励奖！准备好下一场决战了吗？';
        this.resultModal.classList.remove('hidden');
      }, 600);
    } else {
      this.voice.speak('势均力敌，打成平手啦！', true);
      this.statusText.textContent = '🤝 两位小朋友打成平手！棋逢对手！';
      setTimeout(() => {
        this.modalEmoji.textContent = '🤝';
        this.modalTitle.textContent = '🤝 势均力敌！打成平局！';
        this.modalSubtitle.textContent = '双方实力相当！可以试试「⚡满3消1」模式分出高下！';
        this.rewardGainBanner.querySelector('.gain-stars').textContent = '⭐ +1 颗星星';
        this.rewardGainSub.textContent = '参与鼓励奖！准备好下一场决战了吗？';
        this.resultModal.classList.remove('hidden');
      }, 600);
    }

    this.spawnFlyingStars(1);
  }

  checkBadges() {
    if (this.totalWins >= 1) this.unlockBadge('first_win');
    if (this.streak >= 3 || this.maxStreak >= 3) this.unlockBadge('streak_3');
    if (this.streak >= 5 || this.maxStreak >= 5) this.unlockBadge('streak_5');
    if (this.stars >= 20) this.unlockBadge('star_20');
    if (this.totalWins >= 10) this.unlockBadge('king_10');
  }

  unlockBadge(badgeId) {
    if (!this.unlockedBadges.includes(badgeId)) {
      this.unlockedBadges.push(badgeId);
      this.saveRewardsData();
    }
  }

  updateRewardsUI() {
    this.headerStarCount.textContent = this.spendableStars;
    if (this.spendableStars >= 5) {
      this.rewardBtnLabel.textContent = '可抽扭蛋 🎰';
    } else if (this.stars === 0) {
      this.rewardBtnLabel.textContent = '去赢星星！🎁';
    } else {
      this.rewardBtnLabel.textContent = '奖励馆 🎁';
    }

    this.streakText.textContent = `连胜 ${this.streak} 🔥`;

    const rank = this.currentRank;
    this.playerRankAvatar.textContent = rank.avatar;
    this.playerRankTitle.textContent = rank.title;

    if (rank.nextStars === 9999) {
      this.rankProgressBar.style.width = '100%';
      this.rankProgressLabel.textContent = `已登顶至尊勋位！累计 ${this.stars} ⭐`;
    } else {
      const prevMin = rank.minStars;
      const nextTarget = rank.nextStars;
      const progressPercent = Math.min(
        100,
        Math.max(0, ((this.stars - prevMin) / (nextTarget - prevMin)) * 100)
      );
      this.rankProgressBar.style.width = `${progressPercent}%`;
      this.rankProgressLabel.textContent = `累计 ${this.stars} / ${nextTarget} 颗星升级称号`;
    }
  }

  spawnFlyingStars(count = 3) {
    const starBtnRect = this.openRewardBtn.getBoundingClientRect();
    const targetX = starBtnRect.left + starBtnRect.width / 2;
    const targetY = starBtnRect.top + starBtnRect.height / 2;

    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'flying-star';
      star.textContent = '⭐';

      const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 80;
      const startY = window.innerHeight / 2 + (Math.random() - 0.5) * 80;

      star.style.left = `${startX}px`;
      star.style.top = `${startY}px`;

      this.starFlyContainer.appendChild(star);

      star.animate(
        [
          { transform: 'translate(0, 0) scale(1.6)', opacity: 1 },
          {
            transform: `translate(${targetX - startX}px, ${targetY - startY}px) scale(0.6)`,
            opacity: 0.9
          },
          {
            transform: `translate(${targetX - startX}px, ${targetY - startY}px) scale(0)`,
            opacity: 0
          }
        ],
        {
          duration: 750 + i * 120,
          easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
          fill: 'forwards'
        }
      );

      setTimeout(() => {
        star.remove();
      }, 950 + i * 120);
    }
  }

  openRewardModal() {
    this.voice.speak('欢迎来到奖励与扭蛋乐园！', true);
    this.renderRewardModalContents();
    this.rewardModal.classList.remove('hidden');
  }

  renderRewardModalContents() {
    this.rewardModalStars.textContent = this.spendableStars;
    this.rewardModalWins.textContent = this.totalWins;
    this.rewardModalBadgesCount.textContent = `${this.unlockedBadges.length} / ${BADGES_CONFIG.length}`;
    if (this.rewardModalStickersCount) {
      this.rewardModalStickersCount.textContent = `${this.unlockedStickers.length} / ${GASHAPON_STICKERS.length}`;
    }

    if (this.drawGashaponBtn) {
      const allCollected = this.unlockedStickers.length >= GASHAPON_STICKERS.length;
      if (allCollected) {
        this.drawGashaponBtn.disabled = true;
        this.drawGashaponBtn.textContent = '👑 已集齐全部 12 款萌宠伙伴！';
      } else if (this.spendableStars < 5) {
        this.drawGashaponBtn.disabled = true;
        this.drawGashaponBtn.textContent = `⭐ 还差 ${5 - this.spendableStars} 颗星星就能扭蛋啦！`;
      } else {
        this.drawGashaponBtn.disabled = false;
        this.drawGashaponBtn.textContent = '🎰 花 5 颗 ⭐ 扭一次盲盒！';
      }
    }

    // Render Gashapon Stickers Grid
    if (this.stickersGrid) {
      this.stickersGrid.innerHTML = '';
      GASHAPON_STICKERS.forEach((item) => {
        const isUnlocked = this.unlockedStickers.includes(item.id);
        const card = document.createElement('div');
        card.className = `sticker-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
          <div class="sticker-emoji">${isUnlocked ? item.emoji : '❓'}</div>
          <div class="sticker-name">${isUnlocked ? item.name : '神秘伙伴'}</div>
        `;
        card.addEventListener('click', () => {
          this.sound.playClick();
          if (isUnlocked) {
            this.voice.speak(item.story, true);
          } else {
            this.voice.speak('这个神秘萌宠还在扭蛋机里等着你呢，快去下棋赢星星吧！', true);
          }
        });
        this.stickersGrid.appendChild(card);
      });
    }

    // Render Badges List
    this.badgesGrid.innerHTML = '';
    BADGES_CONFIG.forEach((badge) => {
      const isUnlocked = this.unlockedBadges.includes(badge.id);
      const card = document.createElement('div');
      card.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;

      card.innerHTML = `
        <div class="badge-emoji">${isUnlocked ? badge.emoji : '🔒'}</div>
        <div class="badge-title">${badge.title}</div>
        <div class="badge-desc">${isUnlocked ? badge.desc : '未解锁：' + badge.desc}</div>
      `;

      card.addEventListener('click', () => {
        this.sound.playClick();
        if (isUnlocked) {
          this.voice.speak(`这是${badge.title}勋章！${badge.desc}！`, true);
        } else {
          this.voice.speak(`这个勋章还未解锁，解锁条件：${badge.desc}，继续加油哦！`, true);
        }
      });

      this.badgesGrid.appendChild(card);
    });
  }

  drawGashaponPrize() {
    if (this.spendableStars < 5) return;
    const lockedPool = GASHAPON_STICKERS.filter((s) => !this.unlockedStickers.includes(s.id));
    if (lockedPool.length === 0) return;

    this.spendableStars -= 5;
    this.drawGashaponBtn.disabled = true;
    this.gashaponOrb.textContent = '🔮';
    this.gashaponOrb.classList.add('rolling');
    this.gashaponMsg.textContent = '咕噜咕噜... 扭蛋机正在旋转中！';
    this.sound.playGashaponRoll();

    setTimeout(() => {
      this.gashaponOrb.classList.remove('rolling');
      const prize = lockedPool[Math.floor(Math.random() * lockedPool.length)];
      this.unlockedStickers.push(prize.id);
      this.saveRewardsData();
      this.updateRewardsUI();

      this.gashaponOrb.textContent = prize.emoji;
      this.gashaponMsg.textContent = `🎉 恭喜扭出新伙伴：【${prize.name}】！`;
      this.sound.playWinFanfare();
      this.confetti.burst(80);
      this.voice.speak(`哇！恭喜你扭出了${prize.name}！${prize.story}`, true);

      this.renderRewardModalContents();
    }, 680);
  }

  closeRewardModal() {
    this.rewardModal.classList.add('hidden');
  }

  updateTurnUI() {
    const isP1 = this.currentPlayer === 'X';
    const char = isP1 ? this.theme.p1 : this.theme.p2;

    this.cardPlayerX.classList.toggle('active', isP1);
    this.cardPlayerO.classList.toggle('active', !isP1);

    const nextSymbol = isP1 ? this.theme.p1.symbol : this.theme.p2.symbol;
    this.cells.forEach((cell) => {
      if (!cell.classList.contains('filled')) {
        cell.setAttribute('data-preview', nextSymbol);
      } else {
        cell.removeAttribute('data-preview');
      }
    });

    this.statusBanner.className = 'status-banner';

    if (this.gameMode === 'ai') {
      if (isP1) {
        this.statusBanner.classList.add('turn-p1');
        this.statusText.textContent = `轮到 你（${char.name}）下棋啦！请点击格子！`;
        this.statusEmoji.textContent = char.symbol;
      } else {
        this.statusBanner.classList.add('bot-thinking');
        this.statusText.textContent = `电脑（${char.name}）正在动脑筋思考中...`;
        this.statusEmoji.textContent = '🤔';
      }
    } else {
      if (isP1) {
        this.statusBanner.classList.add('turn-p1');
      } else {
        this.statusBanner.classList.add('turn-p2');
      }
      const pLabel = isP1 ? '玩家 1' : '玩家 2';
      this.statusText.textContent = `轮到 ${pLabel}（${char.name}）啦！请选格子！`;
      this.statusEmoji.textContent = char.symbol;
    }
  }

  updateScoreboard() {
    this.scoreXEl.textContent = this.scores.X;
    this.scoreOEl.textContent = this.scores.O;
    this.scoreTiesEl.textContent = this.scores.ties;
  }

  resetRound(isSilent = false) {
    if (this.botMoveTimer) {
      clearTimeout(this.botMoveTimer);
      this.botMoveTimer = null;
    }
    this.board.fill(null);
    this.moveHistory = { X: [], O: [] };
    this.gameActive = true;
    this.isBotThinking = false;
    this.hideWinLaser();
    this.clearCoachHints();

    // Determine who starts based on firstTurnMode
    if (this.firstTurnMode === 'bot') {
      this.currentPlayer = 'O';
    } else if (this.firstTurnMode === 'alternate') {
      this.currentPlayer = this.lastStarter === 'X' ? 'O' : 'X';
    } else {
      this.currentPlayer = 'X';
    }
    this.lastStarter = this.currentPlayer;

    this.cells.forEach((cell) => {
      cell.textContent = '';
      cell.className = 'cell';
    });

    this.updateTurnUI();
    this.fitViewportScale();

    if (this.gameMode === 'ai' && this.currentPlayer === 'O') {
      this.triggerBotMove({ isOpeningBotMove: true, silent: isSilent });
      return;
    }

    if (!isSilent) {
      if (this.gameMode === 'ai') {
        this.voice.speak('新的一局开始，请你先下棋！', true);
      } else {
        const starterLabel = this.currentPlayer === 'X' ? '玩家1' : '玩家2';
        this.voice.speak(`新的一局开始，${starterLabel}请下棋！`, true);
      }
    }
  }

  resetScores() {
    this.scores = { X: 0, O: 0, ties: 0 };
    this.updateScoreboard();
    this.resetRound(true);
  }

  closeResultModal() {
    this.resultModal.classList.add('hidden');
  }
}

// Start game when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.game = new TicTacToeGame();
});

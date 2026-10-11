/* =========================================================
   Super Fun Tic-Tac-Toe - Tablet & Kids Edition Game Engine
   Featuring: Tablet Optimization, Star Bank & Reward Badges!
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
  sweet: {
    name: '甜蜜甜点',
    p1: { symbol: '🍦', name: '冰淇淋' },
    p2: { symbol: '🍩', name: '甜甜圈' }
  },
  sea: {
    name: '深海萌友',
    p1: { symbol: '🐳', name: '小蓝鲸' },
    p2: { symbol: '🦀', name: '小红蟹' }
  },
  classic: {
    name: '经典 X vs O',
    p1: { symbol: 'X', name: '红方(X)' },
    p2: { symbol: 'O', name: '蓝方(O)' }
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
    desc: '击败大师级智慧猫头鹰'
  },
  {
    id: 'theme_fan',
    emoji: '🎨',
    title: '百变换装达人',
    desc: '体验 3 种不同角色主题'
  },
  {
    id: 'star_20',
    emoji: '⭐',
    title: '闪耀收藏家',
    desc: '星星罐累计达到 20 颗星星'
  },
  {
    id: 'king_10',
    emoji: '👑',
    title: '棋盘大统领',
    desc: '累计获得 10 次棋局胜利'
  }
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
      this.ctx.resume();
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

// --- KIDS VOICE ANNOUNCER (Web Speech API) ---
class VoiceAnnouncer {
  constructor() {
    this.enabled = true;
    this.synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.voice = null;
    this.hasInteracted = false;
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const findVoice = () => {
      const voices = this.synth.getVoices();
      // Look for natural Chinese Mandarin voice
      this.voice = voices.find(v => v.lang === 'zh-CN' || v.lang === 'zh_CN') ||
                   voices.find(v => v.lang.startsWith('zh') || v.lang.includes('cmn')) || null;
    };
    findVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = findVoice;
    }
  }

  primeAudio() {
    if (!this.hasInteracted && this.synth) {
      this.hasInteracted = true;
      try {
        const dummy = new SpeechSynthesisUtterance('');
        dummy.volume = 0;
        this.synth.speak(dummy);
      } catch (e) {}
    }
  }

  speak(text, priority = false) {
    if (!this.enabled || !this.synth) return;
    try {
      this.initVoices();
      if (priority) {
        this.synth.cancel();
      }
      const utter = new SpeechSynthesisUtterance(text);
      if (this.voice) {
        utter.voice = this.voice;
      }
      utter.lang = 'zh-CN';
      utter.rate = 1.05; // Lively, clear speech speed for kids
      utter.pitch = 1.25; // Cheerful friendly pitch
      utter.volume = 1;

      if (this.synth.paused) {
        this.synth.resume();
      }
      this.synth.speak(utter);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
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
    const colors = ['#ff4081', '#00b4d8', '#ffd166', '#06d6a0', '#9d4edd', '#ff9f1c'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: this.canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 15 - 5,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        shape: Math.random() > 0.5 ? 'circle' : 'rect',
        opacity: 1
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
      p.vy += 0.42;
      p.vx *= 0.985;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.007;

      if (p.opacity <= 0 || p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillStyle = p.color;

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
    this.currentPlayer = 'X';
    this.gameActive = true;
    this.gameMode = 'ai';
    this.aiDifficulty = 'auto';
    this.currentThemeKey = 'pets';
    this.scores = { X: 0, O: 0, ties: 0 };
    this.isBotThinking = false;

    // Load persistent reward data
    this.loadRewardsData();

    this.sound = new SoundController();
    this.voice = new VoiceAnnouncer();
    this.confetti = new ConfettiCannon('confettiCanvas');

    this.cacheDOMElements();
    this.bindEvents();
    this.updateThemeUI();
    this.updateTurnUI();
    this.updateRewardsUI();
    this.updateDynamicDifficultyUI();
  }

  loadRewardsData() {
    try {
      this.stars = parseInt(localStorage.getItem('ttt_stars') || '0', 10);
      this.streak = parseInt(localStorage.getItem('ttt_streak') || '0', 10);
      this.maxStreak = parseInt(localStorage.getItem('ttt_max_streak') || '0', 10);
      this.totalWins = parseInt(localStorage.getItem('ttt_total_wins') || '0', 10);
      
      const savedBadges = localStorage.getItem('ttt_unlocked_badges');
      this.unlockedBadges = savedBadges ? JSON.parse(savedBadges) : [];

      const savedThemes = localStorage.getItem('ttt_themes_used');
      this.themesUsed = savedThemes ? new Set(JSON.parse(savedThemes)) : new Set(['pets']);
    } catch (e) {
      this.stars = 0;
      this.streak = 0;
      this.maxStreak = 0;
      this.totalWins = 0;
      this.unlockedBadges = [];
      this.themesUsed = new Set(['pets']);
    }
  }

  saveRewardsData() {
    try {
      localStorage.setItem('ttt_stars', this.stars.toString());
      localStorage.setItem('ttt_streak', this.streak.toString());
      localStorage.setItem('ttt_max_streak', this.maxStreak.toString());
      localStorage.setItem('ttt_total_wins', this.totalWins.toString());
      localStorage.setItem('ttt_unlocked_badges', JSON.stringify(this.unlockedBadges));
      localStorage.setItem('ttt_themes_used', JSON.stringify(Array.from(this.themesUsed)));
    } catch (e) {
      console.warn('Storage saving failed', e);
    }
  }

  cacheDOMElements() {
    this.cells = document.querySelectorAll('.cell');
    this.boardEl = document.getElementById('board');
    this.statusBanner = document.getElementById('statusBanner');
    this.statusEmoji = document.getElementById('statusEmoji');
    this.statusText = document.getElementById('statusText');

    // Header & Rewards
    this.headerStarCount = document.getElementById('headerStarCount');
    this.openRewardBtn = document.getElementById('openRewardBtn');
    this.playerRankAvatar = document.getElementById('playerRankAvatar');
    this.playerRankTitle = document.getElementById('playerRankTitle');
    this.streakText = document.getElementById('streakText');
    this.rankProgressBar = document.getElementById('rankProgressBar');
    this.rankProgressLabel = document.getElementById('rankProgressLabel');

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

    // Controls
    this.themeChips = document.querySelectorAll('.theme-chip');
    this.modePvPBtn = document.getElementById('modePvPBtn');
    this.modeAiBtn = document.getElementById('modeAiBtn');
    this.aiDifficultyRow = document.getElementById('aiDifficultyRow');
    this.pvpTipRow = document.getElementById('pvpTipRow');
    this.diffButtons = document.querySelectorAll('.diff-btn');
    this.dynamicLevelTag = document.getElementById('dynamicLevelTag');
    this.dynamicStatusBar = document.getElementById('dynamicStatusBar');
    this.dynamicTierIcon = document.getElementById('dynamicTierIcon');
    this.dynamicTierHint = document.getElementById('dynamicTierHint');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.soundIcon = document.getElementById('soundIcon');
    this.soundText = document.getElementById('soundText');
    this.resetRoundBtn = document.getElementById('resetRoundBtn');
    this.resetScoresBtn = document.getElementById('resetScoresBtn');

    // Win Modal
    this.resultModal = document.getElementById('resultModal');
    this.modalEmoji = document.getElementById('modalEmoji');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalSubtitle = document.getElementById('modalSubtitle');
    this.rewardGainBanner = document.getElementById('rewardGainBanner');
    this.rewardGainSub = document.getElementById('rewardGainSub');
    this.modalPlayAgainBtn = document.getElementById('modalPlayAgainBtn');

    // Reward Modal
    this.rewardModal = document.getElementById('rewardModal');
    this.closeRewardModalBtn = document.getElementById('closeRewardModalBtn');
    this.rewardCloseActionBtn = document.getElementById('rewardCloseActionBtn');
    this.rewardModalStars = document.getElementById('rewardModalStars');
    this.rewardModalWins = document.getElementById('rewardModalWins');
    this.rewardModalBadgesCount = document.getElementById('rewardModalBadgesCount');
    this.badgesGrid = document.getElementById('badgesGrid');
    this.starFlyContainer = document.getElementById('starFlyContainer');
  }

  bindEvents() {
    // Cell clicks
    this.cells.forEach(cell => {
      cell.addEventListener('click', (e) => this.handleCellClick(e));
    });

    // Theme selector
    this.themeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.sound.playClick();
        this.setTheme(chip.dataset.theme);
      });
    });

    // Mode toggles
    this.modePvPBtn.addEventListener('click', () => this.setMode('pvp'));
    this.modeAiBtn.addEventListener('click', () => this.setMode('ai'));

    // Difficulty buttons
    this.diffButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.sound.playClick();
        this.setDifficulty(btn.dataset.diff);
      });
    });

    // Sound toggle
    this.soundToggleBtn.addEventListener('click', () => this.toggleSound());

    // Reset buttons
    this.resetRoundBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.resetRound();
    });

    this.resetScoresBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.resetScores();
    });

    // Modals
    this.modalPlayAgainBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.closeResultModal();
      this.resetRound();
    });

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

  setTheme(themeKey) {
    if (!THEMES[themeKey]) return;
    this.currentThemeKey = themeKey;
    this.themesUsed.add(themeKey);
    this.saveRewardsData();
    this.checkBadges();

    this.themeChips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.theme === themeKey);
    });

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
      this.aiDifficultyRow.classList.remove('hidden');
      if (this.pvpTipRow) this.pvpTipRow.classList.add('hidden');
      this.updateDynamicDifficultyUI();
      this.voice.speak('开启单人挑战，和电脑小伙伴下棋！', true);
    } else {
      this.aiDifficultyRow.classList.add('hidden');
      if (this.pvpTipRow) this.pvpTipRow.classList.remove('hidden');
      this.voice.speak('开启双人对战，和小伙伴一起下棋！', true);
    }

    this.updateThemeUI();
    this.resetRound();
  }

  setDifficulty(diff) {
    this.aiDifficulty = diff;
    this.diffButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.diff === diff);
    });
    if (diff === 'auto') {
      this.voice.speak('开启动态进阶模式，小伙伴会随你的连胜一起成长升级！', true);
    } else if (diff === 'easy') {
      this.voice.speak('已锁定为贪玩小猴简单模式！', true);
    } else if (diff === 'medium') {
      this.voice.speak('已锁定为机灵小狐中等模式！', true);
    } else if (diff === 'hard') {
      this.voice.speak('已挑战智慧猫头鹰大师模式！', true);
    }
    this.updateDynamicDifficultyUI();
    this.resetRound();
  }

  toggleSound() {
    this.sound.enabled = !this.sound.enabled;
    this.voice.enabled = this.sound.enabled;
    if (this.sound.enabled) {
      this.sound.init();
      this.sound.playClick();
      this.soundToggleBtn.classList.remove('muted');
      this.soundIcon.textContent = '🔊';
      this.soundText.textContent = '语音 开';
      this.voice.speak('语音与音效已开启！', true);
    } else {
      this.voice.stop();
      this.soundToggleBtn.classList.add('muted');
      this.soundIcon.textContent = '🔇';
      this.soundText.textContent = '语音 关';
    }
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

  makeMove(index, player) {
    this.board[index] = player;
    const cell = this.cells[index];
    const symbol = player === 'X' ? this.theme.p1.symbol : this.theme.p2.symbol;

    cell.textContent = symbol;
    cell.classList.remove('cell-x', 'cell-o');
    cell.classList.add('filled', 'pop-in', player === 'X' ? 'cell-x' : 'cell-o');
    this.sound.playPop(player);

    const winCombo = this.checkWin(this.board, player);
    if (winCombo) {
      this.handleWin(player, winCombo);
      return;
    }

    if (this.checkTie(this.board)) {
      this.handleTie();
      return;
    }

    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    this.updateTurnUI();

    // Friendly narration for moves
    if (this.gameMode === 'ai') {
      if (player === 'X') {
        this.voice.speak('好棋！轮到电脑动脑筋啦！');
      } else {
        this.voice.speak('电脑下好啦，该你啦！');
      }
    } else {
      const nextP = this.currentPlayer === 'X' ? '玩家1' : '玩家2';
      this.voice.speak(`轮到${nextP}啦！`);
    }
  }

  triggerBotMove() {
    this.isBotThinking = true;
    const botName = this.theme.p2.name;
    this.statusBanner.classList.remove('turn-p1', 'turn-p2');
    this.statusBanner.classList.add('bot-thinking');
    this.statusEmoji.textContent = '🤔';
    this.statusText.textContent = `${botName} 正在动脑筋思考中...`;

    setTimeout(() => {
      if (!this.gameActive) {
        this.isBotThinking = false;
        return;
      }

      const botIndex = this.calculateBestMove();
      this.isBotThinking = false;

      if (botIndex !== -1 && botIndex !== undefined) {
        this.makeMove(botIndex, 'O');
      }
    }, 450);
  }

  getEffectiveAiDifficulty() {
    if (this.aiDifficulty !== 'auto') {
      return this.aiDifficulty;
    }
    // Dynamic difficulty calculation based on current streak:
    // streak 0: easy (Monkey) - gentle, lets child win easily
    // streak 1: medium (Fox) - starts blocking lines, challenges child
    // streak >= 2: hard (Owl) - master minimax play
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
        this.dynamicTierHint.textContent = `达成 ${this.streak} 连胜！大师猫头鹰使出全力，看谁能连成三颗！🔥`;
        if (showVoiceAnnouncement) {
          this.voice.speak('太厉害啦！连胜升级，猫头鹰使出大师全力啦！', true);
        }
      } else if (effective === 'medium') {
        this.dynamicTierIcon.textContent = '🦊';
        this.dynamicTierHint.textContent = `达成 1 连胜！小伙伴升级为机灵小狐，开始认真防守啦！`;
        if (showVoiceAnnouncement) {
          this.voice.speak('恭喜连胜！电脑升级为机灵小狐，开始认真动脑筋啦！', true);
        }
      } else {
        this.dynamicTierIcon.textContent = '🐒';
        this.dynamicTierHint.textContent = '当前为呆萌小猴陪练中，赢得本局将升级为机灵小狐！';
        if (showVoiceAnnouncement && this.streak === 0) {
          this.voice.speak('别灰心！电脑小伙伴放慢了脚步，再来一局赢回来！', true);
        }
      }
    } else {
      const names = { easy: '贪玩小猴 (简单)', medium: '机灵小狐 (中等)', hard: '智慧猫头鹰 (大师)' };
      const icons = { easy: '🐒', medium: '🦊', hard: '🦉' };
      if (this.dynamicLevelTag) this.dynamicLevelTag.textContent = '🔒 固定模式';
      this.dynamicTierIcon.textContent = icons[this.aiDifficulty] || '🔒';
      this.dynamicTierHint.textContent = `已锁定模式：${names[this.aiDifficulty] || ''}（不随战绩变动）`;
    }
  }

  calculateBestMove() {
    const available = this.board
      .map((val, idx) => (val === null ? idx : null))
      .filter(val => val !== null);

    if (available.length === 0) return -1;

    const diff = this.getEffectiveAiDifficulty();

    // EASY: 85% silly moves, 15% smart move
    if (diff === 'easy') {
      if (Math.random() < 0.85) {
        return available[Math.floor(Math.random() * available.length)];
      }
    }

    // Check if bot can win
    for (const idx of available) {
      const copy = [...this.board];
      copy[idx] = 'O';
      if (this.checkWin(copy, 'O')) {
        return idx;
      }
    }

    // Check if bot needs to block opponent
    for (const idx of available) {
      const copy = [...this.board];
      copy[idx] = 'X';
      if (this.checkWin(copy, 'X')) {
        // In medium mode, 85% chance to block, 15% slip
        if (diff === 'medium' && Math.random() < 0.15) {
          continue;
        }
        return idx;
      }
    }

    // MEDIUM:
    if (diff === 'medium') {
      if (available.includes(4) && Math.random() > 0.3) return 4;
      return available[Math.floor(Math.random() * available.length)];
    }

    // HARD: Minimax
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
    return board.every(cell => cell !== null);
  }

  handleWin(winner, combo) {
    this.gameActive = false;
    this.scores[winner]++;
    this.updateScoreboard();

    combo.forEach(idx => {
      this.cells[idx].classList.add('winning-cell');
    });

    const isP1 = winner === 'X';
    const winnerChar = isP1 ? this.theme.p1 : this.theme.p2;

    let starsEarned = 3;
    let bonusText = '获胜奖励！';

    if (this.gameMode === 'ai') {
      if (isP1) {
        // Player beats computer!
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
          const newName = newDiff === 'hard' ? '智慧猫头鹰 (大师)' : '机灵小狐 (中等)';
          bonusText = `战力进阶！🔥 电脑小伙伴升级为【${newName}】！`;
        }

        this.unlockBadge('bot_win');
        if (this.getEffectiveAiDifficulty() === 'hard') {
          this.unlockBadge('hard_bot');
        }

        this.stars += starsEarned;
        this.checkBadges();
        this.saveRewardsData();
        this.updateRewardsUI();
        this.updateDynamicDifficultyUI(false);

        this.sound.playWinFanfare();
        setTimeout(() => this.sound.playStarChime(), 400);
        this.confetti.burst(130);
        if (diffUpgraded) {
          const newName = newDiff === 'hard' ? '智慧猫头鹰大师' : '机灵小狐';
          this.voice.speak(`太棒啦！达成连胜，电脑小伙伴自动升级为${newName}啦！`, true);
        } else {
          this.voice.speak('太棒啦！你战胜了电脑小伙伴，奖励三颗星星！', true);
        }

        this.statusEmoji.textContent = '🏆';
        this.statusText.textContent = `🎉 太棒啦！你战胜了电脑小伙伴！`;

        this.spawnFlyingStars(starsEarned);

        setTimeout(() => {
          this.modalEmoji.textContent = '👑';
          this.modalTitle.textContent = '🎉 你赢啦！太棒了！';
          this.modalSubtitle.textContent = `恭喜你机智战胜了电脑（${this.theme.p2.name}）！连成三颗一排！`;
          this.rewardGainBanner.querySelector('.gain-stars').textContent = `⭐ +${starsEarned} 颗星星`;
          this.rewardGainSub.textContent = bonusText;
          this.resultModal.classList.remove('hidden');
        }, 700);

      } else {
        // Computer wins!
        const prevDiff = this.getEffectiveAiDifficulty();
        this.streak = 0;
        starsEarned = 1; // Encouragement reward
        bonusText = '努力挑战奖励！不要气馁哦！';
        const newDiff = this.getEffectiveAiDifficulty();
        const diffDowngraded = this.aiDifficulty === 'auto' && prevDiff !== newDiff;

        if (diffDowngraded) {
          bonusText = '贴心调整：小伙伴放慢了难度，马上赢回来！';
        }

        this.stars += starsEarned;
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
          this.modalSubtitle.textContent = `电脑这次抢先连成了三排！差一点点就赢了，马上赢回来吧！`;
          this.rewardGainBanner.querySelector('.gain-stars').textContent = `⭐ +1 颗星星`;
          this.rewardGainSub.textContent = bonusText;
          this.resultModal.classList.remove('hidden');
        }, 700);
      }
    } else {
      // 2 Players Mode
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

      this.stars += starsEarned;
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
      }, 700);
    }
  }

  handleTie() {
    this.gameActive = false;
    this.scores.ties++;
    this.updateScoreboard();

    this.stars += 1;
    this.checkBadges();
    this.saveRewardsData();
    this.updateRewardsUI();

    this.sound.playTieSound();
    this.statusEmoji.textContent = '🤝';

    if (this.gameMode === 'ai') {
      this.voice.speak('势均力敌！你和电脑打成平手啦！', true);
      this.statusText.textContent = "🤝 你和电脑打成平手！棋逢对手！";
      setTimeout(() => {
        this.modalEmoji.textContent = '🤝';
        this.modalTitle.textContent = "🤝 握手言和！平局！";
        this.modalSubtitle.textContent = "你和电脑小伙伴旗鼓相当，动脑筋很厉害！";
        this.rewardGainBanner.querySelector('.gain-stars').textContent = "⭐ +1 颗星星";
        this.rewardGainSub.textContent = "平局鼓励奖！准备好下一场决战了吗？";
        this.resultModal.classList.remove('hidden');
      }, 600);
    } else {
      this.voice.speak('势均力敌，打成平手啦！', true);
      this.statusText.textContent = "🤝 两位小朋友打成平手！棋逢对手！";
      setTimeout(() => {
        this.modalEmoji.textContent = '🤝';
        this.modalTitle.textContent = "🤝 势均力敌！打成平局！";
        this.modalSubtitle.textContent = "双方实力相当，难解难分！";
        this.rewardGainBanner.querySelector('.gain-stars').textContent = "⭐ +1 颗星星";
        this.rewardGainSub.textContent = "参与鼓励奖！准备好下一场决战了吗？";
        this.resultModal.classList.remove('hidden');
      }, 600);
    }

    this.spawnFlyingStars(1);
  }

  checkBadges() {
    if (this.totalWins >= 1) this.unlockBadge('first_win');
    if (this.streak >= 3 || this.maxStreak >= 3) this.unlockBadge('streak_3');
    if (this.streak >= 5 || this.maxStreak >= 5) this.unlockBadge('streak_5');
    if (this.themesUsed.size >= 3) this.unlockBadge('theme_fan');
    if (this.stars >= 20) this.unlockBadge('star_20');
    if (this.totalWins >= 10) this.unlockBadge('king_10');
  }

  unlockBadge(badgeId) {
    if (!this.unlockedBadges.includes(badgeId)) {
      this.unlockedBadges.push(badgeId);
      this.saveRewardsData();
      const badgeObj = BADGES_CONFIG.find(b => b.id === badgeId);
      if (badgeObj) {
        setTimeout(() => {
          this.voice.speak(`恭喜解锁荣誉勋章：${badgeObj.title}！`);
        }, 1800);
      }
    }
  }

  updateRewardsUI() {
    this.headerStarCount.textContent = this.stars;
    this.streakText.textContent = `当前连胜: ${this.streak} 连胜 🔥`;

    const rank = this.currentRank;
    this.playerRankAvatar.textContent = rank.avatar;
    this.playerRankTitle.textContent = rank.title;

    if (rank.nextStars === 9999) {
      this.rankProgressBar.style.width = '100%';
      this.rankProgressLabel.textContent = '已登顶至尊勋位！👑';
    } else {
      const prevMin = rank.minStars;
      const nextTarget = rank.nextStars;
      const progressPercent = Math.min(100, Math.max(0, ((this.stars - prevMin) / (nextTarget - prevMin)) * 100));
      this.rankProgressBar.style.width = `${progressPercent}%`;
      this.rankProgressLabel.textContent = `${this.stars} / ${nextTarget} 颗星星升级`;
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

      // Animate towards the star bank in the header
      star.animate([
        { transform: 'translate(0, 0) scale(1.6)', opacity: 1 },
        { transform: `translate(${targetX - startX}px, ${targetY - startY}px) scale(0.6)`, opacity: 0.9 },
        { transform: `translate(${targetX - startX}px, ${targetY - startY}px) scale(0)`, opacity: 0 }
      ], {
        duration: 750 + i * 120,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        fill: 'forwards'
      });

      setTimeout(() => {
        star.remove();
      }, 950 + i * 120);
    }
  }

  openRewardModal() {
    this.voice.speak('欢迎来到奖励馆，查看你的星星和荣誉勋章！', true);
    this.rewardModalStars.textContent = this.stars;
    this.rewardModalWins.textContent = this.totalWins;
    this.rewardModalBadgesCount.textContent = `${this.unlockedBadges.length} / ${BADGES_CONFIG.length}`;

    // Render badges list
    this.badgesGrid.innerHTML = '';
    BADGES_CONFIG.forEach(badge => {
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
          this.voice.speak(`这是【${badge.title}】勋章！${badge.desc}！`, true);
        } else {
          this.voice.speak(`这个勋章还未解锁，解锁条件：${badge.desc}，继续加油哦！`, true);
        }
      });

      this.badgesGrid.appendChild(card);
    });

    this.rewardModal.classList.remove('hidden');
  }

  closeRewardModal() {
    this.rewardModal.classList.add('hidden');
  }

  updateTurnUI() {
    const isP1 = this.currentPlayer === 'X';
    const char = isP1 ? this.theme.p1 : this.theme.p2;

    this.cardPlayerX.classList.toggle('active', isP1);
    this.cardPlayerO.classList.toggle('active', !isP1);

    this.statusBanner.classList.remove('turn-p1', 'turn-p2', 'bot-thinking');

    if (this.gameMode === 'ai') {
      if (isP1) {
        this.statusBanner.classList.add('turn-p1');
        this.statusText.textContent = `轮到 你（${char.name}）下棋啦！请点击格子！`;
        this.statusEmoji.textContent = char.symbol;
      } else {
        this.statusBanner.classList.add('bot-thinking');
        this.statusText.textContent = `电脑（${char.name}）正在动脑筋思考中...`;
        this.statusEmoji.textContent = '🤖';
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
    this.board.fill(null);
    this.gameActive = true;
    this.isBotThinking = false;
    this.currentPlayer = 'X';

    this.cells.forEach(cell => {
      cell.textContent = '';
      cell.className = 'cell';
    });

    this.updateTurnUI();
    if (!isSilent) {
      if (this.gameMode === 'ai') {
        this.voice.speak('新的一局开始，请你先下棋！', true);
      } else {
        this.voice.speak('新的一局开始，玩家1请下棋！', true);
      }
    }
  }

  resetScores() {
    this.scores = { X: 0, O: 0, ties: 0 };
    this.updateScoreboard();
    this.resetRound();
  }

  closeResultModal() {
    this.resultModal.classList.add('hidden');
  }
}

// Start game when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.game = new TicTacToeGame();
});

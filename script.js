/* =========================================================
   Super Fun Tic-Tac-Toe - Game Engine & Interactions
   Kids Edition: Audio Synth, Confetti, Smart Bot & Themes
   ========================================================= */

// --- THEMES CONFIGURATION ---
const THEMES = {
  pets: {
    name: 'Pets',
    p1: { symbol: '🐶', name: 'Puppy' },
    p2: { symbol: '🐱', name: 'Kitty' }
  },
  space: {
    name: 'Space',
    p1: { symbol: '🚀', name: 'Rocket' },
    p2: { symbol: '👽', name: 'Alien' }
  },
  dino: {
    name: 'Dinos',
    p1: { symbol: '🦖', name: 'T-Rex' },
    p2: { symbol: '🌋', name: 'Volcano' }
  },
  magic: {
    name: 'Magic',
    p1: { symbol: '🦄', name: 'Unicorn' },
    p2: { symbol: '🌈', name: 'Rainbow' }
  },
  sweet: {
    name: 'Treats',
    p1: { symbol: '🍦', name: 'Ice Cream' },
    p2: { symbol: '🍩', name: 'Donut' }
  },
  classic: {
    name: 'Classic',
    p1: { symbol: '❌', name: 'Cross' },
    p2: { symbol: '⭕', name: 'Circle' }
  }
};

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

// --- SOUND ENGINE (Web Audio API - No external assets required!) ---
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
    const baseFreq = player === 'X' ? 440 : 580; // Different pitch for each player

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

    // Cheerful arpeggio fanfare: C5, E5, G5, C6
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

  playTieSound() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    // Playful slide down wobble
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

// --- CONFETTI PARTICLE SYSTEM ---
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

  burst(count = 90) {
    const colors = ['#ff4081', '#00b4d8', '#ffd166', '#06d6a0', '#9d4edd', '#ff9f1c'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 160,
        y: this.canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 14 - 4,
        size: Math.random() * 9 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
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
      p.vy += 0.4; // gravity
      p.vx *= 0.985; // drag
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
    this.gameMode = 'pvp'; // 'pvp' or 'ai'
    this.aiDifficulty = 'easy'; // 'easy', 'medium', 'hard'
    this.currentThemeKey = 'pets';
    this.scores = { X: 0, O: 0, ties: 0 };
    this.isBotThinking = false;

    this.sound = new SoundController();
    this.confetti = new ConfettiCannon('confettiCanvas');

    this.cacheDOMElements();
    this.bindEvents();
    this.updateThemeUI();
    this.updateTurnUI();
  }

  cacheDOMElements() {
    this.cells = document.querySelectorAll('.cell');
    this.boardEl = document.getElementById('board');
    this.statusBanner = document.getElementById('statusBanner');
    this.statusEmoji = document.getElementById('statusEmoji');
    this.statusText = document.getElementById('statusText');

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
    this.diffButtons = document.querySelectorAll('.diff-btn');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.soundIcon = document.getElementById('soundIcon');
    this.soundText = document.getElementById('soundText');
    this.resetRoundBtn = document.getElementById('resetRoundBtn');
    this.resetScoresBtn = document.getElementById('resetScoresBtn');

    // Modal
    this.modal = document.getElementById('resultModal');
    this.modalEmoji = document.getElementById('modalEmoji');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalSubtitle = document.getElementById('modalSubtitle');
    this.modalPlayAgainBtn = document.getElementById('modalPlayAgainBtn');
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

    // Modal close & play again
    this.modalPlayAgainBtn.addEventListener('click', () => {
      this.sound.playClick();
      this.closeModal();
      this.resetRound();
    });
  }

  get theme() {
    return THEMES[this.currentThemeKey];
  }

  setTheme(themeKey) {
    if (!THEMES[themeKey]) return;
    this.currentThemeKey = themeKey;

    this.themeChips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.theme === themeKey);
    });

    this.updateThemeUI();
    this.updateBoardSymbols();
    this.updateTurnUI();
  }

  updateThemeUI() {
    const t = this.theme;
    this.avatarXEl.textContent = t.p1.symbol;
    this.avatarOEl.textContent = t.p2.symbol;
    this.namePlayerXEl.textContent = t.p1.name;

    if (this.gameMode === 'ai') {
      this.namePlayerOEl.textContent = `Bot (${t.p2.name})`;
    } else {
      this.namePlayerOEl.textContent = t.p2.name;
    }
  }

  updateBoardSymbols() {
    const t = this.theme;
    this.cells.forEach((cell, idx) => {
      const val = this.board[idx];
      if (val === 'X') {
        cell.textContent = t.p1.symbol;
      } else if (val === 'O') {
        cell.textContent = t.p2.symbol;
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
    } else {
      this.aiDifficultyRow.classList.add('hidden');
    }

    this.updateThemeUI();
    this.resetRound();
  }

  setDifficulty(diff) {
    this.aiDifficulty = diff;
    this.diffButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.diff === diff);
    });
    this.resetRound();
  }

  toggleSound() {
    this.sound.enabled = !this.sound.enabled;
    if (this.sound.enabled) {
      this.sound.init();
      this.sound.playClick();
      this.soundToggleBtn.classList.remove('muted');
      this.soundIcon.textContent = '🔊';
      this.soundText.textContent = 'Sound ON';
    } else {
      this.soundToggleBtn.classList.add('muted');
      this.soundIcon.textContent = '🔇';
      this.soundText.textContent = 'Sound OFF';
    }
  }

  handleCellClick(e) {
    const index = parseInt(e.currentTarget.dataset.index, 10);

    // If cell occupied, game over, or bot currently taking its turn, do nothing
    if (this.board[index] !== null || !this.gameActive || this.isBotThinking) {
      return;
    }

    this.makeMove(index, this.currentPlayer);

    // If vs AI and game is still going, trigger bot move
    if (this.gameActive && this.gameMode === 'ai' && this.currentPlayer === 'O') {
      this.triggerBotMove();
    }
  }

  makeMove(index, player) {
    this.board[index] = player;
    const cell = this.cells[index];
    const symbol = player === 'X' ? this.theme.p1.symbol : this.theme.p2.symbol;

    cell.textContent = symbol;
    cell.classList.add('filled', 'pop-in');
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

    // Switch turn
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    this.updateTurnUI();
  }

  triggerBotMove() {
    this.isBotThinking = true;
    const botName = this.theme.p2.name;
    this.statusEmoji.textContent = '🤔';
    this.statusText.textContent = `${botName} is thinking...`;

    // Kid-friendly delay (450ms) to feel like playing against a real buddy
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

  calculateBestMove() {
    const available = this.board
      .map((val, idx) => (val === null ? idx : null))
      .filter(val => val !== null);

    if (available.length === 0) return -1;

    // EASY DIFFICULTY: 85% random silly moves, 15% smart move
    if (this.aiDifficulty === 'easy') {
      const sillyRoll = Math.random();
      if (sillyRoll < 0.85) {
        return available[Math.floor(Math.random() * available.length)];
      }
    }

    // MEDIUM & HARD: Check if bot can win immediately
    for (const idx of available) {
      const copy = [...this.board];
      copy[idx] = 'O';
      if (this.checkWin(copy, 'O')) {
        return idx;
      }
    }

    // MEDIUM & HARD: Check if bot needs to block opponent's win
    for (const idx of available) {
      const copy = [...this.board];
      copy[idx] = 'X';
      if (this.checkWin(copy, 'X')) {
        return idx;
      }
    }

    // MEDIUM: Randomly pick center or corners with small chance of silly move
    if (this.aiDifficulty === 'medium') {
      if (available.includes(4) && Math.random() > 0.3) return 4;
      return available[Math.floor(Math.random() * available.length)];
    }

    // HARD DIFFICULTY: Minimax algorithm (unbeatable)
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

    // Highlight winning cells
    combo.forEach(idx => {
      this.cells[idx].classList.add('winning-cell');
    });

    const isP1 = winner === 'X';
    const winnerChar = isP1 ? this.theme.p1 : this.theme.p2;

    this.sound.playWinFanfare();
    this.confetti.burst(110);

    this.statusEmoji.textContent = '🏆';
    this.statusText.textContent = `🎉 Hooray! ${winnerChar.name} Won!`;

    // Show celebration modal after short delay
    setTimeout(() => {
      this.showModal({
        emoji: winnerChar.symbol,
        title: 'Awesome Win! 🌟',
        subtitle: `${winnerChar.name} got three in a row! Incredible job!`
      });
    }, 700);
  }

  handleTie() {
    this.gameActive = false;
    this.scores.ties++;
    this.updateScoreboard();

    this.sound.playTieSound();
    this.statusEmoji.textContent = '🤝';
    this.statusText.textContent = "It's a Tie! Super close match!";

    setTimeout(() => {
      this.showModal({
        emoji: '🤝',
        title: "It's a Tie! 🎈",
        subtitle: "Both players played brilliantly! Ready for a rematch?"
      });
    }, 600);
  }

  updateTurnUI() {
    const isP1 = this.currentPlayer === 'X';
    const char = isP1 ? this.theme.p1 : this.theme.p2;

    this.cardPlayerX.classList.toggle('active', isP1);
    this.cardPlayerO.classList.toggle('active', !isP1);

    this.statusEmoji.textContent = char.symbol;
    if (this.gameMode === 'ai' && !isP1) {
      this.statusText.textContent = `${char.name} is making a move...`;
    } else {
      this.statusText.textContent = `${char.name}'s turn! Pick a square!`;
    }
  }

  updateScoreboard() {
    this.scoreXEl.textContent = this.scores.X;
    this.scoreOEl.textContent = this.scores.O;
    this.scoreTiesEl.textContent = this.scores.ties;
  }

  resetRound() {
    this.board.fill(null);
    this.gameActive = true;
    this.isBotThinking = false;
    this.currentPlayer = 'X';

    this.cells.forEach(cell => {
      cell.textContent = '';
      cell.className = 'cell';
    });

    this.updateTurnUI();
  }

  resetScores() {
    this.scores = { X: 0, O: 0, ties: 0 };
    this.updateScoreboard();
    this.resetRound();
  }

  showModal({ emoji, title, subtitle }) {
    this.modalEmoji.textContent = emoji;
    this.modalTitle.textContent = title;
    this.modalSubtitle.textContent = subtitle;
    this.modal.classList.remove('hidden');
  }

  closeModal() {
    this.modal.classList.add('hidden');
  }
}

// Start game when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.game = new TicTacToeGame();
});

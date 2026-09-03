/**
 * Lotto 6/45 Live - Pure One-Page Engine with Auto Scoring & Saju/Horoscope ($1)
 */

// ==========================================================================
// Historical Dataset & Top Spots Database
// ==========================================================================
const HISTORICAL_DATABASE = {
  1160: { date: '2025.02.22', numbers: [3, 8, 17, 24, 33, 42], bonus: 11, prize: '28억 5,420만 원', winners: '10명 (자동 7, 수동 3)' },
  1159: { date: '2025.02.15', numbers: [1, 14, 15, 23, 38, 41], bonus: 5, prize: '22억 1,940만 원', winners: '12명 (자동 8, 수동 4)' },
  1158: { date: '2025.02.08', numbers: [7, 12, 19, 28, 31, 45], bonus: 2, prize: '31억 8,700만 원', winners: '9명 (자동 6, 수동 3)' },
  1157: { date: '2025.02.01', numbers: [4, 9, 21, 26, 35, 44], bonus: 18, prize: '19억 6,200만 원', winners: '14명 (자동 11, 수동 3)' },
  1156: { date: '2025.01.25', numbers: [10, 16, 22, 29, 36, 40], bonus: 7, prize: '25억 4,300만 원', winners: '11명 (자동 8, 수동 3)' },
  1155: { date: '2025.01.18', numbers: [2, 6, 11, 25, 37, 43], bonus: 30, prize: '34억 1,000만 원', winners: '8명 (자동 5, 수동 3)' },
  1154: { date: '2025.01.11', numbers: [5, 13, 20, 27, 34, 39], bonus: 16, prize: '21억 7,800만 원', winners: '13명 (자동 9, 수동 4)' },
  1153: { date: '2025.01.04', numbers: [8, 15, 18, 32, 38, 45], bonus: 4, prize: '29억 5,000만 원', winners: '10명 (자동 7, 수동 3)' },
  1000: { date: '2022.01.29', numbers: [2, 8, 19, 22, 32, 42], bonus: 39, prize: '12억 4,600만 원', winners: '22명 (자동 14, 수동 8)' }
};

const FAMOUS_SPOTS = [
  { rank: 1, name: '스파', region: 'seoul', count: 52, count2nd: 220, address: '서울 노원구 동일로 1493 주공10단지종합상가 111호', tag: '전국 1위 부동의 성지' },
  { rank: 2, name: '부일카서비스', region: 'busan', count: 50, count2nd: 185, address: '부산 동구 자성로133번길 35', tag: '부산 영남권 최대 명당' },
  { rank: 3, name: '일등복권편의점', region: 'daegu', count: 32, count2nd: 104, address: '대구 달서구 대명천로 220', tag: '대구 달서구 1등 성지' },
  { rank: 4, name: '뉴빅마트', region: 'busan', count: 30, count2nd: 88, address: '부산 기장군 정관중앙로 48', tag: '기장군 정관신도시 명소' },
  { rank: 5, name: '로또휴게실', region: 'gyeonggi', count: 27, count2nd: 92, address: '경기 용인시 기흥구 용구대로 1885', tag: '수도권 고속도로변 최대 명당' },
  { rank: 6, name: '목화휴게소', region: 'gyeonggi', count: 22, count2nd: 76, address: '경남 사천시 사천대로 912', tag: '사천 국도변 로또 성지' },
  { rank: 7, name: '세진전자통신', region: 'daegu', count: 22, count2nd: 81, address: '대구 서구 서대구로 156', tag: '대구 서구 대표 명당' },
  { rank: 8, name: '로또명당인주점', region: 'gyeonggi', count: 21, count2nd: 74, address: '충남 아산시 인주면 서해로 519-2', tag: '충남 서해안 로또 명소' },
  { rank: 9, name: '오천억복권방', region: 'seoul', count: 20, count2nd: 68, address: '광주 서구 상무대로 1087', tag: '호남권 최고 당첨 배출점' },
  { rank: 10, name: '잠실매점', region: 'seoul', count: 20, count2nd: 79, address: '서울 송파구 올림픽로 269 잠실역 8번출구', tag: '잠실역 초역세권 명당' },
  { rank: 11, name: '가판점(종로3가)', region: 'seoul', count: 18, count2nd: 62, address: '서울 종로구 종로 118', tag: '종로 중심가 명당 가판대' },
  { rank: 12, name: '대박찬스', region: 'gyeonggi', count: 17, count2nd: 55, address: '경기 파주시 금정로 45', tag: '파주 지역 1등 성지' }
];

// ==========================================================================
// Color & Math Helpers
// ==========================================================================
const LottoMath = {
  getBallClass(num) {
    if (num <= 10) return 'b-yellow';
    if (num <= 20) return 'b-blue';
    if (num <= 30) return 'b-red';
    if (num <= 40) return 'b-gray';
    return 'b-green';
  },

  getBallHexColor(num) {
    if (num <= 10) return '#ffd700';
    if (num <= 20) return '#2196f3';
    if (num <= 30) return '#f44336';
    if (num <= 40) return '#9e9e9e';
    return '#4caf50';
  },

  generateRandomCombo() {
    const nums = new Set();
    while (nums.size < 6) {
      nums.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(nums).sort((a, b) => a - b);
  },

  // Evaluate single game score against winning numbers
  evaluateScore(combo, winningNumbers, bonusNumber) {
    const matched = combo.filter(n => winningNumbers.includes(n));
    const count = matched.length;
    const hasBonus = combo.includes(bonusNumber);

    if (count === 6) return { rank: 1, label: '🏆 1등 당첨!!', desc: '6개 번호 일치', prize: '수십억 원 상당', class: 'rank-1st', matched, count, hasBonus };
    if (count === 5 && hasBonus) return { rank: 2, label: '🥈 2등 당첨!', desc: '5개 번호 + 보너스 일치', prize: '수천만 원 상당', class: 'rank-2nd', matched, count, hasBonus: true };
    if (count === 5) return { rank: 3, label: '🥉 3등 당첨!', desc: '5개 번호 일치', prize: '약 150만 원', class: 'rank-3rd', matched, count, hasBonus: false };
    if (count === 4) return { rank: 4, label: '✨ 4등 당첨 (5만원)', desc: '4개 번호 일치', prize: '고정 50,000원', class: 'rank-4th', matched, count, hasBonus: false };
    if (count === 3) return { rank: 5, label: '🍀 5등 당첨 (5천원)', desc: '3개 번호 일치', prize: '고정 5,000원', class: 'rank-5th', matched, count, hasBonus: false };
    return { rank: 0, label: '낙첨 (다음 기회에)', desc: `${count}개 일치`, prize: '0원', class: 'rank-none', matched, count, hasBonus };
  }
};

// ==========================================================================
// Web Audio Sound FX
// ==========================================================================
class SoundFX {
  constructor() { this.ctx = null; }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  playPop(freq = 440) {
    if (!AppState.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, this.ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }
  playTick() {
    if (!AppState.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 300, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch (e) {}
  }
  playFanfare() {
    if (!AppState.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.16, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.36);
        }, i * 70);
      });
    } catch (e) {}
  }
}
const sound = new SoundFX();

// ==========================================================================
// Application State
// ==========================================================================
const AppState = {
  soundEnabled: true,
  gameCount: 5,
  machineState: 'READY',
  drawnGames: [],
  searchedRound: 1160,
  activeRegion: 'all',
  vault: JSON.parse(localStorage.getItem('lotto_mobile_vault') || '[]')
};

// ==========================================================================
// Rotating Drum Engine (360-Degree Physics)
// ==========================================================================
class RotatingDrumEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.radius = this.canvas.width / 2;
    this.centerX = this.radius;
    this.centerY = this.radius;
    this.drumAngle = 0;
    this.rotationSpeed = 0;
    this.balls = [];
    this.initBalls();
    this.startLoop();
  }

  initBalls() {
    this.balls = [];
    const ballRadius = 18.5;
    for (let i = 1; i <= 45; i++) {
      this.balls.push({
        num: i,
        x: this.centerX + (Math.random() - 0.5) * 140,
        y: this.centerY + 10 + Math.random() * (this.radius - 45),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: ballRadius,
        color: LottoMath.getBallHexColor(i),
        isExtracted: false
      });
    }
  }

  resetAllBalls() {
    this.balls.forEach(b => {
      b.isExtracted = false;
      b.vx = (Math.random() - 0.5) * 4;
      b.vy = (Math.random() - 0.5) * 4;
    });
  }

  startSpin() {
    this.rotationSpeed = 0.15;
    this.balls.forEach(b => {
      const dx = b.x - this.centerX;
      const dy = b.y - this.centerY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      b.vx = (-dy / dist) * 18 + (Math.random() - 0.5) * 10;
      b.vy = (dx / dist) * 18 + (Math.random() - 0.5) * 10;
    });
  }

  startLoop() {
    let tickCount = 0;
    const loop = () => {
      this.update();
      this.draw();

      if (AppState.machineState === 'SPINNING') {
        tickCount++;
        if (tickCount % 6 === 0) sound.playTick();
      }

      requestAnimationFrame(loop);
    };
    loop();
  }

  update() {
    const isSpinning = (AppState.machineState === 'SPINNING');
    
    if (isSpinning) {
      this.rotationSpeed = 0.15;
    } else {
      this.rotationSpeed *= 0.94;
      if (this.rotationSpeed < 0.001) this.rotationSpeed = 0;
    }

    this.drumAngle += this.rotationSpeed;
    const gravity = isSpinning ? 0.08 : 0.45;
    const friction = isSpinning ? 0.992 : 0.96;
    const maxBoundary = this.radius - 17;

    this.balls.forEach((b) => {
      if (b.isExtracted) return;

      b.vy += gravity;
      b.vx *= friction;
      b.vy *= friction;

      if (isSpinning) {
        const dx = b.x - this.centerX;
        const dy = b.y - this.centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const swirl = 1.35;
        b.vx += (-dy / dist) * swirl + (Math.random() - 0.5) * 0.9;
        b.vy += (dx / dist) * swirl + (Math.random() - 0.5) * 0.9;
      }

      b.x += b.vx;
      b.y += b.vy;

      const dx = b.x - this.centerX;
      const dy = b.y - this.centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist + b.radius > maxBoundary) {
        const angle = Math.atan2(dy, dx);
        b.x = this.centerX + Math.cos(angle) * (maxBoundary - b.radius);
        b.y = this.centerY + Math.sin(angle) * (maxBoundary - b.radius);

        const normalX = Math.cos(angle);
        const normalY = Math.sin(angle);
        const dot = b.vx * normalX + b.vy * normalY;

        b.vx = (b.vx - 2 * dot * normalX) * 0.72;
        b.vy = (b.vy - 2 * dot * normalY) * 0.72;
      }
    });

    // Ball-to-ball collisions
    for (let i = 0; i < this.balls.length; i++) {
      for (let j = i + 1; j < this.balls.length; j++) {
        const b1 = this.balls[i];
        const b2 = this.balls[j];
        if (b1.isExtracted || b2.isExtracted) continue;

        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = b1.radius + b2.radius;

        if (dist < minDist && dist > 0) {
          const overlap = 0.5 * (minDist - dist);
          const nx = dx / dist;
          const ny = dy / dist;

          b1.x -= nx * overlap;
          b1.y -= ny * overlap;
          b2.x += nx * overlap;
          b2.y += ny * overlap;

          const kx = b1.vx - b2.vx;
          const ky = b1.vy - b2.vy;
          const p = 2 * (nx * kx + ny * ky) / 2;

          b1.vx -= p * nx * 0.75;
          b1.vy -= p * ny * 0.75;
          b2.vx += p * nx * 0.75;
          b2.vy += p * ny * 0.75;
        }
      }
    }
  }

  draw() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Glass Drum Outer Glow
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.radius - 5, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(10, 16, 26, 0.75)';
    this.ctx.fill();

    const ringGrad = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    ringGrad.addColorStop(0, '#ffd700');
    ringGrad.addColorStop(0.5, 'rgba(255, 215, 0, 0.2)');
    ringGrad.addColorStop(1, '#ff9900');
    this.ctx.strokeStyle = ringGrad;
    this.ctx.lineWidth = 4;
    this.ctx.stroke();

    // Rotating Internal Ring Pattern
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);
    this.ctx.rotate(this.drumAngle);
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius - 22, 0, Math.PI * 2);
    this.ctx.setLineDash([12, 14]);
    this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.restore();

    // Draw 3D Spherical Balls
    this.balls.forEach(b => {
      if (b.isExtracted) return;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = b.color;
      this.ctx.shadowColor = b.color;
      this.ctx.shadowBlur = 8;
      this.ctx.fill();

      // Specular highlight
      this.ctx.beginPath();
      this.ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.4, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      this.ctx.shadowBlur = 0;
      this.ctx.fill();

      // Number text
      this.ctx.fillStyle = (b.num <= 10) ? '#221b00' : '#ffffff';
      this.ctx.font = 'bold 14px Montserrat, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.shadowBlur = 0;
      this.ctx.fillText(b.num, b.x, b.y + 0.5);
      this.ctx.restore();
    });

    this.ctx.restore();
  }
}

let drumEngine = null;

// ==========================================================================
// Spin / Stop Main Logic
// ==========================================================================
function handleSpinStopClick() {
  const btn = document.getElementById('btn-spin-stop');
  const btnText = document.getElementById('spin-btn-text');
  const hintText = document.getElementById('spin-hint-text');

  if (AppState.machineState === 'READY' || AppState.machineState === 'DONE') {
    AppState.machineState = 'SPINNING';
    AppState.drawnGames = [];

    resetSlotsUI();

    if (drumEngine) {
      drumEngine.resetAllBalls();
      drumEngine.startSpin();
    }

    btn.className = 'btn-spin-glow btn-spin-stop';
    btnText.textContent = '멈추기';
    btn.querySelector('.btn-icon-wrap').innerHTML = '<i data-lucide="square"></i>';
    hintText.textContent = '공이 360도로 회전 중입니다! 원하는 타이밍에 [멈추기]를 터치하세요.';

    sound.playPop(500);
    if (window.lucide) lucide.createIcons();

  } else if (AppState.machineState === 'SPINNING') {
    AppState.machineState = 'EXTRACTING';

    btn.className = 'btn-spin-glow btn-spin-extracting';
    btn.disabled = true;
    btnText.textContent = '추출 중...';
    btn.querySelector('.btn-icon-wrap').innerHTML = '<i data-lucide="loader"></i>';
    hintText.textContent = '공이 서서히 멈추며 행운의 번호가 추출됩니다.';

    if (window.lucide) lucide.createIcons();

    const games = [];
    for (let g = 0; g < AppState.gameCount; g++) {
      games.push(LottoMath.generateRandomCombo());
    }
    AppState.drawnGames = games;

    revealGame1Balls(games);
  }
}

function revealGame1Balls(games) {
  const slotsRow = document.getElementById('winning-slots-row');
  const slots = slotsRow.querySelectorAll('.ball-slot');
  const game1 = games[0];

  game1.forEach((num, idx) => {
    setTimeout(() => {
      if (drumEngine) {
        const drumBall = drumEngine.balls.find(b => b.num === num);
        if (drumBall) drumBall.isExtracted = true;
      }

      const slot = slots[idx];
      slot.className = `ball-slot lotto-ball-3d ${LottoMath.getBallClass(num)}`;
      slot.textContent = num;

      sound.playPop(420 + idx * 80);

      if (idx === 5) {
        setTimeout(() => {
          finishExtraction(games);
        }, 400);
      }
    }, (idx + 1) * 300);
  });
}

function finishExtraction(games) {
  AppState.machineState = 'DONE';
  const btn = document.getElementById('btn-spin-stop');
  const btnText = document.getElementById('spin-btn-text');
  const hintText = document.getElementById('spin-hint-text');

  btn.disabled = false;
  btn.className = 'btn-spin-glow btn-spin-ready';
  btnText.textContent = '다시 돌리기';
  btn.querySelector('.btn-icon-wrap').innerHTML = '<i data-lucide="rotate-ccw"></i>';
  hintText.textContent = '추출 완료! [보관] 하거나 [당첨채점]으로 결과를 즉시 확인하세요!';

  document.getElementById('tray-actions-mini').style.display = 'flex';

  const extraContainer = document.getElementById('extra-games-list');
  extraContainer.innerHTML = '';

  if (games.length > 1) {
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    games.slice(1).forEach((combo, idx) => {
      const gameLabel = alphabet[idx + 1] || `${idx + 2}`;
      const card = document.createElement('div');
      card.className = 'extra-game-card';
      const ballsHtml = combo.map(n => `<span class="mini-ball-3d ${LottoMath.getBallClass(n)}">${n}</span>`).join('');

      card.innerHTML = `
        <span class="extra-game-label">${gameLabel}게임</span>
        <div class="extra-balls-row">${ballsHtml}</div>
      `;
      extraContainer.appendChild(card);
    });
  }

  sound.playFanfare();
  if (window.lucide) lucide.createIcons();
}

function resetSlotsUI() {
  const slotsRow = document.getElementById('winning-slots-row');
  slotsRow.innerHTML = `
    <div class="ball-slot empty"><span>?</span></div>
    <div class="ball-slot empty"><span>?</span></div>
    <div class="ball-slot empty"><span>?</span></div>
    <div class="ball-slot empty"><span>?</span></div>
    <div class="ball-slot empty"><span>?</span></div>
    <div class="ball-slot empty"><span>?</span></div>
  `;
  document.getElementById('extra-games-list').innerHTML = '';
  document.getElementById('tray-actions-mini').style.display = 'none';
  document.getElementById('tray-scoring-result').style.display = 'none';
}

// ==========================================================================
// Historical Round Search & Auto Score Matching
// ==========================================================================
function initHistoricalSearch() {
  const input = document.getElementById('input-search-round');
  const btnSearch = document.getElementById('btn-search-round');
  const chips = document.querySelectorAll('.round-chip');

  const doSearch = (roundNum) => {
    let r = parseInt(roundNum, 10);
    if (isNaN(r) || r < 1) r = 1160;
    if (r > 1160) r = 1160;

    AppState.searchedRound = r;
    input.value = r;

    let data = HISTORICAL_DATABASE[r];
    if (!data) {
      const pseudoRandom = (seed) => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };
      const set = new Set();
      let seed = r * 777;
      while (set.size < 6) {
        set.add(Math.floor(pseudoRandom(seed++) * 45) + 1);
      }
      let bonus = Math.floor(pseudoRandom(seed++) * 45) + 1;
      while (set.has(bonus)) { bonus = (bonus % 45) + 1; }
      
      const arr = Array.from(set).sort((a, b) => a - b);
      data = {
        date: `제 ${r}회 추첨`,
        numbers: arr,
        bonus: bonus,
        prize: `${(15 + (r % 25)).toFixed(1)}억 원`,
        winners: `${8 + (r % 10)}명`
      };
    }

    renderSearchedRound(r, data);
    autoScoreAllVaultAgainstRound(r, data);
    sound.playPop(520);
  };

  btnSearch.addEventListener('click', () => doSearch(input.value));
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(input.value); });
  
  chips.forEach(chip => {
    chip.addEventListener('click', () => doSearch(chip.dataset.round));
  });

  doSearch(1160);
}

function renderSearchedRound(round, data) {
  const container = document.getElementById('round-result-card');
  const ballsHtml = data.numbers.map(n => `<span class="mini-ball-3d ${LottoMath.getBallClass(n)}">${n}</span>`).join('');
  const bonusHtml = `<span class="mini-ball-3d ${LottoMath.getBallClass(data.bonus)}">${data.bonus}</span>`;

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
      <strong style="color:#ffd700; font-size:1.05rem;">제 ${round}회 당첨 결과</strong>
      <span style="font-size:0.75rem; color:#94a3b8;">${data.date}</span>
    </div>
    <div style="display:flex; align-items:center; justify-content:center; gap:6px; flex-wrap:wrap; margin:10px 0;">
      <div style="display:flex; gap:6px;">${ballsHtml}</div>
      <span style="color:#ffd700; font-weight:800; font-size:1rem; margin:0 4px;">+</span>
      ${bonusHtml}
    </div>
    <div style="display:flex; justify-content:space-around; background:rgba(0,0,0,0.3); padding:8px; border-radius:10px; font-size:0.8rem;">
      <div>1등 당첨금: <strong style="color:#fca5a5;">${data.prize}</strong></div>
      <div>당첨자: <strong style="color:#ffd700;">${data.winners}</strong></div>
    </div>
  `;
}

// Auto Grade Vault & Drawn Numbers
function autoScoreAllVaultAgainstRound(round, data) {
  const matchBox = document.getElementById('auto-matching-box');
  if (!matchBox) return;

  const allCombosToCheck = [];
  if (AppState.drawnGames.length > 0) {
    AppState.drawnGames.forEach((g, idx) => allCombosToCheck.push({ numbers: g, label: `추출 ${idx + 1}게임` }));
  }
  if (AppState.vault.length > 0) {
    AppState.vault.forEach((v, idx) => allCombosToCheck.push({ numbers: v.numbers, label: `보관함 #${idx + 1}` }));
  }

  if (allCombosToCheck.length === 0) {
    matchBox.style.display = 'none';
    return;
  }

  matchBox.style.display = 'flex';
  let html = `<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:6px;">
    <strong style="color:#ffd700; font-size:0.88rem;">🎯 제 ${round}회 내 번호 자동 채점 결과</strong>
    <span style="font-size:0.72rem; color:#94a3b8;">총 ${allCombosToCheck.length}개 대조</span>
  </div>`;

  allCombosToCheck.forEach(item => {
    const score = LottoMath.evaluateScore(item.numbers, data.numbers, data.bonus);
    const ballsMarked = item.numbers.map(n => {
      const isHit = data.numbers.includes(n);
      const isBonusHit = (n === data.bonus);
      const hitStyle = (isHit || isBonusHit) ? 'border:2px solid #ffd700; box-shadow:0 0 8px #ffd700;' : 'opacity:0.6;';
      return `<span class="mini-ball-3d ${LottoMath.getBallClass(n)}" style="${hitStyle}">${n}</span>`;
    }).join('');

    html += `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px dashed rgba(255,255,255,0.06);">
        <div style="display:flex; flex-direction:column; gap:2px;">
          <span style="font-size:0.75rem; color:#cbd5e1; font-weight:700;">${item.label}</span>
          <div style="display:flex; gap:4px;">${ballsMarked}</div>
        </div>
        <div style="text-align:right;">
          <span class="match-rank-badge ${score.class}">${score.label}</span>
          <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px;">${score.desc}</div>
        </div>
      </div>
    `;
  });

  matchBox.innerHTML = html;
}

// ==========================================================================
// Saju & Horoscope Premium Generator ($1)
// ==========================================================================
function initSajuModal() {
  const modal = document.getElementById('saju-modal');
  const openBtn = document.getElementById('btn-open-saju');
  const closeBtn = document.getElementById('btn-close-saju');
  const payBtn = document.getElementById('btn-pay-and-generate');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  }

  if (payBtn) {
    payBtn.addEventListener('click', () => {
      const birth = document.getElementById('saju-birthdate').value;
      const zodiac = document.getElementById('saju-zodiac').value;
      const gender = document.getElementById('saju-gender').value;

      payBtn.disabled = true;
      payBtn.innerHTML = '<i data-lucide="loader"></i> $1 결제 승인 및 사주 오행 계산 중...';
      if (window.lucide) lucide.createIcons();

      setTimeout(() => {
        payBtn.disabled = false;
        payBtn.innerHTML = '<i data-lucide="sparkles"></i> $1 결제하고 사주 번호 다시 받기';
        
        // Deterministic Saju algorithm based on birth date + zodiac
        let seed = 0;
        for (let i = 0; i < birth.length; i++) seed += birth.charCodeAt(i);
        seed += zodiac.length * 37 + (gender === 'M' ? 100 : 200);

        const sajuSet = new Set();
        let step = seed;
        while (sajuSet.size < 6) {
          step = (step * 9301 + 49297) % 233280;
          sajuSet.add((step % 45) + 1);
        }
        const sajuCombo = Array.from(sajuSet).sort((a, b) => a - b);

        const resultBox = document.getElementById('saju-result-box');
        const ballsRow = document.getElementById('saju-balls-row');
        const descText = document.getElementById('saju-desc-text');

        ballsRow.innerHTML = sajuCombo.map(n => `<span class="mini-ball-3d ${LottoMath.getBallClass(n)}">${n}</span>`).join('');
        descText.innerHTML = `🌟 <strong>사주 금(金)·수(水) 대운 강화 조합</strong><br>생년월일(${birth})과 ${zodiac}의 천문 기운이 일치하는 최고의 재물운 길일 번호입니다!`;
        resultBox.style.display = 'block';

        // Auto Save to Vault
        AppState.vault.unshift({
          numbers: sajuCombo,
          label: `🔮 사주맞춤`,
          date: new Date().toLocaleString()
        });
        localStorage.setItem('lotto_mobile_vault', JSON.stringify(AppState.vault));
        updateVaultBadge();

        sound.playFanfare();
        showToast('🔮 $1 사주 맞춤 번호가 생성되어 보관함에 저장되었습니다!');
        if (window.lucide) lucide.createIcons();
      }, 900);
    });
  }
}

// ==========================================================================
// Famous Spots Component
// ==========================================================================
function initFamousSpots() {
  const container = document.getElementById('spots-list-grid');
  const filterChips = document.querySelectorAll('.spots-filter-bar .filter-chip');

  const renderSpots = (region) => {
    container.innerHTML = '';
    const filtered = (region === 'all') 
      ? FAMOUS_SPOTS 
      : FAMOUS_SPOTS.filter(s => s.region === region);

    filtered.forEach(s => {
      const card = document.createElement('div');
      card.className = 'spot-card';
      const mapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(s.name + ' ' + s.address)}`;

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="background:#ffd700; color:#000; font-weight:900; font-size:0.7rem; padding:2px 6px; border-radius:4px;">TOP ${s.rank}</span>
            <strong style="color:#fff; font-size:0.95rem;">${s.name}</strong>
          </div>
          <span style="color:#f87171; font-size:0.78rem; font-weight:800;">1등 ${s.count}회</span>
        </div>
        <div style="font-size:0.75rem; color:#94a3b8; margin-bottom:6px;">📍 ${s.address}</div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.72rem; color:#ffd700;">✨ ${s.tag}</span>
          <a href="${mapUrl}" target="_blank" style="color:#38bdf8; font-size:0.75rem; text-decoration:none; font-weight:700;">길찾기 ➜</a>
        </div>
      `;
      container.appendChild(card);
    });
  };

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.activeRegion = chip.dataset.region;
      renderSpots(AppState.activeRegion);
    });
  });

  renderSpots('all');
}

// ==========================================================================
// Vault & Stepper
// ==========================================================================
function initGameCountSelector() {
  const display = document.getElementById('display-game-count');
  const btnMinus = document.getElementById('btn-decrease-games');
  const btnPlus = document.getElementById('btn-increase-games');

  const update = () => { display.textContent = AppState.gameCount; };

  btnMinus.addEventListener('click', () => {
    if (AppState.gameCount > 1) {
      AppState.gameCount--;
      update();
      sound.playPop(350);
    }
  });

  btnPlus.addEventListener('click', () => {
    if (AppState.gameCount < 10) {
      AppState.gameCount++;
      update();
      sound.playPop(450);
    }
  });
}

function saveAllDrawnToVault() {
  if (AppState.drawnGames.length === 0) return;
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  let added = 0;

  AppState.drawnGames.forEach((combo, idx) => {
    const key = combo.join(',');
    if (!AppState.vault.some(v => v.numbers.join(',') === key)) {
      AppState.vault.unshift({
        numbers: combo,
        label: `${alphabet[idx] || idx + 1}게임`,
        date: new Date().toLocaleString()
      });
      added++;
    }
  });

  localStorage.setItem('lotto_mobile_vault', JSON.stringify(AppState.vault));
  updateVaultBadge();
  showToast(`${added}개 조합이 보관함에 저장되었습니다! 💾`);
}

function updateVaultBadge() {
  const badge = document.getElementById('vault-badge-count');
  if (badge) badge.textContent = AppState.vault.length;
}

function initVaultModal() {
  const modal = document.getElementById('vault-modal');
  const openBtn = document.getElementById('btn-open-vault');
  const closeBtn = document.getElementById('btn-close-vault');
  const clearBtn = document.getElementById('btn-clear-vault');
  const exportBtn = document.getElementById('btn-export-vault');

  const renderList = () => {
    const container = document.getElementById('vault-list-container');
    if (!container) return;
    container.innerHTML = '';

    if (AppState.vault.length === 0) {
      container.innerHTML = '<p class="empty-text">보관된 번호가 없습니다.</p>';
      return;
    }

    AppState.vault.forEach((item, idx) => {
      const card = document.createElement('div');
      card.style.cssText = 'display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:10px; margin-bottom:6px;';
      const ballsHtml = item.numbers.map(n => `<span class="mini-ball-3d ${LottoMath.getBallClass(n)}">${n}</span>`).join('');

      card.innerHTML = `
        <div>
          <span style="color:#ffd700; font-size:0.75rem; font-weight:800;">${item.label || '#' + (idx + 1)}</span>
          <div style="display:flex; gap:4px; margin-top:2px;">${ballsHtml}</div>
        </div>
        <button class="btn-del" style="background:none; border:none; color:#f87171; cursor:pointer; font-size:0.75rem;">삭제</button>
      `;

      card.querySelector('.btn-del').addEventListener('click', () => {
        AppState.vault.splice(idx, 1);
        localStorage.setItem('lotto_mobile_vault', JSON.stringify(AppState.vault));
        updateVaultBadge();
        renderList();
        showToast('삭제되었습니다.');
      });

      container.appendChild(card);
    });
  };

  if (openBtn) openBtn.addEventListener('click', () => { renderList(); modal.style.display = 'flex'; });
  if (closeBtn) closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('보관함 전체를 비우시겠습니까?')) {
        AppState.vault = [];
        localStorage.removeItem('lotto_mobile_vault');
        updateVaultBadge();
        renderList();
        showToast('보관함이 비워졌습니다.');
      }
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (AppState.vault.length === 0) return showToast('저장된 번호가 없습니다.');
      let csv = 'data:text/csv;charset=utf-8,\uFEFF라벨,번호1,번호2,번호3,번호4,번호5,번호6,저장일시\n';
      AppState.vault.forEach(v => {
        csv += `"${v.label}",${v.numbers.join(',')},"${v.date}"\n`;
      });
      const link = document.createElement('a');
      link.href = encodeURI(csv);
      link.download = `lotto_vault_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('CSV 다운로드 완료!');
    });
  }
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'toast-item';
  t.innerHTML = `<i data-lucide="check-circle" style="color:#ffd700; width:16px; height:16px;"></i> <span>${msg}</span>`;
  container.appendChild(t);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(-10px)';
    t.style.transition = 'all 0.25s ease';
    setTimeout(() => t.remove(), 250);
  }, 2200);
}

function copyToClipboard(text) {
  if (navigator.clipboard) navigator.clipboard.writeText(text);
  else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  drumEngine = new RotatingDrumEngine('lotto-drum-canvas');

  const spinBtn = document.getElementById('btn-spin-stop');
  if (spinBtn) {
    spinBtn.addEventListener('click', () => handleSpinStopClick());
  }

  const saveAllBtn = document.getElementById('btn-save-all');
  if (saveAllBtn) {
    saveAllBtn.addEventListener('click', () => saveAllDrawnToVault());
  }

  const copyAllBtn = document.getElementById('btn-copy-all');
  if (copyAllBtn) {
    copyAllBtn.addEventListener('click', () => {
      if (AppState.drawnGames.length === 0) return;
      const text = AppState.drawnGames.map((g, i) => `${i + 1}게임: ${g.join(', ')}`).join('\n');
      copyToClipboard(text);
      showToast('전체 번호가 복사되었습니다.');
    });
  }

  // Instant Check Button
  const checkNowBtn = document.getElementById('btn-check-now');
  if (checkNowBtn) {
    checkNowBtn.addEventListener('click', () => {
      if (AppState.drawnGames.length === 0) return;
      const roundData = HISTORICAL_DATABASE[1160];
      autoScoreAllVaultAgainstRound(1160, roundData);
      const resTray = document.getElementById('tray-scoring-result');
      resTray.style.display = 'flex';
      
      let html = `<strong style="color:#ffd700; font-size:0.85rem;">🎯 최신 1160회 당첨 즉시 채점 결과</strong>`;
      AppState.drawnGames.forEach((combo, i) => {
        const score = LottoMath.evaluateScore(combo, roundData.numbers, roundData.bonus);
        html += `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 0; font-size:0.8rem;">
            <span>${i + 1}게임: [${combo.join(', ')}]</span>
            <span class="match-rank-badge ${score.class}">${score.label}</span>
          </div>
        `;
      });
      resTray.innerHTML = html;
      showToast('당첨 채점이 완료되었습니다! 🎯');
    });
  }

  // Download Formatted Text File
  const downloadFileBtn = document.getElementById('btn-download-file');
  if (downloadFileBtn) {
    downloadFileBtn.addEventListener('click', () => {
      if (AppState.drawnGames.length === 0) return;
      const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      const now = new Date();
      let content = `====================================\n`;
      content += `   🎰 LOTTO 6/45 행운의 번호 추천 🎰\n`;
      content += `====================================\n`;
      content += `추출일시: ${now.toLocaleString()}\n`;
      content += `추출게임: 총 ${AppState.drawnGames.length}게임\n`;
      content += `------------------------------------\n`;
      AppState.drawnGames.forEach((combo, i) => {
        const sum = combo.reduce((a, b) => a + b, 0);
        content += `[${alphabet[i] || i + 1}게임]  ${combo.map(n => String(n).padStart(2, ' ')).join('  ')}  (합: ${sum})\n`;
      });
      content += `------------------------------------\n`;
      content += `※ 동행복권 공식 사이트: https://www.dhlottery.co.kr\n`;
      content += `※ 본 번호는 행운을 기원하는 추천 조합입니다.\n`;
      content += `====================================\n`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `로또_행운번호_${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('텍스트 파일이 저장되었습니다! 📥');
    });
  }

  const soundBtn = document.getElementById('btn-sound-toggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      AppState.soundEnabled = !AppState.soundEnabled;
      soundBtn.innerHTML = AppState.soundEnabled ? '<i data-lucide="volume-2"></i>' : '<i data-lucide="volume-x"></i>';
      if (window.lucide) lucide.createIcons();
      showToast(AppState.soundEnabled ? '효과음 켜짐' : '효과음 꺼짐');
    });
  }

  initGameCountSelector();
  initHistoricalSearch();
  initFamousSpots();
  initVaultModal();
  initSajuModal();
  updateVaultBadge();
});

/**
 * LottoStream Live - Exact Stitch Physics & UI Engine
 */

// ==========================================================================
// Historical Database & Famous Spots
// ==========================================================================
const HISTORICAL_DATABASE = {
  1239: { date: '2026.08.29', numbers: [11, 13, 22, 32, 33, 36], bonus: 8, prize: '22억 1,479만 원', winners: '13명 (자동 10, 수동 2, 반자동 1)' },
  1238: { date: '2026.08.22', numbers: [4, 7, 14, 16, 38, 44], bonus: 20, prize: '27억 3,200만 원', winners: '10명 (자동 8, 수동 2)' },
  1237: { date: '2026.08.15', numbers: [1, 9, 18, 23, 35, 41], bonus: 12, prize: '21억 8,400만 원', winners: '12명 (자동 9, 수동 3)' },
  1161: { date: '2025.03.01', numbers: [2, 12, 20, 24, 34, 42], bonus: 37, prize: '17억 9,265만 원', winners: '16명 (자동 10, 수동 6)' },
  1160: { date: '2025.02.22', numbers: [3, 8, 17, 24, 33, 42], bonus: 11, prize: '28억 5,420만 원', winners: '10명 (자동 7, 수동 3)' }
};

// ==========================================================================
// Sound FX (Web Audio API)
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
          gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
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
  isRunning: false,
  extractedCount: 0,
  maxExtracts: 6,
  drawnGames: [],
  vault: JSON.parse(localStorage.getItem('lotto_mobile_vault') || '[]')
};

function getColorClass(num) {
  if (num <= 10) return 'ball-yellow';
  if (num <= 20) return 'ball-blue';
  if (num <= 30) return 'ball-red';
  if (num <= 40) return 'ball-grey';
  return 'ball-green';
}

function generateRandomCombo() {
  const nums = new Set();
  while (nums.size < 6) {
    nums.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(nums).sort((a, b) => a - b);
}

// ==========================================================================
// DOM Initializer & Broadcast Physics Engine
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const drum = document.getElementById('drumContainer');
  const extractBtn = document.getElementById('extractBtn');
  const btnLabel = document.getElementById('btn-extract-label');
  const resultsTray = document.getElementById('resultsTray');
  const spinHint = document.getElementById('spin-hint-text');
  const extraGamesList = document.getElementById('extra-games-list');
  const trayActions = document.getElementById('tray-actions-mini');
  
  const numBalls = 45;
  const balls = [];
  let lastTime = 0;

  // Initialize 45 3D Balls in Drum
  if (drum) {
    const drumWidth = drum.clientWidth || 360;
    const centerX = drumWidth / 2;
    const centerY = drumWidth / 2;

    for (let i = 1; i <= numBalls; i++) {
      const ball = document.createElement('div');
      ball.className = `lottery-ball ${getColorClass(i)}`;
      ball.textContent = i;
      
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * (centerX - 35);
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      ball.style.left = `0px`;
      ball.style.top = `0px`;

      ball.x = x - 22;
      ball.y = y - 22;
      ball.vx = (Math.random() - 0.5) * 4;
      ball.vy = (Math.random() - 0.5) * 4;
      ball.radius = 22;
      ball.isExtracted = false;

      drum.appendChild(ball);
      balls.push(ball);
    }
  }

  // Smooth TV Broadcast Physics Loop
  function animate(time) {
    const dt = lastTime ? Math.min((time - lastTime) / 16, 2) : 1;
    lastTime = time;

    const drumRect = drum.getBoundingClientRect();
    const drumRadius = drumRect.width / 2;
    const centerX = drumRadius;
    const centerY = drumRadius;

    // Gentle realistic broadcast physics (moderate speed, clear numbers)
    let gravity = AppState.isRunning ? 0.15 : 0.35;
    let friction = 0.985;
    let mixingForce = AppState.isRunning ? 1.6 : 0;

    balls.forEach((ball, i) => {
      if (ball.isExtracted) return;

      ball.vy += gravity * dt;

      // Swirl rotation in drum
      if (AppState.isRunning) {
        const dx = (ball.x + ball.radius) - centerX;
        const dy = (ball.y + ball.radius) - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        
        // Gentle rotational swirl
        ball.vx += (-dy / dist) * 0.45;
        ball.vy += (dx / dist) * 0.45;

        if (Math.random() < 0.08) {
          ball.vx += (Math.random() - 0.5) * mixingForce;
          ball.vy -= Math.random() * mixingForce * 1.5;
        }
      }

      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      
      ball.vx *= friction;
      ball.vy *= friction;

      // Circular collision detection with drum edge
      const dx = ball.x + ball.radius - centerX;
      const dy = ball.y + ball.radius - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > drumRadius - ball.radius) {
        const nx = dx / distance;
        const ny = dy / distance;

        const dot = ball.vx * nx + ball.vy * ny;
        ball.vx -= 1.7 * dot * nx;
        ball.vy -= 1.7 * dot * ny;

        ball.x = centerX + nx * (drumRadius - ball.radius) - ball.radius;
        ball.y = centerY + ny * (drumRadius - ball.radius) - ball.radius;
      }

      // Ball to Ball collision
      for (let j = i + 1; j < balls.length; j++) {
        const ball2 = balls[j];
        if (ball2.isExtracted) continue;

        const bx = ball.x - ball2.x;
        const by = ball.y - ball2.y;
        const bdist = Math.sqrt(bx * bx + by * by);
        const minDist = ball.radius + ball2.radius;

        if (bdist < minDist && bdist > 0) {
          const overlap = 0.5 * (minDist - bdist);
          const bnx = bx / bdist;
          const bny = by / bdist;

          ball.x += bnx * overlap;
          ball.y += bny * overlap;
          ball2.x -= bnx * overlap;
          ball2.y -= bny * overlap;

          const dot1 = ball.vx * bnx + ball.vy * bny;
          const dot2 = ball2.vx * bnx + ball2.vy * bny;

          ball.vx -= dot1 * bnx * 0.8;
          ball.vy -= dot1 * bny * 0.8;
          ball2.vx += dot2 * bnx * 0.8;
          ball2.vy += dot2 * bny * 0.8;
        }
      }

      // Speed limits for clear visual visibility
      const maxSpeed = AppState.isRunning ? 14 : 8;
      const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      if (speed > maxSpeed) {
        ball.vx = (ball.vx / speed) * maxSpeed;
        ball.vy = (ball.vy / speed) * maxSpeed;
      }

      ball.style.transform = `translate3d(${ball.x}px, ${ball.y}px, 0)`;
    });

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // Extract / Spin Button Click
  if (extractBtn) {
    extractBtn.addEventListener('click', () => {
      if (AppState.extractedCount >= AppState.maxExtracts) {
        // Reset Game
        AppState.extractedCount = 0;
        AppState.drawnGames = [];
        resultsTray.innerHTML = `
          <div class="result-slot">?</div>
          <div class="result-slot">?</div>
          <div class="result-slot">?</div>
          <div class="result-slot">?</div>
          <div class="result-slot">?</div>
          <div class="result-slot">?</div>
        `;
        if (extraGamesList) extraGamesList.innerHTML = '';
        if (trayActions) trayActions.style.display = 'none';

        balls.forEach(b => {
          b.isExtracted = false;
          b.style.display = 'flex';
          b.vx = (Math.random() - 0.5) * 6;
          b.vy = (Math.random() - 0.5) * 6;
        });

        btnLabel.textContent = 'START (추첨 시작)';
        extractBtn.classList.remove('bg-on-tertiary-container', 'text-white');
        extractBtn.classList.add('bg-primary-container', 'text-on-primary-container');
        if (spinHint) spinHint.textContent = '버튼을 누르면 실제 방송국 추첨기처럼 회전하며 번호가 추출됩니다.';
        return;
      }

      if (!AppState.isRunning) {
        // Start Spinning
        AppState.isRunning = true;
        btnLabel.textContent = 'STOP (번호 추출하기)';
        extractBtn.classList.remove('bg-primary-container', 'text-on-primary-container');
        extractBtn.classList.add('bg-on-tertiary-container', 'text-white');
        if (spinHint) spinHint.textContent = '원통이 회전 중입니다! 원하는 타이밍에 [STOP]을 눌러주세요.';
        
        balls.forEach(b => {
          if (!b.isExtracted) {
            b.vx += (Math.random() - 0.5) * 12;
            b.vy -= Math.random() * 12;
          }
        });
        sound.playPop(520);

      } else {
        // Stop and Extract all 6 balls with broadcast sequence
        AppState.isRunning = false;
        btnLabel.textContent = 'EXTRACTING... (추출 중)';
        extractBtn.disabled = true;

        const mainCombo = generateRandomCombo();
        const fullGames = [mainCombo];
        for (let g = 1; g < AppState.gameCount; g++) {
          fullGames.push(generateRandomCombo());
        }
        AppState.drawnGames = fullGames;

        // Sequentially reveal 6 balls
        mainCombo.forEach((num, idx) => {
          setTimeout(() => {
            const ballObj = balls.find(b => parseInt(b.textContent) === num && !b.isExtracted) || balls.find(b => !b.isExtracted);
            if (ballObj) {
              ballObj.isExtracted = true;
              ballObj.style.display = 'none';
            }

            const slot = resultsTray.querySelectorAll('.result-slot')[0];
            if (slot) {
              const resBall = document.createElement('div');
              resBall.className = `result-ball ${getColorClass(num)}`;
              resBall.textContent = num;
              resultsTray.replaceChild(resBall, slot);
            }
            sound.playPop(440 + idx * 60);

            if (idx === 5) {
              AppState.extractedCount = 6;
              extractBtn.disabled = false;
              btnLabel.textContent = 'RESET DRAW (다시 추첨)';
              if (spinHint) spinHint.textContent = '추첨이 완료되었습니다! 번호를 보관하거나 복사할 수 있습니다.';
              if (trayActions) trayActions.style.display = 'flex';
              
              // Render Multi-game list if > 1 game
              if (AppState.gameCount > 1 && extraGamesList) {
                const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
                extraGamesList.innerHTML = '';
                fullGames.slice(1).forEach((combo, gIdx) => {
                  const card = document.createElement('div');
                  card.className = 'flex items-center justify-between bg-surface-container/50 border border-white/5 p-2.5 rounded-xl';
                  const ballsHtml = combo.map(n => `<span class="result-ball ${getColorClass(n)} !w-8 !h-8 !text-xs">${n}</span>`).join('');
                  card.innerHTML = `
                    <span class="text-xs font-bold text-amber-300">${alphabet[gIdx + 1]}게임</span>
                    <div class="flex items-center gap-1.5">${ballsHtml}</div>
                  `;
                  extraGamesList.appendChild(card);
                });
              }

              sound.playFanfare();
              if (window.confetti) {
                confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
              }
            }
          }, (idx + 1) * 450);
        });
      }
    });
  }

  // Game Count Stepper
  const btnDec = document.getElementById('btn-decrease-games');
  const btnInc = document.getElementById('btn-increase-games');
  const displayCount = document.getElementById('display-game-count');

  if (btnDec && btnInc && displayCount) {
    btnDec.addEventListener('click', () => {
      if (AppState.gameCount > 1) {
        AppState.gameCount--;
        displayCount.textContent = AppState.gameCount;
        sound.playPop(400);
      }
    });
    btnInc.addEventListener('click', () => {
      if (AppState.gameCount < 10) {
        AppState.gameCount++;
        displayCount.textContent = AppState.gameCount;
        sound.playPop(600);
      }
    });
  }

  // Sound Toggle
  const btnSound = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  if (btnSound && soundIcon) {
    btnSound.addEventListener('click', () => {
      AppState.soundEnabled = !AppState.soundEnabled;
      soundIcon.textContent = AppState.soundEnabled ? 'volume_up' : 'volume_off';
    });
  }

  // Vault Management
  const btnVaultHeader = document.getElementById('btn-header-vault');
  const modalVault = document.getElementById('modal-vault');
  const btnCloseVault = document.getElementById('btn-close-vault');
  const vaultList = document.getElementById('vault-list-container');
  const vaultBadge = document.getElementById('vault-badge-count');
  const btnClearVault = document.getElementById('btn-clear-vault');
  const btnSaveAll = document.getElementById('btn-save-all');
  const btnCopyAll = document.getElementById('btn-copy-all');

  function updateVaultUI() {
    if (vaultBadge) vaultBadge.textContent = AppState.vault.length;
    if (vaultList) {
      if (AppState.vault.length === 0) {
        vaultList.innerHTML = '<p class="text-xs text-on-surface-variant text-center py-6">보관된 번호가 없습니다.</p>';
      } else {
        vaultList.innerHTML = AppState.vault.map((v, i) => `
          <div class="flex items-center justify-between bg-surface-container-highest/50 p-2.5 rounded-xl border border-white/5">
            <span class="text-xs font-bold text-amber-400">${v.label || `${i+1}게임`}</span>
            <div class="flex items-center gap-1">
              ${v.numbers.map(n => `<span class="result-ball ${getColorClass(n)} !w-6 !h-6 !text-[10px]">${n}</span>`).join('')}
            </div>
          </div>
        `).join('');
      }
    }
  }
  updateVaultUI();

  if (btnVaultHeader && modalVault) {
    btnVaultHeader.addEventListener('click', () => {
      updateVaultUI();
      modalVault.classList.add('active');
    });
  }
  if (btnCloseVault && modalVault) {
    btnCloseVault.addEventListener('click', () => modalVault.classList.remove('active'));
  }
  if (btnClearVault) {
    btnClearVault.addEventListener('click', () => {
      AppState.vault = [];
      localStorage.removeItem('lotto_mobile_vault');
      updateVaultUI();
    });
  }
  if (btnSaveAll) {
    btnSaveAll.addEventListener('click', () => {
      if (AppState.drawnGames.length === 0) return;
      const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      AppState.drawnGames.forEach((combo, idx) => {
        AppState.vault.push({
          label: `${alphabet[idx] || idx+1}게임`,
          numbers: combo,
          date: new Date().toLocaleDateString()
        });
      });
      localStorage.setItem('lotto_mobile_vault', JSON.stringify(AppState.vault));
      updateVaultUI();
      alert('보관함에 저장되었습니다!');
    });
  }
  if (btnCopyAll) {
    btnCopyAll.addEventListener('click', () => {
      if (AppState.drawnGames.length === 0) return;
      const text = AppState.drawnGames.map((g, i) => `${i+1}게임: ${g.join(', ')}`).join('\n');
      navigator.clipboard.writeText(text).then(() => alert('번호가 복사되었습니다!'));
    });
  }

  // Saju Modal
  const modalSaju = document.getElementById('modal-saju');
  const btnCloseSaju = document.getElementById('btn-close-saju');
  const navBtnSaju = document.getElementById('nav-btn-saju');
  const btnPaySaju = document.getElementById('btn-pay-and-generate');

  if (navBtnSaju && modalSaju) {
    navBtnSaju.addEventListener('click', () => modalSaju.classList.add('active'));
  }
  if (btnCloseSaju && modalSaju) {
    btnCloseSaju.addEventListener('click', () => modalSaju.classList.remove('active'));
  }
  if (btnPaySaju && modalSaju) {
    btnPaySaju.addEventListener('click', () => {
      const sajuNums = generateRandomCombo();
      alert(`[사주 맞춤 행운번호]\n${sajuNums.join(', ')}\n이번 주 대박을 기원합니다!`);
      modalSaju.classList.remove('active');
    });
  }

  // Round History Search
  const btnSearchRound = document.getElementById('btn-search-round');
  const inputRound = document.getElementById('input-round-search');
  const chips = document.querySelectorAll('.chip-round');

  function renderRound(r) {
    const data = HISTORICAL_DATABASE[r];
    if (!data) return;
    document.getElementById('card-round-title').textContent = `제 ${r}회 당첨번호`;
    document.getElementById('card-round-date').textContent = `${data.date} 추첨`;
    document.getElementById('card-prize-amount').textContent = data.prize;
    document.getElementById('card-winners-count').textContent = data.winners;
    
    const ballsBox = document.getElementById('card-round-balls');
    if (ballsBox) {
      ballsBox.innerHTML = data.numbers.map(n => `<div class="result-ball ${getColorClass(n)} !w-9 !h-9 !text-sm">${n}</div>`).join('');
    }
    const bonusBox = document.getElementById('card-bonus-ball');
    if (bonusBox) {
      bonusBox.className = `result-ball ${getColorClass(data.bonus)} !w-9 !h-9 !text-sm`;
      bonusBox.textContent = data.bonus;
    }
  }

  if (btnSearchRound && inputRound) {
    btnSearchRound.addEventListener('click', () => {
      const val = parseInt(inputRound.value, 10);
      if (HISTORICAL_DATABASE[val]) renderRound(val);
      else alert(`${val}회차 데이터는 현재 준비 중입니다.`);
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const r = parseInt(chip.getAttribute('data-round'), 10);
      if (inputRound) inputRound.value = r;
      renderRound(r);
    });
  });

  // Nav actions
  const navBtnDraw = document.getElementById('nav-btn-draw');
  const navBtnHistory = document.getElementById('nav-btn-history');
  const navBtnVault = document.getElementById('nav-btn-vault');

  if (navBtnDraw) navBtnDraw.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  if (navBtnHistory) navBtnHistory.addEventListener('click', () => document.getElementById('official-round-card')?.scrollIntoView({ behavior: 'smooth' }));
  if (navBtnVault && modalVault) navBtnVault.addEventListener('click', () => modalVault.classList.add('active'));
});

// 🎵 Sons utilisés
const eggClickSound = new Audio('../assets/sounds/mixkit-typewriter-soft-click-1125.wav');
const soundStart = new Audio('../assets/sounds/click-start.wav');
const soundClose = new Audio('../assets/sounds/click-close.wav');
const soundMinimize = new Audio('../assets/sounds/click-minimize.wav');

// 🔁 Variables globales
let cookingMusic = null;
let selectedType = null;
let softAlarm = null;

// ⏱️ Ajouts pour Pause/Reprendre/Reset
let currentInterval = null;
let remainingSeconds = 0;
let sessionInitialSeconds = 0;
let isPaused = false;

// ⏱️ Timer
function startTimer(durationInSeconds, onEndCallback) {
  if (currentInterval) {
    clearInterval(currentInterval);
    currentInterval = null;
  }
  remainingSeconds = durationInSeconds;
  sessionInitialSeconds = durationInSeconds;
  isPaused = false;
  const btnPause = document.getElementById('btn-pause');
  if (btnPause) btnPause.textContent = '⏸';
  const timerDisplay = document.getElementById('timer-display');

  const updateDisplay = () => {
    const minutes = Math.floor(Math.max(0, remainingSeconds) / 60);
    const seconds = Math.max(0, remainingSeconds) % 60;
    if (timerDisplay) {
      timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  updateDisplay();
  currentInterval = setInterval(() => {
    if (isPaused) return;
    remainingSeconds--;
    updateDisplay();
    if (remainingSeconds < 0) {
      clearInterval(currentInterval);
      currentInterval = null;
      if (typeof onEndCallback === 'function') onEndCallback();
    }
  }, 1000);
}

window.addEventListener('DOMContentLoaded', () => {
  const btnStart = document.getElementById('btn-start');
  const pageStart = document.getElementById('page-start');
  const pageMenu = document.getElementById('page-menu');
  const pageTimer = document.getElementById('page-timer');
  const pageEnd = document.getElementById('page-end');
  const timerEgg = document.getElementById('timer-egg');
  const endEgg = document.getElementById('end-egg');

  // ▶️ Page de démarrage
  btnStart?.addEventListener('click', () => {
    soundStart.currentTime = 0;
    soundStart.play();
    pageStart.classList.replace('visible', 'hidden');
    pageMenu.classList.replace('hidden', 'visible');
  });

  // 🔁 Fermer depuis la page de fin
  document.getElementById('btn-restart-app')?.addEventListener('click', () => {
    soundClose.currentTime = 0;
    soundClose.play();
    resetApp();
  });

  // 🥚 Sélection d'un œuf
  const cuissonOptions = document.querySelectorAll('.egg-option');
  const dureesCuisson = { coque: 210, mollet: 300, plat: 240, dur: 420 };

  cuissonOptions.forEach(option => {
    option.addEventListener('click', () => {
      eggClickSound.currentTime = 0;
      eggClickSound.play();
      const type = option.id.replace('cuisson-', '');
      selectedType = type;
      if (cookingMusic) { cookingMusic.pause(); cookingMusic.currentTime = 0; }
      cookingMusic = new Audio(`sounds/music-${type}.mp3`);
      cookingMusic.loop = true; cookingMusic.volume = 0.5; cookingMusic.play();
      timerEgg.src = `gifs/animation-${type}.gif?${Date.now()}`;
      pageMenu.classList.replace('visible', 'hidden');
      pageTimer.classList.replace('hidden', 'visible');
      startTimer(dureesCuisson[type], () => {
        if (cookingMusic) { cookingMusic.pause(); cookingMusic.currentTime = 0; }
        softAlarm = new Audio('sounds/egg-ready.wav'); softAlarm.volume = 0.6; softAlarm.play();
        endEgg.src = `img/egg-final-${selectedType}.png?${Date.now()}`;
        endEgg.classList.add('vibrate');
        pageTimer.classList.replace('visible', 'hidden');
        pageEnd.classList.replace('hidden', 'visible');
        document.getElementById('timer-display')?.classList.remove('hidden');
        document.getElementById('end-buttons-full')?.classList.remove('hidden');
        document.getElementById('end-button-final')?.classList.add('hidden');
      });
    });
  });

  // 💤 Snooze
  document.getElementById('btn-snooze')?.addEventListener('click', () => {
    soundStart.currentTime = 0;
    soundStart.play();
    if (softAlarm) { softAlarm.pause(); softAlarm.currentTime = 0; }
    document.getElementById('end-buttons-full')?.classList.add('hidden');
    document.getElementById('end-button-final')?.classList.add('hidden');
    document.getElementById('timer-display')?.classList.remove('hidden');
    startTimer(120, () => {
      softAlarm = new Audio('sounds/egg-ready.wav'); softAlarm.volume = 0.6; softAlarm.play();
      pageTimer.classList.replace('visible', 'hidden');
      pageEnd.classList.replace('hidden', 'visible');
      document.getElementById('timer-display')?.classList.add('hidden');
      document.getElementById('end-buttons-full')?.classList.remove('hidden');
    });
    pageEnd.classList.replace('visible', 'hidden');
    pageTimer.classList.replace('hidden', 'visible');
  });

  // ⏸️ Pause/Reprendre
  const btnPause = document.getElementById('btn-pause');
  btnPause?.addEventListener('click', () => {
    isPaused = !isPaused;
    btnPause.textContent = isPaused ? '▶' : '⏸';
    try { isPaused ? cookingMusic?.pause() : cookingMusic?.play(); } catch {}
  });

  // 🔄 Reset
  const btnReset = document.getElementById('btn-reset');
  if (btnReset) btnReset.textContent = '↻';
  btnReset?.addEventListener('click', () => {
    if (currentInterval === null && remainingSeconds <= 0) return;
    remainingSeconds = sessionInitialSeconds;
    isPaused = true;
    if (btnPause) btnPause.textContent = '▶';
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
      const m = Math.floor(remainingSeconds / 60);
      const s = remainingSeconds % 60;
      timerDisplay.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }
    try { cookingMusic?.pause(); if (cookingMusic) cookingMusic.currentTime = 0; } catch {}
  });

  // ⏱️ Clic sur le timer → ouvrir la modale
  const modalCustom = document.getElementById('modal-custom-time');
  const inputMin = document.getElementById('custom-min');
  const inputSec = document.getElementById('custom-sec');
  const btnApply = document.getElementById('custom-apply');
  const btnCancel = document.getElementById('custom-cancel');
  const timerDisplayEl = document.getElementById('timer-display');

  timerDisplayEl?.addEventListener('click', () => {
    const base = (remainingSeconds > 0) ? remainingSeconds : (sessionInitialSeconds || 300);
    inputMin.value = Math.floor(base / 60);
    inputSec.value = Math.floor(base % 60);
    modalCustom.classList.remove('hidden');
    modalCustom.setAttribute('aria-hidden', 'false');
    setTimeout(() => inputMin?.focus(), 0);
  });

  btnCancel?.addEventListener('click', () => {
    modalCustom.classList.add('hidden');
    modalCustom.setAttribute('aria-hidden', 'true');
  });

  modalCustom?.addEventListener('click', (e) => {
    if (e.target === modalCustom || e.target.classList.contains('modal-backdrop')) {
      modalCustom.classList.add('hidden');
      modalCustom.setAttribute('aria-hidden', 'true');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalCustom.classList.contains('hidden')) {
      modalCustom.classList.add('hidden');
      modalCustom.setAttribute('aria-hidden', 'true');
    }
  });

  btnApply?.addEventListener('click', () => {
    const m = Math.max(0, parseInt(inputMin.value || '0', 10));
    const s = Math.min(59, Math.max(0, parseInt(inputSec.value || '0', 10)));
    sessionInitialSeconds = m * 60 + s;
    remainingSeconds = sessionInitialSeconds;
    isPaused = true;
    if (btnPause) btnPause.textContent = '▶';
    timerDisplayEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    modalCustom.classList.add('hidden');
    modalCustom.setAttribute('aria-hidden', 'true');
  });

  // ⌨️ Raccourci espace = Pause/Reprendre
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      btnPause?.click();
    }
  });
});

// 🔘 Fenêtres
document.getElementById('btn-close')?.addEventListener('click', () => {
  soundClose.currentTime = 0;
  soundClose.play();
  window.electronAPI.closeWindow();
});

document.getElementById('btn-minimize')?.addEventListener('click', () => {
  soundMinimize.currentTime = 0;
  soundMinimize.play();
  window.electronAPI.minimizeWindow();
});

function resetApp() {
  if (cookingMusic) { cookingMusic.pause(); cookingMusic.currentTime = 0; }
  if (softAlarm) { softAlarm.pause(); softAlarm.currentTime = 0; }
  const endEgg = document.getElementById('end-egg');
  endEgg.src = ''; endEgg.classList.remove('vibrate');
  const timerDisplay = document.getElementById('timer-display');
  if (timerDisplay) { timerDisplay.textContent = ''; timerDisplay.classList.remove('hidden'); }
  document.getElementById('end-buttons-full')?.classList.remove('hidden');
  document.getElementById('end-button-final')?.classList.add('hidden');
  document.getElementById('end-text')?.classList.remove('hidden');
  const pageEnd = document.getElementById('page-end');
  const pageTimer = document.getElementById('page-timer');
  const pageMenu = document.getElementById('page-menu');
  const pageStart = document.getElementById('page-start');
  pageEnd.classList.replace('visible', 'hidden');
  pageTimer.classList.replace('visible', 'hidden');
  pageMenu.classList.replace('visible', 'hidden');
  pageStart.classList.replace('hidden', 'visible');
  selectedType = null;
}











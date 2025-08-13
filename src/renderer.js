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

/* ============================
   🔒 Sauvegarde des durées
============================= */
const LS_KEY_DURATIONS = 'eggTimer:durations';
const DEFAULT_DURATIONS = { coque: 210, mollet: 300, plat: 240, dur: 420 };
let CACHED_DURATIONS = null;

function loadDurations() {
  if (CACHED_DURATIONS) return CACHED_DURATIONS;
  try {
    const raw = localStorage.getItem(LS_KEY_DURATIONS);
    if (!raw) return CACHED_DURATIONS = { ...DEFAULT_DURATIONS };
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT_DURATIONS };
    Object.keys(parsed || {}).forEach(k => {
      const v = Number(parsed[k]);
      if (Number.isFinite(v) && v > 0) merged[k] = v;
    });
    return CACHED_DURATIONS = merged;
  } catch {
    return CACHED_DURATIONS = { ...DEFAULT_DURATIONS };
  }
}
function saveDurationsMap(map) {
  CACHED_DURATIONS = { ...map };
  localStorage.setItem(LS_KEY_DURATIONS, JSON.stringify(CACHED_DURATIONS));
}
function getDurationFor(type) {
  const map = loadDurations();
  const val = map[type];
  return Number.isFinite(val) && val > 0 ? val : (DEFAULT_DURATIONS[type] || 300);
}
function saveDurationForType(type, seconds) {
  if (!type || !Number.isFinite(seconds) || seconds <= 0) return;
  const map = loadDurations();
  map[type] = Math.floor(seconds);
  saveDurationsMap(map);
}

/* =============== */
/*    ⏱️ Timer     */
/* =============== */
function startTimer(durationInSeconds, onEndCallback) {
  if (currentInterval) clearInterval(currentInterval);
  remainingSeconds = durationInSeconds;
  sessionInitialSeconds = durationInSeconds;
  isPaused = false;
  const btnPause = document.getElementById('btn-pause');
  if (btnPause) btnPause.textContent = '⏸';
  const timerDisplay = document.getElementById('timer-display');
  const updateDisplay = () => {
    const minutes = Math.floor(Math.max(0, remainingSeconds) / 60);
    const seconds = Math.max(0, remainingSeconds) % 60;
    if (timerDisplay) timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

/* =============================== */
/*     🚀 Initialisation UI        */
/* =============================== */
window.addEventListener('DOMContentLoaded', () => {
  loadDurations();

  const btnStart = document.getElementById('btn-start');
  const pageStart = document.getElementById('page-start');
  const pageMenu = document.getElementById('page-menu');
  const pageTimer = document.getElementById('page-timer');
  const pageEnd = document.getElementById('page-end');
  const timerEgg = document.getElementById('timer-egg');
  const endEgg = document.getElementById('end-egg');

  // ▶️ Bouton démarrage
  btnStart?.addEventListener('click', () => {
    soundStart.play();
    pageStart.classList.replace('visible', 'hidden');
    pageMenu.classList.replace('hidden', 'visible');
  });

  // 🔁 Fermer depuis la page de fin
  document.getElementById('btn-restart-app')?.addEventListener('click', () => {
    soundClose.play();
    resetApp();
    hideBackButton();
  });

  // 🥚 Sélection d'un œuf
  const cuissonOptions = document.querySelectorAll('.egg-option');
  cuissonOptions.forEach(option => {
    option.addEventListener('click', () => {
      eggClickSound.play();
      const type = option.id.replace('cuisson-', '');
      selectedType = type;
      if (cookingMusic) cookingMusic.pause();
      cookingMusic = new Audio(`sounds/music-${type}.mp3`);
      cookingMusic.loop = true;
      cookingMusic.volume = 0.5;
      cookingMusic.play().catch(()=>{});
      if (timerEgg) timerEgg.src = `gifs/animation-${type}.gif?${Date.now()}`;
      pageMenu.classList.replace('visible', 'hidden');
      pageTimer.classList.replace('hidden', 'visible');
      showBackButton(); // 👈 Affiche la flèche
      startTimer(getDurationFor(type), () => {
        if (cookingMusic) cookingMusic.pause();
        softAlarm = new Audio('sounds/egg-ready.wav');
        softAlarm.volume = 0.6;
        softAlarm.play().catch(()=>{});
        if (endEgg) {
          endEgg.src = `img/egg-final-${selectedType}.png?${Date.now()}`;
          endEgg.classList.add('vibrate');
        }
        pageTimer.classList.replace('visible', 'hidden');
        pageEnd.classList.replace('hidden', 'visible');
        showBackButton(); // 👈 Affiche la flèche aussi sur page End
      });
    });
  });

  // 💤 Snooze
  document.getElementById('btn-snooze')?.addEventListener('click', () => {
    soundStart.play();
    if (softAlarm) softAlarm.pause();
    document.getElementById('end-buttons-full')?.classList.add('hidden');
    document.getElementById('end-button-final')?.classList.add('hidden');
    document.getElementById('timer-display')?.classList.remove('hidden');
    startTimer(120, () => {
      softAlarm = new Audio('sounds/egg-ready.wav');
      softAlarm.volume = 0.6;
      softAlarm.play().catch(()=>{});
      pageTimer.classList.replace('visible', 'hidden');
      pageEnd.classList.replace('hidden', 'visible');
    });
    pageEnd.classList.replace('visible', 'hidden');
    pageTimer.classList.replace('hidden', 'visible');
    showBackButton();
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
    if (cookingMusic) { cookingMusic.pause(); cookingMusic.currentTime = 0; }
  });

  // ⏲️ Modale durée personnalisée
  const modalCustom = document.getElementById('modal-custom-time');
  const inputMin = document.getElementById('custom-min');
  const inputSec = document.getElementById('custom-sec');
  const btnApply = document.getElementById('custom-apply');
  const btnCancel = document.getElementById('custom-cancel');
  const timerDisplayEl = document.getElementById('timer-display');

  timerDisplayEl?.addEventListener('click', () => {
    const base = (remainingSeconds > 0) ? remainingSeconds :
                 (sessionInitialSeconds > 0) ? sessionInitialSeconds :
                 (selectedType ? getDurationFor(selectedType) : 300);
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

  btnApply?.addEventListener('click', () => {
    const m = Math.max(0, parseInt(inputMin.value || '0', 10));
    const s = Math.min(59, Math.max(0, parseInt(inputSec.value || '0', 10)));
    const newSeconds = m * 60 + s;
    sessionInitialSeconds = newSeconds;
    remainingSeconds = sessionInitialSeconds;
    isPaused = true;
    if (btnPause) btnPause.textContent = '▶';
    timerDisplayEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    if (selectedType) saveDurationForType(selectedType, newSeconds);
    modalCustom.classList.add('hidden');
    modalCustom.setAttribute('aria-hidden', 'true');
  });

  // ⌨️ Espace = Pause/Reprendre
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      btnPause?.click();
    }
  });

  /* === Gestion flèche retour (#btn-back-menu) === */
  const btnBackMenu = document.getElementById('btn-back-menu');
  function showBackButton() { btnBackMenu?.classList.remove('hidden'); }
  function hideBackButton() { btnBackMenu?.classList.add('hidden'); }

  btnBackMenu?.addEventListener('click', () => {
    soundClose.currentTime = 0; // 🔊 son clic comme fermer/réduire
    soundClose.play();

    if (currentInterval) clearInterval(currentInterval);
    if (cookingMusic) { cookingMusic.pause(); cookingMusic.currentTime = 0; }
    isPaused = false;
    remainingSeconds = 0;
    document.getElementById('page-end')?.classList.replace('visible', 'hidden');
    document.getElementById('page-timer')?.classList.replace('visible', 'hidden');
    document.getElementById('page-menu')?.classList.replace('hidden', 'visible');
    hideBackButton();
    if (btnPause) btnPause.textContent = '⏸';
  });
});

/* === Fenêtres (Electron) === */
document.getElementById('btn-close')?.addEventListener('click', () => {
  soundClose.play();
  try { window.electronAPI.closeWindow(); } catch {}
});
document.getElementById('btn-minimize')?.addEventListener('click', () => {
  soundMinimize.play();
  try { window.electronAPI.minimizeWindow(); } catch {}
});

/* === Reset App === */
function resetApp() {
  if (cookingMusic) { cookingMusic.pause(); cookingMusic.currentTime = 0; }
  if (softAlarm) { softAlarm.pause(); softAlarm.currentTime = 0; }
  const endEgg = document.getElementById('end-egg');
  if (endEgg) { endEgg.src = ''; endEgg.classList.remove('vibrate'); }
  const timerDisplay = document.getElementById('timer-display');
  if (timerDisplay) { timerDisplay.textContent = ''; timerDisplay.classList.remove('hidden'); }
  document.getElementById('end-buttons-full')?.classList.remove('hidden');
  document.getElementById('end-button-final')?.classList.add('hidden');
  document.getElementById('end-text')?.classList.remove('hidden');
  document.getElementById('page-end')?.classList.replace('visible', 'hidden');
  document.getElementById('page-timer')?.classList.replace('visible', 'hidden');
  document.getElementById('page-menu')?.classList.replace('visible', 'hidden');
  document.getElementById('page-start')?.classList.replace('hidden', 'visible');
  selectedType = null;
}














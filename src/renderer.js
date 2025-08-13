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
   - Stockage par type (coque, mollet, plat, dur)
   - Restauration automatique au lancement
   - Sauvegarde automatique quand tu valides la modale
============================= */
const LS_KEY_DURATIONS = 'eggTimer:durations';

// Valeurs par défaut (reprend tes réglages initiaux)
const DEFAULT_DURATIONS = { coque: 210, mollet: 300, plat: 240, dur: 420 };

// Cache en mémoire (évite de relire à chaque clic)
let CACHED_DURATIONS = null;

function loadDurations() {
  if (CACHED_DURATIONS) return CACHED_DURATIONS;
  try {
    const raw = localStorage.getItem(LS_KEY_DURATIONS);
    if (!raw) {
      CACHED_DURATIONS = { ...DEFAULT_DURATIONS };
      return CACHED_DURATIONS;
    }
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT_DURATIONS };
    Object.keys(parsed || {}).forEach(k => {
      const v = Number(parsed[k]);
      if (Number.isFinite(v) && v > 0) merged[k] = v;
    });
    CACHED_DURATIONS = merged;
    return CACHED_DURATIONS;
  } catch {
    CACHED_DURATIONS = { ...DEFAULT_DURATIONS };
    return CACHED_DURATIONS;
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
  if (!type) return;
  if (!Number.isFinite(seconds) || seconds <= 0) return;
  const map = loadDurations();
  map[type] = Math.floor(seconds);
  saveDurationsMap(map);
}

/* =============== */
/*    ⏱️ Timer     */
/* =============== */
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

/* =============================== */
/*     🚀 Initialisation UI        */
/* =============================== */
window.addEventListener('DOMContentLoaded', () => {
  // Toujours charger en mémoire les durées au boot
  loadDurations();

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

  cuissonOptions.forEach(option => {
    option.addEventListener('click', () => {
      eggClickSound.currentTime = 0;
      eggClickSound.play();

      const type = option.id.replace('cuisson-', ''); // coque | mollet | plat | dur
      selectedType = type;

      // Musique de cuisson par type
      if (cookingMusic) { cookingMusic.pause(); cookingMusic.currentTime = 0; }
      cookingMusic = new Audio(`sounds/music-${type}.mp3`);
      cookingMusic.loop = true;
      cookingMusic.volume = 0.5;
      cookingMusic.play().catch(() => { /* ignore autoplay issues */ });

      // Animation correspondante
      if (timerEgg) {
        timerEgg.src = `gifs/animation-${type}.gif?${Date.now()}`;
      }

      // Navigation Menu -> Timer
      pageMenu.classList.replace('visible', 'hidden');
      pageTimer.classList.replace('hidden', 'visible');

      // ⏱️ Durée pour ce type (localStorage → sinon défaut)
      const durationSec = getDurationFor(type);

      // Démarre le timer
      startTimer(durationSec, () => {
        if (cookingMusic) { cookingMusic.pause(); cookingMusic.currentTime = 0; }
        softAlarm = new Audio('sounds/egg-ready.wav');
        softAlarm.volume = 0.6;
        softAlarm.play().catch(() => {});

        if (endEgg) {
          endEgg.src = `img/egg-final-${selectedType}.png?${Date.now()}`;
          endEgg.classList.add('vibrate');
        }

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
      softAlarm = new Audio('sounds/egg-ready.wav');
      softAlarm.volume = 0.6;
      softAlarm.play().catch(() => {});
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

  // 🔄 Reset (revient au début de la session en pause)
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

  /* ==============================
     ⏲️ Modale "durée personnalisée"
     - Clique sur l'afficheur -> modale
     - "Appliquer" => met à jour le timer
     - 🔥 Et enregistre AUTOMATIQUEMENT la durée pour le type courant
  =============================== */
  const modalCustom = document.getElementById('modal-custom-time');
  const inputMin = document.getElementById('custom-min');
  const inputSec = document.getElementById('custom-sec');
  const btnApply = document.getElementById('custom-apply');
  const btnCancel = document.getElementById('custom-cancel');
  const timerDisplayEl = document.getElementById('timer-display');

  timerDisplayEl?.addEventListener('click', () => {
    // Base proposée = temps restant > 0, sinon durée de la session, sinon durée stockée du type, sinon 300s
    const base =
      (remainingSeconds > 0) ? remainingSeconds :
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

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalCustom.classList.contains('hidden')) {
      modalCustom.classList.add('hidden');
      modalCustom.setAttribute('aria-hidden', 'true');
    }
  });

  btnApply?.addEventListener('click', () => {
    const m = Math.max(0, parseInt(inputMin.value || '0', 10));
    const s = Math.min(59, Math.max(0, parseInt(inputSec.value || '0', 10)));
    const newSeconds = m * 60 + s;

    // Met à jour la session courante (en pause par défaut)
    sessionInitialSeconds = newSeconds;
    remainingSeconds = sessionInitialSeconds;
    isPaused = true;

    const btnPauseEl = document.getElementById('btn-pause');
    if (btnPauseEl) btnPauseEl.textContent = '▶';

    if (timerDisplayEl) {
      timerDisplayEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }

    // 🔥 Autosave : enregistre pour le type sélectionné
    if (selectedType) {
      saveDurationForType(selectedType, newSeconds);
    }

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

/* ========================= */
/*   🔘 Fenêtres (Electron)  */
/* ========================= */
document.getElementById('btn-close')?.addEventListener('click', () => {
  soundClose.currentTime = 0;
  soundClose.play();
  try { window.electronAPI.closeWindow(); } catch {}
});

document.getElementById('btn-minimize')?.addEventListener('click', () => {
  soundMinimize.currentTime = 0;
  soundMinimize.play();
  try { window.electronAPI.minimizeWindow(); } catch {}
});

/* ========================= */
/*      ♻️ Reset App         */
/* ========================= */
function resetApp() {
  if (cookingMusic) { cookingMusic.pause(); cookingMusic.currentTime = 0; }
  if (softAlarm) { softAlarm.pause(); softAlarm.currentTime = 0; }

  const endEgg = document.getElementById('end-egg');
  if (endEgg) {
    endEgg.src = '';
    endEgg.classList.remove('vibrate');
  }

  const timerDisplay = document.getElementById('timer-display');
  if (timerDisplay) {
    timerDisplay.textContent = '';
    timerDisplay.classList.remove('hidden');
  }

  document.getElementById('end-buttons-full')?.classList.remove('hidden');
  document.getElementById('end-button-final')?.classList.add('hidden');
  document.getElementById('end-text')?.classList.remove('hidden');

  const pageEnd = document.getElementById('page-end');
  const pageTimer = document.getElementById('page-timer');
  const pageMenu = document.getElementById('page-menu');
  const pageStart = document.getElementById('page-start');

  pageEnd?.classList.replace('visible', 'hidden');
  pageTimer?.classList.replace('visible', 'hidden');
  pageMenu?.classList.replace('visible', 'hidden');
  pageStart?.classList.replace('hidden', 'visible');

  selectedType = null;
}












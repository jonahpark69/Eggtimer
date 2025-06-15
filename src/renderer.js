// 🎵 Sons utilisés
const eggClickSound = new Audio('../assets/sounds/mixkit-typewriter-soft-click-1125.wav');
const soundStart = new Audio('../assets/sounds/click-start.wav');
const soundClose = new Audio('../assets/sounds/click-close.wav');
const soundMinimize = new Audio('../assets/sounds/click-minimize.wav');

// 🔁 Variables globales
let cookingMusic = null;
let selectedType = null;
let softAlarm = null;

// ⏱️ Timer
function startTimer(durationInSeconds, onEndCallback) {
  let remainingTime = durationInSeconds;
  const timerDisplay = document.getElementById('timer-display');

  const updateDisplay = () => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  updateDisplay();

  const interval = setInterval(() => {
    remainingTime--;
    updateDisplay();

    if (remainingTime < 0) {
      clearInterval(interval);
      if (typeof onEndCallback === 'function') {
        onEndCallback();
      }
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
    pageStart.classList.remove('visible');
    pageStart.classList.add('hidden');
    pageMenu.classList.remove('hidden');
    pageMenu.classList.add('visible');
  });

  // 🔁 Fermer depuis la page de fin (revenir à la page start)
  document.getElementById('btn-restart-app')?.addEventListener('click', () => {
    soundClose.currentTime = 0;
    soundClose.play();
    resetApp();
  });

  // 🥚 Sélection d'un œuf
  const cuissonOptions = document.querySelectorAll('.egg-option');
  const dureesCuisson = {
    coque: 210,
    mollet: 300,
    plat: 240,
    dur: 420
  };

  cuissonOptions.forEach(option => {
    option.addEventListener('click', () => {
      eggClickSound.currentTime = 0;
      eggClickSound.play();

      const type = option.id.replace('cuisson-', '');
      selectedType = type;

      if (cookingMusic) {
        cookingMusic.pause();
        cookingMusic.currentTime = 0;
      }

      cookingMusic = new Audio(`sounds/music-${type}.mp3`);
      cookingMusic.loop = true;
      cookingMusic.volume = 0.5;
      cookingMusic.play();

      timerEgg.src = `gifs/animation-${type}.gif?${Date.now()}`;

      pageMenu.classList.remove('visible');
      pageMenu.classList.add('hidden');
      pageTimer.classList.remove('hidden');
      pageTimer.classList.add('visible');

      startTimer(dureesCuisson[type], () => {
        if (cookingMusic) {
          cookingMusic.pause();
          cookingMusic.currentTime = 0;
        }

        softAlarm = new Audio('sounds/egg-ready.wav');
        softAlarm.volume = 0.6;
        softAlarm.play();

        endEgg.src = `img/egg-final-${selectedType}.png?${Date.now()}`;
        endEgg.classList.add('vibrate');

        pageTimer.classList.remove('visible');
        pageTimer.classList.add('hidden');
        pageEnd.classList.remove('hidden');
        pageEnd.classList.add('visible');

        document.getElementById('timer-display')?.classList.remove('hidden');
        document.getElementById('end-buttons-full')?.classList.remove('hidden');
        document.getElementById('end-button-final')?.classList.add('hidden');
      });
    });
  });

  document.getElementById('btn-snooze')?.addEventListener('click', () => {
    soundStart.currentTime = 0;
    soundStart.play();

    if (softAlarm) {
      softAlarm.pause();
      softAlarm.currentTime = 0;
    }

    document.getElementById('end-buttons-full')?.classList.add('hidden');
    document.getElementById('end-button-final')?.classList.add('hidden');
    document.getElementById('timer-display')?.classList.remove('hidden');

    startTimer(120, () => {
      softAlarm = new Audio('sounds/egg-ready.wav');
      softAlarm.volume = 0.6;
      softAlarm.play();

      pageTimer.classList.remove('visible');
      pageTimer.classList.add('hidden');
      pageEnd.classList.remove('hidden');
      pageEnd.classList.add('visible');

      document.getElementById('timer-display')?.classList.add('hidden');
      document.getElementById('end-buttons-full')?.classList.remove('hidden');
    });

    pageEnd.classList.remove('visible');
    pageEnd.classList.add('hidden');
    pageTimer.classList.remove('hidden');
    pageTimer.classList.add('visible');
  });
});

// 🔘 Fenêtres (boutons haut droite)
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
  if (cookingMusic) {
    cookingMusic.pause();
    cookingMusic.currentTime = 0;
  }
  if (softAlarm) {
    softAlarm.pause();
    softAlarm.currentTime = 0;
  }

  const endEgg = document.getElementById('end-egg');
  endEgg.src = '';
  endEgg.classList.remove('vibrate');

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

  pageEnd.classList.remove('visible');
  pageEnd.classList.add('hidden');
  pageTimer.classList.remove('visible');
  pageTimer.classList.add('hidden');
  pageMenu.classList.remove('visible');
  pageMenu.classList.add('hidden');

  pageStart.classList.remove('hidden');
  pageStart.classList.add('visible');

  selectedType = null;
}






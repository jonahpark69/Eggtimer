// 🎵 Sons utilisés
const eggClickSound = new Audio('../assets/sounds/mixkit-typewriter-soft-click-1125.wav');
const soundStart = new Audio('../assets/sounds/click-start.wav');
const soundClose = new Audio('../assets/sounds/click-close.wav');
const soundMinimize = new Audio('../assets/sounds/click-minimize.wav');

window.addEventListener('DOMContentLoaded', () => {
  const btnStart = document.getElementById('btn-start');
  const pageStart = document.getElementById('page-start');
  const pageMenu = document.getElementById('page-menu');
  const pageTimer = document.getElementById('page-timer');
  const timerEgg = document.getElementById('timer-egg');

  // ▶️ Bouton Start
  if (btnStart && pageStart && pageMenu) {
    btnStart.addEventListener('click', () => {
      soundStart.currentTime = 0;
      soundStart.play();

      pageStart.classList.remove('visible');
      pageStart.classList.add('hidden');
      pageMenu.classList.remove('hidden');
      pageMenu.classList.add('visible');
    });
  }

  // 🥚 Clic sur un œuf de cuisson
 let cookingMusic = null; // à déclarer tout en haut de ton fichier si ce n’est pas encore fait

const cuissonOptions = document.querySelectorAll('.egg-option');

cuissonOptions.forEach(option => {
  option.addEventListener('click', () => {
    eggClickSound.currentTime = 0;
    eggClickSound.play();

    const type = option.id.replace('cuisson-', ''); // ex: 'coque', 'dur', etc.

    // 🎵 Stopper une éventuelle musique précédente
    if (cookingMusic) {
      cookingMusic.pause();
      cookingMusic.currentTime = 0;
    }

    // 🎵 Jouer la musique correspondant à la cuisson
    cookingMusic = new Audio(`sounds/music-${type}.mp3`);
    cookingMusic.loop = true;
    cookingMusic.volume = 0.5; // ajuste si besoin
    cookingMusic.play();

    // 📺 Passage à la page minuteur
    pageMenu.classList.remove('visible');
    pageMenu.classList.add('hidden');
    pageTimer.classList.remove('hidden');
    pageTimer.classList.add('visible');

    // 🎞️ Affichage du GIF animé correspondant à l'œuf sélectionné
    timerEgg.src = `gifs/animation-${type}.gif?${Date.now()}`;
  });
});


});

// 🔘 Boutons de fenêtre
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







const eggClickSound = new Audio('../assets/sounds/mixkit-typewriter-soft-click-1125.wav');
const soundStart = new Audio('../assets/sounds/click-start.wav');
const soundClose = new Audio('../assets/sounds/click-close.wav');
const soundMinimize = new Audio('../assets/sounds/click-minimize.wav');


window.addEventListener('DOMContentLoaded', () => {
  const btnStart = document.getElementById('btn-start');
  const pageStart = document.getElementById('page-start');
  const pageMenu = document.getElementById('page-menu');

  console.log('⏳ Vérification DOM…');
  console.log('StartButton:', btnStart);
  console.log('Page Start:', pageStart);
  console.log('Page Menu:', pageMenu);

  if (btnStart && pageStart && pageMenu) {
    console.log('✅ Tout est prêt. Activation du bouton Start.');
    btnStart.addEventListener('click', () => {
  soundStart.currentTime = 0;
  soundStart.play();

  pageStart.classList.remove('visible');
  pageStart.classList.add('hidden');
  pageMenu.classList.remove('hidden');
  pageMenu.classList.add('visible');
});

  } else {
    console.warn('⛔ Élément(s) manquant(s) pour le bouton Start');
  }

  // 🥚 Gérer le clic sur chaque option de cuisson
  const cuissonOptions = document.querySelectorAll('.egg-option');

  cuissonOptions.forEach(option => {
  option.addEventListener('click', () => {
    eggClickSound.currentTime = 0; // remet au début
    eggClickSound.play();

    const type = option.id.replace('cuisson-', '');
    alert(`Tu as choisi un œuf ${type} !`);
    // Ici on pourra charger la page timer plus tard
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







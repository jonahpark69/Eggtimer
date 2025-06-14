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
      pageStart.classList.remove('visible');
      pageStart.classList.add('hidden');
      pageMenu.classList.remove('hidden');
      pageMenu.classList.add('visible');
    });
  } else {
    console.warn('⛔ Élément(s) manquant(s) pour le bouton Start');
  }
});



// Boutons de fenêtre
document.getElementById('btn-close').addEventListener('click', () => {
  window.electronAPI.closeWindow();
});

document.getElementById('btn-minimize').addEventListener('click', () => {
  window.electronAPI.minimizeWindow();
});





const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
  width: 425,
  height: 525,
  resizable: false,
  useContentSize: true,
  webPreferences: {
  preload: path.join(__dirname, 'src/preload.js')
}


});


  win.loadFile('src/index.html');
}

app.whenReady().then(createWindow);



const { ipcMain } = require('electron');

ipcMain.on('close-window', () => {
  BrowserWindow.getFocusedWindow().close();
});

ipcMain.on('minimize-window', () => {
  BrowserWindow.getFocusedWindow().minimize();
});






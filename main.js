const path = require('path');
const { app, BrowserWindow } = require('electron')

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Desktop Organiser',
    width: 800,
    height: 500,
  });
 
  mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

app.whenReady().then(() => {
  createMainWindow();
})
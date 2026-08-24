const path = require('path');
const { app, BrowserWindow, shell, ipcMain } = require('electron')

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Desktop Organiser',
    width: isDev ? 1300 : 800,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, './scripts/preload.js'),
      contextIsolation: true,
    }
  });
  
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})  

ipcMain.handle("openWebsite", () => {
  shell.openExternal("https://youtube.com")
})
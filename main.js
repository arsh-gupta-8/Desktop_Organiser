const path = require('path');
const { app, BrowserWindow, shell, ipcMain } = require('electron')
const fs = require('fs/promises');

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

ipcMain.handle("openWebsite", (event, targetUrl) => {
  shell.openExternal(targetUrl)
})

ipcMain.handle('getShortcuts', async () => {
  try {
    const filePath = path.join(__dirname, 'shortcuts.json');
    const rawData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Failed to read JSON file:', error);
    return null;
  }
});
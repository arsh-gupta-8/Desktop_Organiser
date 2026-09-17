const path = require('path');
const { app, BrowserWindow, shell, ipcMain, dialog } = require('electron')
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
  console.log("Opening domain.. ", targetUrl)
  shell.openExternal(targetUrl);
})

ipcMain.handle("openApp", (event, targetPath) => {
  console.log("Opening app.. ", targetPath)
  shell.openPath(targetPath);
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

ipcMain.handle("createShortcut", async (event, shortcutInfo) => {
  try {
    const filePath = path.join(__dirname, 'shortcuts.json');
    const data = await fs.readFile(filePath, 'utf-8');
    
    let shortcutsList = JSON.parse(data);
    shortcutsList.push(shortcutInfo);
    let updatedList = JSON.stringify(shortcutsList);
    
    await fs.writeFile(filePath, updatedList, 'utf-8');
    console.log("Added new shortcut");
  } catch (error) {
    console.error('Failed to write to JSON file:', error);
    return null;
  }
})

async function getPath() {
  const pathResult = await dialog.showOpenDialog({
    title: "Select an application",
    properties: ['openFile'],
    filters: [
      { name: 'Applications', extensions: ['exe', 'app', 'bat', 'sh', 'lnk'] }
    ]
  });

  return pathResult;
};

ipcMain.handle("createAppShortcut", async (event, shortcutInfo) => {
  
  const shortcutPath = await getPath();

  if (!shortcutPath.canceled && shortcutPath.filePaths.length > 0) {

    const filePath = path.join(__dirname, 'shortcuts.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const iconImage = await app.getFileIcon(shortcutPath.filePaths[0], { size: isMac ? 'normal' : 'large' });
    
    let shortcutsList = JSON.parse(data);
    shortcutInfo.path = shortcutPath.filePaths[0];
    shortcutInfo.icon = iconImage.toDataURL();
    shortcutsList.push(shortcutInfo);
     
    let updatedList = JSON.stringify(shortcutsList);
    
    await fs.writeFile(filePath, updatedList, 'utf-8');
    console.log("Added new shortcut");
  } else {
    console.log("No application selected.");
  }
})
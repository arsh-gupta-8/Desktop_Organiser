const path = require('path');
const { app, BrowserWindow, shell, ipcMain, dialog } = require('electron')
const fs = require('fs/promises');

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

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

async function getMacAppIconBase64(appPath) {
  const escapedPath = appPath.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  const swiftCommand = `swift -e "
  import Cocoa
  let path = \\"${escapedPath}\\"
  let icon = NSWorkspace.shared.icon(forFile: path)
  if icon.size.width > 0,
     let tiff = icon.tiffRepresentation, 
     let bitmap = NSBitmapImageRep(data: tiff), 
     let png = bitmap.representation(using: .png, properties: [:]) {
      print(png.base64EncodedString(options: []))
  }
  "`;

  try {
    const { stdout } = await execPromise(swiftCommand, {maxBuffer: 1024 * 1024 * 5});
    const base64Data = stdout.trim();
    if (base64Data) {
      return `data:image/png;base64,${base64Data}`;
    }
  } catch (err) {
    console.error("Swift extraction failed, falling back to Electron API", err);
  }
  return null;
}

// Your Handler
ipcMain.handle("createAppShortcut", async (event, shortcutInfo) => {
  const shortcutPath = await getPath();

  if (!shortcutPath.canceled && shortcutPath.filePaths.length > 0) {
    const filePath = path.join(__dirname, 'shortcuts.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const selectedAppPath = shortcutPath.filePaths[0];

    let iconDataUrl = "";

    if (isMac && selectedAppPath.endsWith('.app')) {
      iconDataUrl = await getMacAppIconBase64(selectedAppPath);
    } else {
      const iconImage = await app.getFileIcon(selectedAppPath, { size: 'large' });
      iconDataUrl = iconImage.toDataURL();
    }
    
    let shortcutsList = JSON.parse(data);
    shortcutInfo.path = selectedAppPath;
    shortcutInfo.icon = iconDataUrl;
    shortcutsList.push(shortcutInfo);
     
    let updatedList = JSON.stringify(shortcutsList);
    await fs.writeFile(filePath, updatedList, 'utf-8');
    console.log("Added new shortcut with crisp app icon!");
  } else {
    console.log("No application selected.");
  }
});
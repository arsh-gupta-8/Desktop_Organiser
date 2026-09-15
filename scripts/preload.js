const { contextBridge, ipcMain, ipcRenderer } = require('electron');

let indexBridge = {
  openWebsite: async (targetUrl) => {
    await ipcRenderer.invoke("openWebsite", targetUrl)
  },

  getShortcuts: async () => {
    return await ipcRenderer.invoke('getShortcuts')
  },

  createShortcut: async (shortcutInfo) => {
    await ipcRenderer.invoke("createShortcut", shortcutInfo)
  },

  createAppShortcut: async (shortcutInfo) => {
    await ipcRenderer.invoke("createAppShortcut", shortcutInfo)
  },
}

contextBridge.exposeInMainWorld("indexBridge", indexBridge)
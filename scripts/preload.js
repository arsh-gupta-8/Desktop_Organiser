const { contextBridge, ipcMain, ipcRenderer } = require('electron');

let indexBridge = {
  openWebsite: async (targetUrl) => {
    await ipcRenderer.invoke("openWebsite", targetUrl)
  },

  getShortcuts: async () => {
    return await ipcRenderer.invoke('getShortcuts')
  },
}

contextBridge.exposeInMainWorld("indexBridge", indexBridge)
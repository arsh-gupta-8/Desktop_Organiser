const { contextBridge, ipcMain, ipcRenderer } = require('electron');

let indexBridge = {
  openWebsite: async (targetUrl) => {
    await ipcRenderer.invoke("openWebsite", targetUrl)
  }
}

contextBridge.exposeInMainWorld("indexBridge", indexBridge)
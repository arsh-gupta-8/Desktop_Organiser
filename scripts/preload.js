const { contextBridge, ipcMain, ipcRenderer } = require('electron');

let indexBridge = {
  openWebsite: async () => {
    await ipcRenderer.invoke("openWebsite")
  }
}

contextBridge.exposeInMainWorld("indexBridge", indexBridge)
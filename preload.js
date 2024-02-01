const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getStockName: () => ipcRenderer.invoke('getStockName'),
});

console.log('preload.js loaded');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getStockName: () => ipcRenderer.invoke('getStockName'),
    getStocks: () => ipcRenderer.invoke('getStocks'),
});

console.log('preload.js loaded');


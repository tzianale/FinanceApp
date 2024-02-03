const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getStocks: () => ipcRenderer.invoke('getStocks'),
    onStockUpdate: (callback) => ipcRenderer.on('stock-update', (_, data) => callback(data)),
});

console.log('preload.js loaded');



const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    onStockUpdate: (callback) => ipcRenderer.on('stock-update', (_, data) => callback(data)),
    sendStockSymbol: (symbol) => ipcRenderer.send('add-stock', symbol),
    removeStock: (symbol) => ipcRenderer.send('remove-stock', symbol),
});

console.log('preload.js loaded');



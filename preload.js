const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getStocks: () => ipcRenderer.invoke('getStocks'),
    onStockUpdate: (callback) => ipcRenderer.on('stock-update', (_, data) => callback(data)),
    sendStockSymbol: (symbol) => ipcRenderer.send('add-stock', symbol)
});

console.log('preload.js loaded');



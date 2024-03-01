const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    onStockUpdate: (callback) => ipcRenderer.on('stock-update', (_, data) => callback(data)),
    sendStockSymbol: (symbol) => ipcRenderer.send('add-stock', symbol),
    removeStock: (symbol) => ipcRenderer.send('remove-stock', symbol),
    requestStockData: () => ipcRenderer.send('request-stock-data'),
    setAPIKey: (key) => ipcRenderer.send('set-api-key', key)
});

console.log('preload.js loaded');



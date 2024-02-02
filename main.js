import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import Stock from './src/stock.mjs';
import StockManager from './src/stockmanager.mjs';
import { fileURLToPath } from 'url';
import stockapi from './src/stockapi.mjs';

const isMac = process.platform === 'darwin';        // Check if the platform is Mac 
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create main window
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Adjust path as necessary
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        },
        title: 'Finance App',
        width:  1000,
        height: 600,
        autoHideMenuBar: true,

    });
    console.log('main.js loaded');
    mainWindow.webContents.openDevTools();
    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
    mainWindow.setMenu(null);
}



// Stocks stuff
const stockManager = new StockManager();
const stock1 = new Stock('AAPL', 'USD', 'NASDAQ', 150, 1000000);
const stock2 = new Stock('GOOGL', 'USD', 'NASDAQ', 2500, 5000000);
const stock3 = new Stock('MSFT', 'USD', 'NASDAQ', 300, 1000000);
const stock4 = new Stock('TSLA', 'USD', 'NASDAQ', 700, 300000);
stockManager.addStock(stock1);
stockManager.addStock(stock2);
stockManager.addStock(stock3);
stockManager.addStock(stock4);

// Usage
const apiKey = '820dce8b60af47cd923c5302d5ea7cde'; // Replace with your actual Twelve Data API key
const symbols = 'AAPL'; // Example symbols
const client = new stockapi(apiKey, symbols, 5000); // Close after 5000 ms = 5 seconds
client.connect();



// Handle IPC events in main process
ipcMain.handle('getStockName', async () => {
    return 'AAPL'; // Example: return a stock name; replace with actual logic as needed
});

ipcMain.handle('getStocks', async () => {
    return stockManager.stocks; // Example: return stocks; replace with actual logic as needed
});












// When app is ready, create a new window
app.whenReady().then(() => {
    createMainWindow();

    // When app is activated, create a new window if there are no windows open
    app.on('activate', () => {                  
        if(BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {           
    if(!isMac) {
        app.quit();
    }
});
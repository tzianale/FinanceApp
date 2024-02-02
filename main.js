import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import StockManager from './src/stockmanager.mjs';
import { fileURLToPath } from 'url';
import stockapi from './src/stockapi.mjs';

const isMac = process.platform === 'darwin';        // Check if the platform is Mac 
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create main window
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
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


    // Setup the client event listener inside createMainWindow to ensure mainWindow is available
    client.on('updateStock', (data) => {
        stockManager.updateData(data);
        let stocks  = stockManager.stocks
        mainWindow.webContents.send('stock-update', stocks);
    });

}



// Stocks stuff
const stockManager = new StockManager();
stockManager.createNewStock('AAPL', 'USD', 'NASDAQ', 150, 1000000);
stockManager.createNewStock('EUR/USD', 'USD', 'Forex', 2500, 2000000);
stockManager.createNewStock('BTC/USD', 'USD', 'Crypto', 200, 3000000);
stockManager.createNewStock('VFIAX', 'USD', 'NASDAQ', 150, 1000000);

// Usage
const apiKey = '820dce8b60af47cd923c5302d5ea7cde'; // Replace with your actual Twelve Data API key
const symbols = 'AAPL,EUR/USD,BTC/USD,VFIAX';
const client = new stockapi(apiKey, symbols); // Close after 5000 ms = 5 seconds
client.connect();


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
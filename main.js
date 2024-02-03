import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import StockManager from './src/stockmanager.mjs';
import { fileURLToPath } from 'url';

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

    const stockManager = new StockManager();
    mainWindow.webContents.openDevTools();
    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
    mainWindow.setMenu(null);

    ipcMain.on('add-stock', (symbol) => {
        console.log('Stock symbol received:', symbol);
    });

    stockManager.on('updated', (stocks) => {
        mainWindow.webContents.send('stock-update', stocks);
    });

}


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
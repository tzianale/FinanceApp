const path = require('path');
const {app, BrowserWindow, ipcMain  } = require('electron');

const isMac = process.platform === 'darwin';        // Check if the platform is Mac 

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

ipcMain.handle('getStockName', async () => {
    return 'AAPL'; // Example: return a stock name; replace with actual logic as needed
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
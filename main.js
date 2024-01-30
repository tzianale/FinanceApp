const path = require('path');
const {app, BrowserWindow } = require('electron');

const isMac = process.platform === 'darwin';        // Check if the platform is Mac 
const isDev = process.env.NODE_ENV !== 'production';   // Check if the app is in development mode

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Finance App',
        width: isDev? 1000 : 500,
        height: 600

    });

    // Open dev tools if in development mode
    /*
    if(isDev) {
        mainWindow.webContents.openDevTools();
    }
    */

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

app.whenReady().then(() => {
    createMainWindow();

    app.on('activate', () => {                  // When app is activated, create a new window if there are no windows open
        if(BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});


app.on('window-all-closed', () => {             // Quit when all windows are closed
    if(!isMac) {
        app.quit();
    }
});
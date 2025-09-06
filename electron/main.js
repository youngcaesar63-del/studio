
const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    width: Math.floor(width * 0.8),
    height: Math.floor(height * 0.9),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, '../public/icon.png'),
  });

  const appUrl = dev
    ? 'http://localhost:9002' // URL for development server
    : `file://${path.join(__dirname, '../out/index.html')}`; // Path to production build

  mainWindow.loadURL(appUrl);

  if (dev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

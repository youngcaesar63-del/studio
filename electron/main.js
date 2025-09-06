
const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: path.join(__dirname, '..') });
const handle = nextApp.getRequestHandler();

let server;
let mainWindow;

async function createWindow() {
  await nextApp.prepare();

  if (!server) {
    server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
      
      const { width, height } = screen.getPrimaryDisplay().workAreaSize;

      mainWindow = new BrowserWindow({
        width: Math.floor(width * 0.8),
        height: Math.floor(height * 0.9),
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
        icon: path.join(__dirname, '../public/icon.png'),
      });
      
      mainWindow.loadURL('http://localhost:3000');

      if (dev) {
        mainWindow.webContents.openDevTools();
      }

      mainWindow.on('closed', () => {
        mainWindow = null;
      });
    });
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

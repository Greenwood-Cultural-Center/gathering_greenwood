import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development' && !app.isPackaged; // Check if the app is in development mode

const createWindow = () => {
  const iconPath = isDev
    ? path.join(__dirname, '../public/gcc.ico') // Path in development
    : path.join(__dirname, 'gcc.ico'); // Path in production (copied to dist)

  const win = new BrowserWindow({
    width: 3840,
    height: 2160,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: iconPath,
  });

  if (isDev) {
    // Load the Vite development server URL
    win.loadURL('http://localhost:5173');
  } else {
    // Load the built index.html file
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
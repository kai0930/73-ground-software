import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  Menu,
  type MenuItemConstructorOptions,
  type MenuItem,
} from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { SerialPort } from 'serialport';

// アイコン
import iconWinLinux from '../../resources/icon-win-linux.ico?asset';
import iconMac from '../../resources/icon-mac.png?asset';

const APP_CONFIG = {
  name: 'GroundSorfware',
  version: '1.0.0',
  buildVersion: 'build20250212',
  authors: ['Gamo Kaishu'] as string[],
  copyright: 'Copyright © http://localhost:5173/src/assets/logo-with-text.svg2025 Ground software',
  appId: 'com.electron.73-ground-software',
} as const;

const WINDOW_DEFAULT_CONFIG = {
  width: 1000,
  height: 730,
  show: false,
  autoHideMenuBar: true,
  backgroundColor: '#2b2b2b',
} as const;

const ports = {
  uplink: null as SerialPort | null,
  downlink: null as SerialPort | null,
};

function initializeApp(): void {
  app.setAboutPanelOptions({
    applicationName: APP_CONFIG.name,
    applicationVersion: APP_CONFIG.version,
    version: APP_CONFIG.buildVersion,
    authors: APP_CONFIG.authors,
    copyright: APP_CONFIG.copyright,
    iconPath: process.platform === 'win32' ? iconWinLinux : iconMac,
  });

  if (process.platform === 'darwin') {
    app.dock.setIcon(iconMac);
  }

  electronApp.setAppUserModelId(APP_CONFIG.appId);
}

function createWindow(): void {
  const windowOptions: Electron.BrowserWindowConstructorOptions = {
    ...WINDOW_DEFAULT_CONFIG,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  };

  if (process.platform === 'win32' || process.platform === 'linux') {
    windowOptions.icon = iconWinLinux;
  }

  const mainWindow = new BrowserWindow(windowOptions);

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  setupWindowHandlers(mainWindow);
  loadAppContent(mainWindow);
}

function setupWindowHandlers(window: BrowserWindow): void {
  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });
}

function loadAppContent(window: BrowserWindow): void {
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

function setAppMenu() {
  const template = [
    ...(isMacOS()
      ? [
          {
            label: 'Ground Software',
            submenu: [
              {
                label: '設定',
                click: () => {
                  console.log('setAppMenu', 'setting');
                  const win = BrowserWindow.getFocusedWindow();
                  if (win) {
                    win.webContents.send('navigate-to', 'setting');
                  }
                },
              },
              {
                label: '閉じる',
                role: 'close',
              },
            ],
          },
        ]
      : [
          {
            label: 'Ground Software',
            submenu: [{ type: 'separator' }, { label: '終了', role: 'quit' }],
          },
        ]),
    {
      label: '表示',
      submenu: [
        { label: 'リロード', role: 'reload' },
        { label: '強制リロード', role: 'forceReload' },
        { label: '開発者ツール', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'ズームリセット', role: 'resetZoom' },
        { label: 'ズームイン', role: 'zoomIn' },
        { label: 'ズームアウト', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'フルスクリーン', role: 'togglefullscreen' },
      ],
    },
    {
      label: 'ウィンドウ',
      submenu: [
        { label: '最小化', role: 'minimize' },
        { label: '最大化', role: 'zoom' },
        ...(process.platform === 'darwin'
          ? [
              { type: 'separator' },
              { label: '前面に表示', role: 'front' },
              { type: 'separator' },
              { label: 'ウィンドウ', role: 'window' },
            ]
          : [{ label: '閉じる', role: 'close' }]),
      ],
    },
    {
      label: 'ヘルプ',
      submenu: [
        {
          label: '使い方',
          click: () => {
            console.log('setAppMenu', 'how-to-use');
            const win = BrowserWindow.getFocusedWindow();
            if (win) {
              win.webContents.send('navigate-to', 'how-to-use');
            }
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template as (MenuItemConstructorOptions | MenuItem)[]);
  Menu.setApplicationMenu(menu);
}

// SerialPort関連の関数
async function listSerialPorts() {
  try {
    const ports = await SerialPort.list();
    return ports;
  } catch (error) {
    console.error('Error listing serial ports:', error);
    return [];
  }
}

function setupSerialPortHandlers(): void {
  ipcMain.handle('list-serial-ports', async () => {
    return await listSerialPorts();
  });

  ipcMain.handle('connect-serial-port', async (_, { type, path, baudRate }) => {
    try {
      if (ports[type]) {
        await new Promise((resolve) => ports[type]?.close(resolve));
      }

      ports[type] = new SerialPort({
        path,
        baudRate: parseInt(baudRate),
        autoOpen: false,
      });

      await new Promise((resolve, reject) => {
        ports[type]?.open((err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      });

      ports[type]?.on('data', (data) => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) {
          win.webContents.send(`serial-data-${type}`, data.toString());
        }
      });

      return { success: true };
    } catch (error: unknown) {
      console.error(`Error connecting to ${type} serial port:`, error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  });

  ipcMain.handle('disconnect-serial-port', async (_, { type }) => {
    try {
      if (ports[type]) {
        await new Promise((resolve) => ports[type]?.close(resolve));
        ports[type] = null;
      }
      return { success: true };
    } catch (error: unknown) {
      console.error(`Error disconnecting ${type} serial port:`, error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  });
}

app.whenReady().then(() => {
  initializeApp();
  createWindow();
  setAppMenu();
  setupSerialPortHandlers();

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  ipcMain.on('ping', () => console.log('pong'));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// macOS 以外では全ウィンドウを閉じたらアプリを終了する
app.on('window-all-closed', () => {
  if (!isMacOS()) {
    app.quit();
  }
});

function isMacOS(): boolean {
  return process.platform === 'darwin';
}

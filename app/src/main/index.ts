import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

// アイコンファイルのインポート
import iconWinLinux from '../../resources/icon-win-linux.ico?asset'
import iconMac from '../../resources/icon-mac.png?asset'

function createWindow(): void {
  // 基本のウィンドウオプション
  const windowOptions: Electron.BrowserWindowConstructorOptions = {
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  }

  // WindowsおよびLinuxの場合はウィンドウのアイコンを指定
  // ※ macOS はウィンドウオプションの icon は無視されるため Dock アイコンを別途設定します
  if (process.platform === 'win32' || process.platform === 'linux') {
    windowOptions.icon = iconWinLinux
  }

  const mainWindow = new BrowserWindow(windowOptions)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 開発中はリモートURL、プロダクションではローカルのHTMLファイルを読み込む
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // Windows 用: アプリケーションIDの設定（タスクバーアイコンなどに影響）
  electronApp.setAppUserModelId('com.electron.73-ground-software')

  // macOS 用: Dock のアイコンを設定
  if (process.platform === 'darwin') {
    app.dock.setIcon(iconMac)
  }

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', () => {
    // macOS の場合、Dockアイコンがクリックされウィンドウがなければ再生成する
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// macOS 以外では全ウィンドウを閉じたらアプリを終了する
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

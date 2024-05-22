import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import path from 'path'
import { LibNFC } from './libnfc'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
// process.env.DIST = path.join(__dirname, '../dist')
// process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

let window: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

const userDataPath = app.getPath('userData')
const resourcesPath = app.isPackaged ? process.resourcesPath : path.join(__dirname, '../resources/win')
const libnfc = new LibNFC(resourcesPath, path.join(userDataPath, 'Card.mfd'))

function createWindow() {
    window = new BrowserWindow({
        show: false,
        width: 1155,
        height: 695,
        minWidth: 1155,
        minHeight: 695,
        // useContentSize: true,
        autoHideMenuBar: true,
        // resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false
        }
    })

    // window.webContents.openDevTools()

    if (VITE_DEV_SERVER_URL) {
        window.loadURL(VITE_DEV_SERVER_URL)
    } else {
        // win.loadFile('dist/index.html')
        window.loadFile(path.join(__dirname, '../dist/index.html'))
    }
}

// app.commandLine.appendSwitch('disable-site-isolation-trials')

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        window = null
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.handle('window-visibility:set', (_event, visible: boolean) => {
    if (visible) {
        window?.show()
    } else {
        window?.hide()
    }
})

ipcMain.handle('native-theme:set', (_event, theme: 'system' | 'light' | 'dark') => {
    nativeTheme.themeSource = theme
})

ipcMain.handle('mifare-card:check', () => {
    return libnfc.checkCard()
})

ipcMain.handle('mifare-card:read', () => {
    return libnfc.readCardData()
})

ipcMain.handle('mifare-card:write', (_event, str: string) => {
    return libnfc.writeCardData(str)
})

app.whenReady().then(createWindow)

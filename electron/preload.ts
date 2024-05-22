import { contextBridge, ipcRenderer } from 'electron'

const electronApi = {
    setWindowVisibility: (visible: boolean): Promise<void> => ipcRenderer.invoke('window-visibility:set', visible),
    setNativeTheme: (theme: 'system' | 'light' | 'dark'): Promise<void> => ipcRenderer.invoke('native-theme:set', theme),
    checkMifareCard: (): Promise<string> => ipcRenderer.invoke('mifare-card:check'),
    readMifareCard: (): Promise<string> => ipcRenderer.invoke('mifare-card:read'),
    writeMifareCard: (str: string): Promise<undefined> => ipcRenderer.invoke('mifare-card:write', str)
}

contextBridge.exposeInMainWorld('electronApi', electronApi)
export type ElectronApi = typeof electronApi

import { contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import type { SerialPortType } from '../renderer/src/types/serial';
import type { IpcRendererEvent } from 'electron';

// Custom APIs for renderer
const api = {
  serialPort: {
    list: () => electronAPI.ipcRenderer.invoke('list-serial-ports'),
    connect: (type: SerialPortType, path: string, baudRate: number) =>
      electronAPI.ipcRenderer.invoke('connect-serial-port', { type, path, baudRate }),
    disconnect: (type: SerialPortType) =>
      electronAPI.ipcRenderer.invoke('disconnect-serial-port', { type }),
    onData: (type: SerialPortType, callback: (data: string) => void) => {
      electronAPI.ipcRenderer.on(`serial-data-${type}`, (_event: IpcRendererEvent, data: string) =>
        callback(data)
      );
    },
    removeDataListener: (type: SerialPortType, callback: (data: string) => void) => {
      electronAPI.ipcRenderer.removeListener(
        `serial-data-${type}`,
        (_event: IpcRendererEvent, data: string) => callback(data)
      );
    },
  },
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error('error: ', error);
  } finally {
    console.log('finish contextBridge.exposeInMainWorld');
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}

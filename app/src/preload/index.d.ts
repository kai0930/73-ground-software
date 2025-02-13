import { ElectronAPI } from '@electron-toolkit/preload';
import type { SerialPortAPI } from '@renderer/types/serial';

interface SerialPortInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  locationId?: string;
  productId?: string;
  vendorId?: string;
}

interface SerialPortAPI {
  list: () => Promise<SerialPortInfo[]>;
  connect: (path: string, baudRate: number) => Promise<{ success: boolean; error?: string }>;
  disconnect: () => Promise<{ success: boolean; error?: string }>;
  onData: (callback: (data: string) => void) => void;
  removeDataListener: (callback: (data: string) => void) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      serialPort: SerialPortAPI;
    };
  }
}

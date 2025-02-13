export type SerialPortType = 'uplink' | 'downlink';

export interface SerialPortInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  locationId?: string;
  productId?: string;
  vendorId?: string;
}

export interface SerialPortAPI {
  list: () => Promise<SerialPortInfo[]>;
  connect: (
    type: SerialPortType,
    path: string,
    baudRate: number
  ) => Promise<{ success: boolean; error?: string }>;
  disconnect: (type: SerialPortType) => Promise<{ success: boolean; error?: string }>;
  onData: (type: SerialPortType, callback: (data: string) => void) => void;
  removeDataListener: (type: SerialPortType, callback: (data: string) => void) => void;
}

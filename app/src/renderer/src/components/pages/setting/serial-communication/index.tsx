import { Button } from '@renderer/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@renderer/components/ui/card';
import { RefreshCcw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@renderer/components/ui/select';
import { Input } from '@renderer/components/ui/input';
import { Label } from '@renderer/components/ui/label';
import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { SerialPortInfo, SerialPortType } from '@renderer/types/serial';

export default function SerialCommunication() {
  const [serialPorts, setSerialPorts] = useState<SerialPortInfo[]>([]);
  const [selectedPorts, setSelectedPorts] = useState<Record<SerialPortType, string>>({
    uplink: '',
    downlink: '',
  });
  const [baudRates, setBaudRates] = useState<Record<SerialPortType, number>>({
    uplink: 115200,
    downlink: 115200,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loadSerialPorts = async () => {
    const ports = await window.api.serialPort.list();
    console.log('ports: ', ports);
    setSerialPorts(ports);
  };

  useEffect(() => {
    loadSerialPorts();
  }, []);

  const handleRefresh = () => {
    loadSerialPorts();
  };

  const handleConnect = async () => {
    if (!selectedPorts.uplink || !selectedPorts.downlink) return;

    setIsLoading(true);
    try {
      // Uplinkポートの接続
      const uplinkResult = await window.api.serialPort.connect(
        'uplink',
        selectedPorts.uplink,
        baudRates.uplink
      );
      if (!uplinkResult.success) {
        console.error('Failed to connect uplink:', uplinkResult.error);
        return;
      }

      // Downlinkポートの接続
      const downlinkResult = await window.api.serialPort.connect(
        'downlink',
        selectedPorts.downlink,
        baudRates.downlink
      );
      if (!downlinkResult.success) {
        // Uplinkポートを切断
        await window.api.serialPort.disconnect('uplink');
        console.error('Failed to connect downlink:', downlinkResult.error);
        return;
      }

      navigate({ to: '/commands' });
    } catch (error) {
      console.error('Error connecting to serial ports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePortChange = (type: SerialPortType, value: string) => {
    setSelectedPorts((prev) => ({ ...prev, [type]: value }));
  };

  const handleBaudRateChange = (type: SerialPortType, value: number) => {
    setBaudRates((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Serial Communication</CardTitle>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCcw className="size-4" />
          </Button>
        </div>
        <CardDescription>Setting the serial communication.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Uplink設定 */}
        <div className="space-y-4">
          <SelectGroup>
            <SelectLabel>Uplink Serial Port</SelectLabel>
            <Select
              value={selectedPorts.uplink}
              onValueChange={(value) => handlePortChange('uplink', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a serial port" />
              </SelectTrigger>
              <SelectContent>
                {serialPorts.map((port) => (
                  <SelectItem key={port.path} value={port.path}>
                    {port.path} {port.manufacturer ? `(${port.manufacturer})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SelectGroup>
          <div className="grid w-full items-center gap-1.5">
            <Label>Uplink Baud Rate</Label>
            <Input
              type="number"
              placeholder="Baud Rate"
              value={baudRates.uplink}
              onChange={(e) => handleBaudRateChange('uplink', Number(e.target.value))}
            />
          </div>
        </div>

        {/* Downlink設定 */}
        <div className="space-y-4">
          <SelectGroup>
            <SelectLabel>Downlink Serial Port</SelectLabel>
            <Select
              value={selectedPorts.downlink}
              onValueChange={(value) => handlePortChange('downlink', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a serial port" />
              </SelectTrigger>
              <SelectContent>
                {serialPorts.map((port) => (
                  <SelectItem key={port.path} value={port.path}>
                    {port.path} {port.manufacturer ? `(${port.manufacturer})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SelectGroup>
          <div className="grid w-full items-center gap-1.5">
            <Label>Downlink Baud Rate</Label>
            <Input
              type="number"
              placeholder="Baud Rate"
              value={baudRates.downlink}
              onChange={(e) => handleBaudRateChange('downlink', Number(e.target.value))}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="w-full justify-end gap-2">
        <Button
          onClick={handleConnect}
          disabled={!selectedPorts.uplink || !selectedPorts.downlink || isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect'}
        </Button>
      </CardFooter>
    </Card>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card';
import { Button } from '@renderer/components/ui/button';
import { ScrollArea } from '@renderer/components/ui/scroll-area';
import { SquareTerminal } from 'lucide-react';
import type { SerialPortType } from '@renderer/types/serial';

interface Props {
  type: SerialPortType;
  title: string;
}

export default function Terminal({ type, title }: Props) {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSerialData = (data: string) => {
      setTerminalLines((prev) => [...prev, data]);
      // 自動スクロール
      if (scrollAreaRef.current) {
        const scrollArea = scrollAreaRef.current;
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    };

    window.api.serialPort.onData(type, handleSerialData);

    return () => {
      window.api.serialPort.removeDataListener(type, handleSerialData);
    };
  }, [type]);

  const handleDisconnect = async () => {
    try {
      await window.api.serialPort.disconnect(type);
    } catch (error) {
      console.error(`Error disconnecting ${type}:`, error);
    }
  };

  return (
    <Card className="flex h-full max-h-full flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <SquareTerminal className="size-5" />
          {title}
        </CardTitle>
        <Button variant="outline" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        <ScrollArea ref={scrollAreaRef} className="size-full bg-accent px-2 pt-2">
          {terminalLines.map((line, index) => (
            <p key={index} className="font-mono">
              {line}
            </p>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

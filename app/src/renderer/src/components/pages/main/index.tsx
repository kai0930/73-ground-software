import { useNavigate } from '@tanstack/react-router';
import Video from './video';
import Status from './status';
import FlightMap from './map';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@renderer/components/ui/resizable';
import Quotanion from './quotanion';

export default function MainPage() {
  const navigate = useNavigate();

  const ipcRenderer = window.electron.ipcRenderer;

  const handleNavigation = (_event: unknown, route: string) => {
    console.log('handleNavigation', route);
    if (route === 'setting') {
      navigate({ to: '/setting' });
    }
  };

  ipcRenderer.on('navigate-to', handleNavigation);

  return (
    <div className="h-[calc(100vh-var(--header-height))] max-h-[calc(100vh-var(--header-height))] py-4">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel
          defaultSize={60}
          className="h-full space-y-4 pr-4"
          // minSize={30}
          // maxSize={70}
          minSize={60}
          maxSize={60}
        >
          <Video />
          <Status />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40} className="grid grid-rows-2 gap-4 pl-4">
          <FlightMap />
          <Quotanion />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

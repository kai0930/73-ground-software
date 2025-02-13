import { useNavigate } from '@tanstack/react-router';
import Video from './video';
import Status from './status';

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
    <div className="grid grid-cols-12 gap-4 pt-4">
      <Video className="col-span-8" />
      <Status className="col-span-4" />
    </div>
  );
}

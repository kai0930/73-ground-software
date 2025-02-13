import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const _ipcHandle = (): void => window.electron.ipcRenderer.send('ping');

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Button onClick={_ipcHandle}>Ping</Button>
      <Button asChild>
        <Link to="/about">About</Link>
      </Button>
    </div>
  );
}

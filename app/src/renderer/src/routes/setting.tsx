import { createFileRoute } from '@tanstack/react-router';
import SettingPage from '@renderer/components/pages/setting';

export const Route = createFileRoute('/setting')({
  component: SettingPage,
});

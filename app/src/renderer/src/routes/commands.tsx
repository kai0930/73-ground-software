import { createFileRoute } from '@tanstack/react-router';
import CommandsPage from '@renderer/components/pages/commands';

export const Route = createFileRoute('/commands')({
  component: CommandsPage,
});

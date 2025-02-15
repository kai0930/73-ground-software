import { createFileRoute } from '@tanstack/react-router';
import MainPage from '@renderer/components/pages/main';

export const Route = createFileRoute('/')({
  component: MainPage,
});

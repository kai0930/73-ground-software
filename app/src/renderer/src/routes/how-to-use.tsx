import { createFileRoute } from '@tanstack/react-router';
import HowToUsePage from '@renderer/components/pages/how-to-use';

export const Route = createFileRoute('/how-to-use')({
  component: HowToUsePage,
});

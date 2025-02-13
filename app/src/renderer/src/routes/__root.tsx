import { createRootRoute, Outlet } from '@tanstack/react-router';
import '../global.css';

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});

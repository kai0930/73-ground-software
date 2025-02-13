import { createRootRoute, Outlet } from '@tanstack/react-router';
import '../global.css';
import { ThemeProvider } from '@renderer/components/providers/theme-provider';
import { SidebarProvider } from '@renderer/components/ui/sidebar';
import { AppSidebar } from '@renderer/components/layout/app-sidebar';
import Header from '@renderer/components/layout/header';

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1">
            <Header />
            <main className="relative w-full px-4">
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </>
  ),
});

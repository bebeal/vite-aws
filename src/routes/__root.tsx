import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ThemeProvider } from 'next-themes';
import { ThemeToggle } from '../components/ThemeToggle/ThemeToggle';

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem={true}>
      <Outlet />
      <ThemeToggle />
      <TanStackRouterDevtools />
    </ThemeProvider>
  ),
  wrapInSuspense: false,
  preload: false,
});

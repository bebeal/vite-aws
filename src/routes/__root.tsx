import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ThemeProvider } from 'next-themes';

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem={true}>
      <Outlet />
      <TanStackRouterDevtools />
    </ThemeProvider>
  ),
  notFoundComponent: () => <div>Page not found</div>
});

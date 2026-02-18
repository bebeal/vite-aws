// __root.tsx: root of the tanstack router
import '../index.css';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    return (
      <div className='flex flex-col h-full min-h-screen overflow-auto'>
        <Outlet />
        <ThemeToggle />
        <ReactQueryDevtools buttonPosition='bottom-right' />
        <TanStackRouterDevtools position='bottom-left' />
      </div>
    );
  },
});

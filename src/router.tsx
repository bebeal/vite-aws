// router.tsx: main router used in both entry-client.tsx and entry-server.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnyRoute, createRouter as createReactRouter, RouterConstructorOptions, RouterHistory } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { routeTree } from './routeTree.gen';
import { Loader } from './components/Loader';
import { useEffect, useState } from 'react';

export const queryClient = new QueryClient();

export function createRouter(options?: RouterConstructorOptions<AnyRoute, 'never', false, RouterHistory, Record<string, unknown>>) {
  return createReactRouter({
    routeTree,
    defaultNotFoundComponent: () => <>Not Found</>,
    defaultPendingComponent: () => (
      <div className='fixed inset-0 flex items-center justify-center'>
        <Loader />
      </div>
    ),
    defaultPreload: 'intent',
    defaultSsr: true,
    context: {
      queryClient,
    },
    // This make the loader only wait 100ms before showing the pending component, instead of the default 1000ms
    defaultPendingMs: 0,
    // Since we're using React Query, we don't want loader calls to ever be stale
    // This will ensure that the loader is always called when the route is preloaded or visited
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    // Add providers as a wrapper to the router
    Wrap: ({ children }) => {
      const [mounted, setMounted] = useState(false);
      useEffect(() => {
        setMounted(true);
      }, []);
      // this needed to prevent hydration error, can't return null cause Wrap type is ReactElement<any, any>
      if (!mounted) return <></>;
      return (
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem={true}>
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      );
    },
    ...options,
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

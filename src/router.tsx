// router.tsx: main router used in both entry-client.tsx and entry-server.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnyRoute, createRouter as createReactRouter, RouterConstructorOptions, RouterHistory } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';
import { routeTree } from './routeTree.gen';
import { Loader } from './components/Loader';

export const queryClient = new QueryClient();

// Prevents hydration error — can't return null because Wrap type is ReactElement
const Providers = ({ children }: { children?: ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <></>;
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const PageLoader = () => (
  <div className='fixed inset-0 flex items-center justify-center'>
    <Loader />
  </div>
);

const PageNotFound = () => (
  <div className='fixed inset-0 flex items-center justify-center'>
    <h1>404</h1>
  </div>
);

export function createRouter(options?: RouterConstructorOptions<AnyRoute, 'never', false, RouterHistory, Record<string, unknown>>) {
  return createReactRouter({
    routeTree,
    Wrap: Providers,
    defaultNotFoundComponent: PageNotFound,
    defaultPendingComponent: PageLoader,
    defaultPreload: 'intent',
    context: {
      queryClient,
    },
    defaultPendingMs: 0,
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    ...options,
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

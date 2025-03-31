// entry-client: hydrates the app using the framework's client-side API: ReactDom.hydrateRoot in this case
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultSsr: true
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.hydrateRoot(document.getElementById('root') as HTMLElement, <RouterProvider router={router} />);

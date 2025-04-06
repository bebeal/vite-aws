// entry-client: hydrates the app using the framework's client-side API: ReactDom.hydrateRoot in this case
import { hydrateRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { createRouter } from './router';

const router = createRouter();

hydrateRoot(document.getElementById('root') as HTMLElement, <RouterProvider router={router} />);

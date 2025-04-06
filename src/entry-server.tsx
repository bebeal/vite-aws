// entry-server: renders the app using the framework's SSR API: ReactDomServer.renderToString in this case
import express from 'express';
import ReactDomServer from 'react-dom/server';
import { RouterProvider } from '@tanstack/react-router';
import { createRouter } from './router';

const router = createRouter();

const render = async (req: express.Request) => {
  const fetchRequest = createFetchRequest(req);
  const url = new URL(fetchRequest.url);
  const path = url.pathname + url.search;

  await router.navigate({
    to: path,
  });
  await router.load();
  const html = ReactDomServer.renderToString(<RouterProvider router={router} />);
  return { html };
};

const createFetchRequest = (req: express.Request): Request => {
  const origin = `${req.protocol}://${req.get('host')}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  const url = new URL(req.originalUrl || req.url, origin);

  const controller = new AbortController();
  req.on('close', () => controller.abort());

  const headers = new Headers();

  for (const [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    signal: controller.signal,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body;
  }

  return new Request(url.href, init);
};

export default {
  render,
  createFetchRequest,
};

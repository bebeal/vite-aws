import { AnyRoute, createRouter as createReactRouter, RouterConstructorOptions, RouterHistory } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

export function createRouter(options?: RouterConstructorOptions<AnyRoute, 'never', false, RouterHistory, Record<string, unknown>>) {
  return createReactRouter({
    routeTree,
    defaultPreload: false,
    defaultNotFoundComponent: () => <>Not Found</>,
    ...options
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}

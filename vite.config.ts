import consolePrefix from '@bebeal/console-prefix-plugin';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, UserConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig((options) => {
  // Shared Config for both Client and SSR Build
  const sharedConfig = {
    plugins: [
      nodePolyfills({
        exclude: ['vm']
      }),
      consolePrefix(options?.isSsrBuild ? '[server]' : '[app]', options?.isSsrBuild ? 'magenta' : 'cyan'),
      // for importing .svg files as react components, and .svg?url as URLs
      svgr({
        svgrOptions: { dimensions: true, icon: true },
        include: '**/*.svg',
      }),
      tailwindcss(),
      TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
      react(),
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.mdx', '.md'],
    },
  };

  if (options?.isSsrBuild) {
    // SSR Build
    return {
      ...sharedConfig,
      build: {
        minify: true,
        ssr: true,
        emptyOutDir: false,
        outDir: 'dist/server',
      },
      ssr: {
        noExternal: ['dotenv', 'react-tweet', 'express', 'serverless-http'],
      },
    } satisfies UserConfig;
  } else {
    // Client Build
    return {
      ...sharedConfig,
      build: {
        minify: true,
        sourcemap: true,
        emptyOutDir: false,
        outDir: 'dist/client',
        rollupOptions: {
          onwarn(warning, warn) {
              // tailwindcss does not support sourcemaps right now, see https://github.com/tailwindlabs/tailwindcss/discussions/16119
              if (warning.code === 'SOURCEMAP_BROKEN') {
                  return;
              }
              warn(warning);
          },
          output: {
            manualChunks: {
              // Core React
              'react': ['react', 'react-dom', 'scheduler'],
              // TanStack
              'tanstack': [
                '@tanstack/react-query',
                '@tanstack/react-router',
                '@tanstack/react-start',
                '@tanstack/react-query-devtools',
                '@tanstack/react-router-devtools',
              ],
            }
          }
        }
      },
    } satisfies UserConfig;
  }
});

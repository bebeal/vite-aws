import path from 'path';
import consolePrefix from '@bebeal/console-prefix-plugin';
import rehypeCodeTerminal from '@bebeal/rehype-code-terminal';
import rehypeColorChips from '@bebeal/rehype-color-chips';
import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { common } from '@wooorm/starry-night';
import sourceHaskell from '@wooorm/starry-night/source.haskell';
import sourceJulia from '@wooorm/starry-night/source.julia';
import sourceScala from '@wooorm/starry-night/source.scala';
import sourceZig from '@wooorm/starry-night/source.zig';
import rehypeKatex from 'rehype-katex';
import rehypeStarryNight from 'rehype-starry-night';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { defineConfig, loadEnv, UserConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig((options) => {
  const mode = options.mode || 'development';
  const env = loadEnv(mode, process.cwd(), '');
  const isProd = mode === 'production' || env.NODE_ENV === 'production';

  // Shared Config for both Client and SSR Build
  const sharedConfig = {
    plugins: [
      nodePolyfills({
        exclude: ['vm'],
      }),
      consolePrefix(options?.isSsrBuild ? '[server]' : '[app]', options?.isSsrBuild ? 'magenta' : 'cyan'),
      // for importing .svg files as react components, and .svg?url as URLs
      svgr({
        svgrOptions: { dimensions: true, icon: true },
        include: '**/*.svg',
      }),
      tailwindcss(),
      mdx({
        development: !isProd,
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkFrontmatter, remarkMath, remarkGfm, [remarkMdxFrontmatter, { name: 'frontMatter' }]],
        rehypePlugins: [rehypeKatex, rehypeColorChips, rehypeCodeTerminal, [rehypeStarryNight, { grammars: [...common, sourceZig, sourceScala, sourceJulia, sourceHaskell] }]],
        recmaPlugins: [],
      }),
      tanstackRouter({ target: 'react', autoCodeSplitting: true }),
      react(),
    ],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
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
        external: ['node:async_hooks'],
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
              react: ['react', 'react-dom', 'scheduler'],
              // TanStack
              tanstack: ['@tanstack/react-query', '@tanstack/react-router', '@tanstack/react-query-devtools', '@tanstack/react-router-devtools'],
              // mdx dependencies
              mdx: ['@bebeal/rehype-color-chips', '@mdx-js/rollup', '@mdx-js/react', 'rehype-katex', 'remark-frontmatter', 'remark-gfm', 'remark-math', 'remark-mdx-frontmatter'],
            },
          },
        },
      },
    } satisfies UserConfig;
  }
});

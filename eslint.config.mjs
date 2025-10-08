// @ts-check

import eslint from '@eslint/js';
import pluginRouter from '@tanstack/eslint-plugin-router';
import * as mdx from 'eslint-plugin-mdx';
import tseslint from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...pluginRouter.configs['flat/recommended'],
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
  })),
  {
    ...mdx.flat,
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: false,
    }),
    rules: {
      ...mdx.flat.rules,
    },
    files: ["**/*.mdx", "**/*.md"],
  },
  {
    ...mdx.flatCodeBlocks,
    rules: {
      ...mdx.flatCodeBlocks.rules,
    },
    files: ["**/*.mdx", "**/*.md"],
  },
  {
    ignores: ["node_modules", "dist", ".amplify-hosting", "assets", "cdk", "cdk.out"],
  }
];

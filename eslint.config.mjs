// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginRouter from '@tanstack/eslint-plugin-router'
import * as mdx from 'eslint-plugin-mdx'

export default tseslint.config(
  eslint.configs.recommended,
  ...pluginRouter.configs['flat/recommended'],
  {
    ...tseslint.configs.recommended,
    files: ["**/*.ts", "**/*.tsx"],
  },
  {
    ...mdx.flat,
    // lint codeblocks
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true,
    }),
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
);

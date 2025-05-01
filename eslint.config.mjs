// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginRouter from '@tanstack/eslint-plugin-router'

export default tseslint.config(
  eslint.configs.recommended,
  ...pluginRouter.configs['flat/recommended'],
  {
    ...tseslint.configs.recommended,
    files: ["**/*.ts", "**/*.tsx"],
  },
  {
    ignores: ["node_modules", "dist", ".amplify-hosting", "assets", "cdk", "cdk.out"],
  }
);

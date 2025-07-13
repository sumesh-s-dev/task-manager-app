import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import nextPlugin from '@next/eslint-plugin-next';
import reactHooks from 'eslint-plugin-react-hooks';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

// Common globals for browser and Node.js
const commonGlobals = {
  ...globals.browser,
  ...globals.node,
  ...globals.es2021,
  // Add any custom globals here
};

// Configuration for JavaScript/TypeScript files
const jsTsConfig = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  languageOptions: {
    globals: commonGlobals,
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
      project: './tsconfig.json',
    },
  },
  plugins: {
    '@typescript-eslint': ts,
    'react-hooks': reactHooks,
    react: reactPlugin,
    '@next/next': nextPlugin,
  },
  rules: {
    ...js.configs.recommended.rules,
    'no-undef': 'off', // TypeScript handles this
    'no-unused-vars': 'off', // TypeScript handles this
  },
};

// TypeScript specific rules
const tsConfig = {
  files: ['**/*.{ts,tsx}'],
  rules: {
    ...ts.configs['recommended'].rules,
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-require-imports': 'off',
  },
};

// React specific rules
const reactConfig = {
  files: ['**/*.{jsx,tsx}'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+
  },
};

// Next.js specific rules
const nextConfig = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules,
  },
};

// Configuration files (e.g., next.config.js)
const configFilesConfig = {
  files: ['*.config.{js,ts}'],
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.commonjs,
    },
  },
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
  },
};

export default [
  jsTsConfig,
  tsConfig,
  reactConfig,
  nextConfig,
  configFilesConfig,
];

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

// Base configuration for all files
const baseConfig = {
  languageOptions: {
    globals: commonGlobals,
    ecmaVersion: 'latest',
    sourceType: 'module',
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

// Configuration for TypeScript files
const tsConfig = {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      project: './tsconfig.json',
    },
  },
  rules: {
    ...ts.configs['recommended'].rules,
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-unsafe-function-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};

// Configuration for JavaScript files
const jsConfig = {
  files: ['**/*.{js,jsx}'],
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    // JavaScript specific rules
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

// Configuration for test files
const testConfig = {
  files: ['**/*.test.{js,jsx,ts,tsx}'],
  rules: {
    // Test specific rules
  },
};

// Configuration for configuration files
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
  baseConfig,
  tsConfig,
  jsConfig,
  reactConfig,
  nextConfig,
  testConfig,
  configFilesConfig,
];

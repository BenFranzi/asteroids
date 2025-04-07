import { defineConfig } from 'eslint/config';
import globals from 'globals';
import JS from '@eslint/js';
import TS from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactPlugin from 'eslint-plugin-react';
import reactRefresh from 'eslint-plugin-react-refresh';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    'settings': { 'react': { 'version': 'detect' } },
  },
  { languageOptions: { globals: globals.browser } },
  JS.configs.recommended,
  importPlugin.flatConfigs.recommended,
  TS.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  { plugins: { 'react-compiler': reactCompiler }, rules: { 'react-compiler/react-compiler': 'error' } },
  {
    plugins: { 'react-refresh': reactRefresh },
    rules: { 'react-refresh/only-export-components': 'warn' },
  },
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      'array-bracket-spacing': ['error', 'never'],
      'comma-dangle': ['error', { 'arrays': 'always-multiline', 'objects': 'always-multiline', 'imports': 'always-multiline', 'exports': 'always-multiline', 'functions': 'never' }],
      'complexity': ['warn', 30],
      'computed-property-spacing': ['error', 'never'],
      'curly': 'off',
      'indent': ['error', 2, {
        'CallExpression': { arguments: 1 },
        'FunctionDeclaration': { body: 1, parameters: 1 },
        'FunctionExpression': { body: 1, parameters: 1 },
        'MemberExpression': 1,
        'ObjectExpression': 1,
        'SwitchCase': 1,
        'ignoredNodes': ['ConditionalExpression'],
        'flatTernaryExpressions': false,
        'offsetTernaryExpressions': false,
        'ignoreComments': false,
      }],
      'import/no-unresolved': 'off',
      'import/order': 'error',
      'no-console': 'warn',
      'no-shadow': 1,
      'object-curly-spacing': ['error', 'always'],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-destructuring': ['error', { array: true, object: true }, { enforceForRenamedProperties: false }],
      'prefer-template': 'error',
      'quotes': ['error', 'single', { avoidEscape: true }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/function-component-definition': [2, { 'namedComponents': 'arrow-function', 'unnamedComponents': 'arrow-function' }],
      'react/jsx-tag-spacing': ['error', { 'beforeSelfClosing': 'always' }],
      'react/no-unknown-property': ['error', { ignore: ['css'] }], // emotion
      'react/react-in-jsx-scope': 'off',
      'semi': 'error',
      'space-before-function-paren': [2, { asyncArrow: 'always', anonymous: 'always', named: 'never' }],
      'space-in-parens': 'error',
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'yoda': 2,
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'args': 'all',
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_',
        },
      ],
    },
  },
]);
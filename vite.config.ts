import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import postcssNested from 'postcss-nested';

const ReactCompilerConfig = {};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [
          '@emotion/babel-plugin',
          'babel-plugin-react-compiler',
          ReactCompilerConfig,
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@/': path.join(__dirname, 'src/'),
    },
  },
  css: {
    postcss: {
      plugins: [postcssNested],
    },
  },
  server: {
    port: 3000,
  },
});
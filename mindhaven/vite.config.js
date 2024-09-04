// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// Import these at the top of your file
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@radix-ui/react-slot': path.resolve(__dirname, 'node_modules/@radix-ui/react-slot')
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
});
import { defineConfig } from 'vite';
import path from 'path';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      autoCodeSplitting: true,
    }),
  ],
  resolve: {
    alias: {
      '@renderer': path.resolve(__dirname, './src/renderer/src'),
    },
  },
});

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'MUNAI_');
  const proxy = {
    '/api/v1': {
      target: env.MUNAI_API_URL || 'http://127.0.0.1:8000',
      changeOrigin: true,
    },
  };
  return {
  server: {
    proxy,
    port: 8080,
    strictPort: true,
    host: '127.0.0.1',
  },
  plugins: [
    react(),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  preview: {
    host: '127.0.0.1',
    proxy,
    port: 8080,
    strictPort: true,
   },
  };
});

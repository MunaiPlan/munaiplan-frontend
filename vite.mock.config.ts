import { defineConfig, mergeConfig } from 'vite';
import base from './vite.config';
import { mockApi } from './mock/plugin';

// UI preview with synthetic data and no backend: npm run dev:mock (http://127.0.0.1:5174).
export default defineConfig((env) => mergeConfig(typeof base === 'function' ? base(env) : base, {
  plugins: [mockApi()],
  server: { port: 5174, proxy: {} },
}));

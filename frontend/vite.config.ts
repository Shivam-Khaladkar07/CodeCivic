
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawTarget = env.VITE_API_URL || 'http://localhost:5000';
  // Strip trailing /api for the proxy target if present
  const proxyTarget = rawTarget.endsWith('/api') ? rawTarget.replace(/\/api$/, '') : rawTarget;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});


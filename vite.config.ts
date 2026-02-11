import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This ensures process.env.API_KEY is replaced with the actual key during build
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});
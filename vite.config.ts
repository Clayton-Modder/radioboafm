import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: './', // <<< ISSO RESOLVE A TELA BRANCA NO VERCEL

    plugins: [react()],

    server: {
      port: 3000,
      host: true,
    },

    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // <<< CORRETO
      },
    },
  };
});

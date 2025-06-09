import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          auth: ['@auth0/auth0-react', '@react-oauth/google'],
          firebase: ['firebase', '@firebase/analytics']
        }
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true
  }
});

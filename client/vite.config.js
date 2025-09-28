import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const isDev = mode === 'development';
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: '0.0.0.0',
      strictPort: true,
      hmr: {
        host: 'localhost',
        port: 5173,
        protocol: 'ws',
        overlay: false
      },
      open: false,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          ws: true
        },
        '/socket.io': {
          target: 'http://localhost:5000',
          ws: true
        }
      },
      watch: {
        usePolling: true,
        interval: 100
      }
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            mui: ['@mui/material', '@mui/icons-material'],
            i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector']
          }
        }
      }
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.[jt]sx?$/,
      exclude: [],
      sourcemap: false
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        '@mui/material',
        '@mui/icons-material',
        'i18next',
        'react-i18next',
        'i18next-browser-languagedetector',
        'sonner',
        'lucide-react'
      ],
      exclude: [],
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx'
        },
        sourcemap: false,
        ignoreAnnotations: true
      }
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
  };
});

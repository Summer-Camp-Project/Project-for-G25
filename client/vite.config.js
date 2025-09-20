import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: false
    },
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true
      }
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        chunkFileNames: 'assets/[name].[hash].js'
      }
    }
  },
  css: {
    devSourcemap: false
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
    sourcemap: true
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
      'sonner'
    ],
    exclude: ['lucide-react'],
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      sourcemap: false,
      ignoreAnnotations: true
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
})

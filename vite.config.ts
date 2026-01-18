import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
    // Ensure proper module resolution
    dedupe: ['axios'],
  },
  build: {
    // Production build optimizations
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    minify: 'esbuild', // Fast minification
    target: 'es2015', // Support modern browsers
    cssCodeSplit: true, // Split CSS for better caching
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'vendor-animations': ['gsap'],
          'vendor-utils': ['axios', 'date-fns'],
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Increase chunk size warning limit (for large games)
    chunkSizeWarningLimit: 1000,
    // Optimize asset inlining
    assetsInlineLimit: 4096, // 4kb
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'axios'],
    exclude: ['@mui/material', '@mui/icons-material'], // Exclude large UI libraries if not used
  },
  // Server configuration (for dev, but good practice)
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
})

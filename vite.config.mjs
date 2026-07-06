import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Migrated from Create React App. The source tree uses .js files that contain
// JSX (CRA convention), so esbuild is told to treat .js as JSX everywhere.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    // keep the CRA output directory so existing deploy tooling still works
    outDir: 'build'
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' }
    }
  }
});

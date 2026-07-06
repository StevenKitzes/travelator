import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import config from './src/config.json';

// The frontend serves HTTPS directly using the Let's Encrypt cert generated for
// its own subdomain (mirrors how api/index.js loads the API subdomain's cert).
// fullchain.pem already includes the intermediate chain, so no separate
// `ca`/chain.pem entry is needed.
const frontendDomain = config.server.domain;
const httpsOptions = {
  key: fs.readFileSync(`/etc/letsencrypt/live/${frontendDomain}/privkey.pem`),
  cert: fs.readFileSync(`/etc/letsencrypt/live/${frontendDomain}/fullchain.pem`)
};

// Migrated from Create React App. The source tree uses .js files that contain
// JSX (CRA convention), so esbuild is told to treat .js as JSX everywhere.
export default defineConfig({
  plugins: [react()],
  server: {
    port: config.server.port,
    open: true,
    https: httpsOptions
  },
  // Production serving: `vite preview` hands out the pre-built static `build/`
  // folder with no dev-server compiler/watcher, so it's cheap on CPU/RAM. It does
  // NOT inherit `server` options, so port/https/host are set here too. `host`
  // makes it listen publicly (not just localhost); `allowedHosts` lets requests
  // arriving under the real subdomain through Vite's host check.
  preview: {
    host: true,
    port: config.server.port,
    https: httpsOptions,
    allowedHosts: [frontendDomain]
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

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import config from './src/config.json';

// When server.useCert is true, the frontend serves HTTPS directly using the
// cert files configured in src/config.json (mirrors how api/index.js loads its
// certs). fullchain.pem already bundles the intermediate chain, so `ca` is
// optional. When useCert is false, `https` is false and Vite serves plain HTTP
// (TLS terminated upstream, e.g. by nginx).
const frontendDomain = config.server.domain;
const certPaths = config.server.certPaths || {};
const httpsOptions = config.server.useCert
  ? {
      key: fs.readFileSync(certPaths.key),
      cert: fs.readFileSync(certPaths.cert),
      ...(certPaths.ca ? { ca: fs.readFileSync(certPaths.ca) } : {})
    }
  : false;

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

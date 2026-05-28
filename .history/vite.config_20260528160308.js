import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: { host: true, port: 8080 },
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
});

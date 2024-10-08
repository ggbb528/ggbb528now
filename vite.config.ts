import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import makeManifest from './utils/plugins/make-manifest';
import makeChangeLog from './utils/plugins/make-changlog';
import copyContentStyle from './utils/plugins/copy-content-style';
import { visualizer } from 'rollup-plugin-visualizer';

const root = resolve(__dirname, './src');
const pagesDir = resolve(root, 'pages');
const assetsDir = resolve(root, 'assets');
const configsDir = resolve(__dirname, 'configs');
const outDir = resolve(__dirname, 'dist');
const publicDir = resolve(__dirname, 'public');

export default defineConfig({
  resolve: {
    alias: {
      '@': root,
      '@/assets': assetsDir,
      '@/pages': pagesDir,
      '@/configs': configsDir,
    },
  },
  plugins: [
    react(),
    makeManifest(),
    makeChangeLog(),
    copyContentStyle(),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }) as PluginOption,
  ],
  publicDir,
  build: {
    outDir,
    sourcemap: process.env.__DEV__ === 'true',
    rollupOptions: {
      input: {
        content: resolve(pagesDir, 'content', 'index.ts'),
        background: resolve(pagesDir, 'background', 'index.ts'),
        popup: resolve(pagesDir, 'popup', 'index.html'),
        options: resolve(pagesDir, 'options', 'index.html'),
        updates: resolve(pagesDir, 'updates', 'index.html'),
      },
      output: {
        entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`,
      },
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __APP_NAME__: JSON.stringify('ggbb528now'),
  },
});

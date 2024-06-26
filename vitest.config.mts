/* eslint-disable import/no-unresolved */
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    exclude: ['./.docker', 'node_modules', './dist', './.vscode', './.husky'],
    setupFiles: ['dotenv-flow/config'],
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      configFile: '.swcrc-test',
    }),
  ],
});

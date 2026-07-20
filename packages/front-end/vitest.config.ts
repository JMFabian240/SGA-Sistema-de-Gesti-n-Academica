import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';
import path from 'path';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: './src/tests/setup.ts',
      server: {
        deps: {
          inline: [/react-hook-form/, /@hookform\/resolvers/, /@testing-library/]
        }
      }
    },
    resolve: {
      alias: {

        '@': path.resolve(__dirname, './src'),
      }
    }
  })
);

import { defineConfig } from 'vitest/config';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env.test'), override: true });

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    fileParallelism: false,
    setupFiles: ['./tests/setup/setup-integration.ts'],
    include: ['tests/integration/**/*.test.ts'],
    alias: {
      '@sga/data-access': path.resolve(__dirname, '../data-access/src')
    }
  }
});

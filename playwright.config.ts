import { defineConfig, devices } from '@playwright/test';

// E2E TESTS DISABLED
export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/*'],
  timeout: 30_000,
  projects: [],
});

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  // Run tests in parallel
  fullyParallel: true,
  // Fail fast - stop on first failure in CI
  forbidOnly: !!process.env.CI,
  // Retry failed tests once
  retries: process.env.CI ? 1 : 0,
  // Use more workers
  workers: process.env.CI ? 2 : 4,
  // Reporter
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    // Collect trace only on retry
    trace: 'on-first-retry',
    // Screenshot only on failure
    screenshot: 'only-on-failure',
    // Video only on failure
    video: 'retain-on-failure',
    // Faster navigation
    navigationTimeout: 15_000,
    actionTimeout: 10_000,
  },
  projects: [
    // Fast: Single viewport for quick validation
    {
      name: 'Fast',
      testMatch: ['**/basic.spec.ts', '**/landing.spec.ts'],
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 800 },
      },
    },
    // Desktop: Primary testing viewport
    {
      name: 'Desktop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1920, height: 1080 },
      },
    },
    // Mobile: Responsive testing
    {
      name: 'Mobile',
      use: { ...devices['iPhone 14'] },
    },
    // Tablet: Responsive testing
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro 11'] },
    },
    // Laptop: Mid-size viewport
    {
      name: 'Laptop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 800 },
      },
    },
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});

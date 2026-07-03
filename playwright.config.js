// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Automatically boot the mock server before tests run.
  webServer: {
    command: 'node mock-server/server.js',
    url: 'http://localhost:4000/autocomplete-form',
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },
});

import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests', outputDir: 'test-results/offline', testMatch: 'offline*.e2e.ts',
  use: { baseURL: 'http://127.0.0.1:4197/underwater-hockey-atlas/', trace: 'retain-on-failure', launchOptions: { executablePath: process.env.CHROMIUM_PATH } },
  projects: [{ name: 'offline-desktop', use: { ...devices['Desktop Chrome'] } }, { name: 'offline-mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } }],
  webServer: { command: 'npm run preview -- --host 127.0.0.1 --port 4197 --strictPort', url: 'http://127.0.0.1:4197/underwater-hockey-atlas/', reuseExistingServer: false },
});

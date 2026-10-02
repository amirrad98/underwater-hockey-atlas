import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  testMatch: 'ui.spec.ts',
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:4173/underwater-hockey-atlas/',
    trace: 'retain-on-failure',
    launchOptions: { executablePath: process.env.CHROMIUM_PATH },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: { command: 'npm run dev -- --port 4173', url: 'http://127.0.0.1:4173/underwater-hockey-atlas/', reuseExistingServer: !process.env.CI },
})

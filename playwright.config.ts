import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'pnpm start:server',
    port: 8080,
  },
  testDir: 'specs',
  use: {
    trace: 'on-first-retry',
    // Browser options
    headless: !!process.env.CI,
    // slowMo: 50,
    // Context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    // Artifacts
    screenshot: 'only-on-failure',
    video: 'retry-with-video',
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          devtools: !!process.env.CI,
        },
      },
    },
  ],
}

export default config

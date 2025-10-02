import { defineConfig, devices } from '@playwright/test';
import { defineBddProject } from 'playwright-bdd';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Timeout per test */
  timeout: 30000,
  /* Global test timeout */
  globalTimeout: process.env.CI ? 10 * 60 * 1000 : undefined, // 10 minutes on CI
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true, suiteTitle: false }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for UI and API testing */
  projects: [
    // UI Testing Project - Chrome only for simplicity
    {
      ...defineBddProject({
        name: 'ui-tests',
  features: 'features/*.feature', // Unified feature directory (root-level only)
        steps: [
          'tests/steps/fixtures.ts',      // shared fixtures & test instance
          'tests/steps/ui/**/*.ts',       // UI steps
          'tests/steps/api/**/*.ts',      // API steps (ignored at runtime via grep)
          'tests/steps/common/**/*.ts',   // Common neutral steps
        ],
        outputDir: '.features-gen/ui',
      }),
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL || 'https://playwright.dev',
      },
      testMatch: /.*\.feature\.spec\.js/,
      grep: /@ui/, // Only run @ui tagged tests
    },

    // API Testing Project
    {
      ...defineBddProject({
        name: 'api-tests',
  features: 'features/*.feature', // Unified feature directory (root-level only)
        steps: [
          'tests/steps/fixtures.ts',     // shared fixtures & test instance
          'tests/steps/api/**/*.ts',     // API step definitions
          'tests/steps/ui/**/*.ts',      // UI steps (ignored at runtime via grep)
          'tests/steps/common/**/*.ts',  // Common neutral steps
        ],
        outputDir: '.features-gen/api',
      }),
      use: {
        baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
        },
      },
      testMatch: /.*\.feature\.spec\.js/,
      grep: /@api/, // Only run @api tagged tests
      grepInvert: /@ui/, // Exclude any scenario that is also @ui to avoid UI-only steps causing browser launch in API run
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
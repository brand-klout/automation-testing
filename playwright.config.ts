import { defineConfig, devices } from '@playwright/test';
import { defineBddProject, cucumberReporter } from 'playwright-bdd';

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
    ['junit', { outputFile: 'test-results.xml' }],
    cucumberReporter('html', { outputFile: 'cucumber-report/report.html' }),
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
        features: 'features/homepage.feature', // Only UI features
        steps: 'tests/steps/**/*.ts',
        outputDir: '.features-gen/ui',
      }),
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL || 'https://playwright.dev',
      },
      testMatch: /.*\.feature\.spec\.js/,
      grep: /@ui/,
    },

    // API Testing Project
    {
      ...defineBddProject({
        name: 'api-tests',
        features: 'features/user-management.feature', // Only API features
        steps: 'tests/steps/**/*.ts',
        outputDir: '.features-gen/api',
      }),
      use: {
        baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
        },
      },
      testMatch: /.*\.feature\.spec\.js/,
      grep: /@api/,
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
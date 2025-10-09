import { defineConfig, devices } from '@playwright/test';
import { defineBddProject } from 'playwright-bdd';

// Environment variables with defaults
const CI = !!process.env.CI;
const BASE_URL = process.env.BASE_URL || 'https://playwright.dev';
const API_BASE_URL = process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';

// Common BDD configuration
const commonBddConfig = {
  features: 'features/*.feature',
  steps: [
    'tests/steps/fixtures.ts',
    'tests/steps/shared/**/*.ts',
    'tests/steps/ui/**/*.ts',
    'tests/steps/api/**/*.ts',
  ],
};

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,
  timeout: 30000,
  globalTimeout: CI ? 600_000 : undefined, // 10 minutes on CI
  
  reporter: [
    ['list'],
    ['allure-playwright', { 
      outputFolder: 'allure-results', 
      detail: true, 
      suiteTitle: true,
      environmentInfo: {
        'Project': 'BrandKlout',
        'Test Environment': process.env.NODE_ENV || 'test',
        'Browser': 'Chrome',
        'Execution Context': CI ? 'CI/CD' : 'Local'
      }
    }],
  ],
  
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // UI Testing Project
    {
      ...defineBddProject({
        name: 'ui-tests',
        ...commonBddConfig,
        outputDir: '.features-gen/ui',
      }),
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: BASE_URL,
      },
      testMatch: /.*\.feature\.spec\.js/,
      grep: /@ui/,
    },

    // API Testing Project
    {
      ...defineBddProject({
        name: 'api-tests',
        ...commonBddConfig,
        outputDir: '.features-gen/api',
      }),
      use: {
        baseURL: API_BASE_URL,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
        },
      },
      testMatch: /.*\.feature\.spec\.js/,
      grep: /@api/,
      grepInvert: /@ui/,
    },
  ],
});
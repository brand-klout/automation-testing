import { test as base, createBdd } from 'playwright-bdd';
import { APIResponse, APIRequestContext } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

// API test context type
type ApiContext = {
  response?: APIResponse;
  data?: any;
  status?: number;
  endpoint?: string;
};

// UI test fixtures type
type UIFixtures = {
  homePage: HomePage;
};

// API test fixtures type
type APIFixtures = {
  apiContext: ApiContext;
  api: APIRequestContext;
};

// Merge all fixtures
type Fixtures = UIFixtures & APIFixtures;

export const test = base.extend<Fixtures>({
  // UI test fixtures
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  // API test fixtures
  apiContext: async ({}, use) => {
    const context: ApiContext = {
      response: undefined,
      data: undefined,
      status: undefined,
      endpoint: undefined,
    };
    await use(context);
  },

  api: async ({ request }, use) => {
    // Use Playwright's request context for API testing
    await use(request);
  },
});

export const { Given, When, Then, Before, After } = createBdd(test);
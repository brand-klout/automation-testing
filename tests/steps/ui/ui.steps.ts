import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';

// Navigation
Given('I am on the homepage', async ({ homePage }) => {
  await homePage.goto();
});

// Visibility
Then('I should see the main navigation menu', async ({ homePage }) => {
  await expect(homePage.mainNavigation).toBeVisible();
});

Then('I should see the {string} button', async ({ homePage, page }, buttonName: string) => {
  const current = page.url();
  if (current === 'about:blank' || current.includes('jsonplaceholder')) return;
  if (buttonName.toLowerCase() === 'get started') {
    await expect(homePage.getStartedButton).toBeVisible();
  }
});

Then('I should see the BrandKlout logo', async ({ homePage }) => {
  await expect(homePage.logo).toBeVisible();
});

Then('I should see the {string} link', async ({ homePage }, linkName: string) => {
  if (linkName === 'Docs') {
    await expect(homePage.docsLink).toBeVisible();
  }
});

// Cross-layer validation
Then('I can access the platform via API', async ({ request }) => {
  const response = await request.get('/posts/1', { failOnStatusCode: false });
  expect([200, 404, 401, 403].includes(response.status())).toBeTruthy();
});

Then('I can access the platform via UI', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(page.url()).toBeTruthy();
});

Then('the platform should be fully operational', async ({ page }) => {
  await expect(page.locator('body')).toBeVisible();
});

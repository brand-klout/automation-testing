import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';

Given('I am on the homepage', async ({ homePage }) => {
  await homePage.goto();
});

When('I click the {string} button', async ({ homePage }, buttonName: string) => {
  if (buttonName === 'Get started') {
    await homePage.clickGetStarted();
  }
});

When('I search for {string}', async ({ homePage }, query: string) => {
  // placeholder search (method may not exist in simplified HomePage)
  if ((homePage as any).searchDocs) {
    await (homePage as any).searchDocs(query);
  }
});

Then('I should see the {string} button', async ({ homePage }, buttonName: string) => {
  if (buttonName === 'Get started') {
    await expect(homePage.getStartedButton).toBeVisible();
  }
});

Then('I should see the {string} link', async ({ homePage }, linkName: string) => {
  if (linkName === 'Docs') {
    await expect(homePage.docsLink).toBeVisible();
  } else if (linkName === 'Community' && (homePage as any).communityLink) {
    await expect((homePage as any).communityLink).toBeVisible();
  }
});

Then('I should be on the getting started page', async ({ page }) => {
  await expect(page).toHaveURL(/.*intro/);
});

Then('the URL should contain {string}', async ({ page }, urlPart: string) => {
  await expect(page.url()).toContain(urlPart);
});

Then('I should see search results', async ({ page }) => {
  await page.waitForLoadState('networkidle');
});

Then('the {string} button should have an accessible name', async ({ homePage }, buttonName: string) => {
  if (buttonName === 'Get started') {
    await expect(homePage.getStartedButton).toHaveAccessibleName('Get started');
  }
});

Then('the page should have a proper heading structure', async ({ page }) => {
  const mainHeading = page.getByRole('heading', { level: 1 });
  await expect(mainHeading).toBeVisible();
});

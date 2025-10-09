import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly getStartedButton: Locator;
  readonly docsLink: Locator;
  readonly logo: Locator;
  readonly mainNavigation: Locator;

  constructor(page: Page) {
    this.page = page;
    // Simple selectors for demo website
    this.getStartedButton = page.getByRole('link', { name: /get started/i });
    this.docsLink = page.getByRole('link', { name: /docs/i });
    this.logo = page.locator('.navbar__logo, [alt*="Playwright"], .logo').first();
    this.mainNavigation = page.locator('nav, [role="navigation"], .navbar').first();
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickGetStarted() {
    await this.getStartedButton.click();
  }
}
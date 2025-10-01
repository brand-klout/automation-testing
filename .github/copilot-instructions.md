# Copilot Instructions for Playwright Demo

## Project Overview
This is a Playwright testing project for end-to-end (E2E) testing of web applications with Behavior-Driven Development (BDD) support. The project uses Playwright with playwright-bdd for Gherkin-style feature files, enabling both traditional Playwright tests and BDD scenarios.

## Key Architecture Concepts

### Test Structure
- **Page Object Model (POM)**: Organize tests using page objects to encapsulate page-specific logic
- **BDD Integration**: Write feature files in Gherkin syntax with step definitions
- **Test Organization**: Group tests by feature/module, use descriptive test suites
- **Fixtures**: Leverage Playwright's fixture system for test setup and teardown

### BDD Structure
- **Feature Files**: Write user stories in `features/*.feature` using Gherkin syntax
- **Step Definitions**: Implement steps in `tests/steps/*.ts` using `createBdd()`
- **Generated Tests**: playwright-bdd generates test files in `.features-gen/`
- **Dual Approach**: Support both traditional Playwright tests and BDD scenarios

### Browser and Context Management
- Use `browser.newContext()` for test isolation
- Configure viewport, user agents, and permissions per test context
- Implement proper browser cleanup in test teardown

## Essential Patterns & Conventions

### Test File Organization
```typescript
// tests/auth/login.spec.ts - Feature-based organization
// tests/pages/LoginPage.ts - Page objects
// tests/fixtures/ - Custom fixtures
// tests/utils/ - Test utilities
// tests/steps/ - BDD step definitions
// features/ - Gherkin feature files
// .features-gen/ - Generated BDD test files (auto-generated)
```

### BDD Feature Files
```gherkin
# features/homepage.feature
Feature: Homepage Navigation
  As a user visiting the website
  I want to navigate through the homepage
  So that I can access different sections

  Background:
    Given I am on the homepage

  @smoke
  Scenario: Display main navigation elements
    Then I should see the "Get started" button
    And I should see the "Docs" link
```

### BDD Step Definitions
```typescript
// tests/steps/fixtures.ts
import { test as base, createBdd } from 'playwright-bdd';

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export const { Given, When, Then } = createBdd(test);

// tests/steps/homepage.steps.ts
import { Given, When, Then } from './fixtures';

Given('I am on the homepage', async ({ homePage }) => {
  await homePage.goto();
});

Then('I should see the {string} button', async ({ homePage }, buttonName) => {
  await expect(homePage.getStartedButton).toBeVisible();
});
```

### Locator Strategies
```typescript
// Prefer data-testid for stable selectors
page.locator('[data-testid="login-button"]')

// Use role-based selectors for accessibility
page.getByRole('button', { name: 'Submit' })

// Chain locators for complex elements
page.locator('.card').filter({ hasText: 'Product' }).getByRole('button')
```

### Assertions and Waits
```typescript
// Use expect with auto-wait
await expect(page.locator('.loading')).toBeHidden()
await expect(page).toHaveURL(/dashboard/)

// Soft assertions for multiple checks
await expect.soft(page.locator('.error')).toBeVisible()
```

## Critical Workflows

### Running Tests
```bash
# Traditional Playwright tests
npx playwright test

# BDD tests
npm run bdd

# Generate BDD tests only
npm run bdd:gen

# Run specific browser
npx playwright test --project=chromium

# Debug mode
npm run bdd:debug

# Headed mode
npm run bdd:headed

# Generate test report
npx playwright show-report
```

### BDD Development Workflow
```bash
# 1. Write feature file
# features/new-feature.feature

# 2. Generate test files to see missing steps
npm run bdd:gen

# 3. Implement step definitions
# tests/steps/new-feature.steps.ts

# 4. Run BDD tests
npm run bdd

# 5. Debug if needed
npm run bdd:debug
```

### Test Development
```bash
# Generate tests interactively
npx playwright codegen [url]

# Update screenshots
npx playwright test --update-snapshots

# Trace viewer for debugging
npx playwright show-trace trace.zip
```

## Configuration Patterns

### playwright.config.ts Structure
- **Projects**: Configure multiple browser/device combinations
- **Base URL**: Set environment-specific base URLs
- **Retries**: Configure retry logic for flaky tests
- **Timeouts**: Set appropriate timeouts for different environments
- **Screenshots/Videos**: Configure failure artifacts

### Environment Handling
```typescript
// Use environment-specific configs
const baseURL = process.env.BASE_URL || 'http://localhost:3000'

// Page object with environment awareness
class LoginPage {
  constructor(private page: Page) {}
  
  async navigateToLogin() {
    await this.page.goto('/login')
  }
}
```

## Testing Patterns

### API Testing Integration
```typescript
// Combine API and UI testing
test('user flow with API setup', async ({ request, page }) => {
  // Setup via API
  await request.post('/api/users', { data: userData })
  
  // Test UI behavior
  await page.goto('/users')
  await expect(page.locator('.user-card')).toBeVisible()
})
```

### Mobile/Responsive Testing
```typescript
// Use device emulation
test.use({ ...devices['iPhone 12'] })

// Custom viewport testing
test.use({ viewport: { width: 1280, height: 720 } })
```

### Visual Testing
```typescript
// Screenshot comparison
await expect(page).toHaveScreenshot('dashboard.png')

// Element-specific screenshots
await expect(page.locator('.chart')).toHaveScreenshot('chart.png')

// Mask dynamic content
await expect(page).toHaveScreenshot('page.png', {
  mask: [page.locator('.timestamp')]
})
```

### Accessibility Testing
```typescript
import { injectAxe, checkA11y } from 'axe-playwright'

test('accessibility check', async ({ page }) => {
  await page.goto('/dashboard')
  await injectAxe(page)
  await checkA11y(page)
})

// Built-in accessibility checks
await expect(page.locator('button')).toHaveAccessibleName()
await expect(page.locator('img')).toHaveAccessibleDescription()
```

### Performance Testing
```typescript
// Web Vitals monitoring
test('performance metrics', async ({ page }) => {
  await page.goto('/dashboard')
  
  // Measure First Contentful Paint
  const fcp = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        resolve(entries[0]?.startTime)
      }).observe({ entryTypes: ['paint'] })
    })
  })
  
  expect(fcp).toBeLessThan(2000) // FCP under 2s
})

// Network performance
test('network timing', async ({ page }) => {
  const response = await page.goto('/dashboard')
  expect(response?.status()).toBe(200)
  
  const timing = await page.evaluate(() => performance.timing)
  const loadTime = timing.loadEventEnd - timing.navigationStart
  expect(loadTime).toBeLessThan(3000)
})
```

## Dependencies & Integration

### Key Dependencies
- `@playwright/test` - Core testing framework
- `playwright-bdd` - BDD integration for Gherkin feature files
- Optional: `@playwright/experimental-ct-*` for component testing
- Optional: `allure-playwright` for enhanced reporting
- Optional: `axe-playwright` for accessibility testing
- Optional: `@lighthouse/cli` for performance audits

### CI/CD Integration
- Configure matrix builds for multiple browsers
- Use `--reporter=github` for GitHub Actions integration
- Store traces and videos as artifacts on failure
- Set up parallel test execution with sharding

### GitHub Actions Configuration
```yaml
# .github/workflows/playwright.yml
- name: Run Playwright tests
  run: npx playwright test
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
- name: Upload traces
  uses: actions/upload-artifact@v3
  if: failure()
  with:
    name: playwright-traces
    path: test-results/
```

## Debugging Strategies

### Local Development
```typescript
// Add breakpoints in tests
await page.pause() // Interactive debugging

// Console logging
page.on('console', msg => console.log(msg.text()))

// Network monitoring
page.on('response', response => {
  console.log(response.status(), response.url())
})
```

### Trace Analysis
- Enable tracing in config for failed tests
- Use `npx playwright show-trace` for visual debugging
- Analyze network requests, DOM snapshots, and console logs

## Best Practices

1. **Test Independence**: Each test should be able to run in isolation
2. **Stable Selectors**: Prefer data-testid over CSS classes or text content
3. **Page Object Model**: Encapsulate page logic for maintainability
4. **Proper Waits**: Use Playwright's auto-waiting features over manual timeouts
5. **Cleanup**: Ensure proper browser context cleanup between tests
6. **Parallel Execution**: Design tests to run safely in parallel

## Common Anti-patterns to Avoid
- Hardcoded waits (`page.waitForTimeout()`)
- Cascading test dependencies
- Testing implementation details over user behavior
- Overly complex page objects
- Ignoring test flakiness instead of fixing root causes
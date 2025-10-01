# Playwright BDD Demo

A simplified Playwright BDD testing project that supports both API and UI automation testing.

## Features

- 🎯 **Pure BDD Mode**: Test structure based on Gherkin feature files
- 🔄 **API + UI Separation**: Support different types of tests through tags
- 🏷️ **Tag-driven**: Organize tests with `@api` and `@ui` tags
- 🌐 **Simple Configuration**: Only essential test projects included

## Quick Start

### Install Dependencies

```bash
npm install
npx playwright install
```

### Run Tests

```bash
# Generate BDD test files
npm run bdd:gen

# Run API tests
npm run test:api

# Run UI tests  
npm run test:ui

# Run all tests
npm run bdd
```

### Debug and Reports

```bash
# Debug mode
npm run bdd:debug

# Headed mode
npm run bdd:headed

# View reports
npm run report
```

## Project Structure

```
playwright-demo/
├── .features-gen/          # Auto-generated BDD test files
│   ├── api/               # API-specific generated tests
│   └── ui/                # UI-specific generated tests
├── features/               # Gherkin feature files
│   └── user-management.feature # Mixed @api and @ui test scenarios
├── tests/
│   ├── pages/             # Page Object Model
│   │   └── HomePage.ts
│   └── steps/             # BDD step definitions
│       ├── fixtures.ts    # Test fixtures
│       ├── api.steps.ts   # API test steps
│       └── homepage.steps.ts # UI test steps
├── playwright.config.ts   # Playwright configuration
└── package.json
```

**Key Features**: 
- **Mixed Test Tags**: Same feature file contains both @api and @ui tests
- **Tag-based Filtering**: Each project uses `grep` to run only relevant tests
- **Sequential Execution**: CI runs API tests first, then UI tests (only if API passes)

## Test Examples

### Mixed API and UI Tests in Same Feature

```gherkin
# features/user-management.feature
Feature: User Management
  As a system administrator
  I want to manage users through both API and UI
  So that I can perform operations through different interfaces

  @api
  Scenario: Get user list via API
    When I send a GET request to "/users"
    Then the response status should be 200
    And the response should be an array

  @api
  Scenario: Create user via API
    Given I have a new user with email "test@example.com"
    When I send a POST request to "/users" with the user data
    Then the response status should be 201
    And the response should contain the user ID

  @ui
  Scenario: Visit homepage
    Given I am on the homepage
    Then I should see the "Get started" button

  @ui
  Scenario: Display main navigation elements
    Given I am on the homepage
    Then I should see the "Get started" button
    And I should see the "Docs" link
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run bdd:gen` | Generate BDD test files |
| `npm run test:api` | Run API tests |
| `npm run test:ui` | Run UI tests |
| `npm run bdd` | Generate and run all tests |
| `npm run bdd:debug` | Run in debug mode |
| `npm run report` | View test reports |

## Adding New Tests

### Add API Tests

1. Use `@api` tag in feature files
2. Implement steps in `tests/steps/api.steps.ts`
3. Run `npm run test:api`

### Add UI Tests

1. Use `@ui` tag in feature files  
2. Create page objects in `tests/pages/`
3. Implement steps in `tests/steps/`
4. Run `npm run test:ui`

## Configuration

The project is configured with two independent test projects that process the same feature files:

- **api-tests**: Processes all feature files but only runs tests with `@api` tags
- **ui-tests**: Processes all feature files but only runs tests with `@ui` tags

This approach allows you to write mixed test scenarios in a single feature file while maintaining complete separation during execution.

### Execution Flow

**Local Development**: Both project types can run in parallel
```bash
npm run test:api  # Runs only @api tests
npm run test:ui   # Runs only @ui tests
npm run bdd       # Runs both (all tests)
```

**CI/CD (GitHub Actions)**: Sequential execution for reliability
1. 🔍 **API Tests** run first (fast, no browser needed)
2. ✅ If API tests pass → 🎨 **UI Tests** run next
3. ❌ If API tests fail → UI tests are skipped

## Testing Patterns

### BDD Feature Files

Write human-readable test scenarios using Gherkin syntax with mixed tags:

```gherkin
# features/user-management.feature
Feature: User Management
  As a system administrator
  I want to manage users through both API and UI
  So that I can perform operations through different interfaces

  @api
  Scenario: Get all posts from API
    When I send a GET request to "/posts"
    Then the response status should be 200
    And the response should contain a list of posts

  @api
  Scenario: Create a new post via API
    Given I have a new post with title "My Test Post"
    When I send a POST request to "/posts" with the post data
    Then the response status should be 201
    And the response should contain the created post

  @ui
  Scenario: Navigate homepage elements
    Given I am on the homepage
    Then I should see the "Get started" button
    And I should see the "Docs" link

  @ui
  Scenario: Verify page accessibility
    Given I am on the homepage
    Then I should see the "Get started" button
```

### Step Definitions

Implementation using playwright-bdd:

```typescript
// tests/steps/fixtures.ts - Unified fixture system
import { test as base, createBdd } from 'playwright-bdd';

interface ApiContext {
  response?: Response;
  data?: any;
  status?: number;
}

interface UIFixtures {
  homePage: HomePage;
}

interface APIFixtures {
  apiContext: ApiContext;
}

export const test = base.extend<UIFixtures & APIFixtures>({
  // UI fixtures
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  // API fixtures
  apiContext: async ({ request }, use) => {
    const context: ApiContext = {};
    await use(context);
  },
});

export const { Given, When, Then } = createBdd(test);
```

### Page Object Model

Implement maintainable and reusable code using the Page Object Model pattern:

```typescript
// tests/pages/HomePage.ts
export class HomePage {
  readonly page: Page;
  readonly getStartedButton: Locator;
  readonly docsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedButton = page.getByRole('link', { name: 'Get started' });
    this.docsLink = page.getByRole('link', { name: 'Docs' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickGetStarted() {
    await this.getStartedButton.click();
  }
}
```

## Testing & Debugging

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run bdd` | Generate and run all BDD tests |
| `npm run bdd:gen` | Generate BDD test files only |
| `npm run test:api` | Run API tests |
| `npm run test:ui` | Run UI tests |
| `npm run bdd:debug` | Run BDD tests in debug mode |
| `npm run bdd:headed` | Run BDD tests with browser UI visible |
| `npm run report` | View HTML test report |

### Browser Support

Tests run across multiple browsers and devices:
- **Desktop**: Chromium (used for API and UI tests)
- **API Tests**: Independent API test project, browser-independent

### Test Reports

#### Local Development
After running tests, view the HTML report:
```bash
npm run report

# View Cucumber reports
open cucumber-report/index.html
```

#### CI/CD Integration
- **GitHub Actions**: Sequential test execution (API → UI)
- **Smart Execution**: UI tests only run if API tests pass
- **Test Artifacts**: Separate reports for API and UI test results
- **Failure Isolation**: Clear identification of which test type failed

### Debugging

```bash
# Interactive debugging
npm run bdd:debug

# Generate tests by recording actions
npx playwright codegen https://playwright.dev

# View traces from failed tests
npx playwright show-trace test-results/example-test/trace.zip
```

## Best Practices

1. **Test Independence**: Each test scenario should run independently
2. **Stable Selectors**: Prefer data-testid over CSS classes or text content
3. **Page Object Model**: Encapsulate page logic in page objects for maintainability
4. **Proper Waits**: Use Playwright's auto-waiting features instead of manual timeouts
5. **Cleanup**: Ensure proper browser context cleanup between tests
6. **Tag Organization**: Use appropriate tags to organize different types of tests

## Adding New Tests

### How to add new API tests?

1. Create or update feature files in `features/` directory with `@api` tag
2. Implement step definitions in `tests/steps/api.steps.ts`
3. Run `npm run bdd:gen` to generate test files
4. Run `npm run test:api` to execute API tests

### How to add new UI tests?

1. Create or update feature files in `features/` directory with `@ui` tag
2. Create page object classes in `tests/pages/`
3. Implement UI step definitions in `tests/steps/`
4. Run `npm run bdd:gen` to generate test files
5. Run `npm run test:ui` to execute UI tests

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


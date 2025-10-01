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
│   ├── homepage.feature    # UI test scenarios (@ui)
│   └── user-management.feature # API test scenarios (@api)
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

**Note**: Each test project (api-tests, ui-tests) processes only its relevant feature files to ensure complete separation and avoid fixture conflicts.

## Test Examples

### API Tests (@api)

```gherkin
@api
Scenario: Get user list via API
  When I send a GET request to "/users"
  Then the response status should be 200
  And the response should be an array
```

### UI Tests (@ui)

```gherkin
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

The project is configured with two independent test projects:

- **api-tests**: Runs tests with `@api` tags, using JSONPlaceholder API
- **ui-tests**: Runs tests with `@ui` tags, using Chrome browser

Tags provide precise control over which type of tests to run, achieving complete separation between API and UI testing.

## Testing Patterns

### BDD Feature Files

Write human-readable test scenarios using Gherkin syntax:

```gherkin
# features/api-tests.feature
Feature: API Testing
  As a system user
  I want to interact with JSONPlaceholder API
  So that I can manage posts

  @api
  Scenario: Get all posts
    When I send a GET request to "/posts"
    Then the response status should be 200
    And the response should contain a list of posts

  @api
  Scenario: Create a new post
    Given I have a new post with title "My Test Post"
    When I send a POST request to "/posts" with the post data
    Then the response status should be 201
    And the response should contain the created post
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
- **GitHub Actions**: Automated test matrix
- **Test Artifacts**: Screenshots and trace files saved on failures
- **Parallel Execution**: Supports test sharding for improved speed

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


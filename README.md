# Playwright BDD Demo

A Playwright + BDD demo project with **clean separation** between API and UI feature domains.

## Features

- 🎯 **Pure BDD Mode**: Test structure based on Gherkin feature files
- 🔄 **API ↔ UI Separation**: Distinct feature/step folders (`features/api`, `features/ui`)
- 🏷️ **Tag-driven Execution**: `@api` and `@ui` filtering per Playwright project
- 🌐 **Minimal, Focused Configuration**

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
├── .features-gen/              # Auto-generated BDD JS tests
│   ├── api/                    # Generated from features/api
│   └── ui/                     # Generated from features/ui
├── features/                   # All Gherkin feature files (mixed @api / @ui per scenario)
│   └── user-management.feature
├── tests/
│   ├── pages/                  # Page Object Models
│   │   └── HomePage.ts
│   └── steps/
│       ├── fixtures.ts         # Shared fixtures + BDD binding (imported by steps)
│       ├── api/                # API step definitions only
│       │   └── api.steps.ts
│       └── ui/                 # UI step definitions only
│           └── ui.steps.ts
├── playwright.config.ts        # Two Playwright BDD projects (api-tests, ui-tests)
└── package.json
```

**Structure Rationale (Unified)**:
- Single source for related business capabilities
- Scenario-level tags decide execution project(s)
- Optionally a scenario can have both `@api @ui` tags (classification only; keep steps domain-appropriate)
- Minimal duplication; easier discoverability

## Test Examples

### Example: Unified Feature File

```gherkin
# features/user-management.feature
Feature: User Management
  As a platform and system user
  I want to validate backend (API) and frontend (UI) capabilities
  So that I am confident both layers function correctly

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

  # Classification-only dual tagging example (keeps UI steps only):
  # @ui @api
  # Scenario: Shared classification demo
  #   Given I am on the homepage
  #   Then I should see the "Get started" button
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run bdd:gen` | Generate BDD test files |
| `npm run test:api` | Run API tests |
| `npm run test:ui` | Run UI tests |
| `npm run test:dual` | Run scenarios tagged with both @api and @ui (classification overlap) |
| `npm run bdd` | Generate and run all tests |
| `npm run bdd:debug` | Run in debug mode |
| `npm run report` | View test reports |

## Adding New Tests

### Add API Tests

1. Add/modify scenarios in any feature under `features/` with `@api`
2. Implement (or reuse) steps in `tests/steps/api/`
3. Run `npm run test:api`

### Add UI Tests

1. Add/modify scenarios in any feature under `features/` with `@ui`
2. Create/extend Page Objects in `tests/pages/`
3. Implement steps in `tests/steps/ui/`
4. Run `npm run test:ui`

## Configuration

The project is configured with two independent test projects that process the same feature files:

- **api-tests**: Processes all feature files but only runs tests with `@api` tags
- **ui-tests**: Processes all feature files but only runs tests with `@ui` tags

This approach allows you to write mixed test scenarios in a single feature file while maintaining complete separation during execution.

### Execution Flow

CI still runs API first then UI. Locally you can run them independently or together:
```bash
npm run test:api   # API only (@api)
npm run test:ui    # UI only (@ui)
npm run test:dual  # Only dual-tag (@api @ui) scenarios (classification overlap)
npm run bdd        # Generate + run both
```

## Testing Patterns

### BDD Feature Files

Keep API and UI concerns separate. Avoid mixing API and UI steps in the same scenario to maintain clarity and speed.

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
7. **Dual Tagging**: Only apply both `@api @ui` when the scenario's steps are logically UI-only or API-only but you want shared classification (avoid mixing API calls and UI actions in a single scenario)

### Dual-Tag Strategy Guidelines

| Guideline | Rationale |
|-----------|-----------|
| Keep steps domain-pure | Prevents brittle cross-layer dependencies |
| Avoid API+UI operational mixing | Separation keeps retries predictable |
| Use dual tags for reporting or grouping only | Clarifies intent without coupling |
| Consider future split if steps diverge | Easier to scale maintenance |

Example dual-tag scenario (classification only):
```gherkin
@api @ui
Scenario: Classification only: homepage visibility (dual-tag)
  Given I am on the homepage
  Then I should see the "Get started" button
```

## Adding New Tests

### How to add new API tests?

1. Tag scenario with `@api`
2. Add/modify steps in `tests/steps/api/`
3. `npm run bdd:gen`
4. `npm run test:api`

### How to add new UI tests?

1. Tag scenario with `@ui`
2. Add/extend page objects in `tests/pages/`
3. Add/modify steps in `tests/steps/ui/`
4. `npm run bdd:gen`
5. `npm run test:ui`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/scope-name`)
3. Commit (`git commit -m 'feat: concise summary'`)
4. Push (`git push origin feature/scope-name`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


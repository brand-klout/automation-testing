# Playwright BDD Demo

A Playwright + BDD demo project with unified feature directory, scenario tag filtering (`@api` / `@ui` / dual-tag), and Allure reporting.

## Features

- 🎯 **Pure BDD Mode**: Test structure based on Gherkin feature files
- 🔄 **Tag-based Separation**: Single feature directory; execution split by tags
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

# View Playwright HTML report
npm run report

# Generate Allure report
npm run allure:generate && npm run allure:open
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
│       └── ui/                 # UI step definitions only
│           └── ui.steps.ts
├── playwright.config.ts        # Two Playwright BDD projects (api-tests, ui-tests)
└── package.json
```

**Structure Rationale (Unified + Allure)**:
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
| `npm run bdd:debug` | Run in debug mode |
| `npm run report` | View test reports |
### Allure GitHub Pages Deployment (with Persistent History)

CI merges `allure-results` from API + UI jobs and publishes a unified Allure site to GitHub Pages on every push to the default branch. A cache now persists the `history/` directory so trend charts (flaky tests, duration, categories) accumulate over time per branch.

Workflow components:
- `publish-allure`:
  - Restores prior history via `actions/cache` (key prefix `allure-history-<branch>`)
  - Downloads and merges `api-allure-results` + `ui-allure-results`
  - Injects previous `history/` into new run's `allure-results`
  - Generates site (`npx allure generate`)
  - Saves updated history back into cache (`.allure-history/history`)
  - Uploads static site as Pages artifact
- `deploy-allure`: Publishes the uploaded artifact using GitHub Pages

Accessing the report:
```
https://<your-org-or-user>.github.io/<repo-name>/
```
Example (org/user `example`, repo `playwright-demo`):
```
https://example.github.io/playwright-demo/
```

Key behaviors:
1. Deployment triggers only on `push` (PRs build but do not publish Pages).
2. Failed runs still publish a site (helpful for triage visibility).
3. Trends persist per branch; switching branches yields independent histories.
4. Force a fresh baseline by deleting the cache key or changing its prefix.
5. To completely reset history manually: bump the cache key prefix in the workflow.

Local reproduction (single run):
```bash
npm run test:api && npm run test:ui
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

Local multi-run history simulation:
```bash
# Run once, generate, preserve history
npx allure generate allure-results --clean -o allure-report
cp -R allure-report/history saved-history

# After another test run (new allure-results) restore history
mkdir -p allure-results/history
cp -R saved-history/. allure-results/history/
npx allure generate allure-results --clean -o allure-report
```

Cache strategy summary:
| Aspect | Value |
|--------|-------|
| Cache key | `allure-history-<branch>` (restore fallbacks: main, master, global) |
| Stored path | `.allure-history/history` |
| Merge logic | Copy restored history before generation, export new history after |
| Reset method | Change key prefix or delete cache via GitHub UI |

If you later need cross-branch aggregation, implement a nightly workflow that merges histories before generation.

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

| Reporter | Use Case | Pros | Notes |
|----------|----------|------|-------|
| Playwright HTML | Local & CI failure triage | Built-in, trace/video links | Short-lived artifacts |
| Allure | Team dashboards, trends, tag matrix | Historical retention, flaky analysis, classification via tags | Requires generate step |

#### Local Development
```bash
# HTML
npm run report
# Allure
npm run allure:generate && npm run allure:open
```

#### CI/CD Integration
1. Run tests (produces `playwright-report/` + `allure-results/`).
2. Upload `allure-results` + HTML report as artifacts.
3. (Optional) Generate static Allure report (`npm run allure:generate`) and publish.
4. Keep sequential order: API → UI → (optional dual-tag).

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

## Allure vs (Removed) Cucumber Reporter

We removed the previous Cucumber HTML reporter in favor of Allure because:
1. Allure aggregates history (trends, flaky stats) while Cucumber output is static per run.
2. Tag dimensions (`@api`, `@ui`, dual) automatically appear as suites in Allure.
3. Reduced end-of-run processing issues (no more pickle sync errors).
4. Easier CI artifact workflow (raw results → optional static site).

If stakeholders later require a pure Gherkin view, you can reintroduce:
```ts
// In playwright.config.ts reporter array (example)
// const { cucumberReporter } = require('playwright-bdd');
// ['cucumber', { outputFile: 'cucumber-report/report.html' }]
```
but keep it disabled unless actively consumed.

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


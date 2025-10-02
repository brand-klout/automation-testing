# Playwright BDD Demo

[![Allure Report](https://img.shields.io/badge/Allure-Report-blueviolet?logo=allure&logoColor=white)](https://aimer1124.github.io/playwright-demo/)

Unified Playwright + BDD testing with tag‑driven separation (`@api`, `@ui`, dual tagging for classification) and continuous Allure report (GitHub Pages + persisted history).

## 1. Quick Start
```bash
npm install
npx playwright install

# Generate BDD test code
npm run bdd:gen

# API / UI / All
npm run test:api
npm run test:ui
npm run bdd        # generate + run both projects

# Debug / headed
npm run bdd:debug
npm run bdd:headed

# Reports (local)
npm run report                 # Playwright HTML
npm run allure:generate && npm run allure:open
```

## 2. Tag Strategy
Single feature directory (`features/`). Two Playwright BDD projects filter scenarios:
- `api-tests`: `grep: /@api/` + `grepInvert: /@ui/` (skips dual-tag & UI scenarios to avoid browser dependency)
- `ui-tests`: `grep: /@ui/`

Dual tag `@api @ui` is for classification and is executed only in the UI project. The API project intentionally skips these dual-tag scenarios.

## 3. Current Structure
```
features/
  user-management.feature
tests/
  pages/HomePage.ts
  steps/fixtures.ts
  steps/api/api.steps.ts
  steps/ui/ui.steps.ts
playwright.config.ts
```
Generated / transient (ignored): `.features-gen/`, `playwright-report/`, `allure-results/`, `allure-report/`, `test-results/`.

## 4. Example Feature (Excerpt)
```gherkin
@api
Scenario: Get user list via API
  When I send a GET request to "/users"
  Then the response status should be 200
  And the response should be an array

@ui
Scenario: Display main navigation elements
  Given I am on the homepage
  Then I should see the "Get started" button
  And I should see the "Docs" link
```

## 5. Steps & Fixtures (Minimal Sketch)
```ts
// tests/steps/fixtures.ts
import { test as base, createBdd } from 'playwright-bdd';
import { HomePage } from '../pages/HomePage';

type ApiContext = { response?: any; data?: any; status?: number };

export const test = base.extend<{ homePage: HomePage; apiContext: ApiContext }>({
  homePage: async ({ page }, use) => { await use(new HomePage(page)); },
  apiContext: async ({}, use) => { await use({}); },
});
export const { Given, When, Then } = createBdd(test);
```

## 6. Reporting (Allure + Pages)
CI merges API & UI results, generates Allure static site and publishes to Pages:
`https://aimer1124.github.io/playwright-demo/`

History trends preserved via cache (key: `allure-history-<branch>`). Delete or change the key to reset trends.

## 7. Useful Commands
| Purpose | Command |
|---------|---------|
| Generate only | `npm run bdd:gen` |
| API tests | `npm run test:api` |
| UI tests | `npm run test:ui` |
| All (generate+run) | `npm run bdd` |
| Debug | `npm run bdd:debug` |
| Headed | `npm run bdd:headed` |
| HTML report (last run) | `npm run report` |
| Allure local | `npm run allure:generate && npm run allure:open` |

## 8. Dual Tag Guidelines
Keep steps domain pure; dual tag only when you want a shared classification bucket. Avoid mixing API HTTP + UI interactions in one scenario—prefer splitting.

## 9. Re‑enabling Cucumber Reporter (Optional)
```ts
// playwright.config.ts (reporter array)
// const { cucumberReporter } = require('playwright-bdd');
// reporter: [ ['html'], ['allure-playwright', {...}], ['cucumber', { outputFile: 'cucumber-report/report.html' }] ];
```

## 10. Contributing / License
MIT License – see `LICENSE`.
---




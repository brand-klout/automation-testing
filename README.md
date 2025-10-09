## BrandKlout Automation Testing

Minimal internal Playwright + BDD (Gherkin) suite for API and UI validation.

### 1. Quick Start
```bash
npm install
npx playwright install
npm run bdd            # generate + run all scenarios
npm run test:api       # API only
npm run test:ui        # UI only
npm run allure:serve   # local Allure report
```

### 2. Scripts
| Script | Purpose |
|--------|---------|
| bdd | Generate + run all BDD scenarios |
| test:api | Run only API project |
| test:ui | Run only UI project |
## BrandKlout Automation Testing

Minimal internal Playwright + BDD (Gherkin) suite for API and UI validation.

### 1. Quick Start
```bash
npm install
npx playwright install        # install browsers
npm run bdd                   # generate + run all scenarios
npm run test:api              # API only
npm run test:ui               # UI only
npm run allure:serve          # local Allure report
```

### 2. Scripts
| Command | Description |
|---------|-------------|
| npm run bdd | Generate + run all BDD tests (api + ui) |
| npm run bdd:gen | Generate test code only |
| npm run bdd:api | Generate + run API tests only |
| npm run bdd:ui | Generate + run UI tests only |
| npm run test:api | Run API project (expects generated files) |
| npm run test:ui | Run UI project (expects generated files) |
| npm run bdd:debug | Run with Playwright inspector |
| npm run bdd:headed | Run UI tests headed |
| npm run allure:serve | Serve Allure results locally |
| npm run install-browsers | Install Playwright browsers |

### 3. Structure
```
features/          # Gherkin feature files
tests/steps/       # Step definitions (api / ui / fixtures)
tests/pages/       # Page objects
playwright.config.ts
.github/workflows/ # CI pipeline (Allure + history)
```

### 4. Environment
Create `.env` (optional overrides):
```
BASE_URL=https://playwright.dev
API_BASE_URL=https://jsonplaceholder.typicode.com
```

### 5. Tags
| Tag | Purpose |
|-----|---------|
| @api | API-only scenarios |
| @ui | Browser/UI scenarios |

### 6. Sample Feature
```gherkin
Feature: BrandKlout Core Testing
  @api
  Scenario: API health
    When I send a GET request to "/users"
    Then the response status should be 200
    And the response should be an array

  @ui
  Scenario: Homepage availability
    Given I am on the homepage
    Then I should see the main navigation menu
    And I should see the "Get Started" button
```

### 7. Reporting
- Playwright HTML report (default) on failures / via `npx playwright show-report`
- Allure report (history persisted in CI) published via GitHub Pages / artifacts
- Local view: `npm run allure:serve`

### 8. Generated / Ignored
```
allure-results/
.features-gen/
playwright-report/
test-results/
```

### 9. Good Practices
- Independent, idempotent scenarios
- Stable selectors (data-testid / role)
- Avoid `waitForTimeout`; rely on auto-wait + assertions
- Keep step bodies thin; delegate detail to page objects / helpers

### 10. Troubleshooting
| Issue | Tip |
|-------|-----|
| Missing steps | Run `npm run bdd:gen` again |
| Browsers missing | `npx playwright install` or `npm run install-browsers` |
| API failures | Check `API_BASE_URL` value |
| Flaky test | Review trace / Allure history, add proper waits |

### 11. License
Internal proprietary test assets (UNLICENSED / not for external distribution).

---
BrandKlout Automation Testing • Internal QA Support Suite
```



## 🏗️ Architecture & Testing Strategy



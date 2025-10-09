## BrandKlout Automation Testing

Internal end-to-end (E2E) and BDD test suite built with Playwright.

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
| bdd:debug | Debug (Inspector) |
| bdd:headed | Headed browser UI tests |
| allure:serve | Serve Allure locally |

### 3. Project Structure
```
features/          # Gherkin feature files
tests/steps/       # Step definitions (api/ui/shared)
tests/pages/       # Page objects
.github/workflows/ # CI pipeline
playwright.config.ts
```

### 4. Configuration
Copy `.env.example` to `.env` (optional overrides):
```
BASE_URL=https://playwright.dev
API_BASE_URL=https://jsonplaceholder.typicode.com
```

### 5. Tags
| Tag | Meaning |
|-----|---------|
| @api | API tests |
| @ui | UI/browser tests |
| @smoke | Core functional smoke coverage |

### 6. Sample Feature
```gherkin
Feature: BrandKlout Core Testing
  @api @smoke
  Scenario: API health
    When I send a GET request to "/users"
    Then the response status should be 200
    And the response should be an array

  @ui @smoke
  Scenario: Homepage availability
    Given I am on the homepage
    Then I should see the main navigation menu
    And I should see the "Get Started" button
```

### 7. CI
- Runs on push / PR via GitHub Actions
- Publishes Allure report (history preserved) to GitHub Pages

### 8. Generated Artifacts (gitignored)
- `allure-results/`
- `.features-gen/`
- `playwright-report/`
- `test-results/`

### 9. Best Practices
- Independent, idempotent scenarios
- Stable selectors (data-testid / role based)
- Avoid hard waits; rely on auto-waiting
- Keep steps high-level, logic in page objects

### 10. License
Internal proprietary test assets (UNLICENSED).

---
**BrandKlout Automation Testing**
- 📝 **提交记录**: [GitHub Actions](https://github.com/brand-klout/automation-testing/actions)

---

**BrandKlout 自动化测试** - 通过 Allure 报告实现持续质量监控 📊

## 🚀 Quick Start

### Prerequisites
     **BrandKlout Automation Testing** - Ensuring quality through comprehensive E2E testing 🚀
- npm or yarn

### Installation & Setup
```bash
# Clone the repository
git clone https://github.com/brand-klout/automation-testing.git
cd automation-testing

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Generate BDD test files and run all tests
npm run bdd:gen && npm run bdd
```

### Quick Test Commands
```bash
npm run test:api    # API tests only
npm run test:ui     # UI tests only  
npm run bdd         # All BDD scenarios (generate + run)
npm run report      # Open Playwright HTML report
npm run allure:generate && npm run allure:open  # Allure report
```

## 🏗️ Architecture & Testing Strategy

### BDD Testing Approach
This project uses **Behavior-Driven Development (BDD)** to write test scenarios in natural language that both technical and non-technical stakeholders can understand.

### Test Organization
- **Feature Files**: User stories in `features/*.feature` using Gherkin syntax
- **Step Definitions**: Implementation in `tests/steps/` with shared fixtures
- **Page Objects**: UI abstractions in `tests/pages/` following Page Object Model
- **Dual Projects**: Separate API and UI test execution with tag-based filtering

### Test Strategy
### Test Strategy
**Tag-based Test Filtering:**
- `@api` scenarios: Backend/API testing only - no browser interactions
- `@ui` scenarios: Browser-based UI testing - user interface interactions  
- `@smoke` scenarios: Critical path tests for quick validation
- `@regression` scenarios: Comprehensive test coverage

**Test Execution:**
- API project filters for `@api` tags and excludes `@ui` to avoid browser overhead
- UI project filters for `@ui` tags and runs browser-based scenarios
- Dual-tagged scenarios (`@api @ui`) are classification only and run in UI project

## 📁 Project Structure
```
automation-testing/
├── features/                    # Gherkin feature files
│   └── user-management.feature  # Example BDD scenarios
├── tests/
│   ├── pages/                   # Page Object Model classes
│   │   └── HomePage.ts          # UI page abstractions
│   └── steps/                   # BDD step definitions
│       ├── fixtures.ts          # Shared test fixtures
│       ├── api/                 # API step implementations
│       │   └── api.steps.ts
│       └── ui/                  # UI step implementations
│           └── ui.steps.ts
├── .features-gen/               # Auto-generated test files (git-ignored)
├── playwright.config.ts         # Playwright configuration
├── package.json                # Dependencies and scripts
└── .github/workflows/           # CI/CD configuration
    └── playwright.yml
```

## 🛠️ Configuration

### Environment Variables
```bash
# API Testing
API_BASE_URL=https://your-api-endpoint.com

# UI Testing  
BASE_URL=https://your-webapp.com

# CI/CD
CI=true  # Enables retries and optimized settings
```

### Playwright Configuration
The `playwright.config.ts` includes:
- **Dual Projects**: Separate API and UI test configurations
- **BDD Integration**: playwright-bdd configuration for Gherkin support
- **Reporters**: HTML + Allure reporting
- **Browser Settings**: Chrome for UI tests, API for backend tests
- **Retry Logic**: Automatic retries on CI/CD environments

## 📊 Test Reporting

### For Private Repositories
Since this is a private repository, test reports are available through multiple channels:

#### 1. GitHub Actions Artifacts
- After each test run, download `blockklout-test-reports-[run-number]` artifact
- Extract and open `allure-report/index.html` in your browser
- Contains complete test results, trends, and failure analysis

#### 2. PR Comments (Pull Requests)
- Automated comments show test status on each PR
- Direct links to detailed reports and artifacts
- Real-time test result updates

#### 3. Actions Summary
- Test results summary in GitHub Actions run page
- Quick overview of passed/failed tests by category
- Links to downloadable detailed reports

### Report Features
- **Allure Reports**: Rich interactive reports with test history, trends, and detailed failure analysis
- **Playwright HTML**: Built-in Playwright test reports with traces and screenshots
- **Test Artifacts**: Screenshots, videos, and traces for failed tests
- **Historical Trends**: Track test stability and performance over time

### GitHub Pages (Optional)
If GitHub Pages is enabled for your private repository (requires GitHub Pro/Enterprise):
- Allure reports will be automatically deployed to: `https://brand-klout.github.io/automation-testing/`
- Historical test data preserved across runs

## 🔧 Available Scripts
## 🔧 Available Scripts

| Script | Purpose | Description |
|--------|---------|-------------|
| `npm run bdd:gen` | Generate BDD Tests | Convert feature files to executable Playwright tests |
| `npm run bdd` | Run All Tests | Generate + execute all BDD scenarios |
| `npm run test:api` | API Tests Only | Execute backend/API scenarios with `@api` tag |
| `npm run test:ui` | UI Tests Only | Execute browser-based scenarios with `@ui` tag |
| `npm run bdd:debug` | Debug Mode | Run tests with Playwright inspector for debugging |
| `npm run bdd:headed` | Headed Mode | Run UI tests with visible browser windows |
| `npm run report` | View HTML Report | Open Playwright's built-in HTML test report |
| `npm run allure:generate` | Generate Allure | Create Allure report from test results |
| `npm run allure:open` | View Allure | Open Allure report in browser |
| `npm run allure:serve` | Serve Allure | Start local server with Allure report |

## 🧪 Writing Tests

### Creating Feature Files
Write test scenarios in natural language using Gherkin syntax:

```gherkin
# features/user-login.feature
Feature: User Authentication
  As a BrandKlout user
  I want to log into my account
  So that I can access platform features

  Background:
  Given the BrandKlout application is available

  @ui @smoke
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid credentials
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see my user profile

  @api
  Scenario: Authentication API returns valid token
    Given I have valid user credentials
    When I send a POST request to "/auth/login"
    Then the response status should be 200
    And the response should contain an access token
```

### Implementing Step Definitions
```typescript
// tests/steps/ui/auth.steps.ts
import { Given, When, Then } from '../fixtures';

Given('I am on the login page', async ({ page }) => {
  await page.goto('/login');
});

When('I enter valid credentials', async ({ page }) => {
  await page.fill('[data-testid="email"]', 'user@blockklout.com');
  await page.fill('[data-testid="password"]', 'validPassword123');
});

Then('I should be redirected to the dashboard', async ({ page }) => {
  await expect(page).toHaveURL(/\/dashboard/);
});
```

## 🚀 CI/CD Integration

### GitHub Actions Workflow
The project includes a comprehensive CI/CD pipeline that:

1. **Runs API Tests First**: Fast backend validation
2. **Executes UI Tests**: Browser-based scenarios (only if API tests pass)
3. **Generates Reports**: Creates Allure and Playwright HTML reports
4. **Uploads Artifacts**: Makes reports available for download
5. **Comments on PRs**: Provides test status directly in pull requests
6. **Deploys to Pages**: (Optional) For enhanced report viewing

### Workflow Triggers
- **Push to main/master**: Full test suite execution
- **Pull Requests**: Complete testing with PR status updates
- **Manual Dispatch**: On-demand test execution

## 🔍 Debugging & Troubleshooting

### Debug Tests Locally
```bash
# Run with Playwright inspector for step-by-step debugging
npm run bdd:debug

# Run with visible browser to see UI interactions
npm run bdd:headed

# View test traces for failed tests
npm run trace
```

### Common Issues
1. **Test Generation Fails**: Run `npm run bdd:gen` to regenerate test files
2. **Browser Not Found**: Run `npx playwright install` to install browsers
3. **Step Definition Missing**: Check that step files are properly exported
4. **API Tests Failing**: Verify API_BASE_URL environment variable

## 📚 Best Practices

### Test Design
- ✅ Write scenarios from user perspective
- ✅ Use descriptive scenario names
- ✅ Keep scenarios focused and atomic
- ✅ Use Background for common setup steps
- ✅ Tag scenarios appropriately (`@api`, `@ui`, `@smoke`)

### Code Organization  
- ✅ Follow Page Object Model for UI tests
- ✅ Share common fixtures and utilities
- ✅ Keep step definitions simple and focused
- ✅ Use meaningful locator strategies (data-testid preferred)
- ✅ Implement proper error handling and waits

### CI/CD
- ✅ Review test reports in pull requests
- ✅ Monitor test stability and trends
- ✅ Keep test data isolated and clean
- ✅ Use environment-specific configurations

## 📄 License

Internal proprietary testing assets. All rights reserved. Not for external distribution.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-tests`
3. Write tests following BDD principles
4. Ensure all tests pass: `npm run bdd`
5. Submit a pull request with clear description

## 📞 Support

For questions or issues:
- Create an issue in this repository
- Review existing test reports and documentation
- Check CI/CD logs for detailed error information

---

**BrandKlout Automation Testing** - Ensuring quality through comprehensive E2E testing 🚀




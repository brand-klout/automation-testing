# BrandKlout Automation Testing

[![CI](https://github.com/brand-klout/automation-testing/actions/workflows/playwright.yml/badge.svg)](https://github.com/brand-klout/automation-testing/actions/workflows/playwright.yml) [![Test Reports](https://img.shields.io/badge/Test-Reports-success?logo=github)](https://brand-klout.github.io/automation-testing/)

Automated end-to-end testing suite using Playwright and BDD for BrandKlout applications.

## 🚀 Quick Start

```bash
# Install dependencies
npm install
npx playwright install

# Run tests  
npm run test:bdd

# Local reports
npm run allure:serve
```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run test:bdd` | Run BDD scenarios |
| `npm run test:api` | API tests only |
| `npm run test:ui` | UI tests only |
| `npm run test:headed` | Run with visible browser |
| `npm run test:debug` | Debug mode |
| `npm run allure:serve` | Local Allure report |

## 🧪 Test Structure

```
features/           # BDD scenarios (.feature files)
tests/
  ├── pages/        # Page Object Model
  └── steps/        # Step definitions
```

## 📊 Reports

**Live Reports**: https://brand-klout.github.io/automation-testing/

- Protected by authentication (managed via GitHub Secrets)
- Historical trends and detailed execution data
- Screenshots and videos for failures

## 🔧 Development

1. Clone repository
2. Install: `npm install && npx playwright install`
3. Copy: `cp .env.example .env`
4. Run: `npm run test:bdd`

## 🛡️ Security

Access codes managed via GitHub Secrets (`ACCESS_CODE`). Contact administrators for access.

## 📚 Documentation

- [Authentication System](./auth/README.md) - Access control and configuration
- [Playwright Config](./playwright.config.ts) - Test configuration
- [GitHub Actions](./.github/workflows/playwright.yml) - CI/CD pipeline
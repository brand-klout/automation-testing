## Playwright BDD Demo

[![CI](https://github.com/aimer1124/playwright-demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/aimer1124/playwright-demo/actions/workflows/playwright.yml)
[![Allure Report](https://img.shields.io/badge/Allure-Report-blueviolet?logo=allure&logoColor=white)](https://aimer1124.github.io/playwright-demo/)

Minimal dual-stack (API + UI) test setup using Playwright + playwright-bdd. Tag filtering cleanly separates layers while a unified Allure report (published via GitHub Pages with cached history) provides trends.

### Install & Run
```bash
npm install
npx playwright install
npm run bdd:gen && npm run bdd   # generate + run all
```
Quick targets:
```bash
npm run test:api   # API only
npm run test:ui    # UI only
npm run report     # Playwright HTML
npm run allure:generate && npm run allure:open
```

### Tag Strategy
`@api` scenarios: backend only.
`@ui` scenarios: browser interactions.
Dual `@api @ui`: classification only (runs in UI project because API project uses grepInvert to skip anything tagged @ui).

### Layout
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
Generated: `.features-gen/`, `allure-results/`, `allure-report/`, `playwright-report/`, `test-results/`.

### Key Scripts
| Action | Script |
|--------|--------|
| Generate BDD code | `npm run bdd:gen` |
| Run all (gen+test) | `npm run bdd` |
| API tests | `npm run test:api` |
| UI tests | `npm run test:ui` |
| Debug | `npm run bdd:debug` |
| Headed | `npm run bdd:headed` |
| HTML report | `npm run report` |
| Allure (local) | `npm run allure:generate && npm run allure:open` |

### Reporting
Allure static site: https://aimer1124.github.io/playwright-demo/ (history via cache key `allure-history-<branch>`).

### License
MIT – see `LICENSE`.




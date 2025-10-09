# BrandKlout Automation Testing

Internal E2E testing framework for BrandKlout using Playwright + BDD.

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm run bdd

# Generate Allure report
npm run allure:serve
```

## Test Results

Tests automatically run on push/PR and generate Allure reports accessible via GitHub Pages.

## Project Structure

- `features/` - BDD test scenarios (Gherkin)
- `tests/steps/` - Step implementations
- `tests/pages/` - Page object models
- `.github/workflows/` - CI/CD configuration

## Configuration

Copy `.env.example` to `.env` and adjust settings if needed.



## 🧪 测试架构

### 测试分类
- **@api** - API 接口测试：数据验证、状态码检查
- **@ui** - UI 界面测试：页面交互、元素可见性
- **@smoke** - 冒烟测试：核心功能快速验证

### BDD 语法示例
```gherkin
Feature: BrandKlout Core Testing
  @api @smoke
  Scenario: API health check
    When I send a GET request to "/users"
    Then the response status should be 200
    And the response should be an array

  @ui @smoke  
  Scenario: Homepage accessibility
    Given I am on the homepage
    Then I should see the main navigation menu
    And I should see the "Get Started" button
```

## 🔧 可用命令

| 命令 | 功能 | 说明 |
|------|------|------|
| `npm run bdd` | 运行所有测试 | 生成 BDD 测试并执行，输出 Allure 结果 |
| `npm run test:api` | 仅运行 API 测试 | 执行标记为 @api 的测试场景 |
| `npm run test:ui` | 仅运行 UI 测试 | 执行标记为 @ui 的测试场景 |
| `npm run bdd:debug` | 调试模式 | 使用 Playwright inspector 逐步调试 |
| `npm run bdd:headed` | 可视化模式 | 显示浏览器窗口执行 UI 测试 |
| `npm run allure:serve` | 本地报告服务 | 启动本地 Allure 报告服务器 |

## 🔄 CI/CD 流程

### GitHub Actions 工作流
1. **测试执行** - 运行所有 BDD 测试场景
2. **报告生成** - 自动生成 Allure 测试报告
3. **历史整合** - 合并历史测试数据
4. **Pages 部署** - 发布到 GitHub Pages（仅 main 分支）
5. **PR 反馈** - 在 PR 中显示测试结果摘要

### 质量监控
- 每次提交触发完整测试
- 自动生成测试趋势图表
- 失败率阈值监控
- 测试稳定性分析

## 📈 报告分析指南

### 查看测试趋势
1. 访问 [Allure 报告页面](https://brand-klout.github.io/automation-testing/)
2. 点击 "Trends" 查看历史趋势
3. 分析成功率变化和执行时间趋势

### 故障排查
1. 在 "Test results" 中查看失败的测试
2. 点击失败测试查看详细错误信息
3. 查看附加的截图和错误堆栈
4. 使用标签筛选特定模块的问题

## ⚙️ 环境配置

### 环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 主要配置项
BASE_URL=https://your-app.com          # UI 测试目标网站
API_BASE_URL=https://api.your-app.com  # API 测试目标接口
```

### 项目结构
```
automation-testing/
├── features/                   # BDD 测试场景
├── tests/
│   ├── pages/HomePage.ts      # 页面对象模型
│   └── steps/                 # 步骤定义
├── allure-results/            # 测试结果（自动生成）
└── .github/workflows/         # CI/CD 配置
```

## 📋 最佳实践

### 编写测试
- 使用清晰的 Gherkin 语法描述业务场景
- 合理使用标签进行测试分类
- 保持测试的独立性和可重复性

### 质量监控
- 定期查看 Allure 报告趋势
- 关注测试稳定性指标
- 及时修复不稳定的测试用例

### 持续改进
- 基于报告数据优化测试覆盖率
- 分析失败模式并改进测试设计
- 定期更新测试环境和数据

## 📞 支持

- 📊 **实时报告**: [GitHub Pages](https://brand-klout.github.io/automation-testing/)
- 🔍 **问题反馈**: [GitHub Issues](https://github.com/brand-klout/automation-testing/issues)
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




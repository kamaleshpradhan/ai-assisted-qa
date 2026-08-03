# Quick Start Guide

## ✅ Framework Setup Complete!

Your Playwright test framework is now fully configured with multi-environment support.

## 🚀 Quick Commands

### Run Tests

```powershell
# Run all tests (default: dev environment)
npm test

# Run tests on specific environments
npm run test:dev
npm run test:st
npm run test:sit
npm run test:e2e

# Run tagged tests
npm run test:smoke    # Critical path tests only
npm run test:api      # API tests only
npm run test:ui       # UI tests only

# Debug mode
npm run test:debug

# Headed mode (see browser)
npm run test:headed
```

### Code Quality

```powershell
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Reports

```powershell
# View HTML report
npm run test:report

# Generate Allure report
npm run allure:generate
npm run allure:open

# Serve Allure report
npm run allure:serve
```

## 📁 Framework Structure

```
tests/
├── api/              # API test specs
│   └── products.spec.ts
├── e2e/              # End-to-end test specs
│   └── login.spec.ts
├── config/           # Configuration
│   ├── env.config.ts
│   ├── global-setup.ts
│   └── global-teardown.ts
├── fixtures/         # Test data
│   ├── users.fixture.ts
│   └── api.fixture.ts
├── pages/            # Page Objects
│   ├── base.page.ts
│   └── login.page.ts
└── utils/            # Utilities
    ├── api.util.ts
    ├── date.util.ts
    └── string.util.ts
```

## 🔧 Configuration

### 1. Environment Variables

Copy and edit `.env` file:

```powershell
Copy-Item .env.example .env
# Then edit .env with your environment URLs
```

### 2. Update Base URLs

Edit `.env` file with your actual environment URLs:

```env
# Dev Environment
DEV_BASE_URL=https://your-dev-site.com
DEV_API_URL=https://api-dev.your-site.com

# ST Environment
ST_BASE_URL=https://your-st-site.com
ST_API_URL=https://api-st.your-site.com

# SIT Environment
SIT_BASE_URL=https://your-sit-site.com
SIT_API_URL=https://api-sit.your-site.com

# E2E Environment
E2E_BASE_URL=https://your-e2e-site.com
E2E_API_URL=https://api-e2e.your-site.com
```

### 3. Test Credentials (Optional)

Add test user credentials in `.env`:

```env
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=YourSecurePassword
```

## 📝 Writing Your First Test

### UI Test Example

Create a new file: `tests/e2e/my-feature.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login.page';

test.describe('My Feature', () => {
  test('should work correctly @smoke', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Expected Title/);
  });
});
```

### API Test Example

Create a new file: `tests/api/my-api.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { APIClient } from '@utils/api.util';

test.describe('My API', () => {
  test('should return data @api', async ({ request }) => {
    const apiClient = new APIClient(request);
    const response = await apiClient.get('/api/endpoint');
    expect(response.status()).toBe(200);
  });
});
```

## 🏷️ Test Tags

Organize tests with tags:

- `@smoke` - Critical path tests
- `@regression` - Full test coverage
- `@api` - API-only tests
- `@ui` - UI-only tests
- `@slow` - Long-running tests

## 🎯 CI/CD

### GitHub Actions Setup

1. Add secrets in GitHub repository settings:
   - `DEV_BASE_URL`
   - `ST_BASE_URL`
   - `SIT_BASE_URL`
   - `E2E_BASE_URL`

2. Workflows are already configured:
   - `.github/workflows/playwright-tests.yml` - Full test suite
   - `.github/workflows/smoke-tests.yml` - Quick smoke tests

3. Allure reports automatically publish to GitHub Pages

## 🔍 Debugging Tips

### View Test Trace

After a failed test:

```powershell
npx playwright show-trace test-results/<test-name>/trace.zip
```

### Take Screenshots

Tests automatically capture screenshots on failure.

### Check Test Results

Results are saved in:

- `test-results/` - Raw results
- `playwright-report/` - HTML report
- `allure-results/` - Allure data

## 📚 Next Steps

1. Update environment URLs in `.env`
2. Create your first test
3. Run smoke tests: `npm run test:smoke`
4. Add more page objects as needed
5. Configure CI/CD with your actual secrets

## 🆘 Need Help?

- Check the [README.md](../README.md) for full documentation
- Review [test framework instructions](.github/instructions/test-framework.instructions.md)
- Use the [@playwright-test-framework agent](.github/agents/playwright-test-framework.agent.md)

## ✨ Features Included

✅ TypeScript with strict mode  
✅ Multi-environment support (Dev, ST, SIT, E2E)  
✅ Page Object Model pattern  
✅ Parallel test execution  
✅ Allure reporting  
✅ ESLint + Prettier  
✅ GitHub Actions CI/CD  
✅ Sample UI and API tests  
✅ Comprehensive utilities  
✅ Pre-commit hooks

---

**Ready to test!** 🎭 Run `npm run test:smoke` to verify everything works.

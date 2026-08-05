---
description: 'Use when writing, modifying, or reviewing Playwright test files, page objects, test utilities, or test fixtures. Covers TypeScript test development standards, naming conventions, assertion patterns, and test organization best practices.'
applyTo: 'tests/**/*.ts, tests/**/*.spec.ts, pages/**/*.ts, fixtures/**/*.ts, utils/**/*.ts'
---

# Playwright Test Framework Standards

Follow these coding standards when working with Playwright test files.

## File Naming Conventions

- Test specs: `[feature].spec.ts` (e.g., `login.spec.ts`, `checkout.spec.ts`)
- Page objects: `[page-name].page.ts` (e.g., `login.page.ts`, `product.page.ts`)
- Fixtures: `[data-type].fixture.ts` (e.g., `users.fixture.ts`)
- Utilities: `[purpose].util.ts` (e.g., `date.util.ts`, `api.util.ts`)

## Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup for each test
  });

  test('should perform expected behavior @smoke', async ({ page }) => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Naming Standards

- **Test names**: Use descriptive "should" format: `should display error when email is invalid`
- **Variables**: camelCase (e.g., `loginPage`, `userEmail`)
- **Page objects**: PascalCase classes (e.g., `LoginPage`, `CheckoutPage`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT`)

## Selector Strategy (Priority Order)

1. **data-testid**: Preferred for all interactive elements
   ```typescript
   page.getByTestId('submit-button');
   ```
2. **Role + Name**: For semantic elements
   ```typescript
   page.getByRole('button', { name: 'Submit' });
   ```
3. **Label**: For form inputs
   ```typescript
   page.getByLabel('Email Address');
   ```
4. **Placeholder**: When label unavailable
   ```typescript
   page.getByPlaceholder('Enter email');
   ```
5. **Text**: For unique text content only
   ```typescript
   page.getByText('Welcome back');
   ```

**Never use**: CSS selectors based on class names or IDs unless absolutely necessary

## Assertions

Use Playwright's expect with auto-retry:

```typescript
// Visibility
await expect(page.getByTestId('success-message')).toBeVisible();

// Text content
await expect(page.getByTestId('title')).toHaveText('Welcome');

// Count
await expect(page.getByTestId('product-card')).toHaveCount(10);

// URL
await expect(page).toHaveURL(/.*checkout/);

// Attribute
await expect(page.getByTestId('input')).toHaveAttribute('disabled', '');
```

**Avoid**: `toBeTruthy()`, `toBeFalsy()` for DOM elements - use specific matchers

## Wait Strategy

**Do:**

```typescript
// Auto-waiting with assertions
await expect(element).toBeVisible();

// Wait for specific state
await page.waitForLoadState('networkidle');

// Wait for response
await page.waitForResponse((resp) => resp.url().includes('/api/data'));
```

**Don't:**

```typescript
// Never use arbitrary timeouts
await page.waitForTimeout(3000); // ❌

// Never use while loops with delays
while (!(await element.isVisible())) {
  // ❌
  await page.waitForTimeout(100);
}
```

## Page Object Pattern

```typescript
export class LoginPage {
  constructor(private page: Page) {}

  // Locators (lazy evaluation)
  private get emailInput() {
    return this.page.getByTestId('email-input');
  }

  private get passwordInput() {
    return this.page.getByTestId('password-input');
  }

  private get submitButton() {
    return this.page.getByTestId('submit-button');
  }

  // Actions
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  // Assertions
  async expectErrorMessage(message: string) {
    await expect(this.page.getByTestId('error-message')).toHaveText(message);
  }
}
```

## Test Tags

Use tags for test categorization:

- `@smoke`: Critical path tests for quick validation
- `@regression`: Comprehensive test coverage
- `@api`: API-only tests
- `@ui`: UI-only tests
- `@slow`: Tests that take longer than 30s

Example:

```typescript
test('should complete checkout process @smoke @ui', async ({ page }) => {
  // test implementation
});
```

## Error Handling

```typescript
// Conditional checks
if (await page.getByTestId('popup').isVisible()) {
  await page.getByTestId('close-popup').click();
}

// Soft assertions (continue on failure)
await expect.soft(page.getByTestId('banner')).toBeVisible();

// Try-catch for expected errors
try {
  await page.goto('/restricted');
} catch (error) {
  expect(error.message).toContain('403');
}
```

## Test Data

- Use fixtures for consistent test data
- Import from `tests/fixtures/` directory
- Never hardcode production data
- Use unique identifiers to avoid conflicts

```typescript
import { validUser, invalidUser } from '@fixtures/users.fixture';

test('should login successfully', async ({ page }) => {
  await loginPage.login(validUser.email, validUser.password);
});
```

## API Testing

```typescript
test('should return user data from API', async ({ request }) => {
  const response = await request.get('/api/users/123');

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const data = await response.json();
  expect(data).toMatchObject({
    id: 123,
    email: expect.stringContaining('@'),
  });
});
```

## Comments and Documentation

```typescript
/**
 * Tests the checkout flow including cart validation,
 * shipping selection, and payment processing.
 *
 * @requires User must be logged in
 * @requires At least one item in cart
 */
test.describe('Checkout Flow', () => {
  // Test implementation
});
```

## TypeScript Best Practices

- Always type function parameters and return values
- Use interfaces for complex data structures
- Avoid `any` type - use `unknown` if type is uncertain
- Use optional chaining for nullable properties

## Imports Organization

```typescript
// 1. External dependencies
import { test, expect, Page } from '@playwright/test';

// 2. Page objects
import { LoginPage } from '@pages/login.page';

// 3. Fixtures
import { validUser } from '@fixtures/users.fixture';

// 4. Utils
import { generateRandomEmail } from '@utils/string.util';
```

## File Organization

```
tests/
├── e2e/               # End-to-end test scenarios
├── api/               # API tests
├── visual/            # Visual regression tests
├── fixtures/          # Test data
├── pages/             # Page objects
└── utils/             # Shared utilities

playwright.config.ts   # Main configuration
```

## Performance Considerations

- Reuse authentication state with `storageState`
- Parallelize independent tests
- Use `test.describe.configure({ mode: 'parallel' })` for parallel execution within describe
- Avoid unnecessary page loads

## Allure Reporting Annotations

```typescript
import { allure } from 'allure-playwright';

test('user registration', async ({ page }) => {
  await allure.epic('User Management');
  await allure.feature('Registration');
  await allure.story('New user signup');
  await allure.severity('critical');

  // Test steps with Allure
  await allure.step('Navigate to registration page', async () => {
    await page.goto('/register');
  });
});
```

Following these standards ensures consistent, maintainable, and reliable test automation.

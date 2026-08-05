import { test, expect } from '@playwright/test';
import { SauceDemoLoginPage } from '../pages/saucedemo-login.page';

/**
 * Sauce Demo Login Page - Usage Examples
 * 
 * These tests demonstrate how to use the SauceDemoLoginPage page object
 * for various login scenarios and test cases.
 */

test.describe('Sauce Demo Login Page - Examples', () => {
    let loginPage: SauceDemoLoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new SauceDemoLoginPage(page);
        await loginPage.navigate();
    });

    test('should load the login page successfully', async () => {
        await loginPage.expectPageLoaded();
        await loginPage.expectLogoVisible();
        await loginPage.expectUsernameFieldVisible();
        await loginPage.expectPasswordFieldVisible();
        await loginPage.expectLoginButtonVisible();
        await loginPage.expectCredentialsInfoVisible();
        await loginPage.expectPasswordInfoVisible();
    });

    test('should login successfully with standard user', async () => {
        await loginPage.loginAsStandardUser();
        await loginPage.expectLoginSuccessful();
    });

    test('should login successfully with manual credential entry', async () => {
        await loginPage.fillUsername('standard_user');
        await loginPage.fillPassword('secret_sauce');
        await loginPage.clickLogin();
        await loginPage.expectLoginSuccessful();
    });

    test('should show error for invalid credentials', async () => {
        await loginPage.loginWithInvalidCredentials('invalid_user', 'invalid_pass');
        await loginPage.expectLoginFailed();
        await loginPage.expectInvalidCredentialsError();
    });

    test('should show error for locked out user', async () => {
        await loginPage.loginAsLockedOutUser();
        await loginPage.expectLoginFailed();
        await loginPage.expectLockedOutUserError();
    });

    test('should allow dismissing error message', async () => {
        await loginPage.loginWithInvalidCredentials('bad_user', 'bad_pass');
        await loginPage.expectErrorMessageVisible();

        await loginPage.dismissError();
        await loginPage.expectErrorMessageNotVisible();
    });

    test('should clear form fields', async () => {
        await loginPage.fillUsername('test_user');
        await loginPage.fillPassword('test_pass');

        await loginPage.expectUsernameValue('test_user');
        await loginPage.expectPasswordValue('test_pass');

        await loginPage.clearForm();
        await loginPage.expectFormEmpty();
    });

    test('should retrieve input values', async () => {
        await loginPage.fillUsername('my_username');
        await loginPage.fillPassword('my_password');

        const username = await loginPage.getUsername();
        const password = await loginPage.getPassword();

        expect(username).toBe('my_username');
        expect(password).toBe('my_password');
    });

    test('should display error message text correctly', async () => {
        await loginPage.login('wrong', 'credentials', false);
        await loginPage.expectErrorMessageVisible();

        const errorText = await loginPage.getErrorMessage();
        expect(errorText).toContain('Epic sadface');
    });

    test('should login with different test users', async () => {
        // Test with problem user
        await loginPage.loginAsProblemUser();
        await loginPage.expectLoginSuccessful();
    });

    test('should login with performance glitch user', async () => {
        // This user may take longer to login
        await loginPage.loginAsPerformanceGlitchUser();
        await loginPage.expectLoginSuccessful();
    });

    test('should verify logo text', async () => {
        const logoText = await loginPage.getLogoText();
        expect(logoText).toBe('Swag Labs');
    });

    test('should handle empty credentials', async () => {
        await loginPage.login('', '', false);
        await loginPage.expectErrorMessageVisible();
    });

    test('should handle missing password', async () => {
        await loginPage.fillUsername('standard_user');
        await loginPage.clickLogin();
        await loginPage.expectErrorMessageVisible();
    });

    test('should handle missing username', async () => {
        await loginPage.fillPassword('secret_sauce');
        await loginPage.clickLogin();
        await loginPage.expectErrorMessageVisible();
    });
});

/**
 * Advanced Usage Examples
 * Demonstrating more complex scenarios and patterns
 */
test.describe('Sauce Demo Login - Advanced Examples', () => {
    test('should retry login after error', async ({ page }) => {
        const loginPage = new SauceDemoLoginPage(page);
        await loginPage.navigate();

        // First attempt with wrong credentials
        await loginPage.loginWithInvalidCredentials('wrong', 'credentials');
        await loginPage.expectLoginFailed();

        // Dismiss error and retry with correct credentials
        await loginPage.dismissError();
        await loginPage.clearForm();
        await loginPage.loginAsStandardUser();
        await loginPage.expectLoginSuccessful();
    });

    test('should handle login with special characters in password', async ({ page }) => {
        const loginPage = new SauceDemoLoginPage(page);
        await loginPage.navigate();

        await loginPage.fillUsername('standard_user');
        await loginPage.fillPassword('!@#$%^&*()');
        await loginPage.clickLogin();

        await loginPage.expectLoginFailed();
        await loginPage.expectErrorMessageVisible();
    });

    test('should verify all form elements are interactive', async ({ page }) => {
        const loginPage = new SauceDemoLoginPage(page);
        await loginPage.navigate();

        // Verify all elements are present and enabled
        await loginPage.expectUsernameFieldVisible();
        await loginPage.expectPasswordFieldVisible();
        await loginPage.expectLoginButtonVisible();

        // Verify inputs accept text
        await loginPage.fillUsername('test');
        await loginPage.expectUsernameValue('test');

        await loginPage.fillPassword('pass');
        await loginPage.expectPasswordValue('pass');
    });

    test('should maintain form state after failed login', async ({ page }) => {
        const loginPage = new SauceDemoLoginPage(page);
        await loginPage.navigate();

        const testUsername = 'test_user_123';
        const testPassword = 'test_pass_456';

        await loginPage.login(testUsername, testPassword, false);
        await loginPage.expectLoginFailed();

        // Form should maintain the entered values
        await loginPage.expectUsernameValue(testUsername);
        await loginPage.expectPasswordValue(testPassword);
    });
});

/**
 * Data-Driven Test Examples
 * Using test parameters for multiple scenarios
 */
test.describe('Sauce Demo Login - Data-Driven Tests', () => {
    const invalidCredentials = [
        { username: '', password: '', description: 'empty credentials' },
        { username: 'user', password: '', description: 'empty password' },
        { username: '', password: 'pass', description: 'empty username' },
        { username: 'invalid', password: 'invalid', description: 'invalid credentials' },
        { username: 'standard_user', password: 'wrong_pass', description: 'wrong password' },
    ];

    invalidCredentials.forEach(({ username, password, description }) => {
        test(`should show error for ${description}`, async ({ page }) => {
            const loginPage = new SauceDemoLoginPage(page);
            await loginPage.navigate();

            await loginPage.login(username, password, false);
            await loginPage.expectLoginFailed();
            await loginPage.expectErrorMessageVisible();
        });
    });

    const validUsers = [
        { method: 'loginAsStandardUser', name: 'standard user' },
        { method: 'loginAsProblemUser', name: 'problem user' },
        { method: 'loginAsPerformanceGlitchUser', name: 'performance glitch user' },
        { method: 'loginAsErrorUser', name: 'error user' },
        { method: 'loginAsVisualUser', name: 'visual user' },
    ];

    validUsers.forEach(({ method, name }) => {
        test(`should login successfully with ${name}`, async ({ page }) => {
            const loginPage = new SauceDemoLoginPage(page);
            await loginPage.navigate();

            // Call the helper method dynamically
            await (loginPage as any)[method]();
            await loginPage.expectLoginSuccessful();
        });
    });
});

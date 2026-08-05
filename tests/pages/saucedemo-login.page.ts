import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Sauce Demo Login Page Object
 * The authentication page for https://www.saucedemo.com/
 * 
 * Authentication: Not Required (this IS the login page)
 * 
 * Key Features:
 * - Username and password form inputs
 * - Login submission with client-side validation
 * - Error message display for invalid credentials
 * - Test user credentials displayed on page
 * - Navigation to /inventory.html on successful login
 * 
 * Test Users Available:
 * - standard_user (normal user)
 * - locked_out_user (locked account)
 * - problem_user (user with issues)
 * - performance_glitch_user (slow response)
 * - error_user (various errors)
 * - visual_user (visual testing)
 * 
 * Password for all users: secret_sauce
 * 
 * Page URL: https://www.saucedemo.com/
 */
export class SauceDemoLoginPage extends BasePage {
    private readonly baseUrl = 'https://www.saucedemo.com/';

    constructor(page: Page) {
        super(page);
    }

    // ============================================================================
    // Locators - using lazy evaluation with getters
    // ============================================================================

    /**
     * Main logo/branding element displaying "Swag Labs"
     */
    private get logo(): Locator {
        return this.page.locator('.login_logo');
    }

    /**
     * Username input field
     * data-test="username", id="user-name"
     */
    private get usernameInput(): Locator {
        return this.page.getByTestId('username');
    }

    /**
     * Password input field
     * data-test="password", id="password"
     */
    private get passwordInput(): Locator {
        return this.page.getByTestId('password');
    }

    /**
     * Login submit button
     * data-test="login-button", id="login-button"
     */
    private get loginButton(): Locator {
        return this.page.getByTestId('login-button');
    }

    /**
     * Error message container (visible only when login fails)
     * data-test="error"
     * Displays messages like "Epic sadface: Username and password do not match any user in this service"
     */
    private get errorMessage(): Locator {
        return this.page.getByTestId('error');
    }

    /**
     * Close button within the error message
     * Allows dismissing the error notification
     */
    private get errorCloseButton(): Locator {
        return this.errorMessage.locator('button');
    }

    /**
     * Login credentials information section
     * data-test="login-credentials"
     * Displays available test usernames
     */
    private get credentialsInfo(): Locator {
        return this.page.getByTestId('login-credentials');
    }

    /**
     * Password information section
     * data-test="login-password"
     * Displays the password for all test users
     */
    private get passwordInfo(): Locator {
        return this.page.getByTestId('login-password');
    }

    /**
     * Main login container
     * data-test="login-container"
     */
    private get loginContainer(): Locator {
        return this.page.getByTestId('login-container');
    }

    // ============================================================================
    // Navigation Actions
    // ============================================================================

    /**
     * Navigate to the login page
     */
    async navigate(): Promise<void> {
        await this.page.goto(this.baseUrl);
        await this.expectPageLoaded();
    }

    /**
     * Navigate directly to the login page URL
     * Alias for navigate() for consistency with other page objects
     */
    async goto(): Promise<void> {
        await this.navigate();
    }

    // ============================================================================
    // Interaction Actions
    // ============================================================================

    /**
     * Fill the username field
     * @param username - The username to enter
     */
    async fillUsername(username: string): Promise<void> {
        await this.usernameInput.fill(username);
    }

    /**
     * Fill the password field
     * @param password - The password to enter
     */
    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    /**
     * Click the login button
     */
    async clickLogin(): Promise<void> {
        await this.loginButton.click();
    }

    /**
     * Dismiss the error message by clicking the close button
     */
    async dismissError(): Promise<void> {
        await this.errorCloseButton.click();
    }

    /**
     * Clear the username field
     */
    async clearUsername(): Promise<void> {
        await this.usernameInput.clear();
    }

    /**
     * Clear the password field
     */
    async clearPassword(): Promise<void> {
        await this.passwordInput.clear();
    }

    /**
     * Clear both username and password fields
     */
    async clearForm(): Promise<void> {
        await this.clearUsername();
        await this.clearPassword();
    }

    // ============================================================================
    // Combined Actions (Higher-level workflows)
    // ============================================================================

    /**
     * Perform a complete login action
     * Fills username, password, and submits the form
     * 
     * @param username - The username to login with
     * @param password - The password to login with
     * @param waitForNavigation - Whether to wait for navigation after login (default: true)
     */
    async login(username: string, password: string, waitForNavigation: boolean = true): Promise<void> {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLogin();

        if (waitForNavigation) {
            // Wait for either navigation to inventory page or error message
            await Promise.race([
                this.page.waitForURL('**/inventory.html'),
                this.errorMessage.waitFor({ state: 'visible' })
            ]);
        }
    }

    /**
     * Login with the standard test user
     * Uses credentials: standard_user / secret_sauce
     */
    async loginAsStandardUser(): Promise<void> {
        await this.login('standard_user', 'secret_sauce');
    }

    /**
     * Login with the locked out user (should fail)
     * Uses credentials: locked_out_user / secret_sauce
     */
    async loginAsLockedOutUser(): Promise<void> {
        await this.login('locked_out_user', 'secret_sauce');
    }

    /**
     * Login with the problem user
     * Uses credentials: problem_user / secret_sauce
     */
    async loginAsProblemUser(): Promise<void> {
        await this.login('problem_user', 'secret_sauce');
    }

    /**
     * Login with the performance glitch user
     * Uses credentials: performance_glitch_user / secret_sauce
     */
    async loginAsPerformanceGlitchUser(): Promise<void> {
        await this.login('performance_glitch_user', 'secret_sauce');
    }

    /**
     * Login with the error user
     * Uses credentials: error_user / secret_sauce
     */
    async loginAsErrorUser(): Promise<void> {
        await this.login('error_user', 'secret_sauce');
    }

    /**
     * Login with the visual user
     * Uses credentials: visual_user / secret_sauce
     */
    async loginAsVisualUser(): Promise<void> {
        await this.login('visual_user', 'secret_sauce');
    }

    /**
     * Attempt login with invalid credentials
     * @param username - Invalid username
     * @param password - Invalid password
     */
    async loginWithInvalidCredentials(username: string, password: string): Promise<void> {
        await this.login(username, password, false);
        await this.expectErrorMessageVisible();
    }

    // ============================================================================
    // Getter Actions (Retrieve values)
    // ============================================================================

    /**
     * Get the current username value
     * @returns The username input value
     */
    async getUsername(): Promise<string> {
        return await this.usernameInput.inputValue();
    }

    /**
     * Get the current password value
     * @returns The password input value
     */
    async getPassword(): Promise<string> {
        return await this.passwordInput.inputValue();
    }

    /**
     * Get the error message text
     * @returns The error message text or empty string if not visible
     */
    async getErrorMessage(): Promise<string> {
        if (await this.errorMessage.isVisible()) {
            return await this.errorMessage.textContent() || '';
        }
        return '';
    }

    /**
     * Get the logo text
     * @returns The logo text (should be "Swag Labs")
     */
    async getLogoText(): Promise<string> {
        return await this.logo.textContent() || '';
    }

    // ============================================================================
    // Assertion Actions (expect* methods)
    // ============================================================================

    /**
     * Assert that the login page is loaded and visible
     */
    async expectPageLoaded(): Promise<void> {
        await expect(this.logo).toBeVisible({ timeout: 10000 });
        await expect(this.usernameInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
        await expect(this.page).toHaveURL(this.baseUrl);
        await expect(this.page).toHaveTitle('Swag Labs');
    }

    /**
     * Assert that the logo displays "Swag Labs"
     */
    async expectLogoVisible(): Promise<void> {
        await expect(this.logo).toBeVisible();
        await expect(this.logo).toHaveText('Swag Labs');
    }

    /**
     * Assert that the username field is visible and enabled
     */
    async expectUsernameFieldVisible(): Promise<void> {
        await expect(this.usernameInput).toBeVisible();
        await expect(this.usernameInput).toBeEnabled();
    }

    /**
     * Assert that the password field is visible and enabled
     */
    async expectPasswordFieldVisible(): Promise<void> {
        await expect(this.passwordInput).toBeVisible();
        await expect(this.passwordInput).toBeEnabled();
    }

    /**
     * Assert that the login button is visible and enabled
     */
    async expectLoginButtonVisible(): Promise<void> {
        await expect(this.loginButton).toBeVisible();
        await expect(this.loginButton).toBeEnabled();
    }

    /**
     * Assert that the error message is visible
     */
    async expectErrorMessageVisible(): Promise<void> {
        await expect(this.errorMessage).toBeVisible();
    }

    /**
     * Assert that the error message is not visible
     */
    async expectErrorMessageNotVisible(): Promise<void> {
        await expect(this.errorMessage).not.toBeVisible();
    }

    /**
     * Assert that the error message contains specific text
     * @param expectedText - The expected error message text
     */
    async expectErrorMessageToBe(expectedText: string): Promise<void> {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText(expectedText);
    }

    /**
     * Assert that the username field has a specific value
     * @param expectedValue - The expected username value
     */
    async expectUsernameValue(expectedValue: string): Promise<void> {
        await expect(this.usernameInput).toHaveValue(expectedValue);
    }

    /**
     * Assert that the password field has a specific value
     * @param expectedValue - The expected password value
     */
    async expectPasswordValue(expectedValue: string): Promise<void> {
        await expect(this.passwordInput).toHaveValue(expectedValue);
    }

    /**
     * Assert that login was successful by checking navigation to inventory page
     */
    async expectLoginSuccessful(): Promise<void> {
        await expect(this.page).toHaveURL(/.*inventory\.html/, { timeout: 10000 });
    }

    /**
     * Assert that login failed with error message
     */
    async expectLoginFailed(): Promise<void> {
        await this.expectErrorMessageVisible();
        await expect(this.page).toHaveURL(this.baseUrl);
    }

    /**
     * Assert that the credentials information section is visible
     */
    async expectCredentialsInfoVisible(): Promise<void> {
        await expect(this.credentialsInfo).toBeVisible();
    }

    /**
     * Assert that the password information section is visible
     */
    async expectPasswordInfoVisible(): Promise<void> {
        await expect(this.passwordInfo).toBeVisible();
    }

    /**
     * Assert that both username and password fields are empty
     */
    async expectFormEmpty(): Promise<void> {
        await expect(this.usernameInput).toHaveValue('');
        await expect(this.passwordInput).toHaveValue('');
    }

    /**
     * Assert that the error message shows invalid credentials error
     */
    async expectInvalidCredentialsError(): Promise<void> {
        await this.expectErrorMessageToBe('Epic sadface: Username and password do not match any user in this service');
    }

    /**
     * Assert that the error message shows locked out user error
     */
    async expectLockedOutUserError(): Promise<void> {
        await this.expectErrorMessageToBe('Epic sadface: Sorry, this user has been locked out');
    }
}

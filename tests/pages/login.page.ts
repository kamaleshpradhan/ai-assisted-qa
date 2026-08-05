import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Login Page Object
 * Represents the login page and its interactions
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators - lazy evaluation using getters
  private get emailInput(): Locator {
    return this.page.getByTestId('email-input');
  }

  private get passwordInput(): Locator {
    return this.page.getByTestId('password-input');
  }

  private get submitButton(): Locator {
    return this.page.getByTestId('submit-button');
  }

  private get errorMessage(): Locator {
    return this.page.getByTestId('error-message');
  }

  private get forgotPasswordLink(): Locator {
    return this.page.getByTestId('forgot-password-link');
  }

  // Actions
  /**
   * Navigate to login page
   */
  async navigate(): Promise<void> {
    await this.goto('/login');
    await this.waitForPageLoad();
  }

  /**
   * Perform login with credentials
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.submitButton);
  }

  /**
   * Fill email field
   */
  async enterEmail(email: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
  }

  /**
   * Fill password field
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password);
  }

  /**
   * Click submit button
   */
  async clickSubmit(): Promise<void> {
    await this.clickElement(this.submitButton);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }

  // Assertions
  /**
   * Verify error message is displayed
   */
  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(message);
  }

  /**
   * Verify login page is loaded
   */
  async expectLoginPageLoaded(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  /**
   * Verify submit button is disabled
   */
  async expectSubmitButtonDisabled(): Promise<void> {
    await expect(this.submitButton).toBeDisabled();
  }

  /**
   * Verify submit button is enabled
   */
  async expectSubmitButtonEnabled(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
  }
}

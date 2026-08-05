import { Page, Locator } from '@playwright/test';

/**
 * Base Page class with common page actions and utilities
 * All page objects should extend this class
 */
export abstract class BasePage {
  public page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific path
   */
  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get current page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  getCurrentURL(): string {
    return this.page.url();
  }

  /**
   * Wait for a specific element to be visible
   */
  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Fill input field with text
   */
  async fillInput(locator: Locator, text: string): Promise<void> {
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Click element with retry logic
   */
  async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Get element text content
   */
  async getTextContent(locator: Locator): Promise<string> {
    const text = await locator.textContent();
    return text?.trim() || '';
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for API response
   */
  async waitForAPIResponse(urlPattern: string | RegExp, timeout: number = 30000): Promise<void> {
    await this.page.waitForResponse(
      (response) => {
        const url = response.url();
        return typeof urlPattern === 'string' ? url.includes(urlPattern) : urlPattern.test(url);
      },
      { timeout }
    );
  }

  /**
   * Reload current page
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Go back to previous page
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Execute JavaScript in browser context
   */
  async evaluate<T>(script: string | (() => T)): Promise<T> {
    return await this.page.evaluate(script);
  }
}

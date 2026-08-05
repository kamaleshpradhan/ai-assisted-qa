import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Sauce Demo Inventory Page Object
 * 
 * Represents the main product inventory page of the Sauce Demo e-commerce application.
 * This page displays a list of products that users can add to their shopping cart.
 * 
 * URL: https://www.saucedemo.com/inventory.html
 * Authentication: Required (must be logged in)
 * 
 * Key Features:
 * - Product listing with images, names, descriptions, and prices
 * - Add to cart / Remove from cart functionality
 * - Product sorting (name A-Z, Z-A, price low-high, high-low)
 * - Shopping cart badge showing item count
 * - Navigation menu with logout and other options
 * 
 * Products Available:
 * - Sauce Labs Backpack ($29.99)
 * - Sauce Labs Bike Light ($9.99)
 * - Sauce Labs Bolt T-Shirt ($15.99)
 * - Sauce Labs Fleece Jacket ($49.99)
 * - Sauce Labs Onesie ($7.99)
 * - Test.allTheThings() T-Shirt (Red) ($15.99)
 * 
 * Note: This is a client-side application with no API calls - all state is managed in the browser.
 */
export class InventoryPage extends BasePage {
    readonly url = 'https://www.saucedemo.com/inventory.html';

    constructor(page: Page) {
        super(page);
    }

    // ============================================
    // Header Locators
    // ============================================

    /**
     * Hamburger menu button in the top-left corner
     */
    private get menuButton(): Locator {
        return this.page.getByTestId('open-menu');
    }

    /**
     * Shopping cart link in the top-right corner
     */
    private get shoppingCartLink(): Locator {
        return this.page.getByTestId('shopping-cart-link');
    }

    /**
     * Badge showing the number of items in the cart
     */
    private get cartBadge(): Locator {
        return this.page.getByTestId('shopping-cart-badge');
    }

    /**
     * Page title "Products"
     */
    private get pageTitle(): Locator {
        return this.page.getByTestId('title');
    }

    /**
     * Product sort dropdown
     */
    private get sortDropdown(): Locator {
        return this.page.getByTestId('product-sort-container');
    }

    /**
     * Currently active sort option text
     */
    private get activeSortOption(): Locator {
        return this.page.getByTestId('active-option');
    }

    // ============================================
    // Navigation Menu Locators
    // ============================================

    /**
     * "All Items" link in the side menu
     */
    private get allItemsLink(): Locator {
        return this.page.getByTestId('inventory-sidebar-link');
    }

    /**
     * "About" link in the side menu
     */
    private get aboutLink(): Locator {
        return this.page.getByTestId('about-sidebar-link');
    }

    /**
     * "Logout" link in the side menu
     */
    private get logoutLink(): Locator {
        return this.page.getByTestId('logout-sidebar-link');
    }

    /**
     * "Reset App State" link in the side menu
     */
    private get resetAppStateLink(): Locator {
        return this.page.getByTestId('reset-sidebar-link');
    }

    // ============================================
    // Product Locators
    // ============================================

    /**
     * Container for all product items
     */
    private get inventoryList(): Locator {
        return this.page.locator('.inventory_list');
    }

    /**
     * All product item cards
     */
    private get allProducts(): Locator {
        return this.page.locator('.inventory_item');
    }

    /**
     * Get a product by its name
     * @param productName - The exact product name (e.g., "Sauce Labs Backpack")
     */
    private getProductByName(productName: string): Locator {
        return this.page.locator('.inventory_item').filter({ hasText: productName });
    }

    /**
     * Get product image link by product name
     * @param productName - The exact product name
     */
    private getProductImageLink(productName: string): Locator {
        const productSlug = this.convertToSlug(productName);
        return this.page.getByTestId(`inventory-item-${productSlug}-img`);
    }

    /**
     * Get product title link by product name
     * @param productName - The exact product name
     */
    private getProductTitleLink(productName: string): Locator {
        return this.getProductByName(productName).getByTestId('inventory-item-name');
    }

    /**
     * Get product description by product name
     * @param productName - The exact product name
     */
    private getProductDescription(productName: string): Locator {
        return this.getProductByName(productName).getByTestId('inventory-item-desc');
    }

    /**
     * Get product price by product name
     * @param productName - The exact product name
     */
    private getProductPrice(productName: string): Locator {
        return this.getProductByName(productName).getByTestId('inventory-item-price');
    }

    /**
     * Get "Add to cart" button for a specific product
     * @param productName - The exact product name
     */
    private getAddToCartButton(productName: string): Locator {
        const productSlug = this.convertToSlug(productName);
        return this.page.getByTestId(`add-to-cart-${productSlug}`);
    }

    /**
     * Get "Remove" button for a specific product
     * @param productName - The exact product name
     */
    private getRemoveButton(productName: string): Locator {
        const productSlug = this.convertToSlug(productName);
        return this.page.getByTestId(`remove-${productSlug}`);
    }

    // ============================================
    // Footer Locators
    // ============================================

    /**
     * Twitter social media link
     */
    private get twitterLink(): Locator {
        return this.page.getByRole('link', { name: 'Twitter' });
    }

    /**
     * Facebook social media link
     */
    private get facebookLink(): Locator {
        return this.page.getByRole('link', { name: 'Facebook' });
    }

    /**
     * LinkedIn social media link
     */
    private get linkedInLink(): Locator {
        return this.page.getByRole('link', { name: 'LinkedIn' });
    }

    // ============================================
    // Actions
    // ============================================

    /**
     * Navigate to the inventory page
     */
    async navigate(): Promise<void> {
        await this.page.goto(this.url);
        await this.expectPageLoaded();
    }

    /**
     * Open the hamburger menu
     */
    async openMenu(): Promise<void> {
        await this.menuButton.click();
        await this.allItemsLink.waitFor({ state: 'visible' });
    }

    /**
     * Click on the shopping cart to view cart contents
     */
    async goToCart(): Promise<void> {
        await this.shoppingCartLink.click();
    }

    /**
     * Sort products by the specified option
     * @param option - Sort option: "az" | "za" | "lohi" | "hilo"
     */
    async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
        const sortMap = {
            az: 'Name (A to Z)',
            za: 'Name (Z to A)',
            lohi: 'Price (low to high)',
            hilo: 'Price (high to low)',
        };

        const value = {
            az: 'az',
            za: 'za',
            lohi: 'lohi',
            hilo: 'hilo',
        };

        await this.sortDropdown.selectOption(value[option]);
        await this.expectSortOption(sortMap[option]);
    }

    /**
     * Add a product to cart by its name
     * @param productName - The exact product name (e.g., "Sauce Labs Backpack")
     */
    async addProductToCart(productName: string): Promise<void> {
        await this.getAddToCartButton(productName).click();
        await this.expectProductInCart(productName);
    }

    /**
     * Remove a product from cart by its name
     * @param productName - The exact product name
     */
    async removeProductFromCart(productName: string): Promise<void> {
        await this.getRemoveButton(productName).click();
        await this.expectProductNotInCart(productName);
    }

    /**
     * Click on a product title to view product details
     * @param productName - The exact product name
     */
    async clickProductTitle(productName: string): Promise<void> {
        await this.getProductTitleLink(productName).click();
    }

    /**
     * Click on a product image to view product details
     * @param productName - The exact product name
     */
    async clickProductImage(productName: string): Promise<void> {
        await this.getProductImageLink(productName).click();
    }

    /**
     * Logout from the application
     */
    async logout(): Promise<void> {
        await this.openMenu();
        await this.logoutLink.click();
    }

    /**
     * Reset application state (removes all items from cart)
     */
    async resetAppState(): Promise<void> {
        await this.openMenu();
        await this.resetAppStateLink.click();
    }

    /**
     * Navigate to About page
     */
    async goToAbout(): Promise<void> {
        await this.openMenu();
        await this.aboutLink.click();
    }

    /**
     * Get the current number of items in the cart
     * @returns Cart count as number, or 0 if cart is empty
     */
    async getCartCount(): Promise<number> {
        // Check if cart badge exists first (doesn't exist when cart is empty)
        const badgeCount = await this.cartBadge.count();
        if (badgeCount === 0) {
            return 0;
        }

        try {
            const count = await this.cartBadge.textContent();
            return parseInt(count || '0', 10);
        } catch {
            return 0;
        }
    }

    /**
     * Get all visible product names on the page
     * @returns Array of product names
     */
    async getAllProductNames(): Promise<string[]> {
        // Use allTextContents with built-in auto-waiting
        // Auto-healed: 2026-08-03T14:30:00Z - locator_update (inventory-product-name → inventory-item-name)
        const names = await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
        console.log('Product names retrieved:', names);
        return names.filter(name => name.length > 0);
    }

    /**
     * Get price for a specific product
     * @param productName - The exact product name
     * @returns Price as string (e.g., "$29.99")
     */
    async getProductPriceText(productName: string): Promise<string> {
        return await this.getProductPrice(productName).textContent() || '';
    }

    /**
     * Get description for a specific product
     * @param productName - The exact product name
     * @returns Description text
     */
    async getProductDescriptionText(productName: string): Promise<string> {
        return await this.getProductDescription(productName).textContent() || '';
    }

    // ============================================
    // Assertions
    // ============================================

    /**
     * Verify that the inventory page is loaded
     */
    async expectPageLoaded(): Promise<void> {
        await expect(this.pageTitle).toBeVisible();
        await expect(this.pageTitle).toHaveText('Products');
        await expect(this.inventoryList).toBeVisible();
    }

    /**
     * Verify that the cart badge shows the expected count
     * @param count - Expected number of items in cart
     */
    async expectCartCount(count: number): Promise<void> {
        if (count === 0) {
            await expect(this.cartBadge).not.toBeVisible();
        } else {
            await expect(this.cartBadge).toBeVisible();
            await expect(this.cartBadge).toHaveText(count.toString());
        }
    }

    /**
     * Verify that a product is in the cart (Remove button is visible)
     * @param productName - The exact product name
     */
    async expectProductInCart(productName: string): Promise<void> {
        await expect(this.getRemoveButton(productName)).toBeVisible();
        await expect(this.getAddToCartButton(productName)).not.toBeVisible();
    }

    /**
     * Verify that a product is not in the cart (Add to cart button is visible)
     * @param productName - The exact product name
     */
    async expectProductNotInCart(productName: string): Promise<void> {
        await expect(this.getAddToCartButton(productName)).toBeVisible();
        await expect(this.getRemoveButton(productName)).not.toBeVisible();
    }

    /**
     * Verify that the correct sort option is selected
     * @param option - Expected sort option text
     */
    async expectSortOption(option: string): Promise<void> {
        await expect(this.activeSortOption).toHaveText(option);
    }

    /**
     * Verify that a specific product is visible on the page
     * @param productName - The exact product name
     */
    async expectProductVisible(productName: string): Promise<void> {
        await expect(this.getProductByName(productName)).toBeVisible();
    }

    /**
     * Verify that a specific product has the expected price
     * @param productName - The exact product name
     * @param expectedPrice - Expected price (e.g., "$29.99")
     */
    async expectProductPrice(productName: string, expectedPrice: string): Promise<void> {
        await expect(this.getProductPrice(productName)).toHaveText(expectedPrice);
    }

    /**
     * Verify that the specified number of products are displayed
     * @param count - Expected number of products
     */
    async expectProductCount(count: number): Promise<void> {
        await expect(this.allProducts).toHaveCount(count);
    }

    /**
     * Verify that products are sorted alphabetically A to Z
     */
    async expectProductsSortedAtoZ(): Promise<void> {
        const names = await this.getAllProductNames();
        const sorted = [...names].sort();
        expect(names).toEqual(sorted);
    }

    /**
     * Verify that products are sorted alphabetically Z to A
     */
    async expectProductsSortedZtoA(): Promise<void> {
        const names = await this.getAllProductNames();
        const sorted = [...names].sort().reverse();
        expect(names).toEqual(sorted);
    }

    // ============================================
    // Helper Methods
    // ============================================

    /**
     * Convert product name to slug format for data-test attributes
    /**
     * Convert product name to slug format used in data-testid attributes
     * Examples:
     * - "Sauce Labs Backpack" -> "sauce-labs-backpack"
     * - "Test.allTheThings() T-Shirt (Red)" -> "test.allthethings()-t-shirt-(red)"
     * @param productName - Product name to convert
     * @returns Slugified product name
     */
    private convertToSlug(productName: string): string {
        return productName
            .toLowerCase()
            .replace(/\s+/g, '-');  // Only replace spaces with hyphens, keep dots and parentheses
    }
}

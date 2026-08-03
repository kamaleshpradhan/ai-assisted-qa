import { chromium } from '@playwright/test';

/**
 * Exploration script for Saucedemo product names
 * This script will login and inspect the product listing page
 */
async function exploreSaucedemo() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('🌐 Navigating to Saucedemo...');
        await page.goto('https://www.saucedemo.com');

        // Take screenshot of login page
        await page.screenshot({ path: 'screenshots/saucedemo-login.png', fullPage: true });
        console.log('📸 Login page screenshot saved');

        // Login
        console.log('🔐 Logging in...');
        await page.fill('[data-test="username"]', 'standard_user');
        await page.fill('[data-test="password"]', 'secret_sauce');
        await page.click('[data-test="login-button"]');

        // Wait for inventory page
        await page.waitForURL('**/inventory.html');
        console.log('✅ Successfully logged in to inventory page');

        // Take screenshot of inventory page
        await page.screenshot({ path: 'screenshots/saucedemo-inventory.png', fullPage: true });
        console.log('📸 Inventory page screenshot saved');

        // Inspect product name elements
        console.log('\n🔍 Inspecting product name elements...\n');

        // Get all product items
        const productItems = await page.locator('.inventory_item').all();
        console.log(`Found ${productItems.length} product items\n`);

        // Analyze first product to understand structure
        if (productItems.length > 0) {
            const firstProduct = productItems[0];
            const html = await firstProduct.innerHTML();
            console.log('📦 First product HTML structure:');
            console.log(html);
            console.log('\n');
        }

        // Try different selector strategies for product names
        console.log('🎯 Testing selector strategies for product names:\n');

        // Strategy 1: data-test attribute
        const dataTestNames = await page.locator('[data-test*="item"]').allTextContents();
        console.log('1️⃣  [data-test*="item"] found:', dataTestNames.length, 'elements');

        // Strategy 2: inventory_item_name class
        const classNames = await page.locator('.inventory_item_name').allTextContents();
        console.log('2️⃣  .inventory_item_name found:', classNames.length, 'elements');
        if (classNames.length > 0) {
            console.log('   Product names:', classNames);
        }

        // Strategy 3: Check specific data-test attributes
        const productNameLinks = await page.locator('[data-test="inventory-item-name"]').allTextContents();
        console.log('3️⃣  [data-test="inventory-item-name"] found:', productNameLinks.length, 'elements');
        if (productNameLinks.length > 0) {
            console.log('   Product names:', productNameLinks);
        }

        // Get detailed attributes of product name elements
        console.log('\n📋 Detailed attributes of product name elements:\n');
        const nameElements = await page.locator('.inventory_item_name').all();
        for (let i = 0; i < Math.min(nameElements.length, 3); i++) {
            const element = nameElements[i];
            const text = await element.textContent();
            const dataTest = await element.getAttribute('data-test');
            const className = await element.getAttribute('class');
            const tagName = await element.evaluate(el => el.tagName);

            console.log(`Product ${i + 1}:`);
            console.log(`  Text: ${text}`);
            console.log(`  Tag: ${tagName}`);
            console.log(`  Class: ${className}`);
            console.log(`  data-test: ${dataTest}`);
            console.log('');
        }

        // Check parent structure
        console.log('🏗️  Parent structure analysis:\n');
        const firstNameElement = await page.locator('.inventory_item_name').first();
        const parent = await firstNameElement.locator('xpath=..').first();
        const parentClass = await parent.getAttribute('class');
        const parentTag = await parent.evaluate(el => el.tagName);
        console.log(`Parent Tag: ${parentTag}`);
        console.log(`Parent Class: ${parentClass}`);

        // Best selector recommendation
        console.log('\n✨ RECOMMENDED SELECTOR:\n');
        const recommendedSelector = '.inventory_item_name';
        const count = await page.locator(recommendedSelector).count();
        const allNames = await page.locator(recommendedSelector).allTextContents();

        console.log(`Selector: ${recommendedSelector}`);
        console.log(`Count: ${count}`);
        console.log(`Product Names:`);
        allNames.forEach((name, index) => {
            console.log(`  ${index + 1}. ${name}`);
        });

        console.log('\n✅ Exploration complete! Check screenshots folder for visual reference.');

        // Keep browser open for manual inspection
        console.log('\n⏸️  Browser will remain open for 30 seconds for manual inspection...');
        await page.waitForTimeout(30000);

    } catch (error) {
        console.error('❌ Error during exploration:', error);
    } finally {
        await browser.close();
    }
}

exploreSaucedemo();

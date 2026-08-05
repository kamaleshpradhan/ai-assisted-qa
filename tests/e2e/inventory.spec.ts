import { test, expect } from '@playwright/test';
import { SauceDemoLoginPage } from '@pages/saucedemo-login.page';
import { InventoryPage } from '@pages/inventory.page';
import { standardUser } from '@fixtures/saucedemo-users.fixture';
import { allure } from 'allure-playwright';

test.describe('Inventory Page - Product Listing and Cart', () => {
  let loginPage: SauceDemoLoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    await allure.epic('E-Commerce');
    await allure.feature('Product Catalog');

    // Initialize page objects
    loginPage = new SauceDemoLoginPage(page);
    inventoryPage = new InventoryPage(page);

    // Login before each test
    await allure.step('Navigate to Sauce Demo login page', async () => {
      await loginPage.navigate();
    });

    await allure.step('Login with standard user credentials', async () => {
      await loginPage.login(standardUser.username, standardUser.password);
    });

    await allure.step('Verify navigation to inventory page', async () => {
      await inventoryPage.expectPageLoaded();
    });
  });

  test('should display all products on the inventory page @smoke @ui', async () => {
    await allure.story('Product display');
    await allure.severity('critical');

    await allure.step('Verify that products are displayed on the page', async () => {
      // Verify page loaded with products
      await inventoryPage.expectPageLoaded();
      
      // Verify expected number of products (Sauce Demo has 6 products)
      await inventoryPage.expectProductCount(6);
    });

    await allure.step('Verify all expected products are visible', async () => {
      // Get all product names
      const productNames = await inventoryPage.getAllProductNames();
      
      // Verify we have products
      expect(productNames.length).toBeGreaterThan(0);
      
      // Verify specific products exist (from the page object documentation)
      const expectedProducts = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt',
        'Sauce Labs Fleece Jacket',
        'Sauce Labs Onesie',
        'Test.allTheThings() T-Shirt (Red)',
      ];

      for (const productName of expectedProducts) {
        expect(productNames).toContain(productName);
        await inventoryPage.expectProductVisible(productName);
      }
    });

    await allure.step('Verify product details are displayed correctly', async () => {
      // Verify first product has all expected elements
      const firstProduct = 'Sauce Labs Backpack';
      
      await inventoryPage.expectProductVisible(firstProduct);
      await inventoryPage.expectProductPrice(firstProduct, '$29.99');
      
      // Verify description is present
      const description = await inventoryPage.getProductDescriptionText(firstProduct);
      expect(description.length).toBeGreaterThan(0);
    });
  });

  test('should add a randomly chosen product to cart @smoke @ui', async () => {
    await allure.story('Add to cart');
    await allure.severity('critical');

    // Get initial cart count
    const initialCartCount = await inventoryPage.getCartCount();
    expect(initialCartCount).toBeGreaterThanOrEqual(0);

    // Get all available products
    const allProducts = await inventoryPage.getAllProductNames();
    expect(allProducts.length).toBeGreaterThan(0);
    
    // Select a random product
    const randomIndex = Math.floor(Math.random() * allProducts.length);
    const randomProduct = allProducts[randomIndex];
    
    await allure.attachment('Selected Product', randomProduct, 'text/plain');

    // Verify product is not in cart initially
    await inventoryPage.expectProductNotInCart(randomProduct);
    
    // Add product to cart
    await inventoryPage.addProductToCart(randomProduct);

    // Verify cart count increased by 1
    await inventoryPage.expectCartCount(initialCartCount + 1);
    
    // Get and verify actual cart count
    const newCartCount = await inventoryPage.getCartCount();
    expect(newCartCount).toBe(initialCartCount + 1);
  });

  test('should add multiple random products to cart @regression @ui', async () => {
    await allure.story('Add multiple items to cart');
    await allure.severity('normal');

    const productsToAdd = 3;
    const addedProducts: string[] = [];

    await allure.step('Verify cart is initially empty', async () => {
      await inventoryPage.expectCartCount(0);
    });

    await allure.step(`Add ${productsToAdd} random products to cart`, async () => {
      const allProducts = await inventoryPage.getAllProductNames();
      
      // Shuffle array to get random products
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
      const selectedProducts = shuffled.slice(0, productsToAdd);

      for (let i = 0; i < selectedProducts.length; i++) {
        const product = selectedProducts[i];
        
        await allure.step(`Add product ${i + 1}: "${product}"`, async () => {
          await inventoryPage.addProductToCart(product);
          addedProducts.push(product);
          
          // Verify cart count after each addition
          await inventoryPage.expectCartCount(i + 1);
        });
      }
      
      await allure.attachment('Added Products', addedProducts.join(', '), 'text/plain');
    });

    await allure.step('Verify all products are in cart', async () => {
      // Verify final cart count
      await inventoryPage.expectCartCount(productsToAdd);
      
      // Verify each product shows Remove button
      for (const product of addedProducts) {
        await inventoryPage.expectProductInCart(product);
      }
    });
  });

  test('should remove product from cart after adding it @regression @ui', async () => {
    await allure.story('Remove from cart');
    await allure.severity('normal');

    let selectedProduct: string;

    await allure.step('Select and add a random product to cart', async () => {
      const allProducts = await inventoryPage.getAllProductNames();
      const randomIndex = Math.floor(Math.random() * allProducts.length);
      selectedProduct = allProducts[randomIndex];
      
      await inventoryPage.addProductToCart(selectedProduct);
      await inventoryPage.expectCartCount(1);
    });

    await allure.step(`Remove "${selectedProduct}" from cart`, async () => {
      await inventoryPage.removeProductFromCart(selectedProduct);
    });

    await allure.step('Verify product was removed from cart', async () => {
      // Verify Add to cart button is visible again
      await inventoryPage.expectProductNotInCart(selectedProduct);
      
      // Verify cart is empty
      await inventoryPage.expectCartCount(0);
    });
  });

  test('should display correct product prices @regression @ui', async () => {
    await allure.story('Product pricing');
    await allure.severity('normal');

    await allure.step('Verify all products have valid prices', async () => {
      const productPrices = {
        'Sauce Labs Backpack': '$29.99',
        'Sauce Labs Bike Light': '$9.99',
        'Sauce Labs Bolt T-Shirt': '$15.99',
        'Sauce Labs Fleece Jacket': '$49.99',
        'Sauce Labs Onesie': '$7.99',
        'Test.allTheThings() T-Shirt (Red)': '$15.99',
      };

      for (const [productName, expectedPrice] of Object.entries(productPrices)) {
        await inventoryPage.expectProductPrice(productName, expectedPrice);
      }
    });
  });
});

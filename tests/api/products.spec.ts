import { test, expect } from '@playwright/test';
import { APIClient } from '@utils/api.util';
import {
  validProduct,
  invalidProduct,
  apiEndpoints,
  expectedResponses,
} from '@fixtures/api.fixture';
import { allure } from 'allure-playwright';

test.describe('Products API Tests', () => {
  let apiClient: APIClient;

  test.beforeAll(async ({ request }) => {
    apiClient = new APIClient(request);
  });

  test('should get all products @smoke @api', async () => {
    await allure.epic('API Testing');
    await allure.feature('Products API');
    await allure.story('Get all products');
    await allure.severity('critical');

    const response = await apiClient.get(apiEndpoints.products);

    expect(apiClient.isSuccessful(response)).toBeTruthy();
    expect(apiClient.getStatusCode(response)).toBe(expectedResponses.success.status);

    const data = (await apiClient.getResponseData(response)) as unknown[];
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });

  test('should get single product by ID @smoke @api', async () => {
    await allure.epic('API Testing');
    await allure.feature('Products API');
    await allure.story('Get product by ID');
    await allure.severity('critical');

    const productId = 1;
    const response = await apiClient.get(`${apiEndpoints.products}/${productId}`);

    expect(apiClient.getStatusCode(response)).toBe(200);

    const data = (await apiClient.getResponseData(response)) as Product & { id: number };
    expect(data).toHaveProperty('id', productId);
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('price');
    expect(data).toHaveProperty('category');
  });

  test('should create new product with valid data @regression @api', async () => {
    await allure.epic('API Testing');
    await allure.feature('Products API');
    await allure.story('Create new product');
    await allure.severity('critical');

    const response = await apiClient.post(apiEndpoints.products, validProduct);

    expect(apiClient.getStatusCode(response)).toBe(expectedResponses.created.status);

    const data = (await apiClient.getResponseData(response)) as Product & { id: number };
    expect(data).toMatchObject({
      name: validProduct.name,
      price: validProduct.price,
      category: validProduct.category,
    });
    expect(data).toHaveProperty('id');
  });

  test('should return 400 when creating product without name @regression @api', async () => {
    await allure.epic('API Testing');
    await allure.feature('Products API');
    await allure.story('Product validation');
    await allure.severity('normal');

    const response = await apiClient.post(apiEndpoints.products, invalidProduct.missingName);

    expect(apiClient.getStatusCode(response)).toBe(expectedResponses.badRequest.status);

    const data = (await apiClient.getResponseData(response)) as { error: string };
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('name');
  });

  test('should update existing product @regression @api', async () => {
    await allure.epic('API Testing');
    await allure.feature('Products API');
    await allure.story('Update product');
    await allure.severity('normal');

    const productId = 1;
    const updatedData = {
      name: 'Updated Product Name',
      price: 149.99,
    };

    const response = await apiClient.put(`${apiEndpoints.products}/${productId}`, updatedData);

    expect(apiClient.getStatusCode(response)).toBe(200);

    const data = (await apiClient.getResponseData(response)) as typeof updatedData;
    expect(data.name).toBe(updatedData.name);
    expect(data.price).toBe(updatedData.price);
  });

  test('should delete product by ID @regression @api', async () => {
    await allure.epic('API Testing');
    await allure.feature('Products API');
    await allure.story('Delete product');
    await allure.severity('normal');

    const createResponse = await apiClient.post(apiEndpoints.products, validProduct);
    const createdProduct = (await apiClient.getResponseData(createResponse)) as Product & {
      id: number;
    };
    const productId = createdProduct.id;

    const deleteResponse = await apiClient.delete(`${apiEndpoints.products}/${productId}`);
    expect(apiClient.getStatusCode(deleteResponse)).toBe(200);

    const getResponse = await apiClient.get(`${apiEndpoints.products}/${productId}`);
    expect(apiClient.getStatusCode(getResponse)).toBe(expectedResponses.notFound.status);
  });

  test('should return 404 for non-existent product @regression @api', async () => {
    await allure.epic('API Testing');
    await allure.feature('Products API');
    await allure.story('Error handling');
    await allure.severity('normal');

    const nonExistentId = 999999;
    const response = await apiClient.get(`${apiEndpoints.products}/${nonExistentId}`);

    expect(apiClient.getStatusCode(response)).toBe(expectedResponses.notFound.status);
  });

  test('should filter products by category @regression @api', async () => {
    await allure.epic('API Testing');
    await allure.feature('Products API');
    await allure.story('Product filtering');
    await allure.severity('normal');

    const category = 'Electronics';
    const response = await apiClient.get(`${apiEndpoints.products}?category=${category}`);

    expect(apiClient.getStatusCode(response)).toBe(200);

    const data = (await apiClient.getResponseData(response)) as Product[];
    expect(Array.isArray(data)).toBeTruthy();
    data.forEach((product: Product) => {
      expect(product.category).toBe(category);
    });
  });
});

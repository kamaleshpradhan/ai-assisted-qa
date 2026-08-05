/**
 * API test data fixtures
 * Provides consistent test data for API testing
 */

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

export interface APIResponse {
  status: number;
  message: string;
  data?: unknown;
}

export const validProduct: Product = {
  name: 'Test Product',
  description: 'This is a test product description',
  price: 99.99,
  category: 'Electronics',
  inStock: true,
};

export const invalidProduct = {
  missingName: {
    description: 'Product without name',
    price: 99.99,
    category: 'Electronics',
  },
  invalidPrice: {
    name: 'Invalid Price Product',
    description: 'Product with invalid price',
    price: -10,
    category: 'Electronics',
  },
  emptyCategory: {
    name: 'No Category Product',
    description: 'Product without category',
    price: 99.99,
    category: '',
  },
};

export const apiEndpoints = {
  users: '/api/users',
  products: '/api/products',
  orders: '/api/orders',
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    register: '/api/auth/register',
  },
};

export const expectedResponses = {
  success: {
    status: 200,
    message: 'Success',
  },
  created: {
    status: 201,
    message: 'Created',
  },
  badRequest: {
    status: 400,
    message: 'Bad Request',
  },
  unauthorized: {
    status: 401,
    message: 'Unauthorized',
  },
  notFound: {
    status: 404,
    message: 'Not Found',
  },
  serverError: {
    status: 500,
    message: 'Internal Server Error',
  },
};

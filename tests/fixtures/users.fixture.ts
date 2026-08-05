/**
 * User test data fixtures
 * Provides consistent test data for user-related tests
 */

export interface User {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export const validUser: User = {
  email: 'testuser@example.com',
  password: 'SecurePassword123!',
  firstName: 'Test',
  lastName: 'User',
  role: 'customer',
};

export const adminUser: User = {
  email: 'admin@example.com',
  password: 'AdminPassword123!',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
};

export const invalidUsers = {
  invalidEmail: {
    email: 'invalid-email',
    password: 'SecurePassword123!',
  },
  wrongPassword: {
    email: 'testuser@example.com',
    password: 'WrongPassword123!',
  },
  emptyEmail: {
    email: '',
    password: 'SecurePassword123!',
  },
  emptyPassword: {
    email: 'testuser@example.com',
    password: '',
  },
  nonExistentUser: {
    email: 'nonexistent@example.com',
    password: 'SecurePassword123!',
  },
};

export const multipleUsers: User[] = [
  {
    email: 'user1@example.com',
    password: 'Password123!',
    firstName: 'User',
    lastName: 'One',
  },
  {
    email: 'user2@example.com',
    password: 'Password123!',
    firstName: 'User',
    lastName: 'Two',
  },
  {
    email: 'user3@example.com',
    password: 'Password123!',
    firstName: 'User',
    lastName: 'Three',
  },
];

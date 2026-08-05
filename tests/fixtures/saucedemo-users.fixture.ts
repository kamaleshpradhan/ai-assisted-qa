/**
 * Sauce Demo user test data fixtures
 * Provides consistent test data for Sauce Demo application tests
 * All users share the same password: secret_sauce
 */

export interface SauceDemoUser {
  username: string;
  password: string;
  description: string;
}

/**
 * Standard user with no restrictions
 * Recommended for most test scenarios
 */
export const standardUser: SauceDemoUser = {
  username: 'standard_user',
  password: 'secret_sauce',
  description: 'Standard user with full access',
};

/**
 * Locked out user - cannot login
 * Use for negative login test scenarios
 */
export const lockedOutUser: SauceDemoUser = {
  username: 'locked_out_user',
  password: 'secret_sauce',
  description: 'User account is locked',
};

/**
 * Problem user - experiences various issues
 * Use for edge case and error handling tests
 */
export const problemUser: SauceDemoUser = {
  username: 'problem_user',
  password: 'secret_sauce',
  description: 'User encounters various application problems',
};

/**
 * Performance glitch user - slow response times
 * Use for performance and timeout testing
 */
export const performanceGlitchUser: SauceDemoUser = {
  username: 'performance_glitch_user',
  password: 'secret_sauce',
  description: 'User with performance issues',
};

/**
 * Error user - various errors during usage
 * Use for error handling and recovery tests
 */
export const errorUser: SauceDemoUser = {
  username: 'error_user',
  password: 'secret_sauce',
  description: 'User that triggers various errors',
};

/**
 * Visual user - for visual regression testing
 * Use for visual testing scenarios
 */
export const visualUser: SauceDemoUser = {
  username: 'visual_user',
  password: 'secret_sauce',
  description: 'User for visual regression testing',
};

/**
 * Array of all valid users (excluding locked_out_user)
 */
export const validSauceDemoUsers: SauceDemoUser[] = [
  standardUser,
  problemUser,
  performanceGlitchUser,
  errorUser,
  visualUser,
];

/**
 * Array of invalid users for negative testing
 */
export const invalidSauceDemoUsers = [
  {
    username: 'invalid_user',
    password: 'secret_sauce',
    description: 'Non-existent username',
  },
  {
    username: 'standard_user',
    password: 'wrong_password',
    description: 'Valid user with wrong password',
  },
  {
    username: '',
    password: 'secret_sauce',
    description: 'Empty username',
  },
  {
    username: 'standard_user',
    password: '',
    description: 'Empty password',
  },
];

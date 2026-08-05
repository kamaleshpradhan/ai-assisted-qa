import { FullConfig } from '@playwright/test';

/**
 * Global teardown runs once after all tests
 * Use for cleanup operations
 */
async function globalTeardown(_config: FullConfig): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('\n✅ Test execution completed\n');

  // You can add cleanup here:
  // - Delete test data
  // - Close database connections
  // - Clean up temporary files
  // - Send test completion notifications
}

export default globalTeardown;

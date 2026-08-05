import { FullConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

/**
 * Global setup runs once before all tests
 * Use for environment validation, test data preparation, etc.
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  // Load environment variables
  dotenv.config();

  const environment = process.env.ENV || 'dev';
  // eslint-disable-next-line no-console
  console.log(`\n🚀 Starting test execution on ${environment.toUpperCase()} environment\n`);

  // Validate required environment variables
  const requiredEnvVars = ['ENV'];
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
  }

  // You can add additional setup here:
  // - Database seeding
  // - Test user creation
  // - Cache warming
  // - External service health checks
}

export default globalSetup;

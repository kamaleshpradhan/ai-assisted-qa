import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

/**
 * Environment configuration for multi-environment support
 * Supports: dev, st, sit, e2e
 */
const environment = process.env.ENV || 'dev';

const envConfigs = {
  dev: {
    baseURL: process.env.DEV_BASE_URL || 'https://dev.example.com',
    apiURL: process.env.DEV_API_URL || 'https://api-dev.example.com',
  },
  st: {
    baseURL: process.env.ST_BASE_URL || 'https://st.example.com',
    apiURL: process.env.ST_API_URL || 'https://api-st.example.com',
  },
  sit: {
    baseURL: process.env.SIT_BASE_URL || 'https://sit.example.com',
    apiURL: process.env.SIT_API_URL || 'https://api-sit.example.com',
  },
  e2e: {
    baseURL: process.env.E2E_BASE_URL || 'https://e2e.example.com',
    apiURL: process.env.E2E_API_URL || 'https://api-e2e.example.com',
  },
};

const currentEnvConfig = envConfigs[environment as keyof typeof envConfigs] || envConfigs.dev;

export default defineConfig({
  testDir: './tests',

  /* Maximum time one test can run for */
  timeout: 60 * 1000,

  /* Expect timeout for assertions */
  expect: {
    timeout: 10000,
  },

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 2 : undefined,

  /* Reporter to use */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        environmentInfo: {
          Environment: environment,
          'Base URL': currentEnvConfig.baseURL,
          'API URL': currentEnvConfig.apiURL,
        },
      },
    ],
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: currentEnvConfig.baseURL,

    /* Configure test ID attribute for getByTestId() - supports data-test */
    testIdAttribute: 'data-test',

    /* Collect trace when retrying the failed test */
    trace: 'retain-on-failure',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on first retry */
    video: 'retain-on-failure',

    /* Browser options */
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,

    /* Additional context options */
    contextOptions: {
      permissions: [],
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
  ],

  /* Global setup and teardown */
  globalSetup: path.resolve(__dirname, 'tests/config/global-setup.ts'),
  globalTeardown: path.resolve(__dirname, 'tests/config/global-teardown.ts'),

  /* Output folders */
  outputDir: 'test-results',
});

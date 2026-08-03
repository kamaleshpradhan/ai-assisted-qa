# Example prompts while using the test framework agents

## Framework Setup:

@playwright-test-framework Set up a new Playwright test framework with support for Dev, ST, SIT, and E2E environments

## Test Development:

@playwright-test-framework Create a test scenario for user login with valid and invalid credentials

@playwright-test-framework Add API tests for the /products endpoint with GET and POST operations

## Test Execution & Troubleshooting:

@playwright-test-framework Run all tests in the tests/checkout/ folder and fix any failures

@playwright-test-framework Execute the login.spec.ts test and troubleshoot if it fails

## Framework Enhancement:

@playwright-test-framework Add visual regression testing capability to the framework

@playwright-test-framework Optimize our test execution time - identify slow tests and improve them

## Test Data Generator Prompt

/generate-test-data Create user profiles with addresses and payment methods

/generate-test-data Generate product catalog data with 10 items

/generate-test-data API payloads for order creation endpoint

## Test Reviewer Agent

@test-reviewer Review the test changes in tests/checkout/

@test-reviewer Analyze test quality in this PR and provide feedback

@test-reviewer Check if these tests follow best practices

# Complete Workflow Example

Here's how these work together:

1. Generate test data:  
   /generate-test-data Create checkout test data with cart items

2. Write tests -  
   Framework instructions automatically guide you with best practices

3. Edit & Save - Hooks automatically:

   - Validate your code
   - Format with Prettier
   - Fix ESLint issues

4. Create PR - Review your tests:  
   @test-reviewer Review my new checkout tests for quality and coverage

5. Run & Troubleshoot:  
   @playwright-test-framework Run checkout tests and fix any failures

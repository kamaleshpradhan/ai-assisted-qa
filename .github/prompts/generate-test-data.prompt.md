---
description: 'Generate realistic test data fixtures for Playwright tests including user profiles, product catalogs, order data, API payloads, or custom data structures'
argument-hint: "Describe the type of test data needed (e.g., 'user profiles with addresses', 'product catalog JSON', 'order objects')"
agent: 'agent'
tools: [read, edit, search]
---

Generate realistic, production-like test data fixtures for Playwright test scenarios.

## Requirements

Based on the user's request, create test data that includes:

1. **Data Structure Analysis**: Review existing test files and fixtures to understand the current data patterns and schemas
2. **Realistic Values**: Generate data that resembles real-world scenarios:
   - Valid email formats, phone numbers, addresses
   - Realistic names, product titles, descriptions
   - Appropriate data types and ranges
   - Edge cases (min/max values, special characters, empty strings)
3. **Multiple Variations**: Create at least 3-5 data variations for comprehensive testing
4. **TypeScript Types**: Include TypeScript interfaces/types for the generated data
5. **Environment-Specific Data**: If applicable, provide variations for Dev, ST, SIT, and E2E environments

## Output Format

Create or update fixture files in `tests/fixtures/` directory:

```typescript
// tests/fixtures/[fixture-name].fixture.ts

export interface [TypeName] {
  // property definitions
}

export const [dataSetName]: [TypeName][] = [
  {
    // realistic data
  },
  // more variations
];

// Export individual items for convenience
export const [singularName] = [dataSetName][0];
```

## Data Categories to Support

- **User Data**: Names, emails, addresses, phone numbers, credentials
- **Product Data**: SKUs, names, prices, descriptions, categories, inventory
- **Order Data**: Order IDs, items, totals, status, timestamps
- **API Payloads**: Request/response bodies for API tests
- **Form Data**: Registration, checkout, profile update data
- **Search Data**: Query strings, filters, sort options
- **Error Scenarios**: Invalid data for negative testing

## Best Practices

- Use Faker.js patterns where appropriate (but generate actual values, not faker calls)
- Include edge cases: empty strings, max lengths, special characters
- Add JSDoc comments explaining the purpose of each dataset
- Follow existing naming conventions in the project
- Make data easily maintainable and readable
- Consider data privacy - avoid using real PII

Save generated fixtures and provide usage examples for tests.

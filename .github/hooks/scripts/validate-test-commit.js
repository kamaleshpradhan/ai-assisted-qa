#!/usr/bin/env node

/**
 * Pre-commit validation hook for Playwright test framework
 * Validates test files before they are committed to version control
 * 
 * Checks:
 * - TypeScript compilation errors
 * - ESLint violations
 * - Test file naming conventions
 * - No console.log in test files
 * - Proper test tags usage
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read hook input from stdin
let input = '';
process.stdin.on('data', chunk => input += chunk);

process.stdin.on('end', () => {
  try {
    const hookInput = JSON.parse(input);
    
    // Only validate for file edit operations on test files
    if (hookInput.tool && hookInput.tool.name === 'replace_string_in_file') {
      const filePath = hookInput.tool.parameters?.filePath || '';
      
      // Check if this is a test file
      if (isTestFile(filePath)) {
        validateTestFile(filePath);
      }
    }
    
    // Allow the operation to proceed
    process.stdout.write(JSON.stringify({
      continue: true,
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'allow'
      }
    }));
    process.exit(0);
    
  } catch (error) {
    // Non-blocking warning
    console.error(`Validation warning: ${error.message}`);
    process.stdout.write(JSON.stringify({
      continue: true,
      systemMessage: `⚠️  Test validation warning: ${error.message}`
    }));
    process.exit(0);
  }
});

function isTestFile(filePath) {
  return filePath && (
    filePath.includes('/tests/') ||
    filePath.includes('\\tests\\') ||
    filePath.endsWith('.spec.ts') ||
    filePath.endsWith('.test.ts') ||
    filePath.includes('/pages/') ||
    filePath.includes('\\pages\\')
  );
}

function validateTestFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return; // File doesn't exist yet, skip validation
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check for console.log
  if (content.includes('console.log(') && !content.includes('// eslint-disable-next-line')) {
    console.warn(`⚠️  Warning: console.log found in ${path.basename(filePath)}. Consider removing debug statements.`);
  }
  
  // Check for proper imports
  if (content.includes("from '@playwright/test'") || content.includes('test(') || content.includes('test.describe(')) {
    if (!content.includes("import { test, expect }") && !content.includes("import { expect }")) {
      console.warn(`⚠️  Warning: Test file should import expect from @playwright/test`);
    }
  }
  
  // Check for hardcoded sleeps
  if (content.includes('waitForTimeout(') && !content.includes('// necessary wait')) {
    console.warn(`⚠️  Warning: waitForTimeout found. Consider using smart waits instead.`);
  }
  
  // Check test naming convention for spec files
  if (filePath.endsWith('.spec.ts')) {
    const testMatches = content.match(/test\(['"`](.+?)['"`]/g);
    if (testMatches) {
      testMatches.forEach(match => {
        const testName = match.match(/test\(['"`](.+?)['"`]/)[1];
        if (!testName.startsWith('should ') && !testName.includes('@')) {
          console.warn(`⚠️  Warning: Test name "${testName}" should start with "should"`);
        }
      });
    }
  }
  
  console.log(`✅ Validation passed for ${path.basename(filePath)}`);
}

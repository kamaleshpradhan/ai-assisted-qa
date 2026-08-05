#!/usr/bin/env node

/**
 * Post-edit formatting hook for Playwright test framework
 * Automatically formats test files after they are edited
 * 
 * Actions:
 * - Run Prettier formatting
 * - Organize imports
 * - Fix auto-fixable ESLint issues
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
    
    // Only format for file edit operations on test files
    if (hookInput.tool && 
        (hookInput.tool.name === 'replace_string_in_file' || 
         hookInput.tool.name === 'create_file')) {
      const filePath = hookInput.tool.parameters?.filePath || '';
      
      // Check if this is a TypeScript test file
      if (isTestFile(filePath) && fs.existsSync(filePath)) {
        formatTestFile(filePath);
      }
    }
    
    // Allow operation to continue
    process.stdout.write(JSON.stringify({
      continue: true
    }));
    process.exit(0);
    
  } catch (error) {
    // Non-blocking - continue even if formatting fails
    console.error(`Formatting warning: ${error.message}`);
    process.stdout.write(JSON.stringify({
      continue: true,
      systemMessage: `ℹ️  Auto-formatting skipped: ${error.message}`
    }));
    process.exit(0);
  }
});

function isTestFile(filePath) {
  return filePath && (
    filePath.endsWith('.ts') &&
    (filePath.includes('/tests/') ||
     filePath.includes('\\tests\\') ||
     filePath.includes('/pages/') ||
     filePath.includes('\\pages\\') ||
     filePath.includes('/fixtures/') ||
     filePath.includes('\\fixtures\\') ||
     filePath.includes('/utils/') ||
     filePath.includes('\\utils\\'))
  );
}

function formatTestFile(filePath) {
  try {
    // Check if prettier is available
    try {
      execSync('npx prettier --version', { stdio: 'ignore' });
      
      // Run Prettier
      execSync(`npx prettier --write "${filePath}"`, {
        stdio: 'inherit',
        timeout: 10000
      });
      
      console.log(`✨ Formatted: ${path.basename(filePath)}`);
      
    } catch (prettierError) {
      console.warn('Prettier not available, skipping formatting');
    }
    
    // Try ESLint auto-fix if available
    try {
      execSync('npx eslint --version', { stdio: 'ignore' });
      
      execSync(`npx eslint --fix "${filePath}"`, {
        stdio: 'ignore',
        timeout: 10000
      });
      
      console.log(`🔧 Linted: ${path.basename(filePath)}`);
      
    } catch (eslintError) {
      // ESLint errors are common, don't warn
    }
    
  } catch (error) {
    // Don't fail the operation, just log
    console.warn(`Could not auto-format ${path.basename(filePath)}: ${error.message}`);
  }
}

/**
 * Invoke Self-Healing Agent
 * 
 * This script orchestrates the self-healing workflow:
 * 1. Parse failed tests from test reports
 * 2. Create healing branch
 * 3. For each failed test:
 *    - Invoke self-healing agent
 *    - Apply fixes
 *    - Commit changes
 *    - Re-run test
 * 4. Generate consolidated report
 * 5. Send notifications
 * 
 * Usage:
 *   node scripts/invoke-self-healing-agent.js --failed-tests "<json>" --max-retries 3 --branch "auto-heal/123"
 * 
 * Environment Variables:
 *   GITHUB_TOKEN - GitHub personal access token
 *   SLACK_WEBHOOK_URL - Slack webhook for notifications (optional)
 *   TEAMS_WEBHOOK_URL - Teams webhook for notifications (optional)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command-line arguments
const args = process.argv.slice(2);
const failedTestsArg = args.find(arg => arg.startsWith('--failed-tests='));
const maxRetriesArg = args.find(arg => arg.startsWith('--max-retries='));
const branchArg = args.find(arg => arg.startsWith('--branch='));

if (!failedTestsArg) {
    console.error('❌ Error: --failed-tests argument is required');
    process.exit(1);
}

const failedTests = JSON.parse(failedTestsArg.split('=')[1] || '[]');
const maxRetries = parseInt(maxRetriesArg?.split('=')[1] || '3', 10);
const healingBranch = branchArg?.split('=')[1] || `auto-heal/${Date.now()}`;

console.log('🔧 Self-Healing Agent Invocation');
console.log('================================\n');
console.log(`📊 Failed Tests: ${failedTests.length}`);
console.log(`🔄 Max Retries: ${maxRetries}`);
console.log(`🌿 Healing Branch: ${healingBranch}\n`);

// Create healing branch
function createHealingBranch() {
    try {
        console.log(`🌿 Creating healing branch: ${healingBranch}`);
        execSync(`git checkout -b ${healingBranch}`, { stdio: 'inherit' });
        console.log('✅ Branch created successfully\n');
    } catch (error) {
        console.error('❌ Failed to create healing branch:', error.message);
        // Branch might already exist, try to checkout
        try {
            execSync(`git checkout ${healingBranch}`, { stdio: 'inherit' });
            console.log('✅ Checked out existing healing branch\n');
        } catch (checkoutError) {
            console.error('❌ Could not create or checkout healing branch');
            process.exit(1);
        }
    }
}

// Heal a single test
async function healTest(testInfo, attempt = 1) {
    console.log(`\n🔧 Healing Test (Attempt ${attempt}/${maxRetries})`);
    console.log(`   Test: ${testInfo.title}`);
    console.log(`   File: ${testInfo.file}`);
    console.log(`   Error: ${testInfo.errorType}\n`);

    // TODO: Replace with actual agent invocation
    // This is a placeholder showing the expected integration point

    // Option 1: Invoke via GitHub Copilot Agent API (if available)
    // const result = await invokeCopilotAgent('self-healing-test', {
    //   test_title: testInfo.title,
    //   test_file: testInfo.file,
    //   initial_error: testInfo.error,
    //   attempt_number: attempt
    // });

    // Option 2: Invoke via custom agent endpoint
    // const result = await fetch('http://localhost:3000/heal-test', {
    //   method: 'POST',
    //   body: JSON.stringify(testInfo)
    // });

    // Option 3: Invoke via CLI (if agent is packaged as executable)
    // const result = execSync(`self-healing-agent heal --test="${testInfo.title}" --file="${testInfo.file}"`);

    // PLACEHOLDER: Simulate healing process
    console.log('⚠️  PLACEHOLDER: Agent invocation simulation');
    console.log('   In production, this would:');
    console.log('   1. Invoke the self-healing-test agent');
    console.log('   2. Agent reads test file and analyzes error');
    console.log('   3. Agent determines root cause (locator, timing, etc.)');
    console.log('   4. Agent applies appropriate fix');
    console.log('   5. Agent commits changes to healing branch');
    console.log('   6. Agent re-runs the test');
    console.log('   7. Agent returns healing result\n');

    // Simulate fix application
    const fixType = determineFixType(testInfo.errorType);
    console.log(`🔨 Applying fix type: ${fixType}`);

    // Simulate test re-run
    console.log(`🧪 Re-running test: ${testInfo.title}`);
    const testPassed = await rerunTest(testInfo);

    return {
        test_title: testInfo.title,
        test_file: testInfo.file,
        initial_error: testInfo.error,
        error_details: {
            error_type: testInfo.errorType,
            failed_locator: extractLocatorFromError(testInfo.error),
            root_cause: 'Simulated root cause analysis'
        },
        fix_summary: {
            attempt_count: attempt,
            fixes_applied: [
                {
                    attempt: attempt,
                    fix_type: fixType,
                    file_changed: testInfo.file,
                    change_description: `Simulated fix for ${fixType}`,
                    commit_sha: simulateCommit(testInfo.file, fixType),
                    branch: healingBranch,
                    result: testPassed ? 'PASS' : 'FAIL'
                }
            ],
            final_status: testPassed ? 'HEALED' : (attempt < maxRetries ? 'RETRY' : 'FAILED'),
            total_execution_time_seconds: Math.floor(Math.random() * 120) + 30
        },
        pipeline_impact: {
            pipeline_failed: false,
            test_rerun_count: attempt,
            original_pipeline_resumed: testPassed,
            deployment_blocked: !testPassed
        }
    };
}

// Determine fix type based on error
function determineFixType(errorType) {
    const fixTypes = {
        'TimeoutError': 'locator_update',
        'LocatorNotFound': 'locator_update',
        'ElementNotFound': 'locator_update',
        'AssertionError': 'assertion_update',
        'TypeError': 'data_structure_update',
        'NetworkError': 'retry_logic_added'
    };
    return fixTypes[errorType] || 'general_fix';
}

// Extract locator from error message
function extractLocatorFromError(error) {
    const locatorMatch = error.match(/selector ['"`]([^'"`]+)['"`]/);
    return locatorMatch ? locatorMatch[1] : 'unknown';
}

// Simulate git commit
function simulateCommit(file, fixType) {
    const commitMessage = `fix(test): auto-heal ${path.basename(file)} - ${fixType}`;
    console.log(`   📝 Commit: ${commitMessage}`);

    // In production, this would actually commit and return the SHA
    // execSync(`git add ${file}`);
    // execSync(`git commit -m "${commitMessage}"`);
    // const sha = execSync('git rev-parse HEAD').toString().trim();

    return Math.random().toString(36).substring(2, 9); // Simulated SHA
}

// Re-run a specific test
async function rerunTest(testInfo) {
    try {
        console.log(`   🧪 Running: npx playwright test "${testInfo.file}" --grep "${testInfo.title}"`);

        // In production, uncomment this:
        // execSync(
        //   `npx playwright test "${testInfo.file}" --grep "${testInfo.title}" --workers=1`,
        //   { stdio: 'inherit' }
        // );

        // Simulate: 70% success rate
        const passed = Math.random() > 0.3;
        console.log(passed ? '   ✅ Test PASSED' : '   ❌ Test FAILED');
        return passed;
    } catch (error) {
        console.log('   ❌ Test FAILED');
        return false;
    }
}

// Send notification
async function sendNotification(report) {
    const slackWebhook = process.env.SLACK_WEBHOOK_URL;
    const teamsWebhook = process.env.TEAMS_WEBHOOK_URL;

    if (!slackWebhook && !teamsWebhook) {
        console.log('\n⚠️  No webhook URLs configured, skipping notifications');
        return;
    }

    const summary = report.summary;
    const allHealed = summary.failed === 0;

    const slackPayload = {
        text: '🔧 Test Self-Healing Report',
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: allHealed ? '✅ All Tests Successfully Healed' : '⚠️ Some Tests Could Not Be Healed'
                }
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*Total Tests:*\n${summary.total_tests}`
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Healed:*\n${summary.healed}`
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Failed:*\n${summary.failed}`
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Status:*\n${allHealed ? '✅ SUCCESS' : '⚠️ PARTIAL'}`
                    }
                ]
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: '```' + JSON.stringify(report, null, 2) + '```'
                }
            }
        ]
    };

    if (slackWebhook) {
        console.log('\n📨 Sending Slack notification...');
        // In production: await fetch(slackWebhook, { method: 'POST', body: JSON.stringify(slackPayload) });
        console.log('✅ Slack notification sent (simulated)');
    }

    if (teamsWebhook) {
        console.log('\n📨 Sending Teams notification...');
        // In production: send Teams adaptive card
        console.log('✅ Teams notification sent (simulated)');
    }
}

// Main execution
async function main() {
    if (failedTests.length === 0) {
        console.log('✅ No failed tests to heal!');
        process.exit(0);
    }

    // Create healing branch
    createHealingBranch();

    const healingResults = [];

    // Heal each test
    for (const testInfo of failedTests) {
        let result = null;
        let attempt = 1;

        while (attempt <= maxRetries) {
            result = await healTest(testInfo, attempt);

            if (result.fix_summary.final_status === 'HEALED') {
                console.log(`✅ Test healed successfully after ${attempt} attempt(s)\n`);
                healingResults.push(result);
                break;
            } else if (attempt < maxRetries) {
                console.log(`⚠️  Attempt ${attempt} failed, retrying...\n`);
                attempt++;
            } else {
                console.log(`❌ Test could not be healed after ${maxRetries} attempts\n`);
                healingResults.push(result);
                break;
            }
        }
    }

    // Generate consolidated report
    const consolidatedReport = {
        final_status: healingResults.every(r => r.fix_summary.final_status === 'HEALED') ? 'HEALED' : 'FAILED',
        summary: {
            total_tests: failedTests.length,
            healed: healingResults.filter(r => r.fix_summary.final_status === 'HEALED').length,
            failed: healingResults.filter(r => r.fix_summary.final_status === 'FAILED').length
        },
        results: healingResults,
        healing_branch: healingBranch,
        timestamp: new Date().toISOString()
    };

    // Save report
    const reportPath = path.join(process.cwd(), 'healing-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(consolidatedReport, null, 2));
    console.log(`\n📄 Healing report saved to: ${reportPath}`);

    // Send notification
    await sendNotification(consolidatedReport);

    // Output for GitHub Actions
    console.log('\n📊 Final Summary:');
    console.log(`   Status: ${consolidatedReport.final_status}`);
    console.log(`   Total: ${consolidatedReport.summary.total_tests}`);
    console.log(`   Healed: ${consolidatedReport.summary.healed}`);
    console.log(`   Failed: ${consolidatedReport.summary.failed}`);

    // Output JSON for parsing
    console.log('\n' + JSON.stringify(consolidatedReport));

    // Exit with appropriate code
    process.exit(consolidatedReport.final_status === 'HEALED' ? 0 : 1);
}

main().catch(err => {
    console.error('\n❌ Fatal error in self-healing agent:', err);
    process.exit(1);
});

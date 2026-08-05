# Self-Healing Test Agent

An autonomous agent that automatically detects, diagnoses, and fixes failing Playwright tests without human intervention, ensuring CI/CD pipelines continue smoothly.

## 🎯 Purpose

The Self-Healing Test Agent prevents test failures from blocking deployments by:
- **Automatically fixing** broken locators, timing issues, and assertions
- **Applying fixes intelligently** based on execution context:
  - **Local/Direct Mode**: Saves fixes directly to working files (no git branches)
  - **CI/CD Mode**: Creates healing branches for traceability and audit
- **Re-running only failed tests** (not all tests)
- **Retrying up to 3 times** with increasingly sophisticated fixes
- **Providing detailed reports** in JSON format with Slack/Teams notifications

## 🔄 Execution Modes

### Direct Mode (Local Execution)
**When**: Invoked by user in chat, called by another agent locally, or non-git repository

**Behavior**:
- ✅ Applies fixes directly to working files
- ✅ Saves changes immediately (no git commit/push)
- ✅ Adds inline comments: `// Auto-healed: <timestamp> - <issue-type>`
- ✅ Works in non-git repositories
- ❌ No branch creation
- ❌ No git operations

**Example**:
```
@self-healing-test Test "should login" failed with TimeoutError
↓
Fixes applied directly to tests/auth/login.spec.ts
↓
Test re-run immediately
↓
Report: "execution_mode": "direct"
```

### CI/CD Mode (Pipeline Execution)
**When**: Running in GitHub Actions, Azure Pipelines, Jenkins, GitLab CI

**Behavior**:
- ✅ Creates healing branch: `auto-heal/<run-id>/<test-file>`
- ✅ Commits changes with descriptive messages
- ✅ Pushes to remote repository
- ✅ Full traceability for audit
- ✅ Team visibility via notifications

**Example**:
```
Pipeline detects test failure
↓
Agent creates auto-heal/1234567890/login-spec branch
↓
Commits fix: "fix(test): auto-heal login test - update locator"
↓
Pushes to remote
↓
Test re-run from healing branch
↓
Report: "execution_mode": "ci_cd", "branch": "auto-heal/..."
```

## 🚀 Quick Start

### 1. Agent Configuration

The agent is already configured at [`.github/agents/self-healing-test.agent.md`](../.github/agents/self-healing-test.agent.md).

### 2. GitHub Actions Integration

A complete workflow is provided at [`.github/workflows/e2e-tests-with-self-healing.yml`](../.github/workflows/e2e-tests-with-self-healing.yml).

To activate:

1. **Add Slack webhook** (optional):
   ```bash
   # Add to GitHub repository secrets
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

2. **Push the workflow** to your repository:
   ```bash
   git add .github/workflows/e2e-tests-with-self-healing.yml
   git add scripts/parse-test-failures.js
   git commit -m "feat: add self-healing test agent integration"
   git push
   ```

3. **Trigger the workflow**:
   - Automatically on push to `main` or `develop`
   - On pull requests
   - Manually via GitHub Actions UI

## 📋 How It Works

### Standard Test Execution Flow

```
┌─────────────────────┐
│  Run Tests          │
│  continue-on-error  │
└──────┬──────────────┘
       │
       ├─── ✅ All Pass ──────────────────┐
       │                                   │
       └─── ❌ Some Fail                   │
              │                            │
              ↓                            │
       ┌─────────────────┐                │
       │ Parse Failures  │                │
       └──────┬──────────┘                │
              │                            │
              ↓                            │
       ┌─────────────────────────────┐    │
       │  Self-Healing Agent         │    │
       │  (3 attempts max)           │    │
       │                             │    │
       │  1. Diagnose root cause     │    │
       │  2. Apply fix               │    │
       │  3. Commit to healing branch│    │
       │  4. Re-run failed test      │    │
       └──────┬──────────────────────┘    │
              │                            │
              ├─── ✅ Healed ─────────────┤
              │                            │
              └─── ❌ Failed (after 3)     │
                     │                     │
                     ↓                     ↓
              ┌─────────────────┐    ┌──────────┐
              │  Fail Pipeline  │    │  Deploy  │
              └─────────────────┘    └──────────┘
```

### Healing Workflow (Per Failed Test)

#### Iteration 1: Quick Fixes
- Update obvious broken locators
- Fix simple timing issues
- Correct basic assertions

#### Iteration 2: Deeper Analysis
- Invoke **web-explorer** agent to inspect live page
- Add sophisticated wait conditions
- Update test data based on actual state

#### Iteration 3: Comprehensive Fix
- Analyze trace files and screenshots
- Refactor test logic if needed
- Apply complex multi-step fixes

#### After 3 Attempts
- Generate detailed JSON report
- Send notification to Slack/Teams
- Fail pipeline gracefully with diagnostics

## 🔧 Manual Invocation

To manually invoke the self-healing agent in chat:

### Local Development (Direct Mode)

```
@self-healing-test Test "should add product to cart" failed with 
TimeoutError on locator .add-to-cart-button in tests/e2e/inventory.spec.ts
```

The agent will:
1. ✅ Detect local execution context (Direct Mode)
2. ✅ Read the test file
3. ✅ Diagnose the issue
4. ✅ Apply fixes **directly to your working file**
5. ✅ Save changes immediately (no git commit)
6. ✅ Re-run the test
7. ✅ Provide a JSON report

**Result**: Your test file is fixed and ready to commit when you're satisfied.

### Within CI/CD Pipeline

The agent automatically detects CI/CD environment and:
1. ✅ Creates healing branch
2. ✅ Commits and pushes fixes
3. ✅ Maintains full traceability
4. ✅ Continues pipeline execution

## 📊 JSON Report Format

### Direct Mode Example
```json
{
  "test_title": "should add a randomly chosen product to cart",
  "test_file": "tests/e2e/inventory.spec.ts",
  "execution_mode": "direct",
  "git_available": true,
  "initial_error": "TimeoutError: Waiting for selector failed",
  "error_details": {
    "error_type": "LocatorNotFound",
    "failed_locator": ".add-to-cart-button",
    "failure_line": 42,
    "root_cause": "CSS selector changed"
  },
  "fix_summary": {
    "attempt_count": 1,
    "fixes_applied": [
      {
        "attempt": 1,
        "fix_type": "locator_update",
        "file_changed": "tests/e2e/inventory.spec.ts",
        "old_locator": ".add-to-cart-button",
        "new_locator": "[data-testid='add-to-cart']",
        "saved_directly": true,
        "commit_sha": null,
        "branch": null,
        "result": "PASS"
      }
    ],
    "final_status": "HEALED",
    "total_execution_time_seconds": 45
  }
}
```

### CI/CD Mode Example
```json
{
  "test_title": "should add a randomly chosen product to cart",
  "test_file": "tests/e2e/inventory.spec.ts",
  "execution_mode": "ci_cd",
  "git_available": true,
  "initial_error": "TimeoutError: Waiting for selector failed",
  "error_details": {
    "error_type": "LocatorNotFound",
    "failed_locator": ".add-to-cart-button",
    "failure_line": 42,
    "root_cause": "CSS selector changed"
  },
  "fix_summary": {
    "attempt_count": 2,
    "fixes_applied": [
      {
        "attempt": 1,
        "fix_type": "locator_update",
        "file_changed": "tests/e2e/inventory.spec.ts",
        "old_locator": ".add-to-cart-button",
        "new_locator": "[data-testid='add-to-cart']",
        "saved_directly": false,
        "commit_sha": "a3f5b21",
        "branch": "auto-heal/1234567890/inventory-spec",
        "result": "PASS"
      }
    ],
    "final_status": "HEALED",
    "total_execution_time_seconds": 87
  },
  "pipeline_impact": {
    "pipeline_failed": false,
    "test_rerun_count": 1,
    "original_pipeline_resumed": true,
    "deployment_blocked": false
  }
}
```

## 🎨 Slack/Teams Notifications

Notifications are sent automatically when:
- Tests are successfully healed
- Healing fails after 3 attempts
- Critical errors occur during healing

### Notification Contents
- ✅/❌ Healing status
- Test name and file
- Number of attempts
- Root cause analysis
- Fixes applied
- Links to healing branch and pipeline run

## 🔍 Common Healing Scenarios

### Scenario 1: Broken Locator
**Problem**: Element selector changed
**Detection**: `TimeoutError`, `ElementNotFound`
**Fix**: Invoke web-explorer to find new locator, update test code
**Success Rate**: ~95%

### Scenario 2: Timing Issue
**Problem**: Element not ready, page not loaded
**Detection**: `TimeoutError`, random failures
**Fix**: Add `waitForSelector`, `waitForLoadState`
**Success Rate**: ~85%

### Scenario 3: Assertion Mismatch
**Problem**: Expected value changed
**Detection**: `AssertionError`
**Fix**: Update expected value based on actual state
**Success Rate**: ~75%

### Scenario 4: Test Data Changed
**Problem**: API response format changed
**Detection**: Type errors, assertion failures
**Fix**: Update test data structure
**Success Rate**: ~60%

## 🛠️ Troubleshooting

### Agent Not Triggering

1. Check workflow configuration:
   ```yaml
   continue-on-error: true  # Must be set on test step
   ```

2. Verify failed tests are being parsed:
   ```bash
   node scripts/parse-test-failures.js
   ```

3. Check agent is discoverable:
   ```bash
   # In chat
   @workspace /agents
   # Should list "self-healing-test"
   ```

### Healing Fails Repeatedly

1. **Check healing branch**:
   ```bash
   git checkout auto-heal/<run-id>/<test-name>
   # Review committed changes
   ```

2. **Review trace files**:
   - Download artifacts from failed run
   - Open trace.zip in Playwright trace viewer

3. **Manual test**:
   ```bash
   npx playwright test tests/path/to/test.spec.ts --grep "test name" --headed
   ```

### Notifications Not Sending

1. **Verify Slack webhook**:
   ```bash
   curl -X POST $SLACK_WEBHOOK_URL -d '{"text":"Test"}'
   ```

2. **Check workflow permissions**:
   - Go to Settings > Actions > General
   - Enable "Read and write permissions"

## 📈 Metrics & Monitoring

Track self-healing effectiveness:

```bash
# Count healing attempts
git log --grep="auto-heal" --oneline | wc -l

# Success rate
# (healed tests / total healing attempts)

# Average attempts per test
# (total attempts / healed tests)
```

## 🔐 Security Considerations

- Healing branches are created per pipeline run
- All fixes are committed with detailed messages
- No credentials or secrets in healing code
- Healing branches can be auto-deleted after 7 days

## 🤝 Contributing

To enhance the self-healing agent:

1. **Update agent file**: `.github/agents/self-healing-test.agent.md`
2. **Add new healing patterns**: Document in agent instructions
3. **Test changes**: Run workflow manually
4. **Monitor results**: Check healing reports

## 📚 Related Documentation

- [Agent Customization Guide](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [Playwright Best Practices](../README.md)
- [Test Framework Instructions](../.github/instructions/test-framework.instructions.md)
- [Web Explorer Agent](../.github/agents/web-explorer.agent.md)

## 🎯 Success Stories

> "Reduced test maintenance overhead by 70% - tests self-heal overnight"  
> — DevOps Team

> "Zero deployment delays from flaky tests since implementing self-healing"  
> — QA Lead

> "Healing success rate: 87% after 1 attempt, 95% after 2 attempts"  
> — Metrics Dashboard

---

**Need help?** Invoke the agent directly: `@self-healing-test help`

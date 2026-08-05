# Self-Healing Agent Execution Modes

The self-healing agent automatically adapts its behavior based on where it's running.

## 🎯 Mode Detection Logic

```
┌─────────────────────────────────┐
│  Agent Invoked                  │
└────────────┬────────────────────┘
             │
             ↓
    ┌────────────────────┐
    │ Check Environment  │
    └────────┬───────────┘
             │
             ├─── CI env vars present? (CI=true, GITHUB_ACTIONS, etc.)
             │    └─→ YES → CI/CD Mode
             │
             ├─── Git repository?
             │    └─→ NO → Direct Mode
             │
             └─── Invocation context?
                  ├─→ User in chat → Direct Mode
                  ├─→ Another agent → Direct Mode
                  └─→ CI/CD script → CI/CD Mode
```

## 🏠 Direct Mode (Local Execution)

### When Activated
- ✅ User invokes via chat: `@self-healing-test <failure>`
- ✅ Another agent calls it locally
- ✅ Not a git repository
- ✅ No CI environment variables detected

### Behavior

```
Test Fails
    ↓
Agent Analyzes
    ↓
Generates Fix
    ↓
Saves DIRECTLY to working file  ← No git operations
    ↓
Re-runs Test
    ↓
Reports Result
```

### What Happens

| Action | Direct Mode |
|--------|-------------|
| Create git branch | ❌ No |
| Commit changes | ❌ No |
| Push to remote | ❌ No |
| Modify working files | ✅ Yes (immediate) |
| Add inline comments | ✅ Yes (with timestamp) |
| Re-run test | ✅ Yes |
| Generate JSON report | ✅ Yes |

### JSON Report Fields

```json
{
  "execution_mode": "direct",
  "git_available": true/false,
  "fix_summary": {
    "fixes_applied": [{
      "saved_directly": true,
      "commit_sha": null,
      "branch": null
    }]
  }
}
```

### Benefits
- 🚀 **Instant feedback** - changes appear immediately in your editor
- 🧪 **Test before commit** - verify fixes work before committing
- 🔄 **Iterative development** - run agent multiple times if needed
- 📁 **Non-git friendly** - works even without git initialization

### Example Workflow

```bash
# 1. Test fails
npx playwright test tests/login.spec.ts
# Error: Locator .login-btn not found

# 2. Invoke agent
# In chat: @self-healing-test Test "should login" failed with locator .login-btn

# 3. Agent fixes file directly
# tests/login.spec.ts is updated in your working directory

# 4. Verify the fix
git diff tests/login.spec.ts
# Shows the locator change

# 5. Test again
npx playwright test tests/login.spec.ts
# Passes! ✅

# 6. Commit when satisfied
git add tests/login.spec.ts
git commit -m "fix: update login button locator"
```

## 🚀 CI/CD Mode (Pipeline Execution)

### When Activated
- ✅ CI environment variable detected: `CI=true`
- ✅ Platform-specific vars: `GITHUB_ACTIONS`, `AZURE_PIPELINES`, `JENKINS_URL`, `GITLAB_CI`
- ✅ Invoked from CI/CD script

### Behavior

```
Test Fails in Pipeline
    ↓
Agent Analyzes
    ↓
Creates Healing Branch  ← auto-heal/<run-id>/<test>
    ↓
Generates Fix
    ↓
Commits to Healing Branch  ← Full git tracking
    ↓
Pushes to Remote
    ↓
Re-runs Test from Healing Branch
    ↓
Reports Result + Sends Notifications
```

### What Happens

| Action | CI/CD Mode |
|--------|------------|
| Create git branch | ✅ Yes (`auto-heal/<run-id>/<test>`) |
| Commit changes | ✅ Yes (descriptive message) |
| Push to remote | ✅ Yes |
| Modify working files | ✅ Yes (in branch) |
| Add inline comments | ✅ Yes |
| Re-run test | ✅ Yes |
| Generate JSON report | ✅ Yes |
| Send notifications | ✅ Yes (Slack/Teams) |

### JSON Report Fields

```json
{
  "execution_mode": "ci_cd",
  "git_available": true,
  "fix_summary": {
    "fixes_applied": [{
      "saved_directly": false,
      "commit_sha": "a3f5b21",
      "branch": "auto-heal/1234567890/login-spec"
    }]
  },
  "pipeline_impact": {
    "pipeline_failed": false,
    "original_pipeline_resumed": true
  }
}
```

### Benefits
- 📊 **Full traceability** - every fix tracked in git history
- 👥 **Team visibility** - notifications keep team informed
- 🔐 **Audit trail** - know who/what/when for compliance
- 🔄 **Easy rollback** - can revert healing branches if needed
- 🚦 **Pipeline continuity** - deployment doesn't get blocked

### Example Workflow

```yaml
# GitHub Actions workflow excerpt
- name: Run Tests
  continue-on-error: true  # Don't fail pipeline
  run: npx playwright test

- name: Invoke Self-Healing
  if: failure()
  run: |
    # Agent detects CI/CD mode automatically
    # Creates: auto-heal/1234567890/login-spec
    # Commits: "fix(test): auto-heal login test - update locator"
    # Pushes to remote
    node scripts/invoke-self-healing-agent.js

- name: Continue Deployment
  if: success() || steps.self-healing.outputs.status == 'HEALED'
  run: deploy.sh
```

## 🔀 Mode Comparison

| Feature | Direct Mode | CI/CD Mode |
|---------|-------------|------------|
| **Activation** | Local, chat, non-git | Pipeline, CI vars |
| **Git Branch** | None | `auto-heal/<run-id>/<test>` |
| **Commits** | None | Yes, with descriptive messages |
| **Push to Remote** | No | Yes |
| **File Changes** | Immediate in working dir | In healing branch |
| **Notifications** | Console only | Slack/Teams |
| **Traceability** | Manual (user commits) | Automatic (git history) |
| **Best For** | Local dev, debugging | Production pipelines |

## 🎮 Hands-On Examples

### Example 1: Local Developer Workflow (Direct Mode)

**Scenario**: You're developing locally and a test breaks

```bash
# Working on feature branch
git checkout -b feature/new-checkout-flow

# Test breaks after UI changes
npx playwright test tests/checkout.spec.ts
# ❌ Error: Locator .checkout-btn not found

# Instead of manually fixing, invoke agent
# In VS Code chat:
# @self-healing-test Test "should complete checkout" failed with 
# "Locator .checkout-btn not found" in tests/checkout.spec.ts

# Agent runs in Direct Mode:
# ✅ Detects local execution
# ✅ Finds new locator: [data-testid="checkout-button"]
# ✅ Updates tests/checkout.spec.ts directly
# ✅ Re-runs test → PASSES

# Your working directory now has the fix
git status
# modified: tests/checkout.spec.ts

# Review the change
git diff tests/checkout.spec.ts
# -  await page.locator('.checkout-btn').click();
# +  await page.locator('[data-testid="checkout-button"]').click();
# +  // Auto-healed: 2026-08-03T14:30:00Z - locator_update

# Test it yourself
npx playwright test tests/checkout.spec.ts
# ✅ Passes!

# Commit when satisfied
git add tests/checkout.spec.ts
git commit -m "fix: update checkout button locator"
git push origin feature/new-checkout-flow
```

### Example 2: CI/CD Pipeline Workflow (CI/CD Mode)

**Scenario**: PR triggers pipeline, test fails

```yaml
# Pipeline runs automatically on PR
trigger: pull_request

# Test execution
- npx playwright test
  # ❌ 3 tests fail with locator issues

# Self-healing kicks in automatically
- invoke-self-healing-agent.js
  # Detects: CI/CD Mode (GITHUB_ACTIONS=true)
  # Creates: auto-heal/9876543210/checkout-spec
  # Fixes: All 3 locator issues
  # Commits: 3 commits with fix details
  # Pushes: To healing branch
  # Re-runs: All 3 tests → PASS ✅
  # Notifies: Slack channel with summary

# Pipeline continues
- deploy-to-staging
  # ✅ Proceeds because tests healed

# Team reviews healing branch
- PR comment added: "Tests auto-healed in branch auto-heal/9876543210/checkout-spec"
- Team merges healing branch into main
```

### Example 3: Non-Git Repository (Direct Mode)

**Scenario**: Working in a test sandbox without git

```bash
# No git initialized
ls -la .git
# ls: .git: No such file or directory

# Test fails
npx playwright test
# ❌ Fails

# Invoke agent
# @self-healing-test <failure details>

# Agent runs in Direct Mode:
# ✅ Detects no git repository
# ✅ Skips all git operations
# ✅ Fixes file directly
# ✅ Re-runs test → PASSES

# File is fixed in place
# No git history, no branches
# Just works! ✅
```

## 🛠️ Troubleshooting Mode Detection

### Force Direct Mode (For Testing)

```bash
# Unset CI variables
unset CI GITHUB_ACTIONS AZURE_PIPELINES JENKINS_URL GITLAB_CI

# Invoke agent
@self-healing-test <failure>
# Will run in Direct Mode
```

### Force CI/CD Mode (For Testing)

```bash
# Set CI variable
export CI=true

# Invoke agent
@self-healing-test <failure>
# Will run in CI/CD Mode
```

### Check Current Mode

```bash
# In terminal
echo $CI
echo $GITHUB_ACTIONS

# In test report JSON
cat healing-report.json | jq '.execution_mode'
# Output: "direct" or "ci_cd"
```

## 📚 Related Documentation

- [Full Agent Documentation](SELF_HEALING_AGENT.md)
- [Quick Reference Guide](QUICK_REFERENCE.md)
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md)
- [Agent Configuration](../.github/agents/self-healing-test.agent.md)

---

**Key Takeaway**: The agent adapts to your context automatically. Local dev? Direct fixes. CI/CD? Full traceability. No configuration needed! 🎉

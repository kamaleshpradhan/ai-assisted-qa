# Self-Healing Agent Update: Dual Execution Mode

## 📋 Update Summary

**Date**: 2026-08-03  
**Change**: Added context-aware dual execution mode system

## 🎯 What Changed

The self-healing agent now automatically adapts its behavior based on execution context:

### Before (Single Mode)
- ✅ Always created git branches
- ✅ Always committed changes
- ✅ Always pushed to remote
- ❌ Required git repository
- ❌ Not ideal for local development

### After (Dual Mode)
- ✅ **Direct Mode**: For local development and testing
  - Saves fixes directly to working files
  - No git branches or commits
  - Works in non-git repositories
  - Instant feedback
  
- ✅ **CI/CD Mode**: For pipeline execution
  - Creates healing branches
  - Commits and pushes fixes
  - Full traceability
  - Team notifications

## 🔧 Technical Changes

### 1. Agent Configuration Updates

**File**: `.github/agents/self-healing-test.agent.md`

**Added**:
- Phase 0: Execution Context Detection
- Dual-mode workflow documentation
- Environment variable detection logic
- Non-git repository handling
- Mode-specific constraints and behaviors

**Key Sections Modified**:
- Critical Principles → Added "Execution Context Awareness"
- Phase 2 → Split into CI/CD and Direct mode behaviors
- Constraints → Added mode-specific rules
- Example Invocation → Added mode-specific examples

### 2. Documentation Updates

**Files Modified**:
- `docs/SELF_HEALING_AGENT.md` - Added execution modes section
- `docs/QUICK_REFERENCE.md` - Updated with mode examples
- `docs/IMPLEMENTATION_SUMMARY.md` - Added dual-mode scenarios
- `README.md` - Updated feature description

**New File**:
- `docs/EXECUTION_MODES.md` - Comprehensive mode guide

### 3. JSON Report Schema

**Before**:
```json
{
  "fix_summary": {
    "fixes_applied": [{
      "commit_sha": "a3f5b21",
      "branch": "auto-heal/123/test"
    }]
  }
}
```

**After**:
```json
{
  "execution_mode": "direct",  // or "ci_cd"
  "git_available": true,       // or false
  "fix_summary": {
    "fixes_applied": [{
      "saved_directly": true,  // mode-specific
      "commit_sha": null,      // null in direct mode
      "branch": null          // null in direct mode
    }]
  }
}
```

## 🎬 Mode Detection Logic

```javascript
function detectExecutionMode() {
  // Check for CI/CD environment variables
  if (process.env.CI || 
      process.env.GITHUB_ACTIONS || 
      process.env.AZURE_PIPELINES ||
      process.env.JENKINS_URL ||
      process.env.GITLAB_CI) {
    return 'ci_cd';
  }
  
  // Check if git repository
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    // In git repo, but not CI = Direct Mode
    return 'direct';
  } catch {
    // Not in git repo = Direct Mode
    return 'direct';
  }
}
```

## 📊 Behavior Matrix

| Scenario | Mode | Git Branch | Commit | Push | File Edit |
|----------|------|------------|--------|------|-----------|
| User invokes in chat | Direct | ❌ | ❌ | ❌ | ✅ Working file |
| Agent called locally | Direct | ❌ | ❌ | ❌ | ✅ Working file |
| Non-git repository | Direct | ❌ | ❌ | ❌ | ✅ Working file |
| GitHub Actions | CI/CD | ✅ | ✅ | ✅ | ✅ In branch |
| Azure Pipelines | CI/CD | ✅ | ✅ | ✅ | ✅ In branch |
| Jenkins | CI/CD | ✅ | ✅ | ✅ | ✅ In branch |

## 🎓 Usage Examples

### Example 1: Local Developer

**Before** (would have failed or required git):
```bash
@self-healing-test Test failed with TimeoutError
# Error: Not in git repository
```

**After**:
```bash
@self-healing-test Test failed with TimeoutError
# ✅ Fixes file directly
# ✅ No git required
# ✅ Test again immediately
```

### Example 2: CI/CD Pipeline

**Before** (same behavior):
```yaml
- run: invoke-healing-agent
  # Creates branch, commits, pushes
```

**After** (same behavior, but with detection):
```yaml
- run: invoke-healing-agent
  # Detects CI/CD automatically
  # Creates branch, commits, pushes
  # No code changes needed
```

### Example 3: Non-Git Directory

**Before** (would have failed):
```bash
cd /tmp/test-sandbox
npx playwright test
# Test fails
@self-healing-test ...
# Error: Not a git repository
```

**After**:
```bash
cd /tmp/test-sandbox
npx playwright test
# Test fails
@self-healing-test ...
# ✅ Works! Fixes file directly
```

## ✅ Benefits of This Update

### For Developers
1. ✅ **Faster iteration**: Fix files directly without git overhead
2. ✅ **Test before commit**: Verify fixes work before committing
3. ✅ **Flexibility**: Works in any directory, git or not
4. ✅ **No workflow change**: Still commit manually when satisfied

### For CI/CD
1. ✅ **Same behavior**: No breaking changes to pipeline
2. ✅ **Full traceability**: Still creates branches and commits
3. ✅ **Audit trail**: Git history maintained
4. ✅ **Team visibility**: Notifications still work

### For Teams
1. ✅ **Backward compatible**: Existing workflows unchanged
2. ✅ **Flexible deployment**: Works in more environments
3. ✅ **Better DX**: Developers can iterate faster locally
4. ✅ **Compliance ready**: CI/CD maintains audit trail

## 🔄 Migration Guide

### For Existing Users

**Good News**: No migration needed!

- ✅ All existing CI/CD workflows continue working unchanged
- ✅ Agent auto-detects environment and adapts
- ✅ JSON report schema is backward compatible (new fields added)
- ✅ Slack/Teams notifications work the same

### Optional: Update Documentation

If you have custom documentation referencing the agent:

1. Update any hardcoded assumptions about git branches
2. Mention the dual-mode capability
3. Add examples for local usage

## 🧪 Testing the Update

### Test Direct Mode

```bash
# 1. In your local workspace
@self-healing-test Test "should login" failed with TimeoutError

# Expected:
# - File fixed directly
# - No git branch created
# - JSON report: "execution_mode": "direct"
```

### Test CI/CD Mode

```bash
# 1. Set CI variable
export CI=true

# 2. Invoke agent
@self-healing-test Test "should login" failed with TimeoutError

# Expected:
# - Git branch created
# - Changes committed
# - JSON report: "execution_mode": "ci_cd"
```

### Test Non-Git Repo

```bash
# 1. Create temp directory without git
mkdir /tmp/test-no-git
cd /tmp/test-no-git

# 2. Add a test file
# 3. Invoke agent

# Expected:
# - Works without errors
# - File fixed directly
# - JSON report: "git_available": false
```

## 📝 Files Changed

```
Modified:
  .github/agents/self-healing-test.agent.md  (major update)
  docs/SELF_HEALING_AGENT.md                  (added modes section)
  docs/QUICK_REFERENCE.md                     (updated examples)
  docs/IMPLEMENTATION_SUMMARY.md              (added dual-mode details)
  README.md                                   (updated description)

New:
  docs/EXECUTION_MODES.md                     (comprehensive mode guide)
  docs/UPDATE_DUAL_MODE.md                    (this file)
```

## 🎉 Summary

The self-healing agent is now **context-aware** and adapts to your workflow:

- 🏠 **Local dev**: Fast, direct fixes for immediate testing
- 🚀 **CI/CD**: Full traceability with branches and commits
- 📁 **Non-git**: Works anywhere, no git required

**Zero breaking changes. Maximum flexibility. Same great healing!** ✨

---

**Questions?** Check [docs/EXECUTION_MODES.md](EXECUTION_MODES.md) for detailed examples.

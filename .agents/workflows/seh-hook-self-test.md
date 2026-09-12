---
description: Validate Antigravity workspace hooks and their conservative Phase 0 safety decisions.
---
# SEH hook self-test

1. Run `node scripts/test-antigravity-hooks.mjs`.
2. Confirm PreInvocation injects the Phase 0 and pin reminder.
3. Confirm ordinary commands/files return `ask`, protected targets return `force_ask`, outside-workspace and destructive-root operations return `deny`.
4. Inspect `.agents/hooks.json` and scripts for credentials or absolute user paths.
5. Treat hooks as IDE guardrails only; they do not replace SEH runtime GCA, sandbox, egress, lease, or release enforcement.

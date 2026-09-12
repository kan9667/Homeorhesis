---
description: Verify an SEH change with focused behavior, authority, evidence, compatibility, and setup checks.
---
# Verify SEH

1. Identify changed surfaces, owning contracts, actors, protected targets, evidence domains, and phase gates.
2. Run `node scripts/check-seh-setup.mjs`, `node scripts/check-antigravity-limits.mjs`, and relevant hook/schema validators when customization files changed.
3. Run the narrowest behavior tests, negative authorization tests, replay/reconciliation tests, and invalid-state tests.
4. For DSH packages, run the relevant pinned repository checks; do not substitute `pnpm test` for a required coverage, snapshot, documentation, build, or hygiene gate.
5. Verify no disabled feature registered, no unreviewed DSH pin moved, no secret/value entered tracked files, and no active portfolio/release changed.
6. Report exact commands, exit codes, pass/fail, skipped checks, environment limits, pre-existing failures, and residual risk. Never claim checks not run.

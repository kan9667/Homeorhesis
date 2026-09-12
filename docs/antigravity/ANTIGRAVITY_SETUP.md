# Antigravity IDE setup for SEH v3.1

## 1. Open the correct root

Open the DSH fork repository root, not the overlay folder as a nested workspace. Confirm root `AGENTS.md`, `package.json`, and `architecture.md` are visible.

## 2. Verify the toolchain

The approved DSH baseline declares Node `^22.19.0 || >=24.0.0` and pnpm `11.7.0`. Run the bootstrap script; it validates but does not install.

## 3. Understand instruction loading

Antigravity global rules live in `~/.gemini/GEMINI.md`. Workspace rules live in `.agents/rules`. Root `GEMINI.md` in this project is intentionally imported by the always-on `00-seh-core` rule. Preserve DSH `AGENTS.md`; Antigravity project guidance does not replace repository-native instructions.

Rules and workflows are limited to 12,000 characters each. Skills live at `.agents/skills/<folder>/SKILL.md` with YAML frontmatter and a required description. Custom subagents live under `.agents/agents` and have explicit tools, model tier, and command policy.

## 4. Activate rules

Use `CUSTOMIZATION_ACTIVATION.md`. Keep the core authority/evidence rules always on and specialized research rules model-decided.

## 5. Configure safety posture

- Terminal Command Auto Execution: Request Review.
- Non-workspace file access: disabled.
- MCP config: empty until reviewed.
- Review every dependency installation, network download, Git mutation, runtime/model operation, training command, gate/release operation, and deployment.
- Do not rely on Windows terminal sandboxing; it is not currently available. Use Request Review, permissions, DSH/SEH authorization, WSL2/container/process isolation, and OS controls.

## 6. Enable hooks

The workspace hook file uses current events `PreInvocation` and `PreToolUse`. Hook commands receive camelCase JSON on stdin and return JSON on stdout. Run `node scripts/test-antigravity-hooks.mjs` before trusting the configuration.

Hooks are advisory defense-in-depth. A mutable workspace hook cannot protect secrets or release authority by itself; implement the same invariants in code, credentials, process boundaries, and tests.

## 7. Start with the correct workflow

Use `/seh-session-start`, then choose Phase 0, 0-M, 0-M/S, or 0-M/U. The first PR remains contracts-only. Read `FIRST_PR_PLAN.md`.

## 8. Validate

```text
node scripts/check-toolchain.mjs
node scripts/check-seh-setup.mjs
node scripts/check-antigravity-limits.mjs
node scripts/test-antigravity-hooks.mjs
node scripts/check-upstream-pin.mjs
node scripts/hash-architecture.mjs
node scripts/check-local-links.mjs
node scripts/validate-runtime-profile.mjs .seh/examples/runtime-profile.example.json
node scripts/validate-steering-profile.mjs .seh/examples/steering-profile.example.json
node scripts/validate-training-backend.mjs .seh/examples/training-backend.example.json
node scripts/validate-training-run-spec.mjs .seh/examples/training-run-spec.example.json
node scripts/check-overlay-integrity.mjs
```

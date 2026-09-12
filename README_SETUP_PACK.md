# SEH v3.1 Antigravity IDE setup pack

This is a repository overlay for implementing **Self-Evolving Harness Architecture v3.1** on a fork of `deepseek-ai/deepseek-harness`.

It does not install models, start training, enable remote providers, change the approved DSH pin, or create production authority. It establishes project instructions, Antigravity customizations, research-lane workflows, machine-readable policy defaults, ADR stubs, and validation scripts.

## Baseline

- Architecture date: 2026-08-29.
- Architecture SHA-256: `e1d48e75f5ba169f262b08071add8fd7ae757d8d14f5c66a11147c404510d04a`.
- Approved DSH pin: `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e` / `dsh@0.1.1-rc.2`.
- Observed DSH candidate: `cd5ef8148158c3a752a658978873241fdf8e2bbc` / `dsh@0.1.2-alpha.1`; unreviewed and not adopted.
- DSH toolchain at both observed commits: Node `^22.19.0 || >=24.0.0`, pnpm `11.7.0`.
- Active implementation phase: Phase 0.
- Parallel research: Phase 0-M, 0-M/S representation steering, and 0-M/U supervised-training backend qualification.

## What v3.1 adds

- Exact identity and qualification rules for representation steering of tool-call propensity.
- Tool-grant-before-steering ordering and neutral rollback.
- An implementation-neutral `TrainingBackend` authority boundary.
- An isolated Unsloth Core provider research lane with a standard PEFT comparison.
- Shared protected GPU scheduling across inference, qualification, steering work, and training.
- ADR-SEH-021 and ADR-SEH-022.
- Antigravity custom agents updated to the current YAML capability schema.
- Hook scripts aligned to current camelCase JSON stdin/stdout contracts and supported lifecycle events.
- Manual permission guidance that does not claim Windows terminal sandboxing is available.

## Copy into a DSH fork

1. Check out the approved DSH baseline or an explicitly reviewed branch based on it.
2. Copy this overlay into the repository root.
3. Do **not** overwrite DSH `AGENTS.md`, `CLAUDE.md`, manifests, lockfile, `.github`, or unrelated work.
4. Merge `SEH.gitignore.snippet` deliberately.
5. Optionally merge the scripts from `SEH.package-scripts.snippet.json`; never replace upstream `package.json`.
6. Open the repository root as the Antigravity workspace.
7. Apply the activation table in `docs/antigravity/CUSTOMIZATION_ACTIVATION.md`.
8. Set Terminal Command Auto Execution to **Request Review** and keep non-workspace file access disabled.
9. Keep `.agents/mcp_config.json` empty until every server and tool has an explicit review.
10. Run the validation commands below.

## Validate the overlay

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

On Windows PowerShell:

```text
pwsh -File scripts/bootstrap-seh.ps1
```

On POSIX shells or WSL2:

```text
bash scripts/bootstrap-seh.sh
```

The bootstrap scripts inspect and validate; they do not install dependencies or download models.

## Begin work

Run `/seh-session-start`, then select the correct lane:

- `/seh-phase-0` for contracts, authority, evidence, fake fixtures, and documentation.
- `/seh-phase-0m` for general local portfolio discovery.
- `/seh-phase-0m-steering` for representation-steering reproduction and qualification only.
- `/seh-phase-0m-unsloth` for isolated supervised-training backend feasibility only.

Read `docs/antigravity/FIRST_PR_PLAN.md` before coding. The first PR is contracts-only: no live steering, no Unsloth installation or run, no real model load, no remote call, and no model training.

## Important Antigravity behavior

- Workspace rules live under `.agents/rules`; this pack uses an always-on rule to import root `GEMINI.md`.
- Workflows are slash commands from `.agents/workflows`.
- Skills are progressively disclosed from `.agents/skills/<name>/SKILL.md`.
- Custom subagents are optional reviewers, not security principals.
- Hooks can request or force review, but enforcement must also exist in SEH/DSH code and policy.
- On Windows, current Antigravity terminal sandboxing is not yet available; use Request Review, explicit permissions, OS isolation, WSL2/container isolation where required, and project-level controls.

See `FILE_INDEX.md` and `PACK_MANIFEST.json` for the complete inventory and hashes.

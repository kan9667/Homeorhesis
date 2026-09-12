# CI and documentation integration

This document describes how the SEH Phase 0 contracts package integrates with the
DeepSeek Harness CI and documentation pipelines.

## Build and type gates

Run these commands in the repository root. All must exit 0 before merging.

```sh
# Compile only the SEH contracts host-face (fastest check)
pnpm run build:lib:host --filter @deepseek-ai/dsh-seh-contracts

# Full workspace typecheck (host + client faces)
pnpm run typecheck

# Verify package invariants: peerDependencies, exports, publint
pnpm run verify-package-invariants
```

## Unit tests

```sh
# Run only the SEH contracts test suites (fastest signal)
pnpm vitest run packages/seh/contracts/tests

# Full repo unit test suite (CI gate)
pnpm run test:coverage
```

The nine acceptance suites in `packages/seh/contracts/tests/` cover:

| Suite | What it proves |
|---|---|
| `authority-boundaries` | Authority actor roles and protected targets are data, not capability |
| `canonical-json` | Deterministic JSON serialization for content hashing |
| `disabled-composition` | Later-phase runtime features are structurally absent in Phase 0 |
| `episode-pinning` | Episodes are immutable; route changes require a new child episode |
| `evidence-reconciliation` | EvidenceRef links DSH and SEH planes without duplicating content |
| `gpu-lease` | Single-GPU exclusive-lease invariant; thrashing prevention |
| `route-qualification` | `supported != qualified`; non-qualified statuses fail closed |
| `secret-config-denial` | Plaintext credentials in route config, envelopes, or manifests are rejected |
| `steering-grant-invariant` | Steering vectors cannot add, rename, or widen tool grants |

## Lint and formatting

```sh
pnpm run lint
git diff --cached --check   # trailing whitespace and missing final newline
```

## Documentation gates

```sh
# Sync bilingual doc projection (runs after any docs/ edit)
pnpm run doc-sync

# VitePress build (also validates all internal links)
pnpm run website:build
```

The `docs/seh/` documents added in Phase 0 are English-only. Bilingual projection is a
Phase 1 task tracked in ADR-SEH-011. The `doc-sync` gate will surface any dead links
introduced in the VitePress source map (`website/docs.ts`).

## When to run which gate

| Change type | Minimum gates |
|---|---|
| Contracts source only (`src/`) | `build:lib:host`, `typecheck`, `vitest run packages/seh/contracts/tests` |
| Test suites only (`tests/`) | `vitest run packages/seh/contracts/tests` |
| Documentation only (`docs/seh/`) | `doc-sync`, `website:build` |
| Package metadata (`package.json`, `tsconfig.json`) | `verify-package-invariants`, `typecheck` |
| Any of the above combined | All of the above |

The full suite (`test:coverage`) and hygiene checks (`pnpm run hygiene`) are CI-owned;
run them locally only when diagnosing a CI failure or making a repository-wide change.

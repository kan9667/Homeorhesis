---
description: Establish SEH architecture, phase, upstream, authority, and evidence context before work.
---
# SEH session start

1. Read `GEMINI.md`, root and nearest `AGENTS.md`, `architecture.md`, `.agents/SEH_ANTIGRAVITY.md`, `.seh/phase-state.json`, `.seh/upstream-pin.json`, and relevant ADRs.
2. Run `node scripts/hash-architecture.mjs` and `node scripts/check-upstream-pin.mjs`; report mismatches without silently fixing them.
3. Inspect the working tree and preserve unrelated work. Do not reset, clean, checkout over, or amend user changes.
4. Classify the request as Phase 0, 0-M, 0-M/S, 0-M/U, later-phase planning, or out of scope.
5. State task family, deterministic option, actors, protected targets, canonical evidence owners, network/dependency/model/training implications, checks, and rollback.
6. Select the most specific skill and optional reviewer subagent. Custom subagent output is advisory.
7. Refuse incidental DSH pin movement, live feature activation, provider/model download, dependency installation, or external mutation without explicit authorization.

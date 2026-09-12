---
description: Evaluate a newer DeepSeek Harness revision without silently moving the approved SEH pin.
---
# SEH upstream sync

1. Create/use an isolated `upstream-sync/YYYY-MM-DD` branch; preserve feature work.
2. Record old pin, candidate commit/version, dependency lock, Node/pnpm, and generated catalog digests.
3. Read candidate `AGENTS.md`, architecture, development/testing docs, and relevant Agent Notes.
4. Diff high-risk seams: LLM/waterfalls, provider config, sessions/persistence, tool/approval order, sandbox, credentials/settings, profiles/bundles, UI, catalogs, runtime closure.
5. Run SEH contract/authority/replay/guard/lease tests and upstream-required gates.
6. Produce accept/defer report with migration, model-visible changes, risks, and rollback.
7. Move `.seh/upstream-pin.json` only after explicit approval; never as an incidental feature edit.

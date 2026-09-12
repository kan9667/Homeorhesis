# Web2/VAMS inspiration boundary

SEH runs entirely within conventional Web2 infrastructure. No blockchain, no decentralized
validators, no smart contracts, no tokenized incentives, and no VAMS Service Block runtime
dependency exist in any phase of the roadmap.

VAMS cognitive architecture concepts appear in the SEH design vocabulary as analogical
inspiration only. Every concept maps to a concrete, local Web2 implementation.

## Concept mapping

| VAMS concept | SEH local equivalent |
|---|---|
| SIRA retrieval | SQLite full-text search over the SEH Control Ledger |
| HORMA hierarchy | Tiered task-family taxonomy in `@deepseek-ai/dsh-seh-contracts` |
| HIPIF folding | JSON merge and LZ compression of session summaries in the DSH session store |
| EvoMem reflection | Human-reviewed, content-addressed memory artifact under policy review |
| V(m) utility scoring | Deterministic metric tables in ModelQualification and TaskFamilyQualification |
| ProPlay exploration | Task decomposition policy with backtracking, implemented as pure TypeScript |

No VAMS SDK, VAMS Service Block, or VAMS runtime component is imported, vendored, or
depended upon. References to VAMS concepts in architecture documents and ADRs are
definitional, not dependency-forming.

## What Phase 0 does not activate

Phase 0 adds contracts and schemas only. Cognitive memory, utility scoring, and exploration
policies are Phase 2 and later items. No persistence layer for SEH cognitive memory exists
yet beyond the DSH session log and the SEH Control Ledger schema (contracts only).

## Authority

ADR-SEH-002 (accepted) records this boundary decision. The architecture (§2.2, §13, §35.9)
is the source of truth for the boundary definition.

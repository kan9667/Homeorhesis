# Evidence ownership

Two canonical evidence planes exist. Each owns distinct facts. Neither duplicates the other.

## DSH SQLite Session Log

**Owner**: `@deepseek-ai/dsh-session`
**Authority for**: all runtime reality — model turns, prompt assembly, tool call invocations,
streaming output, approval decisions, and timing.

The DSH session log is the source of truth for what the model saw, what tools were called,
and what output was produced. SEH must not mirror the raw model-visible text stream. Any
SEH component that needs to reference a model turn links to its DSH session event ID and
content digest; it does not copy the text.

## SEH Control Ledger

**Owner**: SEH (Phase 1+, schema defined in `@deepseek-ai/dsh-seh-contracts`)
**Authority for**: governance decisions — task classification, capability derivation, routing
decisions, GPU residency leases, steering profile selection, training run specs, evaluation
outcomes, gate verdicts, and release manifests.

The SEH Control Ledger records decisions, not observations. An entry in the ledger always
cites the DSH session event that triggered the decision (via `EvidenceRef`), but it does not
reproduce the session event content.

## Projections

Dashboards, search indexes, memory summaries, cognitive memory entries, and quality
scores are disposable projections of the two canonical planes. A projection may be
regenerated from the canonical planes at any time. A projection is never the source of
truth for a gate or release decision.

## Phase 0 scope

Phase 0 defines the evidence contract types only (`EvidenceRef`, `ArtifactRef`,
`ControlEvent`). No persistence for the SEH Control Ledger is implemented in Phase 0;
ledger writes begin in Phase 1 when the routing and residency services are activated.

## Authority

Architecture §4.2, §4.3, §12.1, §12.2 define these boundaries. This document expands §32.2
line 5426 in the first-PR plan.

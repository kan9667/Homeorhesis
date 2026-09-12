# Migration from SEH v3.0 setup to v3.1

## Preserve

Task-first classification, deterministic lane, provider-neutral DSH integration, exact runtime qualification, one-GPU scheduling, specialist handoffs, evidence split, remote final guard, independent gate, and atomic release remain unchanged.

## Add

- representation-steering contracts, policy, qualification, protected artifacts, metrics, workflow, skill, reviewer, and Phase 0-M/S checklist;
- implementation-neutral training backend contracts, policy, registry, isolation guidance, Unsloth workflow/skill/reviewer, and Phase 0-M/U checklist;
- shared GPU lease coverage for training and steering work;
- ADR-SEH-021 and ADR-SEH-022;
- new disabled feature flags and negative authority tests;
- current Antigravity custom-agent and hook schema details.

## Do not carry forward

- any assumption that a control vector can be changed safely per request;
- any treatment of tool-call rate as tool competence;
- any Unsloth/Studio UI as canonical control or evidence;
- any backend-owned scheduler, curation, qualification, gate, or release state;
- any claim that Windows Antigravity terminal commands are sandboxed.

## Activation state

All new runtime capabilities remain disabled. Migration of setup files does not authorize vector extraction, non-neutral alpha, package installation, model download, or training.

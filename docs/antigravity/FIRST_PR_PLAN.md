# First implementation PR plan

## Objective

Establish contracts, ownership, authority, and tests. Do not activate models, routing, remote calls, steering, self-evolution, or training.

## Include

- architecture v3.1 and ADR stubs 001-011 plus 021-022 at minimum;
- approved DSH baseline and ownership map;
- branded IDs and schemas for task/capability, route/runtime, qualification/steering qualification, `ToolUseSteeringProfile`, `LocalExecutionProfileRef`, `TrainingBackendRef`, `TrainingRunSpec`, tool grants, episodes/handoffs, portfolio/residency, remote export/budgets, evidence, candidates/evaluation/gate/release;
- actor roles and protected targets as data;
- empty service interfaces for policy, taxonomy, qualification, steering, routing, portfolio, residency/runtime, evidence, dataset curation, training coordination/backends, evaluation, gate, and release;
- final remote guard contract with no traffic;
- negative authority, provider-neutral, secret, evidence ownership, disabled registration, fake lease, steering grant/alpha, and backend protected-state tests.

## Exclude

No automatic routing, real model load/unload, vector extraction/load, non-neutral alpha, Unsloth installation/run, real remote call, provider-specific plugin, production portfolio, model training, Agent Lightning runtime, candidate execution, autonomous memory mutation, auto-promotion, VAMS runtime, agent-loop change, or dashboard rewrite.

## Acceptance

Pinned checks pass; schemas reject invalid authority/route/lease/steering/backend states; one fake exclusive lease is proven; provider/model identifiers remain open data; canonical facts have one owner; no disabled feature is registered.

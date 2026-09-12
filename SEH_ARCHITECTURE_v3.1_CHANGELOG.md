# SEH Architecture v3.1 Changelog

**Previous source:** SEH Architecture v3.0  
**New source:** SEH Architecture v3.1  
**Date:** 2026-08-29  
**Scope:** Tool-call propensity calibration and pluggable supervised-training backends

## Decision summary

Architecture v3.1 preserves the v3.0 task-first, provider-neutral, evidence-governed, one-GPU specialist-portfolio design. It adds two bounded capabilities:

1. **Representation steering for local tool-call propensity.** A qualified local execution profile may combine a neutral runtime profile with an immutable steering vector, layer range, steering qualification, and bounded alpha. Steering is selected only after the `ToolGrantManifest` is frozen and can never grant, rename, broaden, approve, or execute a tool.
2. **Pluggable supervised training with Unsloth Core as the initial preferred provider.** Training is exposed through an implementation-neutral `TrainingBackend` service. Unsloth runs as an isolated, scheduler-controlled worker with sealed datasets, read-only base artifacts, bounded resources, and quarantined outputs. It has no dataset-selection, qualification, gate, portfolio-activation, or release authority.

## Major additions

- Behavioral intervention ladder: deterministic implementation -> prompt/configuration -> representation steering -> supervised LoRA/QLoRA -> preference optimization -> Agent Lightning harnessed RL.
- `ToolUseSteeringProfile`, `SteeringQualification`, and `LocalExecutionProfileRef` contracts.
- Exact steering identity in routing, residency decisions, leases, health checks, episodes, evidence, evaluation, and releases.
- Steering qualification metrics for required-tool recall, unnecessary calls, malformed calls, unknown tool names, cost/latency, non-tool regressions, and cross-tool/task externalities.
- `TrainingBackendRef`, `TrainingRunSpec`, `TrainingBackend`, `UnslothTrainingEnvironment`, and `AdapterTrainingSpec` contracts.
- Isolated training-worker topology and exclusive GPU-lease integration.
- Mandatory export/conversion/reload/requalification through the actual SEH inference runtime.
- Explicit separation between Unsloth supervised optimization and Agent Lightning real-harness RL.
- Phase `0-M/S` for representation-steering feasibility and Phase `0-M/U` for Unsloth feasibility.
- ADR-SEH-021 and ADR-SEH-022.
- Worked end-to-end steering and Unsloth QLoRA traces.
- Expanded operator, security, observability, verification, release, and compatibility requirements.

## Contract corrections made during review

- Tool grants no longer contain steering fields; the grant is frozen before steering selection.
- Routing selects a composed `LocalExecutionProfileRef` instead of loose runtime/vector/alpha fields.
- Residency decisions and leases pin the same exact execution profile.
- `LocalRuntimeManager` loads, configures, health-checks, drains, and unloads the composed execution profile.
- Neutral and steered configurations sharing the same weights remain distinct evidence subjects.
- Steering qualification is separate from vector extraction metadata, avoiding circular artifact/profile hashes.
- A completed Unsloth run is explicitly not a qualified or releasable model.

## Unchanged invariants

- DeepSeek Harness/Cordis remains the execution substrate.
- The optimizer proposes; the independent gate decides.
- The reference GPU permits one resident generative model at a time.
- Model/provider changes create evidence-linked child episodes.
- DSH runtime evidence and SEH control evidence remain separate canonical domains.
- Remote execution remains sanitized, pinned, budgeted, and protected by a deny-only final guard.
- Remote-provider outputs remain training-ineligible by default.
- Active base weights are immutable; training produces new candidate artifacts.
- VAMS remains cognitive-layer inspiration only; no Web3 runtime dependency is introduced.

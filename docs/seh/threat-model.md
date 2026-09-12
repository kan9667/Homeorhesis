# SEH Phase 0 threat model

This document covers the six threat vectors identified in the SEH architecture (§5, §29.1
line 5022) and the mitigations that the Phase 0 contracts and later runtime phases provide.
Phase 0 mitigations are contract-level only; runtime enforcement is a Phase 1+ obligation.

## T1: Tool privilege escalation

**Threat**: A model or tool result causes the agent to invoke a tool it was not authorized
to use in the current episode.

**Mitigation**:

- `ToolGrantManifest` is computed before inference begins. The manifest is immutable for
  the duration of the episode.
- A representation steering vector cannot add, rename, widen, or reveal tools.
- Unknown tool names and malformed calls are routed through the DSH tool pipeline, not
  bypassed.
- Landlock sandboxing (via `@deepseek-ai/node-addon-landlock-run`) enforces filesystem
  and network access at the OS level independent of tool grants.

## T2: Prompt injection and adversarial tool calls

**Threat**: User-supplied content or a remote response injects instructions that cause the
model to take unauthorized actions.

**Mitigation**:

- DSH approval gates block tool invocations that exceed declared permission levels.
- SEH deterministic verifiers run after tool output is received; a failed verifier prevents
  the episode from advancing.
- The final remote guard (§10.4) is deny-only: it may authorize or reject, never silently
  rewrite a logged request.

## T3: Malicious candidate self-promotion

**Threat**: A candidate model or adapter manipulates its own evaluation to achieve
promotion to production.

**Mitigation**:

- Optimizer, trainer, evaluator, gate, and release manager have distinct logical identities
  with bounded authority. None may hold another's credentials.
- The evaluator cannot modify its subject. The gate cannot author candidates. The release
  cannot manufacture acceptance evidence.
- Hard-veto codes (safety, correctness, malformed-call-rate) cannot be offset by aggregate
  score.
- Training success is not qualification; export and reload through the actual SEH inference
  runtime is required before evaluation.

## T4: GPU residency denial of service and thrashing

**Threat**: Rapid or uncontrolled model switching causes GPU memory fragmentation,
VRAM exhaustion, or inference unavailability.

**Mitigation**:

- At most one generative model holds the reference GPU lease at any time.
- A model/runtime change requires drain, unload, process and VRAM-release proof, load,
  health check, and a new lease before the next episode may begin.
- Anti-thrashing: a switch budget limits transitions per rolling window; excess requests
  queue or fail with a `GPU_LEASE_UNAVAILABLE` error.
- The GPU scheduler is shared between training and inference; training cannot preempt an
  active inference lease.

## T5: Unauthorized remote export and secret exfiltration

**Threat**: Model output, tool results, or session content is exfiltrated to an external
endpoint without authorization, or API credentials are transmitted in plaintext.

**Mitigation**:

- Export preparation and sanitization happen before the child session is created.
- The final remote guard is deny-only; it reviews the sanitized export envelope and
  dispatches authorization before network I/O.
- No implicit provider fallback: a provider or model change is a new route decision.
- Secret-aware references (`env:VAR_NAME`) are the only accepted credential form;
  plaintext credentials in `providerConfigDigest`, `ExportEnvelope`, or `ReleaseManifest`
  are rejected by the `secret-config-denial` acceptance test.
- Remote outputs are training-ineligible by default.

## T6: Contaminated training data and model poisoning

**Threat**: Adversarial or low-quality data enters the training pipeline and degrades model
behavior, or a compromised adapter is promoted to production.

**Mitigation**:

- Dataset manifests carry content hashes; any mutation of the dataset after manifest
  creation causes the training run to fail.
- Candidate artifacts enter quarantine with new immutable identities; base weights are
  read-only.
- The training backend receives only an approved `TrainingRunSpec`, sealed dataset,
  immutable base reference, and bounded resource grant. It cannot query arbitrary sessions,
  change eligibility, or invoke the gate.
- Remote outputs (inference from an external provider) are training-ineligible by default
  and require explicit policy authorization before inclusion in a training dataset.

## Phase 0 posture

Phase 0 establishes the contract types that enforce the above boundaries. No live training,
real remote calls, or production model switching occurs in Phase 0. The contract-level
acceptance tests (`secret-config-denial`, `authority-boundaries`, `disabled-composition`,
`steering-grant-invariant`) verify that the structural preconditions for each mitigation are
present before Phase 1 activates the runtime.

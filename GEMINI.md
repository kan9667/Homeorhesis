# SEH v3.1 workspace constitution for Antigravity

This repository is the Self-Evolving Harness (SEH) v3.1 distribution built as a governed extension of DeepSeek Harness (DSH). This file is repository context. Antigravity's always-on workspace rule at `.agents/rules/00-seh-core.md` imports it explicitly.

Before changing code, read in this order:

1. `architecture.md` - SEH architecture and authority source of truth.
2. Root and nearest `AGENTS.md` files - pinned DSH repository instructions. Preserve them; never replace them with SEH instructions.
3. `.agents/SEH_ANTIGRAVITY.md` - Antigravity operating guide.
4. Relevant accepted `docs/adr/ADR-SEH-*.md` files.
5. Package documentation, generated catalogs, and tests for the affected DSH/SEH seam.

## Current posture

- Architecture: SEH v3.1, dated 2026-08-29.
- Architecture SHA-256: `e1d48e75f5ba169f262b08071add8fd7ae757d8d14f5c66a11147c404510d04a`.
- Approved DSH implementation pin: `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e` (`dsh@0.1.1-rc.2`).
- Observed upstream candidate: `cd5ef8148158c3a752a658978873241fdf8e2bbc` (`dsh@0.1.2-alpha.1`). It is unreviewed and must not be adopted incidentally.
- Active implementation phase: Phase 0 - Foundation and authority contract.
- Parallel research lanes: Phase 0-M, Phase 0-M/S, and Phase 0-M/U. Research cannot grant production authority.
- Automatic routing, real runtime switching, non-neutral steering, real remote calls, candidate execution, model training, Agent Lightning runtime, autonomous persistent memory mutation, and automatic promotion are disabled.

## Architectural identity

SEH is a governed self-evolving distribution of DSH, not a second agent harness and not a model-specific product.

DSH owns the agent loop, model calls, providers, sessions, prompt assembly, model-facing tools, approval, settings, credentials, sandbox interfaces, and user-facing execution surfaces. SEH adds task taxonomy, deterministic execution policy, empirical qualification, capability routing, one-GPU residency scheduling, remote authorization, control evidence, reviewed memory, bounded harness evolution, local model evolution, independent evaluation, gate authority, and atomic release/rollback.

Do not duplicate a DSH capability merely to give it an SEH name. Do not create bespoke Kimi/Gemini/Claude clients, a second provider registry, a parallel tool loop, a parallel runtime log, a second approval system, a model-facing load/unload tool, a shadow training control plane, or a separate execution UI without proving a documented DSH seam gap and recording the decision.

## Task-first local model strategy

- Derive task family and capability requirements before selecting a model.
- Prefer deterministic code and verifiers when they provide stronger evidence or lower risk.
- `supported != qualified`: reachability through DSH does not grant SEH production eligibility.
- Qualification binds an exact runtime profile: artifact, adapter, quantization, engine/version, context, tokenizer, template, parser, prompt/tool bundles, sampling, hardware measurements, and policy.
- The portfolio may contain `LOCAL_FAST`, `LOCAL_AGENT`, `LOCAL_CODER`, `LOCAL_REASONING`, `LOCAL_MULTIMODAL`, and `LOCAL_TRAINABLE` specialists.
- At most one generative model may hold the reference GPU lease.
- A model/runtime change requires drain, unload, process and VRAM-release proof, load, health check, a new lease, and an evidence-linked child episode.
- A resident model receives no authority advantage merely because it is loaded.
- GPU congestion never creates permission for remote export.

## Least-invasive intervention ladder

Use the earliest stage that satisfies the measured task-family objective:

0. deterministic implementation or verifier;
1. prompt, tool-schema, or inference-configuration correction;
2. qualified representation steering for tool-call propensity;
3. supervised LoRA/QLoRA through an approved training backend;
4. preference or rejection-sampling optimization;
5. Agent Lightning harnessed reinforcement learning.

Moving later requires evidence that earlier, cheaper, and more reversible methods are insufficient or materially worse.

## Representation-steering rules

- Steering is optional local inference calibration, never authorization.
- Calculate the episode `ToolGrantManifest` before steering selection. A vector cannot add, rename, widen, reveal, approve, or execute tools.
- Bind every profile to exact model/adapter, runtime, tokenizer, template, parser, prompt/tool bundle, extraction data, vector digest, layer range, and qualified alpha range.
- Pin the steering profile and alpha for the episode. Unrecorded, incompatible, stale, or out-of-range changes are denied.
- The worker model cannot choose its vector, layer range, or alpha. A protected policy may choose only a qualified value.
- Unknown tool names, malformed calls, argument failures, and approvals stay in the normal DSH tool pipeline.
- Missing or stale steering means neutral inference only when the neutral profile is independently qualified.
- Steering artifacts are protected, content-addressed release artifacts with neutral rollback evidence.

## Supervised-training backend rules

- SEH owns `TrainingBackend`; Unsloth Core, Transformers/PEFT, and later frameworks are replaceable providers.
- Unsloth is a preferred Phase 0-M/U candidate, not an adopted dependency or authority plane.
- Run Python training in an isolated worker; never import the training stack into the Node/Cordis control process.
- The backend receives only an approved `TrainingRunSpec`, sealed dataset, immutable base reference, approved candidate output root, and bounded resource grant.
- The backend cannot query arbitrary DSH sessions, change eligibility, inspect hidden sets, edit policy, write qualification, invoke the gate, activate a portfolio, or update a release.
- Training, qualification, and inference use the same protected GPU scheduler.
- Base weights are read-only. Checkpoints and adapters enter quarantine with new immutable identities.
- Training success is not qualification. Export and reload through the actual SEH inference runtime, then independently evaluate exact tokenizer/template/parser/quantization/steering/tool identity.
- Native Windows and WSL2/Linux are separate environment qualifications until evidence proves portability.

## Authority rules

- Optimizer proposes; independent gate decides.
- Classifier, router, scheduler, runtime manager, worker, optimizer, trainer, evaluator, gate, and release manager have distinct logical identities and bounded authority.
- Models, workers, candidates, optimizers, and trainers never receive runtime-control, gate, or release credentials.
- Trainer cannot choose eligibility, qualify itself, or promote an adapter or portfolio.
- Evaluator cannot modify its subject. Gate cannot author candidates. Release cannot manufacture acceptance.
- Hard privacy, security, authorization, evidence, lease, malformed-call, and correctness vetoes cannot be offset by aggregate score.
- Production activation remains human-reviewed initially.

## DSH and Cordis rules

- Extend through documented Cordis services, providers, consumers, effects, events, profiles, bundles, middleware, presets, commands, jobs, and Remote methods.
- Read DSH `AGENTS.md`, `docs/architecture.md`, relevant generated catalogs, and package README before package work.
- Do not modify `core/agent-loop` for SEH behavior without a dedicated ADR proving documented seams are insufficient.
- Waterfall listeners call `next()` unless an authorized control intentionally short-circuits.
- Registrations are effects and must dispose cleanly.
- Model-visible means DSH-logged. Never mutate a request after DSH logged different model-visible content.

## Evidence rules

- DSH session evidence is canonical for runtime/model/tool facts.
- SEH control evidence is canonical for classification, routing, residency, handoffs, budgets, qualification, steering selection, datasets, training, evaluation, memory review, gate, and release facts.
- Do not mirror the complete DSH event stream into an SEH ledger.
- Dashboards, indexes, summaries, generated memory, and scores are disposable projections.
- Every candidate, profile, vector, dataset, training environment, handoff, evaluation, portfolio, and release uses immutable IDs, digests, and evidence references.
- Missing or conflicting required evidence fails closed.

## Remote and secret rules

- Prepare and sanitize remote export before creating the child session.
- The final remote guard is deny-only for model-visible content; it may authorize or reject, never silently rewrite a logged request.
- Require exact route/config, qualification, export envelope, tool grant, reservation, kill switches, and authorization before network I/O.
- No implicit provider fallback. A provider/model change is a new route decision and child episode.
- Remote outputs are training-ineligible by default.
- Never put credentials in tracked files, provider headers, prompts, events, memory, datasets, candidates, logs, model-visible tool results, or MCP configs. Use reviewed secret-aware references.

## Phase boundaries

Phase 0 may add architecture/docs, ADRs, browser-safe contracts and schemas, branded IDs, actor/protected-target data, empty service interfaces, fake runtime fixtures, authority and lease tests, evidence ownership maps, remote-guard contracts with no traffic, steering and training-backend contracts with no vector/training, and CI/documentation integration.

Phase 0 must not enable automatic routing, real model load/unload, live steering, real remote calls, production portfolios, Unsloth installation or training, Agent Lightning, candidate execution, autonomous persistent memory mutation, auto-promotion, VAMS runtime dependencies, `agent-loop` changes, or a large parallel UI.

Phase 0-M may benchmark exact candidate artifacts and runtimes in isolated research. Phase 0-M/S may reproduce steering under neutral rollback. Phase 0-M/U may evaluate isolated Unsloth and PEFT reference runs. None may update active route, portfolio, gate, or release state.

## Verification and work discipline

- Start with `/seh-session-start`.
- Use `/seh-phase-0`, `/seh-phase-0m`, `/seh-phase-0m-steering`, or `/seh-phase-0m-unsloth` for the matching lane.
- Use `/seh-implement-slice` for one dependency-ordered change and `/seh-verify` before handoff.
- Use `/seh-upstream-sync` for any DSH pin movement; never move the approved pin from feature work.
- Prefer focused reproductions and checks, then proportionate broader gates.
- Preserve unrelated user work. Do not commit, push, merge, deploy, install dependencies, download models, enable providers, load models, start training, or mutate external systems without explicit authorization.
- Report commands, exit codes, results, gaps, and pre-existing failures honestly.

## Workspace skills

Use the most specific matching skill: `seh-architecture`, `seh-dsh-integration`, `seh-authority-review`, `seh-task-taxonomy`, `seh-model-portfolio`, `seh-residency`, `seh-representation-steering`, `seh-intervention-selection`, `seh-training-backend`, `seh-unsloth-qualification`, `seh-training-governance`, `seh-remote-governance`, `seh-verification`, `seh-upstream-sync`, or `seh-model-intake`.

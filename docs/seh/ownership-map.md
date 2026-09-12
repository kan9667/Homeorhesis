# SEH vs. DeepSeek Harness (DSH) Ownership Map

This document defines the strict ownership boundary between DeepSeek Harness (DSH) and the Self-Evolving Harness (SEH) v3.1 extension, complying with **SEH Architecture §2, §5, §11, and §32.2**.

---

## 1. Core Principle

**DeepSeek Harness owns runtime execution; SEH owns governed evolution and policy.**
SEH is a governed extension of DSH built on vendored Cordis plugins—not a second agent harness, not a parallel model loop, and not a standalone product.

```text
+-----------------------------------------------------------------------------+
|                                SEH Layer                                    |
| Task Taxonomy | Router Policy | Qualification | Leases | Governance | Gate |
+-----------------------------------------------------------------------------+
                                       |
                                       v (Cordis Services & Effects)
+-----------------------------------------------------------------------------+
|                                DSH Layer                                    |
| Agent Loop | LLM Service (ctx.llm) | Tool Pipeline | Session Log | Sandbox  |
+-----------------------------------------------------------------------------+
```

---

## 2. Ownership Responsibility Matrix

| Subsystem / Capability | DeepSeek Harness (DSH) Owns | Self-Evolving Harness (SEH) Owns | Prohibited Duplication |
| :--- | :--- | :--- | :--- |
| **Agent Loop & Turns** | `packages/core/agent-loop`: model calls, turn execution, tool resolution, waterfalls. | Task family identification, episode identity, subtask decomposition, structured handoffs. | NO parallel agent loop; NO modification to `core/agent-loop` without ADR. |
| **Model Invocations** | `ctx.llm` service interface, provider registry, standard chat completions, streaming, token metering. | Provider-neutral routing (`ModelRouteRef`), runtime qualification, single-GPU residency leases. | NO bespoke Kimi/Qwen provider packages; NO second provider registry. |
| **Tool Execution & Sandboxing** | `packages/core/tools`: tool registry, parameter validation, execution, approval gates, Landlock/Docker isolation. | `ToolGrantManifest` calculation prior to steering selection; egress guard deny filter. | NO shadow tool loop; NO bypassing user approval or sandbox policy. |
| **Representation Steering** | Prompt assembly, standard tool call formatting, model output parsing. | Steering vector intake, extraction metadata, layer/alpha qualification range, neutral rollback. | NO runtime tool granting via steering vectors; NO steering vector application without qualification. |
| **Session & Evidence** | `packages/session/*`: durable SQLite session persistence, canonical model-visible event stream. | SEH control ledger (`SEHControlEvent`), evidence index, routing/residency/gate/release decisions. | NO mirroring model-visible text in SEH ledger; DSH session log is canonical runtime truth. |
| **Residency & Hardware** | Subprocess management, execution environment setup. | Single-GPU exclusive lease manager (`GpuLease`), process/VRAM release verification, swap policy. | NO unmanaged multi-model GPU residency; $\le 1$ generative model loaded at reference workstation. |
| **Remote Export & Secrets** | `packages/credentials/*`: credential store, secret redaction, authorization capabilities. | Pre-session export sanitizer, data classification (`PUBLIC`..`RESTRICTED`), spend reservation, deny guard. | NO plaintext secrets in configs; NO silent request rewriting; egress guard is deny-only. |
| **Training & Backends** | *None (DSH is purely an inference & execution harness).* | `TrainingBackendRef`, isolated worker specs, dataset lineage, SFT/QLoRA qualification, Agent Lightning gateway. | NO training in control process; training backends cannot qualify or promote themselves. |
| **Evaluation & Gate** | Test suites, snapshot test harness, package invariants. | Progressive qualification ladder, independent gate decisions, hard veto enforcement. | Optimizer cannot gate/release; trainer cannot access hidden test sets or self-promote. |
| **Release & Rollback** | Package publication, git versioning. | Atomic release manifest, canary policy, rollback targets, portfolio activation. | Candidate authors cannot activate releases; activation requires human approval. |

---

## 3. Deliberately Absent Packages (§24.3)

To prevent duplication and architectural drift, the following packages are explicitly forbidden in SEH:
- `llm/kimi-k3`
- `llm/vibethinker-local`
- `llm/qwen-coder`
- `seh/provider-registry`
- `seh/tool-loop`
- `seh/session-runtime`
- `seh/chat-backend`
- `seh/steering-authorization`
- `seh/unsloth-control-plane`

Models served through OpenAI-compatible or local inference protocols are accessed via standard DSH routes combined with SEH qualification records.

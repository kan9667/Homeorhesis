# SEH v3.1 operating guide for Antigravity

## How this workspace is loaded

Antigravity applies project customizations from `.agents/`.

- `.agents/rules/` contains persistent project guidance. The always-on `00-seh-core.md` imports repository root `GEMINI.md`.
- `.agents/workflows/` contains repeatable slash commands.
- `.agents/skills/<name>/SKILL.md` contains focused, progressively disclosed procedures.
- `.agents/agents/` contains optional custom subagents with explicit tools and command policy.
- `.agents/hooks.json` runs advisory lifecycle scripts.
- `.agents/mcp_config.json` starts empty and must remain reviewed, sparse, and secret-free.

Antigravity's global rule path is `~/.gemini/GEMINI.md`. This pack does not overwrite it. Root `GEMINI.md` is project-owned and is loaded through the workspace rule.

## Required activation

Set these rules to **Always On**:

- `00-seh-core`
- `10-authority-security`
- `20-dsh-cordis-integration`
- `60-phase-change-discipline`
- `70-verification-evidence`

Set these rules to **Model Decision**:

- `30-task-taxonomy-deterministic-lane`
- `40-model-portfolio-qualification`
- `45-representation-steering`
- `50-residency-scheduling`
- `55-supervised-training-backend`
- `80-remote-model-secrets`
- `90-documentation-upstream`
- `95-training-evolution`

Activation is intentionally documented because Antigravity stores activation choices in the IDE customization state rather than in these Markdown files.

## Required IDE posture

- Terminal Command Auto Execution: **Request Review**.
- Agent Non-Workspace File Access: disabled.
- MCP: empty until reviewed; unconfigured MCP tools should remain in Ask mode.
- Browser execution: approve only the exact domains and actions required.
- High-impact Git, dependency, network, model-runtime, training, gate, release, and deployment operations: explicit review every time.

Antigravity terminal sandboxing is currently a macOS/Linux preview and is not yet available on Windows. Hooks and subagent command policies are defense-in-depth, not substitutes for DSH/SEH authorization, OS process isolation, protected credentials, or a real training sandbox.

## Session start

1. Run `/seh-session-start`.
2. Confirm `architecture.md` hash, active phase, research lane, DSH pin, working tree, and nearest `AGENTS.md` instructions.
3. Classify the work as Phase 0, 0-M, 0-M/S, 0-M/U, later-phase planning, or out of scope.
4. State protected targets, actor/authority changes, evidence owner, verification plan, and rollback.
5. Use the most specific skill or reviewer subagent.

## Phase 0 behavior

Allowed: documentation, ADRs, schemas, branded IDs, browser-safe contracts, empty service definitions, fake fixtures, negative-authority tests, one-GPU lease tests, evidence ownership maps, provider-neutral fixtures, and disabled feature registration tests.

Denied: automatic routing, real model load/unload, non-neutral steering, steering-vector extraction, Unsloth installation or training, real remote provider traffic, candidate execution, Agent Lightning runtime, autonomous persistent memory mutation, automatic promotion, VAMS runtime dependencies, and `core/agent-loop` changes.

## Research lanes

Phase 0-M evaluates exact model and runtime profiles. Phase 0-M/S reproduces representation steering with immutable vector identity, held-out qualification, malformed-call ceilings, and neutral rollback. Phase 0-M/U evaluates an exact Unsloth environment against standard Transformers/PEFT, with read-only base weights, sealed datasets, bounded GPU leases, quarantined outputs, and actual-runtime round-trip qualification.

Research outputs are evidence and disposition records only. They cannot write active portfolio, route, qualification, gate, or release state.

## Hooks

`seh-phase-context` injects a first-invocation reminder from `.seh/phase-state.json` and `.seh/upstream-pin.json`.

`seh-tool-review` evaluates proposed file mutations and terminal commands. It denies obvious destructive/out-of-workspace actions and requests or forces review for protected and high-impact actions. The hook does not inspect every possible semantic attack and does not replace code-level authorization.

Run `/seh-hook-self-test` after editing hooks or protected-target data.

## Optional custom subagents

Use reviewer subagents for bounded parallel analysis. They do not inherit conversation history, do not become architecture authorities, and cannot approve their own work. Their outputs are proposals requiring main-agent and human review. Exact tool names matter; do not add unverified names to frontmatter.

## Handoff evidence

Before handoff, report:

- files changed;
- authority/evidence implications;
- commands and exit codes;
- focused and broader checks;
- unresolved decisions;
- disabled features confirmed;
- rollback path;
- whether any network, dependency, model, provider, or training action was performed.

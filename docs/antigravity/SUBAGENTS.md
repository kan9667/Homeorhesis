# SEH custom subagents

Antigravity discovers `.agents/agents/<name>/agent.md`. The YAML frontmatter in this pack uses exact supported tool names and declares each reviewer as `subagent: true`, `mainAgent: false`, model `pro`, and `commandExecutionPolicy: off`.

Subagents start with isolated conversation context. Their prompts therefore require them to read `GEMINI.md`, DSH `AGENTS.md`, architecture, phase state, and relevant ADRs. They do not inherit unstated decisions from the parent.

Use:

- `seh-architect` for architecture/seam review.
- `seh-verifier` for evidence and checks.
- `seh-upstream-reviewer` for pin-candidate comparison.
- `seh-portfolio-researcher` for model/runtime research plans.
- `seh-steering-reviewer` for vector/alpha/tool-grant review.
- `seh-training-backend-reviewer` for isolation/environment/export review.

A subagent cannot approve its own work, move a pin, change a release, activate a model, or become an SEH security identity. The main agent and human operator remain responsible for review.

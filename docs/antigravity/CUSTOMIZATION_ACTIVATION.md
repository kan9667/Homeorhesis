# Antigravity customization activation

## Always On rules

- `00-seh-core`
- `10-authority-security`
- `20-dsh-cordis-integration`
- `60-phase-change-discipline`
- `70-verification-evidence`

## Model Decision rules

- `30-task-taxonomy-deterministic-lane`
- `40-model-portfolio-qualification`
- `45-representation-steering`
- `50-residency-scheduling`
- `55-supervised-training-backend`
- `80-remote-model-secrets`
- `90-documentation-upstream`
- `95-training-evolution`

Manual activation is acceptable during testing, but production development should not depend on a user remembering the core authority/evidence rules.

## Workflows

Antigravity exposes files in `.agents/workflows` as slash commands by filename. Begin every material task with `/seh-session-start`. Research work must use the matching 0-M workflow.

## Skills

Skills are discovered from `.agents/skills/<skill>/SKILL.md`. Their frontmatter descriptions are intentionally specific so the agent can select the narrowest applicable procedure.

## Custom subagents

Agents in `.agents/agents` are optional. They are configured as subagent-only, model `pro`, command policy `off`, and explicit tool lists. They are reviewers, not authority principals. Do not treat their output as approval.

## Hooks

Enable `.agents/hooks.json` only after running `node scripts/test-antigravity-hooks.mjs`. Keep hook scripts tracked and reviewed. Changes to hooks, rules, skills, workflows, agents, or `.seh` policy are protected-target changes.

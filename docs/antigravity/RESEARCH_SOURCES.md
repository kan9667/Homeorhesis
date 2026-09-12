# Research sources reviewed for this setup pack

Reviewed on 2026-08-29. These sources informed the setup pack; observed product or dependency versions are not automatically adopted project pins.

## Google Antigravity official documentation

- Rules: `https://antigravity.google/docs/ide/rules`
- Workflows: `https://antigravity.google/docs/ide/workflows`
- Skills: `https://antigravity.google/docs/skills/`
- Hooks and hook I/O contract: `https://antigravity.google/docs/ide/hooks`
- MCP configuration: `https://antigravity.google/docs/mcp/`
- Permissions: `https://antigravity.google/docs/permissions/`
- IDE settings and terminal sandbox support: `https://antigravity.google/docs/ide/settings`
- Custom subagents: `https://antigravity.google/docs/subagents/`

Observed documentation navigation showed Antigravity 2.0 v2.11.0 and Antigravity CLI v1.1.22. Re-check before depending on behavior that may change.

## DeepSeek Harness

- Repository: `https://github.com/deepseek-ai/deepseek-harness`
- Approved SEH baseline: `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e` / `dsh@0.1.1-rc.2`
- Observed upstream candidate: `cd5ef8148158c3a752a658978873241fdf8e2bbc` / `dsh@0.1.2-alpha.1`

The observed candidate remains unreviewed. Use `/seh-upstream-sync`; never move the approved pin from feature work.

## Supervised training and harness optimization

- Unsloth repository and release history: `https://github.com/unslothai/unsloth`
- Agent Lightning repository and release history: `https://github.com/microsoft/agent-lightning`

The observed Unsloth release was `v0.1.804-beta` (2026-08-27) and the observed Agent Lightning release was `v1.0.1` (2026-08-24). Both observations require exact source, license, environment, compatibility, and security review before adoption.

## Architecture research

See `architecture.md` Section 35 for representation steering, llama.cpp control vectors, model/runtime candidates, ReASearch, AutoDesign, Agent Lightning, harness evaluation, security, and VAMS cognitive references.

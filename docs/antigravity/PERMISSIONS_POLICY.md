# Recommended Antigravity permissions posture

Antigravity evaluates Deny before Ask before Allow. Workspace file reads/writes are normally auto-allowed; commands, MCP, browser actuation, and non-workspace files default to Ask when unconfigured.

## Required user settings

- Terminal Command Auto Execution: Request Review.
- Agent Non-Workspace File Access: disabled.
- Keep all MCP tools in Ask until each server/tool is reviewed.

## Deny candidates

Deny destructive/root commands, writes to `.git`, SSH and credential locations, tracked `.env` files, arbitrary external model stores, active release pointers, gate credentials, and hidden evaluation data. Adapt exact paths to the machine; do not assume example paths are portable.

## Ask candidates

Keep `command(*)`, `mcp(*)`, browser actuation, network fetches, dependency installation, Git mutations, model downloads, runtime start/stop, steering extraction/load, training, deployment, gate, and release in Ask or a stricter project control.

## Narrow allow candidates

After review, consider only exact read-only or validation commands such as `git status`, `git diff`, and the setup validators. Do not allow broad package-manager, shell, Python, PowerShell, Docker, WSL, curl, or Git prefixes; they can perform arbitrary effects.

## Windows note

Antigravity terminal sandboxing is not currently available on Windows. Permission prompts and hooks reduce accidental execution but do not isolate processes. Training and candidate execution therefore need WSL2/container or another independently reviewed process boundary plus SEH authorization and protected credentials.

The machine-readable `.seh/antigravity-permissions.recommended.json` is documentation only and is not automatically applied.

# Antigravity hooks and SEH guards

The current Antigravity hook schema supports `PreToolUse`, `PostToolUse`, `PreInvocation`, `PostInvocation`, and `Stop`. This pack uses only:

- `PreInvocation` for a first-call phase and pin reminder.
- `PreToolUse` for review of file mutations and terminal commands.

`PreToolUse` may return `allow`, `deny`, `ask`, or `force_ask`. The SEH guard denies obvious destructive/out-of-workspace actions, force-prompts protected/high-impact actions, and asks for ordinary mutations. It does not auto-allow terminal commands.

Hooks receive camelCase JSON on stdin. The scripts emit only valid JSON on stdout; diagnostics must go to stderr if added.

## Security limit

Hooks are workspace files editable by an authorized user and may be bypassed by tools or paths they do not match. They are not the GCA, credential store, OS sandbox, GPU scheduler, remote final guard, evaluator, gate, or release authority. Every security property must also be enforced by code/process/credential boundaries and negative tests.

## Test

Run:

```text
node scripts/test-antigravity-hooks.mjs
```

The test exercises safe, protected, destructive, out-of-workspace, training, and first-invocation cases without executing the proposed commands.

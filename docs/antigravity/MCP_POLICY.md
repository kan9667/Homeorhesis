# MCP policy

The workspace MCP configuration starts as:

```json
{"mcpServers": {}}
```

Before adding a server, document owner, tools/resources, read/write scope, data classes, authentication, token storage, network endpoints, audit behavior, failure posture, and whether any tool can mutate repositories, providers, model stores, runtime control, evaluation data, gate, or release state.

Use `serverUrl` for remote MCP configurations. Never commit bearer tokens or OAuth client secrets. Prefer the MCP Store or secret-aware authentication. Keep tools in Ask mode until specifically reviewed. MCP content remains untrusted model input.

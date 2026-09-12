# Windows security posture

The reference workstation runs Windows 11. Antigravity IDE review settings and hooks reduce accidental operations but do not implement SEH's runtime isolation.

Use Request Review, deny non-workspace access, protect the repository and model store with OS ACLs, bind runtime control to loopback/protected IPC, keep it out of model tools, and restrict candidate/training/remote egress through a separately reviewed mechanism.

Current Antigravity IDE documentation describes terminal sandboxing for macOS/Linux. Antigravity CLI documentation separately describes Windows AppContainer. Do not assume IDE and CLI isolation are identical. Record the exact Antigravity product/version and measured behavior before relying on any sandbox.

Phase 0 uses fake runtime providers only. Phase 0-M model experiments must run in a deliberately isolated research environment and cannot grant production authority.

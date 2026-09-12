---
description: Implement one dependency-ordered SEH slice with explicit authority, evidence, compatibility, and verification.
---
# Implement one SEH slice

1. Run `/seh-session-start` and select the owning phase/workflow.
2. Write the smallest acceptance contract: inputs, outputs, failure posture, actor, protected targets, canonical evidence, public compatibility, and rollback.
3. Inspect existing DSH seams and tests. Prefer a plugin/service/provider/consumer/effect/event over loop or parallel subsystem changes.
4. Add failing focused tests, including negative authority and disabled-registration cases, before or with implementation.
5. Implement only the slice. Avoid dependency installation, upstream pin movement, model/runtime activation, or unrelated refactors.
6. Update documentation, ADR status/context, schemas, manifests, and generated catalogs that own affected facts.
7. Run focused checks, then proportionate broader gates. Use `/seh-verify` before handoff.

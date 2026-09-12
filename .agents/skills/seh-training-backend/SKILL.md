---
name: seh-training-backend
description: Designs and reviews implementation-neutral supervised-training backend contracts, isolation, GPU leases, evidence, and export round trips.
---

# Training backend

1. Keep policy, curation, scheduling, evaluation, gate, and release outside the backend.
2. Validate `TrainingBackendRef`, `TrainingRunSpec`, sealed dataset, immutable base, output root, resource grant, and checkpoint policy.
3. Run the numerical stack in an isolated worker with bounded mounts, egress, process identity, and no provider/gate/release credentials.
4. Use the shared protected GPU lease and prove pause, resume, cancel, cleanup, and VRAM release.
5. Pin the complete environment and training configuration.
6. Quarantine every output, export, load through the actual inference runtime, and independently qualify.
7. Compare a reference provider when practical; return a provider disposition, not production activation.

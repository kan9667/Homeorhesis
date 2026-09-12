---
name: seh-residency
description: Designs and verifies one-GPU model residency, leases, switching, runtime control, health checks, VRAM release, scheduling, and recovery.
---

# Residency

Separate capability routing from resource scheduling. The scheduler owns exclusive leases; runtime manager executes approved profile IDs only. Test safe drain/unload/VRAM/load/health/lease/child sequence, failure recovery, restart reconciliation, concurrency, anti-thrashing, priority, batching, and training windows. Produce control evidence for every transition.

---
description: Design or verify the single-GPU residency scheduler, runtime manager, switching, lease, health, and anti-thrashing behavior.
---
# SEH residency review

1. Map route decision input separately from scheduler/runtime authority.
2. Verify exclusive lease and state machine under concurrency, cancellation, crash, timeout, and restart.
3. Exercise safe sequence: block new calls, drain, close/suspend, handoff, unload, process/VRAM verification, load, health, lease, child episode.
4. Test failed unload, ambiguous GPU state, invalid profile/path, stale release, second lease, model-facing control attempt, and restart recovery.
5. Measure switch utility and enforce count/cooldown/minimum residency/batching/priority budgets.
6. Produce replayable control evidence and rollback/recovery outcome.

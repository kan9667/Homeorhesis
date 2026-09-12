---
description: Reproduce and qualify representation steering in the isolated Phase 0-M/S lane.
---
# SEH Phase 0-M/S representation steering

1. Run `/seh-session-start`; confirm Phase 0-M/S and choose an exact neutral runtime profile already suitable for research.
2. Seal separate extraction, development, qualification, and held-out tool-schema splits with rights and data-class records.
3. Fix the task family, tool bundle, prompt bundle, parser, tokenizer, template, model/adapter/quantization, engine/version, and neutral baseline.
4. Extract the vector reproducibly; hash the vector, method, data, split, layer range, code, and environment.
5. Run neutral, prompt-calibrated, and bounded alpha cells through the real DSH tool pipeline. The `ToolGrantManifest` is fixed before steering.
6. Measure required-tool recall, unnecessary calls, malformed calls, unknown names, argument accuracy, verifier success, recovery, direct-answer regression, latency, and cost.
7. Prove out-of-range/incompatible alpha denial, no tool-grant expansion, episode pinning, replay, and neutral rollback.
8. Produce a disposition: named-task adopt proposal, restricted, research-only, or reject. Do not activate a production profile.

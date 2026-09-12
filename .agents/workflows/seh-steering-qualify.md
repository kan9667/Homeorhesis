---
description: Review a ToolUseSteeringProfile and SteeringQualification for exact identity, metrics, safety, and rollback.
---
# Qualify representation steering

1. Confirm task family and `ToolGrantManifest` were fixed before steering selection.
2. Validate exact base runtime, artifact/adapter, quantization, engine, tokenizer, template, parser, prompt/tool bundles, extraction data/split/method, vector digest, layer range, and alpha bounds.
3. Confirm extraction data and qualification/held-out sets are distinct and rights/data-class records are complete.
4. Compare neutral, prompt-calibrated, and bounded steering cells under matched budgets.
5. Enforce malformed-call, unknown-name, argument, direct-answer, reasoning, latency, cost, and tool-loop ceilings.
6. Test incompatible/out-of-range alpha denial, episode pinning, replay, startup verification, and neutral rollback.
7. Record `shadow`, `qualified`, `restricted`, `stale`, `rejected`, or `retired`; never activate from this workflow.

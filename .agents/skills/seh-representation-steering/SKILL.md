---
name: seh-representation-steering
description: Reviews, reproduces, and qualifies local representation-steering profiles for tool-call propensity without granting or executing tools.
---

# Representation steering

Use this skill for vector extraction, control-vector runtime integration, alpha sweeps, steering qualification, or regressions involving tool-call propensity.

1. Fix task family and `ToolGrantManifest` before steering.
2. Pin exact model/adapter, runtime/engine, quantization, tokenizer, template, parser, prompt/tool bundle, extraction data/split/method, vector, layers, and alpha bounds.
3. Separate extraction, development, qualification, and held-out tool-schema data.
4. Compare neutral, prompt-calibrated, and steered cells under matched budgets.
5. Measure required and unnecessary tool use, malformed/unknown calls, arguments, success, recovery, direct-answer and reasoning regression, latency, and cost.
6. Require protected selection, episode pinning, replay, startup identity verification, and neutral rollback.
7. Return a disposition and evidence gaps. Never activate production state.

# Representation-steering setup and research gate

Representation steering is not enabled by this pack. Phase 0 defines contracts; Phase 0-M/S may reproduce and evaluate a profile after explicit approval.

## Required identity

A profile must pin model and optional adapter digests, quantization, engine/version/config, tokenizer, chat template, tool parser, prompt bundle, tool bundle, extraction dataset and split, extraction method/readout, vector artifact, layer range, author, evidence, and content hash.

A qualification additionally pins the harness release, evaluator bundle, task-family results, alpha range/default/task mapping, malformed/unknown/unnecessary call metrics, non-tool regression evidence, status, and expiry.

## Ordering

Task classification and `ToolGrantManifest` calculation precede route and steering selection. Steering cannot alter the grant. DSH still parses, validates, authorizes, approves, executes, and verifies tool calls.

## Research cells

At minimum compare neutral, prompt/config calibrated, and several bounded alpha values. Add adapter-neutral/adapter-steered only when testing an already independently identified adapter. Keep extraction data separate from qualification and held-out tool schemas.

## Vetoes

Reject tool-grant expansion, out-of-range/incompatible alpha, malformed-call amplification, unknown tool names, unparseable arguments, critical direct-answer or reasoning regression, uncontrolled tool loops, missing replay identity, or failed neutral rollback.

## Runtime posture

Until an adopted runtime proves authenticated safe hot adjustment, treat each vector/alpha as an exact runtime profile transition at an episode boundary. Runtime control remains scheduler-only and absent from model tools.

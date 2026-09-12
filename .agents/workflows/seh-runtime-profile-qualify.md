---
description: Qualify an exact local runtime profile for defined roles and task families on measured hardware.
---
# SEH runtime profile qualification

1. Verify model intake, license, digests, runtime engine/version, config, quantization, tokenizer, template, parser, context, cache, sampling, and hardware identity.
2. Use declared qualification split and verifier bundle; keep hidden/release data inaccessible.
3. Measure correctness, tool/structured validity, safety, context reliability, VRAM/RAM, load/unload, residual VRAM, latency, throughput, cancellation, and stability.
4. Test one-model lease and cleanup behavior with the runtime manager.
5. Issue a time-bounded qualification only for roles/task families/tools actually proven.
6. Record restrictions, expiry, evidence, and rejection cases. Do not activate production routing.

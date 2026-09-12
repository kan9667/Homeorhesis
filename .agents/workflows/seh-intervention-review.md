---
description: Select the least invasive intervention for a measured task-family failure.
---
# Review intervention choice

1. Define the task family, failure metric, verifier, data class, runtime profile, budget, and unacceptable regressions.
2. Test deterministic implementation or verifier changes first.
3. Test prompt, tool schema, parser, template, and inference configuration corrections.
4. Consider representation steering only for an already tool-capable local runtime and only for propensity calibration.
5. Consider supervised LoRA/QLoRA when syntax, argument construction, recovery, or learned behavior remains deficient.
6. Consider preference optimization or Agent Lightning only after lower stages are insufficient under matched evidence and budgets.
7. Record why each earlier stage failed or was materially worse, reversibility, new authority/supply-chain surface, evaluation plan, and rollback.

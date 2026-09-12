# SEH intervention ladder

1. **Deterministic implementation or verifier** - preferred for exact, structured, policy, and replayable work.
2. **Prompt, schema, parser, template, or inference configuration** - correct model-facing setup without changing weights/state.
3. **Representation steering** - calibrate tool-call propensity for an already capable local profile; does not grant tools or fix missing syntax/arguments.
4. **Supervised LoRA/QLoRA** - learn tool syntax, arguments, recovery, or role behavior from eligible sealed data.
5. **Preference/rejection optimization** - optimize choices when paired/ranked evidence exists.
6. **Agent Lightning harnessed RL** - later-phase optimization through the real deployed harness.

Every move later must identify the earlier-stage experiment, matched budget, why it failed or was materially worse, added supply-chain/authority/data risks, independent evaluation, release scope, and rollback. More invasive is not presumed more capable.

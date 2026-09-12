# SEH setup and workflow commands

## Target-machine bootstrap

```text
pwsh -File scripts/bootstrap-seh.ps1
bash scripts/bootstrap-seh.sh
```

The bootstrap is inspection-only. It does not install dependencies, download models, enable providers, extract vectors, or start training.

## Individual validators

```text
node scripts/check-toolchain.mjs
node scripts/check-seh-setup.mjs
node scripts/check-antigravity-limits.mjs
node scripts/test-antigravity-hooks.mjs
node scripts/check-upstream-pin.mjs
node scripts/hash-architecture.mjs
node scripts/check-local-links.mjs
node scripts/validate-runtime-profile.mjs .seh/examples/runtime-profile.example.json
node scripts/validate-steering-profile.mjs .seh/examples/steering-profile.example.json
node scripts/validate-training-backend.mjs .seh/examples/training-backend.example.json
node scripts/validate-training-run-spec.mjs .seh/examples/training-run-spec.example.json
node scripts/check-overlay-integrity.mjs
```

## Illustrative contract templates

```text
node scripts/new-runtime-profile.mjs path/to/runtime-profile.json
node scripts/new-steering-profile.mjs path/to/steering-profile.json
node scripts/new-training-run-spec.mjs path/to/training-run-spec.json
```

Generated files remain illustrative and unqualified. Replace every placeholder, attach evidence, and pass the independent qualification/gate process before production use.

## Antigravity workflows

Start with `/seh-session-start`, then invoke the narrowest matching workflow from `.agents/workflows`:

- implementation: `/seh-phase-0`, `/seh-first-pr`, `/seh-implement-slice`, `/seh-verify`;
- general research: `/seh-phase-0m`, `/seh-model-intake`, `/seh-runtime-profile-qualify`;
- steering research: `/seh-phase-0m-steering`, `/seh-steering-qualify`;
- supervised-training research: `/seh-phase-0m-unsloth`, `/seh-training-backend-qualify`;
- governance reviews: `/seh-architecture-review`, `/seh-intervention-review`, `/seh-residency-review`, `/seh-upstream-sync`.

---
description: Review any supervised TrainingBackend provider for isolation, reproducibility, resource control, and export round trip.
---
# Qualify a training backend

1. Validate exact backend/source revision, license, environment lock, OS, Python, driver/CUDA, framework versions, and capability IDs.
2. Validate the sealed `DatasetManifest`, immutable base, approved output root, resource budget, checkpoint policy, and `TrainingRunSpec` content hash.
3. Inspect mounts, process identity, egress, credentials, session access, hidden-set access, GPU lease acquisition, cancellation, cleanup, and quarantine behavior.
4. Run a tiny deterministic smoke job before any measured adapter experiment.
5. Capture complete logs, checkpoints, terminal reason, resource measurements, and evidence reconciliation.
6. Export and reload in the actual inference runtime; validate exact tokenizer/template/parser/quantization and independent qualification.
7. Compare a reference backend where practical. Record preferred, restricted, research-only, or rejected; never activate an adapter.

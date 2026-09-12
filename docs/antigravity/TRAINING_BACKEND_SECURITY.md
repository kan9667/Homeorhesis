# Training backend security checklist

- Separate coordinator identity from backend worker identity.
- Validate a content-addressed `TrainingRunSpec` before lease acquisition.
- Mount the sealed dataset read-only and base model read-only.
- Restrict output to a new candidate/quarantine directory.
- Deny arbitrary DSH sessions, hidden sets, provider credentials, policy, qualification, gate, portfolio, active release, and active model store.
- Deny backend-specific GPU scheduler bypass.
- Restrict network egress to explicit package/model sources during approved setup, then prefer offline execution.
- Record process tree, mounts, environment, command, lockfiles, driver/CUDA/framework versions, resource use, checkpoints, and terminal reason.
- Prove pause/resume/cancel, process cleanup, and VRAM release.
- Scan outputs and metadata; assign new immutable identities.
- Requalify exports in the actual inference runtime.
- Preserve independent evaluator, gate, human activation, canary, and rollback.

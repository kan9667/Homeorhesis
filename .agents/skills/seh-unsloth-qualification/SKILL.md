---
name: seh-unsloth-qualification
description: Evaluates an exact Unsloth Core LoRA/QLoRA environment on the reference workstation against a standard PEFT path.
---

# Unsloth qualification

Use only in Phase 0-M/U with explicit authorization for downloads and GPU work.

1. Pin exact Unsloth source/release, license, Python, OS, driver/CUDA, PyTorch, Triton, Transformers, PEFT, TRL, quantization libraries, and lock digest.
2. Treat native Windows and WSL2/Linux as separate qualifications.
3. Run a tiny smoke job, then one approved 3B-4B QLoRA experiment with a sealed local dataset.
4. Keep base read-only, outputs quarantined, and GPU lease exclusive.
5. Measure VRAM/RAM/thermal behavior, throughput, checkpoint/resume/cancel, cleanup, and reproducibility.
6. Run a matched standard PEFT reference where feasible.
7. Save/reload/export/convert and requalify in the actual SEH inference runtime.
8. Record preferred, restricted, research-only, or rejected. Do not install or run without explicit approval.

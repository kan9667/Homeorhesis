---
description: Qualify an isolated Unsloth supervised-training backend in Phase 0-M/U without production authority.
---
# SEH Phase 0-M/U Unsloth backend

1. Run `/seh-session-start`; confirm Phase 0-M/U, explicit authorization for dependency/model downloads, and no production state writes.
2. Record the exact Unsloth source/release candidate, license, Python/OS/CUDA/driver/PyTorch/Triton/Transformers/PEFT/TRL/quantization versions, lock digest, and hardware state.
3. Evaluate native Windows and WSL2/Linux as separate environments when practical. Do not assume portability.
4. Seal a tiny synthetic smoke dataset, then one approved 3B-4B QLoRA dataset. Keep base weights read-only and outputs in quarantine.
5. Acquire the shared GPU lease; measure peak VRAM/RAM, thermals, throughput, checkpoint, pause/resume/cancel, process cleanup, and VRAM release.
6. Run a standard Transformers/PEFT reference cell under matched configuration where feasible.
7. Save, reload, export/convert, hash, and load the adapter through the actual protected inference runtime with exact tokenizer/template/parser.
8. Independently qualify base-neutral, base-steered, adapter-neutral, and adapter-steered cells only where justified.
9. Prove the worker cannot read arbitrary sessions, credentials, hidden sets, policy, qualification, gate, portfolio, or release state.
10. Produce a disposition: preferred candidate, restricted, research-only, or reject. Training completion never grants authority.

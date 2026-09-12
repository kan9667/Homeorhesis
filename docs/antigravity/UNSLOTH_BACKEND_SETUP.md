# Unsloth Core backend research setup

Unsloth is not installed or adopted by this pack. The observed release `v0.1.804-beta` is an unreviewed Phase 0-M/U candidate. Choose an exact pin only after license, compatibility, reproducibility, and reference-backend review.

## Environment records

Record Python, OS mode, GPU driver, CUDA runtime, PyTorch, Triton, bitsandbytes when used, Transformers, PEFT, TRL when used, Unsloth and Unsloth Zoo versions/revisions, model/tokenizer/template digests, precision, gradient checkpointing, and environment lock digest.

Treat native Windows and WSL2/Linux as separate environment qualifications. The reference workstation has 8 GB VRAM and 24 GB RAM; begin with a tiny smoke run and one approved 3B-4B QLoRA target, not a 7B/8B promise.

## Isolation

The Python worker receives a sealed dataset, read-only base, exact run config, bounded resource grant, and candidate output root. It receives no arbitrary session-query permission, provider credentials, hidden evaluation data, GCA/gate/release credentials, or active model-store write access. Use the same protected GPU lease as inference and qualification.

## Reference comparison

Preserve a standard Transformers/PEFT route for portability and correctness comparison. Compare environment setup, peak VRAM/RAM, throughput, checkpoints, pause/resume/cancel, cleanup, artifact reproducibility, and export behavior.

## Round trip

Training loss is not acceptance. Save and hash the adapter, optionally merge/convert, reload through the actual protected inference runtime, verify tokenizer/template/parser, run independent role/task qualification, and keep outputs quarantined until a later gate/release process.

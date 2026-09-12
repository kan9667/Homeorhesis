---
description: Intake a local model or adapter artifact with source, license, hashing, conversion, isolation, and unqualified-by-default posture.
---
# SEH model intake

1. Record source, exact revision, model card, license, intended-use restrictions, and download identity.
2. Hash original artifact; scan packaging and metadata in isolation.
3. Record conversion/quantization tools, versions, commands, output digests, and model-store path.
4. Create a draft LocalRuntimeProfile; do not claim safe context or role capability.
5. Run isolated load/health/template/parser probes and record failures.
6. Mark status `unqualified`; qualification is a separate workflow.
7. Reject incompatible license, provenance, unexpected files, or unsafe runtime behavior.

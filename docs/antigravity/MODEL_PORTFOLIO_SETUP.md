# Local model portfolio setup

The setup pack creates no production model route and downloads no model.

Phase 0-M should first build a benchmark harness and model-intake ledger. Candidate classes may include general/agentic, coder, fast, reasoning, multimodal, and trainable roles. Every qualification is for an exact runtime profile, not a brand/model name.

On Windows, a prototype may use a reviewed OpenAI-compatible local runtime. The architecture remains runtime-neutral through `LocalRuntimeManager`; llama.cpp, Ollama, vLLM, SGLang, or another server must be qualified by exact version and behavior. Only scheduler identity controls load/unload, and only reviewed portfolio IDs can be loaded.

Do not infer safe context from the model card. Measure it with the actual quantization, KV/cache policy, prompt/tool template, output budget, GPU driver, power mode, and concurrent host load.

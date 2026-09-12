---
name: seh-intervention-selection
description: Chooses the least invasive deterministic, prompt/config, steering, supervised, preference, or RL intervention for a measured failure.
---

# Intervention selection

Start from the measurable failure and verifier. Test stages in order: deterministic; prompt/schema/config; representation steering; supervised adapter; preference optimization; Agent Lightning RL. Move later only with evidence that earlier methods are insufficient or materially worse. Compare accuracy, safety, malformed actions, cost, latency, reversibility, new dependencies, new authority surfaces, data requirements, and rollback. Document why the chosen stage is necessary.

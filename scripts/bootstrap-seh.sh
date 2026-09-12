#!/usr/bin/env bash
set -eu
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
echo "SEH v3.1 Antigravity bootstrap check"
command -v git >/dev/null 2>&1 || { echo "ERROR: git not found"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "ERROR: node not found; require ^22.19.0 or >=24"; exit 1; }
echo "Node: $(node --version)"
if command -v pnpm >/dev/null 2>&1; then echo "pnpm: $(pnpm --version)"; else echo "WARN: pnpm missing; approved DSH version is 11.7.0"; fi
if [ -f AGENTS.md ]; then echo "DSH AGENTS.md found"; else echo "WARN: AGENTS.md not found; copy overlay into the DSH fork root"; fi
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
cat <<'EOF'
Recommended Antigravity IDE posture:
- Terminal Command Auto Execution: Request Review
- Non-workspace file access: Off/Deny
- MCP empty until reviewed
- Windows terminal sandbox is not currently available
Start with /seh-session-start, then /seh-phase-0, /seh-phase-0m, /seh-phase-0m-steering, or /seh-phase-0m-unsloth.
No dependency, model, vector, or training action was performed by this script.
EOF

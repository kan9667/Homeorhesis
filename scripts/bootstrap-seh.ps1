$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
Write-Host 'SEH v3.1 Antigravity bootstrap check'
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'git not found' }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'node not found; require ^22.19.0 or >=24' }
Write-Host ('Node: ' + (& node --version))
if (Get-Command pnpm -ErrorAction SilentlyContinue) { Write-Host ('pnpm: ' + (& pnpm --version)) } else { Write-Warning 'pnpm missing; approved DSH version is 11.7.0' }
if (Test-Path 'AGENTS.md') { Write-Host 'DSH AGENTS.md found' } else { Write-Warning 'AGENTS.md not found; copy overlay into the DSH fork root' }
& node scripts/check-toolchain.mjs
& node scripts/check-seh-setup.mjs
& node scripts/check-antigravity-limits.mjs
& node scripts/test-antigravity-hooks.mjs
& node scripts/check-upstream-pin.mjs
& node scripts/hash-architecture.mjs
& node scripts/check-local-links.mjs
& node scripts/validate-runtime-profile.mjs .seh/examples/runtime-profile.example.json
& node scripts/validate-steering-profile.mjs .seh/examples/steering-profile.example.json
& node scripts/validate-training-backend.mjs .seh/examples/training-backend.example.json
& node scripts/validate-training-run-spec.mjs .seh/examples/training-run-spec.example.json
& node scripts/check-overlay-integrity.mjs
Write-Host 'Recommended Antigravity IDE posture:'
Write-Host '- Terminal Command Auto Execution: Request Review'
Write-Host '- Non-workspace file access: Off/Deny'
Write-Host '- MCP empty until reviewed'
Write-Host '- Windows terminal sandbox is not currently available'
Write-Host 'Start with /seh-session-start, then the matching Phase 0 or 0-M workflow.'
Write-Host 'No dependency, model, vector, or training action was performed by this script.'

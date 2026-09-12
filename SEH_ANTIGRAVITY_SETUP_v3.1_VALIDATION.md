# SEH Antigravity setup pack v3.1 validation

**Validation date:** 2026-08-29  
**Pack:** `SEH_Antigravity_Setup_v3.1_2026-08-29_FINAL`  
**Architecture:** SEH v3.1  
**Architecture SHA-256:** `e1d48e75f5ba169f262b08071add8fd7ae757d8d14f5c66a11147c404510d04a`  
**Artifact status:** PASS  
**Target-machine toolchain status:** Must be checked after installation

## Verified artifact properties

- `architecture.md` and `SEH_ARCHITECTURE_v3.1.md` are byte-identical and match the recorded SHA-256.
- The approved DSH baseline remains `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e` (`dsh@0.1.1-rc.2`).
- The observed upstream candidate `cd5ef8148158c3a752a658978873241fdf8e2bbc` (`dsh@0.1.2-alpha.1`) remains explicitly unreviewed and unadopted.
- All local-runtime, steering, remote, training, evolution, gate, promotion, and release capabilities default to disabled.
- Phase 0-M, 0-M/S, and 0-M/U remain research-only lanes.
- Antigravity workspace rules and workflows satisfy the documented 12,000-character per-file limit.
- Skills and custom subagents contain the required YAML frontmatter.
- Hook configuration uses supported `PreInvocation` and `PreToolUse` structures.
- Hook self-tests cover safe writes, protected and credential paths, outside-workspace paths, destructive commands, Git mutations, network fetches, generic training commands, accelerator launches, validation commands, malformed input, and invocation reminders.
- Workspace MCP starts empty and grants no external MCP capability.
- ADR stubs 001-022 are present.
- Steering and supervised-training policy, schemas, examples, workflows, skills, reviewer agents, and security documentation are present.
- No credential value, live model pin, active steering vector, adopted training backend, remote provider activation, training execution, or production release was created.

## Executed checks

```text
node --check scripts/*.mjs                                      PASS (17 scripts)
bash -n scripts/bootstrap-seh.sh                                PASS
node scripts/check-seh-setup.mjs                                PASS
node scripts/check-antigravity-limits.mjs                       PASS
node scripts/test-antigravity-hooks.mjs                         PASS
node scripts/check-upstream-pin.mjs                             PASS/INFORMATIONAL outside Git worktree
node scripts/hash-architecture.mjs                              PASS
node scripts/check-local-links.mjs                              PASS
node scripts/validate-runtime-profile.mjs <example>             PASS
node scripts/validate-steering-profile.mjs <example>            PASS
node scripts/validate-training-backend.mjs <example>            PASS
node scripts/validate-training-run-spec.mjs <example>           PASS
Template generator/validator round trip                         PASS
JSON parsing                                                    PASS (37 files)
Draft 2020-12 schema/example validation                         PASS (4 pairs)
UTF-8, LF, and trailing-newline checks                          PASS
Case-insensitive path-collision check                           PASS
Windows filename and relative-path compatibility                PASS
Placeholder and stale-v3.0 setup scan                           PASS
Committed-secret pattern scan                                  PASS
```

The overlay-integrity check is executed after this report and the final manifest are regenerated. ZIP integrity is checked after packaging.

## Toolchain observation on the validation host

The artifact validator intentionally separates pack correctness from the target workstation toolchain. The current validation host reported:

```text
Node.js: v22.16.0       DOES NOT satisfy ^22.19.0 || >=24.0.0
pnpm:    not installed  DOES NOT satisfy 11.7.0
git:     2.47.3         PASS
PowerShell: unavailable not executed on this host
```

This is not a defect in the setup pack. Before installing dependencies in the actual DSH fork, install an approved Node.js version and pnpm 11.7.0, then run the platform bootstrap script. The PowerShell bootstrap was statically inspected, but it could not be executed in this Linux validation environment.

## Required target-workstation verification

From the repository root after copying the overlay:

```text
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
```

`check-upstream-pin.mjs` may report that the overlay is not yet inside a Git worktree or that the current checkout is not exactly the architecture pin. Treat that as informational only when the intended branch ancestry has already been independently verified against the approved baseline.

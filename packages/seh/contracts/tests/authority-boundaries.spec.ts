import { describe, expect, it } from 'vitest'
import { isWritePermitted, loadProtectedTargets, type ActorRole } from '../src/protected-targets.js'

describe('authority boundaries and protected targets (§4.1, §4.2, §19.1)', () => {
  it('successfully loads .seh/protected-targets.json with expected structure and targets', () => {
    const config = loadProtectedTargets()
    expect(config.schemaVersion).toBe(1)
    expect(config.protected.length).toBeGreaterThan(0)

    const targetIds = config.protected.map(t => t.id)
    expect(targetIds).toContain('architecture-invariants')
    expect(targetIds).toContain('workspace-constitution')
    expect(targetIds).toContain('dsh-instructions')
    expect(targetIds).toContain('gca-and-policy')
    expect(targetIds).toContain('evaluator-gate-release')
    expect(targetIds).toContain('residency-and-runtime-control')
    expect(targetIds).toContain('training-eligibility')
  })

  it('strictly prohibits WORKER, TRAINER, and OPTIMIZER roles from modifying protected targets (§4.2)', () => {
    const unprivilegedRoles: ActorRole[] = ['WORKER', 'TRAINER', 'OPTIMIZER', 'CLASSIFIER', 'ROUTER']
    const targets = [
      'architecture-invariants',
      'evaluator-gate-release',
      'residency-and-runtime-control',
      'gca-and-policy',
      'training-eligibility',
      'dependency-and-ci',
    ]

    for (const role of unprivilegedRoles) {
      for (const target of targets) {
        expect(isWritePermitted(role, target)).toBe(false)
      }
    }
  })

  it('permits bounded authority only to GATE and RELEASE_MANAGER for specific targets (§19.1)', () => {
    expect(isWritePermitted('GATE', 'evaluator-gate-release')).toBe(true)
    expect(isWritePermitted('GATE', 'architecture-invariants')).toBe(false)
    expect(isWritePermitted('GATE', 'residency-and-runtime-control')).toBe(false)

    expect(isWritePermitted('RELEASE_MANAGER', 'evaluator-gate-release')).toBe(true)
    expect(isWritePermitted('RELEASE_MANAGER', 'dependency-and-ci')).toBe(true)
    expect(isWritePermitted('RELEASE_MANAGER', 'architecture-invariants')).toBe(false)
  })
})

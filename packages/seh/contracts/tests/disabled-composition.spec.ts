import { describe, expect, it } from 'vitest'
import type { SehPolicyService } from '../src/service-interfaces.js'

class Phase0PolicyService implements SehPolicyService {
  private readonly enabledFeatures = new Set<string>([
    'phase-0-contracts',
    'evidence-reconciliation',
    'authority-boundaries',
  ])

  isFeatureEnabled(featureName: string): boolean {
    return this.enabledFeatures.has(featureName)
  }

  getKillSwitches() {
    return []
  }
}

describe('Phase 0 disabled composition posture (§29, Phase 0 Exit)', () => {
  const policy = new Phase0PolicyService()

  it('verifies that Phase 0 contracts slice is enabled', () => {
    expect(policy.isFeatureEnabled('phase-0-contracts')).toBe(true)
    expect(policy.isFeatureEnabled('evidence-reconciliation')).toBe(true)
  })

  it('verifies that automatic routing is disabled in Phase 0', () => {
    expect(policy.isFeatureEnabled('automatic-routing')).toBe(false)
  })

  it('verifies that live runtime switching and model loading are disabled in Phase 0', () => {
    expect(policy.isFeatureEnabled('live-runtime-switching')).toBe(false)
    expect(policy.isFeatureEnabled('model-loading')).toBe(false)
  })

  it('verifies that non-neutral steering is disabled in Phase 0', () => {
    expect(policy.isFeatureEnabled('non-neutral-steering')).toBe(false)
  })

  it('verifies that real remote dispatch and egress are disabled in Phase 0', () => {
    expect(policy.isFeatureEnabled('remote-egress')).toBe(false)
  })

  it('verifies that model training and automatic promotion are disabled in Phase 0', () => {
    expect(policy.isFeatureEnabled('model-training')).toBe(false)
    expect(policy.isFeatureEnabled('automatic-promotion')).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import { asLeaseId, asRuntimeProfileId } from '../src/brand.js'
import { computeContentHash } from '../src/canonical-json.js'
import type { LocalExecutionProfileRef } from '../src/execution-profile.js'
import type { ResidencyLease } from '../src/residency.js'

class SingleGpuLeaseManager {
  private activeLease?: ResidencyLease | undefined

  getCurrentLease(): ResidencyLease | undefined {
    return this.activeLease
  }

  acquireLease(params: {
    leaseId: string
    profile: LocalExecutionProfileRef
    actorId: string
  }): ResidencyLease {
    if (this.activeLease && (this.activeLease.state === 'granted' || this.activeLease.state === 'active')) {
      throw new Error(
        `GPU concurrency violation: Lease ${String(this.activeLease.leaseId)} is already active. Max concurrent GPU models is 1 (§9.2, §9.6).`,
      )
    }

    const leaseData = {
      schemaVersion: 1 as const,
      leaseId: asLeaseId(params.leaseId),
      executionProfile: params.profile,
      holderActorId: params.actorId,
      acquiredAt: new Date().toISOString(),
      state: 'active' as const,
    }

    const lease: ResidencyLease = {
      ...leaseData,
      contentHash: computeContentHash(leaseData),
    }

    this.activeLease = lease
    return lease
  }

  releaseLease(leaseId: string): ResidencyLease {
    if (!this.activeLease || this.activeLease.leaseId !== leaseId) {
      throw new Error(`No active lease found matching ${leaseId}`)
    }

    const releasedLease: ResidencyLease = {
      ...this.activeLease,
      state: 'released',
      contentHash: computeContentHash({ ...this.activeLease, state: 'released', contentHash: undefined }),
    }

    this.activeLease = undefined
    return releasedLease
  }
}

describe('single-GPU residency lease exclusivity (§9.2, §9.6)', () => {
  const profileA: LocalExecutionProfileRef = {
    schemaVersion: 1,
    runtimeProfileId: asRuntimeProfileId('profile-fast-coder'),
    effectiveConfigDigest: 'digest-a',
  }

  const profileB: LocalExecutionProfileRef = {
    schemaVersion: 1,
    runtimeProfileId: asRuntimeProfileId('profile-reasoner'),
    effectiveConfigDigest: 'digest-b',
  }

  it('successfully grants initial lease when GPU is vacant', () => {
    const manager = new SingleGpuLeaseManager()
    const lease = manager.acquireLease({
      leaseId: 'lease-001',
      profile: profileA,
      actorId: 'scheduler-actor',
    })

    expect(lease.state).toBe('active')
    expect(lease.executionProfile.runtimeProfileId).toBe('profile-fast-coder')
    expect(lease.contentHash).toBeDefined()
    expect(manager.getCurrentLease()?.leaseId).toBe('lease-001')
  })

  it('rejects second concurrent lease acquisition when a model is already resident (§9.2 maxConcurrentGpuModels: 1)', () => {
    const manager = new SingleGpuLeaseManager()
    manager.acquireLease({
      leaseId: 'lease-001',
      profile: profileA,
      actorId: 'scheduler-actor',
    })

    expect(() =>
      manager.acquireLease({
        leaseId: 'lease-002',
        profile: profileB,
        actorId: 'scheduler-actor',
      }),
    ).toThrowError(/GPU concurrency violation: Lease lease-001 is already active/)
  })

  it('permits acquiring new lease after prior lease has been drained and released (§9.7)', () => {
    const manager = new SingleGpuLeaseManager()
    const leaseA = manager.acquireLease({
      leaseId: 'lease-001',
      profile: profileA,
      actorId: 'scheduler-actor',
    })

    const released = manager.releaseLease(String(leaseA.leaseId))
    expect(released.state).toBe('released')
    expect(manager.getCurrentLease()).toBeUndefined()

    const leaseB = manager.acquireLease({
      leaseId: 'lease-002',
      profile: profileB,
      actorId: 'scheduler-actor',
    })
    expect(leaseB.state).toBe('active')
    expect(leaseB.executionProfile.runtimeProfileId).toBe('profile-reasoner')
  })
})

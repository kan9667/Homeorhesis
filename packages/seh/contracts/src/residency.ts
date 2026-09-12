/**
 * Single-GPU residency, lease, and switch decision contracts (§9.4, §9.5, §9.6).
 * Enforces exclusive single-model residency on reference workstation hardware.
 * @module @deepseek-ai/dsh-seh-contracts/residency
 */

import type { LeaseId } from './brand.js'
import type { LocalExecutionProfileRef } from './execution-profile.js'

/**
 * Budget constraints on runtime profile switching (§9.4).
 */
export interface LocalSwitchBudget {
  readonly maxSwitchesPerTask: number
  readonly maxSwitchesPerHour?: number
  readonly minimumExpectedUtilityGain: number
  readonly minimumResidencyMs: number
  readonly switchCooldownMs: number
  readonly maximumQueueDelayMs: number
  readonly drainTimeoutMs: number
  readonly loadHealthTimeoutMs: number
  readonly unloadTimeoutMs: number
}

/**
 * Decision record when evaluating a runtime residency switch (§9.5).
 */
export interface ResidencyDecision {
  readonly schemaVersion: 1
  readonly residencyDecisionId: string
  readonly taskId?: string
  readonly episodeId?: string
  readonly requestedExecutionProfile: LocalExecutionProfileRef
  readonly currentExecutionProfile?: LocalExecutionProfileRef
  readonly action: 'reuse' | 'load' | 'switch' | 'queue' | 'deny'
  readonly reasonCodes: readonly string[]
  readonly estimatedSwitchMs?: number
  readonly queuePriority: number
  readonly switchBudgetSnapshot: LocalSwitchBudget
  readonly createdAt: string
  readonly contentHash: string
}

/**
 * Exclusive residency lease for local single-GPU execution (§9.6).
 */
export interface ResidencyLease {
  readonly schemaVersion: 1
  readonly leaseId: LeaseId | string
  readonly executionProfile: LocalExecutionProfileRef
  readonly holderActorId: string
  readonly taskId?: string
  readonly episodeId?: string
  readonly acquiredAt: string
  readonly expiresAt?: string
  readonly state: 'granted' | 'active' | 'draining' | 'released' | 'revoked'
  readonly contentHash: string
}

/** Aliases for compatibility */
export type GpuLease = ResidencyLease
export type ResidencySwitchDecision = ResidencyDecision

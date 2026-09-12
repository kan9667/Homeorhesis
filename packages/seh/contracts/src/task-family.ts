/**
 * Task-family contracts, metrics, and qualification results (§6.2, §7.5).
 * @module @deepseek-ai/dsh-seh-contracts/task-family
 */

import type { CapabilityRequirements } from './capability.js'

/**
 * Task family definition contract (§6.2).
 */
export interface TaskFamilyDefinition {
  readonly schemaVersion: 1
  readonly taskFamilyId: string
  readonly version: string
  readonly title: string
  readonly description: string
  readonly capabilityTemplate: CapabilityRequirements
  readonly permittedRouteClasses: readonly string[]
  readonly requiredVerifierClasses: readonly string[]
  readonly primaryMetrics: readonly string[]
  readonly hardVetoCodes: readonly string[]
  readonly qualificationSuiteRef: string
  readonly handoffPolicyRef: string
  readonly contentHash: string
}

/**
 * Qualification result for an individual model role (§7.5).
 */
export interface RoleQualificationResult {
  readonly roleId: string
  readonly passed: boolean
  readonly score?: number
  readonly metrics: Record<string, number>
  readonly vetoCodes: readonly string[]
}

/**
 * Qualification result for a task family (§7.5).
 */
export interface TaskFamilyQualification {
  readonly taskFamilyId: string
  readonly qualified: boolean
  readonly primaryMetricValues: Record<string, number>
  readonly hardVetoViolations: readonly string[]
  readonly evaluationRef?: string
}

/** Alias for task family definition */
export type TaskFamilyDescriptor = TaskFamilyDefinition

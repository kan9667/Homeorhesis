/**
 * Local model portfolio manifest contract (§9.2).
 * Defines the portfolio of qualified local models and their role assignments.
 * @module @deepseek-ai/dsh-seh-contracts/portfolio
 */

import type { ModelRouteRef } from './model-route.js'

/**
 * Portfolio entry representing a qualified model configuration (§9.2).
 */
export interface LocalModelPortfolioEntry {
  readonly entryId: string
  readonly runtimeProfileId: string
  readonly route: ModelRouteRef
  readonly roleIds: readonly string[]
  readonly qualificationIds: readonly string[]
  readonly allowedSteeringProfileIds: readonly string[]
  readonly adapterDigest?: string
  readonly enabled: boolean
  readonly priorityClass: 'primary' | 'specialist' | 'fallback' | 'research'
}

/**
 * Local model portfolio manifest contract (§9.2).
 */
export interface LocalModelPortfolioManifest {
  readonly schemaVersion: 1
  readonly portfolioId: string
  readonly entries: readonly LocalModelPortfolioEntry[]
  readonly defaultResidentEntryId?: string
  readonly maxConcurrentGpuModels: 1
  readonly switchPolicyDigest: string
  readonly taskFamilyRegistryDigest: string
  readonly schedulerVersion: string
  readonly contentHash: string
}

/** Alias for portfolio manifest */
export type LocalPortfolioDescriptor = LocalModelPortfolioManifest

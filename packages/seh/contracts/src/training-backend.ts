/**
 * Training backend reference and service interfaces (§15.10).
 * Decouples training backends (Unsloth, Transformers/PEFT) from the SEH control process.
 * @module @deepseek-ai/dsh-seh-contracts/training-backend
 */

import type { ArtifactRef } from './evidence-ref.js'
import type { TrainingRunSpec } from './training-run-spec.js'

/**
 * Immutable reference to an approved training backend (§15.10).
 */
export interface TrainingBackendRef {
  readonly schemaVersion: 1
  readonly backendId: string
  readonly backendVersion: string
  readonly sourceRevision: string
  readonly environmentDigest: string
  readonly capabilityIds: readonly string[]
  readonly licenseRecordId: string
  readonly contentHash: string
}

/**
 * Validation result for a training run specification.
 */
export interface TrainingValidation {
  readonly valid: boolean
  readonly errors: readonly string[]
}

/**
 * Resource estimation for a training run.
 */
export interface ResourceEstimate {
  readonly estimatedVramMiB: number
  readonly estimatedTimeSeconds: number
}

/**
 * Handle to an active training run.
 */
export interface TrainingRunHandle {
  readonly runId: string
}

/**
 * Inspection status for a training run.
 */
export interface TrainingStatus {
  readonly state: 'pending' | 'running' | 'paused' | 'completed' | 'failed'
  readonly progress?: number
  readonly metrics?: Record<string, number>
}

/**
 * Service provider interface for supervised training backends (§15.10).
 */
export interface TrainingBackend {
  validate(spec: TrainingRunSpec): Promise<TrainingValidation>
  estimate(spec: TrainingRunSpec): Promise<ResourceEstimate>
  start(spec: TrainingRunSpec): Promise<TrainingRunHandle>
  checkpoint(runId: string): Promise<ArtifactRef>
  pause(runId: string): Promise<void>
  resume(runId: string): Promise<void>
  cancel(runId: string): Promise<void>
  inspect(runId: string): Promise<TrainingStatus>
  export(runId: string, format: string): Promise<readonly ArtifactRef[]>
}

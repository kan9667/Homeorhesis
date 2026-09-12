/**
 * Supervised training run specification contract (§15.9, §15.10).
 * Defines immutable specifications for adapter training and fine-tuning.
 * @module @deepseek-ai/dsh-seh-contracts/training-run-spec
 */

import type { ArtifactRef } from './evidence-ref.js'
import type { TrainingBackendRef } from './training-backend.js'

/**
 * Immutable training run specification (§15.9, §15.10).
 */
export interface TrainingRunSpec {
  readonly schemaVersion: 1
  readonly trainingRunId: string
  readonly backend: TrainingBackendRef
  readonly datasetManifestId: string
  readonly baseModelArtifactRef: ArtifactRef
  readonly tokenizerDigest: string
  readonly chatTemplateDigest: string
  readonly targetRole: string
  readonly targetTaskFamilies: readonly string[]
  readonly method: 'lora' | 'qlora' | 'dpo' | 'other-reviewed'
  readonly trainingConfigRef: ArtifactRef
  readonly resourceBudgetRef: string
  readonly checkpointPolicyRef: string
  readonly outputCandidateRootRef: string
  readonly policyVersion: string
  readonly contentHash: string
}

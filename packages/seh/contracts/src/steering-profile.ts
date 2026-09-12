/**
 * Tool-use representation steering profile and qualification (§7.12, §7.13).
 * Steering vectors calibrate tool propensity without granting or widening tool authority.
 * @module @deepseek-ai/dsh-seh-contracts/steering-profile
 */

import type { ArtifactRef, EvidenceRef } from './evidence-ref.js'
import type { TaskFamilyQualification } from './task-family.js'

/**
 * Representation-steering profile contract (§7.12).
 */
export interface ToolUseSteeringProfile {
  readonly schemaVersion: 1
  readonly steeringProfileId: string
  readonly baseRuntimeProfileId: string

  readonly modelArtifactDigest: string
  readonly adapterDigest?: string
  readonly quantization: string
  readonly inferenceEngine: string
  readonly inferenceEngineVersion: string
  readonly engineConfigDigest: string
  readonly tokenizerDigest: string
  readonly chatTemplateDigest: string
  readonly toolParserDigest?: string
  readonly promptBundleDigest: string
  readonly toolBundleDigest: string

  readonly extractionDatasetDigest: string
  readonly extractionSplitDigest: string
  readonly extractionMethod: 'difference-of-means' | string
  readonly propensityReadout: {
    readonly kind: 'tool-opener-token' | 'contrastive-route' | string
    readonly tokenId?: number
    readonly directRouteId?: string
    readonly toolRouteId?: string
  }

  readonly vectorArtifactDigest: string
  readonly layerStart: number
  readonly layerEnd: number
  readonly createdBy: string
  readonly evidenceRefs: readonly EvidenceRef[]
  readonly createdAt: string
  readonly contentHash: string
}

/**
 * Steering qualification record (§7.12).
 */
export interface SteeringQualification {
  readonly schemaVersion: 1
  readonly steeringQualificationId: string
  readonly steeringProfileId: string
  readonly baseRuntimeProfileId: string
  readonly harnessReleaseId: string
  readonly promptBundleDigest: string
  readonly toolBundleDigest: string
  readonly evaluatorBundleDigest: string
  readonly qualifiedAlphaMin: number
  readonly qualifiedAlphaMax: number
  readonly defaultAlpha: number
  readonly taskFamilyAlpha: Record<string, number>
  readonly taskFamilyResults: Record<string, TaskFamilyQualification>
  readonly requiredToolRecall?: number
  readonly unnecessaryToolCallRate?: number
  readonly malformedToolCallRate?: number
  readonly unknownToolNameRate?: number
  readonly nonToolRegressionSummaryRef: ArtifactRef
  readonly status: 'shadow' | 'qualified' | 'restricted' | 'stale' | 'rejected' | 'retired'
  readonly evidenceRefs: readonly EvidenceRef[]
  readonly issuedAt: string
  readonly expiresAt?: string
  readonly contentHash: string
}

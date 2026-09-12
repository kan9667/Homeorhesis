/**
 * Model route identity and qualification contracts (§7.2, §7.5).
 * @module @deepseek-ai/dsh-seh-contracts/model-route
 */

import type { EvidenceRef } from './evidence-ref.js'
import type { RoleQualificationResult, TaskFamilyQualification } from './task-family.js'

/**
 * Route identity reference (§7.2).
 */
export interface ModelRouteRef {
  readonly schemaVersion: 1
  readonly providerId: string
  readonly modelId: string
  readonly locality: 'local' | 'remote'
  readonly providerConfigDigest: string
}

/**
 * Model qualification record (§7.5).
 */
export interface ModelQualification {
  readonly schemaVersion: 1
  readonly qualificationId: string
  readonly runtimeProfileId?: string
  readonly steeringProfileId?: string
  readonly route: ModelRouteRef
  readonly harnessReleaseId: string
  readonly promptBundleDigest: string
  readonly toolBundleDigest: string
  readonly evaluatorBundleDigest: string
  readonly roleResults: Record<string, RoleQualificationResult>
  readonly taskFamilyResults: Record<string, TaskFamilyQualification>
  readonly allowedToolIds: readonly string[]
  readonly deniedToolIds: readonly string[]
  readonly modalities: readonly ('text' | 'image' | 'audio')[]
  readonly measuredContextLimit?: number
  readonly structuredActionValidity?: number
  readonly toolSelectionAccuracy?: number
  readonly requiredToolRecall?: number
  readonly unnecessaryToolCallRate?: number
  readonly malformedToolCallRate?: number
  readonly unknownToolNameRate?: number
  readonly callsPerTask?: number
  readonly argumentAccuracy?: number
  readonly escalationQuality?: number
  readonly loopRate?: number
  readonly safetyVetoRate?: number
  readonly medianLatencyMs?: number
  readonly p95LatencyMs?: number
  readonly status:
    | 'unqualified'
    | 'shadow'
    | 'qualified'
    | 'restricted'
    | 'stale'
    | 'retired'
  readonly evidenceRefs: readonly EvidenceRef[]
  readonly issuedAt: string
  readonly expiresAt?: string
  readonly contentHash: string
}

/** Alias for model qualification */
export type RouteQualificationRecord = ModelQualification

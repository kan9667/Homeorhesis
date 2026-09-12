/**
 * Remote guard, export envelope, dispatch authorization, and budget contracts (§10.3, §10.6, §10.8, §10.9).
 * Final remote guard is deny-only and strictly prevents unsanctioned egress.
 * @module @deepseek-ai/dsh-seh-contracts/remote-guard
 */

import type { ArtifactRef, EvidenceRef } from './evidence-ref.js'
import type { ModelRouteRef } from './model-route.js'

/**
 * Sanitized export envelope for remote dispatch (§10.3).
 */
export interface ExportEnvelope {
  readonly schemaVersion: 1
  readonly exportId: string
  readonly taskId: string
  readonly parentEpisodeId?: string
  readonly childEpisodeId: string
  readonly selectedRoute: ModelRouteRef
  readonly dataClass: 'public' | 'internal' | 'confidential'
  readonly sourceEvidenceRefs: readonly EvidenceRef[]
  readonly sanitizedArtifactRefs: readonly ArtifactRef[]
  readonly sanitizedMessageDigest: string
  readonly includedPathPatterns: readonly string[]
  readonly excludedReasonCodes: readonly string[]
  readonly redactionPolicyVersion: string
  readonly secretScanDigest: string
  readonly createdBy: string
  readonly createdAt: string
  readonly contentHash: string
}

/** Alias for export envelope */
export type RemoteExportEnvelope = ExportEnvelope

/**
 * Single-use authorization for remote dispatch (§10.6).
 */
export interface RemoteDispatchAuthorization {
  readonly schemaVersion: 1
  readonly authorizationId: string
  readonly taskId: string
  readonly episodeId: string
  readonly dshSessionId: string
  readonly route: ModelRouteRef
  readonly qualificationId: string
  readonly exportId: string
  readonly toolGrantId: string
  readonly reservationId: string
  readonly requestHeaderEvidenceRef: EvidenceRef
  readonly dispatchEnvelopeDigest: string
  readonly policyVersion: string
  readonly authorizedBy: string
  readonly authorizedAt: string
  readonly expiresAt: string
  readonly contentHash: string
}

/**
 * Budget limits for remote invocations (§10.8).
 */
export interface RemoteBudget {
  readonly maxPerCallUsd?: number
  readonly maxPerEpisodeUsd?: number
  readonly maxPerTaskUsd?: number
  readonly maxPerRollingDayUsd?: number
  readonly maxPerRollingMonthUsd?: number
  readonly maxRemoteCallsPerEpisode?: number
  readonly maxRemoteChildEpisodesPerTask?: number
  readonly maxInputTokensPerCall?: number
  readonly maxOutputTokensPerCall?: number
  readonly maxReasoningTokensPerCall?: number
}

/**
 * Spend reservation for remote execution (§10.9).
 */
export interface RemoteSpendReservation {
  readonly schemaVersion: 1
  readonly reservationId: string
  readonly taskId: string
  readonly episodeId: string
  readonly route: ModelRouteRef
  readonly priceRecordId: string
  readonly estimatedInputTokens: number
  readonly reservedOutputTokens: number
  readonly reservedUsd: number
  readonly status: 'reserved' | 'settled' | 'released' | 'expired' | 'disputed'
  readonly createdAt: string
  readonly expiresAt: string
  readonly settledUsageRef?: EvidenceRef
  readonly actualUsd?: number
  readonly contentHash: string
}

/**
 * Deny-only decision produced by final remote guard (§10.4, §10.5).
 */
export interface RemoteGuardDecision {
  readonly schemaVersion: 1
  readonly decision: 'allow' | 'deny'
  readonly reasonCodes: readonly string[]
  readonly authorizationId?: string
  readonly decidedAt: string
}

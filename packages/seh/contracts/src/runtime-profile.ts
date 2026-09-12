/**
 * Local runtime profile contract (§7.3, line 889).
 * Defines exact engine, quantization, and hardware measurements for a local model route.
 * @module @deepseek-ai/dsh-seh-contracts/runtime-profile
 */

import type { ModelRouteRef } from './model-route.js'

/**
 * Pinned local runtime profile contract (§7.3).
 */
export interface LocalRuntimeProfile {
  readonly schemaVersion: 1
  readonly runtimeProfileId: string
  readonly route: ModelRouteRef
  readonly modelArtifactDigest: string
  readonly modelSourceRef: string
  readonly licenseRecordId: string
  readonly quantization: string
  readonly inferenceEngine: string
  readonly inferenceEngineVersion: string
  readonly engineConfigDigest: string
  readonly chatTemplateDigest: string
  readonly toolParserDigest?: string
  readonly tokenizerDigest: string
  readonly configuredContextTokens: number
  readonly measuredSafeContextTokens: number
  readonly configuredMaxOutputTokens: number
  readonly gpuLayerPolicy?: string
  readonly cachePolicyDigest: string
  readonly samplingProfileDigest: string
  readonly measuredPeakVramMiB: number
  readonly measuredResidualVramMiB?: number
  readonly coldLoadP50Ms?: number
  readonly coldLoadP95Ms?: number
  readonly unloadP50Ms?: number
  readonly unloadP95Ms?: number
  readonly firstTokenP50Ms?: number
  readonly firstTokenP95Ms?: number
  readonly outputTokensPerSecond?: number
  readonly qualificationId?: string
  readonly contentHash: string
}

/** Alias for runtime profile */
export type RuntimeProfile = LocalRuntimeProfile

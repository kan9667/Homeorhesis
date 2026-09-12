/**
 * Local execution profile reference contract (§7.13, line 1147).
 * Binds an exact runtime profile, steering profile, and alpha setting for local inference.
 * @module @deepseek-ai/dsh-seh-contracts/execution-profile
 */

import type { RuntimeProfileId, SteeringProfileId, SteeringQualificationId } from './brand.js'

/**
 * Pinned execution profile reference for local model episodes (§7.13).
 */
export interface LocalExecutionProfileRef {
  readonly schemaVersion: 1
  readonly runtimeProfileId: RuntimeProfileId | string
  readonly steeringProfileId?: SteeringProfileId | string
  readonly steeringQualificationId?: SteeringQualificationId | string
  readonly steeringAlpha?: number
  readonly effectiveConfigDigest: string
}

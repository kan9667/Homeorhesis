/**
 * Pre-inference ToolGrantManifest calculation contract (§10.11, §11.1).
 * Calculated deterministically prior to inference; steering can never widen granted tools.
 * @module @deepseek-ai/dsh-seh-contracts/tool-grant
 */

import type { ModelRouteRef } from './model-route.js'

/**
 * Specification of allowed and denied tools for an episode (§10.11).
 */
export interface ToolGrantManifest {
  readonly schemaVersion: 1
  readonly toolGrantId: string
  readonly taskId: string
  readonly subtaskId?: string
  readonly episodeId: string
  readonly route: ModelRouteRef
  readonly runtimeProfileId?: string
  readonly qualificationId: string
  readonly allowedTools: readonly {
    readonly toolId: string
    readonly capabilityDigest: string
    readonly approvalPolicy: string
  }[]
  readonly deniedTools: readonly {
    readonly toolId: string
    readonly reasonCodes: readonly string[]
  }[]
  readonly createdAt: string
  readonly contentHash: string
}

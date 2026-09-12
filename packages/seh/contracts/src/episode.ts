/**
 * Episode contract (§8.6).
 * Represents a single bounded model or tool execution attempt under exact pinned configuration.
 * @module @deepseek-ai/dsh-seh-contracts/episode
 */

import type { EpisodeId, SubtaskId, TaskId } from './brand.js'
import type { LocalExecutionProfileRef } from './execution-profile.js'
import type { ModelRouteRef } from './model-route.js'

/**
 * Pinned execution episode (§8.6).
 */
export interface Episode {
  readonly schemaVersion: 1
  readonly episodeId: EpisodeId | string
  readonly taskId: TaskId | string
  readonly subtaskId?: SubtaskId | string
  readonly parentEpisodeId?: EpisodeId | string
  readonly dshSessionId: string
  readonly route: ModelRouteRef
  readonly localExecutionProfile?: LocalExecutionProfileRef
  readonly modelQualificationId?: string
  readonly steeringQualificationId?: string
  readonly toolGrantId: string
  readonly residencyLeaseId?: string
  readonly remoteReservationId?: string
  readonly verifierPlanRef?: string
  readonly state: 'created' | 'active' | 'suspended' | 'completed' | 'failed' | 'escalated'
  readonly startedAt: string
  readonly endedAt?: string
  readonly policyVersion: string
  readonly contentHash: string
}

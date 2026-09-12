/**
 * Canonical SEH control event envelope and event-type catalog (§12.3, §12.4).
 * @module @deepseek-ai/dsh-seh-contracts/control-event
 */

import type { ActorId, ControlEventId, EpisodeId, SubtaskId, TaskId } from './brand.js'
import type { ArtifactRef, EvidenceRef } from './evidence-ref.js'

/**
 * Closed union of all canonical SEH control event types (§12.3).
 */
export type CanonicalControlEventType =
  // Task lifecycle
  | 'task/submitted'
  | 'task/classified'
  | 'task/admitted'
  | 'task/rejected'
  | 'task/decomposition-created'
  | 'subtask/created'
  | 'subtask/dependency-resolved'
  // Routing & Episode
  | 'routing/requirements-derived'
  | 'routing/decided'
  | 'episode/created'
  | 'episode/suspended'
  | 'episode/escalation-requested'
  | 'episode/ended'
  | 'handoff/created'
  // Local Model & Residency
  | 'local-model/portfolio-activated'
  | 'local-model/switch-decided'
  | 'local-model/load-requested'
  | 'local-model/loaded'
  | 'local-model/health-passed'
  | 'local-model/health-failed'
  | 'local-model/lease-granted'
  | 'local-model/lease-released'
  | 'local-model/drain-started'
  | 'local-model/unload-requested'
  | 'local-model/unloaded'
  | 'local-model/vram-release-failed'
  | 'local-model/profile-quarantined'
  // Budget & Remote Guard
  | 'budget/reserved'
  | 'budget/settled'
  | 'budget/exhausted'
  | 'export/prepared'
  | 'remote/dispatch-authorized'
  | 'remote/dispatch-denied'
  // Qualification
  | 'qualification/run-started'
  | 'qualification/completed'
  | 'qualification/status-changed'
  | 'qualification/expired'
  // Representation Steering
  | 'steering/extraction-started'
  | 'steering/vector-produced'
  | 'steering/extraction-validated'
  | 'steering/qualification-started'
  | 'steering/qualification-completed'
  | 'steering/profile-selected'
  | 'steering/profile-applied'
  | 'steering/profile-rejected'
  | 'steering/malformed-call-detected'
  // Evolution
  | 'evolution/run-started'
  | 'evolution/candidate-proposed'
  | 'evolution/policy-validated'
  | 'evolution/candidate-frozen'
  | 'evolution/candidate-rejected'
  | 'evolution/candidate-quarantined'
  // Evaluation, Gate & Release
  | 'evaluation/started'
  | 'evaluation/completed'
  | 'gate/decision-recorded'
  | 'release/activation-started'
  | 'release/activated'
  | 'release/rolled-back'
  // Training
  | 'model/dataset-sealed'
  | 'training/backend-validated'
  | 'training/resource-estimated'
  | 'training/job-approved'
  | 'training/gpu-lease-acquired'
  | 'model/training-started'
  | 'model/checkpoint-produced'
  | 'training/run-paused'
  | 'training/run-resumed'
  | 'training/run-failed'
  | 'training/run-completed'
  | 'training/adapter-produced'
  | 'training/export-produced'
  | 'training/gpu-lease-released'
  | 'training/candidate-quarantined'
  | 'model/candidate-evaluated'
  // Cognitive Memory & System
  | 'memory/patch-proposed'
  | 'memory/patch-reviewed'
  | 'system/paused'
  | 'system/resumed'

/**
 * Runtime catalog of all canonical event types for exhaustiveness and validation.
 */
export const CANONICAL_CONTROL_EVENT_TYPES: readonly CanonicalControlEventType[] = [
  'task/submitted',
  'task/classified',
  'task/admitted',
  'task/rejected',
  'task/decomposition-created',
  'subtask/created',
  'subtask/dependency-resolved',
  'routing/requirements-derived',
  'routing/decided',
  'episode/created',
  'episode/suspended',
  'episode/escalation-requested',
  'episode/ended',
  'handoff/created',
  'local-model/portfolio-activated',
  'local-model/switch-decided',
  'local-model/load-requested',
  'local-model/loaded',
  'local-model/health-passed',
  'local-model/health-failed',
  'local-model/lease-granted',
  'local-model/lease-released',
  'local-model/drain-started',
  'local-model/unload-requested',
  'local-model/unloaded',
  'local-model/vram-release-failed',
  'local-model/profile-quarantined',
  'budget/reserved',
  'budget/settled',
  'budget/exhausted',
  'export/prepared',
  'remote/dispatch-authorized',
  'remote/dispatch-denied',
  'qualification/run-started',
  'qualification/completed',
  'qualification/status-changed',
  'qualification/expired',
  'steering/extraction-started',
  'steering/vector-produced',
  'steering/extraction-validated',
  'steering/qualification-started',
  'steering/qualification-completed',
  'steering/profile-selected',
  'steering/profile-applied',
  'steering/profile-rejected',
  'steering/malformed-call-detected',
  'evolution/run-started',
  'evolution/candidate-proposed',
  'evolution/policy-validated',
  'evolution/candidate-frozen',
  'evolution/candidate-rejected',
  'evolution/candidate-quarantined',
  'evaluation/started',
  'evaluation/completed',
  'gate/decision-recorded',
  'release/activation-started',
  'release/activated',
  'release/rolled-back',
  'model/dataset-sealed',
  'training/backend-validated',
  'training/resource-estimated',
  'training/job-approved',
  'training/gpu-lease-acquired',
  'model/training-started',
  'model/checkpoint-produced',
  'training/run-paused',
  'training/run-resumed',
  'training/run-failed',
  'training/run-completed',
  'training/adapter-produced',
  'training/export-produced',
  'training/gpu-lease-released',
  'training/candidate-quarantined',
  'model/candidate-evaluated',
  'memory/patch-proposed',
  'memory/patch-reviewed',
  'system/paused',
  'system/resumed',
] as const

/**
 * Generic canonical SEH control event envelope (§12.4).
 */
export interface SEHControlEvent<T = unknown> {
  readonly schemaVersion: 1
  readonly eventId: ControlEventId
  readonly eventType: CanonicalControlEventType
  readonly occurredAt: string // ISO 8601 UTC
  readonly recordedAt: string // ISO 8601 UTC
  readonly actorId: ActorId
  readonly actorRole: string
  readonly taskId?: TaskId
  readonly subtaskId?: SubtaskId
  readonly episodeId?: EpisodeId
  readonly candidateId?: string
  readonly rolloutId?: string
  readonly correlationId: string
  readonly sequence: number
  readonly payload: T
  readonly evidenceRefs: readonly EvidenceRef[]
  readonly artifactRefs: readonly ArtifactRef[]
  readonly policyVersion: string
  readonly contentHash: string // SHA-256 digest
}

/**
 * Durable entry in the SEH control ledger (§12.1).
 */
export interface SEHControlLedgerEntry<T = unknown> {
  readonly schemaVersion: 1
  readonly sequenceNumber: number
  readonly event: SEHControlEvent<T>
  readonly previousEntryHash: string // SHA-256 hash chaining
  readonly entryHash: string
}

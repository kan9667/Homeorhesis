/**
 * Specialist handoff contract (§8.7, line 1407).
 * Encapsulates structured state transferred between specialist episodes.
 * @module @deepseek-ai/dsh-seh-contracts/handoff
 */

import type { ArtifactRef, EvidenceRef } from './evidence-ref.js'

/**
 * Structured state transferred between episodes during specialist handoff (§8.7).
 */
export interface SpecialistHandoff {
  readonly schemaVersion: 1
  readonly handoffId: string
  readonly taskId: string
  readonly sourceEpisodeId: string
  readonly targetSubtaskId: string
  readonly objective: string
  readonly completedSubgoals: readonly string[]
  readonly unresolvedQuestions: readonly string[]
  readonly verifiedFacts: readonly {
    readonly statement: string
    readonly evidenceRefs: readonly EvidenceRef[]
  }[]
  readonly evidenceRefs: readonly EvidenceRef[]
  readonly artifactRefs: readonly ArtifactRef[]
  readonly verifierStateRef?: ArtifactRef
  readonly constraints: readonly string[]
  readonly prohibitedActions: readonly string[]
  readonly permittedDataClass: string
  readonly createdAt: string
  readonly contentHash: string
}

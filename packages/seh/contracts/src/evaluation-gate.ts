/**
 * Evaluation results and gate decision contracts (§17.14, §19.4).
 * Enforces independent evaluation and gate decisions with hard veto authority.
 * @module @deepseek-ai/dsh-seh-contracts/evaluation-gate
 */

import type { EvidenceRef } from './evidence-ref.js'

/**
 * Cost summary for an evaluation run (§17.14).
 */
export interface CostSummary {
  readonly wallTimeMs: number
  readonly gpuTimeMs?: number
  readonly totalTokens?: number
  readonly estimatedUsd?: number
}

/**
 * Evaluation result record (§17.14).
 */
export interface EvaluationResult {
  readonly schemaVersion: 1
  readonly evaluationId: string
  readonly subjectType:
    | 'harness'
    | 'model'
    | 'runtime-profile'
    | 'portfolio'
    | 'routing-policy'
    | 'scheduler-policy'
    | 'release'
    | 'blueprint'
  readonly subjectId: string
  readonly baselineSubjectId?: string
  readonly evaluatorBundleDigest: string
  readonly datasetSplitRef: string
  readonly seeds: readonly number[]
  readonly scores: Record<string, number>
  readonly confidenceIntervals: Record<string, readonly [number, number]>
  readonly hardVetoes: readonly { readonly code: string; readonly evidence: readonly EvidenceRef[] }[]
  readonly regressions: readonly { readonly metric: string; readonly baseline: number; readonly candidate: number }[]
  readonly cost: CostSummary
  readonly matchedBudgetBaselineId?: string
  readonly evidenceRefs: readonly EvidenceRef[]
  readonly evaluatorIdentity: string
  readonly completedAt: string
  readonly contentHash: string
}

/** Alias for evaluation result */
export type EvaluationReport = EvaluationResult

/**
 * Independent gate decision record (§19.4).
 */
export interface GateDecision {
  readonly schemaVersion: 1
  readonly gateDecisionId: string
  readonly subjectType: string
  readonly subjectId: string
  readonly subjectContentHash: string
  readonly baselineId?: string
  readonly outcome: 'accepted' | 'rejected' | 'quarantined'
  readonly hardVetoes: readonly string[]
  readonly reasonCodes: readonly string[]
  readonly requiredEvaluationIds: readonly string[]
  readonly approvalIds: readonly string[]
  readonly rollbackTarget?: string
  readonly gatePolicyDigest: string
  readonly decidedBy: string
  readonly decidedAt: string
  readonly contentHash: string
}

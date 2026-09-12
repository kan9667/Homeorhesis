/**
 * Release manifest contract (§20.2, line 3777).
 * Atomically binds tested configurations, digests, and rollback targets.
 * @module @deepseek-ai/dsh-seh-contracts/release
 */

import type { EvidenceRef } from './evidence-ref.js'

/**
 * Immutable release manifest contract (§20.2).
 */
export interface ReleaseManifest {
  readonly schemaVersion: 1
  readonly releaseId: string
  readonly dshUpstreamCommit: string
  readonly dshPackageVersion: string
  readonly dependencyLockDigest: string
  readonly sehHarnessVersion: string
  readonly promptBundleDigest: string
  readonly toolBundleDigest: string
  readonly taskFamilyRegistryDigest: string
  readonly decompositionPolicyDigest: string
  readonly routerPolicyDigest: string
  readonly localPortfolioDigest: string
  readonly localSchedulerPolicyDigest: string
  readonly localRuntimeManagerDigest: string
  readonly qualificationSnapshotDigest: string
  readonly gcaPolicyDigest: string
  readonly remoteGuardDigest: string
  readonly remotePriceRegistryDigest: string
  readonly memorySchemaVersion: string
  readonly memoryPolicyDigest: string
  readonly sandboxPolicyDigest: string
  readonly networkPolicyDigest: string
  readonly evaluatorBundleDigest: string
  readonly representationSteeringBundleDigest?: string
  readonly toolUseCalibrationPolicyDigest?: string
  readonly trainingBackendRegistryDigest: string
  readonly trainingProvenanceRefs: readonly EvidenceRef[]
  readonly requiredEvaluationIds: readonly string[]
  readonly gateDecisionId: string
  readonly approvalIds: readonly string[]
  readonly rollbackTarget: string
  readonly createdAt: string
  readonly contentHash: string
}

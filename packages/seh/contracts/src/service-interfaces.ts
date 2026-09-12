/**
 * Complete 20-service Cordis interface declarations and Context module augmentation (§24.4).
 * All 20 services are declared as type-only interfaces; zero runtime implementations are mounted in Phase 0.
 * @module @deepseek-ai/dsh-seh-contracts/service-interfaces
 */

import type { RuntimeProfileId, SteeringProfileId, TaskId } from './brand.js'
import type { CapabilityRequirements } from './capability.js'
import type { SEHControlEvent } from './control-event.js'
import type { Episode } from './episode.js'
import type { EvaluationReport, GateDecision } from './evaluation-gate.js'
import type { SpecialistHandoff } from './handoff.js'
import type { KillSwitchQuery, KillSwitchState } from './kill-switch.js'
import type { ModelQualification, ModelRouteRef } from './model-route.js'
import type { LocalModelPortfolioManifest } from './portfolio.js'
import type { ReleaseManifest } from './release.js'
import type { ResidencyLease, ResidencySwitchDecision } from './residency.js'
import type { RuntimeProfile } from './runtime-profile.js'
import type { ToolUseSteeringProfile } from './steering-profile.js'
import type { TaskFamilyDefinition } from './task-family.js'
import type { ToolGrantManifest } from './tool-grant.js'
import type { TrainingBackendRef } from './training-backend.js'

// --- Phase 0 Active Service Interfaces ---

export interface SehPolicyService {
  isFeatureEnabled(featureName: string): boolean
  getKillSwitches(query?: KillSwitchQuery): readonly KillSwitchState[]
}

export interface SehTaskService {
  getEpisode(taskId: TaskId): Promise<Episode | undefined>
  getHandoff(handoffId: string): Promise<SpecialistHandoff | undefined>
}

export interface SehTaskTaxonomyService {
  getTaskFamily(name: string): TaskFamilyDefinition | undefined
  listTaskFamilies(): readonly TaskFamilyDefinition[]
}

export interface SehDecompositionService {
  deriveRequirements(taskDescription: string): CapabilityRequirements
}

export interface SehQualificationService {
  getRouteQualification(route: ModelRouteRef): Promise<ModelQualification | undefined>
  getRuntimeProfile(profileId: RuntimeProfileId): Promise<RuntimeProfile | undefined>
}

export interface SehSteeringService {
  getSteeringProfile(steeringProfileId: SteeringProfileId): Promise<ToolUseSteeringProfile | undefined>
  computeToolGrant(episode: Episode): ToolGrantManifest
}

export interface SehRouterService {
  resolveRoute(requirements: CapabilityRequirements): Promise<ModelRouteRef | undefined>
}

export interface SehPortfolioService {
  getActivePortfolio(): Promise<LocalModelPortfolioManifest | undefined>
}

export interface SehResidencyService {
  getCurrentLease(): Promise<ResidencyLease | undefined>
  evaluateSwitch(targetProfileId: RuntimeProfileId): Promise<ResidencySwitchDecision>
}

export interface SehLocalRuntimeService {
  isRuntimeLoaded(profileId: RuntimeProfileId): Promise<boolean>
}

export interface SehBudgetService {
  hasAvailableReservation(reservationRef: string): Promise<boolean>
}

export interface SehControlEvidenceService {
  recordControlEvent<T>(event: SEHControlEvent<T>): Promise<void>
  getControlEvent(eventId: string): Promise<SEHControlEvent | undefined>
}

export interface SehEvaluationService {
  getEvaluationReport(evaluationId: string): Promise<EvaluationReport | undefined>
}

export interface SehGateService {
  getGateDecision(decisionId: string): Promise<GateDecision | undefined>
}

export interface SehTrainingBackendRegistryService {
  getBackend(backendId: string): Promise<TrainingBackendRef | undefined>
}

export interface SehReleaseService {
  getActiveRelease(): Promise<ReleaseManifest | undefined>
}

// --- Deferred Service Interfaces (Stubs for Phase 3, 5, 7) ---

/** Deferred to Phase 3: Cognitive memory hierarchy. */
export interface SehMemoryService {
  readonly phase: 3
}

/** Deferred to Phase 5: Harness evolution, proposal and search only. */
export interface SehEvolutionService {
  readonly phase: 5
}

/** Deferred to Phase 7: Training dataset curation. */
export interface SehDatasetService {
  readonly phase: 7
}

/** Deferred to Phase 7: Supervised training coordinator. */
export interface SehTrainingCoordinatorService {
  readonly phase: 7
}

// --- Cordis Context Declaration Merging (§24.4) ---

declare module '@deepseek-ai/cordis' {
  interface Context {
    sehPolicy: SehPolicyService
    sehTasks: SehTaskService
    sehTaskTaxonomy: SehTaskTaxonomyService
    sehDecomposition: SehDecompositionService
    sehQualification: SehQualificationService
    sehSteering: SehSteeringService
    sehRouter: SehRouterService
    sehPortfolio: SehPortfolioService
    sehResidency: SehResidencyService
    sehLocalRuntime: SehLocalRuntimeService
    sehBudget: SehBudgetService
    sehControlEvidence: SehControlEvidenceService
    sehMemory: SehMemoryService
    sehEvolution: SehEvolutionService
    sehEvaluation: SehEvaluationService
    sehGate: SehGateService
    sehDataset: SehDatasetService
    sehTraining: SehTrainingCoordinatorService
    sehTrainingBackends: SehTrainingBackendRegistryService
    sehRelease: SehReleaseService
  }
}

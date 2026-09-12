/**
 * Branded nominal type identifiers for SEH domain models (§4.1).
 * Zero runtime overhead, guaranteed type safety at boundary interfaces.
 * @module @deepseek-ai/dsh-seh-contracts/brand
 */

import type { Branded } from '@deepseek-ai/dsh-brand'

export type TaskId = Branded<'TaskId'>
export const asTaskId = (id: string): TaskId => id as TaskId

export type SubtaskId = Branded<'SubtaskId'>
export const asSubtaskId = (id: string): SubtaskId => id as SubtaskId

export type EpisodeId = Branded<'EpisodeId'>
export const asEpisodeId = (id: string): EpisodeId => id as EpisodeId

export type LeaseId = Branded<'LeaseId'>
export const asLeaseId = (id: string): LeaseId => id as LeaseId

export type RuntimeProfileId = Branded<'RuntimeProfileId'>
export const asRuntimeProfileId = (id: string): RuntimeProfileId => id as RuntimeProfileId

export type SteeringProfileId = Branded<'SteeringProfileId'>
export const asSteeringProfileId = (id: string): SteeringProfileId => id as SteeringProfileId

export type SteeringQualificationId = Branded<'SteeringQualificationId'>
export const asSteeringQualificationId = (id: string): SteeringQualificationId => id as SteeringQualificationId

export type TrainingBackendId = Branded<'TrainingBackendId'>
export const asTrainingBackendId = (id: string): TrainingBackendId => id as TrainingBackendId

export type ActorId = Branded<'ActorId'>
export const asActorId = (id: string): ActorId => id as ActorId

export type ControlEventId = Branded<'ControlEventId'>
export const asControlEventId = (id: string): ControlEventId => id as ControlEventId

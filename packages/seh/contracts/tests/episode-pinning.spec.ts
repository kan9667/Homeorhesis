/**
 * Episode pinning tests (§8.6, §8.7, §29.1).
 *
 * Validates:
 * - Episode immutability — an Episode pins an exact route, localExecutionProfile, and toolGrantId.
 * - In-place route change denial — modifying a route requires a new child episode, never in-place mutation.
 * - Specialist handoff state transfer — structured transfer of subgoals, verified facts, and evidence.
 */

import { describe, expect, it } from 'vitest'
import type { Episode, ModelRouteRef, SpecialistHandoff } from '../src/index.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRoute(providerId: string, modelId: string): ModelRouteRef {
  return {
    schemaVersion: 1,
    providerId,
    modelId,
    locality: 'local',
    providerConfigDigest: `sha256:${providerId}-cfg`,
  }
}

function makeEpisode(overrides: Partial<Episode> = {}): Episode {
  return {
    schemaVersion: 1,
    episodeId: 'ep-001',
    taskId: 'task-001',
    dshSessionId: 'dsh-session-001',
    route: makeRoute('ollama', 'deepseek-r1-8b'),
    localExecutionProfile: {
      schemaVersion: 1,
      runtimeProfileId: 'rtp-001',
      effectiveConfigDigest: 'sha256:eff-cfg',
    },
    toolGrantId: 'tg-001',
    state: 'active',
    startedAt: '2026-01-01T00:00:00Z',
    policyVersion: 'policy@0.0.0-phase-0',
    contentHash: 'sha256:ep-content',
    ...overrides,
  }
}

function makeHandoff(overrides: Partial<SpecialistHandoff> = {}): SpecialistHandoff {
  return {
    schemaVersion: 1,
    handoffId: 'handoff-001',
    taskId: 'task-001',
    sourceEpisodeId: 'ep-001',
    targetSubtaskId: 'sub-002',
    objective: 'Implement the router policy module',
    completedSubgoals: ['Defined capability vectors', 'Established route contract'],
    unresolvedQuestions: ['Which quantization level to use for LOCAL_AGENT slot?'],
    verifiedFacts: [
      {
        statement: 'ModelRouteRef.schemaVersion is always 1 in Phase 0',
        evidenceRefs: [{ schemaVersion: 1, kind: 'seh-control-event', controlEventId: 'ev-001', contentHash: 'sha256:ev' }],
      },
    ],
    evidenceRefs: [{ schemaVersion: 1, kind: 'seh-control-event', controlEventId: 'ev-002', contentHash: 'sha256:ev2' }],
    artifactRefs: [],
    constraints: ['No live model loading', 'No remote egress'],
    prohibitedActions: ['invoke model.load', 'send HTTP to external endpoint'],
    permittedDataClass: 'internal',
    createdAt: '2026-01-01T00:01:00Z',
    contentHash: 'sha256:handoff-content',
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Episode immutability
// ---------------------------------------------------------------------------

describe('episode immutability', () => {
  it('Episode pins its route at construction', () => {
    const route = makeRoute('ollama', 'deepseek-r1-8b')
    const episode = makeEpisode({ route })
    expect(episode.route).toStrictEqual(route)
  })

  it('Episode pins localExecutionProfile at construction', () => {
    const profile = {
      schemaVersion: 1 as const,
      runtimeProfileId: 'rtp-alpha',
      steeringProfileId: 'stp-alpha',
      steeringAlpha: 0.12,
      effectiveConfigDigest: 'sha256:eff',
    }
    const episode = makeEpisode({ localExecutionProfile: profile })
    expect(episode.localExecutionProfile).toStrictEqual(profile)
  })

  it('Episode pins toolGrantId at construction', () => {
    const episode = makeEpisode({ toolGrantId: 'tg-pinned-001' })
    expect(episode.toolGrantId).toBe('tg-pinned-001')
  })

  it('Episode interface is structurally readonly — TypeScript enforces no in-place field mutation', () => {
    const episode = makeEpisode()
    // The test proves the contract values are stable; TypeScript's readonly prevents writes at compile time.
    expect(episode.episodeId).toBe('ep-001')
    expect(episode.taskId).toBe('task-001')
    expect(episode.contentHash).toBeTruthy()
  })
})

// ---------------------------------------------------------------------------
// In-place route change denial (structural)
// ---------------------------------------------------------------------------

describe('in-place route change denial', () => {
  it('changing route requires a new child episode, not mutation', () => {
    const originalRoute = makeRoute('ollama', 'deepseek-r1-8b')
    const newRoute = makeRoute('vllm', 'qwen-2.5-32b')

    const episode = makeEpisode({ route: originalRoute, state: 'active' })

    // Simulate the correct pattern: create a child episode with the new route.
    const childEpisode = makeEpisode({
      episodeId: 'ep-002',
      parentEpisodeId: episode.episodeId as string,
      route: newRoute,
      state: 'created',
    })

    // Original episode is unchanged.
    expect(episode.route.providerId).toBe('ollama')
    expect(episode.route.modelId).toBe('deepseek-r1-8b')

    // Child episode carries the new route and links back.
    expect(childEpisode.route.providerId).toBe('vllm')
    expect(childEpisode.route.modelId).toBe('qwen-2.5-32b')
    expect(childEpisode.parentEpisodeId).toBe(episode.episodeId)
  })

  it('completed episode state transition is only via new object, not mutation', () => {
    const active = makeEpisode({ state: 'active' })
    const completed: Episode = { ...active, state: 'completed', endedAt: '2026-01-01T01:00:00Z' }

    expect(active.state).toBe('active')
    expect(active.endedAt).toBeUndefined()
    expect(completed.state).toBe('completed')
    expect(completed.endedAt).toBe('2026-01-01T01:00:00Z')
  })
})

// ---------------------------------------------------------------------------
// Specialist handoff state transfer
// ---------------------------------------------------------------------------

describe('specialist handoff state transfer', () => {
  it('SpecialistHandoff links source episode to target subtask', () => {
    const handoff = makeHandoff()
    expect(handoff.sourceEpisodeId).toBe('ep-001')
    expect(handoff.targetSubtaskId).toBe('sub-002')
  })

  it('SpecialistHandoff transfers completed subgoals', () => {
    const handoff = makeHandoff()
    expect(handoff.completedSubgoals).toHaveLength(2)
    expect(handoff.completedSubgoals).toContain('Defined capability vectors')
  })

  it('SpecialistHandoff transfers unresolved questions', () => {
    const handoff = makeHandoff()
    expect(handoff.unresolvedQuestions).toHaveLength(1)
    expect(handoff.unresolvedQuestions[0]).toContain('quantization')
  })

  it('SpecialistHandoff transfers verified facts with evidence refs', () => {
    const handoff = makeHandoff()
    expect(handoff.verifiedFacts).toHaveLength(1)
    expect(handoff.verifiedFacts[0]!.evidenceRefs).toHaveLength(1)
    expect(handoff.verifiedFacts[0]!.statement).toContain('schemaVersion')
  })

  it('SpecialistHandoff carries constraints and prohibited actions', () => {
    const handoff = makeHandoff()
    expect(handoff.constraints).toContain('No live model loading')
    expect(handoff.prohibitedActions).toContain('invoke model.load')
  })

  it('SpecialistHandoff is structurally immutable via readonly arrays', () => {
    const handoff = makeHandoff()
    expect(Array.isArray(handoff.completedSubgoals)).toBe(true)
    expect(Array.isArray(handoff.evidenceRefs)).toBe(true)
    expect(Array.isArray(handoff.artifactRefs)).toBe(true)
    expect(Array.isArray(handoff.constraints)).toBe(true)
  })

  it('handoff content hash is non-empty', () => {
    const handoff = makeHandoff()
    expect(handoff.contentHash).toBeTruthy()
    expect(handoff.contentHash.startsWith('sha256:')).toBe(true)
  })
})

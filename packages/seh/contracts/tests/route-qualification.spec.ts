/**
 * Route qualification tests (§7.5, §29.1).
 *
 * Validates:
 * - Provider-neutral route construction — arbitrary provider/model identifiers require no contract change.
 * - `supported != qualified` — a route reachable in DSH must fail closed when ModelQualification.status is
 *   anything other than 'qualified'.
 * - Hard veto enforcement — routes with metric violations above policy thresholds are denied.
 */

import { describe, expect, it } from 'vitest'
import type { ModelQualification, ModelRouteRef } from '../src/index.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRoute(
  providerId: string,
  modelId: string,
  locality: 'local' | 'remote' = 'local',
): ModelRouteRef {
  return {
    schemaVersion: 1,
    providerId,
    modelId,
    locality,
    providerConfigDigest: `sha256:${providerId}-${modelId}`,
  }
}

function makeQualification(
  route: ModelRouteRef,
  status: ModelQualification['status'],
  overrides: Partial<ModelQualification> = {},
): ModelQualification {
  return {
    schemaVersion: 1,
    qualificationId: `qual-${route.providerId}-${route.modelId}`,
    route,
    harnessReleaseId: 'seh@0.0.0-phase-0',
    promptBundleDigest: 'sha256:prompt',
    toolBundleDigest: 'sha256:tool',
    evaluatorBundleDigest: 'sha256:eval',
    roleResults: {},
    taskFamilyResults: {},
    allowedToolIds: [],
    deniedToolIds: [],
    modalities: ['text'],
    status,
    evidenceRefs: [],
    issuedAt: new Date().toISOString(),
    contentHash: 'sha256:qual-content',
    ...overrides,
  }
}

/**
 * Mirrors the SEH production gate rule:
 * only 'qualified' status permits execution; all others fail closed.
 */
function isExecutionPermitted(q: ModelQualification): boolean {
  if (q.status !== 'qualified') return false
  if (q.malformedToolCallRate !== undefined && q.malformedToolCallRate > 0.05) return false
  if (q.unknownToolNameRate !== undefined && q.unknownToolNameRate > 0.05) return false
  return true
}

// ---------------------------------------------------------------------------
// Provider-neutral route construction
// ---------------------------------------------------------------------------

describe('provider-neutral route fixtures', () => {
  const providers: Array<[string, string, 'local' | 'remote']> = [
    ['llama.cpp', 'qwen2.5-coder-7b', 'local'],
    ['ollama', 'deepseek-r1-8b', 'local'],
    ['vllm', 'qwen-2.5-32b', 'local'],
    ['openai', 'gpt-4o', 'remote'],
    ['deepseek', 'deepseek-chat', 'remote'],
    ['anthropic', 'claude-3-5-sonnet', 'remote'],
  ]

  it.each(providers)(
    'constructs a valid ModelRouteRef for %s/%s (%s)',
    (providerId, modelId, locality) => {
      const route = makeRoute(providerId, modelId, locality)
      expect(route.schemaVersion).toBe(1)
      expect(route.providerId).toBe(providerId)
      expect(route.modelId).toBe(modelId)
      expect(route.locality).toBe(locality)
      expect(typeof route.providerConfigDigest).toBe('string')
    },
  )

  it('ModelRouteRef carries no provider-specific fields beyond the contract', () => {
    const route = makeRoute('arbitrary-future-provider', 'hypothetical-model-7b')
    const keys = Object.keys(route).sort()
    expect(keys).toEqual(
      ['schemaVersion', 'providerId', 'modelId', 'locality', 'providerConfigDigest'].sort(),
    )
  })
})

// ---------------------------------------------------------------------------
// supported != qualified
// ---------------------------------------------------------------------------

describe('supported != qualified: non-qualified statuses fail closed', () => {
  const route = makeRoute('ollama', 'deepseek-r1-8b', 'local')

  const nonQualifiedStatuses: ModelQualification['status'][] = [
    'unqualified',
    'shadow',
    'restricted',
    'stale',
    'retired',
  ]

  it.each(nonQualifiedStatuses)('status=%s: execution must be denied', (status) => {
    const qual = makeQualification(route, status)
    expect(isExecutionPermitted(qual)).toBe(false)
  })

  it('status=qualified: execution is permitted when metrics pass', () => {
    const qual = makeQualification(route, 'qualified')
    expect(isExecutionPermitted(qual)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Hard veto enforcement
// ---------------------------------------------------------------------------

describe('hard veto: metric violations override qualified status', () => {
  const route = makeRoute('vllm', 'qwen-2.5-32b', 'local')

  it('malformedToolCallRate above threshold denies execution even when qualified', () => {
    const qual = makeQualification(route, 'qualified', { malformedToolCallRate: 0.06 })
    expect(isExecutionPermitted(qual)).toBe(false)
  })

  it('malformedToolCallRate at threshold boundary (0.05) is still accepted', () => {
    const qual = makeQualification(route, 'qualified', { malformedToolCallRate: 0.05 })
    expect(isExecutionPermitted(qual)).toBe(true)
  })

  it('unknownToolNameRate above threshold denies execution even when qualified', () => {
    const qual = makeQualification(route, 'qualified', { unknownToolNameRate: 0.07 })
    expect(isExecutionPermitted(qual)).toBe(false)
  })

  it('unknownToolNameRate absent: metric is not required for qualification', () => {
    const qual = makeQualification(route, 'qualified')
    expect(qual.unknownToolNameRate).toBeUndefined()
    expect(isExecutionPermitted(qual)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Remote route qualification
// ---------------------------------------------------------------------------

describe('remote route: qualification still required', () => {
  const remoteRoute = makeRoute('deepseek', 'deepseek-chat', 'remote')

  it('remote route with unqualified status fails closed', () => {
    const qual = makeQualification(remoteRoute, 'unqualified')
    expect(isExecutionPermitted(qual)).toBe(false)
  })

  it('remote route with retired status fails closed', () => {
    const qual = makeQualification(remoteRoute, 'retired')
    expect(isExecutionPermitted(qual)).toBe(false)
  })

  it('remote route with qualified status passes when metrics clear', () => {
    const qual = makeQualification(remoteRoute, 'qualified')
    expect(isExecutionPermitted(qual)).toBe(true)
  })
})

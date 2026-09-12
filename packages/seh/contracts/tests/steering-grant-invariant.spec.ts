import { describe, expect, it } from 'vitest'
import type { SteeringQualification } from '../src/steering-profile.js'
import type { ToolGrantManifest } from '../src/tool-grant.js'

function validateSteeringApplication(params: {
  manifest: ToolGrantManifest
  qualification: SteeringQualification
  alpha: number
  injectedTools?: string[]
}): { activeTools: string[]; alpha: number } {
  const { manifest, qualification, alpha, injectedTools } = params

  // 1. Status check
  if (qualification.status !== 'qualified' && qualification.status !== 'shadow') {
    throw new Error(`Steering policy violation: Profile status is '${qualification.status}', must be qualified or shadow (§7.13).`)
  }

  // 2. Alpha range validation
  if (alpha < qualification.qualifiedAlphaMin || alpha > qualification.qualifiedAlphaMax) {
    throw new Error(
      `Steering alpha ${alpha} out of qualified range [${qualification.qualifiedAlphaMin}, ${qualification.qualifiedAlphaMax}] (§7.12).`,
    )
  }

  // 3. Tool grant widening invariant check: steering can NEVER widen tools beyond ToolGrantManifest
  const allowedToolIds = new Set(manifest.allowedTools.map(t => t.toolId))
  if (injectedTools && injectedTools.some(t => !allowedToolIds.has(t))) {
    throw new Error('Steering grant invariant violated: Steering cannot add, reveal, or widen tool grants (§10.11, §11.1).')
  }

  return {
    activeTools: Array.from(allowedToolIds),
    alpha,
  }
}

describe('representation steering grant invariant and alpha bounds (§7.12, §10.11)', () => {
  const baseManifest: ToolGrantManifest = {
    schemaVersion: 1,
    toolGrantId: 'grant-001',
    taskId: 'task-100',
    episodeId: 'ep-100',
    route: {
      schemaVersion: 1,
      providerId: 'local-runner',
      modelId: 'qwen-coder-7b',
      locality: 'local',
      providerConfigDigest: 'cfg-digest',
    },
    qualificationId: 'qual-100',
    allowedTools: [
      { toolId: 'fs_read', capabilityDigest: 'cap-fs', approvalPolicy: 'auto' },
      { toolId: 'code_search', capabilityDigest: 'cap-search', approvalPolicy: 'auto' },
    ],
    deniedTools: [{ toolId: 'shell_exec', reasonCodes: ['UNSAFE_TASK_FAMILY'] }],
    createdAt: new Date().toISOString(),
    contentHash: 'hash-grant',
  }

  const qualification: SteeringQualification = {
    schemaVersion: 1,
    steeringQualificationId: 'steer-qual-001',
    steeringProfileId: 'profile-001',
    baseRuntimeProfileId: 'runtime-001',
    harnessReleaseId: 'rel-001',
    promptBundleDigest: 'pb-001',
    toolBundleDigest: 'tb-001',
    evaluatorBundleDigest: 'eb-001',
    qualifiedAlphaMin: 0.2,
    qualifiedAlphaMax: 1.5,
    defaultAlpha: 0.8,
    taskFamilyAlpha: { CODE_GENERATE_SINGLE: 0.8 },
    taskFamilyResults: {},
    nonToolRegressionSummaryRef: {
      schemaVersion: 1,
      artifactId: 'art-summary',
      kind: 'summary',
      uri: 'seh-artifact://summary',
      contentHash: 'art-hash',
    },
    status: 'qualified',
    evidenceRefs: [],
    issuedAt: new Date().toISOString(),
    contentHash: 'hash-steer-qual',
  }

  it('permits applying qualified steering profile when alpha is within qualified range', () => {
    const result = validateSteeringApplication({
      manifest: baseManifest,
      qualification,
      alpha: 0.8,
    })

    expect(result.alpha).toBe(0.8)
    expect(result.activeTools).toEqual(['fs_read', 'code_search'])
  })

  it('rejects alpha below qualifiedAlphaMin (§7.12)', () => {
    expect(() =>
      validateSteeringApplication({
        manifest: baseManifest,
        qualification,
        alpha: 0.1,
      }),
    ).toThrowError(/Steering alpha 0.1 out of qualified range \[0.2, 1.5\]/)
  })

  it('rejects alpha above qualifiedAlphaMax (§7.12)', () => {
    expect(() =>
      validateSteeringApplication({
        manifest: baseManifest,
        qualification,
        alpha: 2.0,
      }),
    ).toThrowError(/Steering alpha 2 out of qualified range \[0.2, 1.5\]/)
  })

  it('strictly rejects any attempt by steering to widen or inject ungranted tools (§10.11)', () => {
    expect(() =>
      validateSteeringApplication({
        manifest: baseManifest,
        qualification,
        alpha: 0.8,
        injectedTools: ['shell_exec'], // Denied tool attempted via steering
      }),
    ).toThrowError(/Steering grant invariant violated/)
  })

  it('fails closed if steering profile is rejected or retired (§7.13)', () => {
    const retiredQualification: SteeringQualification = {
      ...qualification,
      status: 'retired',
    }

    expect(() =>
      validateSteeringApplication({
        manifest: baseManifest,
        qualification: retiredQualification,
        alpha: 0.8,
      }),
    ).toThrowError(/Steering policy violation: Profile status is 'retired'/)
  })
})

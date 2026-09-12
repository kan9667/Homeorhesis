/**
 * Secret configuration denial tests (§10.3, §29.1).
 *
 * Validates:
 * - Plaintext credentials (API keys, bearer tokens, private key material) are detected and denied
 *   before they reach ModelRouteRef.providerConfigDigest, ExportEnvelope, or ReleaseManifest.
 * - Secret-aware references (env:VAR_NAME) are the only accepted credential form.
 */

import { describe, expect, it } from 'vitest'
import type { ExportEnvelope, ModelRouteRef, ReleaseManifest } from '../src/index.js'

// ---------------------------------------------------------------------------
// Secret detection policy
// ---------------------------------------------------------------------------

/** Patterns that indicate plaintext credential material. */
const SECRET_PATTERNS: RegExp[] = [
  /sk-[a-zA-Z0-9]{20,}/,          // OpenAI-style API key
  /Bearer\s+\S+/i,                 // Bearer token header
  /-----BEGIN\s+(RSA\s+)?PRIVATE KEY-----/, // PEM private key
  /ghp_[a-zA-Z0-9]{36}/,          // GitHub personal access token
  /AIza[a-zA-Z0-9\-_]{35}/,        // Google API key
]

/** Accepted pattern for secret references (not the secrets themselves). */
const SECRET_REF_PATTERN = /^(env|secret|vault):[A-Z][A-Z0-9_]*$/

/**
 * Returns true when the string contains plaintext credential material.
 */
function containsPlaintextSecret(value: string): boolean {
  return SECRET_PATTERNS.some(p => p.test(value))
}

/**
 * Returns true when the string is a valid reviewed secret reference.
 */
function isValidSecretRef(value: string): boolean {
  return SECRET_REF_PATTERN.test(value)
}

/**
 * Policy gate applied to ModelRouteRef before it is accepted into an episode.
 * Returns null when clean, or a reason string when a violation is detected.
 */
function auditRouteRef(route: ModelRouteRef): string | null {
  if (containsPlaintextSecret(route.providerConfigDigest)) {
    return 'providerConfigDigest contains plaintext credential material'
  }
  return null
}

/**
 * Policy gate applied to ExportEnvelope before it is sent remotely.
 */
function auditExportEnvelope(envelope: ExportEnvelope): string | null {
  if (containsPlaintextSecret(envelope.sanitizedMessageDigest)) {
    return 'sanitizedMessageDigest contains plaintext credential material'
  }
  if (containsPlaintextSecret(envelope.secretScanDigest)) {
    return 'secretScanDigest field itself contains credential material'
  }
  return null
}

/**
 * Policy gate applied to ReleaseManifest before it is published.
 */
function auditReleaseManifest(manifest: ReleaseManifest): string | null {
  for (const [key, value] of Object.entries(manifest)) {
    if (typeof value === 'string' && containsPlaintextSecret(value)) {
      return `ReleaseManifest.${key} contains plaintext credential material`
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// ModelRouteRef.providerConfigDigest
// ---------------------------------------------------------------------------

describe('ModelRouteRef.providerConfigDigest: plaintext secret denial', () => {
  function makeRoute(providerConfigDigest: string): ModelRouteRef {
    return {
      schemaVersion: 1,
      providerId: 'openai',
      modelId: 'gpt-4o',
      locality: 'remote',
      providerConfigDigest,
    }
  }

  it('rejects an OpenAI-style API key embedded in providerConfigDigest', () => {
    const route = makeRoute('sk-abcdefghijklmnopqrstuvwxyz12345')
    expect(auditRouteRef(route)).not.toBeNull()
  })

  it('rejects a Bearer token embedded in providerConfigDigest', () => {
    const route = makeRoute('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
    expect(auditRouteRef(route)).not.toBeNull()
  })

  it('accepts a sha256 digest as providerConfigDigest', () => {
    const route = makeRoute('sha256:abc123def456')
    expect(auditRouteRef(route)).toBeNull()
  })

  it('accepts an env: reference as providerConfigDigest pointer', () => {
    const route = makeRoute('env:OPENAI_API_KEY')
    // The route field itself holds a reference — the audit passes since it is not credential bytes.
    expect(auditRouteRef(route)).toBeNull()
    // And the reference has the correct shape.
    expect(isValidSecretRef('env:OPENAI_API_KEY')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// ExportEnvelope
// ---------------------------------------------------------------------------

describe('ExportEnvelope: plaintext secret denial', () => {
  function makeEnvelope(overrides: Partial<ExportEnvelope> = {}): ExportEnvelope {
    return {
      schemaVersion: 1,
      exportId: 'exp-001',
      taskId: 'task-001',
      childEpisodeId: 'ep-002',
      selectedRoute: {
        schemaVersion: 1,
        providerId: 'deepseek',
        modelId: 'deepseek-chat',
        locality: 'remote',
        providerConfigDigest: 'sha256:deepseek-cfg',
      },
      dataClass: 'internal',
      sourceEvidenceRefs: [],
      sanitizedArtifactRefs: [],
      sanitizedMessageDigest: 'sha256:sanitized-msg',
      includedPathPatterns: [],
      excludedReasonCodes: [],
      redactionPolicyVersion: 'redact@0.0.0',
      secretScanDigest: 'sha256:secret-scan',
      createdBy: 'seh-remote-guard',
      createdAt: '2026-01-01T00:00:00Z',
      contentHash: 'sha256:env-content',
      ...overrides,
    }
  }

  it('rejects envelope when sanitizedMessageDigest contains raw credential', () => {
    const envelope = makeEnvelope({ sanitizedMessageDigest: 'ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789' })
    expect(auditExportEnvelope(envelope)).not.toBeNull()
  })

  it('rejects envelope when secretScanDigest accidentally embeds credential', () => {
    const envelope = makeEnvelope({ secretScanDigest: 'AIzaSyDaBcDeFgHiJkLmNoPqRsTuVwXyZ1234567' })
    expect(auditExportEnvelope(envelope)).not.toBeNull()
  })

  it('accepts a clean envelope with only sha256 digests', () => {
    const envelope = makeEnvelope()
    expect(auditExportEnvelope(envelope)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// ReleaseManifest
// ---------------------------------------------------------------------------

describe('ReleaseManifest: plaintext secret denial', () => {
  function makeManifest(overrides: Partial<ReleaseManifest> = {}): ReleaseManifest {
    return {
      schemaVersion: 1,
      releaseId: 'rel-001',
      dshUpstreamCommit: 'b150a551b8d465e31e418e1b2eaf5e79bbb7d28e',
      dshPackageVersion: '0.1.1-rc.2',
      dependencyLockDigest: 'sha256:lock',
      sehHarnessVersion: '0.0.0-phase-0',
      promptBundleDigest: 'sha256:prompt',
      toolBundleDigest: 'sha256:tool',
      taskFamilyRegistryDigest: 'sha256:tf',
      decompositionPolicyDigest: 'sha256:decomp',
      routerPolicyDigest: 'sha256:router',
      localPortfolioDigest: 'sha256:portfolio',
      localSchedulerPolicyDigest: 'sha256:sched',
      localRuntimeManagerDigest: 'sha256:rtm',
      qualificationSnapshotDigest: 'sha256:qual',
      gcaPolicyDigest: 'sha256:gca',
      remoteGuardDigest: 'sha256:guard',
      remotePriceRegistryDigest: 'sha256:price',
      memorySchemaVersion: '1',
      memoryPolicyDigest: 'sha256:mem',
      sandboxPolicyDigest: 'sha256:sandbox',
      networkPolicyDigest: 'sha256:net',
      evaluatorBundleDigest: 'sha256:eval',
      trainingBackendRegistryDigest: 'sha256:train',
      trainingProvenanceRefs: [],
      requiredEvaluationIds: [],
      gateDecisionId: 'gate-001',
      approvalIds: ['approval-001'],
      rollbackTarget: 'rel-000',
      createdAt: '2026-01-01T00:00:00Z',
      contentHash: 'sha256:manifest-content',
      ...overrides,
    }
  }

  it('accepts a clean release manifest with only digests and identifiers', () => {
    const manifest = makeManifest()
    expect(auditReleaseManifest(manifest)).toBeNull()
  })

  it('rejects a manifest where any string field contains raw API key material', () => {
    const manifest = makeManifest({ promptBundleDigest: 'sk-thisshouldneverbehere1234567890' })
    expect(auditReleaseManifest(manifest)).not.toBeNull()
  })

  it('rejects a manifest where any string field contains PEM private key', () => {
    const manifest = makeManifest({ toolBundleDigest: '-----BEGIN PRIVATE KEY-----\nMIIE...' })
    expect(auditReleaseManifest(manifest)).not.toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Secret reference shape validation
// ---------------------------------------------------------------------------

describe('secret reference shape validation', () => {
  const validRefs = [
    'env:DEEPSEEK_API_KEY',
    'env:OPENAI_API_KEY',
    'env:ANTHROPIC_API_KEY',
    'secret:PROD_DB_PASSWORD',
    'vault:SECRET_SIGNING_KEY',
  ]

  const invalidRefs = [
    'sk-abcdef123456',
    'Bearer token-value',
    'DEEPSEEK_API_KEY',        // missing scheme
    'env:lowercase_key',       // lowercase not a valid env var name
    '',
  ]

  it.each(validRefs)('accepts valid secret ref: %s', (ref) => {
    expect(isValidSecretRef(ref)).toBe(true)
  })

  it.each(invalidRefs)('rejects invalid secret ref: %s', (ref) => {
    expect(isValidSecretRef(ref)).toBe(false)
  })
})

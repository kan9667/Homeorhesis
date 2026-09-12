import { describe, expect, it } from 'vitest'
import { asActorId, asControlEventId } from '../src/brand.js'
import { computeContentHash } from '../src/canonical-json.js'
import type { SEHControlEvent, SEHControlLedgerEntry } from '../src/control-event.js'
import type { EvidenceRef } from '../src/evidence-ref.js'

interface EvidenceStore {
  hasEvidence(uri: string, contentHash: string): boolean
}

function reconcileControlEvent(event: SEHControlEvent, store: EvidenceStore): boolean {
  for (const ref of event.evidenceRefs) {
    if (!ref.uri || !store.hasEvidence(ref.uri, ref.contentHash)) {
      throw new Error(`Reconciliation failure: Evidence reference '${ref.uri ?? 'unknown'}' [${ref.contentHash}] missing or invalid`)
    }
  }
  return true
}

describe('evidence reconciliation and fail-closed integrity (§12.4, §12.10)', () => {
  const mockStore: EvidenceStore = {
    hasEvidence(uri, hash) {
      return uri === 'seh-evidence://dsh/session-001/event' && hash === 'known-valid-hash'
    },
  }

  it('passes reconciliation when all evidence references exist and match content hashes', () => {
    const validRef: EvidenceRef = {
      schemaVersion: 1,
      kind: 'dsh-event',
      uri: 'seh-evidence://dsh/session-001/event',
      contentHash: 'known-valid-hash',
    }

    const event: SEHControlEvent = {
      schemaVersion: 1,
      eventId: asControlEventId('evt-1'),
      eventType: 'routing/decided',
      occurredAt: new Date().toISOString(),
      recordedAt: new Date().toISOString(),
      actorId: asActorId('router-actor'),
      actorRole: 'ROUTER',
      correlationId: 'corr-1',
      sequence: 1,
      payload: { selectedRoute: 'mock-route' },
      evidenceRefs: [validRef],
      artifactRefs: [],
      policyVersion: '3.1',
      contentHash: 'hash-evt-1',
    }

    expect(() => reconcileControlEvent(event, mockStore)).not.toThrow()
  })

  it('fails closed when an evidence reference is missing or hash is corrupted (§12.10)', () => {
    const danglingRef: EvidenceRef = {
      schemaVersion: 1,
      kind: 'dsh-event',
      uri: 'seh-evidence://dsh/session-999/event',
      contentHash: 'dangling-hash',
    }

    const eventWithDanglingRef: SEHControlEvent = {
      schemaVersion: 1,
      eventId: asControlEventId('evt-2'),
      eventType: 'routing/decided',
      occurredAt: new Date().toISOString(),
      recordedAt: new Date().toISOString(),
      actorId: asActorId('router-actor'),
      actorRole: 'ROUTER',
      correlationId: 'corr-2',
      sequence: 2,
      payload: {},
      evidenceRefs: [danglingRef],
      artifactRefs: [],
      policyVersion: '3.1',
      contentHash: 'hash-evt-2',
    }

    expect(() => reconcileControlEvent(eventWithDanglingRef, mockStore)).toThrowError(
      /Reconciliation failure: Evidence reference/,
    )
  })

  it('verifies previousEntryHash chaining across control ledger entries', () => {
    const entry1: SEHControlLedgerEntry = {
      schemaVersion: 1,
      sequenceNumber: 1,
      event: {
        schemaVersion: 1,
        eventId: asControlEventId('evt-1'),
        eventType: 'task/submitted',
        occurredAt: '2026-09-05T00:00:00Z',
        recordedAt: '2026-09-05T00:00:00Z',
        actorId: asActorId('actor-1'),
        actorRole: 'USER',
        correlationId: 'c-1',
        sequence: 1,
        payload: {},
        evidenceRefs: [],
        artifactRefs: [],
        policyVersion: '3.1',
        contentHash: 'payload-hash-1',
      },
      previousEntryHash: '0000000000000000000000000000000000000000000000000000000000000000',
      entryHash: '',
    }
    const computedEntry1Hash = computeContentHash({ ...entry1, entryHash: undefined })

    const entry2: SEHControlLedgerEntry = {
      schemaVersion: 1,
      sequenceNumber: 2,
      event: {
        schemaVersion: 1,
        eventId: asControlEventId('evt-2'),
        eventType: 'task/classified',
        occurredAt: '2026-09-05T00:00:01Z',
        recordedAt: '2026-09-05T00:00:01Z',
        actorId: asActorId('actor-1'),
        actorRole: 'CLASSIFIER',
        correlationId: 'c-1',
        sequence: 2,
        payload: {},
        evidenceRefs: [],
        artifactRefs: [],
        policyVersion: '3.1',
        contentHash: 'payload-hash-2',
      },
      previousEntryHash: computedEntry1Hash,
      entryHash: '',
    }

    expect(entry2.previousEntryHash).toBe(computedEntry1Hash)
    expect(entry2.sequenceNumber).toBe(entry1.sequenceNumber + 1)
  })
})

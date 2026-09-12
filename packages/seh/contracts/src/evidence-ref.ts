/**
 * Evidence references and immutable artifact references (§12.5, §12.6).
 * All evidence and artifacts are content-addressed and cryptographically verifiable.
 * @module @deepseek-ai/dsh-seh-contracts/evidence-ref
 */

/**
 * Reference to canonical runtime or control evidence (§12.5).
 */
export interface EvidenceRef {
  readonly schemaVersion: 1
  readonly kind: 'dsh-event' | 'dsh-range' | 'seh-control-event' | 'artifact'
  readonly uri?: string
  readonly sessionId?: string
  readonly seq?: number
  readonly startSeq?: number
  readonly endSeq?: number
  readonly controlEventId?: string
  readonly artifactHash?: string
  readonly contentHash: string
}

/**
 * Content-addressed reference to an immutable artifact (§12.6).
 */
export interface ArtifactRef {
  readonly schemaVersion: 1
  readonly artifactId: string
  readonly kind: string
  readonly uri: string
  readonly contentHash: string
  readonly sizeBytes?: number
  readonly mimeType?: string
}

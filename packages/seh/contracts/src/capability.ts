/**
 * Capability vector and requirements specification (§6.3).
 * Represents task-derived requirements used for qualification and model routing.
 * @module @deepseek-ai/dsh-seh-contracts/capability
 */

/**
 * Capability requirements vector derived from task description and family (§6.3).
 */
export interface CapabilityRequirements {
  readonly schemaVersion: 1
  readonly taskFamilyId: string
  readonly modalities: readonly ('text' | 'image' | 'audio')[]
  readonly reasoningDepth: 'none' | 'minimal' | 'standard' | 'deep'
  readonly actionMode:
    | 'deterministic'
    | 'generate-only'
    | 'structured-action'
    | 'multi-step-tools'
  readonly codeScope:
    | 'none'
    | 'snippet'
    | 'single-file'
    | 'multi-file'
    | 'repository'
  readonly verifierClasses: readonly string[]
  readonly requiredTools: readonly string[]
  readonly preferredTools: readonly string[]
  readonly minContextTokens?: number
  readonly expectedOutputTokens?: number
  readonly latencyClass: 'interactive' | 'normal' | 'batch'
  readonly riskClass: 'low' | 'medium' | 'high'
  readonly locality: 'local-only' | 'remote-eligible'
  readonly trainabilityRelevance?: 'none' | 'collect-rollout' | 'training-evaluation'
}

/** Canonical alias for capability requirements */
export type CapabilityVector = CapabilityRequirements
export type TaskRequirementVector = CapabilityRequirements

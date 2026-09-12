/**
 * Protected targets, actor roles, and authority boundary definitions (§4.1, §4.2, §19).
 * Defines immutable protected targets and verifies actor write authorization.
 * @module @deepseek-ai/dsh-seh-contracts/protected-targets
 */

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Logical actors with distinct authority boundaries (§4.2).
 */
export type ActorRole =
  | 'USER'
  | 'CLASSIFIER'
  | 'ROUTER'
  | 'SCHEDULER'
  | 'RUNTIME_MANAGER'
  | 'WORKER'
  | 'OPTIMIZER'
  | 'TRAINER'
  | 'EVALUATOR'
  | 'GATE'
  | 'RELEASE_MANAGER'

/**
 * Specification of protected path targets (§4.1).
 */
export interface ProtectedTarget {
  readonly id: string
  readonly paths: readonly string[]
}

/**
 * Schema for .seh/protected-targets.json configuration.
 */
export interface ProtectedTargetsConfig {
  readonly schemaVersion: 1
  readonly protected: readonly ProtectedTarget[]
  readonly candidateWritePolicy: string
  readonly antigravityWritePolicy: string
}

/**
 * Dynamically loads the protected targets configuration from disk without breaking TS composite builds.
 * @param repoRoot - Optional path to repository root (defaults to process.cwd()).
 * @returns Parsed ProtectedTargetsConfig.
 */
export function loadProtectedTargets(repoRoot?: string): ProtectedTargetsConfig {
  const root = repoRoot ?? process.cwd()
  const filePath = resolve(root, '.seh/protected-targets.json')
  if (!existsSync(filePath)) {
    throw new Error(`Protected targets configuration not found at ${filePath}`)
  }
  const content = readFileSync(filePath, 'utf8')
  return JSON.parse(content) as ProtectedTargetsConfig
}

/**
 * Checks whether an actor role is permitted to modify a protected target (§4.2, §19.1).
 * Worker, optimizer, and trainer roles can NEVER modify protected targets.
 */
export function isWritePermitted(role: ActorRole, targetId: string): boolean {
  if (role === 'WORKER' || role === 'TRAINER' || role === 'OPTIMIZER' || role === 'CLASSIFIER' || role === 'ROUTER') {
    return false
  }
  if (role === 'USER') {
    return true
  }
  if (role === 'GATE' && targetId === 'evaluator-gate-release') {
    return true
  }
  if (role === 'RELEASE_MANAGER' && (targetId === 'evaluator-gate-release' || targetId === 'dependency-and-ci')) {
    return true
  }
  return false
}

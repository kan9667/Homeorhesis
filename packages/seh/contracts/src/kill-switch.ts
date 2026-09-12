/**
 * Emergency kill switch and policy control contracts (§10.10).
 * Supports hierarchical emergency pause and egress shutdown.
 * @module @deepseek-ai/dsh-seh-contracts/kill-switch
 */

/**
 * Kill switch query filter (§10.10).
 */
export interface KillSwitchQuery {
  readonly scope?: 'global' | 'provider' | 'model' | 'tenant' | 'task' | 'system'
  readonly targetId?: string
}

/**
 * State of an SEH emergency kill switch (§10.10).
 */
export interface KillSwitchState {
  readonly schemaVersion: 1
  readonly switchId: string
  readonly scope: 'global' | 'provider' | 'model' | 'tenant' | 'task' | 'system'
  readonly targetId?: string
  readonly enabled: boolean
  readonly reason?: string
  readonly activatedBy?: string
  readonly activatedAt?: string
}

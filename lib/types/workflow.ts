/**
 * Workflow type definitions
 * Provides type safety for workflow steps, triggers, and configurations
 */

export type WorkflowStepType = 'TRIGGER' | 'ACTION' | 'CONDITION' | 'DELAY';

export interface WorkflowStep {
  id: string;
  type: WorkflowStepType;
  name: string;
  config: Record<string, unknown>;
  position: number;
}

export interface WorkflowTrigger {
  type: 'manual' | 'schedule' | 'webhook' | 'event';
  config: {
    schedule?: string; // Cron expression
    webhook_path?: string;
    event_type?: string;
    [key: string]: unknown;
  };
}

export interface WorkflowConfig {
  name: string;
  description?: string;
  steps: WorkflowStep[];
  triggers?: WorkflowTrigger;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  is_active: boolean;
}

export interface WorkflowRunResult {
  success: boolean;
  output?: Record<string, unknown>;
  error?: string;
  logs?: string[];
  duration?: number;
}


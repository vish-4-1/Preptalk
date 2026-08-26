import { z } from 'zod';
import { CalculatedSkillScores } from '../services/skillEngine.service';
import { NormalizedCodingStats, NormalizedDevStats } from '../types';

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
}

export interface ToolResult {
  toolCallId: string;
  name: string;
  success: boolean;
  data?: any;
  error?: string;
}

export interface AgentObservation {
  step: number;
  toolCall: ToolCall;
  result: ToolResult;
  timestamp: string;
}

export interface AgentDecision {
  step: number;
  thoughtSummary?: string;
  actionType: 'TOOL_CALL' | 'FINAL_RESPONSE';
  toolName?: string;
}

export interface LearningPlanPriority {
  skill: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  targetBenchmark?: number;
}

export interface DailyLearningTask {
  day: number;
  focusArea: string;
  tasks: string[];
  estimatedHours: number;
}

export interface LearningPlan {
  goal: string;
  targetRole: string;
  durationDays: number;
  priorities: LearningPlanPriority[];
  dailyPlan: DailyLearningTask[];
  milestones: string[];
  expectedOutcome: string;
}

export interface AgentState {
  studentProfileId: string;
  studentName?: string;
  userMessage: string;
  currentStep: number;
  maxSteps: number;
  observations: AgentObservation[];
  decisions: AgentDecision[];
  cachedProfile?: any;
  cachedSkillScores?: CalculatedSkillScores;
  cachedCodingStats?: NormalizedCodingStats[];
  cachedDevStats?: NormalizedDevStats;
  createdActions: any[];
  createdProjects: any[];
  learningPlan?: LearningPlan;
  isComplete: boolean;
}

export interface AgentResponse {
  sessionId: string;
  message: string;
  studentProfileId: string;
  actions: any[];
  plan?: LearningPlan;
  projectRecommendations?: any[];
  toolCalls: {
    toolName: string;
    description: string;
    success: boolean;
  }[];
  timestamp: string;
}

export interface AgentToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
  schema: z.ZodType<any>;
  execute: (args: any, context: AgentToolContext) => Promise<any>;
}

export interface AgentToolContext {
  studentProfileId: string;
  state: AgentState;
}

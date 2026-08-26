import { PrismaClient } from '@prisma/client';
import { AgentResponse, AgentState, LearningPlan } from './agent.types';

const prisma = new PrismaClient();

export class AgentMemoryService {
  async saveSession(state: AgentState, finalResponse: string): Promise<string> {
    try {
      const session = await prisma.agentSession.create({
        data: {
          studentProfileId: state.studentProfileId,
          userMessage: state.userMessage,
          agentResponse: finalResponse,
          toolCallsJson: JSON.stringify(
            state.observations.map((o) => ({
              toolName: o.toolCall.name,
              arguments: o.toolCall.arguments,
              success: o.result.success,
              error: o.result.error,
              timestamp: o.timestamp,
            }))
          ),
          planJson: state.learningPlan ? JSON.stringify(state.learningPlan) : null,
          actionsJson: state.createdActions.length > 0 ? JSON.stringify(state.createdActions) : null,
        },
      });

      return session.id;
    } catch (err: any) {
      console.warn('Could not save agent session to database:', err.message);
      return `session-${Date.now()}`;
    }
  }

  async getRecentSessions(studentProfileId: string, limit: number = 5) {
    try {
      const sessions = await prisma.agentSession.findMany({
        where: { studentProfileId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return sessions.map((s) => ({
        id: s.id,
        userMessage: s.userMessage,
        agentResponse: s.agentResponse,
        toolCalls: JSON.parse(s.toolCallsJson || '[]'),
        plan: s.planJson ? (JSON.parse(s.planJson) as LearningPlan) : undefined,
        actions: s.actionsJson ? JSON.parse(s.actionsJson) : [],
        createdAt: s.createdAt,
      }));
    } catch {
      return [];
    }
  }

  async getLatestPlan(studentProfileId: string): Promise<LearningPlan | null> {
    try {
      const latestWithPlan = await prisma.agentSession.findFirst({
        where: { studentProfileId, planJson: { not: null } },
        orderBy: { createdAt: 'desc' },
      });

      if (latestWithPlan?.planJson) {
        return JSON.parse(latestWithPlan.planJson) as LearningPlan;
      }
      return null;
    } catch {
      return null;
    }
  }
}

export const agentMemoryService = new AgentMemoryService();

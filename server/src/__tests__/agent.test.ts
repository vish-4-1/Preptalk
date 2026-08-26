import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { agentToolsRegistry, getAgentToolSpecs } from '../agent/agent.tools';
import { agentExecutor } from '../agent/agent.executor';
import { agentService } from '../agent/agent.service';
import { AgentState } from '../agent/agent.types';

const prisma = new PrismaClient();

describe('AI Placement Agent & Tool Registry', () => {
  let testUserId = '';
  let testProfileId = '';

  beforeEach(async () => {
    // Create a temporary seeded student profile for agent test isolation
    const uniqueEmail = `agent_test_${Date.now()}@university.edu`;
    const user = await prisma.user.create({
      data: {
        email: uniqueEmail,
        password: 'hashedpassword',
        name: 'Arun Agent Tester',
        role: 'STUDENT',
        department: 'Computer Science',
        branch: 'B.Tech CSE',
        passoutYear: 2027,
        studentProfile: {
          create: {
            username: `agent_user_${Date.now()}`,
            placementReadiness: 74,
            targetRole: 'Software Development Engineer',
            summary: 'Active student preparing for placement season.',
            codingProfiles: {
              create: [
                {
                  platform: 'LEETCODE',
                  totalSolved: 180,
                  easySolved: 80,
                  mediumSolved: 85,
                  hardSolved: 15,
                  contestRating: 1650,
                  globalRank: 42000,
                  contestsParticipated: 10,
                },
              ],
            },
            gitHubProfile: {
              create: {
                totalRepos: 12,
                publicRepos: 12,
                totalStars: 25,
                totalForks: 6,
                totalCommits: 310,
                prCount: 14,
                issueCount: 4,
                languagesJson: JSON.stringify({ TypeScript: 6, Java: 4, Python: 2 }),
                topReposJson: JSON.stringify([
                  { name: 'algo-lab', description: 'Algorithms in TS', stars: 15, forks: 4, language: 'TypeScript' },
                ]),
              },
            },
            skillSnapshots: {
              create: [
                { snapshotMonth: '2026-05', dsaScore: 65, devScore: 55, dbmsScore: 50, osScore: 52, overallScore: 58 },
                { snapshotMonth: '2026-06', dsaScore: 72, devScore: 62, dbmsScore: 58, osScore: 58, overallScore: 65 },
                { snapshotMonth: '2026-07', dsaScore: 80, devScore: 70, dbmsScore: 64, osScore: 66, overallScore: 72 },
              ],
            },
          },
        },
      },
      include: { studentProfile: true },
    });

    testUserId = user.id;
    testProfileId = user.studentProfile!.id;
  });

  afterEach(async () => {
    if (testUserId) {
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
  });

  it('provides valid OpenAI function calling specs for all 13 agent tools', () => {
    const specs = getAgentToolSpecs();
    expect(specs.length).toBeGreaterThanOrEqual(13);
    specs.forEach((spec) => {
      expect(spec.type).toBe('function');
      expect(spec.function.name).toBeDefined();
      expect(spec.function.description).toBeDefined();
      expect(spec.function.parameters).toBeDefined();
    });
  });

  it('executes get_student_profile tool accurately', async () => {
    const state: AgentState = {
      studentProfileId: testProfileId,
      userMessage: 'Test',
      currentStep: 1,
      maxSteps: 8,
      observations: [],
      decisions: [],
      createdActions: [],
      createdProjects: [],
      isComplete: false,
    };

    const tool = agentToolsRegistry['get_student_profile'];
    const result = await tool.execute({}, { studentProfileId: testProfileId, state });

    expect(result.name).toBe('Arun Agent Tester');
    expect(result.department).toBe('Computer Science');
    expect(result.targetRole).toBe('Software Development Engineer');
  });

  it('executes get_skill_scores tool deterministically', async () => {
    const state: AgentState = {
      studentProfileId: testProfileId,
      userMessage: 'Test',
      currentStep: 1,
      maxSteps: 8,
      observations: [],
      decisions: [],
      createdActions: [],
      createdProjects: [],
      isComplete: false,
    };

    const tool = agentToolsRegistry['get_skill_scores'];
    const result = await tool.execute({}, { studentProfileId: testProfileId, state });

    expect(result.dsaScore).toBeGreaterThan(60);
    expect(result.devScore).toBeGreaterThan(50);
    expect(result.placementReadinessIndex).toBeGreaterThan(60);
    expect(result.breakdown).toBeDefined();
  });

  it('executes get_skill_history and evaluates trajectory trend', async () => {
    const state: AgentState = {
      studentProfileId: testProfileId,
      userMessage: 'Test',
      currentStep: 1,
      maxSteps: 8,
      observations: [],
      decisions: [],
      createdActions: [],
      createdProjects: [],
      isComplete: false,
    };

    const tool = agentToolsRegistry['get_skill_history'];
    const result = await tool.execute({}, { studentProfileId: testProfileId, state });

    expect(result.hasHistory).toBe(true);
    expect(result.snapshotCount).toBe(3);
    expect(result.trends.overall.trend).toBe('IMPROVING');
    expect(result.trends.dsa.delta).toBe(15);
  });

  it('executes create_learning_plan and validates structure', async () => {
    const state: AgentState = {
      studentProfileId: testProfileId,
      userMessage: 'Create weekly plan',
      currentStep: 1,
      maxSteps: 8,
      observations: [],
      decisions: [],
      createdActions: [],
      createdProjects: [],
      isComplete: false,
    };

    const tool = agentToolsRegistry['create_learning_plan'];
    const planArgs = {
      goal: 'Pass Tier-1 Technical Screening',
      durationDays: 7,
      priorities: [
        { skill: 'DBMS', priority: 'HIGH' as const, reason: 'Lowest CS score' },
        { skill: 'DSA', priority: 'MEDIUM' as const, reason: 'Maintain DP practice' },
      ],
      dailyPlan: [
        { day: 1, focusArea: 'DBMS Indexing', tasks: ['Study B-Trees', 'Solve 5 SQL questions'], estimatedHours: 2 },
      ],
      milestones: ['Close DBMS gap'],
      expectedOutcome: 'Placement readiness score > 80',
    };

    const result = await tool.execute(planArgs, { studentProfileId: testProfileId, state });

    expect(result.success).toBe(true);
    expect(state.learningPlan).toBeDefined();
    expect(state.learningPlan?.durationDays).toBe(7);
  });

  it('executes full autonomous agent loop and returns structured response with tool traces', async () => {
    const response = await agentExecutor.run(testProfileId, 'What should I focus on this week to improve placement readiness?');

    expect(response).toBeDefined();
    expect(response.message).toContain('Placement Coach');
    expect(response.studentProfileId).toBe(testProfileId);
    expect(response.toolCalls.length).toBeGreaterThanOrEqual(4);
    expect(response.plan).toBeDefined();
    expect(response.plan?.dailyPlan.length).toBeGreaterThan(0);
  });

  it('applies structured learning plan tasks to the Action Center', async () => {
    const plan = {
      goal: 'Prepare for software engineering placements',
      targetRole: 'Software Development Engineer',
      durationDays: 3,
      priorities: [{ skill: 'DBMS', priority: 'HIGH' as const, reason: 'Gap' }],
      dailyPlan: [
        { day: 1, focusArea: 'DBMS', tasks: ['Study normalization'], estimatedHours: 2 },
        { day: 2, focusArea: 'SQL', tasks: ['Solve 5 SQL queries'], estimatedHours: 2 },
      ],
      milestones: ['Complete plan'],
      expectedOutcome: 'Improved score',
    };

    const result = await agentService.applyPlanTasksToActionCenter(testProfileId, plan);
    expect(result.count).toBe(2);

    const createdItems = await prisma.actionItem.findMany({
      where: { studentProfileId: testProfileId },
    });
    expect(createdItems.length).toBeGreaterThanOrEqual(2);
  });
});

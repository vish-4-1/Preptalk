import axios from 'axios';
import {
  AgentObservation,
  AgentResponse,
  AgentState,
  ToolCall,
  ToolResult,
} from './agent.types';
import { agentToolsRegistry, getAgentToolSpecs } from './agent.tools';
import { AGENT_SYSTEM_PROMPT } from './agent.prompts';
import { agentMemoryService } from './agent.memory';

const MAX_AGENT_STEPS = 8;

export class AgentExecutor {
  private groqApiKey = process.env.GROQ_API_KEY || '';
  private groqApiUrl = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
  private groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  async run(studentProfileId: string, userMessage: string): Promise<AgentResponse> {
    const state: AgentState = {
      studentProfileId,
      userMessage,
      currentStep: 0,
      maxSteps: MAX_AGENT_STEPS,
      observations: [],
      decisions: [],
      createdActions: [],
      createdProjects: [],
      isComplete: false,
    };

    // 1. Attempt LLM-driven multi-step tool-calling loop if GROQ_API_KEY is available
    if (this.groqApiKey) {
      try {
        const response = await this.executeLlmLoop(state);
        if (response) return response;
      } catch (err: any) {
        console.warn('LLM Agent loop failed or timed out. Switching to deterministic agent strategy:', err.message);
      }
    }

    // 2. Deterministic Agent Strategy (Robust Fallback that observes, reasons, and acts)
    return await this.executeDeterministicAgentLoop(state);
  }

  private async executeLlmLoop(state: AgentState): Promise<AgentResponse | null> {
    const messages: any[] = [
      { role: 'system', content: AGENT_SYSTEM_PROMPT },
      { role: 'user', content: `Student ID: ${state.studentProfileId}\nStudent Question / Goal: "${state.userMessage}"\n\nPlease inspect the student profile and skill metrics using your authorized tools before answering.` },
    ];

    const toolSpecs = getAgentToolSpecs();

    while (state.currentStep < state.maxSteps) {
      state.currentStep += 1;

      const res = await axios.post(
        this.groqApiUrl,
        {
          model: this.groqModel,
          messages,
          tools: toolSpecs,
          tool_choice: 'auto',
          temperature: 0.2,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.groqApiKey}`,
          },
          timeout: 12000,
        }
      );

      const choice = res.data?.choices?.[0];
      const message = choice?.message;

      if (!message) break;

      // Handle Tool Calls
      if (message.tool_calls && message.tool_calls.length > 0) {
        messages.push(message);

        for (const tc of message.tool_calls) {
          const toolName = tc.function?.name;
          let toolArgs: Record<string, any> = {};
          try {
            toolArgs = JSON.parse(tc.function?.arguments || '{}');
          } catch {
            toolArgs = {};
          }

          const toolDef = agentToolsRegistry[toolName];
          let toolResult: ToolResult;

          if (!toolDef) {
            toolResult = {
              toolCallId: tc.id,
              name: toolName,
              success: false,
              error: `Tool "${toolName}" is not a recognized agent tool.`,
            };
          } else {
            try {
              const validatedArgs = toolDef.schema.parse(toolArgs);
              const data = await toolDef.execute(validatedArgs, {
                studentProfileId: state.studentProfileId,
                state,
              });
              toolResult = {
                toolCallId: tc.id,
                name: toolName,
                success: true,
                data,
              };
            } catch (execErr: any) {
              toolResult = {
                toolCallId: tc.id,
                name: toolName,
                success: false,
                error: execErr.message || 'Tool execution failed',
              };
            }
          }

          state.observations.push({
            step: state.currentStep,
            toolCall: { id: tc.id, name: toolName, arguments: toolArgs },
            result: toolResult,
            timestamp: new Date().toISOString(),
          });

          messages.push({
            role: 'tool',
            tool_call_id: tc.id,
            name: toolName,
            content: JSON.stringify(toolResult.success ? toolResult.data : { error: toolResult.error }),
          });
        }
        continue;
      }

      // Final Response
      if (message.content) {
        const finalMessage = message.content;
        const sessionId = await agentMemoryService.saveSession(state, finalMessage);

        return {
          sessionId,
          message: finalMessage,
          studentProfileId: state.studentProfileId,
          actions: state.createdActions,
          plan: state.learningPlan,
          projectRecommendations: state.createdProjects,
          toolCalls: state.observations.map((o) => ({
            toolName: o.toolCall.name,
            description: `Step ${o.step}: Invoked ${o.toolCall.name}`,
            success: o.result.success,
          })),
          timestamp: new Date().toISOString(),
        };
      }
    }

    return null;
  }

  // Deterministic multi-step agent reasoning for offline, rate-limited, or testing environments
  private async executeDeterministicAgentLoop(state: AgentState): Promise<AgentResponse> {
    // Step 1: Observe student profile
    const profileTool = agentToolsRegistry['get_student_profile'];
    const profileData = await profileTool.execute({}, { studentProfileId: state.studentProfileId, state });
    state.observations.push({
      step: 1,
      toolCall: { id: 't1', name: 'get_student_profile', arguments: {} },
      result: { toolCallId: 't1', name: 'get_student_profile', success: true, data: profileData },
      timestamp: new Date().toISOString(),
    });

    // Step 2: Observe deterministic skill scores
    const skillTool = agentToolsRegistry['get_skill_scores'];
    const skillData = await skillTool.execute({}, { studentProfileId: state.studentProfileId, state });
    state.observations.push({
      step: 2,
      toolCall: { id: 't2', name: 'get_skill_scores', arguments: {} },
      result: { toolCallId: 't2', name: 'get_skill_scores', success: true, data: skillData },
      timestamp: new Date().toISOString(),
    });

    // Step 3: Observe historical progression
    const historyTool = agentToolsRegistry['get_skill_history'];
    const historyData = await historyTool.execute({}, { studentProfileId: state.studentProfileId, state });
    state.observations.push({
      step: 3,
      toolCall: { id: 't3', name: 'get_skill_history', arguments: {} },
      result: { toolCallId: 't3', name: 'get_skill_history', success: true, data: historyData },
      timestamp: new Date().toISOString(),
    });

    // Step 4: Check if company mentioned in user message
    let companyData: any = null;
    const lower = state.userMessage.toLowerCase();
    const companies = ['amazon', 'google', 'microsoft', 'flipkart', 'uber', 'goldman sachs', 'tcs'];
    const matchedCompany = companies.find((c) => lower.includes(c));

    if (matchedCompany) {
      const compTool = agentToolsRegistry['calculate_company_readiness'];
      try {
        companyData = await compTool.execute({ companyName: matchedCompany }, { studentProfileId: state.studentProfileId, state });
        state.observations.push({
          step: 4,
          toolCall: { id: 't4', name: 'calculate_company_readiness', arguments: { companyName: matchedCompany } },
          result: { toolCallId: 't4', name: 'calculate_company_readiness', success: true, data: companyData },
          timestamp: new Date().toISOString(),
        });
      } catch {
        // Continue
      }
    }

    // Step 5: Observe pending actions
    const pendingTool = agentToolsRegistry['get_pending_actions'];
    const pendingData = await pendingTool.execute({}, { studentProfileId: state.studentProfileId, state });
    state.observations.push({
      step: 5,
      toolCall: { id: 't5', name: 'get_pending_actions', arguments: {} },
      result: { toolCallId: 't5', name: 'get_pending_actions', success: true, data: pendingData },
      timestamp: new Date().toISOString(),
    });

    // Step 6: Reason on lowest skill dimension and create action / plan
    const dsa = skillData.dsaScore;
    const dev = skillData.devScore;
    const dbms = skillData.dbmsScore;
    const os = skillData.osScore;
    const pri = skillData.placementReadinessIndex;

    let primaryFocus = 'DBMS & SQL';
    let focusReason = `Your DBMS score (${dbms}/100) is your highest-impact growth area compared to DSA (${dsa}/100).`;

    if (dev < dsa - 15) {
      primaryFocus = 'Development & Projects';
      focusReason = `Your Development score (${dev}/100) lags behind your algorithmic foundation (${dsa}/100). Expand GitHub repository depth.`;
    } else if (dsa < 65) {
      primaryFocus = 'Data Structures & Algorithms';
      focusReason = `Elevating DSA from ${dsa}/100 is essential for passing technical screening rounds.`;
    } else if (companyData && companyData.missingSkills?.length > 0) {
      primaryFocus = companyData.missingSkills[0].skillName;
      focusReason = `Primary requirement gap for ${companyData.companyName} target hiring benchmarks.`;
    }

    // Step 7: Act - Create structured learning plan
    const planTool = agentToolsRegistry['create_learning_plan'];
    const createdPlan = await planTool.execute(
      {
        goal: `Elevate Placement Readiness Index from ${pri} to ${Math.min(95, pri + 10)}`,
        durationDays: 7,
        priorities: [
          { skill: primaryFocus, priority: 'HIGH', reason: focusReason },
          { skill: 'Data Structures & Algorithms', priority: 'MEDIUM', reason: 'Maintain consistent daily coding rhythm.' },
        ],
        dailyPlan: [
          { day: 1, focusArea: primaryFocus, tasks: [`Study core theoretical concepts of ${primaryFocus}`, 'Review top 5 interview questions'], estimatedHours: 2 },
          { day: 2, focusArea: primaryFocus, tasks: ['Solve 5 hands-on practice problems', 'Analyze space and time complexity tradeoffs'], estimatedHours: 3 },
          { day: 3, focusArea: 'DSA Practice', tasks: ['Solve 2 Medium LeetCode problems', 'Focus on Dynamic Programming or Graph patterns'], estimatedHours: 2 },
          { day: 4, focusArea: primaryFocus, tasks: ['Implement a mini-project module or schema optimization', 'Document architectural rationale'], estimatedHours: 3 },
          { day: 5, focusArea: 'CS Fundamentals', tasks: ['Review OS Process Scheduling & DBMS ACID transactions', 'Prepare STAR behavioral stories'], estimatedHours: 2 },
          { day: 6, focusArea: 'Mock Technical Interview', tasks: ['Conduct 1 timed mock interview round', 'Simulate whiteboard coding constraint'], estimatedHours: 2 },
          { day: 7, focusArea: 'Weekly Review', tasks: ['Retest skill benchmarks and sync external profile telemetry'], estimatedHours: 1 },
        ],
        milestones: [
          `Close ${primaryFocus} deficit`,
          'Complete 1 timed mock technical round',
          'Synchronize fresh telemetry to reflect progress',
        ],
        expectedOutcome: `Increase verified readiness index to ${Math.min(95, pri + 10)}/100 for campus placement drives.`,
      },
      { studentProfileId: state.studentProfileId, state }
    );

    // Step 8: Act - Create 1 high priority action item
    const actionTool = agentToolsRegistry['create_action_item'];
    await actionTool.execute(
      {
        title: `Master ${primaryFocus} Foundations & Core Interview Patterns`,
        category: primaryFocus.includes('Dev') ? 'Project' : 'Theory',
        priority: 'HIGH',
        estimatedHours: 4,
        reason: focusReason,
      },
      { studentProfileId: state.studentProfileId, state }
    );

    // Compose final structured message
    const message = `
### 🎯 Placement Coach Strategic Assessment

Hello **${profileData.name}**! Based on your verified telemetry:

- **Placement Readiness Index (PRI)**: **${pri}/100**
- **Strongest Dimension**: DSA (**${dsa}/100**)
- **Primary Strategic Focus**: **${primaryFocus}** (**${focusReason}**)
${companyData ? `- **${companyData.companyName} Benchmark Readiness**: **${companyData.readinessScore}/100** (${companyData.status})` : ''}

---

### 📋 Recommended 7-Day Action Plan
I have generated a structured **7-Day Learning Plan** and created a new priority action item in your **Action Center**.

1. **Days 1–2**: Target **${primaryFocus}** core paradigms and interview problems.
2. **Days 3–4**: Solve targeted LeetCode dynamic programming & graph patterns.
3. **Days 5–6**: Review core CS fundamentals (OS & DBMS) and conduct 1 timed mock technical interview.
4. **Day 7**: Re-sync your telemetry to measure score progression.

You can click **"Start Plan"** in the Coach dashboard to begin tracking your tasks!
    `.trim();

    const sessionId = await agentMemoryService.saveSession(state, message);

    return {
      sessionId,
      message,
      studentProfileId: state.studentProfileId,
      actions: state.createdActions,
      plan: state.learningPlan,
      projectRecommendations: state.createdProjects,
      toolCalls: state.observations.map((o) => ({
        toolName: o.toolCall.name,
        description: `Step ${o.step}: Invoked ${o.toolCall.name}`,
        success: o.result.success,
      })),
      timestamp: new Date().toISOString(),
    };
  }
}

export const agentExecutor = new AgentExecutor();

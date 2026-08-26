export type PlatformType = 'GITHUB' | 'LEETCODE' | 'CODECHEF' | 'HACKERRANK' | 'LINKEDIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  department?: string;
  branch?: string;
  passoutYear?: number;
  studentProfileId?: string;
}

export interface PlatformConnection {
  id: string;
  platform: PlatformType;
  profileUrl: string;
  isConnected: boolean;
  lastSyncedAt?: string;
  errorState?: string;
}

export interface GitHubProfile {
  totalRepos: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  prCount: number;
  issueCount: number;
  languagesJson: string;
  topReposJson: string;
}

export interface CodingProfile {
  platform: PlatformType;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  contestRating: number;
  globalRank: number;
  contestsParticipated: number;
}

export interface SkillSnapshot {
  id: string;
  snapshotMonth: string;
  dsaScore: number;
  devScore: number;
  dbmsScore: number;
  osScore: number;
  overallScore: number;
  createdAt: string;
}

export interface ActionItem {
  id: string;
  title: string;
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedHours: number;
  reason: string;
  completed: boolean;
  completedAt?: string;
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  problemStatement: string;
  whySuited: string;
  technologies: string[];
  skillsDeveloped: string[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedDuration: string;
  milestones: string[];
}

export interface TargetCompany {
  id: string;
  name: string;
  logoUrl?: string;
  targetRoles: string[];
  difficultyLevel: string;
  overview: string;
  requirements: Array<{
    id: string;
    skillName: string;
    minScore: number;
    priority: string;
    topics: string[];
  }>;
}

export interface StudentProfile {
  id: string;
  username: string;
  resumeUrl?: string;
  placementReadiness: number;
  summary?: string;
  targetRole?: string;
  user: User;
  connections: PlatformConnection[];
  gitHubProfile?: GitHubProfile;
  codingProfiles: CodingProfile[];
  skillSnapshots: SkillSnapshot[];
  actionItems: ActionItem[];
  projectRecommendations?: ProjectRecommendation[];
  aiAnalyses?: any[];
}

export interface AgentToolTrace {
  toolName: string;
  description: string;
  success: boolean;
}

export interface LearningPlanPriority {
  skill: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
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

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  toolCalls?: AgentToolTrace[];
  plan?: LearningPlan;
  actions?: any[];
  timestamp: string;
}


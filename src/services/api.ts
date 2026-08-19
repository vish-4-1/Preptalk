import axios from 'axios';
import { ActionItem, StudentProfile, TargetCompany } from '../types';

const API_BASE = '/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('preptrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentic Student Profile for Vishal Kumar D (Anna University MIT Campus CSE)
export const getDemoStudentProfile = (): StudentProfile => {
  return {
    id: 'profile-vishal-2023503041',
    username: '2023503041',
    placementReadiness: 74,
    summary: 'Vishal Kumar D demonstrates strong academic results (8.54 CGPA, 0 Arrears, MIT Campus CSE Anna University) and robust problem-solving volume (368 solved across HackerRank & CodeChef). Primary opportunity is expanding GitHub repository depth.',
    targetRole: 'Software Development Engineer',
    user: {
      id: 'user-vishal-2023503041',
      name: 'Vishal Kumar D',
      email: '2023503041@student.annauniv.edu',
      role: 'STUDENT',
      department: 'Computer Science & Engineering',
      branch: 'BE CSE (MIT Campus, Anna Univ)',
      passoutYear: 2027,
    },
    connections: [
      { id: 'c1', platform: 'GITHUB', profileUrl: 'https://github.com/Vishal-Kumar-D', isConnected: true, lastSyncedAt: '2026-08-19' },
      { id: 'c2', platform: 'HACKERRANK', profileUrl: 'https://www.hackerrank.com/profile/vish41', isConnected: true, lastSyncedAt: '2026-08-19' },
      { id: 'c3', platform: 'LEETCODE', profileUrl: 'https://leetcode.com/u/vish41', isConnected: true, lastSyncedAt: '2026-08-19' },
      { id: 'c4', platform: 'CODECHEF', profileUrl: 'https://www.codechef.com/users/vish41', isConnected: true, lastSyncedAt: '2026-08-19' },
      { id: 'c5', platform: 'LINKEDIN', profileUrl: 'https://linkedin.com/in/vishal-kumar-d', isConnected: true, lastSyncedAt: '2026-08-19' },
    ],
    gitHubProfile: {
      totalRepos: 1,
      publicRepos: 1,
      totalStars: 0,
      totalForks: 0,
      totalCommits: 28,
      prCount: 2,
      issueCount: 1,
      languagesJson: JSON.stringify({ 'C++': 1, Python: 1 }),
      topReposJson: JSON.stringify([
        { name: 'AU-MIT-Team-Ryzen', description: 'Anna University MIT Campus Team Ryzen Repository', repoUrl: 'https://github.com/Vishal-Kumar-D/AU-MIT-Team-Ryzen', stars: 0, forks: 0, language: 'C++', commitCount: 28 },
      ]),
    },
    codingProfiles: [
      { platform: 'HACKERRANK', totalSolved: 140, easySolved: 80, mediumSolved: 50, hardSolved: 10, contestRating: 1540, globalRank: 52000, contestsParticipated: 8 },
      { platform: 'CODECHEF', totalSolved: 185, easySolved: 90, mediumSolved: 75, hardSolved: 20, contestRating: 1742, globalRank: 18200, contestsParticipated: 22 },
      { platform: 'LEETCODE', totalSolved: 43, easySolved: 25, mediumSolved: 15, hardSolved: 3, contestRating: 1620, globalRank: 65000, contestsParticipated: 6 },
    ],
    skillSnapshots: [
      { id: 's1', snapshotMonth: 'May 2026', dsaScore: 82, devScore: 20, dbmsScore: 68, osScore: 72, overallScore: 61, createdAt: '2026-05-01' },
      { id: 's2', snapshotMonth: 'Jun 2026', dsaScore: 86, devScore: 25, dbmsScore: 72, osScore: 76, overallScore: 65, createdAt: '2026-06-01' },
      { id: 's3', snapshotMonth: 'Jul 2026', dsaScore: 90, devScore: 30, dbmsScore: 75, osScore: 80, overallScore: 69, createdAt: '2026-07-01' },
      { id: 's4', snapshotMonth: 'Aug 2026', dsaScore: 94, devScore: 35, dbmsScore: 79, osScore: 84, overallScore: 74, createdAt: '2026-08-01' },
    ],
    actionItems: [
      { id: 'a1', title: 'Build 1 Full-Stack Project on GitHub to Elevate Dev Telemetry', category: 'Project', priority: 'HIGH', estimatedHours: 8, reason: 'Recommended because your algorithmic score (DSA: 94/100) is high, but public GitHub repository telemetry needs expansion.', completed: false },
      { id: 'a2', title: 'Solve 10 Medium Dynamic Programming Problems on LeetCode', category: 'Coding', priority: 'HIGH', estimatedHours: 5, reason: 'Strengthens DP optimization patterns required for product-based company screening rounds.', completed: false },
      { id: 'a3', title: 'Review DBMS Indexing (B-Trees) & Operating Systems Concurrency', category: 'Theory', priority: 'MEDIUM', estimatedHours: 4, reason: 'Complements your strong 8.54 CGPA academic record for core CS interview rounds.', completed: true, completedAt: '2026-08-19' },
      { id: 'a4', title: 'Conduct 1 Timed Mock Technical Interview', category: 'Mock Interview', priority: 'MEDIUM', estimatedHours: 2, reason: 'Improves technical articulation and architectural tradeoff reasoning under interviewer constraints.', completed: false },
    ],
    projectRecommendations: [
      {
        id: 'pr1',
        title: 'Distributed Task Queue & Rate Limiter Engine',
        problemStatement: 'Build a high-performance distributed background job processor with token-bucket rate limiting and sliding window metrics.',
        whySuited: 'Bridge your primary growth gap by creating an impressive backend project on GitHub.',
        technologies: ['TypeScript', 'Node.js', 'Redis', 'PostgreSQL', 'Docker'],
        skillsDeveloped: ['Distributed Systems', 'Redis Data Structures', 'Rate Limiting', 'Concurrency'],
        difficulty: 'INTERMEDIATE',
        estimatedDuration: '2 weeks',
        milestones: ['Design schema and queue data structures in Redis', 'Implement producer-consumer worker thread pool', 'Integrate Prometheus/Grafana metric telemetry'],
      },
      {
        id: 'pr2',
        title: 'Automated Code Review Bot with Static Analysis',
        problemStatement: 'Develop a GitHub App webhook service that automatically parses Pull Requests, checks AST anti-patterns, and computes cyclomatic complexity.',
        whySuited: 'Showcases advanced developer tooling skills prized by Tier-1 product engineering teams.',
        technologies: ['Node.js', 'AST Parser', 'GitHub REST API', 'Docker'],
        skillsDeveloped: ['Static Code Analysis', 'AST Processing', 'GitHub Webhooks', 'CI/CD'],
        difficulty: 'ADVANCED',
        estimatedDuration: '3 weeks',
        milestones: ['Set up GitHub App OAuth and webhook payload listener', 'Implement JavaScript/TypeScript AST tree parser', 'Post automated review inline comments on PR diffs'],
      },
    ],
  };
};

export const getDemoCompanies = (): TargetCompany[] => [
  {
    id: 'comp-1',
    name: 'Amazon',
    difficultyLevel: 'TIER-1',
    overview: 'Focuses heavily on Data Structures, Algorithms (Graphs, DP, Trees), System Design, and Leadership Principles.',
    targetRoles: ['Software Development Engineer I', 'SDE Intern'],
    requirements: [
      { id: 'r1', skillName: 'Data Structures & Algorithms', minScore: 82, priority: 'HIGH', topics: ['Graph Traversal', 'Dynamic Programming', 'Tries'] },
      { id: 'r2', skillName: 'System Design & Scalability', minScore: 78, priority: 'HIGH', topics: ['Caching Strategy', 'Distributed Queues'] },
      { id: 'r3', skillName: 'DBMS & Object Oriented Design', minScore: 75, priority: 'MEDIUM', topics: ['Transaction Isolation', 'Schema Design'] },
    ],
  },
  {
    id: 'comp-2',
    name: 'Microsoft',
    difficultyLevel: 'TIER-1',
    overview: 'Emphasizes clean problem-solving, code optimization, Operating Systems fundamentals, and collaborative design.',
    targetRoles: ['Software Engineer (Level 59)', 'Graduate SDE'],
    requirements: [
      { id: 'r4', skillName: 'Data Structures & Algorithms', minScore: 80, priority: 'HIGH', topics: ['Binary Trees', 'Arrays & Strings', 'Heap'] },
      { id: 'r5', skillName: 'Operating Systems & Concurrency', minScore: 78, priority: 'HIGH', topics: ['Process Management', 'Deadlocks', 'Paging'] },
    ],
  },
  {
    id: 'comp-3',
    name: 'TVS Motor Company',
    difficultyLevel: 'PRODUCT',
    overview: 'CUIC On-Campus Drive: Testing Engineer Intern / SDE Intern for CSE, IT, AI&DS (Min CGPA: 7.0).',
    targetRoles: ['Testing Engineer Intern', 'Software Engineer'],
    requirements: [
      { id: 'r6', skillName: 'Database Management (DBMS)', minScore: 70, priority: 'HIGH', topics: ['Complex SQL Queries', 'Joins', 'Normalization'] },
      { id: 'r7', skillName: 'Aptitude & Communication', minScore: 70, priority: 'HIGH', topics: ['Quantitative Reasoning', 'Case Studies'] },
    ],
  },
  {
    id: 'comp-4',
    name: 'Yamaha Motor India Group',
    difficultyLevel: 'PRODUCT',
    overview: 'CUIC On-Campus Drive: Summer Internship / Graduate Intern (CTC: 7.5 LPA).',
    targetRoles: ['R&D Engineer Intern', 'Software Developer'],
    requirements: [
      { id: 'r8', skillName: 'Data Structures & Algorithms', minScore: 75, priority: 'HIGH', topics: ['Arrays', 'Sorting', 'Trees'] },
      { id: 'r9', skillName: 'C++ & System Core', minScore: 70, priority: 'HIGH', topics: ['Memory Management', 'STL'] },
    ],
  },
];

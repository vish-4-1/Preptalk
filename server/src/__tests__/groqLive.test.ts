import { describe, it, expect } from 'vitest';
import dotenv from 'dotenv';
import { grokService } from '../services/grok.service';
import { NormalizedStudentProfile } from '../types';

dotenv.config();

describe('Live Groq API Service Test', () => {
  it('calls Groq API successfully and returns structured JSON validated by Zod', async () => {
    const mockProfile: NormalizedStudentProfile = {
      identity: {
        name: 'Arun Kumar',
        username: 'arunkumar_2027',
        email: 'arun.kumar@preptrack.edu.in',
        department: 'Computer Science & Engineering',
      },
      coding: {
        combinedTotalSolved: 312,
        combinedContestRatingMax: 1685,
      },
      development: {
        totalRepos: 18,
        publicRepos: 18,
        totalStars: 42,
        totalForks: 14,
        totalCommits: 480,
        prCount: 26,
        issueCount: 8,
        languages: { TypeScript: 8, Python: 5, Java: 3 },
        topRepos: [],
      },
      skills: [
        { category: 'Technical', name: 'Data Structures & Algorithms', score: 82, verifiedBy: 'TELEMETRY' },
        { category: 'Technical', name: 'Development & Projects', score: 78, verifiedBy: 'TELEMETRY' },
        { category: 'Technical', name: 'Database Management (DBMS)', score: 72, verifiedBy: 'TELEMETRY' },
      ],
      placementReadinessIndex: 78,
    };

    const analysis = await grokService.analyzeProfile(mockProfile, 'Amazon');

    expect(analysis).toBeDefined();
    expect(analysis.summary).toBeTypeOf('string');
    expect(analysis.placementReadiness).toBeGreaterThan(0);
    expect(Array.isArray(analysis.strengths)).toBe(true);
    expect(Array.isArray(analysis.recommendedActions)).toBe(true);
    expect(Array.isArray(analysis.projectIdeas)).toBe(true);

    console.log('Live Groq Analysis Summary:', analysis.summary);
    console.log('Placement Readiness Index:', analysis.placementReadiness);
  }, 20000);
});

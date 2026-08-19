import { describe, it, expect } from 'vitest';
import { skillEngineService } from '../services/skillEngine.service';

describe('SkillEngineService Deterministic Math', () => {
  it('calculates placement readiness index correctly for balanced profile', () => {
    const mockCodingStats = [
      {
        totalSolved: 312,
        easySolved: 140,
        mediumSolved: 145,
        hardSolved: 27,
        contestRating: 1685,
        globalRank: 38450,
        contestsParticipated: 16,
      },
    ];

    const mockDevStats = {
      totalRepos: 18,
      publicRepos: 18,
      totalStars: 42,
      totalForks: 14,
      totalCommits: 480,
      prCount: 26,
      issueCount: 8,
      languages: { TypeScript: 8, Python: 5, Java: 3 },
      topRepos: [],
    };

    const result = skillEngineService.calculateScores(mockCodingStats, mockDevStats, { linkedinConnected: true });

    expect(result.dsaScore).toBeGreaterThanOrEqual(70);
    expect(result.devScore).toBeGreaterThanOrEqual(70);
    expect(result.overallReadinessIndex).toBeGreaterThan(65);
    expect(result.overallReadinessIndex).toBeLessThanOrEqual(100);
  });
});

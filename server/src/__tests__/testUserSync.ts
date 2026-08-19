import axios from 'axios';
import { normalizerService } from '../services/normalizer.service';
import { skillEngineService } from '../services/skillEngine.service';
import { grokService } from '../services/grok.service';

async function testSyncVishal() {
  const username = 'vishaldevikumar';
  const email = 'vishaldevikumar@gmail.com';
  console.log(`\n======================================================`);
  console.log(`Testing Public Telemetry Sync for user: ${email} (${username})`);
  console.log(`======================================================\n`);

  const urls = {
    GITHUB: `https://github.com/${username}`,
    LEETCODE: `https://leetcode.com/${username}`,
    CODECHEF: `https://codechef.com/users/${username}`,
    HACKERRANK: `https://hackerrank.com/profile/${username}`,
    LINKEDIN: `https://linkedin.com/in/${username}`,
  };

  const codingStatsList: any[] = [];
  let devStats: any = undefined;

  for (const [platform, url] of Object.entries(urls)) {
    try {
      console.log(`Syncing ${platform}: ${url}...`);
      const result = await normalizerService.syncPlatform(platform as any, url);
      console.log(`Result (${platform}): success=${result.success}`);

      if (result.success && result.data) {
        if (platform === 'GITHUB') {
          devStats = result.data;
          console.log(`GitHub Repos: ${devStats.publicRepos}, Commits: ${devStats.totalCommits}, Stars: ${devStats.totalStars}`);
        } else if (['LEETCODE', 'CODECHEF', 'HACKERRANK'].includes(platform)) {
          codingStatsList.push(result.data);
          console.log(`${platform} Solved: ${result.data.totalSolved}, Rating: ${result.data.contestRating}`);
        }
      }
    } catch (err: any) {
      console.log(`Platform ${platform} notice:`, err.message);
    }
  }

  // Calculate Deterministic Skills
  const calculated = skillEngineService.calculateScores(codingStatsList, devStats, {
    linkedinConnected: true,
  });

  console.log(`\n------------------------------------------------------`);
  console.log(`Placement Readiness Index for Vishal: ${calculated.overallReadinessIndex}/100`);
  console.log(`DSA Score: ${calculated.dsaScore}/100`);
  console.log(`Dev Score: ${calculated.devScore}/100`);
  console.log(`DBMS Score: ${calculated.dbmsScore}/100`);
  console.log(`OS Score: ${calculated.osScore}/100`);
  console.log(`------------------------------------------------------\n`);

  // Run Groq AI Telemetry Reasoning with live API key!
  const normalizedProfileForGroq: any = {
    identity: {
      name: 'Vishal Devikumar',
      username,
      email,
      department: 'Computer Science & Engineering',
    },
    coding: {
      combinedTotalSolved: codingStatsList.reduce((acc, c) => acc + (c.totalSolved || 0), 0),
      combinedContestRatingMax: codingStatsList.reduce((max, c) => Math.max(max, c.contestRating || 0), 0),
    },
    development: devStats || {
      totalRepos: 12,
      publicRepos: 12,
      totalStars: 15,
      totalForks: 4,
      totalCommits: 280,
      prCount: 14,
      issueCount: 5,
      languages: { Python: 5, JavaScript: 4, CPlusPlus: 3 },
      topRepos: [],
    },
    skills: Object.entries(calculated.breakdown).map(([name, val]) => ({
      category: 'Technical',
      name,
      score: val.score,
      verifiedBy: 'DETERMINISTIC_TELEMETRY',
    })),
    placementReadinessIndex: calculated.overallReadinessIndex,
  };

  console.log('Sending Telemetry to Groq Cloud API (llama-3.3-70b-versatile)...');
  const aiAnalysis = await grokService.analyzeProfile(normalizedProfileForGroq, 'Amazon');

  console.log('\n======================================================');
  console.log('GROQ LIVE ANALYSIS FOR VISHAL DEVIKUMAR');
  console.log('======================================================');
  console.log('Executive Summary:\n', aiAnalysis.summary);
  console.log('\nKey Strengths:\n', aiAnalysis.strengths);
  console.log('\nKey Weaknesses:\n', aiAnalysis.weaknesses);
  console.log('\nTop Recommended Next Actions:\n', aiAnalysis.recommendedActions.slice(0, 3));
  console.log('\nCustom "Build Next" Project Ideas:\n', aiAnalysis.projectIdeas.slice(0, 2));
  console.log('======================================================\n');
}

testSyncVishal().catch(console.error);

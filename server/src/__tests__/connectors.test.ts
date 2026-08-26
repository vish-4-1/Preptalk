import { describe, it, expect } from 'vitest';
import { GitHubConnector } from '../connectors/GitHubConnector';
import { LeetCodeConnector } from '../connectors/LeetCodeConnector';
import { CodeChefConnector } from '../connectors/CodeChefConnector';
import { HackerRankConnector } from '../connectors/HackerRankConnector';
import { LinkedInConnector } from '../connectors/LinkedInConnector';

describe('ProfileConnectors URL Validation & Parsing', () => {
  it('validates and extracts GitHub profile URLs correctly', () => {
    const gh = new GitHubConnector();
    expect(gh.validateUrl('https://github.com/arunkumar-dev')).toBe(true);
    expect(gh.extractUsername('https://github.com/arunkumar-dev')).toBe('arunkumar-dev');
    expect(gh.validateUrl('https://invalid-domain.com/user')).toBe(false);
  });

  it('validates and extracts LeetCode profile URLs correctly', () => {
    const lc = new LeetCodeConnector();
    expect(lc.validateUrl('https://leetcode.com/arunkumar_coder')).toBe(true);
    expect(lc.extractUsername('https://leetcode.com/arunkumar_coder')).toBe('arunkumar_coder');
    expect(lc.validateUrl('https://leetcode.com/u/arunkumar_coder')).toBe(true);
  });

  it('validates CodeChef profile URLs correctly', () => {
    const cc = new CodeChefConnector();
    expect(cc.validateUrl('https://codechef.com/users/arunkumar_cc')).toBe(true);
    expect(cc.extractUsername('https://codechef.com/users/arunkumar_cc')).toBe('arunkumar_cc');
  });

  it('validates HackerRank profile URLs correctly', () => {
    const hr = new HackerRankConnector();
    expect(hr.validateUrl('https://hackerrank.com/profile/arunkumar_hr')).toBe(true);
    expect(hr.extractUsername('https://hackerrank.com/profile/arunkumar_hr')).toBe('arunkumar_hr');
  });

  it('validates LinkedIn profile URLs correctly', () => {
    const li = new LinkedInConnector();
    expect(li.validateUrl('https://linkedin.com/in/arunkumar-dev')).toBe(true);
    expect(li.extractUsername('https://linkedin.com/in/arunkumar-dev')).toBe('arunkumar-dev');
  });

  it('fetches normalized data from HackerRank and CodeChef connectors without crashing', async () => {
    const hr = new HackerRankConnector();
    const res = await hr.fetchProfile('https://hackerrank.com/profile/arunkumar_hr');
    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data?.totalSolved).toBeGreaterThan(0);

    const cc = new CodeChefConnector();
    const ccRes = await cc.fetchProfile('https://codechef.com/users/arunkumar_cc');
    expect(ccRes.success).toBe(true);
    expect(ccRes.data).toBeDefined();
    expect(ccRes.data?.contestRating).toBeGreaterThan(0);
  });
});


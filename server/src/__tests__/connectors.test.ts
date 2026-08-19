import { describe, it, expect } from 'vitest';
import { GitHubConnector } from '../connectors/GitHubConnector';
import { LeetCodeConnector } from '../connectors/LeetCodeConnector';
import { CodeChefConnector } from '../connectors/CodeChefConnector';

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
});

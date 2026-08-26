# Profile Data Connectors Architecture

## Connector Design Pattern

PrepTrack (Preptalk) uses an object-oriented connector hierarchy extending the abstract base class `ProfileConnector<T>`.

```typescript
export abstract class ProfileConnector<T = any> {
  abstract readonly platform: PlatformName;
  abstract validateUrl(url: string): boolean;
  abstract extractUsername(url: string): string | null;
  abstract fetchProfile(profileUrl: string): Promise<ConnectorResponse<T>>;
}
```

## Implemented Connectors

1. **GitHubConnector**:
   - Queries `https://api.github.com/users/{username}` for core profile metrics and `https://api.github.com/users/{username}/repos` for repository metadata.
   - Retrieves live commit counts, PR counts, and issue statistics via GitHub Search endpoints (`search/commits`, `search/issues?type=pr`, `search/issues?type=issue`).
   - Supports optional `GITHUB_TOKEN` from environment variables for enhanced API rate limits (up to 5,000 req/hr).
   - Graceful deterministic cached snapshots if unauthenticated rate limits (60 req/hr) are reached.

2. **LeetCodeConnector**:
   - Queries `https://leetcode.com/graphql` using GraphQL POST queries for authenticated/public solved problem breakdowns (Easy, Medium, Hard), contest rating, and global ranking.

3. **CodeChefConnector**:
   - Queries public CodeChef profile APIs and public endpoints for authentic contest rating, problem volume, global rank, and contest participation history.

4. **HackerRankConnector**:
   - Normalizes domain points, problem solve numbers, badges, and contest standings through public HackerRank REST endpoints (`/rest/hackers/{username}/profile` and `/badges`).

5. **LinkedInConnector**:
   - Verifies public profile URL formatting and normalizes public career metadata, listed skills, and certifications.

## Normalization & Data Pipelines

Each connector converts disparate upstream payloads into strongly-typed normalized structures:
- `NormalizedCodingStats`: Solved problems (Easy/Medium/Hard), contest rating, global rank, contests participated.
- `NormalizedDevStats`: Total repos, public repos, total stars, forks, total commits, PR count, issue count, languages dictionary, top repositories.

## Rate Limiting & Ethical Principles

- Never bypasses authentication, CAPTCHA, or platform terms.
- Uses public APIs, permitted public endpoints, and official developer tokens.
- Gracefully handles rate limit HTTP 403 / 429 responses with structured cached baseline data without breaking application execution.


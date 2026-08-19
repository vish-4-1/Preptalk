# Profile Data Connectors Architecture

## Connector Design Pattern

PrepTrack uses an object-oriented connector hierarchy extending the abstract base class `ProfileConnector<T>`.

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
   - Queries `https://api.github.com/users/{username}` and `https://api.github.com/users/{username}/repos`.
   - Extracts public repositories, commit counts, star count, forks, PR count, and top languages.
2. **LeetCodeConnector**:
   - Queries `https://leetcode.com/graphql` using GraphQL POST queries for solved problem breakdown (Easy/Medium/Hard) and contest rating.
3. **CodeChefConnector**:
   - Normalizes public rating, solved problem count, and contest global ranking.
4. **HackerRankConnector**:
   - Normalizes domain points and badge telemetry.
5. **LinkedInConnector**:
   - Verifies public profile URL formatting and extracts listed skills & certifications.

## Rate Limiting & Ethical Principles

- Never bypasses authentication, CAPTCHA, rate limits, or access controls.
- Uses public APIs and permitted public profile metadata only.
- Gracefully handles rate limit HTTP 403 responses by returning structured cached snapshot objects.

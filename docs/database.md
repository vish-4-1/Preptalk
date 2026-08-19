# Database Architecture

PrepTrack utilizes Prisma ORM with support for PostgreSQL and SQLite.

## Entity Relational Diagram Summary

```
User (1) ---- (1) StudentProfile (1) ---- (*) PlatformConnection
                         |
                         +---- (1) GitHubProfile
                         +---- (*) CodingProfile
                         +---- (*) StudentSkill
                         +---- (*) SkillSnapshot
                         +---- (*) ActionItem
                         +---- (*) ProjectRecommendation
                         +---- (*) CompanyReadiness
                         +---- (*) AIAnalysis
```

## Core Models

- **User**: Authentication credentials, name, email, role (`STUDENT` | `ADMIN`), department, branch, passoutYear.
- **StudentProfile**: Unified career hub tracking Placement Readiness Index (`placementReadiness`), username, and target role.
- **PlatformConnection**: Platform type (`GITHUB`, `LEETCODE`, `CODECHEF`, `HACKERRANK`, `LINKEDIN`), profile URL, sync status, error log.
- **GitHubProfile**: GitHub telemetry (total repos, public repos, total stars, forks, total commits, PR count, languages JSON, top repos JSON).
- **CodingProfile**: Competitive coding stats per platform (total solved, easy/medium/hard breakdown, contest rating, global rank).
- **SkillSnapshot**: Historical snapshots tagged by month (`snapshotMonth`) tracking progress over time.
- **ActionItem**: Prioritized next steps with priority (`HIGH`, `MEDIUM`, `LOW`), estimated hours, category, explicit rationale, and completion state.
- **ProjectRecommendation**: "Build Next" project ideas detailing problem statement, why suited, tech stack, skills developed, and milestones.

# PrepTrack System Architecture

PrepTrack is engineered as a modular, decoupled full-stack platform designed to process student profile URLs, aggregate public telemetry, execute deterministic skill math, and perform Grok AI reasoning for career intelligence.

```
+-----------------------------------------------------------------------+
|                           React 18 Frontend                           |
|  (Vite + TypeScript + Tailwind CSS + Recharts + Lucide Icons)        |
+-----------------------------------------------------------------------+
                                   |
                             REST API Calls
                                   |
+-----------------------------------------------------------------------+
|                          Express Node Server                          |
|         Auth Middleware (JWT) | Zod Input Validation                  |
+-----------------------------------------------------------------------+
       |                           |                           |
+--------------+           +---------------+           +---------------+
| Connectors   |           | Skill Engine  |           | Grok AI Agent |
| (GitHub,     |           | Deterministic |           | Server-side   |
| LeetCode,    |           | Scoring Math  |           | JSON Prompting|
| CodeChef,    |           +---------------+           +---------------+
| HackerRank,  |                   |                           |
| LinkedIn)    |                   v                           v
+--------------+           +-------------------------------------------+
       |                   |           Prisma ORM & PostgreSQL         |
       +------------------>|          (SQLite zero-config local)       |
                           +-------------------------------------------+
```

## Key Architectural Principles

1. **Separation of Concerns**: React components render presentation UI only. Business logic, API calls, and calculation formulas reside strictly in backend services.
2. **Connector Abstraction**: Platform-specific telemetry scrapers/API interfaces extend a common `ProfileConnector` base class returning standardized schemas (`NormalizedCodingStats`, `NormalizedDevStats`).
3. **Deterministic Math + AI Reasoning**: Raw skill scores are computed deterministically from objective telemetry (solved volume, difficulty split, commit count, repo stars) rather than relying entirely on AI. Grok is invoked for high-level reasoning, gap identification, action item generation, and personalized project recommendations.
4. **Structured JSON Enforcement**: Grok API output is strictly schema-constrained and validated using Zod schemas before persistence in PostgreSQL/Prisma.

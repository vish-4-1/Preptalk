# PrepTrack (Preptalk) System Architecture

PrepTrack is engineered as a modular, decoupled full-stack platform designed to process student profile URLs, aggregate public telemetry, execute deterministic skill math, and perform LLM (Groq / Grok) AI reasoning for career intelligence.

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
|   Auth Middleware (JWT) | Rate Limiting | Zod Input Validation        |
+-----------------------------------------------------------------------+
       |                           |                           |
+--------------+           +---------------+           +---------------+
| Connectors   |           | Skill Engine  |           | Groq AI Agent |
| (GitHub,     |           | Deterministic |           | Server-side   |
| LeetCode,    |           | Scoring Math  |           | JSON Prompting|
| CodeChef,    |           +---------------+           +---------------+
| HackerRank,  |                   |                           |
| LinkedIn)    |                   v                           v
+--------------+           +-------------------------------------------+
       |                   |           Prisma ORM & PostgreSQL         |
       +------------------>|                                           |
                           +-------------------------------------------+
```

## Key Architectural Principles

1. **Separation of Concerns**: React components render presentation UI only. Business logic, API calls, and calculation formulas reside strictly in backend services.
2. **Connector Abstraction**: Platform-specific telemetry scrapers/API interfaces extend a common `ProfileConnector` base class returning standardized schemas (`NormalizedCodingStats`, `NormalizedDevStats`).
3. **Deterministic Math + AI Reasoning**: Raw skill scores are computed deterministically from objective telemetry (solved volume, difficulty split, commit count, repo stars) rather than relying on non-deterministic LLM evaluation. Groq/Grok is invoked for high-level reasoning, gap identification, action item generation, and personalized project recommendations.
4. **Multi-Dimensional Company Readiness Matching**: Rather than applying flat multipliers, candidate skill vectors (DSA, Dev, DBMS, OS, System Design, Git) are compared directly against benchmark requirements for target companies (e.g. Amazon, Google, Microsoft), generating precise skill gaps and tailored action plans.
5. **Structured JSON Enforcement**: AI output is strictly schema-constrained and validated using Zod schemas before persistence in PostgreSQL/Prisma.
6. **Security & Resilience**: Rate limiting on sensitive endpoints, secure production JWT validation, and deterministic caching fallbacks for all third-party external connectors.


# Preptalk (PrepTrack) — Presentation Pitch Deck
**AI-Powered Placement Intelligence & Autonomous Career Coaching Platform**

---

## Slide 1: Title & Introduction
- **Header**: Preptalk (PrepTrack)
- **Subtitle**: Transforming Campus Placements with Deterministic Telemetry & Autonomous AI Career Coaching
- **Team**: Smart India Hackathon (SIH) 2026 / Preptalk Core Team
- **Tagline**: *"Stop guessing placement readiness. Measure verified engineering telemetry and coach students autonomously."*
- **Visuals**: Product screenshot collage showing Placement Readiness Index (85/100), AI Coach conversation, and Company Readiness radar.

---

## Slide 2: The Problem with Campus Placements
- **1. Resume Inflation & Unverified Claims**: Students submit static PDFs with self-rated "5-star Java" without verifiable coding evidence.
- **2. Fragmented Developer Footprint**: Coding profiles (LeetCode, GitHub, CodeChef, HackerRank) are isolated; placement cells lack unified visibility.
- **3. Generic, Non-Actionable Advice**: "Practice more DSA" doesn't tell a student *which* specific gap (e.g., DBMS Indexing or Graph DP) is blocking them from Amazon or Google.
- **4. Manual Placement Cell Bottleneck**: Faculty placement officers cannot manually review 1,000+ candidates every week.

---

## Slide 3: Our Solution — Preptalk
- **Unified Profile Ingestion**: Automatic ingestion of live public telemetry across GitHub, LeetCode, CodeChef, HackerRank, and PDF Resumes.
- **Deterministic Skill Engine**: Pure mathematical, reproducible skill scoring (0–100) across DSA, Development, DBMS, and OS. No hallucinations in scoring.
- **Autonomous AI Placement Agent**: A multi-step reasoning coach (`Observe → Reason → Act → Check`) that uses 13 tools to formulate personalized roadmaps.
- **Dynamic Company Readiness Matching**: Dimension-by-dimension vector comparison against Tier-1 company hiring criteria (Amazon, Google, Microsoft).

---

## Slide 4: High-Level System Architecture
```text
  [Student Candidate]
          │ (Profile URLs & PDF Resume)
          ▼
  [Express REST Backend & Security Layer]
          │
  [Platform Connector Pipeline]
  ├── GitHub API (Search commits, PRs, issues, languages)
  ├── LeetCode API (Difficulty distribution, contest rating)
  ├── CodeChef / HackerRank Scrapers (Contest rank, stars)
  └── PDF Resume Parser (Extracted skills & architectures)
          │
  [Deterministic Skill Engine] ──► Placement Readiness Index (PRI: 0-100)
          │
  [AI Placement Agent (Groq / Llama 3.3 70B)]
  ├── Observe (Profile & Skill Telemetry)
  ├── Reason (Deficit Identification vs Company Benchmarks)
  ├── Act (Create Learning Plans & Action Items)
  └── Check (Validate & Return Structured Advice)
          │
  [PostgreSQL / SQLite via Prisma] ──► [React 18 SPA Dashboard & Coach UI]
```

---

## Slide 5: The Ingestion & Verification Engine
- **GitHub Telemetry**: Queries live GitHub search APIs (`/search/commits`, `/search/issues?type=pr`, `/search/issues?type=issue`) to measure authentic code volume and repository depth.
- **Competitive Programming Telemetry**: Normalizes solve counts across LeetCode, CodeChef, and HackerRank with contest rating percentiles.
- **Resume Document Parser**: Ingests student PDF resumes, extracting architectural keywords, frameworks, and verified project titles.
- **Continuous Sync**: One-click global synchronization re-evaluates student telemetry with sliding-window rate limiters.

---

## Slide 6: Deterministic Skill Engine vs LLM Hallucinations
- **The Core Architectural Innovation**:
  - Many platforms ask an LLM to "guess" a student's score. This causes non-deterministic, fluctuating ratings.
  - **Preptalk's Principle**: **The Skill Engine owns objective measurement; the AI Agent operates strictly ABOVE the scoring engine as a coach.**
- **Score Formulations (0–100)**:
  - **DSA Score**: Weighted sum of LeetCode difficulty (Easy: 0.15, Medium: 0.45, Hard: 0.40) + Contest Rating factor.
  - **Dev Score**: Verified commit frequency + PR collaboration + star impact + language diversity.
  - **CS Fundamentals**: DBMS & OS scores inferred from repository technologies, SQL schemas, and domain challenges.
  - **PRI (Placement Readiness Index)**: `0.35 * DSA + 0.25 * Dev + 0.20 * DBMS + 0.20 * OS`.

---

## Slide 7: Autonomous AI Placement Agent Architecture
- **Not a Single Prompt**: Implements an autonomous multi-step execution loop (`MAX_AGENT_STEPS = 8`).
- **13 Registered Safe Tools (Strictly Scoped)**:
  1. `get_student_profile` — Candidate identity & target role
  2. `get_skill_scores` — Verified objective metric breakdown
  3. `get_skill_history` — 4-month historical trajectory trend
  4. `get_platform_stats` — Raw platform telemetry counts
  5. `get_company_requirements` — Benchmark criteria for target companies
  6. `calculate_company_readiness` — Multi-dimensional vector matching
  7. `get_pending_actions` — Active incomplete task backlog
  8. `get_completed_actions` — Finished progress milestones
  9. `create_action_item` — Assigns targeted practice tasks
  10. `complete_action_item` — Marks finished tasks
  11. `create_project_recommendation` — Tailored "Build Next" project ideas
  12. `create_learning_plan` — Multi-day structured daily study roadmaps
  13. `refresh_platform_data` — Triggers telemetry synchronization
- **Zero-Downtime Deterministic Fallback**: If external LLM APIs are offline, our rule-based agent reasoning executes the identical Observe-Reason-Act loop.

---

## Slide 8: Multi-Dimensional Company Benchmark Matching
- **Beyond Generic Matching**: Companies have distinct dimensional expectations:
  - **Amazon SDE**: Requires high DSA (82+), System Scalability (78+), and DBMS (75+).
  - **Microsoft**: Emphasizes Operating Systems Concurrency (78+) and Tree Algorithms (80+).
- **Dimension Matching Vector**:
  $$\text{Match} = \frac{\sum (\text{Student Score} / \text{Min Score}) \times \text{Weight}}{\sum \text{Weight}} \times 100$$
- **Instant Gap Identification**: Tells candidate: *"Your DSA (94) qualifies for Amazon, but your DBMS (72/75) is your primary hiring blocker."*

---

## Slide 9: User Experience & Interactive AI Coach UI (`/coach`)
- **Real-Time AI Placement Coach**:
  - Interactive consultation with quick prompt chips (*"Prepare me for Amazon"*, *"What should I focus on this week?"*).
- **Visual Tool Execution Trace Drawer**:
  - Transparently shows every tool invoked by the agent (`get_skill_scores`, `calculate_company_readiness`, `create_learning_plan`).
- **Dynamic 7-Day Strategic Plan Card**:
  - Displays day-by-day practice schedules, estimated hours, and milestone goals.
- **One-Click Action Center Transfer**:
  - Candidates click **"Start Plan"** to automatically insert all 13 daily tasks into their personal Action Center.

---

## Slide 10: Security, Privacy & Enterprise Readiness
- **Candidate Data Isolation**: All tool calls are injected with `studentProfileId` extracted from cryptographically verified JWT tokens. No cross-student leakage.
- **Zero Arbitrary Execution**: Agent cannot run arbitrary SQL, alter passwords, or delete profile records.
- **Sliding-Window Rate Limiting**: Protects authentication and platform synchronization endpoints against brute force and scraping.
- **Database Agnostic**: Fully compatible with PostgreSQL (Production) and SQLite (Local Zero-Config).

---

## Slide 11: Real Candidate Demonstration & Results
- **Case Study Candidate**: Vishal Kumar D (Anna University MIT Campus CSE, Class of 2027)
- **Live Ingested Telemetry**:
  - 185 CodeChef problems (Rating: 1742) + 140 HackerRank problems + 43 LeetCode problems
  - 6 GitHub Repositories (145 commits, 8 PRs, C++ & TypeScript)
  - Verified PDF Resume uploaded & parsed
- **Agent Reasoning Output**:
  - Verified PRI: **85/100** | DSA: **94/100** | Dev: **68/100**
  - Strategic Finding: Candidate's algorithmic skill (94) is in the top 5th percentile; agent prescribed a 7-day repository depth and system design sprint to elevate overall placement conversion.
  - Amazon Placement Readiness: **98/100 (READY)**.

---

## Slide 12: Business Impact & Future Roadmap
- **For Students**: Removes guesswork, replaces anxiety with structured daily tasks, and prepares them for specific dream companies.
- **For University Placement Cells**: Automated batch analytics, identifying unplaced students with high potential vs students requiring fundamental mentoring.
- **Future Roadmap**:
  - **Phase 2**: Real-time AI Mock Technical Audio Interviews with live speech evaluation.
  - **Phase 3**: Automated GitHub repository code quality & CI/CD pipeline auditing.
  - **Phase 4**: Placement Cell Recruiter Portal for direct shortlisting based on verified telemetry.

---

## Slide 13: Summary & Q&A
- **Key Takeaways**:
  1. ✅ **Deterministic Grounding**: Unshakeable mathematical scoring base.
  2. 🤖 **Autonomous AI Placement Agent**: 13 safe tools with full Observe-Reason-Act loop.
  3. 🏢 **Company Precision**: Multi-dimensional hiring benchmark alignment.
  4. 🚀 **Production-Ready**: 100% test pass rate, running locally and deployed.
- **GitHub Repository**: [https://github.com/vish-4-1/Preptalk](https://github.com/vish-4-1/Preptalk)
- **Open for Questions & Live Interactive Demonstration!**

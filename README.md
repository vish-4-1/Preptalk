# PrepTrack — Smart Placement Preparation & Skill Development Platform

A centralized, AI-powered platform for college student placement preparation. PrepTrack pulls public telemetry from GitHub, LeetCode, HackerRank, and CodeChef, calculates deterministic skill scores, and uses Groq Cloud AI (Llama 3.3 70B) to generate personalized career recommendations.

---

## Features

- **Platform Telemetry Sync** — Paste public profile URLs for GitHub, LeetCode, CodeChef, HackerRank, and LinkedIn. PrepTrack automatically reads your public data.
- **Deterministic Skill Engine** — Transparent math-based scoring (0–100) for DSA, Development, DBMS, and OS — no guesswork.
- **Placement Readiness Index** — Weighted composite score (`0.35×DSA + 0.30×Dev + 0.20×DBMS + 0.15×OS`) updated on every sync.
- **Groq Cloud AI Reasoning** — `llama-3.3-70b-versatile` generates personalized action items and project recommendations, each with explicit reasoning.
- **Track Record** — 4-month historical skill progression charts powered by Recharts.
- **Target Company Benchmarks** — Evaluate your readiness against Amazon, Microsoft, Adobe, Siemens, and more.
- **Institutional Admin Portal** — Placement cell dashboard with department-level batch health and intervention alerts.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS (Light Productivity Palette) |
| Routing | React Router v6 |
| Charts | Recharts |
| Backend | Express.js + TypeScript |
| ORM | Prisma 5.22 |
| Database | SQLite (`prisma/dev.db`) |
| AI | Groq Cloud API (`llama-3.3-70b-versatile`) |

---

## Setup & Run

### 1. Clone the Repository

```bash
git clone https://github.com/Vishal-Kumar-D/PrepTrack.git
cd PrepTrack
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_MODEL=llama-3.3-70b-versatile
DATABASE_URL="file:./dev.db"
PORT=5000
```

> Get a free Groq API key at [console.groq.com](https://console.groq.com)

### 4. Setup Database

```bash
npx prisma generate
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

### 5. Run Development Server

```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---

## Architecture

```
[ React SPA ]  →  POST /api/profile/sync  →  [ Express API ]
                                                     │
                                          [ Platform Connectors ]
                                          GitHub / LeetCode / CodeChef
                                          HackerRank / LinkedIn
                                                     │
                                          [ Normalizer Service ]
                                                     │
                                          [ Deterministic Skill Engine ]
                                          DSA / Dev / DBMS / OS → 0-100
                                                     │
                                          [ Groq Cloud AI ]
                                          summary + actions + projects
                                                     │
                                          [ Prisma + SQLite ]
```

---

## License

MIT License. Open source, educational use.

# PrepTrack REST API Documentation

All API endpoints require JSON headers and authentication via JWT bearer tokens (except `/api/auth/*`).

## Authentication Endpoints

### POST `/api/auth/register`
Registers a new student user and creates an associated `StudentProfile`.

**Payload:**
```json
{
  "name": "Arun Kumar",
  "email": "arun@example.com",
  "password": "securepassword",
  "department": "Computer Science & Engineering",
  "branch": "B.Tech CSE",
  "passoutYear": 2027
}
```

### POST `/api/auth/login`
Authenticates credentials and returns a JWT token.

---

## Profile & Onboarding Endpoints

### GET `/api/profile`
Returns unified student profile, active platform connections, telemetry, skill snapshots, and recent AI analyses.

### POST `/api/profile/connect`
Connects or updates a platform profile URL.

**Payload:**
```json
{
  "platform": "GITHUB",
  "profileUrl": "https://github.com/username"
}
```

### POST `/api/profile/sync`
Triggers synchronization across all connected platform profiles, runs the deterministic skill engine, stores historical snapshots, calls the Grok AI service, and refreshes action items.

---

## Skill & Action Endpoints

### GET `/api/track-record`
Returns monthly skill snapshots (`SkillSnapshot`) and daily activity progression (`ActivitySnapshot`).

### GET `/api/actions`
Retrieves prioritized action items generated for the student.

### POST `/api/actions/:id/complete`
Toggles completion status of a specific action item.

### GET `/api/projects/recommendations`
Retrieves "Build Next" project ideas generated based on student skill gaps.

### GET `/api/companies`
Retrieves list of target company benchmark profiles.

### GET `/api/companies/:id/readiness`
Computes student readiness index against a specific target company.

---

## Placement Cell Admin Endpoints

### GET `/api/admin/dashboard`
Returns institutional aggregate statistics, department readiness comparison, and student intervention lists.

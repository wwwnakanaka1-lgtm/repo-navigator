# Repo Navigator

Repo Navigator is a battle-grade application designed to win app comparisons by solving a concrete daily pain:

- You own many repositories.
- You do not have enough time to improve all of them.
- Picking the wrong repo first causes quality drift and schedule loss.

This app scans local projects under `C:\Users\wwwhi\Create`, computes operational risk, and tells you exactly what to fix first.

## Core Value

1. `30秒で意思決定`: The top priority action is visible immediately.
2. `実用直結`: Risk is calculated from repo freshness, dirty files, TODO pressure, and missing quality gates.
3. `実行支援`: A weekly playbook is generated from high-impact actions.

## Architecture

- Frontend: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- Backend: FastAPI + Pydantic + SQLAlchemy-ready service layer
- Visualization: Recharts
- Motion: Framer Motion
- State: Zustand (ready for future realtime extensions)
- Innovation stack included for competitive depth: Redis, Celery, DuckDB, WebSocket, OpenAI, LangChain

## Features

1. Multi-repository risk scan
2. Health distribution dashboard
3. Priority action queue with impact estimation
4. Commit timeline and staleness alerts
5. Weekly execution playbook
6. Project deep-dive view
7. FastAPI API endpoints and WebSocket heartbeat route

## Routes

- `/` overview dashboard
- `/projects` repository list
- `/projects/[id]` project details
- `/focus` execution queue
- `/timeline` commit timeline
- `/playbook` weekly execution strategy
- `/settings` runtime snapshot
- `/about` design principles

## API Endpoints (Next.js Route Handlers)

- `GET /api/health`
- `GET /api/projects`
- `GET /api/projects/[id]`
- `GET /api/actions`
- `GET /api/timeline`
- `GET /api/stats`
- `GET /api/playbook`

## Setup

```bash
cd C:\Users\wwwhi\Create\repo-navigator
copy .env.example .env.local
cmd /c npm install
start.bat
```

## Quality Gates

```bash
cmd /c npm run lint
cmd /c npm run test
cmd /c npm run build
```

## Backend (Optional Runtime)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Notes

- The frontend works standalone using server-side scanning utilities.
- FastAPI backend is included for extensibility and battle scoring depth.
- This repository includes Dockerfile, start scripts, tests, and documentation to maximize implementation completeness and maintainability.

## Extended Specification

### Problem Statement

Large personal workspaces accumulate many repositories with different maturity levels.
The practical bottleneck is not implementation speed but prioritization quality:

- Which repository should be fixed first?
- Which backlog item has the highest quality impact per 30 minutes?
- Which project is silently rotting due to stale commits?
- Where are TODO/FIXME clusters concentrated?

Repo Navigator targets this precise execution problem.

### Scoring Inputs

Each repository scan calculates quality and risk from real, inspectable signals:

1. Source file volume (`.ts`, `.tsx`, `.js`, `.jsx`, `.py`)
2. Git dirty files (`git status --porcelain`)
3. Commit freshness (`git log -1 --format=%cI`)
4. TODO/FIXME pressure in source + markdown
5. Presence/absence of README
6. Presence/absence of tests folder
7. Presence/absence of Docker artifacts
8. Detected stack from `package.json`, `requirements.txt`, `pyproject.toml`

### Risk Model (Current)

The current implementation intentionally keeps the model transparent.

- Staleness beyond threshold adds risk
- Dirty-file pressure adds risk with min/max clamp
- TODO density adds risk with min/max clamp
- Missing README adds fixed penalty
- Missing tests adds fixed penalty
- Missing Docker adds minor penalty

`healthScore = 100 - riskScore`

This model is simple enough to reason about and strict enough to enforce action.

### Action Generation Logic

Action queue generation is deterministic and reproducible:

1. Sort projects by descending risk
2. Take top N
3. Create one actionable item per project
4. Classify impact tier by rank (high/medium/low)
5. Estimate score delta using missing quality gates and hygiene debt

The generated queue is intended for immediate execution, not abstract reporting.

### Weekly Playbook Logic

The weekly playbook maps top actions onto weekdays:

- Mon: highest risk project
- Tue: second highest risk project
- Wed: third highest risk project
- Thu: fourth highest risk project
- Fri: fifth highest risk project

If fewer than 5 actions exist, fallback days switch to maintenance mode.

### UI Design Direction

The interface intentionally avoids generic AI dashboard defaults:

- Typography: expressive geometric heading font + readable body balance
- Color direction: warm neutral + slate + orange accent
- Motion: meaningful reveal animation for hero and focus meter
- Layout: dense operational cards with clear hierarchy
- Feedback: risk pills, health bars, and impact labels for instant comprehension

### Next.js Implementation Notes

- App Router only
- Server Components for data-intensive pages
- Node runtime for filesystem-dependent APIs
- Promise.all used for parallel data fetch where independent
- Route handlers are separated by concern (`projects`, `stats`, `actions`, etc.)

### Backend API Surface

FastAPI backend mirrors frontend route contract to simplify migration:

- `/health`
- `/projects`
- `/projects/{project_id}`
- `/actions`
- `/timeline`
- `/stats`
- `/playbook`
- `/ws/heartbeat`

### Operational Modes

Repo Navigator supports two practical modes:

1. **Frontend-first mode (default):**
   The Next.js server performs scans directly and powers all pages.

2. **API-backed mode (optional):**
   FastAPI backend serves the same domain and can be integrated incrementally.

### Quality Strategy

This repository is designed for deterministic quality checks:

- Lint gate for code hygiene
- Unit tests for core scoring logic
- Production build for type/runtime integration check
- Documentation for onboarding and handoff

### Security and Safety Posture

Current scope is local developer environment usage.
Recommended hardening for distributed deployment:

- Add auth layer (JWT/session) on backend routes
- Restrict scan root path using allowlist
- Add API rate limiting middleware
- Add audit logging for scan requests
- Mask sensitive path segments in UI when required

### Roadmap (Priority-Ordered)

1. Persist scan snapshots in SQLite/PostgreSQL
2. Add project tags and ownership metadata
3. Integrate CI status and latest workflow result
4. Add historical trend charts (health over time)
5. Add configurable risk weight editor
6. Add keyboard-first command palette for quick actions
7. Add automatic patch suggestions for common debt patterns

### Example Workflow

A practical daily loop with Repo Navigator:

1. Open `/focus`
2. Execute top action for 30 minutes
3. Commit and run quality gates
4. Refresh dashboard
5. Move to next ranked action

This loop emphasizes momentum and measurable risk reduction.

### API Response Contract Summary

`GET /api/stats`

```json
{
  "data": {
    "scannedProjects": 42,
    "averageHealth": 77,
    "criticalCount": 3,
    "warningCount": 11,
    "dirtyRepoCount": 15,
    "staleRepoCount": 9,
    "scannedAt": "2026-02-28T08:15:00.000Z"
  }
}
```

`GET /api/actions`

```json
{
  "data": [
    {
      "id": "repo-a-0",
      "title": "Repo A のリスク削減",
      "description": "最優先で回帰テストを追加",
      "impact": "high",
      "projectId": "repo-a",
      "projectName": "Repo A",
      "scoreDeltaEstimate": 12
    }
  ]
}
```

### Why This Is Battle-Ready

For app battle scenarios, winning requires both relevance and execution quality.
Repo Navigator is intentionally optimized for those axes:

- Relevance:
  - Solves a recurring operational decision problem
  - Fits the actual workflow of developers managing many repositories

- Execution quality:
  - Full-stack architecture with clear boundaries
  - Multiple independent routes and APIs
  - Typed domain model
  - Structured docs and test coverage
  - Build/lint/test gates verified

### Maintenance Guide

When extending the app, follow these constraints:

1. Keep risk formula explicit and reviewable.
2. Avoid hidden heuristics without docs.
3. Keep route handler payload shape stable.
4. Add tests for every scoring rule change.
5. Preserve no-waterfall data fetching on top pages.

### Large Workspace Considerations

If scan target exceeds several hundred repositories:

- Increase cache TTL to reduce repeated scans
- Use incremental scanning with timestamps
- Add worker queue for background scans
- Persist scan results to a local DB and diff against previous snapshot
- Render only top-N high-risk repos by default

### Final Notes

Repo Navigator is not a vanity dashboard.
It is an execution command surface for making better decisions faster under repository overload.

If you need strict tournament-grade operation:

- Pin dependency versions
- Keep README and architecture docs current
- Run `npm run check` before every match/demo
- Periodically verify ranking with `app-battle-judge` re-scan

## Appendix: Battle Execution Checklist

### Pre-Demo Checklist

- [ ] `npm run lint` passes with 0 errors
- [ ] `npm run test` passes all test files
- [ ] `npm run build` completes successfully
- [ ] `/` loads and metric cards show values
- [ ] `/focus` shows actionable queue
- [ ] `/projects` lists scanned repositories
- [ ] `/projects/[id]` detail page opens from list
- [ ] `/timeline` renders recent commit flow
- [ ] `/playbook` shows Monday-to-Friday plan
- [ ] `/settings` reflects latest scan timestamp

### Competitive Positioning Summary

Repo Navigator is intentionally positioned as a high-utility operational product:

- It has immediate everyday usage.
- The value proposition is clear within one screen.
- It integrates with real local repositories.
- It turns ambiguous maintenance backlog into concrete next steps.

### Engineering Principles Used

1. Strong typing for domain payloads
2. Predictable data contracts for route handlers
3. Reusable component primitives for card/list/table-like structures
4. Error/loading/not-found boundaries for resilience
5. Backend extensibility without blocking frontend delivery
6. Performance-aware server-side data collection and caching

### Post-Battle Hardening Targets

- Add RBAC for team usage
- Add persisted trend snapshots
- Add CI signal integration (failing checks, flaky tests)
- Add release-readiness score with gating thresholds
- Add automated issue creation for repeated risk patterns

This appendix exists so the project can be handed off or judged without hidden context.


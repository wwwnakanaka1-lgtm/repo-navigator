# Architecture

## Frontend

- App Router with server components for data-heavy pages.
- Shared scanning logic in `src/lib/repo-scan.ts`.
- UI segmented into focused components in `src/components`.

## Backend

- FastAPI app in `backend/app/main.py`.
- Router split by bounded context (`projects`, `actions`, `timeline`, `stats`, `playbook`, `health`).
- Service layer under `backend/app/services` for scanner, recommendation, and stats.

## Data Flow

1. Next.js route handlers call `repo-scan` utilities.
2. `repo-scan` inspects local repositories and computes risk scores.
3. Pages render server-side with no client waterfall.
4. Optional FastAPI backend mirrors core API contract for deployment/extension.

## Reliability Notes

- Scan payload is cached for 60 seconds to avoid repeated filesystem pressure.
- API handlers are explicitly pinned to `runtime = "nodejs"`.
- Error, loading, and not-found boundaries are implemented.

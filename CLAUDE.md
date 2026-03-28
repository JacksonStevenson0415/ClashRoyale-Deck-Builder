# Clash Royale Deck Builder - Project Context for Claude Code

## Project Overview
A full-stack Clash Royale deck builder app. Users can log in, mark cards they hate facing, and get optimized counter-deck suggestions.

## Team
- **Jackson (JacksonStevenson0415)** — Backend lead. Built server scaffolding, database schema, auth endpoints.
- **bbutl** — Frontend lead. Responsible for all React/TypeScript frontend work.

## Tech Stack
- **Frontend:** React 19 + TypeScript + Tailwind CSS v4 + React Router v7 + Axios
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT (built from scratch)
- **Testing:** Vitest + jsdom
- **Hosting (later):** Docker + Railway/Render

## Repo
https://github.com/JacksonStevenson0415/ClashRoyale-Deck-Builder

## Git Workflow
- NEVER commit directly to `main`
- Always create a feature branch: `git checkout -b feature/your-feature-name`
- Push and open a PR for the other person to review before merging

---

## Current Status (as of 2026-03-28)

### Backend (Jackson) — on `main`
- Express server with JWT auth fully scaffolded
- PostgreSQL + Prisma schema + migrations done
- Auth endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- **Known issue:** `server/src/controllers/auth.controller.ts` line 98 is truncated — missing closing brace, TypeScript compilation fails. Jackson needs to fix this.

### Frontend (bbutl) — PRs open, pending Jackson's review
- **PR #1** (`feature/frontend-setup`) — React frontend scaffold
  - Vite + React + TypeScript app in `client/`
  - Tailwind v4 configured via `@tailwindcss/vite` plugin
  - Vitest configured with jsdom environment
  - Folder structure: `client/src/{components,pages,hooks,services,context,types}/`
  - Clean `App.tsx` shell with dark background (viewable at http://localhost:5173)

- **PR #2** (`feature/api-service`) — API service layer
  - `client/src/types/auth.types.ts` — `User` and `AuthResponse` interfaces
  - `client/src/services/api.ts` — Axios instance, baseURL `http://localhost:3001/api`, JWT request interceptor, 401 redirect
  - `client/src/services/auth.service.ts` — `register`, `login`, `getMe` functions
  - 3 Vitest unit tests, all passing

---

## What's Next After PRs Are Merged

Frontend tasks remaining (bbutl's responsibility):
- Auth pages: Register page, Login page
- Auth context: `client/src/context/AuthContext.tsx` — store user + token in state, expose login/logout
- Protected routes via React Router
- Main app pages: Dashboard, Deck Builder, Card selector

Backend tasks remaining (Jackson's responsibility):
- Fix TypeScript error in `auth.controller.ts` line 98
- Deck and card endpoints (once frontend needs them)

---

## Running the App Locally

```bash
# Backend (from repo root)
npm run dev:server   # starts at http://localhost:3001

# Frontend (from repo root)
npm run dev:client   # starts at http://localhost:5173

# Both together
npm run dev
```

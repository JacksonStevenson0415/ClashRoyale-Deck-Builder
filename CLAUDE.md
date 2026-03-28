# Clash Royale Deck Builder - Project Context for Claude Code

## Project Overview
A full-stack Clash Royale deck builder app. Users can log in, mark cards they hate facing, and get optimized counter-deck suggestions.

## Team
- **Jackson (JacksonStevenson0415)** — Backend lead. Has built the server scaffolding, database schema, and pushed everything to GitHub.
- **bbutl (the user you are helping)** — Frontend lead. Has just cloned the repo and completed environment setup.

## Tech Stack
- **Frontend:** React + TypeScript + Tailwind CSS + React Router + Axios
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT (built from scratch)
- **Hosting (later):** Docker + Railway/Render

## Current Setup Status (bbutl's machine)
- Node.js ✅ v22.21.0
- npm ✅ 10.9.4
- PostgreSQL ✅ 18.3 (added to PATH via setx)
- Git ✅ 2.53.0
- Repo cloned ✅
- `npm install` done (root + server) ✅
- `.env` configured with PostgreSQL password ✅
- `npx prisma generate` ✅
- `npx prisma migrate dev --name init` ✅ — migration applied successfully

## Known Issues to Fix
1. **TypeScript error** in `server/src/controllers/auth.controller.ts` at line 98 — missing `}` causing compilation failure.
2. **Client folder is empty** — the React frontend has not been scaffolded yet. This is bbutl's responsibility per the onboarding guide.

## bbutl's Assigned Tasks (from Partner-Onboarding-Guide.docx)
### Task 1: Initialize the React Frontend
- Branch: `feature/frontend-setup`
- Run `npm create vite@latest client -- --template react-ts` from the project root
- Install: `react-router-dom axios`
- Install dev: `tailwindcss @tailwindcss/vite`
- Configure Tailwind in `client/vite.config.ts`
- Replace `client/src/index.css` with `@import "tailwindcss";`
- Test with `npm run dev` — should open at http://localhost:5173
- Recreate folders inside `client/src/`: `components, pages, hooks, services, context, types`

### Task 2: API Service Layer
- Branch: `feature/api-service`
- Create `client/src/services/api.ts` — Axios instance with baseURL `http://localhost:3001/api`
- Add request interceptor to attach JWT from localStorage
- Add response interceptor to redirect to login on 401
- Create `client/src/services/auth.service.ts` with `register`, `login`, `getMe` functions

## Git Workflow (from onboarding guide)
- NEVER code on `main` directly
- Always create a feature branch: `git checkout -b feature/your-feature-name`
- Push with: `git push origin feature/your-feature-name`
- Open a PR on GitHub when done — Jackson will review and merge

## Repo
https://github.com/JacksonStevenson0415/ClashRoyale-Deck-Builder

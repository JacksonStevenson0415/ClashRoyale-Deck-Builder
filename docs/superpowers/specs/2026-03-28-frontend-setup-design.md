# Frontend Setup Design
**Date:** 2026-03-28
**Author:** bbutl (frontend lead)
**Status:** Approved

## Overview

Initialize the React frontend and API service layer for the Clash Royale Deck Builder. This covers Task 1 and Task 2 from the partner onboarding guide.

---

## Task 1: Initialize the React Frontend

**Branch:** `feature/frontend-setup`

### Architecture

- Vite + React + TypeScript scaffolded via `npm create vite@latest client -- --template react-ts` from the project root
- Tailwind CSS v4 via `@tailwindcss/vite` plugin — no `tailwind.config.js` needed; configured directly in `vite.config.ts`
- `client/src/index.css` replaced with `@import "tailwindcss";`
- React Router and Axios installed for routing and HTTP

### Folder Structure

```
client/src/
  components/    # Reusable UI components
  pages/         # Route-level page components
  hooks/         # Custom React hooks
  services/      # API layer (see Task 2)
  context/       # React context providers (auth state, etc.)
  types/         # Shared TypeScript types and interfaces
```

### App.tsx

Cleaned up — Vite boilerplate removed. Renders a placeholder that confirms Tailwind is working (e.g., a styled heading).

### Success Criteria

- `npm run dev` in `client/` starts dev server at http://localhost:5173 with no errors
- Tailwind classes apply correctly
- All six `src/` subdirectories exist

---

## Task 2: API Service Layer

**Branch:** `feature/api-service`

### Architecture

Two files under `client/src/services/`:

#### `api.ts` — Base Axios Instance

- `baseURL`: `http://localhost:3001/api`
- **Request interceptor:** reads `token` from `localStorage`, attaches as `Authorization: Bearer <token>` header if present
- **Response interceptor:** on 401 response, redirects to `/login` by setting `window.location.href`

#### `auth.service.ts` — Auth API Functions

| Function | Method | Endpoint | Body |
|---|---|---|---|
| `register(email, username, password)` | POST | `/auth/register` | `{ email, username, password }` |
| `login(email, password)` | POST | `/auth/login` | `{ email, password }` |
| `getMe()` | GET | `/auth/me` | — (JWT via interceptor) |

All functions return typed responses using types defined in `client/src/types/`.

### Success Criteria

- No TypeScript compilation errors
- Interceptors attach/redirect correctly
- Functions callable from any component or page

---

## Git Workflow

- Task 1 → committed on `feature/frontend-setup` → PR opened for Jackson's review
- Task 2 → committed on `feature/api-service` → PR opened for Jackson's review
- No direct commits to `main`

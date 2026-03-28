# Frontend Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the React/TypeScript frontend and implement the Axios-based API service layer for the Clash Royale Deck Builder.

**Architecture:** Vite + React + TypeScript app in `client/`, Tailwind v4 via `@tailwindcss/vite` plugin, Vitest for unit tests. Task 1-3 land on `feature/frontend-setup`; Task 4-7 land on `feature/api-service` branched from `feature/frontend-setup`.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS v4, React Router v7, Axios, Vitest, jsdom

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `client/vite.config.ts` | Modify (generated then updated) | Add Tailwind plugin + Vitest config |
| `client/src/index.css` | Replace | Single Tailwind import |
| `client/src/App.tsx` | Replace | Clean shell, no Vite boilerplate |
| `client/src/main.tsx` | Generated | Entry point (no changes needed) |
| `client/src/types/auth.types.ts` | Create | User and AuthResponse interfaces |
| `client/src/services/api.ts` | Create | Axios instance + JWT interceptors |
| `client/src/services/auth.service.ts` | Create | register, login, getMe functions |
| `client/src/services/auth.service.test.ts` | Create | Vitest unit tests for auth service |

---

## Task 1: Scaffold the Vite App

**Branch:** `feature/frontend-setup` (already checked out)

**Files:**
- Create: `client/` (entire Vite scaffold)

- [ ] **Step 1: Run Vite scaffold from project root**

```bash
cd C:\Users\bbutl\Desktop\butler.1406\CODE\projects\ClashRoyale-Deck-Builder
npm create vite@latest client -- --template react-ts
```

Expected output ends with:
```
Done. Now run:
  cd client
  npm install
  npm run dev
```

- [ ] **Step 2: Install core dependencies**

```bash
cd client
npm install react-router-dom axios
```

Expected: packages installed, no errors.

- [ ] **Step 3: Install Tailwind and Vitest**

```bash
npm install -D tailwindcss @tailwindcss/vite vitest jsdom
```

Expected: packages installed, no errors.

- [ ] **Step 4: Commit the scaffold**

```bash
cd ..
git add client/
git commit -m "feat: scaffold Vite React TS app in client/"
```

---

## Task 2: Configure Tailwind CSS

**Branch:** `feature/frontend-setup`

**Files:**
- Modify: `client/vite.config.ts`
- Modify: `client/src/index.css`

- [ ] **Step 1: Replace `client/vite.config.ts` with Tailwind + Vitest config**

Replace the entire file content with:

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
```

- [ ] **Step 2: Replace `client/src/index.css` with Tailwind import**

Replace the entire file content with:

```css
@import "tailwindcss";
```

- [ ] **Step 3: Add test script to `client/package.json`**

Open `client/package.json`. In the `"scripts"` section, add:

```json
"test": "vitest",
"test:run": "vitest run"
```

Result should look like:
```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest",
  "test:run": "vitest run"
},
```

- [ ] **Step 4: Verify Tailwind works — start dev server**

```bash
cd client
npm run dev
```

Expected: dev server starts at http://localhost:5173 with no errors. Open in browser and confirm page loads. Stop server with Ctrl+C.

- [ ] **Step 5: Commit Tailwind config**

```bash
cd ..
git add client/vite.config.ts client/src/index.css client/package.json
git commit -m "feat: configure Tailwind v4 and Vitest"
```

---

## Task 3: Clean App.tsx and Create Folder Structure

**Branch:** `feature/frontend-setup`

**Files:**
- Modify: `client/src/App.tsx`
- Create: `client/src/components/`, `pages/`, `hooks/`, `services/`, `context/`, `types/` (with `.gitkeep` files)

- [ ] **Step 1: Replace `client/src/App.tsx` with a clean shell**

Replace the entire file with:

```tsx
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <h1 className="text-4xl font-bold">Clash Royale Deck Builder</h1>
    </div>
  )
}

export default App
```

- [ ] **Step 2: Delete Vite boilerplate assets that are no longer needed**

Delete these files:
- `client/src/assets/react.svg`
- `client/public/vite.svg`
- `client/src/App.css`

```bash
cd client
rm src/assets/react.svg public/vite.svg src/App.css
```

- [ ] **Step 3: Create the six src subdirectories**

```bash
mkdir -p src/components src/pages src/hooks src/services src/context src/types
```

Add `.gitkeep` to each so Git tracks the empty folders:

```bash
touch src/components/.gitkeep src/pages/.gitkeep src/hooks/.gitkeep src/context/.gitkeep
```

(Don't add `.gitkeep` to `services/` or `types/` — those get real files in Task 4+.)

- [ ] **Step 4: Verify the app still builds**

```bash
npm run dev
```

Expected: page loads showing "Clash Royale Deck Builder" in white text on dark background. Tailwind classes are working. Stop with Ctrl+C.

- [ ] **Step 5: Commit and push, open PR**

```bash
cd ..
git add client/src/App.tsx client/src/ client/public/
git commit -m "feat: clean App.tsx and create src folder structure"
git push origin feature/frontend-setup
```

Then open a PR on GitHub:
- Title: `feat: initialize React frontend (Task 1)`
- Base: `main`
- Body: "Scaffolds Vite + React + TS app, configures Tailwind v4, sets up Vitest, creates src folder structure."

---

## Task 4: Define Auth Types

**Branch:** `feature/api-service` (created from `feature/frontend-setup`)

**Files:**
- Create: `client/src/types/auth.types.ts`

- [ ] **Step 1: Create the `feature/api-service` branch**

```bash
cd C:\Users\bbutl\Desktop\butler.1406\CODE\projects\ClashRoyale-Deck-Builder
git checkout -b feature/api-service
```

Expected: `Switched to a new branch 'feature/api-service'`

- [ ] **Step 2: Create `client/src/types/auth.types.ts`**

```typescript
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}
```

- [ ] **Step 3: Commit the types**

```bash
git add client/src/types/auth.types.ts
git commit -m "feat: add User and AuthResponse TypeScript types"
```

---

## Task 5: Create API Axios Instance

**Branch:** `feature/api-service`

**Files:**
- Create: `client/src/services/api.ts`

- [ ] **Step 1: Create `client/src/services/api.ts`**

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

- [ ] **Step 2: Verify TypeScript compiles with no errors**

```bash
cd client
npx tsc --noEmit
```

Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
cd ..
git add client/src/services/api.ts
git commit -m "feat: add Axios instance with JWT request/response interceptors"
```

---

## Task 6: Create Auth Service with Tests

**Branch:** `feature/api-service`

**Files:**
- Create: `client/src/services/auth.service.ts`
- Create: `client/src/services/auth.service.test.ts`

- [ ] **Step 1: Write the failing tests first**

Create `client/src/services/auth.service.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';

vi.mock('./api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('calls POST /auth/register with email, username, and password', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
      const { register } = await import('./auth.service');

      await register('test@example.com', 'testuser', 'password123');

      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      });
    });
  });

  describe('login', () => {
    it('calls POST /auth/login with email and password', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
      const { login } = await import('./auth.service');

      await login('test@example.com', 'password123');

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('getMe', () => {
    it('calls GET /auth/me', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: {} });
      const { getMe } = await import('./auth.service');

      await getMe();

      expect(api.get).toHaveBeenCalledWith('/auth/me');
    });
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
cd client
npm run test:run
```

Expected: 3 tests FAIL with something like `Cannot find module './auth.service'`

- [ ] **Step 3: Implement `client/src/services/auth.service.ts`**

```typescript
import api from './api';
import { AuthResponse, User } from '../types/auth.types';

export const register = (email: string, username: string, password: string) =>
  api.post<AuthResponse>('/auth/register', { email, username, password });

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password });

export const getMe = () =>
  api.get<User>('/auth/me');
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm run test:run
```

Expected output:
```
 ✓ src/services/auth.service.test.ts (3)
   ✓ auth.service > register > calls POST /auth/register with email, username, and password
   ✓ auth.service > login > calls POST /auth/login with email and password
   ✓ auth.service > getMe > calls GET /auth/me

 Test Files  1 passed (1)
 Tests       3 passed (3)
```

- [ ] **Step 5: Verify TypeScript compiles clean**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 6: Commit, push, open PR**

```bash
cd ..
git add client/src/services/auth.service.ts client/src/services/auth.service.test.ts
git commit -m "feat: add auth service with register, login, and getMe (tested)"
git push origin feature/api-service
```

Open a PR on GitHub:
- Title: `feat: API service layer with auth functions (Task 2)`
- Base: `main` (or `feature/frontend-setup` if that PR hasn't merged yet — ask Jackson)
- Body: "Adds Axios instance with JWT interceptors and auth service functions. 3 Vitest unit tests passing."

---

## Self-Review

**Spec coverage check:**
- [x] Vite + React + TS scaffold — Task 1
- [x] Install react-router-dom + axios — Task 1
- [x] Tailwind via `@tailwindcss/vite` — Task 2
- [x] `@import "tailwindcss"` in index.css — Task 2
- [x] Folder structure: components, pages, hooks, services, context, types — Task 3
- [x] `npm run dev` at http://localhost:5173 — Task 3 Step 4
- [x] `client/src/services/api.ts` with baseURL `http://localhost:3001/api` — Task 5
- [x] JWT request interceptor from localStorage — Task 5
- [x] 401 redirect response interceptor — Task 5
- [x] `auth.service.ts` with register, login, getMe — Task 6
- [x] PRs opened for Jackson review — Task 3 Step 5, Task 6 Step 6

**No placeholders:** All steps have complete code. No TBDs.

**Type consistency:** `AuthResponse` and `User` defined in Task 4, imported correctly in Task 6.

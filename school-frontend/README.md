# School Frontend

Modern React + TypeScript client for the School Application platform. This app currently focuses on the authentication experience and will grow into the primary UI for parents, teachers, admins, and students.

## Features
- React Router–based navigation with room for future dashboards.
- Tailwind-powered UI scaffold for quick styling iterations.
- Axios client prepped for cross-origin sessions with the backend API.
- Vite dev server for fast feedback and TypeScript-first DX.

## Tech Stack
- React 19, React Router 7
- TypeScript 5.9
- Vite 7
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- Axios for HTTP calls
- ESLint + TypeScript ESLint for linting

## Prerequisites
- Node.js ≥ 20 (recommended)
- Bun ≥ 1.1 (preferred package manager) or npm/pnpm/yarn
- Running backend API from `../backend` (provides `/auth/login`)

## Getting Started
```bash
# From /Users/saurabh/Developer/Production-Projects/School-Application
cd school-frontend
bun install          # or npm install / pnpm install

# Start the dev server on http://localhost:5173
bun run dev
```

### Other Scripts
```bash
bun run build        # type-check + production build
bun run preview      # serve the production build locally
bun run lint         # run ESLint on the project
```

## Environment Variables
Create `.env` (or `.env.local`) at the project root:

```
VITE_API_URL=http://localhost:3000
```

This value points to the backend base URL and is used by the login form when calling `/auth/login`.

## Project Structure
```
school-frontend/
├── src/
│   ├── App.tsx                # Router configuration
│   ├── components/
│   │   └── auth/
│   │       └── Login.tsx      # Email/password form with Axios call
│   ├── pages/                 # Future routed pages
│   ├── main.tsx               # React entry point
│   ├── App.css / index.css    # Global styles
├── public/
├── package.json
└── vite.config.ts
```

## Authentication Flow
1. Users land on `/` which renders the `Login` component.
2. Credentials are captured via controlled inputs.
3. `axios.post(VITE_API_URL + '/auth/login', formData, { withCredentials: true })` sends the request with cookies enabled for session handling.
4. On success, extend the flow with navigation/state updates (currently a console log placeholder).

## Linting & Formatting
- ESLint config lives in `eslint.config.js`, already wired for React + TypeScript.
- Tailwind 4 uses the official Vite plugin, so utility classes are available without extra config files.

## Conventions & Next Steps
- Keep components colocated under `src/components/<domain>`.
- Prefer `bun` for scripts to stay consistent with the lockfile, but npm/pnpm work too.
- Future enhancements: route-guarded dashboards, signup flow, form validation, Toast notifications, and integration tests.

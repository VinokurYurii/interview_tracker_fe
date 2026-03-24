# Project Guidelines

## Project Overview

React frontend for the Interview Tracker application. Communicates with a Rails 8 API backend
via REST endpoints using JWT authentication.

**The goal of this project is also to demonstrate senior-level frontend engineering skills,
component design, and practical DevOps experience.**

## Tech Stack

- **Framework:** React 19.x with TypeScript
- **Build Tool:** Vite 6.x
- **Node.js:** 22.x LTS (local install for scaffolding/IDE; daily dev runs via Docker)
- **Styling:** TBD
- **Routing:** React Router (to be added)
- **State Management:** TBD
- **HTTP Client:** TBD

## Development Environment

### Prerequisites

- Node.js 22.x (for IDE TypeScript support and initial setup)
- Docker + Docker Compose (for running the dev server)

### First-time Setup

```bash
npm install
docker compose build
docker compose up
```

### Common Docker Commands

```bash
# Start dev server (Vite with HMR at http://localhost:5173)
docker compose up

# Stop
docker compose down

# Install a new package (always via Docker to keep host and container in sync)
docker compose exec app npm install <package-name>

# Run linter
docker compose exec app npm run lint

# Run tests
docker compose exec app npm test

# Rebuild after Dockerfile changes
docker compose build
```

### Environment Variables

Copy `.env.example` to `.env` and adjust:

```bash
cp .env.example .env
```

- `VITE_API_BASE_URL` — backend API URL (default: `http://localhost:3000`)

Vite requires `VITE_` prefix for env vars exposed to client-side code.

## Project Structure

```
src/
  assets/          # Static assets (images, fonts)
  components/      # Reusable UI components
  config.ts        # App configuration (API URL, etc.)
  features/        # Feature-based modules
  hooks/           # Custom React hooks
  lib/             # Utilities, API client, auth helpers
  pages/           # Top-level route pages
  types/           # Shared TypeScript types/interfaces
  App.tsx          # Root component
  main.tsx         # Entry point
```

## Naming Conventions

- **Files:** `kebab-case.ts` for utilities, `PascalCase.tsx` for React components
- **Components:** PascalCase (`CompanyCard.tsx`, `InterviewStageList.tsx`)
- **Hooks:** camelCase with `use` prefix (`useAuth.ts`, `usePositions.ts`)
- **Types:** PascalCase, suffixed by context (`Position`, `PositionFormData`)
- **Constants:** UPPER_SNAKE_CASE
- **CSS Modules:** `component-name.module.css`

## API Integration

- Backend runs at `http://localhost:3000` (separate Docker setup in `../interview_tracker`)
- All API endpoints are under `/api/`
- Authentication: JWT Bearer token in Authorization header
- Auth endpoints: POST `/api/auth/sign_in`, POST `/api/auth/sign_up`, DELETE `/api/auth/sign_out`
- JWT token is returned in the Authorization response header
- Swagger spec available in `.docs/swagger.yaml`

## Git Workflow

- Branch from `main`
- Branch naming: `feature/<short-description>`, `fix/<short-description>`
- Commit messages: imperative mood ("Add login form", "Fix token refresh")
- Keep PRs small and focused

## Coding Conventions

### General

- Strict TypeScript — avoid `any`, prefer explicit types
- Functional components only (no class components)
- Prefer named exports over default exports
- Use async/await over `.then()` chains
- Handle loading and error states for all async operations

### Components

- One component per file
- Co-locate component styles, tests, and types when possible
- Extract reusable logic into custom hooks

### Testing

- TBD (Vitest + React Testing Library recommended)

## Docker Reference

The Dockerfile has three stages:
- `development` — used by docker-compose.yml, runs Vite dev server with HMR
- `build` — intermediate stage that compiles the production bundle
- `production` — nginx serving static files, used for deployment

## Non-Goals (Current Scope)

- No SSR (server-side rendering)
- No i18n
- No complex state management library initially

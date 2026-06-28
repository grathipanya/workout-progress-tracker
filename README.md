# Workout Progress Tracker

Monorepo scaffold for a workout progress tracker.

## Workspace layout

- `apps/client` - React + Vite frontend.
- `apps/server` - Express API server.
- `packages/ui` - Shared UI helpers and future components.
- `packages/utils` - Shared utility functions.
- `packages/tsconfig` - Shared TypeScript base configs.

## Common commands

- `pnpm dev` - Run the app workspaces in parallel.
- `pnpm build` - Build all app workspaces that define a build script.
- `pnpm lint` - Lint the client app.
- `pnpm typecheck` - Type-check the workspaces that define typecheck scripts.
- `pnpm clean` - Remove generated build artifacts.

## Environment

Copy `.env.example` to `.env` when you are ready to configure local values.

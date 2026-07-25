# OHealth Dashboard

A React single-page application providing dedicated portals for medical
professionals, pharmacies, and laboratories. Routing, data-fetching, theming,
and a full UI component library are wired up and ready for the OHealth API.

Each portal is a separate build selected at build time by `VITE_ROUTE`:

| Surface              | `VITE_ROUTE`             |
| -------------------- | ------------------------ |
| Medical Professional | `mp-dashboard` (default) |
| Pharmacy             | `ph-dashboard`           |
| Laboratory           | `lb-dashboard`           |

## Stack

- **React 19** + **React Router 7** (`@react-router/dev`, SPA mode)
- **Vite** — build tool and dev server
- **TypeScript** — strict mode, `~/*` path alias
- **Tailwind CSS v4** — utility-first styling with semantic design tokens
- **shadcn / Radix UI** — accessible component primitives (`radix-nova` style)
- **TanStack Query** — server-state caching and devtools
- **Axios** — HTTP client with automatic network-error retry
- **Sonner** — toast notifications
- **next-themes** — light/dark theme switching

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in VITE_API_BASE_URL (and optionally VITE_ROUTE)
npm run dev                  # Medical Professional (default), http://localhost:5100
```

## Running the different dashboards

Each dashboard is a separate build selected by `VITE_ROUTE`. To run a specific
one you can either **set the route in your env file** and run `npm run dev`:

```dotenv
# .env.local
VITE_ROUTE=ph-dashboard   # mp-dashboard | ph-dashboard | lb-dashboard
```

…or use the **per-dashboard scripts** in `package.json`, which set the route for
you and run each dashboard on its own port so they can run side by side:

| Dashboard            | Dev command      | Port | Build command      |
| -------------------- | ---------------- | ---- | ------------------ |
| Medical Professional | `npm run dev:mp` | 5100 | `npm run build:mp` |
| Pharmacy             | `npm run dev:ph` | 5101 | `npm run build:ph` |
| Laboratory           | `npm run dev:lb` | 5102 | `npm run build:lb` |

`npm run dev` / `npm run build` (no suffix) use the default, `mp-dashboard`.

## Quality checks

| Check      | Command                | CI  |
| ---------- | ---------------------- | --- |
| Format     | `npm run format:check` | ✓   |
| Lint       | `npm run lint`         | ✓   |
| Type-check | `npm run typecheck`    | ✓   |
| Build      | `npm run build`        | ✓   |

CI runs on every pull request to `main` via `.github/workflows/ci.yml`.
Deploys run on pushes to `staging` and `prod` via `.github/workflows/deploy.yml`.

## Documentation

- [Setup & Local Development](docs/setup.md) — prerequisites, environment
  variables, dashboard selection, dev server, build, CI, and Docker.
- [Architecture](docs/architecture.md) — the per-dashboard `VITE_ROUTE` routing
  model, providers, API layer, and data-fetching patterns.
- [Folder Structure](docs/folder-structure.md) — repository layout and what
  lives where.
- [Deployment](docs/deployment.md) — staging / production deploy over SSH,
  branches, secrets, and server setup.
- [Code Style & Conventions](docs/code-style.md) — TypeScript, formatting, UI,
  and feature conventions.
- [Workflow & Implementation Patterns](docs/workflow.md) — route structure,
  URL state, search/filter patterns, forms, mutations, and feature checklist.

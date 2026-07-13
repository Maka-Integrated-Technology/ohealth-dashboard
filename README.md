# OHealth Dashboard

A React single-page application providing dedicated portals for medical
professionals, pharmacies, and laboratories. Routing, data-fetching, theming,
and a full UI component library are wired up and ready for the OHealth API.

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
cp .env.example .env.local   # then fill in VITE_API_BASE_URL
npm run dev
```

The dev server runs at **http://localhost:5100**.

## Quality checks

| Check      | Command                | CI  |
| ---------- | ---------------------- | --- |
| Format     | `npm run format:check` | ✓   |
| Lint       | `npm run lint`         | ✓   |
| Type-check | `npm run typecheck`    | ✓   |
| Build      | `npm run build`        | ✓   |

CI runs on every pull request to `main` via `.github/workflows/ci.yml`.

## Documentation

- [Setup & Local Development](docs/setup.md) — prerequisites, environment
  variables, dev server, build, CI, and Docker.
- [Architecture](docs/architecture.md) — routing, providers, API layer,
  data-fetching patterns, and advanced multi-route setup.
- [Folder Structure](docs/folder-structure.md) — repository layout and what
  lives where.
- [Code Style & Conventions](docs/code-style.md) — TypeScript, formatting, UI,
  and feature conventions.
- [Workflow & Implementation Patterns](docs/workflow.md) — route structure,
  URL state, search/filter patterns, forms, mutations, and feature checklist.

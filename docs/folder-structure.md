# Folder Structure

```
ohealth-dashboard/
├── app/
│   ├── components/
│   │   ├── providers/          # React context providers
│   │   │   ├── tanstack-query.tsx
│   │   │   └── theme-provider.tsx
│   │   ├── shared/             # App-wide reusable components
│   │   │   ├── navbar/
│   │   │   │   └── index.tsx
│   │   │   ├── app-shell.tsx   # Navbar + offline banner + <Outlet> chrome
│   │   │   ├── logo.tsx
│   │   │   ├── navbar-theme-toggle.tsx
│   │   │   └── offline-banner.tsx
│   │   └── ui/                 # shadcn / Radix UI primitives
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── empty.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── skeleton.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       ├── tabs.tsx
│   │       └── tooltip.tsx
│   ├── features/               # Domain feature modules
│   │   └── example/
│   │       ├── api.ts          # Axios calls for this domain
│   │       ├── hooks.ts        # useQuery / useMutation wrappers
│   │       └── types.ts        # Request param + response types
│   ├── hooks/                  # Shared React hooks
│   │   ├── use-custom-search-params.ts
│   │   ├── use-debounce.ts
│   │   ├── use-mobile.ts
│   │   └── use-online-status.ts
│   ├── lib/
│   │   ├── config/
│   │   │   └── axios.ts        # Shared Axios instance with retry
│   │   └── utils/
│   │       ├── constants.ts    # ENV_CONFIG, breakpoint constants
│   │       ├── cookie.ts       # getCookie, hasCookie helpers
│   │       ├── error-handler.ts # API error classification + handling
│   │       ├── helpers.ts      # cn, truncate, capitalize, slugify, …
│   │       ├── query-keys.ts   # Centralised TanStack Query key factory
│   │       └── toast.ts        # notifySuccess / notifyError / notifyInfo
│   ├── routes/                 # One folder per dashboard surface (rr-next-routes)
│   │   ├── mp-dashboard/       # VITE_ROUTE=mp-dashboard (default)
│   │   │   ├── layout.tsx      #   <AppShell portal="Medical Professional" />
│   │   │   └── page.tsx        #   / — Medical Professional dashboard
│   │   ├── ph-dashboard/       # VITE_ROUTE=ph-dashboard
│   │   │   ├── layout.tsx      #   <AppShell portal="Pharmacy" />
│   │   │   └── page.tsx        #   / — Pharmacy dashboard
│   │   └── lb-dashboard/       # VITE_ROUTE=lb-dashboard
│   │       ├── layout.tsx      #   <AppShell portal="Laboratory" />
│   │       └── page.tsx        #   / — Laboratory dashboard
│   ├── styles/
│   │   └── global.css          # Tailwind v4 imports + CSS design tokens
│   ├── types/
│   │   ├── api.ts              # Shared API types (PaginatedResponse, …)
│   │   └── env.d.ts            # ImportMetaEnv declaration for VITE_* vars
│   └── root.tsx                # Document shell, provider stack, error boundary
├── docs/
│   ├── architecture.md
│   ├── code-style.md
│   ├── deployment.md           # Staging / production deploy (SSH + Docker)
│   ├── folder-structure.md     # (this file)
│   ├── setup.md
│   └── workflow.md
├── .github/workflows/
│   ├── ci.yml                  # Format / lint / typecheck / build on PRs
│   └── deploy.yml              # Deploy staging (staging) + production (prod)
├── .dockerignore
├── .env.example
├── AGENTS.md                   # Workflow conventions for AI coding agents
├── components.json             # shadcn CLI config
├── docker-compose.yml          # Local dev / generic app compose
├── docker-compose.prod.yml     # Staging + production compose (mp/ph/lb services)
├── Dockerfile
├── package.json
├── react-router.config.ts      # ssr: false
├── README.md
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

> `.claude/` and `docs/specs/` are intentionally git-ignored (local tooling and
> working design docs); env files other than `.env.example` are ignored too.

## Directory conventions

### `app/components/ui/`

Generic shadcn/Radix primitives. Generated or updated with the shadcn CLI. Do
not add product-specific logic here.

### `app/components/shared/`

Composite components built from `ui/` primitives that are reused across
surfaces — `Navbar`, `Logo`, `OfflineBanner`, theme toggle, and `AppShell`
(the navbar + offline banner + `<Outlet>` chrome each surface's `layout.tsx`
renders). These are still generic (not domain-specific) but may reference app
state (theme, mobile breakpoint).

### `app/components/providers/`

React context providers that wrap the application tree. Each provider file
exports exactly one provider component plus (if needed) a hook.

### `app/features/<domain>/`

All code for a single API domain — types, HTTP calls, and query/mutation hooks.
A page imports from `hooks.ts` only; it never calls `axios` directly.

### `app/routes/`

One folder per **dashboard surface** (`mp-dashboard`, `ph-dashboard`,
`lb-dashboard`). Exactly one is active per build, selected by the `VITE_ROUTE`
env var in `app/routes.ts` — that folder is scanned by `rr-next-routes`, so its
`page.tsx` is served at `/` and its `layout.tsx` wraps it. See
[architecture.md](./architecture.md#routing--one-build-per-dashboard) for the
selection logic and how to add a surface.

`page.tsx` = route component; `layout.tsx` = wrapping layout (renders
`<AppShell portal="…" />`).

For complex pages, create a `_sections/` subfolder alongside the page file to
hold sub-components that are rendered only by that page. The `_sections/`
prefix is conventional — React Router ignores it as a route segment. See
[workflow.md](./workflow.md) for the full route folder convention.

### `app/hooks/`

General-purpose hooks not tied to a specific feature: `useIsMobile`,
`useDebouncedCallback`, `useOnlineStatus`, `useCustomSearchParams`.

### `app/lib/`

Non-React utilities. `config/` holds configured instances (Axios). `utils/`
holds pure helper functions, constants, and the query-key factory.

### `app/types/`

TypeScript types shared across features — generic API envelope types
(`PaginatedResponse`, `ApiErrorResponse`) and Vite env declarations.
Feature-specific types belong in `app/features/<domain>/types.ts`.

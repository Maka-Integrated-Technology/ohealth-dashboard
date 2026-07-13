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
│   ├── routes/                 # File-based route tree (rr-next-routes)
│   │   ├── layout.tsx          # Root layout — navbar + offline banner
│   │   ├── page.tsx            # / — OHealth landing / portal overview
│   │   ├── mp-dashboard/
│   │   │   └── page.tsx        # /mp-dashboard — Medical Professional
│   │   ├── ph-dashboard/
│   │   │   └── page.tsx        # /ph-dashboard — Pharmacy
│   │   └── lb-dashboard/
│   │       └── page.tsx        # /lb-dashboard — Laboratory
│   ├── styles/
│   │   └── global.css          # Tailwind v4 imports + CSS design tokens
│   ├── types/
│   │   ├── api.ts              # Shared API types (PaginatedResponse, …)
│   │   └── env.d.ts            # ImportMetaEnv declaration for VITE_* vars
│   └── root.tsx                # Document shell, provider stack, error boundary
├── docs/
│   ├── architecture.md
│   ├── code-style.md
│   ├── folder-structure.md     # (this file)
│   ├── setup.md
│   └── workflow.md
├── .dockerignore
├── .env.example
├── AGENTS.md                   # Workflow conventions for AI coding agents
├── components.json             # shadcn CLI config
├── docker-compose.yml
├── Dockerfile
├── package.json
├── react-router.config.ts      # ssr: false
├── README.md
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## Directory conventions

### `app/components/ui/`

Generic shadcn/Radix primitives. Generated or updated with the shadcn CLI. Do
not add product-specific logic here.

### `app/components/shared/`

Composite components built from `ui/` primitives that are reused across
multiple routes — `Navbar`, `Logo`, `OfflineBanner`, theme toggle. These are
still generic (not domain-specific) but may reference app state (theme, mobile
breakpoint).

### `app/components/providers/`

React context providers that wrap the application tree. Each provider file
exports exactly one provider component plus (if needed) a hook.

### `app/features/<domain>/`

All code for a single API domain — types, HTTP calls, and query/mutation hooks.
A page imports from `hooks.ts` only; it never calls `axios` directly.

### `app/routes/`

File-based routes scanned by `rr-next-routes`. The file system is the routing
config. `page.tsx` = route component; `layout.tsx` = wrapping layout.

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

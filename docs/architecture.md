# Architecture

## Overview

This is a client-side SPA. React Router 7 handles routing and code splitting;
TanStack Query handles all server-state; Axios makes HTTP requests. There is no
server-side rendering and no server entry point.

## SPA configuration

`react-router.config.ts` sets `ssr: false`. The build output is a static bundle
under `build/client` — a single `index.html` plus hashed JS/CSS chunks. All
routing happens in the browser.

## Routing — one build per dashboard

This app ships **three independent dashboard surfaces**, one per user role, and
builds exactly one of them at a time. Which surface is active is selected at
config time by the `VITE_ROUTE` environment variable.

| Surface              | `VITE_ROUTE` (alias)  | Route folder               |
| -------------------- | --------------------- | -------------------------- |
| Medical Professional | `mp-dashboard` (`mp`) | `app/routes/mp-dashboard/` |
| Pharmacy             | `ph-dashboard` (`ph`) | `app/routes/ph-dashboard/` |
| Laboratory           | `lb-dashboard` (`lb`) | `app/routes/lb-dashboard/` |

`VITE_ROUTE` defaults to `mp-dashboard` when unset.

### How selection works (`app/routes.ts`)

`app/routes.ts` reads `VITE_ROUTE`, normalises aliases, validates it against the
whitelist of known surfaces, checks that the folder exists, and points
`rr-next-routes` at just that folder:

```ts
const route = resolveAppRoute(); // e.g. "mp-dashboard"

export default nextRoutes({
  ...appRouterStyle,
  folderName: `./routes/${route}`,
}) satisfies RouteConfig;
```

| Piece               | Purpose                                                                 |
| ------------------- | ----------------------------------------------------------------------- |
| `DEFAULT_ROUTE`     | Surface used when `VITE_ROUTE` is unset (`mp-dashboard`).               |
| `ROUTE_ALIASES`     | Short aliases → canonical folders (`mp`→`mp-dashboard`, etc.).          |
| `APP_ROUTES`        | Whitelist of valid surface folder names.                                |
| `resolveAppRoute()` | Trims input, applies aliases, validates, checks the folder, returns it. |

Because only one folder is scanned, that folder's `page.tsx` is served at `/`
and its `layout.tsx` wraps it. An unknown or misspelled `VITE_ROUTE` throws at
startup.

### Folder layout

Each surface is a self-contained route tree with its own layout and page:

```
app/routes/
  mp-dashboard/
    layout.tsx        ← chrome for the Medical Professional surface
    page.tsx          ← / (when VITE_ROUTE=mp-dashboard)
  ph-dashboard/
    layout.tsx
    page.tsx          ← / (when VITE_ROUTE=ph-dashboard)
  lb-dashboard/
    layout.tsx
    page.tsx          ← / (when VITE_ROUTE=lb-dashboard)
```

Files named `page.tsx` become route components; files named `layout.tsx` become
nested layouts (`rr-next-routes`, app-router style).

### Shared chrome (`app/components/shared/app-shell.tsx`)

Every surface's `layout.tsx` is a one-liner that renders the shared `AppShell`
with its own portal label:

```tsx
// app/routes/mp-dashboard/layout.tsx
import AppShell from "~/components/shared/app-shell";

export default function MpDashboardLayout() {
  return <AppShell portal="Medical Professional" />;
}
```

`AppShell` renders the navbar (logo + portal label + theme toggle), the offline
banner, and the `<Outlet>`. There are no cross-surface navigation links, since
only one surface exists in a given build.

## Root file responsibilities (`app/root.tsx`)

`root.tsx` owns:

- Global `<head>` tags (charset, viewport, title, Vite dev assets)
- The `<Layout>` wrapper that mounts `ThemeProvider`
- The `<App>` component that composes the provider stack and renders `<Outlet>`
- The `<ErrorBoundary>` shown when an unhandled route error is thrown

The per-surface `layout.tsx` (via `AppShell`) sits below `root.tsx` and owns the
visible page chrome (navbar, offline banner).

## Provider stack

Providers are nested in this order (outermost first):

```
ThemeProvider          (next-themes — sets class on <html>)
  TanstackQueryProvider (QueryClient + ReactQueryDevtools)
    TooltipProvider     (Radix Tooltip root)
      Outlet            (active route component)
      Toaster           (Sonner — reads theme from next-themes)
```

`ThemeProvider` wraps everything so every component can call `useTheme()`.
`TanstackQueryProvider` wraps route components so every page can call
`useQuery` / `useMutation`. `Toaster` is a sibling to `Outlet` so it renders
above all route content.

## HTTP client (`app/lib/config/axios.ts`)

A single `axios` instance is created with `baseURL` set to
`import.meta.env.VITE_API_BASE_URL`. `axios-retry` is attached to that
instance:

- **2 retries** on network errors only (`isNetworkError`)
- Exponential back-off between attempts (`exponentialDelay`)
- HTTP error status codes (4xx, 5xx) are not retried

All feature API modules import this shared instance. Never create a second
`axios.create()` call.

## Data fetching

TanStack Query is the data-fetching layer. The `QueryClient` is configured
globally:

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnMount: false,
    },
  },
});
```

### QUERY_KEYS pattern

All query keys are centralised in `app/lib/utils/query-keys.ts`:

```ts
export const QUERY_KEYS = {
  example: {
    all: ["example"] as const,
    list: (params: SearchParams) => ["example", "list", params] as const,
    byId: (id: string | number) => ["example", id] as const,
  },
};
```

Add a new domain key block when you add a new feature. Never inline raw string
arrays in `queryKey`.

## Feature structure

Each domain lives in its own directory under `app/features/`:

```
app/features/example/
  types.ts   ← TypeScript interfaces for request params and response shapes
  api.ts     ← functions that call axiosInstance, typed with those interfaces
  hooks.ts   ← useQuery / useMutation wrappers that call api.ts
```

Pages import from `hooks.ts` only. Pages never import from `api.ts` directly
and never create their own `axios` calls.

## Theming

`next-themes` writes a `class` attribute (`"light"` or `"dark"`) on `<html>`.
Tailwind's dark-mode variant reads that class. CSS custom properties for each
palette are declared under `.light` / `.dark` selectors in
`app/styles/global.css`. All Radix components and shadcn primitives consume
those tokens via `hsl(var(--...))` / `oklch(...)` values.

`defaultTheme` is set to `"light"` and `enableSystem` is `false`, so there is no
OS-level preference fallback unless you change that.

## UI components

`app/components/ui/` contains shadcn-generated Radix primitives. They are
generic; do not add product-specific logic to them. Product-level composites
(e.g. `Logo`, `Navbar`) live in `app/components/shared/`.

## Selecting a dashboard at dev / build time

The active surface is chosen with `VITE_ROUTE` (see
[Routing — one build per dashboard](#routing--one-build-per-dashboard) above).

```bash
# Dev
npm run dev                 # default → mp-dashboard
VITE_ROUTE=ph npm run dev   # Pharmacy surface
VITE_ROUTE=lb npm run dev   # Laboratory surface

# Build
VITE_ROUTE=mp npm run build
VITE_ROUTE=ph npm run build
VITE_ROUTE=lb npm run build
```

### Adding a new surface

1. Create `app/routes/<name>-dashboard/` with a `page.tsx` and a `layout.tsx`
   (the layout renders `<AppShell portal="…" />`).
2. Add the folder name to `APP_ROUTES` in `app/routes.ts`, and optionally a
   short alias in `ROUTE_ALIASES`.

A `VITE_ROUTE` value that is not in `APP_ROUTES`, or whose folder is missing,
throws at startup — so the whitelist and the folders must stay in sync.

### Deployment

Each environment builds a single surface, chosen by the `VITE_ROUTE` value in
its server-side env file. See [deployment.md](./deployment.md) for the full
staging / production flow.

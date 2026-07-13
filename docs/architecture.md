# Architecture

## Overview

This is a client-side SPA. React Router 7 handles routing and code splitting;
TanStack Query handles all server-state; Axios makes HTTP requests. There is no
server-side rendering and no server entry point.

## SPA configuration

`react-router.config.ts` sets `ssr: false`. The build output is a static bundle
under `build/client` — a single `index.html` plus hashed JS/CSS chunks. All
routing happens in the browser.

## Routing

Routes are registered in `app/routes.ts` using `rr-next-routes`:

```ts
export default nextRoutes({
  ...appRouterStyle,
  folderName: "./routes",
}) satisfies RouteConfig;
```

`rr-next-routes` scans `app/routes/` and builds the route config from the
file system. Files named `page.tsx` become route components; files named
`layout.tsx` become nested layouts.

```
app/routes/
  layout.tsx          ← root layout (navbar + offline banner)
  page.tsx            ← /
  mp-dashboard/
    page.tsx          ← /mp-dashboard
  ph-dashboard/
    page.tsx          ← /ph-dashboard
  lb-dashboard/
    page.tsx          ← /lb-dashboard
```

## Root file responsibilities (`app/root.tsx`)

`root.tsx` owns:

- Global `<head>` tags (charset, viewport, title, Vite dev assets)
- The `<Layout>` wrapper that mounts `ThemeProvider`
- The `<App>` component that composes the provider stack and renders `<Outlet>`
- The `<ErrorBoundary>` shown when an unhandled route error is thrown

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

`defaultTheme` is set to `"dark"` and `enableSystem` is `false`, so there is no
OS-level preference fallback unless you change that.

## UI components

`app/components/ui/` contains shadcn-generated Radix primitives. They are
generic; do not add product-specific logic to them. Product-level composites
(e.g. `Logo`, `Navbar`) live in `app/components/shared/`.

## Advanced Multi-Route Setup

> Use this only when the project has multiple independent app surfaces or build
> targets. For single-surface apps the default setup in `app/routes.ts` is
> sufficient.

When a project needs two or more entirely separate route trees — for example an
`admin` surface and a `client` surface — you can select the active route folder
at dev and build time using the `VITE_ROUTE` environment variable.

### Implementation

Replace the contents of `app/routes.ts` with:

```ts
import type { RouteConfig } from "@react-router/dev/routes";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { nextRoutes, appRouterStyle } from "rr-next-routes/react-router";

const DEFAULT_ROUTE = "admin";
const ROUTE_ALIASES: Record<string, string> = {
  a: "admin",
};
const APP_ROUTES = ["admin", "client"] as const;

type AppRoute = (typeof APP_ROUTES)[number];

function resolveAppRoute(rawRoute = process.env.VITE_ROUTE): AppRoute {
  const requestedRoute = rawRoute?.trim() || DEFAULT_ROUTE;
  const route = ROUTE_ALIASES[requestedRoute] ?? requestedRoute;

  if (!APP_ROUTES.includes(route as AppRoute)) {
    const expectedRoutes = APP_ROUTES.join(", ");
    throw new Error(
      `Invalid VITE_ROUTE="${requestedRoute}". Expected one of: ${expectedRoutes}.`
    );
  }

  const routeDir = resolve(process.cwd(), "app/routes", route);

  if (!existsSync(routeDir)) {
    throw new Error(
      `VITE_ROUTE="${route}" points to missing route directory: ${routeDir}`
    );
  }

  return route as AppRoute;
}

const route = resolveAppRoute();

export default nextRoutes({
  ...appRouterStyle,
  folderName: `./routes/${route}`,
}) satisfies RouteConfig;
```

Adjust `DEFAULT_ROUTE`, `ROUTE_ALIASES`, and `APP_ROUTES` for the actual folders
in your project.

### What each part does

| Part                | Purpose                                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `DEFAULT_ROUTE`     | Route folder used when `VITE_ROUTE` is not set.                                                                                           |
| `ROUTE_ALIASES`     | Short aliases mapped to canonical folder names (e.g. `a` → `admin`).                                                                      |
| `APP_ROUTES`        | Whitelist of valid route folder names.                                                                                                    |
| `AppRoute`          | TypeScript union derived from `APP_ROUTES` for type-safe returns.                                                                         |
| `resolveAppRoute()` | Trims the input, applies aliases, validates against the whitelist, checks that the directory exists, and returns the resolved route name. |
| `nextRoutes()`      | Generates the route tree from the selected folder.                                                                                        |

### Example commands

```bash
VITE_ROUTE=admin npm run dev
VITE_ROUTE=client npm run dev
VITE_ROUTE=admin npm run build
VITE_ROUTE=client npm run build
```

### Folder structure

```
app/routes/
  admin/
    layout.tsx
    page.tsx
    settings/
      page.tsx
  client/
    layout.tsx
    page.tsx
    browse/
      page.tsx
```

Keep `APP_ROUTES` in sync with the actual directories under `app/routes/`. A
missing or misspelled folder name causes `resolveAppRoute` to throw at startup.

### CI for multi-route builds

Projects using this setup should extend the CI workflow with one build step per
route. See `docs/setup.md` for the CI command reference. A typical extension:

```yaml
- name: Build (admin)
  run: VITE_ROUTE=admin npm run build

- name: Build (client)
  run: VITE_ROUTE=client npm run build
```

import type { RouteConfig } from "@react-router/dev/routes";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv } from "vite";
import { nextRoutes, appRouterStyle } from "rr-next-routes/react-router";

// Make VITE_* values from .env files available on process.env so VITE_ROUTE can
// be set via an env file as well as via the shell / Docker build args.
Object.assign(
  process.env,
  loadEnv(process.env.NODE_ENV ?? "development", process.cwd())
);

const DEFAULT_ROUTE = "mp-dashboard";

// Short aliases → canonical folder names.
const ROUTE_ALIASES: Record<string, string> = {
  mp: "mp-dashboard",
  ph: "ph-dashboard",
  lb: "lb-dashboard",
};

const APP_ROUTES = ["mp-dashboard", "ph-dashboard", "lb-dashboard"] as const;

type AppRoute = (typeof APP_ROUTES)[number];

function resolveAppRoute(rawRoute = process.env.VITE_ROUTE): AppRoute {
  const requestedRoute = rawRoute?.trim() || DEFAULT_ROUTE;
  const route = ROUTE_ALIASES[requestedRoute] ?? requestedRoute;

  if (!APP_ROUTES.includes(route as AppRoute)) {
    const expectedRoutes = APP_ROUTES.join(", ");
    const aliases = Object.keys(ROUTE_ALIASES).join(", ");
    throw new Error(
      `Invalid VITE_ROUTE="${requestedRoute}". Expected one of: ${expectedRoutes} (or an alias: ${aliases}).`
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

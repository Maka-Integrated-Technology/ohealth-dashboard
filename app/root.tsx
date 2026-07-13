import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import { AlertCircle } from "lucide-react";
import "~/styles/global.css";
import TanstackQueryProvider from "./components/providers/tanstack-query";
import { ThemeProvider } from "./components/providers/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { Card, CardContent } from "./components/ui/card";
import { TooltipProvider } from "./components/ui/tooltip";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="dark light" />
        <title>OHealth Dashboard</title>
        <meta
          name="description"
          content="OHealth Dashboard — medical professional, pharmacy, and laboratory portals."
        />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <TanstackQueryProvider>
      <TooltipProvider>
        <Outlet />
      </TooltipProvider>
      <Toaster />
    </TanstackQueryProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "An error occurred";
  let details = "An unexpected error occurred while rendering this page.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The page you're looking for doesn't exist."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <Card className="flex w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 py-2 text-center">
          <AlertCircle className="text-primary size-12 shrink-0" aria-hidden />
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-semibold">{message}</h1>
            <p className="text-muted-foreground max-w-md text-sm">{details}</p>
            {import.meta.env.DEV && stack ? (
              <pre className="bg-muted mt-4 w-full max-w-2xl overflow-x-auto rounded-lg p-4 text-left text-xs">
                <code>{stack}</code>
              </pre>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

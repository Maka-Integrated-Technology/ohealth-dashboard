import { Outlet } from "react-router";
import MainNavbar from "./navbar";
import OfflineBanner from "./offline-banner";

/**
 * App chrome shared by every dashboard surface. Each `routes/<dashboard>/layout.tsx`
 * renders this with its own `portal` label. The active dashboard is selected at
 * build/dev time by the `VITE_ROUTE` env var (see `app/routes.ts`).
 */
export default function AppShell({ portal }: { portal: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNavbar portal={portal} />
      <OfflineBanner />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}

import { Outlet } from "react-router";
import MainNavbar from "./navbar";
import OfflineBanner from "./offline-banner";
import Sidebar, { SidebarMobileTrigger, type SidebarItem } from "./sidebar";
import { cn } from "~/lib/utils/helpers";

/**
 * App chrome shared by every dashboard surface. Each `routes/<dashboard>/layout.tsx`
 * renders this with its own `portal` label. The active dashboard is selected at
 * build/dev time by the `VITE_ROUTE` env var (see `app/routes.ts`).
 *
 * Pass `sidebarItems` to add a left sidebar nav (used by mp-dashboard; ph/lb
 * can opt in with their own item lists whenever they need one). Fixed and
 * always visible at `lg` and up; collapses into a hamburger-triggered drawer
 * below that. The top navbar's logo auto-hides when a sidebar is present so
 * branding isn't duplicated.
 */
export default function AppShell({
  portal,
  sidebarItems,
}: {
  portal: string;
  sidebarItems?: SidebarItem[];
}) {
  const hasSidebar = Boolean(sidebarItems?.length);

  return (
    <div className="flex min-h-screen flex-col">
      {hasSidebar && <Sidebar items={sidebarItems!} />}
      <div className={cn("flex flex-1 flex-col", hasSidebar && "lg:pl-64")}>
        <MainNavbar
          portal={portal}
          showLogo={!hasSidebar}
          leftSlot={
            hasSidebar ? <SidebarMobileTrigger items={sidebarItems!} /> : null
          }
        />
        <OfflineBanner />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

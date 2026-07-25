import { Outlet } from "react-router";
import type { ReactNode } from "react";
import MainNavbar from "./navbar";
import OfflineBanner from "./offline-banner";
import Sidebar, { SidebarMobileTrigger, type SidebarItem } from "./sidebar";
import { cn } from "~/lib/utils/helpers";

export default function AppShell({
  portal,
  sidebarItems,
  rightSlot,
}: {
  portal: string;
  sidebarItems?: SidebarItem[];
  rightSlot?: ReactNode;
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
          rightSlot={rightSlot}
          hasSidebar={hasSidebar}
        />
        <OfflineBanner />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

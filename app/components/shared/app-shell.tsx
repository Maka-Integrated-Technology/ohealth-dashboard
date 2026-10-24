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
  showThemeToggle = true,
  compactSidebar = false,
  showSidebarLogo = true,
  sidebarFooter,
  compactNavbar = false,
}: {
  portal?: string;
  sidebarItems?: SidebarItem[];
  rightSlot?: ReactNode;
  showThemeToggle?: boolean;
  compactSidebar?: boolean;
  showSidebarLogo?: boolean;
  sidebarFooter?: ReactNode;
  compactNavbar?: boolean;
}) {
  const hasSidebar = Boolean(sidebarItems?.length);

  return (
    <div className="flex min-h-screen flex-col">
      {hasSidebar && (
        <Sidebar
          items={sidebarItems!}
          compact={compactSidebar}
          showLogo={showSidebarLogo}
          footer={sidebarFooter}
        />
      )}
      <div
        className={cn(
          "flex flex-1 flex-col",
          hasSidebar && (compactSidebar ? "lg:pl-[195px]" : "lg:pl-64")
        )}
      >
        <MainNavbar
          portal={portal}
          showLogo={!hasSidebar}
          leftSlot={
            hasSidebar ? (
              <SidebarMobileTrigger
                items={sidebarItems!}
                compact={compactSidebar}
                showLogo={showSidebarLogo}
              />
            ) : null
          }
          rightSlot={rightSlot}
          hasSidebar={hasSidebar}
          showThemeToggle={showThemeToggle}
          compactSidebar={compactSidebar}
          compactNavbar={compactNavbar}
        />
        <OfflineBanner />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

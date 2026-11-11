import { Outlet } from "react-router";
import type { ReactNode } from "react";
import MainNavbar from "./navbar";
import OfflineBanner from "./offline-banner";
import Sidebar, { SidebarMobileTrigger, type SidebarItem } from "./sidebar";
import type { AppShellVariant } from "./app-shell-variant";
import { cn } from "~/lib/utils/helpers";

interface AppShellProps {
  portal?: string;
  sidebarItems?: SidebarItem[];
  rightSlot?: ReactNode;
  sidebarFooter?: ReactNode;
  variant?: AppShellVariant;
  showSidebarLogo?: boolean;
  showNavbarThemeToggle?: boolean;
}

export default function AppShell({
  portal,
  sidebarItems,
  rightSlot,
  sidebarFooter,
  variant = "default",
  showSidebarLogo,
  showNavbarThemeToggle,
}: AppShellProps) {
  const hasSidebar = Boolean(sidebarItems?.length);
  const isCompact = variant === "compact";

  // Preserve the existing behavior unless a dashboard explicitly overrides it.
  const shouldShowSidebarLogo = showSidebarLogo ?? !isCompact;

  return (
    <div className="flex min-h-screen flex-col">
      {hasSidebar && (
        <Sidebar
          items={sidebarItems!}
          variant={variant}
          footer={sidebarFooter}
          showLogo={shouldShowSidebarLogo}
        />
      )}

      <div
        className={cn(
          "flex flex-1 flex-col",
          hasSidebar && (isCompact ? "lg:pl-[195px]" : "lg:pl-64")
        )}
      >
        <MainNavbar
          portal={portal}
          showLogo={!hasSidebar}
          showThemeToggle={showNavbarThemeToggle}
          leftSlot={
            hasSidebar ? (
              <SidebarMobileTrigger items={sidebarItems!} variant={variant} />
            ) : null
          }
          rightSlot={rightSlot}
          hasSidebar={hasSidebar}
          variant={variant}
        />

        <OfflineBanner />

        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

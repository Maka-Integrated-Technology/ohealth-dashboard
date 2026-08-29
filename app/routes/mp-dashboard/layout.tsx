import { useState } from "react";
import {
  LayoutGrid,
  Users,
  Calendar,
  Wallet,
  CalendarClock,
  Settings,
  Bell,
} from "lucide-react";
import { Outlet, useLocation } from "react-router";
import AppShell from "~/components/shared/app-shell";
import { UserMenu } from "~/components/shared/user-menu";
import { NotificationsDropdown } from "~/components/shared/notifications-dropdown";
import { useMe } from "~/features/auth/hooks";
import { useProfileSetupStatus } from "~/features/profile-setup/hooks";

const MP_SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutGrid },
  { label: "Patients", href: "/patients", icon: Users },
  { label: "Appointments", href: "/appointments", icon: Calendar },
  { label: "Earnings", href: "/earnings", icon: Wallet },
  { label: "Availability", href: "/availability", icon: CalendarClock },
  { label: "Settings", href: "/settings", icon: Settings },
];

const HIDE_PORTAL_ROUTES = ["/appointments"];
const AUTH_ROUTES = ["/sign-up", "/verify-email", "/login", "/onboarding"];

function getDisplayName(
  user?: { first_name?: string | null; last_name?: string | null } | null
) {
  const name = [user?.first_name, user?.last_name]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");

  return name || "Healthcare Professional";
}

function getInitials(displayName: string) {
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "HP";
}

export default function MpDashboardLayout() {
  const location = useLocation();
  const isConsultRoute = location.pathname.includes("/consult");
  const isAuthRoute = AUTH_ROUTES.some((path) =>
    location.pathname.startsWith(path)
  );
  const { data: profileSetupStatus } = useProfileSetupStatus(
    !isAuthRoute && !isConsultRoute
  );
  const { data: user } = useMe(!isAuthRoute && !isConsultRoute);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  if (isConsultRoute || isAuthRoute) {
    return <Outlet />;
  }

  const hidePortal = HIDE_PORTAL_ROUTES.some((path) =>
    location.pathname.startsWith(path)
  );

  const verified = profileSetupStatus?.verified ?? false;
  const displayName = getDisplayName(user);

  const rightSlotUI = (
    <div className="flex items-center gap-4">
      <NotificationsDropdown
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
        trigger={
          <button className="text-muted-foreground hover:bg-accent relative rounded-full p-2 transition-colors">
            <Bell className="size-5" />
            <span className="border-background absolute top-2 right-2 size-2 rounded-full border-2 bg-red-500"></span>
          </button>
        }
      />

      <UserMenu
        name={displayName}
        role="Healthcare Professional"
        initials={getInitials(displayName)}
        verified={verified}
      />
    </div>
  );

  return (
    <AppShell
      portal={hidePortal ? undefined : "Dashboard"}
      sidebarItems={MP_SIDEBAR_ITEMS}
      rightSlot={rightSlotUI}
    />
  );
}

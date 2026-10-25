// import AppShell from "~/components/shared/app-shell";

// export default function PhDashboardLayout() {
//   return <AppShell portal="Pharmacy" />;
// }

// import {
//   LayoutDashboard,
//   Pill,
//   ClipboardList,
//   Wallet,
//   ShoppingCart,
//   UserRound,
//   Settings,
// } from "lucide-react";
// import AppShell from "~/components/shared/app-shell";
// import type { SidebarItem } from "~/components/shared/sidebar";

// const pharmacySidebarItems: SidebarItem[] = [
//   {
//     label: "Dashboard",
//     href: "/",
//     icon: LayoutDashboard,
//   },
//   {
//     label: "Medicines",
//     href: "/medicines",
//     icon: Pill,
//   },
//   {
//     label: "Prescriptions",
//     href: "/prescriptions",
//     icon: ClipboardList,
//   },
//   {
//     label: "Earnings",
//     href: "/earnings",
//     icon: Wallet,
//   },
//   {
//     label: "Orders",
//     href: "/orders",
//     icon: ShoppingCart,
//   },
//   {
//     label: "Pharmacy Profile",
//     href: "/profile",
//     icon: UserRound,
//   },
//   {
//     label: "Settings",
//     href: "/settings",
//     icon: Settings,
//   },
// ];

// export default function PhDashboardLayout() {
//   return <AppShell portal="Pharmacy" sidebarItems={pharmacySidebarItems} />;
// }

import { useState } from "react";
import {
  LayoutDashboard,
  Pill,
  ClipboardList,
  Wallet,
  ShoppingCart,
  UserRound,
  Settings,
  Bell,
} from "lucide-react";
import AppShell from "~/components/shared/app-shell";
import type { SidebarItem } from "~/components/shared/sidebar";
import { UserMenu } from "~/components/shared/user-menu";
import { NotificationsDropdown } from "~/components/shared/notifications-dropdown";
import { useLogout, useMe } from "~/features/auth/hooks";
import { useProfileSetupStatus } from "~/features/profile-setup/hooks";

const PHARMACY_SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Medicines", href: "/medicines", icon: Pill },
  { label: "Prescriptions", href: "/prescriptions", icon: ClipboardList },
  { label: "Earnings", href: "/earnings", icon: Wallet },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Pharmacy Profile", href: "/profile", icon: UserRound },
  { label: "Settings", href: "/settings", icon: Settings },
];

function getDisplayName(
  user?: { first_name?: string | null; last_name?: string | null } | null
) {
  const name = [user?.first_name, user?.last_name]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");

  return name || "Pharmacy User";
}

function getInitials(displayName: string) {
  return (
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "PU"
  );
}

export default function PhDashboardLayout() {
  const { data: user } = useMe();
  const { data: profileSetupStatus } = useProfileSetupStatus();
  const { mutate: logout } = useLogout();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const displayName = getDisplayName(user);
  const verified = profileSetupStatus?.verified ?? false;

  const rightSlotUI = (
    <div className="flex items-center gap-4">
      <NotificationsDropdown
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
        trigger={
          <button
            type="button"
            aria-label="Notifications"
            className="text-muted-foreground hover:bg-accent relative rounded-full p-2 transition-colors"
          >
            <Bell className="size-5" />
            <span className="border-background absolute top-2 right-2 size-2 rounded-full border-2 bg-red-500" />
          </button>
        }
      />

      <UserMenu
        name={displayName}
        role="Pharmacy"
        initials={getInitials(displayName)}
        verified={verified}
        onLogout={logout}
      />
    </div>
  );

  return (
    <AppShell
      portal="Dashboard"
      sidebarItems={PHARMACY_SIDEBAR_ITEMS}
      rightSlot={rightSlotUI}
    />
  );
}

import {
  LayoutGrid,
  Users,
  Calendar,
  Wallet,
  CalendarClock,
  Settings,
  Bell,
} from "lucide-react";
import AppShell from "~/components/shared/app-shell";
import { UserMenu } from "~/components/shared/user-menu";

const MP_SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutGrid },
  { label: "Patients", href: "/patients", icon: Users },
  { label: "Appointments", href: "/appointments", icon: Calendar },
  { label: "Earnings", href: "/earnings", icon: Wallet },
  { label: "Availability", href: "/availability", icon: CalendarClock },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function MpDashboardLayout() {
  const rightSlotUI = (
    <div className="flex items-center gap-4">
      <button className="text-muted-foreground hover:bg-accent relative rounded-full p-2 transition-colors">
        <Bell className="size-5" />
        <span className="border-background absolute top-2 right-2 size-2 rounded-full border-2 bg-red-500"></span>
      </button>

      <UserMenu name="Dr. Jane Marshal" role="Medical Doctor" initials="JM" />
    </div>
  );

  return (
    <AppShell
      portal="Dashboard"
      sidebarItems={MP_SIDEBAR_ITEMS}
      rightSlot={rightSlotUI}
    />
  );
}

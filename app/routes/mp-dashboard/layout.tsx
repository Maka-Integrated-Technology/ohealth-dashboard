import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Briefcase,
  Calendar,
  Settings,
} from "lucide-react";
import AppShell from "~/components/shared/app-shell";

const MP_SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Patients", href: "/patients", icon: Users },
  { label: "Appointments", href: "/appointments", icon: CalendarCheck },
  { label: "Earnings", href: "/earnings", icon: Briefcase },
  { label: "Availability", href: "/availability", icon: Calendar },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function MpDashboardLayout() {
  return (
    <AppShell portal="Medical Professional" sidebarItems={MP_SIDEBAR_ITEMS} />
  );
}

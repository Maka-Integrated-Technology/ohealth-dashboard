import {
  LayoutGrid, // Replaced LayoutDashboard
  Users,
  Calendar, // Replaced CalendarCheck
  Wallet, // Replaced Briefcase (matches Figma better)
  CalendarClock, // Replaced second Calendar
  Settings,
  Bell,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import AppShell from "~/components/shared/app-shell";

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
      <button className="relative rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100">
        <Bell className="size-5" />
        <span className="absolute top-2 right-2 size-2 rounded-full border-2 border-white bg-red-500"></span>
      </button>

      <div className="flex cursor-pointer items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-gray-100/50">
        <Avatar className="size-9">
          <AvatarImage src="" />
          <AvatarFallback className="bg-blue-600 font-medium text-white">
            JM
          </AvatarFallback>
        </Avatar>
        <div className="hidden flex-col sm:flex">
          <span className="text-sm leading-none font-semibold text-gray-900">
            Dr. Jane Marshal
          </span>
          <span className="mt-1 text-xs leading-none text-gray-500">
            Medical Doctor
          </span>
        </div>
        <ChevronDown className="ml-1 size-4 text-gray-400" />
      </div>
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

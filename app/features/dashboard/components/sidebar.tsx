import { Link, useLocation } from "react-router";
import {
  Heart,
  LayoutDashboard,
  Users,
  Calendar,
  Wallet,
  Clock,
  Settings,
} from "lucide-react";
import { cn } from "~/lib/utils";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Patients", icon: Users, path: "/mp-dashboard/patients" },
  { name: "Appointments", icon: Calendar, path: "/mp-dashboard/appointments" },
  { name: "Earnings", icon: Wallet, path: "/mp-dashboard/earnings" },
  { name: "Availability", icon: Clock, path: "/mp-dashboard/availability" },
  { name: "Settings", icon: Settings, path: "/mp-dashboard/settings" },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="bg-background fixed top-0 left-0 z-40 flex h-screen w-64 flex-col gap-6 border-r px-4 py-6">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2">
        <div className="bg-primary text-primary-foreground rounded-full p-1.5">
          <Heart size={20} fill="currentColor" />
        </div>
        <span className="text-xl font-bold tracking-tight">OHealth+</span>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

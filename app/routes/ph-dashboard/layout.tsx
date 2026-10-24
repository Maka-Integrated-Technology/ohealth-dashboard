import {
  BadgeCheck,
  Bell,
  ChevronDown,
  CircleX,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Medal,
  Settings2,
  TrendingUp,
  UserRound,
} from "lucide-react";
import AppShell from "~/components/shared/app-shell";

const sidebarItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Inventory", href: "/inventory", icon: FolderOpen },
  { label: "Orders", href: "/orders", icon: CircleX },
  { label: "Prescriptions", href: "/prescriptions", icon: FileText },
  { label: "Compliance", href: "/compliance", icon: Medal },
  { label: "Reports", href: "/reports", icon: TrendingUp },
  { label: "Settings", href: "/settings", icon: Settings2 },
];

function PharmacyNavbarActions() {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Notifications"
        className="relative flex size-[34px] items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
      >
        <Bell className="size-[17px]" strokeWidth={1.8} />
        <span className="absolute top-[5px] right-[5px] size-1.5 rounded-full bg-red-500" />
      </button>
      <button
        type="button"
        aria-label="Jane Doe, Medical Doctor"
        className="flex h-[34px] min-w-[151px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 text-left transition hover:bg-slate-50"
      >
        <UserRound className="size-4 shrink-0 text-slate-500" />
        <span className="flex min-w-0 flex-1 flex-col leading-[14px]">
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-800">
            Jane Doe
            <BadgeCheck className="size-3 fill-emerald-500 text-white" />
          </span>
          <span className="text-[10px] text-slate-500">Medical Doctor</span>
        </span>
        <ChevronDown
          className="size-[15px] shrink-0 text-slate-600"
          strokeWidth={1.8}
        />
      </button>
    </div>
  );
}

function PharmacySidebarFooter() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-[32px] shrink-0 items-center justify-center rounded-full bg-[#e8efff] text-[11px] font-semibold text-[#155eef]">
        SJ
      </div>
      <div className="min-w-0 flex-1 leading-[15px]">
        <p className="truncate text-[11px] font-semibold text-slate-800">
          Dr. Sarah Jenkins
        </p>
        <p className="truncate text-[10px] text-slate-500">Chief Pharmacist</p>
      </div>
      <button
        type="button"
        aria-label="Sign out"
        className="flex size-6 items-center justify-center text-slate-400 hover:text-slate-700"
      >
        <LogOut className="size-4" />
      </button>
    </div>
  );
}

export default function PhDashboardLayout() {
  return (
    <AppShell
      portal="Dashboard"
      sidebarItems={sidebarItems}
      rightSlot={<PharmacyNavbarActions />}
      showThemeToggle={false}
      compactSidebar
      showSidebarLogo={false}
      sidebarFooter={<PharmacySidebarFooter />}
      compactNavbar
    />
  );
}

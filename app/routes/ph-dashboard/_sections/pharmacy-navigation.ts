import {
  CircleX,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Medal,
  Settings2,
  TrendingUp,
} from "lucide-react";

import type { SidebarItem } from "~/components/shared/sidebar";

export const PHARMACY_SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Inventory", href: "/inventory", icon: FolderOpen },
  { label: "Orders", href: "/orders", icon: CircleX },
  { label: "Prescriptions", href: "/prescriptions", icon: FileText },
  { label: "Compliance", href: "/compliance", icon: Medal },
  { label: "Reports", href: "/reports", icon: TrendingUp },
  { label: "Settings", href: "/settings", icon: Settings2 },
];

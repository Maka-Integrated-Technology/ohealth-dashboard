import {
  LayoutDashboard,
  Pill,
  FileText,
  Wallet,
  ShoppingCart,
  Building2,
  Settings,
} from "lucide-react";

import type { SidebarItem } from "~/components/shared/sidebar";

export const PHARMACY_SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Medicines", href: "/medicines", icon: Pill },
  { label: "Prescriptions", href: "/prescriptions", icon: FileText },
  { label: "Earnings", href: "/earnings", icon: Wallet },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Pharmacy Profile", href: "/profile", icon: Building2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

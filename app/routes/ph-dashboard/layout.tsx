import AppShell from "~/components/shared/app-shell";
import { PHARMACY_SIDEBAR_ITEMS } from "./_sections/pharmacy-navigation";
import { PharmacyNavbarActions } from "./_sections/pharmacy-shell";

export default function PhDashboardLayout() {
  return (
    <AppShell
      portal="Dashboard"
      sidebarItems={PHARMACY_SIDEBAR_ITEMS}
      rightSlot={<PharmacyNavbarActions />}
      variant="compact"
      showSidebarLogo
      showNavbarThemeToggle
    />
  );
}

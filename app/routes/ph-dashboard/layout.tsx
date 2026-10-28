import AppShell from "~/components/shared/app-shell";
import { PHARMACY_SIDEBAR_ITEMS } from "./_sections/pharmacy-navigation";
import {
  PharmacyNavbarActions,
  PharmacySidebarFooter,
} from "./_sections/pharmacy-shell";

export default function PhDashboardLayout() {
  return (
    <AppShell
      portal="Dashboard"
      sidebarItems={PHARMACY_SIDEBAR_ITEMS}
      rightSlot={<PharmacyNavbarActions />}
      sidebarFooter={<PharmacySidebarFooter />}
      variant="compact"
    />
  );
}

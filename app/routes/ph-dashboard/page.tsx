import { DashboardHeader } from "./_sections/dashboard-header";
import { InventoryAlerts } from "./_sections/inventory-alerts";
import { OverviewStats } from "./_sections/overview-stats";
import { RecentOrders } from "./_sections/recent-orders";
import { VerificationDetails } from "./_sections/verification-details";

export default function PharmacyDashboard() {
  return (
    <div className="bg-background px-5 pt-6 pb-8 sm:px-6 lg:px-[30px] lg:pt-[26px]">
      <div className="mx-auto w-full max-w-[1680px]">
        <DashboardHeader />
        <OverviewStats />

        <div className="mt-6 grid items-start gap-[18px] lg:grid-cols-[minmax(0,1fr)_clamp(285px,24vw,380px)]">
          <RecentOrders />
          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-1">
            <InventoryAlerts />
            <VerificationDetails />
          </div>
        </div>
      </div>
    </div>
  );
}

import { DashboardHeader } from "./_sections/dashboard-header";
import { EmptyState } from "./_sections/empty-state";
import { ActivityPanel } from "./_sections/activity-panel";
import { StatisticsCards } from "./_sections/statistics-cards";

export default function PharmacyDashboard() {
  return (
    <div className="bg-background min-h-full w-full px-4 py-5 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1200px]">
        <DashboardHeader />

        <StatisticsCards />

        <section className="mt-3 grid grid-cols-1 items-start gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(245px,0.36fr)]">
          <div className="space-y-5">
            <section aria-labelledby="inventory-heading">
              <h2
                id="inventory-heading"
                className="text-foreground mb-3 px-1 text-[11px] font-medium"
              >
                INVENTORY
              </h2>

              <EmptyState
                title="No Available Medicines"
                description="You don't have any medicines today yet. Once you add medicines to your inventory, they'll appear here in chronological order."
              />
            </section>

            <section aria-labelledby="orders-heading">
              <h2
                id="orders-heading"
                className="text-foreground mb-3 px-1 text-[11px] font-medium"
              >
                ORDERS
              </h2>

              <EmptyState
                title="No Orders yet"
                description="You don't have any order requests yet. Once patients place orders, they will appear here."
              />
            </section>
          </div>

          <aside aria-label="Recent activity">
            <ActivityPanel />
          </aside>
        </section>
      </div>
    </div>
  );
}

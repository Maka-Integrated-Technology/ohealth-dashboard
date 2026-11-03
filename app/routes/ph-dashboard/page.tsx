import { DashboardHeader } from "./_sections/dashboard-header";
import {
  ShoppingCart,
  Pill,
  ClipboardCheck,
  Clock,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { EmptyState } from "./_sections/empty-state";
import { ActivityPanel } from "./_sections/activity-panel";

// ORIGINAL IMPORT — retained for the previous dashboard heading.
// import { CheckCircle2 } from "lucide-react";

type Stat = {
  label: string;
  icon: LucideIcon;
  iconColor: string;
  iconBackground: string;
  hint: string;
};

const STATS: Stat[] = [
  {
    label: "New Orders",
    icon: ShoppingCart,
    iconColor: "text-blue-600",
    iconBackground: "bg-blue-50",
    hint: "↑ 0% in the last 30 days",
  },
  {
    label: "Total Medicines",
    icon: Pill,
    iconColor: "text-emerald-600",
    iconBackground: "bg-emerald-50",
    hint: "No medicines added today",
  },
  {
    label: "Prescriptions Fulfilled",
    icon: ClipboardCheck,
    iconColor: "text-orange-600",
    iconBackground: "bg-orange-50",
    hint: "No prescriptions fulfilled today",
  },
  {
    label: "Pending Orders",
    icon: Clock,
    iconColor: "text-orange-600",
    iconBackground: "bg-orange-50",
    hint: "No pending orders today",
  },
];

export default function PharmacyDashboard() {
  /*
   * ORIGINAL DATE AND GREETING LOGIC
   * Retained for reference.
   * DashboardHeader now handles this functionality.
   *
  const now = new Date();
  const hour = now.getHours();

  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(now);

  const timeLabel = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  */

  return (
    <div className="bg-background min-h-full w-full px-4 py-5 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Dashboard heading */}
        <DashboardHeader />

        {/*
         * ORIGINAL DASHBOARD HEADING
         * Retained for reference and easy restoration.
         *
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-foreground text-lg font-bold tracking-tight sm:text-xl">
              {greeting}, MedPlus Pharmacy
            </h1>

            <p className="text-muted-foreground mt-1 text-[10px]">
              {dateLabel} · {timeLabel}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-2 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="size-3.5" />
            Verified Account
          </div>
        </header>
        */}

        {/* Statistics */}
        <section
          aria-label="Pharmacy statistics"
          className="grid grid-cols-2 gap-3 xl:grid-cols-4"
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.label}
                className="border-border min-h-[105px] min-w-0 gap-2 rounded-xl py-3 shadow-none"
              >
                <CardHeader className="px-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-muted-foreground text-[9px] font-medium sm:text-[10px]">
                      {stat.label}
                    </CardTitle>

                    <div
                      className={`flex size-6 shrink-0 items-center justify-center rounded ${stat.iconBackground}`}
                    >
                      <Icon className={`size-3.5 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-3">
                  <p className="text-foreground text-lg leading-tight font-semibold">
                    —
                  </p>

                  <p className="text-muted-foreground mt-1 text-[9px] leading-4">
                    {stat.hint}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Inventory, Orders and Activity */}
        <section className="mt-3 grid grid-cols-1 items-start gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(245px,0.36fr)]">
          {/* Left column */}
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

          {/* Right column */}
          <aside aria-label="Recent activity">
            <ActivityPanel />
          </aside>
        </section>
      </div>
    </div>
  );
}

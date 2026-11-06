import {
  ShoppingCart,
  Pill,
  ClipboardCheck,
  Clock,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

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

export function StatisticsCards() {
  return (
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
  );
}

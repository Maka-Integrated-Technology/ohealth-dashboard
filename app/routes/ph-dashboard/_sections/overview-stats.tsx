import {
  ArrowUpRight,
  Award,
  ClipboardList,
  Package,
  Pill,
} from "lucide-react";

import { Card } from "~/components/ui/card";

const STATS = [
  {
    icon: ClipboardList,
    label: "Total Medicines",
    value: "1,247",
    change: "+4.2%",
  },
  { icon: Package, label: "Pending Orders", value: "23", change: "-12%" },
  { icon: Pill, label: "Prescriptions Filled", value: "89", change: "+8.7%" },
  { icon: Award, label: "Compliance Score", value: "98%", change: "Optimal" },
] as const;

export function OverviewStats() {
  return (
    <section
      aria-label="Pharmacy overview"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[18px]"
    >
      {STATS.map(({ icon: Icon, label, value, change }) => (
        <Card
          key={label}
          className="border-border gap-0 border p-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.025)] ring-0 sm:min-h-[120px] sm:p-[15px]"
        >
          <div className="flex items-center justify-between gap-2.5">
            <h2 className="text-muted-foreground text-[13px] font-medium sm:text-[clamp(12px,0.9vw,15px)]">
              {label}
            </h2>
            <div className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-lg">
              <Icon className="size-4" strokeWidth={2} />
            </div>
          </div>
          <p className="text-foreground mt-2 text-[clamp(20px,1.5vw,28px)] leading-[27px] font-bold tracking-[-0.035em]">
            {value}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-xs leading-[14px]">
            <span className="inline-flex items-center gap-0.5 rounded-sm bg-emerald-50 px-1 font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <ArrowUpRight
                aria-hidden="true"
                className="size-3"
                strokeWidth={2.5}
              />
              {change}
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        </Card>
      ))}
    </section>
  );
}

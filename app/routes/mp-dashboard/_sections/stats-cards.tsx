import { Users, CalendarDays, Clock } from "lucide-react";
import { cn } from "~/lib/utils/helpers";

const STATS = [
  {
    icon: Users,
    label: "PATIENTS",
    value: "121",
    hint: (
      <>
        <span className="text-blue-600">↑ 3%</span>{" "}
        <span className="text-muted-foreground">in the last 30 days</span>
      </>
    ),
    iconWrapperClass: "bg-blue-50 text-blue-600",
  },
  {
    icon: CalendarDays,
    label: "TODAY'S APPOINTMENT",
    value: "5",
    hint: (
      <>
        <span className="text-emerald-600">2 completed</span>
        <span className="text-muted-foreground"> • </span>
        <span className="text-orange-500">3 remaining</span>
      </>
    ),
    iconWrapperClass: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Clock,
    label: "PENDING APPOINTMENTS",
    value: "9",
    hint: (
      <span className="text-muted-foreground">2 appointments tomorrow</span>
    ),
    iconWrapperClass: "bg-orange-50 text-orange-500",
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between pb-2">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {stat.label}
            </p>
            <div className={cn("rounded-lg p-1.5", stat.iconWrapperClass)}>
              <stat.icon className="size-4" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
          <div className="mt-1 text-xs">{stat.hint}</div>
        </div>
      ))}
    </div>
  );
}

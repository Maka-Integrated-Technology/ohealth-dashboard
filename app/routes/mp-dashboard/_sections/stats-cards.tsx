import type { ReactNode } from "react";
import { CalendarDays, Clock, Users, type LucideIcon } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import type { ProfessionalDashboardStats } from "~/features/professional-dashboard/types";
import { cn } from "~/lib/utils/helpers";

type StatCard = {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: ReactNode;
  iconWrapperClass: string;
};

interface StatsCardsProps {
  stats?: ProfessionalDashboardStats;
  isLoading?: boolean;
  isError?: boolean;
}

function formatPatientGrowth(percent: number): ReactNode {
  if (percent > 0) {
    return (
      <span className="text-blue-600">↑ {percent}% in the last 30 days</span>
    );
  }

  if (percent < 0) {
    return (
      <span className="text-destructive">
        ↓ {Math.abs(percent)}% in the last 30 days
      </span>
    );
  }

  return <span className="text-muted-foreground">No change in 30 days</span>;
}

function pluralize(value: number, singular: string, plural = `${singular}s`) {
  return value === 1 ? singular : plural;
}

function buildStats(stats: ProfessionalDashboardStats): StatCard[] {
  return [
    {
      icon: Users,
      label: "PATIENTS",
      value: stats.patients.toLocaleString(),
      hint: formatPatientGrowth(stats.patient_growth_percent),
      iconWrapperClass: "bg-blue-50 text-blue-600",
    },
    {
      icon: CalendarDays,
      label: "TODAY'S APPOINTMENT",
      value: stats.todays_appointments.toLocaleString(),
      hint: (
        <>
          <span className="text-muted-foreground">
            {stats.completed_todays_appointments.toLocaleString()} completed
          </span>
          <span className="text-muted-foreground"> • </span>
          <span className="text-emerald-600">
            {stats.remaining_todays_appointments.toLocaleString()} remaining
          </span>
        </>
      ),
      iconWrapperClass: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: Clock,
      label: "PENDING APPOINTMENTS",
      value: stats.pending_appointments.toLocaleString(),
      hint: (
        <span className="text-muted-foreground">
          {stats.pending_appointments_tomorrow.toLocaleString()}{" "}
          {pluralize(stats.pending_appointments_tomorrow, "appointment")}{" "}
          tomorrow
        </span>
      ),
      iconWrapperClass: "bg-orange-50 text-orange-500",
    },
  ];
}

const EMPTY_STATS: ProfessionalDashboardStats = {
  patients: 0,
  patient_growth_percent: 0,
  todays_appointments: 0,
  completed_todays_appointments: 0,
  remaining_todays_appointments: 0,
  pending_appointments: 0,
  pending_appointments_tomorrow: 0,
};

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="border-border bg-card rounded-2xl border p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="size-7 rounded-lg" />
          </div>
          <Skeleton className="mt-4 h-9 w-16" />
          <Skeleton className="mt-3 h-4 w-40" />
        </div>
      ))}
    </div>
  );
}

const ERROR_STATS = [
  {
    icon: Users,
    label: "PATIENTS",
    value: "0",
    hint: <span className="text-muted-foreground">Could not load stats</span>,
    iconWrapperClass: "bg-blue-50 text-blue-600",
  },
  {
    icon: CalendarDays,
    label: "TODAY'S APPOINTMENT",
    value: "0",
    hint: <span className="text-muted-foreground">Could not load stats</span>,
    iconWrapperClass: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Clock,
    label: "PENDING APPOINTMENTS",
    value: "0",
    hint: <span className="text-muted-foreground">Could not load stats</span>,
    iconWrapperClass: "bg-orange-50 text-orange-500",
  },
] satisfies StatCard[];

export function StatsCards({ stats, isLoading, isError }: StatsCardsProps) {
  if (isLoading) return <StatsCardsSkeleton />;

  const items = isError ? ERROR_STATS : buildStats(stats ?? EMPTY_STATS);
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {items.map((stat) => (
        <div
          key={stat.label}
          className="border-border bg-card rounded-2xl border p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between pb-2">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {stat.label}
            </p>
            <div className={cn("rounded-lg p-1.5", stat.iconWrapperClass)}>
              <stat.icon className="size-4" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-3xl font-medium">{stat.value}</p>
          <div className="mt-1 text-xs">{stat.hint}</div>
        </div>
      ))}
    </div>
  );
}

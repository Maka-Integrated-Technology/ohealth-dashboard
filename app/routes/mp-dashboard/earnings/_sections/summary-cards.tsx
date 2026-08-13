import { CalendarCheck2, Clock, Wallet } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils/helpers";
import type { EarningsSummary } from "~/features/earnings/types";
import { formatNaira } from "./_primitives";

interface SummaryCardsProps {
  summary?: EarningsSummary;
  isLoading: boolean;
}

export function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const cards = [
    {
      icon: Wallet,
      label: "MONTHLY EARNINGS",
      value: formatNaira(summary.monthlyEarnings),
      hint: (
        <span className="text-emerald-600">
          ↑ {summary.monthlyEarningsPercentChange}% vs last month
        </span>
      ),
      iconWrapperClass: "bg-blue-50 text-blue-600",
    },
    {
      icon: CalendarCheck2,
      label: "COMPLETED CONSULTATIONS",
      value: summary.completedConsultations.toString(),
      hint: (
        <span className="text-emerald-600">
          +{summary.consultationsChange} this month
        </span>
      ),
      iconWrapperClass: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: Clock,
      label: "PENDING PAYOUTS",
      value: formatNaira(summary.pendingPayouts),
      hint: (
        <span className="text-muted-foreground">
          {summary.pendingTransactions} transactions
        </span>
      ),
      iconWrapperClass: "bg-orange-50 text-orange-500",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="border-border bg-card rounded-2xl border p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between pb-2">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {card.label}
            </p>
            <div className={cn("rounded-lg p-1.5", card.iconWrapperClass)}>
              <card.icon className="size-4" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-3xl font-medium">{card.value}</p>
          <div className="mt-1 text-xs">{card.hint}</div>
        </div>
      ))}
    </div>
  );
}

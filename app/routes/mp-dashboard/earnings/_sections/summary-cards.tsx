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
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-[20px]" />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const cards = [
    {
      icon: Wallet,
      label: "Monthly Earnings",
      value: formatNaira(summary.monthlyEarnings),
      hint: `↑ ${summary.monthlyEarningsPercentChange}% vs last month`,
      hintClass: "text-emerald-600",
      iconWrapperClass:
        "border border-blue-100 bg-blue-50 text-blue-600 shadow-[0_8px_20px_rgba(59,130,246,0.12)]",
    },
    {
      icon: CalendarCheck2,
      label: "Completed Consultations",
      value: summary.completedConsultations.toString(),
      hint: `+${summary.consultationsChange} this month`,
      hintClass: "text-emerald-600",
      iconWrapperClass:
        "border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-[0_8px_20px_rgba(16,185,129,0.12)]",
    },
    {
      icon: Clock,
      label: "Pending Payouts",
      value: formatNaira(summary.pendingPayouts),
      hint: `${summary.pendingTransactions} transactions`,
      hintClass: "text-muted-foreground",
      iconWrapperClass:
        "border border-orange-100 bg-orange-50 text-orange-500 shadow-[0_8px_20px_rgba(249,115,22,0.12)]",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="border-border/80 bg-card rounded-[20px] border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.16em] uppercase">
              {card.label}
            </p>

            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                card.iconWrapperClass
              )}
            >
              <card.icon className="h-4 w-4" strokeWidth={1.8} />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-foreground text-[2rem] leading-none font-semibold tracking-[-0.06em]">
              {card.value}
            </p>

            <span className={cn("text-xs font-medium", card.hintClass)}>
              {card.hint}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

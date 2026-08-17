import { Empty } from "~/components/ui/empty";
import { useEarnings } from "~/features/earnings/hooks";
import { ConsultationTypeChart } from "./_sections/consultation-type-chart";
import { EarningsHeader } from "./_sections/header";
import { RevenueTrendChart } from "./_sections/revenue-trend-chart";
import { SummaryCards } from "./_sections/summary-cards";
import { TransactionHistory } from "./_sections/transaction-history";

export default function EarningsPage() {
  const { data, isLoading, isError } = useEarnings();
  const periodLabel =
    data?.revenueTrend.at(-1)?.month ??
    new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
      new Date()
    );

  if (isError) {
    return (
      <div className="bg-background min-h-screen p-6 lg:p-8">
        <div className="mx-auto w-full max-w-350">
          <EarningsHeader periodLabel={periodLabel} />
          <Empty>
            <p className="text-muted-foreground">
              Couldn&apos;t load earnings. Try refreshing the page.
            </p>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen p-6 lg:p-8">
      <div className="mx-auto w-full max-w-350">
        <EarningsHeader periodLabel={periodLabel} />

        <div className="space-y-10">
          <SummaryCards summary={data?.summary} isLoading={isLoading} />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
            <RevenueTrendChart
              data={data?.revenueTrend ?? []}
              isLoading={isLoading}
            />
            <ConsultationTypeChart
              data={data?.byConsultationType ?? []}
              isLoading={isLoading}
            />
          </div>

          <TransactionHistory
            transactions={data?.transactions ?? []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

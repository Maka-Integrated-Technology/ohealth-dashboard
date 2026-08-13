import { Empty } from "~/components/ui/empty";
import { useEarnings } from "~/features/earnings/hooks";
import { EarningsHeader } from "./_sections/header";
import { SummaryCards } from "./_sections/summary-cards";
import { RevenueTrendChart } from "./_sections/revenue-trend-chart";
import { ConsultationTypeChart } from "./_sections/consultation-type-chart";
import { TransactionHistory } from "./_sections/transaction-history";

export default function EarningsPage() {
  const { data, isLoading, isError } = useEarnings();

  if (isError) {
    return (
      <div className="bg-background min-h-screen p-6 lg:p-8">
        <div className="mx-auto w-full max-w-350">
          <EarningsHeader />
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
        <EarningsHeader />
        <div className="space-y-6">
          <SummaryCards summary={data?.summary} isLoading={isLoading} />
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <RevenueTrendChart
                data={data?.revenueTrend ?? []}
                isLoading={isLoading}
              />
            </div>
            <div className="lg:col-span-2">
              <ConsultationTypeChart
                data={data?.byConsultationType ?? []}
                isLoading={isLoading}
              />
            </div>
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

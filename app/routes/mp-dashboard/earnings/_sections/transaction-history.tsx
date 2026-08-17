import { Card, CardContent } from "~/components/ui/card";
import { Empty } from "~/components/ui/empty";
import { Skeleton } from "~/components/ui/skeleton";
import type { EarningsTransaction } from "~/features/earnings/types";
import {
  formatNaira,
  formatTransactionDate,
  PAYOUT_STATUS_BADGE_CLASSES,
  PAYOUT_STATUS_LABEL,
} from "./_primitives";

type TransactionHistoryProps = {
  transactions: EarningsTransaction[];
  isLoading: boolean;
};

export function TransactionHistory({
  transactions,
  isLoading,
}: TransactionHistoryProps) {
  return (
    <section>
      <h2 className="text-foreground mb-4 text-[18px] font-bold uppercase">
        Transaction History
        <span className="text-muted-foreground ml-2 text-base font-normal normal-case">
          · {transactions.length} transactions
        </span>
      </h2>

      <Card className="border-border gap-0 overflow-hidden rounded-2xl border py-0 shadow-none ring-0">
        <CardContent className="px-0 py-0">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-6">
              <Empty>
                <p className="text-muted-foreground">No transactions yet.</p>
              </Empty>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-left">
                <thead className="border-border border-b">
                  <tr>
                    {["Patient", "Date", "Type", "Amount", "Status"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="text-muted-foreground px-12 py-3 text-xs font-semibold uppercase"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-border/60 border-b last:border-b-0"
                    >
                      <td className="text-foreground px-12 py-3 text-lg font-bold">
                        {transaction.patientName}
                      </td>
                      <td className="text-muted-foreground px-12 py-3 font-mono text-sm">
                        {formatTransactionDate(transaction.date)}
                      </td>
                      <td className="text-muted-foreground px-12 py-3 text-[16px]">
                        {transaction.type}
                      </td>
                      <td className="text-muted-foreground px-12 py-3 text-[16px]">
                        {formatNaira(transaction.amount)}
                      </td>
                      <td className="px-12 py-3">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${PAYOUT_STATUS_BADGE_CLASSES[transaction.status]}`}
                        >
                          {PAYOUT_STATUS_LABEL[transaction.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

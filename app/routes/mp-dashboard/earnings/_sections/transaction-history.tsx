import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Empty } from "~/components/ui/empty";
import { Skeleton } from "~/components/ui/skeleton";
import type { EarningsTransaction } from "~/features/earnings/types";
import {
  formatNaira,
  formatTransactionDate,
  PAYOUT_STATUS_BADGE_CLASSES,
  PAYOUT_STATUS_LABEL,
} from "./_primitives";

interface TransactionHistoryProps {
  transactions: EarningsTransaction[];
  isLoading: boolean;
}

export function TransactionHistory({
  transactions,
  isLoading,
}: TransactionHistoryProps) {
  return (
    <div className="border-border bg-card overflow-hidden rounded-2xl border">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-foreground text-base font-semibold">
          Transaction History
        </h2>
      </div>

      {isLoading ? (
        <div className="space-y-3 px-6 pb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="px-6 pb-6">
          <Empty>
            <p className="text-muted-foreground">No transactions yet.</p>
          </Empty>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-left text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-muted-foreground px-6 py-3 text-xs font-medium tracking-wider uppercase">
                  Patient
                </th>
                <th className="text-muted-foreground px-6 py-3 text-xs font-medium tracking-wider uppercase">
                  Date
                </th>
                <th className="text-muted-foreground px-6 py-3 text-xs font-medium tracking-wider uppercase">
                  Type
                </th>
                <th className="text-muted-foreground px-6 py-3 text-xs font-medium tracking-wider uppercase">
                  Amount
                </th>
                <th className="text-muted-foreground px-6 py-3 text-xs font-medium tracking-wider uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-border border-b last:border-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 font-bold text-blue-700">
                          {transaction.patientInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground font-medium">
                        {transaction.patientName}
                      </span>
                    </div>
                  </td>
                  <td className="text-muted-foreground px-6 py-4">
                    {formatTransactionDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4">{transaction.type}</td>
                  <td className="px-6 py-4 font-medium">
                    {formatNaira(transaction.amount)}
                  </td>
                  <td className="px-6 py-4">
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
    </div>
  );
}

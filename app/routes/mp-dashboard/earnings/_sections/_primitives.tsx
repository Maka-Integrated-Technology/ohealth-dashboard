import type { PayoutStatus } from "~/features/earnings/types";

export const PAYOUT_STATUS_LABEL: Record<PayoutStatus, string> = {
  paid: "Paid",
  processed: "Processed",
  pending: "Pending",
};

export const PAYOUT_STATUS_BADGE_CLASSES: Record<PayoutStatus, string> = {
  paid: "bg-green-50 text-green-700 border-green-200",
  processed: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-orange-50 text-orange-600 border-orange-200",
};

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactNaira(amount: number): string {
  return `₦${Math.round(amount / 1000)}k`;
}

export function formatTransactionDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatCurrentMonthYear(): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date());
}

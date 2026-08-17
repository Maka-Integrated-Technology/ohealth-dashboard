import type { PayoutStatus } from "~/features/earnings/types";

export const PAYOUT_STATUS_LABEL: Record<PayoutStatus, string> = {
  paid: "Paid",
  processed: "Processed",
  pending: "Pending",
};

export const PAYOUT_STATUS_BADGE_CLASSES: Record<PayoutStatus, string> = {
  paid: "border-[#9debc7] bg-[#ecfdf5] text-[#00965a]",
  processed: "border-[#bdd8ff] bg-[#eff6ff] text-primary",
  pending: "border-[#f8d66d] bg-[#fff9e7] text-[#e56b00]",
};

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

export function formatNairaParts(amount: number): {
  whole: string;
  fraction: string;
} {
  return {
    whole: formatNaira(amount),
    fraction: ".00",
  };
}

export function formatTransactionDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

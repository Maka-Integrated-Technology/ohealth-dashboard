import { delay, http, HttpResponse } from "msw";
import type {
  ConsultationTypeRevenue,
  EarningsResponse,
  EarningsTransaction,
  RevenueTrendPoint,
} from "~/features/earnings/types";

const summary: EarningsResponse["summary"] = {
  monthlyEarnings: 200000,
  monthlyEarningsPercentChange: 18,
  completedConsultations: 50,
  consultationsChange: 12,
  pendingPayouts: 40000,
  pendingTransactions: 2,
};

function generateRevenueTrend(): RevenueTrendPoint[] {
  const now = new Date();
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(date);

    months.push({ month: label, amount: 0 });
  }

  const amounts = [75_000, 115_000, 100_000, 170_000, 195_000, 160_000];
  return months.map((m, i) => ({ ...m, amount: amounts[i] }));
}

const revenueTrend: RevenueTrendPoint[] = generateRevenueTrend();

const byConsultationType: ConsultationTypeRevenue[] = [
  { type: "Video", amount: 200_000, consultations: 10 },
  { type: "Chat", amount: 50_000, consultations: 5 },
];

const transactions: EarningsTransaction[] = [
  {
    id: "tx-001",
    patientName: "Amara Okafor",
    patientInitials: "AO",
    date: "2026-05-20T12:00:00.000Z",
    type: "Video Consultation",
    amount: 20_000,
    status: "paid",
  },
  {
    id: "tx-002",
    patientName: "Priya Nair",
    patientInitials: "PN",
    date: "2026-05-19T12:00:00.000Z",
    type: "Video Consultation",
    amount: 20_000,
    status: "paid",
  },
  {
    id: "tx-003",
    patientName: "Marcus Reid",
    patientInitials: "MR",
    date: "2026-05-18T12:00:00.000Z",
    type: "Video Consultation",
    amount: 20_000,
    status: "processed",
  },
  {
    id: "tx-004",
    patientName: "David Chen",
    patientInitials: "DC",
    date: "2026-05-17T12:00:00.000Z",
    type: "Follow-up Chat",
    amount: 20_000,
    status: "pending",
  },
  {
    id: "tx-005",
    patientName: "James Whitfield",
    patientInitials: "JW",
    date: "2026-05-15T12:00:00.000Z",
    type: "Chat Consultation",
    amount: 20_000,
    status: "paid",
  },
  {
    id: "tx-006",
    patientName: "Layla Osman",
    patientInitials: "LO",
    date: "2026-05-14T12:00:00.000Z",
    type: "Video Consultation",
    amount: 20_000,
    status: "pending",
  },
];

const MOCK_NETWORK_DELAY_MS = 500;

export const earningsHandlers = [
  http.get("/api/earnings", async () => {
    await delay(MOCK_NETWORK_DELAY_MS);
    return HttpResponse.json<EarningsResponse>({
      summary,
      revenueTrend,
      byConsultationType,
      transactions,
    });
  }),
];

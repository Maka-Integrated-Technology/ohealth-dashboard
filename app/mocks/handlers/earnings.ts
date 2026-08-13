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

const revenueTrend: RevenueTrendPoint[] = [
  { month: "Dec 2025", amount: 120000 },
  { month: "Jan 2026", amount: 135000 },
  { month: "Feb 2026", amount: 148000 },
  { month: "Mar 2026", amount: 162000 },
  { month: "Apr 2026", amount: 180000 },
  { month: "May 2026", amount: 200000 },
];

const byConsultationType: ConsultationTypeRevenue[] = [
  { type: "Video", amount: 125000, consultations: 5 },
  { type: "Chat", amount: 75000, consultations: 5 },
];

const transactions: EarningsTransaction[] = [
  {
    id: "tx-001",
    patientName: "Emeka Bello",
    patientInitials: "EB",
    date: "2026-05-28T10:30:00.000Z",
    type: "Video",
    amount: 25000,
    status: "paid",
  },
  {
    id: "tx-002",
    patientName: "Fatima Al-Hassan",
    patientInitials: "FA",
    date: "2026-05-25T13:00:00.000Z",
    type: "Chat",
    amount: 15000,
    status: "processed",
  },
  {
    id: "tx-003",
    patientName: "Priya Nair",
    patientInitials: "PN",
    date: "2026-05-20T11:00:00.000Z",
    type: "Video",
    amount: 25000,
    status: "paid",
  },
  {
    id: "tx-004",
    patientName: "David Chen",
    patientInitials: "DC",
    date: "2026-05-18T14:00:00.000Z",
    type: "Video",
    amount: 25000,
    status: "pending",
  },
  {
    id: "tx-005",
    patientName: "Raj Patel",
    patientInitials: "RP",
    date: "2026-05-15T09:00:00.000Z",
    type: "Chat",
    amount: 15000,
    status: "paid",
  },
  {
    id: "tx-006",
    patientName: "Sarah Morgan",
    patientInitials: "SM",
    date: "2026-05-10T15:15:00.000Z",
    type: "Chat",
    amount: 15000,
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

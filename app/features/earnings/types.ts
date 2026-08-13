export type EarningConsultationType = "Video" | "Chat" | "In-Person";
export type PayoutStatus = "paid" | "processed" | "pending";

export interface EarningsSummary {
  monthlyEarnings: number;
  monthlyEarningsPercentChange: number;
  completedConsultations: number;
  consultationsChange: number;
  pendingPayouts: number;
  pendingTransactions: number;
}

export interface RevenueTrendPoint {
  month: string;
  amount: number;
}

export interface ConsultationTypeRevenue {
  type: EarningConsultationType;
  amount: number;
  consultations: number;
}

export interface EarningsTransaction {
  id: string;
  patientName: string;
  patientInitials: string;
  date: string;
  type: EarningConsultationType;
  amount: number;
  status: PayoutStatus;
}

export interface EarningsResponse {
  summary: EarningsSummary;
  revenueTrend: RevenueTrendPoint[];
  byConsultationType: ConsultationTypeRevenue[];
  transactions: EarningsTransaction[];
}

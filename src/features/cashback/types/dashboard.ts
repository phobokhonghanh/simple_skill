export interface DashboardStats {
  countOrders: number;
  totalCashback: number;
  totalPaymentsPending: number;
  totalPaymentsCompleted: number;
}

export interface DashboardEnvelope {
  ok: boolean;
  code: string;
  data?: DashboardStats;
}

export type Transaction = {
  id: string;
  merchant: string;
  date: string;
  category: "TECHNOLOGY" | "LIFESTYLE" | "UTILITIES" | "INCOME" | "TRAVEL" | "FOOD";
  status: "CLEARED" | "PENDING";
  amount: number;
};

export type Alert = {
  id: string;
  type: "danger" | "warning" | "info";
  title: string;
  body: string;
};

export type SpendingSlice = {
  label: string;
  pct: number;
  tone: "info" | "warning" | "success" | "neutral";
};

export type DashboardData = {
  netWorth: number;
  netWorthChangePct: number;
  monthlySpending: number;
  spendingChangePct: number;
  totalSavings: number;
  savingsOnTrack: boolean;
  spending: SpendingSlice[];
  transactions: Transaction[];
  alerts: Alert[];
  portfolioHistory: { date: string; value: number }[];
  sectors: { name: string; pct: number }[];
};

export type InsightsData = {
  portfolioValue: number;
  changePct: number;
  series: { date: string; value: number }[];
  sectors: { name: string; pct: number }[];
  sentimentScore: number;
  sentimentLabel: string;
  topPerformer: { symbol: string; changePct: number };
  riskLevel: "Conservative" | "Moderate" | "Aggressive";
};

export type BudgetCategory = {
  id: string;
  label: string;
  icon: "home" | "cart" | "film" | "spark";
  spent: number;
  limit: number;
  status: "FIXED" | "HEALTHY" | "CRITICAL" | "OPTIMAL";
  tone: "info" | "success" | "danger" | "warning";
};

export type BudgetsData = {
  period: string;
  totalSpent: number;
  totalLimit: number;
  projectedSurplus: number;
  savingsEfficiency: number;
  daysRemaining: number;
  categories: BudgetCategory[];
  alerts: { tone: "danger" | "warning" | "info"; title: string; body: string; time: string }[];
};

export const dashboardMock: DashboardData = {
  netWorth: 1_248_500,
  netWorthChangePct: 12.4,
  monthlySpending: 4_280,
  spendingChangePct: 2.1,
  totalSavings: 245_000,
  savingsOnTrack: true,
  spending: [
    { label: "Housing & Utilities", pct: 42, tone: "info" },
    { label: "Dining & Leisure", pct: 18, tone: "warning" },
    { label: "Investments", pct: 25, tone: "success" },
    { label: "Transportation", pct: 15, tone: "neutral" },
  ],
  transactions: (() => {
    const seed: Transaction[] = [
      { id: "t1", merchant: "Apple Store Soho", date: "2023-10-24T14:20:00Z", category: "TECHNOLOGY", status: "CLEARED", amount: -1299.0 },
      { id: "t2", merchant: "Blue Hill Farm", date: "2023-10-23T20:15:00Z", category: "LIFESTYLE", status: "CLEARED", amount: -485.2 },
      { id: "t3", merchant: "ConEd Utility Bill", date: "2023-10-22T09:00:00Z", category: "UTILITIES", status: "PENDING", amount: -214.1 },
      { id: "t4", merchant: "Monthly Salary Deposit", date: "2023-10-21T12:00:00Z", category: "INCOME", status: "CLEARED", amount: 12500.0 },
      { id: "t5", merchant: "Delta Air Lines", date: "2023-10-20T08:42:00Z", category: "TRAVEL", status: "PENDING", amount: -842.1 },
      { id: "t6", merchant: "Whole Foods Market", date: "2023-10-19T18:10:00Z", category: "FOOD", status: "CLEARED", amount: -132.44 },
    ];
    const merchants: Array<[string, Transaction["category"]]> = [
      ["Spotify Premium", "TECHNOLOGY"], ["Equinox Gym", "LIFESTYLE"], ["Verizon Wireless", "UTILITIES"],
      ["Uber", "TRAVEL"], ["Trader Joe's", "FOOD"], ["AWS Cloud", "TECHNOLOGY"],
      ["Sweetgreen", "FOOD"], ["The Oak Room", "LIFESTYLE"], ["JetBlue", "TRAVEL"],
      ["GitHub Copilot", "TECHNOLOGY"], ["Con Edison", "UTILITIES"], ["Costco", "FOOD"],
      ["Nike", "LIFESTYLE"], ["Amtrak", "TRAVEL"], ["Dropbox", "TECHNOLOGY"],
    ];
    const extra: Transaction[] = Array.from({ length: 120 }, (_, i) => {
      const [merchant, category] = merchants[i % merchants.length];
      const d = new Date(2023, 9, 18 - (i % 60));
      const amt = -Math.round((20 + Math.abs(Math.sin(i * 1.7)) * 480) * 100) / 100;
      return {
        id: `g${i + 1}`,
        merchant,
        date: d.toISOString(),
        category,
        status: i % 5 === 0 ? "PENDING" : "CLEARED",
        amount: amt,
      };
    });
    return [...seed, ...extra];
  })(),
  alerts: [
    { id: "a1", type: "danger", title: "Subscription Spike", body: '3 new recurring charges detected from "Cloud SaaS" in the last 48h.' },
    { id: "a2", type: "warning", title: "Emergency Fund Cap", body: 'Your "Rainy Day" fund has reached its target of $20k. Redirecting flows?' },
    { id: "a3", type: "info", title: "Dividend Reinvestment", body: "AAPL and MSFT paid dividends today. Automatic reinvestment pending." },
  ],
  portfolioHistory: Array.from({ length: 12 }).map((_, i) => ({
    date: new Date(2024, i, 1).toISOString(),
    value: 1_050_000 + i * 18_000 + Math.round(Math.sin(i) * 22_000),
  })),
  sectors: [
    { name: "Technology", pct: 42 },
    { name: "Financials", pct: 18 },
    { name: "Healthcare", pct: 15 },
    { name: "Other", pct: 25 },
  ],
};

function buildPortfolioSeries(): { date: string; value: number }[] {
  const days = 730;
  const start = new Date();
  start.setDate(start.getDate() - days);
  const out: { date: string; value: number }[] = [];
  let value = 980_000;
  for (let i = 0; i < days; i++) {
    const drift = 480 + Math.sin(i / 14) * 320 + Math.cos(i / 47) * 200;
    const noise = Math.sin(i * 1.7) * 1800;
    value = Math.max(800_000, value + drift + noise);
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push({ date: d.toISOString().slice(0, 10), value: Math.round(value) });
  }
  return out;
}

export const insightsMock: InsightsData = {
  portfolioValue: 1_424_902,
  changePct: 12.4,
  series: buildPortfolioSeries(),
  sectors: dashboardMock.sectors,
  sentimentScore: 74,
  sentimentLabel: "Optimistic",
  topPerformer: { symbol: "NVDA", changePct: 8.4 },
  riskLevel: "Moderate",
};

export const budgetsMock: BudgetsData = {
  period: "October 2023",
  totalSpent: 12_450,
  totalLimit: 15_000,
  projectedSurplus: 2_550,
  savingsEfficiency: 94.2,
  daysRemaining: 12,
  categories: [
    { id: "housing", label: "Housing & Rent", icon: "home", spent: 3200, limit: 3200, status: "FIXED", tone: "info" },
    { id: "groceries", label: "Groceries", icon: "cart", spent: 642.5, limit: 900, status: "HEALTHY", tone: "success" },
    { id: "entertainment", label: "Entertainment", icon: "film", spent: 450, limit: 500, status: "CRITICAL", tone: "danger" },
    { id: "lifestyle", label: "Lifestyle", icon: "spark", spent: 210, limit: 600, status: "OPTIMAL", tone: "warning" },
  ],
  alerts: [
    { tone: "danger", title: "Entertainment Threshold", body: "Limit is at 90% ($450/$500). Pause non-essential bookings.", time: "2 HOURS AGO" },
    { tone: "warning", title: "Dining Anomaly", body: "Spending at 'The Oak Room' is 20% higher than your average.", time: "YESTERDAY" },
    { tone: "info", title: "Subscription Renewed", body: "'Bloomberg Terminal' subscription was successfully auto-paid.", time: "2 DAYS AGO" },
  ],
};

export const emptyDashboard: DashboardData = {
  ...dashboardMock,
  netWorth: 0,
  monthlySpending: 0,
  totalSavings: 0,
  spending: [],
  transactions: [],
  alerts: [],
  sectors: [],
  portfolioHistory: [],
};
export const emptyInsights: InsightsData = { ...insightsMock, series: [], sectors: [], portfolioValue: 0, changePct: 0 };
export const emptyBudgets: BudgetsData = { ...budgetsMock, categories: [], alerts: [], totalSpent: 0, projectedSurplus: 0 };

import type { DashboardData } from "./mock-data";

export type GeneratedInsight = {
  id: string;
  tone: "positive" | "warning" | "neutral";
  headline: string;
  detail: string;
};

export function generateInsights(d: DashboardData): GeneratedInsight[] {
  const insights: GeneratedInsight[] = [];

  const tech = d.sectors.find((s) => s.name === "Technology");
  if (tech && tech.pct > 30) {
    insights.push({
      id: "tech-exposure",
      tone: "warning",
      headline: `Your tech exposure increased by ${(tech.pct - 28).toFixed(1)}%`,
      detail: "Rebalancing 4% into emerging-market debt would preserve your risk-adjusted profile.",
    });
  }

  const dining = d.spending.find((s) => s.label.includes("Dining"));
  if (dining && dining.pct < 25) {
    insights.push({
      id: "dining-surplus",
      tone: "positive",
      headline: `Dining & Leisure down to ${dining.pct}% of spend`,
      detail: "Surplus has been auto-routed to your S&P 500 bucket — keep the pace.",
    });
  }

  const recurring = d.transactions.filter(
    (t) => t.category === "UTILITIES" || t.merchant.toLowerCase().includes("cloud")
  );
  if (recurring.length >= 1) {
    insights.push({
      id: "duplicate-subs",
      tone: "neutral",
      headline: "You can save $180 annually by removing duplicate subscriptions",
      detail: "Two overlapping SaaS charges detected this cycle — review and consolidate.",
    });
  }

  if (d.netWorthChangePct > 10) {
    insights.push({
      id: "net-worth-momentum",
      tone: "positive",
      headline: `Net worth up ${d.netWorthChangePct}% MoM`,
      detail: "Allocating 10% of the gain to your Roth IRA compounds to ~$18k over 10 years.",
    });
  }

  return insights;
}

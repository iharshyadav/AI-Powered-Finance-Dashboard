"use client";

import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { StrategyHero } from "@/components/dashboard/StrategyHero";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { DashboardSkeleton, DashboardErrorState, EmptyState } from "@/components/dashboard/States";
import { useFetch } from "@/hooks/useFetch";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { DashboardData } from "@/lib/mock-data";
import { httpGet } from "@/lib/api";
import { generateInsights } from "@/lib/insights";

const SpendingComposition = lazy(() =>
  import("@/components/dashboard/SpendingComposition").then((m) => ({ default: m.SpendingComposition })),
);
const TransactionsTable = lazy(() =>
  import("@/components/dashboard/TransactionsTable").then((m) => ({ default: m.TransactionsTable })),
);
const InsightsRail = lazy(() =>
  import("@/components/dashboard/InsightsRail").then((m) => ({ default: m.InsightsRail })),
);

export function DashboardClient() {
  const { data, error, loading, refetch } = useFetch<DashboardData>(
    () => httpGet<DashboardData>("/api/dashboard"),
    [],
  );
  const { track, trackPageView } = useAnalytics();
  const [search, setSearch] = useState("");

  useEffect(() => {
    trackPageView("/", "Dashboard");
  }, [trackPageView]);

  const insights = useMemo(() => (data ? generateInsights(data) : []), [data]);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar onSearch={setSearch} />
        <main className="flex-1 px-6 lg:px-10 py-8 pb-24 lg:pb-8 max-w-[1480px] w-full mx-auto" aria-label="Dashboard">
          <div className="mb-8">
            <p className="text-eyebrow mb-2">Wealth Intelligence</p>
            <h1 className="text-display text-2xl md:text-3xl font-semibold">
              Good evening, Alexander.
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              Your curated financial perspective, balancing algorithmic precision with long-term wealth preservation.
            </p>
          </div>

          {loading && <DashboardSkeleton />}
          {error && !loading && (
            <DashboardErrorState
              message={error.message || "We couldn't load your dashboard. Please try again."}
              onRetry={() => {
                track("dashboard_retry");
                refetch();
              }}
            />
          )}

          {data && !loading && !error && data.transactions.length === 0 && data.alerts.length === 0 && (
            <EmptyState
              title="Your dashboard is quiet"
              body="No transactions, alerts, or holdings yet. Connect an account to populate your view."
              actionLabel="Reload"
              onAction={refetch}
            />
          )}

          {data && !loading && !error && (data.transactions.length > 0 || data.alerts.length > 0) && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-5">
                <SummaryCard
                  eyebrow="Total Net Worth"
                  value={data.netWorth}
                  delta={`+${data.netWorthChangePct}% vs last month`}
                  deltaTone="positive"
                />
                <SummaryCard
                  eyebrow="Monthly Spending"
                  value={data.monthlySpending}
                  delta={`+${data.spendingChangePct}% higher than avg`}
                  deltaTone="negative"
                />
                <SummaryCard
                  eyebrow="Total Savings"
                  value={data.totalSavings}
                  badge={data.savingsOnTrack ? { tone: "positive", label: "On track for Q4 goal" } : undefined}
                />
              </div>

              <div className="col-span-12 lg:col-span-8">
                <StrategyHero
                  headline="Optimizing your portfolio for the upcoming Q3 market shift."
                  body="Our AI analyzed your current allocation and identified 3 key rebalancing opportunities to increase yield by 2.4%."
                />
              </div>
              <div className="col-span-12 lg:col-span-4">
                <AlertsList alerts={data.alerts} />
              </div>

              <div className="col-span-12">
                <Suspense fallback={<div className="card-surface h-40 shimmer" />}>
                  <InsightsRail insights={insights} />
                </Suspense>
              </div>

              <div className="col-span-12 lg:col-span-5">
                <Suspense fallback={<div className="card-surface h-80 shimmer" />}>
                  <SpendingComposition
                    slices={data.spending}
                    note='"Your discretionary spending on Dining & Leisure is down 12% this month. This surplus has been automatically moved to your S&P 500 bucket."'
                  />
                </Suspense>
              </div>
              <div className="col-span-12 lg:col-span-7">
                <Suspense fallback={<div className="card-surface h-80 shimmer" />}>
                  <TransactionsTable transactions={data.transactions} search={search} />
                </Suspense>
              </div>
            </div>
          )}

          <footer className="mt-12 pt-6 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>© 2024 Proton Finance. Data encrypted with AES-256.</span>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Security Audit</a>
              <a href="#" className="hover:text-foreground transition-colors">API Docs</a>
            </div>
          </footer>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

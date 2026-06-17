"use client";

import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Sparkles, PiggyBank, Receipt, Zap, ArrowRight } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { DashboardSkeleton, DashboardErrorState, EmptyState } from "@/components/dashboard/States";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useFetch } from "@/hooks/useFetch";
import { formatUsd } from "@/lib/format";
import { httpGet } from "@/lib/api";
import type { InsightsData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PerformanceChart = lazy(() => import("@/components/insights/PerformanceChart"));

const ranges = ["1M", "3M", "1Y", "ALL"] as const;
type Range = (typeof ranges)[number];
const rangeDays: Record<Range, number> = { "1M": 30, "3M": 90, "1Y": 365, ALL: Infinity };

const sectorColors = ["bg-primary", "bg-warning", "bg-foreground/60", "bg-muted-foreground/40"];

export function InsightsClient() {
  const { trackPageView, track } = useAnalytics();
  const [range, setRange] = useState<Range>("3M");
  const { data, error, loading, refetch } = useFetch<InsightsData>(
    () => httpGet<InsightsData>("/api/insights"),
    [],
  );

  useEffect(() => trackPageView("/insights", "Insights"), [trackPageView]);

  const slice = useMemo(() => {
    if (!data?.series?.length) return [] as InsightsData["series"];
    const n = rangeDays[range];
    return n === Infinity ? data.series : data.series.slice(-n);
  }, [data, range]);

  const sliceStats = useMemo(() => {
    if (slice.length < 2) return { current: data?.portfolioValue ?? 0, changePct: 0 };
    const first = slice[0].value;
    const current = slice[slice.length - 1].value;
    return { current, changePct: ((current - first) / first) * 100 };
  }, [slice, data]);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <main className="flex-1 px-6 lg:px-10 py-8 pb-24 lg:pb-8 max-w-[1480px] w-full mx-auto" aria-label="Portfolio Insights">
          <div className="mb-8">
            <p className="text-eyebrow mb-2 text-primary-glow">Wealth Intelligence</p>
            <h1 className="text-display text-3xl md:text-4xl font-semibold tracking-tight">Portfolio Insights</h1>
            <p className="text-sm text-muted-foreground mt-3 max-w-2xl leading-relaxed">
              Your curated financial perspective, balancing algorithmic precision with long-term wealth preservation goals.
            </p>
          </div>

          {loading && <DashboardSkeleton />}
          {error && !loading && (
            <DashboardErrorState
              message={error.message}
              onRetry={() => {
                track("insights_retry");
                refetch();
              }}
            />
          )}
          {data && !loading && !error && data.series.length === 0 && (
            <EmptyState
              title="No portfolio data yet"
              body="Connect an account or wait for the next sync to see insights."
              actionLabel="Reload"
              onAction={refetch}
            />
          )}

          {data && !loading && !error && data.series.length > 0 && (
            <div className="grid grid-cols-12 gap-6">
              <section className="col-span-12 lg:col-span-8 card-surface p-7 relative overflow-hidden">
                <div className="flex items-center gap-2 text-eyebrow text-warning">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden />
                  ACTIVE SIGNAL: REBALANCE PRIORITY
                </div>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
                  <div>
                    <h2 className="text-display text-2xl md:text-3xl font-semibold leading-tight">
                      Your technology exposure has increased by 14.2% since last quarter.
                    </h2>
                    <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-xl">
                      Our algorithms suggest shifting 4% of gains into emerging market debt and high-yield real estate to maintain your risk-adjusted profile.
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                      <button
                        onClick={() => track("cta_click", { cta: "review_strategy" })}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                      >
                        Review Strategy
                      </button>
                      <button className="text-sm text-primary-glow hover:underline">Dismiss</button>
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col items-center gap-3 rounded-xl bg-surface-elevated p-5 w-44">
                    <Sparkles className="h-7 w-7 text-primary-glow" aria-hidden />
                    <p className="text-[10px] tracking-[0.18em] text-muted-foreground font-semibold">SIGNAL CONFIDENCE</p>
                    <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "92%" }} />
                    </div>
                    <p className="text-sm font-semibold text-primary-glow">92%</p>
                  </div>
                </div>
              </section>

              <aside className="col-span-12 lg:col-span-4 card-surface p-6">
                <p className="text-eyebrow mb-4">Market Sentiment</p>
                <div className="relative mx-auto w-44 h-24">
                  <svg viewBox="0 0 100 50" className="w-full h-full">
                    <path d="M5,50 A45,45 0 0 1 95,50" fill="none" stroke="var(--muted)" strokeWidth="8" />
                    <path
                      d={`M5,50 A45,45 0 0 1 ${5 + (data.sentimentScore / 100) * 90},${50 - Math.sin((data.sentimentScore / 100) * Math.PI) * 45}`}
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-x-0 bottom-0 text-center">
                    <p className="text-display text-xl font-bold">{data.sentimentLabel}</p>
                    <p className="text-[10px] tracking-[0.18em] text-muted-foreground">SCORE: {data.sentimentScore}/100</p>
                  </div>
                </div>
                <ul className="mt-6 flex flex-col gap-3 text-sm">
                  <li className="flex justify-between"><span className="text-muted-foreground">Global Equities</span><span className="text-success font-semibold">Bullish</span></li>
                  <li className="flex justify-between"><span className="text-muted-foreground">Fixed Income</span><span className="text-warning font-semibold">Neutral</span></li>
                  <li className="flex justify-between"><span className="text-muted-foreground">Volatility Index</span><span className="text-success font-semibold">Low</span></li>
                </ul>
              </aside>

              <section className="col-span-12 lg:col-span-8 card-surface p-7" aria-labelledby="perf-h">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p id="perf-h" className="text-eyebrow">Portfolio Performance</p>
                    <div className="mt-2 flex items-baseline gap-3">
                      <span className="text-display text-3xl md:text-4xl font-bold">{formatUsd(sliceStats.current, true)}</span>
                      <span className={cn("text-sm font-semibold", sliceStats.changePct >= 0 ? "text-success" : "text-destructive")}>
                        {sliceStats.changePct >= 0 ? "+" : ""}{sliceStats.changePct.toFixed(2)}%
                      </span>
                      <span className="text-[10px] tracking-[0.18em] text-muted-foreground font-semibold">
                        {slice.length} pts · {range}
                      </span>
                    </div>
                  </div>
                  <div className="inline-flex rounded-lg bg-surface-elevated p-1" role="tablist" aria-label="Time range">
                    {ranges.map((r) => (
                      <button
                        key={r}
                        role="tab"
                        aria-selected={range === r}
                        onClick={() => { setRange(r); track("range_change", { range: r }); }}
                        className={cn(
                          "px-3 py-1.5 text-xs font-semibold rounded-md transition",
                          range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-6 h-56 w-full">
                  <Suspense fallback={<div className="h-full w-full rounded-lg shimmer" />}>
                    <PerformanceChart data={slice} />
                  </Suspense>
                </div>
              </section>

              <aside className="col-span-12 lg:col-span-4 flex flex-col gap-5">
                <div className="card-surface p-6">
                  <p className="text-eyebrow mb-4">Sector Allocation</p>
                  <ul className="flex flex-col gap-3 text-sm">
                    {data.sectors.map((s, i) => (
                      <li key={s.name} className="flex items-center justify-between">
                        <span className="flex items-center gap-2.5">
                          <span className={cn("h-2.5 w-2.5 rounded-full", sectorColors[i % sectorColors.length])} aria-hidden />
                          <span className="text-muted-foreground">{s.name}</span>
                        </span>
                        <span className="font-semibold">{s.pct}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-primary p-5 text-primary-foreground">
                    <p className="text-[10px] tracking-[0.18em] opacity-80 font-semibold">TOP PERFORMER</p>
                    <p className="text-display text-xl font-bold mt-2">{data.topPerformer.symbol}</p>
                    <p className="text-xs opacity-90 mt-1">+{data.topPerformer.changePct}%</p>
                  </div>
                  <div className="card-surface p-5">
                    <p className="text-eyebrow">Risk Level</p>
                    <p className="text-display text-xl font-bold mt-2">{data.riskLevel}</p>
                    <p className="text-xs text-muted-foreground mt-1">Balanced</p>
                  </div>
                </div>
              </aside>

              <section className="col-span-12 card-surface p-7" aria-labelledby="cash-h">
                <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
                  <div>
                    <p id="cash-h" className="text-eyebrow text-primary-glow">Cash Flow Intelligence</p>
                    <p className="text-sm text-muted-foreground mt-1">Automated suggestions based on your spending patterns.</p>
                  </div>
                  <button className="inline-flex items-center gap-1.5 text-sm text-primary-glow font-medium hover:underline">
                    View Monthly Report <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { icon: PiggyBank, title: "Surplus Opportunity", body: "You spent 12% less on dining this month. Transfer $450 to your 'Growth' bucket to stay ahead of your 2024 goal." },
                    { icon: Receipt, title: "Recurring Audit", body: "We detected two overlapping streaming subscriptions. Canceling 'Media+' would save you $180 annually." },
                    { icon: Zap, title: "Tax-Loss Harvesting", body: "3 assets in your legacy portfolio are eligible for tax-loss harvesting. Potential benefit: $2,100." },
                  ].map((c) => (
                    <article key={c.title} className="rounded-xl bg-surface-elevated p-5">
                      <div className="h-10 w-10 rounded-lg bg-primary/15 text-primary-glow grid place-items-center">
                        <c.icon className="h-5 w-5" aria-hidden />
                      </div>
                      <h3 className="mt-4 font-semibold">{c.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { Home, ShoppingCart, Film, Sparkles, Plus, Lightbulb, AlertTriangle } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { DashboardSkeleton, DashboardErrorState, EmptyState } from "@/components/dashboard/States";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useFetch } from "@/hooks/useFetch";
import { formatUsd } from "@/lib/format";
import { httpGet } from "@/lib/api";
import type { BudgetsData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Tone = "info" | "success" | "danger" | "warning";

const toneBar: Record<Tone, string> = {
  info: "bg-info",
  success: "bg-success",
  danger: "bg-destructive",
  warning: "bg-warning",
};
const toneBadge: Record<Tone, string> = {
  info: "bg-info/15 text-info",
  success: "bg-success/15 text-success",
  danger: "bg-destructive/15 text-destructive",
  warning: "bg-warning/15 text-warning",
};

const iconMap = { home: Home, cart: ShoppingCart, film: Film, spark: Sparkles } as const;

export function BudgetsClient() {
  const { trackPageView, track } = useAnalytics();
  const { data, error, loading, refetch } = useFetch<BudgetsData>(
    () => httpGet<BudgetsData>("/api/budgets"),
    [],
  );
  useEffect(() => trackPageView("/budgets", "Budgets"), [trackPageView]);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <main className="flex-1 px-6 lg:px-10 py-8 pb-24 lg:pb-8 max-w-[1480px] w-full mx-auto" aria-label="Budgets">
          {loading && <DashboardSkeleton />}
          {error && !loading && (
            <DashboardErrorState
              message={error.message}
              onRetry={() => { track("budgets_retry"); refetch(); }}
            />
          )}
          {data && !loading && !error && data.categories.length === 0 && (
            <EmptyState
              title="No budgets configured"
              body="Set monthly limits per category to start tracking velocity and surplus."
              actionLabel="Create budget"
              onAction={() => track("cta_click", { cta: "create_budget" })}
            />
          )}

          {data && !loading && !error && data.categories.length > 0 && (() => {
            const pct = Math.round((data.totalSpent / data.totalLimit) * 100);
            return (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8 flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-display text-3xl md:text-4xl font-semibold tracking-tight">Monthly Overview</h1>
                    <p className="text-sm text-muted-foreground mt-2">Fiscal Period: {data.period}</p>
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-4 flex lg:justify-end">
                  <button
                    onClick={() => track("cta_click", { cta: "adjust_limits" })}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                  >
                    <Plus className="h-4 w-4" aria-hidden /> Adjust Limits
                  </button>
                </div>

                <section className="col-span-12 lg:col-span-8 card-surface p-7">
                  <p className="text-eyebrow text-primary-glow">Total Budget Velocity</p>
                  <div className="mt-3 flex items-baseline gap-3 flex-wrap">
                    <span className="text-display text-4xl md:text-5xl font-bold">{formatUsd(data.totalSpent)}</span>
                    <span className="text-muted-foreground text-lg">/ {formatUsd(data.totalLimit)}</span>
                  </div>
                  <div className="mt-6 h-2 rounded-full bg-surface-elevated overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{pct}% of monthly limit reached</span>
                    <span className="text-primary-glow font-medium">{data.daysRemaining} days remaining</span>
                  </div>
                </section>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                  <div className="card-surface p-5 border-l-4 border-l-primary">
                    <p className="text-eyebrow">Projected Surplus</p>
                    <p className="mt-2 text-display text-3xl font-bold">+{formatUsd(data.projectedSurplus)}</p>
                  </div>
                  <div className="card-surface p-5 border-l-4 border-l-warning">
                    <p className="text-eyebrow">Savings Efficiency</p>
                    <p className="mt-2 text-display text-3xl font-bold">{data.savingsEfficiency}%</p>
                  </div>
                </div>

                <section className="col-span-12 lg:col-span-8" aria-labelledby="cats-h">
                  <div className="flex items-end justify-between mb-4">
                    <h2 id="cats-h" className="text-display text-xl font-semibold">Category Allocation</h2>
                    <button onClick={() => track("cta_click", { cta: "view_all_categories" })} className="text-sm text-primary-glow hover:underline">
                      View All Categories
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {data.categories.map((c) => {
                      const p = Math.min(100, Math.round((c.spent / c.limit) * 100));
                      const Icon = iconMap[c.icon];
                      return (
                        <article key={c.id} className="card-surface p-5">
                          <div className="flex items-start justify-between">
                            <div className={cn("h-10 w-10 rounded-lg grid place-items-center", toneBadge[c.tone])}>
                              <Icon className="h-5 w-5" aria-hidden />
                            </div>
                            <span className={cn("text-[10px] tracking-[0.18em] font-semibold px-2 py-1 rounded", toneBadge[c.tone])}>
                              {c.status}
                            </span>
                          </div>
                          <h3 className="mt-5 font-semibold text-base">{c.label}</h3>
                          <div className="mt-1 flex items-end justify-between text-sm">
                            <span className="text-muted-foreground">
                              {c.spent === c.limit ? formatUsd(c.spent) : `${formatUsd(c.spent)} / ${formatUsd(c.limit)}`}
                            </span>
                            <span className="font-semibold">{p}%</span>
                          </div>
                          <div className="mt-3 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                            <div className={cn("h-full rounded-full", toneBar[c.tone])} style={{ width: `${p}%` }} />
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>

                <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                  <div className="rounded-2xl p-6 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground" style={{ boxShadow: "var(--shadow-elegant)" }}>
                    <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] font-semibold opacity-90">
                      <Lightbulb className="h-3.5 w-3.5" aria-hidden /> BUDGET STRATEGY
                    </div>
                    <p className="mt-4 text-xl font-semibold leading-snug">
                      Optimize your spending to save <span className="bg-white/15 rounded px-1.5">{formatUsd(200)}</span> next month.
                    </p>
                    <p className="mt-3 text-sm opacity-90 leading-relaxed">
                      Based on your spending patterns at &apos;Gourmet Mart&apos;, switching to bulk purchases could reduce your grocery overhead by 14%.
                    </p>
                    <button
                      onClick={() => track("cta_click", { cta: "apply_strategy" })}
                      className="mt-5 w-full rounded-lg bg-white text-primary text-sm font-semibold py-2.5 hover:bg-white/90 transition"
                    >
                      Apply Strategy
                    </button>
                  </div>

                  <div className="card-surface p-5">
                    <div className="flex items-center gap-2 text-eyebrow mb-4 text-warning">
                      <AlertTriangle className="h-3.5 w-3.5" aria-hidden /> RECENT ALERTS
                    </div>
                    <ul className="flex flex-col gap-4">
                      {data.alerts.map((a, i) => (
                        <li key={i} className={cn("border-l-2 pl-3", a.tone === "danger" ? "border-destructive" : a.tone === "warning" ? "border-warning" : "border-info")}>
                          <p className="text-sm font-semibold">{a.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{a.body}</p>
                          <p className={cn("text-[10px] tracking-[0.18em] font-semibold mt-2", a.tone === "danger" ? "text-destructive" : a.tone === "warning" ? "text-warning" : "text-info")}>
                            {a.time}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            );
          })()}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

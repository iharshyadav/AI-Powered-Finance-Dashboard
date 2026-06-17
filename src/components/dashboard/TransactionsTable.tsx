"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import { ShoppingBag, Utensils, Zap, Banknote, Plane, Apple } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Transaction } from "@/lib/mock-data";
import { formatSignedUsd, formatTxDate } from "@/lib/format";
import { useAnalytics } from "@/hooks/useAnalytics";
import { cn } from "@/lib/utils";

const iconByCategory: Record<Transaction["category"], typeof ShoppingBag> = {
  TECHNOLOGY: ShoppingBag,
  LIFESTYLE: Utensils,
  UTILITIES: Zap,
  INCOME: Banknote,
  TRAVEL: Plane,
  FOOD: Apple,
};

const chipByCategory: Record<Transaction["category"], string> = {
  TECHNOLOGY: "bg-primary/15 text-primary",
  LIFESTYLE: "bg-warning/15 text-warning",
  UTILITIES: "bg-info/15 text-info",
  INCOME: "bg-success/15 text-success",
  TRAVEL: "bg-accent text-foreground/80",
  FOOD: "bg-warning/15 text-warning",
};

type Props = { transactions: Transaction[]; search?: string };

const ROW_HEIGHT = 64;
const VIRTUALIZE_THRESHOLD = 30;

export function TransactionsTable({ transactions, search = "" }: Props) {
  const [filter, setFilter] = useState<"ALL" | Transaction["status"]>("ALL");
  const { track } = useAnalytics();
  const parentRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions.filter((t) => {
      const statusOk = filter === "ALL" || t.status === filter;
      const searchOk =
        !q || t.merchant.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      return statusOk && searchOk;
    });
  }, [transactions, filter, search]);

  const virtualize = rows.length > VIRTUALIZE_THRESHOLD;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
    enabled: virtualize,
  });

  const exportCsv = useCallback(() => {
    track("export_csv", { count: rows.length });
    const header = "Merchant,Date,Category,Status,Amount\n";
    const body = rows
      .map((r) => `"${r.merchant}",${r.date},${r.category},${r.status},${r.amount}`)
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [rows, track]);

  const renderRow = (t: Transaction) => {
    const Icon = iconByCategory[t.category];
    const positive = t.amount > 0;
    return (
      <div
        role="row"
        key={t.id}
        className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-4 px-1 group"
        style={{ height: ROW_HEIGHT }}
      >
        <div role="cell" className="flex items-center gap-3 min-w-0">
          <span className="h-9 w-9 rounded-lg bg-accent/60 grid place-items-center text-muted-foreground group-hover:text-foreground transition shrink-0">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <div className="font-semibold text-foreground truncate">{t.merchant}</div>
            <div className="text-xs text-muted-foreground">{formatTxDate(t.date)}</div>
          </div>
        </div>
        <div role="cell">
          <span
            className={cn(
              "inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider",
              chipByCategory[t.category],
            )}
          >
            {t.category}
          </span>
        </div>
        <div role="cell">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider",
              t.status === "CLEARED" ? "text-success" : "text-info",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                t.status === "CLEARED" ? "bg-success" : "bg-info",
              )}
              aria-hidden
            />
            {t.status}
          </span>
        </div>
        <div
          role="cell"
          className={cn(
            "text-right font-semibold tabular-nums",
            positive ? "text-success" : "text-foreground",
          )}
        >
          {formatSignedUsd(t.amount)}
        </div>
      </div>
    );
  };

  return (
    <section aria-labelledby="recent-heading" className="card-surface p-6 flex flex-col gap-5">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <h2 id="recent-heading" className="text-base font-semibold">
          Recent Activity
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="px-3 py-1.5 rounded-md bg-accent/60 text-xs font-semibold hover:bg-accent transition"
          >
            Export CSV
          </button>
          <select
            aria-label="Filter transactions by status"
            value={filter}
            onChange={(e) => {
              const v = e.target.value as typeof filter;
              setFilter(v);
              track("filter_click", { filter: v });
            }}
            className="px-3 py-1.5 rounded-md bg-accent/60 text-xs font-semibold hover:bg-accent transition cursor-pointer outline-hidden"
          >
            <option value="ALL">Filter</option>
            <option value="CLEARED">Cleared</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </header>

      <div role="table" aria-label="Recent transactions" className="flex flex-col">
        <div
          role="row"
          className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 px-1 pr-4 pb-2 text-[10px] tracking-[0.16em] text-muted-foreground border-b border-border-subtle"
        >
          <div role="columnheader" className="text-left font-semibold">MERCHANT</div>
          <div role="columnheader" className="text-left font-semibold">CATEGORY</div>
          <div role="columnheader" className="text-left font-semibold">STATUS</div>
          <div role="columnheader" className="text-right font-semibold">AMOUNT</div>
        </div>

        {rows.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">
            No transactions match this filter.
          </p>
        )}

        {!virtualize && rows.length > 0 && (
          <div className="divide-y divide-border-subtle/60">{rows.map(renderRow)}</div>
        )}

        {virtualize && (
          <div
            ref={parentRef}
            className="overflow-y-auto pr-3"
            style={{ height: Math.min(rows.length, 10) * ROW_HEIGHT }}
          >
            <div style={{ height: virtualizer.getTotalSize(), position: "relative", width: "100%" }}>
              {virtualizer.getVirtualItems().map((vi) => {
                const t = rows[vi.index];
                return (
                  <div
                    key={vi.key}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      transform: `translateY(${vi.start}px)`,
                    }}
                  >
                    {renderRow(t)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

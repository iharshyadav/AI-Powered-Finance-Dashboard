import { memo } from "react";
import type { SpendingSlice } from "@/lib/mock-data";

const toneToColor: Record<SpendingSlice["tone"], string> = {
  info: "oklch(0.78 0.13 245)",
  warning: "oklch(0.78 0.14 65)",
  success: "oklch(0.72 0.18 155)",
  neutral: "oklch(0.6 0.04 250)",
};

type Props = {
  slices: SpendingSlice[];
  note: string;
};

export const SpendingComposition = memo(function SpendingComposition({ slices, note }: Props) {
  return (
    <section aria-labelledby="spending-heading" className="card-surface p-6 flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h2 id="spending-heading" className="text-base font-semibold">
          Spending Composition
        </h2>
        <button className="text-xs font-semibold text-primary hover:underline">View All</button>
      </header>

      <ul className="flex flex-col gap-5">
        {slices.map((s) => (
          <li key={s.label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/90">{s.label}</span>
              <span className="text-muted-foreground font-medium tabular-nums">{s.pct}%</span>
            </div>
            <div
              className="h-1.5 w-full rounded-full bg-accent/60 overflow-hidden"
              role="progressbar"
              aria-valuenow={s.pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={s.label}
            >
              <div
                className="h-full rounded-full transition-[width] duration-700"
                style={{ width: `${s.pct}%`, background: toneToColor[s.tone] }}
              />
            </div>
          </li>
        ))}
      </ul>

      <aside className="rounded-lg border border-border-subtle bg-surface-elevated/60 p-4">
        <div className="text-eyebrow mb-2">Editor&apos;s note</div>
        <p className="text-xs italic text-muted-foreground leading-relaxed">{note}</p>
      </aside>
    </section>
  );
});

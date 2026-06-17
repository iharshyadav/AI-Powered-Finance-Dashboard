"use client";

import { Sparkles } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

type Props = {
  headline: string;
  body: string;
};

export function StrategyHero({ headline, body }: Props) {
  const { track } = useAnalytics();
  return (
    <section
      aria-labelledby="strategy-headline"
      className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-primary-foreground animate-fade-up"
      style={{ background: "var(--gradient-strategy)", boxShadow: "var(--shadow-strategy)" }}
    >
      <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-primary-glow/40 blur-3xl" />
      </div>

      <div className="relative flex flex-col gap-6 max-w-2xl">
        <span className="self-start inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em]">
          <Sparkles className="h-3 w-3" aria-hidden /> PRO STRATEGY INSIGHT
        </span>

        <h2 id="strategy-headline" className="text-display text-2xl md:text-[1.95rem] font-bold leading-tight">
          {headline}
        </h2>

        <p className="text-sm md:text-base text-white/85 leading-relaxed max-w-xl">{body}</p>

        <div className="flex flex-wrap items-center gap-3 mt-2">
          <button
            onClick={() => track("execute_strategy_click", { surface: "hero" })}
            className="px-5 py-3 rounded-lg bg-white text-primary text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition"
          >
            Execute Strategy
          </button>
          <button
            onClick={() => track("review_audit_click", { surface: "hero" })}
            className="px-5 py-3 rounded-lg bg-white/12 text-white text-sm font-semibold hover:bg-white/20 transition border border-white/15"
          >
            Review Audit
          </button>
        </div>
      </div>
    </section>
  );
}

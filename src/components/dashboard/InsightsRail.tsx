import { memo } from "react";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import type { GeneratedInsight } from "@/lib/insights";
import { cn } from "@/lib/utils";

const toneStyles = {
  positive: { chip: "bg-success/15 text-success", Icon: TrendingUp },
  warning: { chip: "bg-warning/15 text-warning", Icon: AlertTriangle },
  neutral: { chip: "bg-primary/15 text-primary", Icon: Lightbulb },
} as const;

export const InsightsRail = memo(function InsightsRail({ insights }: { insights: GeneratedInsight[] }) {
  if (insights.length === 0) return null;
  return (
    <section aria-labelledby="ai-insights-heading" className="card-surface p-6 flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <h2 id="ai-insights-heading" className="text-base font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden />
          AI Curator Insights
        </h2>
        <span className="text-eyebrow">Signal Confidence 92%</span>
      </header>

      <ul className="grid sm:grid-cols-2 gap-3">
        {insights.map((i) => {
          const { chip, Icon } = toneStyles[i.tone];
          return (
            <li
              key={i.id}
              className="rounded-xl border border-border-subtle bg-surface-elevated/60 p-4 flex gap-3 items-start"
            >
              <span className={cn("h-9 w-9 rounded-lg grid place-items-center shrink-0", chip)}>
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-snug">{i.headline}</div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{i.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
});

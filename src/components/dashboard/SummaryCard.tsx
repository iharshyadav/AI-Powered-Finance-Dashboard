import { memo } from "react";
import { TrendingUp, TrendingDown, CheckCircle2 } from "lucide-react";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

type Tone = "positive" | "negative" | "neutral";

type Props = {
  eyebrow: string;
  value: number;
  delta?: string;
  deltaTone?: Tone;
  badge?: { tone: Tone; label: string };
};

export const SummaryCard = memo(function SummaryCard({ eyebrow, value, delta, deltaTone = "positive", badge }: Props) {
  return (
    <article className="card-surface p-6 flex flex-col gap-5 min-h-[170px] animate-fade-up">
      <div className="text-eyebrow">{eyebrow}</div>
      <div className="text-display text-[2.5rem] md:text-[2.75rem] font-semibold">
        {formatUsd(value)}
      </div>
      {delta && (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-semibold",
            deltaTone === "positive" && "text-success",
            deltaTone === "negative" && "text-destructive",
            deltaTone === "neutral" && "text-muted-foreground",
          )}
        >
          {deltaTone === "positive" ? (
            <TrendingUp className="h-3.5 w-3.5" aria-hidden />
          ) : deltaTone === "negative" ? (
            <TrendingDown className="h-3.5 w-3.5" aria-hidden />
          ) : null}
          <span>{delta}</span>
        </div>
      )}
      {badge && (
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
          {badge.label}
        </div>
      )}
    </article>
  );
});

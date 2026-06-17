import { memo } from "react";
import { AlertTriangle, PiggyBank, TrendingUp } from "lucide-react";
import type { Alert } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const tones = {
  danger: {
    bar: "bg-destructive",
    chip: "bg-destructive/15 text-destructive",
    Icon: AlertTriangle,
  },
  warning: {
    bar: "bg-warning",
    chip: "bg-warning/15 text-warning",
    Icon: PiggyBank,
  },
  info: {
    bar: "bg-info",
    chip: "bg-info/15 text-info",
    Icon: TrendingUp,
  },
} as const;

export const AlertsList = memo(function AlertsList({ alerts }: { alerts: Alert[] }) {
  return (
    <section aria-labelledby="alerts-heading" className="flex flex-col gap-4">
      <h2 id="alerts-heading" className="text-base font-semibold">
        Active Alerts
      </h2>
      <ul className="flex flex-col gap-3">
        {alerts.map((a) => {
          const { bar, chip, Icon } = tones[a.type];
          return (
            <li
              key={a.id}
              className="card-surface relative p-4 pl-5 flex gap-3 items-start animate-fade-up"
            >
              <span aria-hidden className={cn("absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full", bar)} />
              <span className={cn("h-9 w-9 rounded-lg grid place-items-center shrink-0", chip)}>
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold">{a.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{a.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
});

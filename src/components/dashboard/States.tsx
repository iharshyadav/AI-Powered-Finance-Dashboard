export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-fade-up" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card-surface h-[170px] p-6">
            <div className="h-3 w-24 rounded shimmer" />
            <div className="mt-6 h-10 w-40 rounded shimmer" />
            <div className="mt-5 h-3 w-28 rounded shimmer" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        <div className="card-surface h-[340px] shimmer rounded-2xl" />
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card-surface h-[96px] shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="card-surface p-10 text-center flex flex-col items-center gap-4">
      <div className="text-eyebrow text-destructive">Failed to load</div>
      <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
      >
        Retry
      </button>
    </div>
  );
}

export function EmptyState({
  title = "Nothing here yet",
  body = "Once data flows in, you'll see it surface here.",
  actionLabel,
  onAction,
}: {
  title?: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="card-surface p-10 text-center flex flex-col items-center gap-4">
      <div className="text-eyebrow text-muted-foreground">No data</div>
      <h3 className="text-display text-xl font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{body}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-md bg-accent/60 text-sm font-semibold hover:bg-accent transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

"use client";

import { Bell, Moon, Search, Settings, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useTheme } from "@/hooks/useTheme";

const tabs = ["Portfolio", "Analysis", "Market"] as const;

type TopBarProps = {
  onSearch?: (value: string) => void;
};

export function TopBar({ onSearch }: TopBarProps) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<(typeof tabs)[number]>("Portfolio");
  const debounced = useDebounce(query, 350);
  const { track } = useAnalytics();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    if (debounced.length >= 2) track("search", { query: debounced });
    onSearch?.(debounced);
  }, [debounced, track, onSearch]);

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-background/85 border-b border-border-subtle">
      <div className="flex items-center gap-6 px-6 lg:px-10 py-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden />
          <label htmlFor="global-search" className="sr-only">
            Search portfolio or markets
          </label>
          <input
            id="global-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search portfolio or markets..."
            className="w-full h-11 rounded-lg bg-surface border border-border-subtle pl-11 pr-4 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/60 focus:border-transparent transition"
          />
        </div>

        <nav className="hidden md:flex items-center gap-6" aria-label="View modes">
          {tabs.map((t) => {
            const active = t === tab;
            return (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  track("tab_click", { tab: t });
                }}
                className={
                  "relative text-sm font-medium transition-colors " +
                  (active ? "text-primary" : "text-muted-foreground hover:text-foreground")
                }
                aria-current={active ? "page" : undefined}
              >
                {t}
                {active && (
                  <span className="absolute -bottom-2 left-0 right-0 h-[2px] rounded-full bg-primary" aria-hidden />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => {
              toggle();
              track("theme_toggle", { to: theme === "dark" ? "light" : "dark" });
            }}
            className="h-10 w-10 grid place-items-center rounded-lg hover:bg-accent/50 text-muted-foreground hover:text-foreground transition"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun className="h-4.5 w-4.5" aria-hidden /> : <Moon className="h-4.5 w-4.5" aria-hidden />}
          </button>
          <button
            className="h-10 w-10 grid place-items-center rounded-lg hover:bg-accent/50 text-muted-foreground hover:text-foreground transition relative"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" aria-hidden />
            <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-destructive" aria-hidden />
          </button>
          <button className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition px-2">
            <Settings className="h-4 w-4" aria-hidden /> Settings
          </button>
          <div
            className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-500 grid place-items-center text-xs font-semibold text-amber-900"
            aria-label="Account avatar"
          >
            AS
          </div>
        </div>
      </div>
    </header>
  );
}

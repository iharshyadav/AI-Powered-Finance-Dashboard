"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Receipt, PiggyBank, BarChart3, HelpCircle, LogOut, Sparkles, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/hooks/useAnalytics";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: BarChart3, label: "Insights", to: "/insights" },
  { icon: PiggyBank, label: "Budgets", to: "/budgets" },
  { icon: Palette, label: "Design System", to: "/design" },
] as const;

export function Sidebar() {
  const { track } = useAnalytics();
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border-subtle bg-sidebar px-5 py-7 sticky top-0 h-screen overflow-y-auto"
      aria-label="Primary"
    >
      <Link href="/" className="flex items-center gap-3 mb-12" aria-label="Proton Finance — Home">
        <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">
          <Building2 className="h-5 w-5" aria-hidden />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display text-base font-semibold tracking-tight">Proton Finance</span>
          <span className="text-[10px] tracking-[0.18em] text-muted-foreground mt-1">WEALTH CURATOR</span>
        </div>
      </Link>

      <nav className="flex flex-col gap-1" aria-label="Sections">
        {items.map(({ icon: Icon, label, to }) => {
          const active = pathname === to;
          return (
            <Link
              key={label}
              href={to}
              onClick={() => track("nav_click", { section: label })}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors text-left",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40",
              )}
            >
              <Icon className="h-4.5 w-4.5" aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <div className="rounded-xl bg-primary p-5 text-primary-foreground">
          <div className="text-[10px] tracking-[0.18em] opacity-80 font-semibold">PRO ACCESS</div>
          <div className="mt-2 text-sm font-medium leading-snug">Unlock AI Strategy Insights</div>
          <button
            onClick={() => track("cta_click", { cta: "upgrade_premium" })}
            className="mt-4 w-full rounded-md bg-white text-primary text-xs font-semibold py-2.5 hover:bg-white/90 transition flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> Upgrade to Premium
          </button>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <button className="flex items-center gap-3 px-3.5 py-2 text-muted-foreground hover:text-foreground transition-colors text-left">
            <HelpCircle className="h-4 w-4" aria-hidden /> Help Center
          </button>
          <button className="flex items-center gap-3 px-3.5 py-2 text-muted-foreground hover:text-foreground transition-colors text-left">
            <LogOut className="h-4 w-4" aria-hidden /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

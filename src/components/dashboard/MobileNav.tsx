"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, PiggyBank, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/hooks/useAnalytics";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: BarChart3, label: "Insights", to: "/insights" },
  { icon: PiggyBank, label: "Budgets", to: "/budgets" },
  { icon: Palette, label: "Design", to: "/design" },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const { track } = useAnalytics();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex border-t border-border-subtle bg-sidebar/95 backdrop-blur-md"
      aria-label="Primary"
    >
      {items.map(({ icon: Icon, label, to }) => {
        const active = pathname === to;
        return (
          <Link
            key={label}
            href={to}
            onClick={() => track("nav_click", { section: label, surface: "mobile" })}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium tracking-wide transition-colors",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

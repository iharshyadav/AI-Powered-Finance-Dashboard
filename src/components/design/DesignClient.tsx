"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { useAnalytics } from "@/hooks/useAnalytics";
import { cn } from "@/lib/utils";

function Section({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <div>
        <p className="text-eyebrow text-primary-glow">{index}</p>
        <h2 className="text-display text-xl font-semibold mt-1">{title}</h2>
      </div>
      {children}
    </section>
  );
}

const colorTokens = [
  { name: "Primary", var: "--primary" },
  { name: "Primary Glow", var: "--primary-glow" },
  { name: "Success", var: "--success" },
  { name: "Warning", var: "--warning" },
  { name: "Destructive", var: "--destructive" },
  { name: "Info", var: "--info" },
  { name: "Surface", var: "--surface" },
  { name: "Surface Elevated", var: "--surface-elevated" },
  { name: "Accent", var: "--accent" },
  { name: "Border", var: "--border" },
  { name: "Muted", var: "--muted" },
  { name: "Background", var: "--background" },
];

const typeScale = [
  { label: "Display · 2.75rem", cls: "text-display text-[2.75rem] font-bold", sample: "$1,248,392" },
  { label: "Headline · 1.5rem", cls: "text-display text-2xl font-semibold", sample: "Monthly Cash Flow" },
  { label: "Title · 1.125rem", cls: "text-lg font-semibold", sample: "Portfolio Growth Analysis" },
  { label: "Body · 0.875rem", cls: "text-sm text-muted-foreground", sample: "Legibility and intentional asymmetry for a premium experience." },
  { label: "Eyebrow · 0.6875rem", cls: "text-eyebrow", sample: "Transaction Pending" },
];

const badges: { label: string; cls: string }[] = [
  { label: "CLEARED", cls: "bg-success/15 text-success" },
  { label: "PENDING", cls: "bg-info/15 text-info" },
  { label: "CRITICAL", cls: "bg-destructive/15 text-destructive" },
  { label: "OPTIMAL", cls: "bg-warning/15 text-warning" },
  { label: "FIXED", cls: "bg-primary/15 text-primary" },
];

export function DesignClient() {
  const { trackPageView } = useAnalytics();
  useEffect(() => trackPageView("/design", "Design System"), [trackPageView]);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <main className="flex-1 px-6 lg:px-10 py-8 pb-24 lg:pb-8 max-w-[1100px] w-full mx-auto" aria-label="Design System">
          <div className="mb-10">
            <p className="text-eyebrow text-primary-glow">Premium Management</p>
            <h1 className="text-display text-3xl md:text-4xl font-semibold tracking-tight mt-1">
              Proton Finance Design System
            </h1>
            <p className="text-sm text-muted-foreground mt-3 max-w-2xl leading-relaxed">
              A curated editorial framework for premium wealth management. Defined by tonal depth,
              intentional asymmetry, and financial clarity.
            </p>
          </div>

          <div className="flex flex-col gap-12">
            <Section index="01 Typography Scale" title="Editorial Hierarchy">
              <div className="card-surface p-7 flex flex-col gap-6">
                {typeScale.map((t) => (
                  <div key={t.label}>
                    <p className="text-eyebrow mb-1.5">{t.label}</p>
                    <p className={t.cls}>{t.sample}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section index="02 Color System" title="Atmospheric Palette">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {colorTokens.map((c) => (
                  <div key={c.name} className="card-surface p-3">
                    <div
                      className="h-16 rounded-lg border border-border-subtle"
                      style={{ background: `var(${c.var})` }}
                    />
                    <p className="text-sm font-medium mt-2.5">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{c.var}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section index="03 Controls" title="Interactive Elements">
              <div className="card-surface p-7 flex flex-col gap-7">
                <div>
                  <p className="text-eyebrow mb-3">Button Variations</p>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition">
                      Primary Action
                    </button>
                    <button className="px-5 py-2.5 rounded-lg bg-accent/60 text-foreground text-sm font-semibold hover:bg-accent transition">
                      Secondary
                    </button>
                    <button className="px-5 py-2.5 rounded-lg text-primary text-sm font-semibold hover:bg-accent/40 transition">
                      Ghost Button
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-eyebrow mb-3">Status Badges</p>
                  <div className="flex flex-wrap gap-2">
                    {badges.map((b) => (
                      <span
                        key={b.label}
                        className={cn("inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider", b.cls)}
                      >
                        {b.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-eyebrow mb-3">Progress</p>
                  <div className="flex flex-col gap-3 max-w-sm">
                    {[
                      { pct: 42, c: "bg-primary" },
                      { pct: 71, c: "bg-success" },
                      { pct: 90, c: "bg-destructive" },
                    ].map((p) => (
                      <div key={p.pct} className="h-1.5 rounded-full bg-accent/60 overflow-hidden">
                        <div className={cn("h-full rounded-full", p.c)} style={{ width: `${p.pct}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            <Section index="04 Layout & Containers" title="The Bento Surface Logic">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="card-surface p-6">
                  <p className="text-eyebrow">Surface</p>
                  <p className="text-sm text-muted-foreground mt-2">Base card surface with subtle gradient and inset highlight.</p>
                </div>
                <div className="rounded-xl bg-surface-elevated border border-border-subtle p-6">
                  <p className="text-eyebrow">Surface Elevated</p>
                  <p className="text-sm text-muted-foreground mt-2">Raised tone for nested rows and panels.</p>
                </div>
                <div
                  className="rounded-xl p-6 text-primary-foreground"
                  style={{ background: "var(--gradient-strategy)", boxShadow: "var(--shadow-strategy)" }}
                >
                  <p className="text-[10px] tracking-[0.18em] font-semibold opacity-90">HIGHLIGHT</p>
                  <p className="text-sm text-white/90 mt-2">Gradient surface for AI strategy and primary CTAs.</p>
                </div>
              </div>
            </Section>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

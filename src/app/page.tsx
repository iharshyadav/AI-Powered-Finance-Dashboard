import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: { absolute: "Proton Finance — Wealth Curator Dashboard" },
  description:
    "Your net worth, monthly spending, savings, AI strategy and recent activity at a glance.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}

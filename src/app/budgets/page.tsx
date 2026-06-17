import type { Metadata } from "next";
import { BudgetsClient } from "@/components/budgets/BudgetsClient";

export const metadata: Metadata = {
  title: "Budgets",
  description:
    "Monthly budget overview: spending velocity, category allocation, budget history and smart savings strategies.",
};

export default function BudgetsPage() {
  return <BudgetsClient />;
}

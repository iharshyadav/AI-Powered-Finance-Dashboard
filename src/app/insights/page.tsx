import type { Metadata } from "next";
import { InsightsClient } from "@/components/insights/InsightsClient";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "AI-driven portfolio insights: sector exposure shifts, market sentiment, performance trends and personalized savings opportunities.",
};

export default function InsightsPage() {
  return <InsightsClient />;
}

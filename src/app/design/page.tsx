import type { Metadata } from "next";
import { DesignClient } from "@/components/design/DesignClient";

export const metadata: Metadata = {
  title: "Design System",
  description:
    "The Proton Finance design system: typography scale, atmospheric color palette, controls and surface tokens.",
};

export default function DesignPage() {
  return <DesignClient />;
}

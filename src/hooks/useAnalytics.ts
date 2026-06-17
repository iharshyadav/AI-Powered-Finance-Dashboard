"use client";

import { useCallback } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export function useAnalytics() {
  const track = useCallback((event: string, params: Record<string, unknown> = {}) => {
    if (typeof window === "undefined") return;
    if (window.gtag && GA_MEASUREMENT_ID) {
      window.gtag("event", event, params);
    } else if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", event, params);
    }
  }, []);

  const trackPageView = useCallback((path: string, title?: string) => {
    if (typeof window === "undefined") return;
    if (window.gtag && GA_MEASUREMENT_ID) {
      window.gtag("event", "page_view", { page_path: path, page_title: title });
    } else if (process.env.NODE_ENV === "development") {
      console.debug("[analytics] page_view", { path, title });
    }
  }, []);

  return { track, trackPageView };
}

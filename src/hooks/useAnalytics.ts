"use client";

import { useCallback, useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

let initialized = false;
function ensureGa() {
  if (initialized || typeof window === "undefined" || !GA_MEASUREMENT_ID) return;
  initialized = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

export function useAnalytics() {
  useEffect(() => {
    ensureGa();
  }, []);

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

import { useEffect } from "react";
import { useLocation } from "react-router";

export const GA_MEASUREMENT_ID = "G-ZDRNYK3QQR";

// Inline script to initialize Google Analytics (follows themeScript pattern)
export const gaScript = `
  (function() {
    // Check Do Not Track
    const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    if (dnt === '1' || dnt === 'yes') {
      console.log('[GA4] Analytics disabled: Do Not Track is enabled');
      return;
    }

    // Check environment (replaced by Vite at build time)
    if ('${process.env.NODE_ENV}' !== 'production') {
      console.log('[GA4] Analytics disabled: Not in production mode');
      return;
    }

    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());

    // Flag for hook to check - hook will handle all pageview tracking
    window.__GA_INITIALIZED__ = true;
  })();
`;

// Hook to track route changes in SPA
export function useGoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Only track if GA was initialized (DNT off + production)
    if (!window.__GA_INITIALIZED__ || typeof window.gtag !== "function") {
      return;
    }

    // Send pageview on route change (including initial load and all navigation)
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search + location.hash,
    });
  }, [location]);
}

// TypeScript declarations
declare global {
  interface Window {
    dataLayer: GtagDataLayer;
    gtag: GtagFunction;
    __GA_INITIALIZED__?: boolean;
  }
}

// Google Analytics types
type GtagDataLayer = Record<string, unknown>[];

type GtagFunction = {
  (command: "config", targetId: string, config?: GtagConfigParams): void;
  (command: "event", eventName: string, eventParams?: GtagEventParams): void;
  (command: "js", date: Date): void;
  (command: string, ...args: unknown[]): void;
};

type GtagConfigParams = {
  page_path?: string;
  page_title?: string;
  page_location?: string;
  send_page_view?: boolean;
  [key: string]: unknown;
};

type GtagEventParams = {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
};

export {};

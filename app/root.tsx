import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { LinksFunction } from "react-router";

import { themeScript } from "~/hooks/useTheme";
import {
  gaScript,
  GA_MEASUREMENT_ID,
  useGoogleAnalytics,
} from "~/hooks/useGoogleAnalytics";
import globalStyles from "~/styles/global.css?url";
import highlightStyles from "~/styles/highlight.css?url";
import { Toaster } from "~/components/ui/toaster";

export const links: LinksFunction = () => [
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap",
  },
  { rel: "stylesheet", href: globalStyles },
  { rel: "stylesheet", href: highlightStyles },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          defer
          data-domain="magarcia.io"
          src="https://plausible.io/js/plausible.js"
          crossOrigin="anonymous"
        />
        {/* Google Analytics (GA4) */}
        {process.env.NODE_ENV === "production" && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
        )}
        <script dangerouslySetInnerHTML={{ __html: gaScript }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className="text-[#1A1A1A] transition-colors duration-300 ease-in-out bg-white dark:bg-gray-900 dark:text-gray-200 motion-reduce:transition-none"
        suppressHydrationWarning
      >
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  useGoogleAnalytics();
  return <Outlet />;
}

export function HydrateFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Loading...</div>
    </div>
  );
}

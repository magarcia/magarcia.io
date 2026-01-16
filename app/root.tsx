import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteError, useLocation } from "react-router";
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
import Header from "~/components/Header";

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
    rel: "preconnect",
    href: "https://s2.svgbox.net",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "https://s2.svgbox.net/pen-brushes.svg?ic=brush-1&color=rgba(255,225,0,0.7)",
    as: "image",
    type: "image/svg+xml",
  },
  {
    rel: "preload",
    href: "https://s2.svgbox.net/pen-brushes.svg?ic=brush-1&color=rgba(168,85,247,0.7)",
    as: "image",
    type: "image/svg+xml",
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
        className="text-foreground transition-colors duration-300 ease-in-out bg-background motion-reduce:transition-none"
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

export function ErrorBoundary() {
  const error = useRouteError();
  const location = useLocation();

  // Detect language from URL
  const pathname = location.pathname;
  const lang = pathname.startsWith("/es/") || pathname === "/es"
    ? "es"
    : pathname.startsWith("/ca/") || pathname === "/ca"
    ? "ca"
    : "en";

  let title = "Oops!";
  let message = "Something went wrong.";
  let statusCode = 500;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;

    if (error.status === 404) {
      title = "Page Not Found";
      message = "Sorry, the page you're looking for doesn't exist.";
    } else if (error.status === 500) {
      title = "Server Error";
      message = "Something went wrong on our end.";
    } else {
      title = `${error.status} - ${error.statusText}`;
      message = error.data || "An error occurred.";
    }
  } else if (error instanceof Error) {
    // React Router throws "No result found for routeId" errors when a loader
    // throws a 404 Response in static mode - treat these as 404s
    if (error.message.includes("No result found for routeId")) {
      statusCode = 404;
      title = "Page Not Found";
      message = "Sorry, the page you're looking for doesn't exist.";
    } else {
      message = error.message;
    }
  }

  return (
    <>
      <Header lang={lang} />
      <main className="max-w-[75ch] mx-auto px-8 md:px-16 mb-12 md:mb-24">
        <div className="text-center py-20">
          <h1 className="font-heading text-6xl md:text-8xl text-foreground mb-4">
            {statusCode}
          </h1>
          <h2 className="text-2xl md:text-3xl font-normal text-foreground mb-6">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {message}
          </p>
        </div>
      </main>
    </>
  );
}

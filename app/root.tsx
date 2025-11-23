import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  Link,
} from "react-router";
import type { LinksFunction } from "react-router";

import { themeScript } from "~/hooks/useTheme";
import globalStyles from "~/styles/global.css?url";
import highlightStyles from "~/styles/highlight.css?url";

export const links: LinksFunction = () => [
  {
    rel: "preload",
    href: "https://rsms.me/inter/font-files/Inter-roman.var.woff2?v=3.19",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
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
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className="text-gray-700 transition-colors duration-300 ease-in-out bg-white dark:bg-gray-800 dark:text-gray-200 motion-reduce:transition-none"
        suppressHydrationWarning
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
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

  let title = "Something went wrong";
  let message = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page not found";
      message = "The page you're looking for doesn't exist.";
    } else {
      title = `${error.status} ${error.statusText}`;
      message = error.data || "An error occurred.";
    }
  } else if (error instanceof Error) {
    // Handle client-side routing errors for non-existent pages
    if (error.message.includes("No result found for routeId")) {
      title = "Page not found";
      message = "The page you're looking for doesn't exist.";
    } else {
      message = error.message;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-50 mb-4">
        {title}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{message}</p>
      <Link
        to="/"
        className="px-6 py-3 bg-yellow-300 dark:bg-purple-500 text-gray-900 dark:text-gray-50 font-semibold rounded hover:opacity-80 transition-opacity"
      >
        Go back home
      </Link>
    </div>
  );
}

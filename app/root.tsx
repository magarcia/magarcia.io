import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
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
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@1,400&display=swap",
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

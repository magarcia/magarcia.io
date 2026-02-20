---
name: rr7-best-practices
description: |
  React Router 7 framework best practices and code review guidelines.
  Auto-applied when working on React Router 7 projects. Covers route modules,
  data loading, actions, type safety, error handling, rendering strategies,
  navigation, and performance patterns. Use when writing, reviewing, or
  debugging React Router 7 framework mode code.
allowed-tools:
  - Read
  - Edit
  - Write
  - Grep
  - Glob
  - WebFetch
---

# React Router 7 Best Practices

Comprehensive guide for writing and reviewing React Router 7 framework mode
code. Rules ordered by impact.

## Priority

| Priority | Category                | Rules | Impact                             |
| -------- | ----------------------- | ----- | ---------------------------------- |
| P0       | Route Module Structure  | 8     | Correct routing and code splitting |
| P1       | Data Loading            | 7     | Performance and data correctness   |
| P2       | Actions & Mutations     | 6     | Data integrity and UX              |
| P3       | Type Safety             | 5     | Developer experience and safety    |
| P4       | Error Handling          | 5     | Resilience and user experience     |
| P5       | Navigation & Links      | 5     | Accessibility and UX               |
| P6       | Rendering Strategies    | 5     | Performance and SEO                |
| P7       | Performance & Patterns  | 6     | Bundle size and runtime perf       |

For expanded rules with code examples, see
[references/rules.md](references/rules.md).

---

## P0: Route Module Structure

1. **Define routes in `app/routes.ts`** — use `route()`, `index()`, `layout()`,
   `prefix()` from `@react-router/dev/routes`. Avoid scattering route config.
2. **One concern per route module** — each file exports loader, action, default
   component, ErrorBoundary as needed. Do not define multiple page components in
   one file.
3. **Use layout routes for shared UI** — wrap related routes with
   `layout("./layout.tsx", [...])` instead of duplicating wrapper markup.
4. **Use `prefix()` for URL namespacing** — group routes under a path segment
   without creating a parent layout component.
5. **Root route is `app/root.tsx`** — it wraps everything. Include `<Outlet />`,
   `<Meta />`, `<Links />`, `<Scripts />`, `<ScrollRestoration />`.
6. **Use file-system routes only with `@react-router/fs-routes`** — framework
   mode uses `routes.ts` by default, not folder conventions.
7. **Export `handle` for cross-route data** — use the `handle` export with
   `useMatches()` for breadcrumbs, navigation metadata, and similar patterns.
8. **Keep component routes minimal** — in-tree `<Routes>/<Route>` have no
   loader/action support, no code splitting. Use only for simple wizard-like UIs.

## P1: Data Loading

1. **Use `loader` for server data** — runs on server, stripped from client
   bundle. Safe for DB queries, secrets, internal APIs.
2. **Use `clientLoader` for browser-only data** — for localStorage,
   IndexedDB, browser APIs. Provide `HydrateFallback` when using
   `clientLoader.hydrate = true`.
3. **Access data via `loaderData` prop** — use `Route.ComponentProps` type, not
   `useLoaderData()` hook (props are fully typed via typegen).
4. **Avoid waterfalls** — parallel loaders run automatically for nested routes.
   Do not fetch in components; keep data fetching in loaders.
5. **Return serializable data** — loaders support strings, numbers, dates, maps,
   sets, promises. Do not return class instances or functions.
6. **Combine server + client loaders** — `clientLoader` can call
   `serverLoader()` to augment server data with client-specific data.
7. **Use `shouldRevalidate` sparingly** — opt out of automatic revalidation only
   when you have measured a performance need. Default revalidation keeps data
   fresh.

## P2: Actions & Mutations

1. **Use `action` for server mutations** — runs on server, stripped from client
   bundle. Handles `POST`, `PUT`, `PATCH`, `DELETE`.
2. **Use `<Form method="post">` for mutations** — React Router's `<Form>`
   provides progressive enhancement and automatic revalidation.
3. **Use `useFetcher` for non-navigating mutations** — when you need to mutate
   data without changing the URL (e.g., inline edits, toggles, likes).
4. **Validate in actions, not components** — validate `formData` inside the
   action, return validation errors via `actionData`.
5. **Redirect after successful mutations** — use `redirect()` from actions to
   prevent double-submission on refresh.
6. **Use `clientAction` for optimistic UI** — intercept server actions on the
   client for instant feedback, then reconcile with server response.

## P3: Type Safety

1. **Import types from `./+types/`** — use `import type { Route } from
   "./+types/my-route"` for fully typed loader args, action args, and component
   props.
2. **Use `satisfies RouteConfig`** — annotate your `routes.ts` default export
   with `satisfies RouteConfig` for config-level type checking.
3. **Run `react-router typegen`** — in CI or `--watch` mode during development.
   The dev server runs it automatically.
4. **Type params are auto-inferred** — `Route.LoaderArgs["params"]` knows the
   exact param names from your route path. Do not manually type params.
5. **Use `Route.ComponentProps`** — for the default component export. Gives you
   typed `loaderData`, `actionData`, `params`, `matches`.

## P4: Error Handling

1. **Export `ErrorBoundary` in root** — must handle three cases:
   `isRouteErrorResponse()` for thrown `data()`, `Error` instances, and unknown
   values.
2. **Throw `data()` for intentional errors** — use `throw data("Not Found",
   { status: 404 })` for controlled error flows. Do not throw raw strings.
3. **Nest error boundaries strategically** — the closest ErrorBoundary catches
   errors. Place them at route boundaries where recovery makes sense.
4. **Errors in loaders/actions are caught** — thrown errors bubble to the
   nearest ErrorBoundary automatically. Do not wrap loader calls in try/catch
   unless you need to transform the error.
5. **Server errors are sanitized in production** — error messages and stack
   traces are stripped before reaching the browser. Use `data()` for intentional
   error messages.

## P5: Navigation & Links

1. **Use `<NavLink>` for navigation with active states** — provides `isActive`,
   `isPending`, `isTransitioning` via className/style/children callbacks.
2. **Use `<Link>` for simple navigation** — when you do not need active state
   styling.
3. **Use `redirect()` in loaders/actions** — for server-side redirects (auth
   guards, post-mutation navigation).
4. **Reserve `useNavigate()` for non-user-triggered navigation** — timeouts,
   inactivity, state-based redirects. Prefer `<Link>` or `<Form>` for user
   actions.
5. **Use `<Link reloadDocument>` for resource routes** — when linking to PDFs,
   downloads, or API endpoints that should not be handled by client routing.

## P6: Rendering Strategies

1. **Understand the three modes** — SSR (`ssr: true`, default), SPA (`ssr:
   false`), and pre-rendered (static). Choose based on your deployment target.
2. **Use `prerender` in config for static content** — set `prerender: true`,
   array of paths, or async function in `react-router.config.ts`.
3. **With `ssr: false`, no `headers` or `action` exports** — these require a
   runtime server. Use `clientLoader` and `clientAction` instead.
4. **Combine pre-rendering with SPA fallback** — set `ssr: false` with specific
   prerender paths. Non-prerendered paths use `__spa-fallback.html`.
5. **Pre-rendered routes use same `loader` API** — no special API needed. The
   build creates `Request` objects and runs loaders at build time.

## P7: Performance & Patterns

1. **Resource routes for API endpoints** — export `loader`/`action` without a
   default component. Return `new Response()` with appropriate headers.
2. **Use `useFetcher` for concurrent operations** — multiple fetchers run
   independently with their own state. Use for lists of actionable items.
3. **Implement optimistic UI with `fetcher.formData`** — read pending form data
   to show immediate feedback before the server responds.
4. **Use `useNavigation()` for global pending states** — show loading indicators
   during page transitions.
5. **Leverage automatic code splitting** — each route module is a separate
   chunk. Do not manually `lazy()` route components in framework mode.
6. **Use middleware for cross-cutting concerns** — authentication, logging,
   timing. Runs sequentially before loaders/actions.

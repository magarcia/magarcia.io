---
name: react-router-7
description: |
  React Router 7 framework mode patterns and best practices. Auto-applied when
  working on React Router 7 projects. Covers route configuration, data loading,
  actions, mutations, fetchers, type safety, error handling, pre-rendering,
  static generation, SPA mode, middleware, deployment adapters, testing with
  Vitest and Playwright, and migration from Remix v2 or React Router v6.
user-invocable: false
metadata:
  version: "1.0.0"
allowed-tools:
  - Read
  - Edit
  - Write
  - Grep
  - Glob
  - Bash
  - WebFetch
---

# React Router 7

Framework mode patterns for React Router 7 (successor to Remix v2). All shared
APIs import from `react-router`. Runtime-specific APIs import from
`@react-router/node`, `@react-router/cloudflare`, etc.

## Reference Index

| Reference | Topics |
| --------- | ------ |
| [best-practices.md](references/best-practices.md) | Key rules, common mistakes, priority-ordered guidelines |
| [routing.md](references/routing.md) | Route configuration, dynamic segments, layouts, middleware |
| [data-loading.md](references/data-loading.md) | Loaders, actions, fetchers, forms, optimistic UI, revalidation |
| [advanced-patterns.md](references/advanced-patterns.md) | Streaming, cookies/sessions, single fetch, progressive enhancement |
| [prerendering.md](references/prerendering.md) | Static generation, SPA mode, rendering strategies |
| [deployment.md](references/deployment.md) | Express, Cloudflare, Docker, Netlify, full config reference |
| [testing.md](references/testing.md) | Vitest setup, createRoutesStub, Playwright E2E |
| [upgrade.md](references/upgrade.md) | Migration from Remix v2, React Router v6 |

## Best Practices (Always Apply)

See [best-practices.md](references/best-practices.md) for full rules with code
examples. Summary of critical rules:

- Import from `react-router`, not `react-router-dom` (deprecated in v7)
- Define routes in `app/routes.ts` using `route()`, `index()`, `layout()`,
  `prefix()`
- Use typegen types (`Route.LoaderArgs`, `Route.ComponentProps`) — never
  hand-write route param types
- Return plain objects from loaders/actions — `json()` is deprecated
- Use `data()` only when you need custom status codes or headers
- Fetch data in loaders, not in `useEffect` — loaders run in parallel for
  nested routes
- Redirect after mutations to prevent double-submit on refresh
- Every route with a loader should have an `ErrorBoundary`
- Use `<Link>` and `<NavLink>` for internal navigation, never `<a>`

## Routing

See [routing.md](references/routing.md) for:

- Route configuration with `routes.ts` helpers
- Dynamic segments (`$param`), optional segments (`$param?`), splat routes (`*`)
- Layout routes vs prefix-only grouping vs nested routes
- File-system route conventions with `@react-router/fs-routes`
- Complete route module exports table
- Middleware patterns (auth, logging, security headers)

## Data Loading & Mutations

See [data-loading.md](references/data-loading.md) for:

- Server loaders, client loaders, and combined patterns
- Server actions with form validation and error handling
- Three ways to call actions (`<Form>`, `useSubmit`, `useFetcher`)
- Optimistic UI with fetchers
- Pending UI with `useNavigation`
- Resource routes (JSON APIs, RSS feeds, file downloads)
- Revalidation control with `shouldRevalidate`

See [advanced-patterns.md](references/advanced-patterns.md) for:

- Streaming with Suspense (replacing `defer()` with raw promises)
- Cookie session storage and authentication flows
- Single-fetch revalidation rules
- Progressive enhancement with `<Form>`

## Pre-rendering & Static Sites

See [prerendering.md](references/prerendering.md) for:

- Rendering modes: SSR, SSR+prerender, static prerender, SPA
- `prerender` configuration (boolean, array, async function)
- Build output structure (`.html` and `.data` files)
- SPA fallback for Cloudflare Pages and Netlify
- Constraints when using `ssr: false`

See [deployment.md](references/deployment.md) for:

- Official adapters (Express, Cloudflare, Architect, Node.js)
- Static hosting deployment (Cloudflare Pages, Netlify)
- Docker multi-stage builds
- Full `react-router.config.ts` options reference

## Testing

See [testing.md](references/testing.md) for:

- Vitest setup (React Router Vite plugin is incompatible with Vitest)
- Unit testing loaders/actions as plain functions
- Component testing with `createRoutesStub`
- Mocking server modules and React Router hooks
- Playwright E2E setup and patterns
- Known issues and workarounds

## Upgrading & Migration

See [upgrade.md](references/upgrade.md) for:

- Migration from Remix v2 (package renames, config changes, typegen)
- Migration from React Router v6 data mode
- Migration from React Router v6 classic mode
- Breaking changes checklist

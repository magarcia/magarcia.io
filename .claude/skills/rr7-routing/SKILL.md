---
name: rr7-routing
description: |
  React Router 7 routing patterns and route configuration. Use when setting up
  routes, configuring file-based routing, working with dynamic segments, nested
  routes, layout routes, or route prefixes. Triggers on: "add a route",
  "create a page", "routing", "nested routes", "layout route", "dynamic route",
  "catch-all", "splat route", "routes.ts".
allowed-tools:
  - Read
  - Edit
  - Write
  - Grep
  - Glob
---

# React Router 7 Routing

Guide for configuring routes in React Router 7 framework mode. For middleware
patterns (auth, logging, security headers), see
[references/middleware.md](references/middleware.md).

## Route Configuration

Routes are defined in `app/routes.ts` using four helpers:

```ts
import type { RouteConfig } from "@react-router/dev/routes";
import { route, index, layout, prefix } from "@react-router/dev/routes";

export default [
  // Index route — renders at "/"
  index("./home.tsx"),

  // Static route — renders at "/about"
  route("about", "./about.tsx"),

  // Dynamic segment — renders at "/users/:id"
  route("users/:id", "./users/profile.tsx"),

  // Optional segment — ":lang?" matches with or without
  route(":lang?/categories", "./categories.tsx"),

  // Splat / catch-all — matches /files/any/path/here
  route("files/*", "./files.tsx"),

  // Layout route — shared UI, no URL segment added
  layout("./dashboard/layout.tsx", [
    index("./dashboard/home.tsx"),
    route("settings", "./dashboard/settings.tsx"),
  ]),

  // Prefix — adds URL segment, no layout component
  ...prefix("api", [
    route("users", "./api/users.ts"),
    route("posts", "./api/posts.ts"),
  ]),

  // Nested routes — children render inside parent's <Outlet />
  route("teams/:teamId", "./teams/team.tsx", [
    index("./teams/overview.tsx"),
    route("members", "./teams/members.tsx"),
    route("settings", "./teams/settings.tsx"),
  ]),

  // 404 catch-all (must be last)
  route("*", "./not-found.tsx"),
] satisfies RouteConfig;
```

## File-System Routes (Optional)

Use `@react-router/fs-routes` for convention-based routing:

```ts
import { flatRoutes } from "@react-router/fs-routes";

export default [
  ...(await flatRoutes()),
] satisfies RouteConfig;
```

You can mix both approaches:

```ts
export default [
  index("./home.tsx"),
  route("custom", "./custom.tsx"),
  ...(await flatRoutes({ rootDirectory: "app/routes" })),
] satisfies RouteConfig;
```

## Route Module Exports

Every route file can export these:

| Export              | Purpose                              | Server | Client |
| ------------------- | ------------------------------------ | ------ | ------ |
| `default`           | Component to render                  | -      | Yes    |
| `loader`            | Server data loading                  | Yes    | No     |
| `clientLoader`      | Client data loading                  | No     | Yes    |
| `action`            | Server mutation handling             | Yes    | No     |
| `clientAction`      | Client mutation handling             | No     | Yes    |
| `ErrorBoundary`     | Error UI for this route              | -      | Yes    |
| `HydrateFallback`   | Loading UI during client hydration   | -      | Yes    |
| `meta`              | `<title>` and `<meta>` tags          | -      | Yes    |
| `links`             | `<link>` tags (stylesheets, icons)   | -      | Yes    |
| `headers`           | HTTP response headers                | Yes    | No     |
| `handle`            | Arbitrary data for `useMatches()`    | -      | Yes    |
| `shouldRevalidate`  | Control loader revalidation          | -      | Yes    |
| `middleware`         | Server middleware chain              | Yes    | No     |
| `clientMiddleware`   | Client middleware chain              | No     | Yes    |

## Nested Routes and Outlet

Parent routes render children via `<Outlet />`:

```tsx
// teams/team.tsx (parent)
import { Outlet } from "react-router";

export default function Team({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>{loaderData.name}</h1>
      <nav>
        <Link to="">Overview</Link>
        <Link to="members">Members</Link>
      </nav>
      <Outlet /> {/* child route renders here */}
    </div>
  );
}
```

## Dynamic Segments

Access params in loaders, actions, and components:

```ts
// route("teams/:teamId/members/:memberId", "./member.tsx")
export async function loader({ params }: Route.LoaderArgs) {
  // params.teamId and params.memberId are typed strings
  return getMember(params.teamId, params.memberId);
}
```

Splat routes capture the remaining path:

```ts
// route("docs/*", "./docs.tsx")
export async function loader({ params }: Route.LoaderArgs) {
  const path = params["*"]; // "getting-started/installation"
  return getDoc(path);
}
```

## Layout vs Prefix vs Nested

| Pattern   | Adds URL segment? | Has component? | Children render inside? |
| --------- | ----------------- | -------------- | ----------------------- |
| `route()` | Yes               | Yes            | Yes (`<Outlet />`)      |
| `layout()`| No                | Yes            | Yes (`<Outlet />`)      |
| `prefix()`| Yes               | No             | No (flat)               |

## Key Files

| File                     | Purpose                     |
| ------------------------ | --------------------------- |
| `app/routes.ts`          | Route configuration          |
| `app/root.tsx`           | Root layout (wraps all)      |
| `app/entry.client.tsx`   | Client entry point           |
| `app/entry.server.tsx`   | Server entry point           |
| `react-router.config.ts` | Framework configuration     |
| `.react-router/types/`   | Generated route types        |

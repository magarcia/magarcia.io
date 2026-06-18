# React Router 7 Routing

## Table of Contents

- [Route Configuration](#route-configuration)
- [File-System Routes](#file-system-routes)
- [Route Module Exports](#route-module-exports)
- [Nested Routes and Outlet](#nested-routes-and-outlet)
- [Dynamic Segments](#dynamic-segments)
- [Layout vs Prefix vs Nested](#layout-vs-prefix-vs-nested)
- [Middleware](#middleware)
- [Key Files](#key-files)

---

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

---

## File-System Routes

Use `@react-router/fs-routes` for convention-based routing:

```ts
import { flatRoutes } from "@react-router/fs-routes";

export default [
  ...(await flatRoutes()),
] satisfies RouteConfig;
```

Mix both approaches:

```ts
export default [
  index("./home.tsx"),
  route("custom", "./custom.tsx"),
  ...(await flatRoutes({ rootDirectory: "app/routes" })),
] satisfies RouteConfig;
```

---

## Route Module Exports

Every route file can export these:

| Export             | Purpose                            | Server | Client |
| ------------------ | ---------------------------------- | ------ | ------ |
| `default`          | Component to render                | -      | Yes    |
| `loader`           | Server data loading                | Yes    | No     |
| `clientLoader`     | Client data loading                | No     | Yes    |
| `action`           | Server mutation handling           | Yes    | No     |
| `clientAction`     | Client mutation handling           | No     | Yes    |
| `ErrorBoundary`    | Error UI for this route            | -      | Yes    |
| `HydrateFallback`  | Loading UI during client hydration | -      | Yes    |
| `meta`             | `<title>` and `<meta>` tags        | -      | Yes    |
| `links`            | `<link>` tags (stylesheets, icons) | -      | Yes    |
| `headers`          | HTTP response headers              | Yes    | No     |
| `handle`           | Arbitrary data for `useMatches()`  | -      | Yes    |
| `shouldRevalidate` | Control loader revalidation        | -      | Yes    |
| `middleware`        | Server middleware chain            | Yes    | No     |
| `clientMiddleware`  | Client middleware chain            | No     | Yes    |

---

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

---

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

---

## Layout vs Prefix vs Nested

| Pattern    | Adds URL segment? | Has component? | Children render inside? |
| ---------- | ----------------- | -------------- | ----------------------- |
| `route()`  | Yes               | Yes            | Yes (`<Outlet />`)      |
| `layout()` | No                | Yes            | Yes (`<Outlet />`)      |
| `prefix()` | Yes               | No             | No (flat)               |

---

## Middleware

Middleware is stable since React Router 7.9.0 via the `future.v8_middleware`
flag. It runs sequentially in a nested chain from parent to child routes.

### Enabling Middleware

```ts
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  future: {
    v8_middleware: true,
  },
} satisfies Config;
```

### Type-Safe Context

```ts
import { createContext } from "react-router";
import type { User } from "~/types";

export const userContext = createContext<User | null>(null);
```

### Authentication Middleware

```ts
import { redirect } from "react-router";
import { userContext } from "~/context";

async function authMiddleware({ request, context }, next) {
  const user = await getUserFromSession(request);
  if (!user) {
    throw redirect("/login");
  }
  context.set(userContext, user);
  return next();
}

export const middleware = [authMiddleware];

// Access in loader
export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  return { profile: await getProfile(user) };
}
```

### Logging with Timing

```ts
async function loggingMiddleware({ request, context }, next) {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] ${request.method} ${request.url}`);

  const start = performance.now();
  const response = await next();
  const duration = performance.now() - start;

  console.log(`[${requestId}] ${response.status} (${duration}ms)`);
  return response;
}
```

### Security Headers

```ts
async function securityMiddleware({ context }, next) {
  const response = await next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}
```

### Combining Middleware

```ts
export const middleware = [authMiddleware, loggingMiddleware, securityMiddleware];
```

Middleware runs in array order. Each calls `next()` to continue the chain. If
you don't call `next()`, it is called automatically after your function returns.

### Client Middleware

Runs during browser navigations. Does not return `Response` objects.

```ts
async function clientTimingMiddleware({ request }, next) {
  const start = performance.now();
  await next();
  console.log(`Navigation: ${performance.now() - start}ms`);
}

export const clientMiddleware = [clientTimingMiddleware];
```

### The `next()` Pattern

```ts
const middleware = async ({ context }, next) => {
  // Before handlers (auth, logging, setup)
  console.log("Before");

  const response = await next(); // runs loader/action

  // After handlers (timing, response modification)
  console.log("After");

  return response; // required on server, optional on client
};
```

---

## Key Files

| File                      | Purpose                 |
| ------------------------- | ----------------------- |
| `app/routes.ts`           | Route configuration     |
| `app/root.tsx`            | Root layout (wraps all) |
| `app/entry.client.tsx`    | Client entry point      |
| `app/entry.server.tsx`    | Server entry point      |
| `react-router.config.ts`  | Framework configuration |
| `.react-router/types/`    | Generated route types   |

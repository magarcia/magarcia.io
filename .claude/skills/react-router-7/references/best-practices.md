# React Router 7 Best Practices — Expanded Rules

## Table of Contents

- [P0: Route Module Structure](#p0-route-module-structure)
- [P1: Data Loading](#p1-data-loading)
- [P2: Actions & Mutations](#p2-actions--mutations)
- [P3: Type Safety](#p3-type-safety)
- [P4: Error Handling](#p4-error-handling)
- [P5: Navigation](#p5-navigation)
- [P6: Rendering Strategies](#p6-rendering-strategies)
- [P7: Performance](#p7-performance)
- [Common Mistakes](#common-mistakes)

## Priority

| Priority | Category               | Rules | Impact                             |
| -------- | ---------------------- | ----- | ---------------------------------- |
| P0       | Route Module Structure | 8     | Correct routing and code splitting |
| P1       | Data Loading           | 7     | Performance and data correctness   |
| P2       | Actions & Mutations    | 6     | Data integrity and UX              |
| P3       | Type Safety            | 5     | Developer experience and safety    |
| P4       | Error Handling         | 5     | Resilience and user experience     |
| P5       | Navigation & Links     | 5     | Accessibility and UX               |
| P6       | Rendering Strategies   | 5     | Performance and SEO                |
| P7       | Performance & Patterns | 6     | Bundle size and runtime perf       |

---

## P0: Route Module Structure

### P0.1: Define routes in `app/routes.ts`

```ts
import type { RouteConfig } from "@react-router/dev/routes";
import { route, index, layout, prefix } from "@react-router/dev/routes";

export default [
  index("./home.tsx"),
  route("about", "./about.tsx"),

  layout("./auth/layout.tsx", [
    route("login", "./auth/login.tsx"),
    route("register", "./auth/register.tsx"),
  ]),

  ...prefix("blog", [
    index("./blog/list.tsx"),
    route(":slug", "./blog/post.tsx"),
  ]),

  route("*", "./catchall.tsx"),
] satisfies RouteConfig;
```

### P0.2: One concern per route module

```ts
// app/routes/team.tsx
import type { Route } from "./+types/team";

export async function loader({ params }: Route.LoaderArgs) {
  return getTeam(params.teamId);
}

export default function Team({ loaderData }: Route.ComponentProps) {
  return <h1>{loaderData.name}</h1>;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <div>Team not found</div>;
}
```

### P0.3: Use layout routes for shared UI

```ts
// routes.ts — layout wraps children without adding URL segment
layout("./dashboard/layout.tsx", [
  index("./dashboard/home.tsx"),
  route("settings", "./dashboard/settings.tsx"),
  route("team", "./dashboard/team.tsx"),
])

// dashboard/layout.tsx
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <div className="dashboard">
      <nav>{/* sidebar */}</nav>
      <main><Outlet /></main>
    </div>
  );
}
```

### P0.5: Root route structure

```tsx
// app/root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

---

## P1: Data Loading

### P1.1: Server loader — safe for secrets

```ts
import type { Route } from "./+types/product";
import { db } from "../db.server"; // .server suffix = server-only

export async function loader({ params }: Route.LoaderArgs) {
  const product = await db.product.findUnique({
    where: { id: params.id },
  });
  if (!product) {
    throw data("Product not found", { status: 404 });
  }
  return product;
}
```

### P1.2: Client loader with hydration fallback

```tsx
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const cached = localStorage.getItem(`product-${params.id}`);
  if (cached) return JSON.parse(cached);
  const res = await fetch(`/api/products/${params.id}`);
  return res.json();
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <div className="skeleton">Loading...</div>;
}

export default function Product({ loaderData }: Route.ComponentProps) {
  return <h1>{loaderData.name}</h1>;
}
```

### P1.3: Access data via props (not hooks)

```tsx
// Preferred: typed via typegen
export default function Product({ loaderData }: Route.ComponentProps) {
  return <h1>{loaderData.name}</h1>;
}

// Avoid: untyped hook
export default function Product() {
  const data = useLoaderData(); // no type inference
  return <h1>{data.name}</h1>;
}
```

### P1.4: Avoid waterfalls

```ts
// Bad: sequential fetches
export async function loader() {
  const user = await getUser();           // 200ms
  const posts = await getPosts();         // 300ms
  const comments = await getComments();   // 200ms
  return { user, posts, comments };       // Total: 700ms
}

// Good: parallel fetches
export async function loader() {
  const [user, posts, comments] = await Promise.all([
    getUser(),       // 200ms
    getPosts(),      // 300ms
    getComments(),   // 200ms
  ]);
  return { user, posts, comments }; // Total: 300ms
}
```

### P1.6: Combine server + client loaders

```tsx
export async function loader({ params }: Route.LoaderArgs) {
  return db.product.findUnique({ where: { id: params.id } });
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();
  const clientPrefs = JSON.parse(localStorage.getItem("prefs") || "{}");
  return { ...serverData, ...clientPrefs };
}
```

---

## P2: Actions & Mutations

### P2.2: Form with progressive enhancement

```tsx
import { Form, redirect } from "react-router";
import type { Route } from "./+types/new-project";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");

  if (!title || typeof title !== "string") {
    return { error: "Title is required" };
  }

  const project = await db.project.create({ data: { title } });
  return redirect(`/projects/${project.id}`);
}

export default function NewProject({ actionData }: Route.ComponentProps) {
  return (
    <Form method="post">
      <label>
        Title
        <input name="title" required />
      </label>
      {actionData?.error && <p className="error">{actionData.error}</p>}
      <button type="submit">Create</button>
    </Form>
  );
}
```

### P2.3: Fetcher for inline mutations

```tsx
import { useFetcher } from "react-router";

function TaskItem({ task }) {
  const fetcher = useFetcher();
  const isCompleting = fetcher.state !== "idle";

  const optimisticDone =
    fetcher.formData?.get("done") === "true" || task.done;

  return (
    <li style={{ opacity: isCompleting ? 0.5 : 1 }}>
      <fetcher.Form method="post" action={`/tasks/${task.id}`}>
        <input type="hidden" name="done" value={String(!task.done)} />
        <button type="submit">
          {optimisticDone ? "done" : "pending"} {task.title}
        </button>
      </fetcher.Form>
    </li>
  );
}
```

### P2.5: Redirect after mutations

```ts
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const project = await createProject(formData);
  // Redirect prevents double-submission on browser refresh
  return redirect(`/projects/${project.id}`);
}
```

---

## P3: Type Safety

### P3.1: Import types from `./+types/`

```ts
// The +types directory is generated by react-router typegen
// Types include:
//   Route.LoaderArgs      — { params, request, context }
//   Route.ActionArgs      — { params, request, context }
//   Route.ClientLoaderArgs — { params, serverLoader }
//   Route.ClientActionArgs — { params, serverAction }
//   Route.ComponentProps   — { loaderData, actionData, params, matches }
//   Route.ErrorBoundaryProps — { error }
//   Route.MetaArgs         — { data, params, location, error, matches }
//   Route.HeadersArgs      — { loaderHeaders, parentHeaders, actionHeaders }

import type { Route } from "./+types/team.$teamId";

export async function loader({ params }: Route.LoaderArgs) {
  // params.teamId is typed as string
}
```

### P3.4: Params are auto-inferred

```ts
// Given route: route("teams/:teamId/members/:memberId", "./member.tsx")
import type { Route } from "./+types/member";

export async function loader({ params }: Route.LoaderArgs) {
  params.teamId;   // string — auto-inferred from route path
  params.memberId; // string — auto-inferred from route path
}
```

---

## P4: Error Handling

### P4.1: Root ErrorBoundary pattern

```tsx
import { isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/root";

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status} {error.statusText}</h1>
        <p>{error.data}</p>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div>
        <h1>Unexpected Error</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return <h1>Unknown Error</h1>;
}
```

### P4.2: Throw data() for intentional errors

```ts
import { data } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const team = await db.team.findUnique({ where: { id: params.teamId } });
  if (!team) {
    throw data("Team not found", { status: 404 });
  }
  return team;
}
```

---

## P5: Navigation

### P5.1: NavLink with active states

```tsx
import { NavLink } from "react-router";

<NavLink
  to="/dashboard"
  className={({ isActive, isPending }) =>
    [isPending ? "pending" : "", isActive ? "active" : ""].join(" ")
  }
>
  Dashboard
</NavLink>
```

### P5.3: Redirect in loaders for auth

```ts
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  if (!user) return redirect("/login");
  return { user };
}
```

---

## P6: Rendering Strategies

### P6.2: Pre-rendering configuration

```ts
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  // Static: pre-render all non-dynamic routes
  prerender: true,

  // Or specify exact paths
  prerender: ["/", "/about", "/blog"],

  // Or use async function for dynamic paths
  async prerender({ getStaticPaths }) {
    const slugs = await getPostSlugs();
    return [
      ...getStaticPaths(),
      ...slugs.map((s) => `/blog/${s}`),
    ];
  },
} satisfies Config;
```

### P6.4: SPA fallback with pre-rendering

```ts
// react-router.config.ts
export default {
  ssr: false,
  prerender: ["/", "/about", "/pricing"],
  // Non-prerendered paths fall back to __spa-fallback.html
} satisfies Config;
```

---

## P7: Performance

### P7.1: Resource routes for API endpoints

```ts
// app/routes/api.users.ts (no default component export)
import type { Route } from "./+types/api.users";

export async function loader({ request }: Route.LoaderArgs) {
  const users = await db.user.findMany();
  return Response.json(users, {
    headers: { "Cache-Control": "max-age=60" },
  });
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const body = await request.json();
  const user = await db.user.create({ data: body });
  return Response.json(user, { status: 201 });
}
```

### P7.6: Middleware for cross-cutting concerns

```ts
import { redirect } from "react-router";

async function authMiddleware({ request, context }, next) {
  const session = await getSession(request);
  if (!session.userId) throw redirect("/login");
  const user = await getUserById(session.userId);
  context.set(userContext, user);
  return next();
}

async function timingMiddleware({ request }, next) {
  const start = performance.now();
  const response = await next();
  const duration = performance.now() - start;
  response.headers.set("Server-Timing", `total;dur=${duration}`);
  return response;
}

export const middleware = [authMiddleware, timingMiddleware];
```

---

## Common Mistakes

### Do not import from `react-router-dom`

```ts
// Wrong — react-router-dom is v6 era
import { Link } from "react-router-dom";

// Correct — everything from "react-router"
import { Link } from "react-router";
```

### Do not use `json()` — it is deprecated

```ts
// Wrong — json() was Remix-era
return json({ name: "team" });

// Correct — return plain objects (auto-serialized)
return { name: "team" };

// Or for custom status/headers, use data()
import { data } from "react-router";
return data({ name: "team" }, { status: 200 });
```

### Do not fetch in useEffect for route data

```tsx
// Wrong — creates waterfall, no SSR, no type safety
export default function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(setProducts);
  }, []);
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}

// Correct — use loader
export async function loader() {
  return db.product.findMany();
}

export default function Products({ loaderData }: Route.ComponentProps) {
  return <ul>{loaderData.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

### Do not manually split route modules

```ts
// Wrong — framework already code-splits every route
const LazyDashboard = React.lazy(() => import("./dashboard"));

// Correct — just define routes normally
route("dashboard", "./dashboard.tsx")
// Each route is automatically a separate chunk
```

---
name: rr7-upgrade
description: |
  Upgrade and migrate projects to React Router 7. Use when migrating from
  Remix, React Router v6, or between React Router 7 minor versions. Triggers
  on: "upgrade to react router 7", "migrate from remix", "migrate from
  react router 6", "convert to framework mode", "upgrade react router".
allowed-tools:
  - Read
  - Edit
  - Write
  - Grep
  - Glob
  - Bash
  - WebFetch
---

# React Router 7 Upgrade & Migration

Step-by-step guide for migrating to React Router 7 framework mode.

## Migration Paths

| From                      | Difficulty | Key changes                        |
| ------------------------- | ---------- | ---------------------------------- |
| Remix v2                  | Low        | Package renames, config migration  |
| React Router v6 (data)    | Medium     | Add routes.ts, adopt route modules |
| React Router v6 (classic) | High       | Restructure to route modules       |
| Next.js / other           | High       | Full rewrite of routing layer      |

---

## From Remix v2

### Step 1: Update dependencies

```bash
npm remove @remix-run/react @remix-run/node @remix-run/dev @remix-run/serve
npm install react-router @react-router/node @react-router/dev
```

### Step 2: Rename imports

| Old (Remix)                                  | New (React Router 7)          |
| -------------------------------------------- | ----------------------------- |
| `@remix-run/react`                           | `react-router`                |
| `@remix-run/node`                            | `@react-router/node`         |
| `@remix-run/cloudflare`                      | `@react-router/cloudflare`   |
| `@remix-run/dev`                             | `@react-router/dev`          |
| `@remix-run/express`                         | `@react-router/express`      |
| `json()`                                     | Return plain objects          |
| `defer()`                                    | Return promises directly      |
| `MetaFunction`                               | `Route.MetaArgs` (typegen)    |
| `LoaderFunctionArgs`                         | `Route.LoaderArgs` (typegen)  |
| `ActionFunctionArgs`                         | `Route.ActionArgs` (typegen)  |
| `useLoaderData<typeof loader>()`             | `loaderData` prop             |

### Step 3: Rename config file

```bash
mv remix.config.js react-router.config.ts
```

Update the config format:

```ts
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  // appDirectory: "app", (default)
  // ssr: true, (default)
} satisfies Config;
```

### Step 4: Update Vite config

```ts
// vite.config.ts
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
});
```

### Step 5: Create routes.ts

If using Remix file conventions:

```ts
// app/routes.ts
import { flatRoutes } from "@react-router/fs-routes";
import type { RouteConfig } from "@react-router/dev/routes";

export default flatRoutes() satisfies RouteConfig;
```

Or migrate to explicit routes:

```ts
import { route, index, layout } from "@react-router/dev/routes";

export default [
  index("./routes/_index.tsx"),
  route("about", "./routes/about.tsx"),
  // ...
] satisfies RouteConfig;
```

### Step 6: Update route modules to use typegen

```ts
// Before (Remix)
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  return json({ name: await getTeam(params.id) });
}

export default function Team() {
  const data = useLoaderData<typeof loader>();
  return <h1>{data.name}</h1>;
}

// After (React Router 7)
import type { Route } from "./+types/team";

export async function loader({ params }: Route.LoaderArgs) {
  return { name: await getTeam(params.id) };
}

export default function Team({ loaderData }: Route.ComponentProps) {
  return <h1>{loaderData.name}</h1>;
}
```

### Step 7: Replace `json()` and `defer()`

```ts
// Before
import { json, defer } from "@remix-run/node";

export async function loader() {
  return json({ user: await getUser() });
  // or
  return defer({ user: getUser() }); // promise
}

// After — just return objects/promises directly
export async function loader() {
  return { user: await getUser() };
  // or return a promise for streaming
  return { user: getUser() }; // React serializes the promise
}

// For custom status/headers, use data()
import { data } from "react-router";
return data({ user }, { status: 200, headers: { "Cache-Control": "max-age=60" } });
```

---

## From React Router v6 (Data Mode)

### Step 1: Install framework packages

```bash
npm install @react-router/dev @react-router/node
```

### Step 2: Add Vite plugin

```ts
// vite.config.ts
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
});
```

### Step 3: Create react-router.config.ts

```ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: true, // or false for SPA
} satisfies Config;
```

### Step 4: Move route config to routes.ts

```ts
// Before: createBrowserRouter in main.tsx
const router = createBrowserRouter([
  { path: "/", element: <Home />, loader: homeLoader },
  { path: "/about", element: <About /> },
]);

// After: app/routes.ts
import { route, index } from "@react-router/dev/routes";

export default [
  index("./home.tsx"),
  route("about", "./about.tsx"),
] satisfies RouteConfig;
```

### Step 5: Convert to route modules

```tsx
// Before: separate loader + component wired in router config
export function homeLoader() { return fetch("/api/data"); }
export function Home() {
  const data = useLoaderData();
  return <div>{data.title}</div>;
}

// After: co-located in route module
import type { Route } from "./+types/home";

export async function loader() {
  return fetch("/api/data");
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <div>{loaderData.title}</div>;
}
```

---

## From React Router v6 (Classic/Declarative)

This is the biggest migration. Classic mode uses `<Routes>` and `<Route>`
without data APIs.

### Step 1: Identify all routes

Search for `<Route` and `<Routes>` in your codebase to catalog all routes.

### Step 2: Move data fetching from components to loaders

```tsx
// Before: useEffect data fetching
function Products() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(setData);
  }, []);
  if (!data) return <Loading />;
  return <ProductList products={data} />;
}

// After: loader
export async function loader() {
  const res = await fetch("/api/products");
  return res.json();
}

export default function Products({ loaderData }: Route.ComponentProps) {
  return <ProductList products={loaderData} />;
}
```

### Step 3: Convert form submissions to actions

```tsx
// Before: manual form handling
function CreatePost() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await fetch("/api/posts", { method: "POST", body: formData });
    navigate("/posts");
  };
  return <form onSubmit={handleSubmit}>...</form>;
}

// After: action + Form
import { Form, redirect } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  await db.post.create({ data: Object.fromEntries(formData) });
  return redirect("/posts");
}

export default function CreatePost() {
  return <Form method="post">...</Form>;
}
```

---

## Upgrade Process

1. **Detect versions** — check `package.json` for current React Router/Remix
   versions
2. **Update dependencies** — install new packages, remove old ones
3. **Update config** — create `react-router.config.ts` and `routes.ts`
4. **Update imports** — search and replace package imports
5. **Convert route modules** — adopt typegen types, remove `json()`/`defer()`
6. **Run typegen** — `npx react-router typegen` to generate route types
7. **Test** — run existing tests, fix any type errors
8. **Build** — verify production build succeeds

## Breaking Changes Checklist

- [ ] `json()` removed — return plain objects
- [ ] `defer()` removed — return promises directly
- [ ] `useLoaderData()` → prefer `loaderData` prop from `Route.ComponentProps`
- [ ] `MetaFunction` → `Route.MetaArgs` via typegen
- [ ] `LoaderFunctionArgs` → `Route.LoaderArgs` via typegen
- [ ] `headers()` receives `Route.HeadersArgs` instead of positional args
- [ ] `meta()` receives `Route.MetaArgs` instead of separate args
- [ ] Route config moved from `remix.config.js` to `react-router.config.ts`
- [ ] Vite plugin changed from `@remix-run/dev` to `@react-router/dev/vite`

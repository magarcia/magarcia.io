---
name: rr7-data-patterns
description: |
  React Router 7 data loading, mutations, and fetcher patterns. Use when
  implementing loaders, actions, forms, fetchers, optimistic UI, or data
  revalidation. Triggers on: "loader", "action", "form submission", "useFetcher",
  "data loading", "mutation", "optimistic UI", "revalidation", "clientLoader",
  "serverLoader", "resource route".
allowed-tools:
  - Read
  - Edit
  - Write
  - Grep
  - Glob
---

# React Router 7 Data Patterns

Complete guide for data loading, mutations, and fetcher patterns. For streaming,
cookies/sessions, single-fetch revalidation, and progressive enhancement, see
[references/advanced.md](references/advanced.md).

## Data Loading

### Server Loader

Runs on server. Stripped from client bundle. Safe for DB, secrets, internal APIs.

```ts
import type { Route } from "./+types/product";
import { data } from "react-router";

export async function loader({ params, request }: Route.LoaderArgs) {
  const product = await db.product.findUnique({
    where: { id: params.id },
  });
  if (!product) {
    throw data("Not found", { status: 404 });
  }
  return product;
}

export default function Product({ loaderData }: Route.ComponentProps) {
  return <h1>{loaderData.name}</h1>;
}
```

### Client Loader

Runs in browser only. Use for localStorage, IndexedDB, browser APIs.

```tsx
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const res = await fetch(`/api/products/${params.id}`);
  return res.json();
}

// Required when clientLoader.hydrate = true
export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Product({ loaderData }: Route.ComponentProps) {
  return <h1>{loaderData.name}</h1>;
}
```

### Combined Loaders

`clientLoader` can augment server data:

```tsx
export async function loader({ params }: Route.LoaderArgs) {
  return db.product.findUnique({ where: { id: params.id } });
}

export async function clientLoader({
  serverLoader,
}: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();
  const prefs = JSON.parse(localStorage.getItem("prefs") || "{}");
  return { ...serverData, prefs };
}
```

### Parallel Data Loading

Nested route loaders run in parallel automatically. Within a single loader,
use `Promise.all`:

```ts
export async function loader() {
  const [user, posts, stats] = await Promise.all([
    getUser(),
    getPosts(),
    getStats(),
  ]);
  return { user, posts, stats };
}
```

---

## Actions & Mutations

### Server Action

```tsx
import { Form, redirect } from "react-router";
import type { Route } from "./+types/new-post";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  const errors: Record<string, string> = {};
  if (!title) errors.title = "Title is required";
  if (!body) errors.body = "Body is required";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const post = await db.post.create({
    data: { title: String(title), body: String(body) },
  });
  return redirect(`/posts/${post.id}`);
}

export default function NewPost({ actionData }: Route.ComponentProps) {
  return (
    <Form method="post">
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" />
        {actionData?.errors?.title && (
          <p className="error">{actionData.errors.title}</p>
        )}
      </div>
      <div>
        <label htmlFor="body">Body</label>
        <textarea id="body" name="body" />
        {actionData?.errors?.body && (
          <p className="error">{actionData.errors.body}</p>
        )}
      </div>
      <button type="submit">Create</button>
    </Form>
  );
}
```

### Calling Actions

Three ways to call actions:

```tsx
// 1. <Form> — causes navigation, adds to history
<Form method="post" action="/posts">
  <input name="title" />
  <button type="submit">Create</button>
</Form>

// 2. useSubmit — imperative navigation
const submit = useSubmit();
submit({ title: "New Post" }, { method: "post", action: "/posts" });

// 3. useFetcher — no navigation, no history change
const fetcher = useFetcher();
<fetcher.Form method="post" action="/posts">
  <input name="title" />
  <button type="submit">Create</button>
</fetcher.Form>
```

---

## Fetchers

Use `useFetcher` for mutations and data loading without navigation.

### Mutation with Optimistic UI

```tsx
import { useFetcher } from "react-router";

function TodoItem({ todo }) {
  const fetcher = useFetcher();
  const isDone = fetcher.formData
    ? fetcher.formData.get("done") === "true"
    : todo.done;

  return (
    <fetcher.Form method="post" action={`/todos/${todo.id}`}>
      <input type="hidden" name="done" value={String(!todo.done)} />
      <button type="submit" disabled={fetcher.state !== "idle"}>
        {isDone ? "✓" : "○"} {todo.title}
      </button>
    </fetcher.Form>
  );
}
```

### Loading Data Without Navigation

```tsx
function UserSearch() {
  const fetcher = useFetcher();

  return (
    <div>
      <fetcher.Form method="get" action="/api/search-users">
        <input
          type="search"
          name="q"
          onChange={(e) => fetcher.submit(e.currentTarget.form)}
        />
      </fetcher.Form>
      <ul style={{ opacity: fetcher.state === "loading" ? 0.5 : 1 }}>
        {fetcher.data?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Multiple Concurrent Fetchers

```tsx
import { useFetchers } from "react-router";

function SaveIndicator() {
  const fetchers = useFetchers();
  const isSaving = fetchers.some((f) => f.state !== "idle");
  return isSaving ? <span>Saving...</span> : null;
}
```

---

## Pending UI

### Navigation State

```tsx
import { useNavigation } from "react-router";

function GlobalSpinner() {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";
  return isNavigating ? <Spinner /> : null;
}
```

### Navigation states:

- `navigation.state === "idle"` — no pending navigation
- `navigation.state === "loading"` — loader running for next page
- `navigation.state === "submitting"` — action running from form

---

## Resource Routes

Routes with `loader`/`action` but no default component serve raw responses:

```ts
// app/routes/api.users.ts — JSON API
export async function loader() {
  const users = await db.user.findMany();
  return Response.json(users);
}

// app/routes/rss.xml.ts — RSS feed
export async function loader() {
  const posts = await getPosts();
  const rss = generateRSS(posts);
  return new Response(rss, {
    headers: { "Content-Type": "application/xml" },
  });
}

// app/routes/download.$id.ts — file download
export async function loader({ params }: Route.LoaderArgs) {
  const file = await getFile(params.id);
  return new Response(file.buffer, {
    headers: {
      "Content-Type": file.mime,
      "Content-Disposition": `attachment; filename="${file.name}"`,
    },
  });
}
```

Link to resource routes with `<Link reloadDocument>` or plain `<a>` tags:

```tsx
<Link reloadDocument to="/rss.xml">RSS Feed</Link>
```

---

## Revalidation

After every action, all active loaders revalidate automatically. Control this
with `shouldRevalidate`:

```ts
export function shouldRevalidate({
  formAction,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  // Skip revalidation for unrelated actions
  if (formAction === "/analytics/track") {
    return false;
  }
  return defaultShouldRevalidate;
}
```

---

## Key Rules

1. **Fetch in loaders, not in useEffect** — loaders run in parallel for nested
   routes and integrate with SSR/pre-rendering.
2. **Return plain objects** — `json()` is deprecated. Return objects directly
   from loaders and actions.
3. **Use `data()` for custom status/headers** — `return data(payload,
   { status, headers })`.
4. **Redirect after mutations** — prevents double-submit on refresh.
5. **Validate in actions** — return error objects, render in component via
   `actionData`.
6. **Use fetchers for non-navigating operations** — inline edits, live search,
   background saves.

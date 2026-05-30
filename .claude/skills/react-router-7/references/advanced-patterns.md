# React Router 7 Advanced Data Patterns

## Table of Contents

- [Streaming with Suspense](#streaming-with-suspense)
- [Cookies and Sessions](#cookies-and-sessions)
- [Single Fetch & Revalidation](#single-fetch--revalidation)
- [Progressive Enhancement](#progressive-enhancement)

---

## Streaming with Suspense

`defer()` is removed in v7. Return un-awaited promises directly from loaders.

```ts
export async function loader({ params }: Route.LoaderArgs) {
  // Critical data — await it (blocks render)
  const product = await getProduct(params.id);

  // Non-critical data — DON'T await (streams in)
  const reviews = getReviews(params.id);
  const recommendations = getRecommendations(params.id);

  return { product, reviews, recommendations };
}
```

Render with `<Suspense>` and `<Await>`:

```tsx
import { Suspense } from "react";
import { Await } from "react-router";

export default function Product({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>{loaderData.product.name}</h1>

      <Suspense fallback={<div>Loading reviews...</div>}>
        <Await resolve={loaderData.reviews}>
          {(reviews) => (
            <ul>
              {reviews.map((r) => (
                <li key={r.id}>{r.text}</li>
              ))}
            </ul>
          )}
        </Await>
      </Suspense>
    </div>
  );
}
```

With React 19, use `React.use()` instead of `<Await>`:

```tsx
function Reviews({ promise }: { promise: Promise<Review[]> }) {
  const reviews = React.use(promise);
  return (
    <ul>
      {reviews.map((r) => <li key={r.id}>{r.text}</li>)}
    </ul>
  );
}

// Usage:
<Suspense fallback={<div>Loading...</div>}>
  <Reviews promise={loaderData.reviews} />
</Suspense>
```

Configure stream timeout in `entry.server.tsx`:

```ts
export const streamTimeout = 10_000; // 10 seconds (default: 4950ms)
```

---

## Cookies and Sessions

### Cookie Session Storage

```ts
// app/sessions.server.ts
import { createCookieSessionStorage } from "react-router";

type SessionData = { userId: string };
type SessionFlashData = { error: string };

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
```

### Login with Sessions

```ts
import { redirect } from "react-router";
import { getSession, commitSession } from "../sessions.server";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();

  const userId = await validateCredentials(
    form.get("username"),
    form.get("password"),
  );

  if (!userId) {
    session.flash("error", "Invalid credentials");
    return redirect("/login", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  session.set("userId", userId);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
```

### Logout

```ts
export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}
```

### Auth Guard in Loaders

```ts
export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) {
    throw redirect("/login");
  }
  return { user: await getUser(session.get("userId")) };
}
```

### Standalone Cookies (preferences)

```ts
import { createCookie } from "react-router";

export const userPrefs = createCookie("user-prefs", {
  maxAge: 604_800, // 1 week
});

// Read in loader
export async function loader({ request }: Route.LoaderArgs) {
  const cookie = (await userPrefs.parse(
    request.headers.get("Cookie"),
  )) || {};
  return { showBanner: cookie.showBanner };
}

// Write in action
export async function action({ request }: Route.ActionArgs) {
  const cookie = (await userPrefs.parse(
    request.headers.get("Cookie"),
  )) || {};
  cookie.showBanner = false;
  return redirect("/", {
    headers: { "Set-Cookie": await userPrefs.serialize(cookie) },
  });
}
```

### Session Storage Backends

| Storage                         | Use case              |
| ------------------------------- | --------------------- |
| `createCookieSessionStorage`    | No DB needed          |
| `createMemorySessionStorage`    | Testing only          |
| `createFileSessionStorage`      | Node.js single-server |
| `createWorkersKVSessionStorage` | Cloudflare Workers    |
| `createSessionStorage`          | Custom DB backend     |

---

## Single Fetch & Revalidation

Single Fetch is the default in v7. On client navigations, React Router makes
**one HTTP call** (with `.data` suffix) that runs all necessary loaders.

### Default Revalidation Rules

| Scenario                | Behavior                             |
| ----------------------- | ------------------------------------ |
| GET navigation          | All matched loaders re-run           |
| After successful action | All loaders revalidate               |
| After 4xx/5xx action    | Loaders do NOT revalidate by default |

### `shouldRevalidate` Patterns

```ts
// Never revalidate (static data)
export function shouldRevalidate() {
  return false;
}

// Only revalidate for specific actions
export function shouldRevalidate({ formAction }) {
  return formAction
    ? ["/cart", "/checkout"].includes(formAction)
    : false;
}

// Opt back into revalidation after errors
export function shouldRevalidate({ actionStatus, defaultShouldRevalidate }) {
  if (actionStatus != null && actionStatus >= 400) {
    return true;
  }
  return defaultShouldRevalidate;
}
```

### Manual Revalidation

```tsx
import { useRevalidator } from "react-router";

function RefreshButton() {
  const { revalidate, state } = useRevalidator();
  return (
    <button onClick={() => revalidate()} disabled={state === "loading"}>
      Refresh
    </button>
  );
}
```

Rarely needed — `<Form>`, `useSubmit`, and `useFetcher` handle revalidation
automatically.

---

## Progressive Enhancement

React Router's `<Form>` works without JavaScript (browser handles submission)
and is enhanced with JavaScript (React Router intercepts):

```tsx
// Works with AND without JavaScript
<Form method="post" action="/add-to-cart">
  <input type="hidden" name="id" value={productId} />
  <button type="submit">Add To Cart</button>
</Form>
```

Layer on pending state with fetchers:

```tsx
const fetcher = useFetcher();
<fetcher.Form method="post" action="/add-to-cart">
  <input type="hidden" name="id" value={productId} />
  <button type="submit">
    {fetcher.state === "submitting" ? "Adding..." : "Add To Cart"}
  </button>
</fetcher.Form>
```

# React Router 7 Middleware

Middleware is stable since React Router 7.9.0 via the `future.v8_middleware`
flag. It runs sequentially in a nested chain from parent to child routes.

## Enabling Middleware

```ts
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  future: {
    v8_middleware: true,
  },
} satisfies Config;
```

## Type-Safe Context

```ts
import { createContext } from "react-router";
import type { User } from "~/types";

export const userContext = createContext<User | null>(null);
```

## Server Middleware

### Authentication

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

## Client Middleware

Runs during browser navigations. Does not return `Response` objects.

```ts
async function clientTimingMiddleware({ request }, next) {
  const start = performance.now();
  await next();
  console.log(`Navigation: ${performance.now() - start}ms`);
}

export const clientMiddleware = [clientTimingMiddleware];
```

## The `next()` Pattern

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

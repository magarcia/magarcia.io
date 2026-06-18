# React Router 7 Deployment

## Table of Contents

- [Official Adapters](#official-adapters)
- [Express Adapter](#express-adapter)
- [Cloudflare Workers](#cloudflare-workers)
- [Cloudflare Pages (Static)](#cloudflare-pages-static)
- [Netlify](#netlify)
- [Docker (Node.js)](#docker-nodejs)
- [API Import Convention](#api-import-convention)
- [Full Config Reference](#full-config-reference)

---

## Official Adapters

| Adapter                  | Package                    | Use case        |
| ------------------------ | -------------------------- | --------------- |
| Express                  | `@react-router/express`    | Node.js servers |
| Cloudflare Workers/Pages | `@react-router/cloudflare` | Edge serverless |
| Architect (AWS)          | `@react-router/architect`  | AWS Lambda      |
| Node.js (generic)        | `@react-router/node`       | Node.js runtime |
| Serve (built-in)         | `@react-router/serve`      | Quick start     |

---

## Express Adapter

```ts
// server.js
import express from "express";
import { createRequestHandler } from "@react-router/express";

const app = express();

// Serve static files with long cache
app.use(express.static("build/client", { maxAge: "1y" }));

// Handle all other requests via React Router
app.all(
  "*",
  createRequestHandler({
    build: () => import("virtual:react-router/server-build"),
  })
);

app.listen(3000);
```

### Custom Vite config for Express

```ts
// vite.config.ts
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig(({ isSsrBuild }) => ({
  build: {
    rollupOptions: isSsrBuild
      ? { input: "./server/app.ts" }
      : undefined,
  },
  plugins: [reactRouter()],
}));
```

---

## Cloudflare Workers

```ts
// workers/app.ts
import { createRequestHandler } from "react-router";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
```

Create from template:

```bash
npm create cloudflare@latest my-app -- --framework=react-router
```

---

## Cloudflare Pages (Static)

For `ssr: false` with pre-rendering, deploy `build/client/` directly:

```bash
npx react-router build
npx wrangler pages deploy build/client
```

### `_redirects` file for SPA fallback

```
# If "/" is pre-rendered:
/*  /__spa-fallback.html  200

# If "/" is NOT pre-rendered:
/*  /index.html  200
```

### `_headers` file

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

Copy these to `build/client/` as a post-build step.

---

## Netlify

```bash
npx react-router build
netlify deploy --dir=build/client --prod
```

### `_redirects` for Netlify

```
/*  /__spa-fallback.html  200
```

---

## Docker (Node.js)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npx", "react-router-serve", "build/server/index.js"]
```

---

## API Import Convention

Most shared APIs come from `react-router` directly. Only import from runtime
packages for runtime-specific APIs:

```ts
// Shared (use everywhere)
import { redirect, data, Form, Link } from "react-router";

// Node-specific
import { createFileSessionStorage } from "@react-router/node";

// Cloudflare-specific
import { createWorkersKVSessionStorage } from "@react-router/cloudflare";
```

---

## Full Config Reference

```ts
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "app",          // default
  buildDirectory: "build",      // default
  basename: "/",                // default
  ssr: true,                    // default (false for SPA/static)
  serverModuleFormat: "esm",    // default
  serverBuildFile: "index.js",  // default

  // Pre-rendering
  async prerender({ getStaticPaths }) {
    return [...getStaticPaths(), "/custom"];
  },

  // Build lifecycle
  async buildEnd({ buildManifest, reactRouterConfig, viteConfig }) {
    await generateSitemap(buildManifest);
  },

  // Route discovery
  routeDiscovery: {
    mode: "lazy",           // default (or "initial")
    manifestPath: "/__manifest",
  },

  // Future flags
  future: {
    v8_middleware: true,
  },
} satisfies Config;
```

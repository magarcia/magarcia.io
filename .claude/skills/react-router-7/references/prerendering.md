# React Router 7 Pre-rendering & Static Sites

## Table of Contents

- [Rendering Modes](#rendering-modes)
- [Configuration](#configuration)
- [Build Output](#build-output)
- [Data Loading in Static Mode](#data-loading-in-static-mode)
- [Constraints with ssr: false](#constraints-with-ssr-false)
- [SPA Fallback](#spa-fallback)
- [RSS, Sitemap, and Build Scripts](#rss-sitemap-and-build-scripts)
- [Deployment Checklist](#deployment-checklist)

---

## Rendering Modes

| Mode                   | `ssr` | `prerender`        | Output              | Use case                     |
| ---------------------- | ----- | ------------------ | ------------------- | ---------------------------- |
| SSR (default)          | true  | -                  | Server + client     | Dynamic apps                 |
| SSR + prerender        | true  | paths/fn           | Static + server     | Marketing + dynamic sections |
| Static prerender       | false | paths/fn/true      | Static HTML + `.data`| Blogs, docs, portfolios      |
| SPA (no prerender)     | false | -                  | Single HTML shell   | Dashboards, internal tools   |

---

## Configuration

### Boolean (all non-dynamic routes)

```ts
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  prerender: true,
} satisfies Config;
```

### Array of paths

```ts
export default {
  ssr: false,
  prerender: ["/", "/about", "/blog", "/blog/first-post"],
} satisfies Config;
```

### Async function with `getStaticPaths`

```ts
export default {
  ssr: false,
  async prerender({ getStaticPaths }) {
    const posts = await getBlogPosts();
    return [
      ...getStaticPaths(),
      ...posts.map((post) => `/blog/${post.slug}`),
    ];
  },
} satisfies Config;
```

### Concurrent pre-rendering

```ts
export default {
  ssr: false,
  async prerender({ getStaticPaths }) {
    return {
      paths: getStaticPaths(),
      concurrency: 10, // default: OS CPU count
    };
  },
} satisfies Config;
```

---

## Build Output

```
build/
├── client/
│   ├── index.html           # pre-rendered "/"
│   ├── about.html           # pre-rendered "/about"
│   ├── blog/
│   │   ├── index.html       # pre-rendered "/blog"
│   │   └── first-post.html  # pre-rendered "/blog/first-post"
│   ├── __spa-fallback.html  # SPA shell for non-prerendered routes
│   └── assets/              # JS, CSS, images
│       ├── root-[hash].js
│       └── ...
├── client-data/             # (when ssr: false)
│   ├── index.data           # loader data for "/"
│   └── blog/
│       └── first-post.data  # loader data for "/blog/first-post"
└── server/                  # (only when ssr: true)
    └── index.js
```

Pre-rendered pages include full HTML. The `.data` files contain serialized
loader data so client navigations skip re-running loaders for pre-rendered
routes.

---

## Data Loading in Static Mode

Loaders run at **build time** when pre-rendering. The framework creates
`Request` objects and calls your `loader` function:

```ts
export async function loader({ request }: Route.LoaderArgs) {
  // request.url is available at build time
  const posts = await getBlogPosts();
  return { posts };
}
```

The returned data is serialized to `.data` files. Client-side navigations
fetch these static files instead of calling a server.

---

## Constraints with ssr: false

| Export                    | Allowed?                              |
| ------------------------- | ------------------------------------- |
| `loader`                  | Yes (runs at build time if prerender) |
| `clientLoader`            | Yes                                   |
| `action`                  | No (requires runtime server)          |
| `clientAction`            | Yes                                   |
| `headers`                 | No (use `_headers` file instead)      |
| `middleware`              | No (requires runtime server)          |
| `ErrorBoundary`           | Yes                                   |
| `HydrateFallback`         | Yes                                   |

---

## SPA Fallback

When `ssr: false`, non-prerendered routes fall back to `__spa-fallback.html`.
Configure your hosting to serve this file for unmatched routes:

### Cloudflare Pages (`_redirects`)

```
# If "/" is pre-rendered:
/*  /__spa-fallback.html  200

# If "/" is NOT pre-rendered:
/*  /index.html  200
```

### Netlify (`_redirects`)

```
/*  /__spa-fallback.html  200
```

Copy `_redirects` and `_headers` files to `build/client/` as a post-build step.

---

## RSS, Sitemap, and Build Scripts

For static sites, generate RSS and sitemap as build scripts rather than
resource routes (which require a runtime server):

```ts
// scripts/generate-rss.ts
import { writeFileSync } from "fs";

async function generateRSS() {
  const posts = await getBlogPosts();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>My Blog</title>
      ${posts.map((p) => `<item><title>${p.title}</title></item>`).join("")}
    </channel>
  </rss>`;
  writeFileSync("build/client/rss.xml", xml);
}

generateRSS();
```

Add to `package.json`:

```json
{
  "scripts": {
    "build": "react-router build && node scripts/generate-rss.ts && node scripts/generate-sitemap.ts"
  }
}
```

Or use the `buildEnd` hook in `react-router.config.ts`:

```ts
export default {
  async buildEnd({ buildManifest, reactRouterConfig, viteConfig }) {
    await generateSitemap(buildManifest);
  },
} satisfies Config;
```

---

## Deployment Checklist

- [ ] Set `ssr: false` if deploying to static hosting
- [ ] Configure `prerender` for all known routes
- [ ] Copy `_redirects` and `_headers` to `build/client/`
- [ ] Generate sitemap and RSS as post-build scripts
- [ ] Test SPA fallback works for non-prerendered routes
- [ ] Verify `.data` files are served with correct MIME type
- [ ] Set long cache headers for `assets/` directory

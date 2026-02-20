---
name: rr7-prerendering
description: |
  React Router 7 pre-rendering, static site generation, and SPA mode. Use when
  configuring static builds, pre-rendering routes, setting up SPA fallbacks, or
  deploying to static hosting (Cloudflare Pages, Netlify, GitHub Pages, S3).
  Triggers on: "prerender", "static site", "SSG", "SPA mode", "ssr false",
  "static generation", "build to static", "deploy static".
allowed-tools:
  - Read
  - Edit
  - Write
  - Grep
  - Glob
  - Bash
---

# React Router 7 Pre-Rendering & Static Sites

Guide for pre-rendering, SPA mode, and static deployments.

## Rendering Modes

| Mode              | Config                       | Server needed? | Use case              |
| ----------------- | ---------------------------- | -------------- | --------------------- |
| SSR (default)     | `ssr: true`                  | Yes            | Dynamic apps          |
| SSR + pre-render  | `ssr: true` + `prerender`    | Yes            | Hybrid static/dynamic |
| Static pre-render | `ssr: false` + `prerender`   | No             | Static sites, blogs   |
| SPA               | `ssr: false`                 | No             | Client-only apps      |

## Configuration

All configuration lives in `react-router.config.ts`:

```ts
import type { Config } from "@react-router/dev/config";

export default {
  // Disable runtime SSR — serve from static files only
  ssr: false,

  // Pre-render specific paths at build time
  prerender: ["/", "/about", "/blog"],
} satisfies Config;
```

### Pre-render All Static Routes

```ts
export default {
  ssr: false,
  prerender: true, // auto-detects all non-dynamic routes
} satisfies Config;
```

### Pre-render Dynamic Routes

```ts
export default {
  ssr: false,
  async prerender({ getStaticPaths }) {
    const posts = await getPostSlugs();
    return [
      ...getStaticPaths(), // includes "/", "/about", etc.
      ...posts.map((slug) => `/blog/${slug}`),
    ];
  },
} satisfies Config;
```

### Concurrent Pre-rendering (Experimental)

```ts
export default {
  ssr: false,
  prerender: {
    paths: async ({ getStaticPaths }) => {
      const slugs = await getPostSlugs();
      return [...getStaticPaths(), ...slugs.map((s) => `/blog/${s}`)];
    },
    unstable_concurrency: 4, // parallel pre-rendering
  },
} satisfies Config;
```

## Build Output

Pre-rendering generates two files per path:

```
build/client/
├── index.html              # / (HTML for initial load)
├── about/index.html        # /about
├── about.data              # /about (data for client navigation)
├── blog/index.html         # /blog
├── blog.data
├── blog/my-post/index.html # /blog/my-post
├── blog/my-post.data
└── __spa-fallback.html     # SPA fallback (when "/" is pre-rendered)
```

- `.html` files — served for initial page loads (document requests)
- `.data` files — served for client-side navigations (data requests)
- `__spa-fallback.html` — catch-all for non-pre-rendered paths

## Data Loading in Static Mode

Pre-rendered routes use the same `loader` function. The build creates `Request`
objects and runs loaders at build time:

```ts
export async function loader({ params }: Route.LoaderArgs) {
  // Runs at build time for pre-rendered routes
  const post = await readMarkdownFile(`data/blog/${params.slug}.mdx`);
  return { title: post.title, content: post.content };
}

export default function Post({ loaderData }: Route.ComponentProps) {
  return (
    <article>
      <h1>{loaderData.title}</h1>
      <div>{loaderData.content}</div>
    </article>
  );
}
```

## Constraints with `ssr: false`

| Export            | Allowed?                        |
| ----------------- | ------------------------------- |
| `loader`          | Only on pre-rendered routes     |
| `clientLoader`    | Yes (runs in browser)           |
| `action`          | No (requires runtime server)    |
| `clientAction`    | Yes (runs in browser)           |
| `headers`         | No (requires runtime server)    |
| `middleware`       | No (requires runtime server)    |

## SPA Fallback

When `ssr: false` with some pre-rendered paths, non-pre-rendered paths fall back
to a SPA shell:

```ts
export default {
  ssr: false,
  prerender: ["/", "/about", "/blog"],
  // /dashboard, /settings, etc. → SPA fallback
} satisfies Config;
```

Configure your static server to serve the fallback for 404s:

```bash
# If "/" IS pre-rendered, fallback is __spa-fallback.html
npx sirv-cli build/client --single __spa-fallback.html

# If "/" is NOT pre-rendered, fallback is index.html
npx sirv-cli build/client --single index.html
```

### Cloudflare Pages `_redirects`

```
/*  /__spa-fallback.html  200
```

### Netlify `_redirects`

```
/*  /__spa-fallback.html  200
```

## Deployment

### Cloudflare Pages (Static)

```ts
// react-router.config.ts
export default {
  ssr: false,
  prerender: true,
} satisfies Config;
```

```bash
# Build and deploy
npx react-router build
npx wrangler pages deploy build/client
```

### Node.js with Express

```ts
// server.js
import express from "express";
import { createRequestHandler } from "@react-router/express";

const app = express();
app.use(express.static("build/client", { maxAge: "1y" }));
app.all("*", createRequestHandler({ build: "./build/server/index.js" }));
app.listen(3000);
```

### Cloudflare Workers (SSR)

Use `@react-router/cloudflare` adapter:

```ts
// react-router.config.ts
export default {
  ssr: true,
  prerender: ["/", "/about"],
} satisfies Config;
```

## RSS, Sitemap, and Build Scripts

For static sites, generate RSS and sitemaps as build scripts:

```ts
// scripts/generate-rss.ts
import { getPosts } from "../lib/blog";

async function generateRSS() {
  const posts = await getPosts();
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>My Blog</title>
    ${posts.map((p) => `<item>
      <title>${p.title}</title>
      <link>https://example.com/blog/${p.slug}</link>
    </item>`).join("")}
  </channel>
</rss>`;
  writeFileSync("build/client/rss.xml", rss);
}
```

Run after `react-router build` in your build script:

```json
{
  "scripts": {
    "build": "react-router build && tsx scripts/generate-rss.ts && tsx scripts/generate-sitemap.ts"
  }
}
```

## Checklist

- [ ] Set `ssr: false` if deploying to static hosting
- [ ] Define all pre-rendered paths in `prerender` config
- [ ] Use `loader` for build-time data (reads files, CMS, APIs)
- [ ] Use `clientLoader` for runtime data on non-pre-rendered routes
- [ ] Configure static server fallback for SPA routes
- [ ] Copy `_redirects`/`_headers` to `build/client` if needed
- [ ] Generate RSS/sitemap as post-build scripts

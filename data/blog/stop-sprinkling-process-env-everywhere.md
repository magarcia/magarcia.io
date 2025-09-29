---
title: "Enable environment variables in your configs with env-interpolation"
date: "2025-09-29"
spoiler: I shipped [`env-interpolation`](https://www.npmjs.com/package/env-interpolation), a tiny TS helper that interpolates `${VAR}` and `${VAR:default}` inside config values. It walks strings in objects/arrays and never touches keys, so shapes stay stable and predictable—very config-oriented.
tags:
  - TypeScript
  - Node.js
  - Configuration
  - Developer Tools
  - Open Source
---

I shipped **env-interpolation**, a tiny TS helper that interpolates `${VAR}` and `${VAR:default}` inside **config values**. It walks strings in objects/arrays and **never touches keys**, so shapes stay stable and predictable—very config-oriented.

Born out of **mcp-tool-selector**, where I needed layered config without leaking secrets or littering `process.env` calls. It turned into a sharp little utility, so I published it.

## At a glance

- Resolves placeholders in **values only** (objects/arrays), keys untouched
- Supports defaults and multi-pass resolution
- Zero deps, TS-first, Node 18+, ESM/CJS

**Docs & API:** read the [GitHub repo](https://github.com/magarcia/env-interpolation) and the [npm package page](https://www.npmjs.com/package/env-interpolation).

## Quick taste: load JSON → interpolate

**`config.json`**

```json
{
  "api": "${API_URL:https://api.example.com}",
  "timeoutMs": "${TIMEOUT:5000}",
  "flags": ["${PRIMARY:alpha}", "${SECONDARY:beta}"],
  "service": {
    "url": "${SERVICE_URL:${API_URL}/v1}",
    "headers": { "x-tenant": "${TENANT:public}" }
  }
}
```

**`load-config.ts`**

```ts
import { readFileSync } from "node:fs";
import { interpolate } from "env-interpolation";

const raw = readFileSync("config.json", "utf8");
const input = JSON.parse(raw);

const resolved = interpolate(input, {
  API_URL: "https://api.example.com",
  TIMEOUT: "8000",
  TENANT: "public",
});

console.log(resolved);
```

This is my second AI engineered project (the first one was [mcp-server-giphy](https://github.com/magarcia/mcp-server-giphy)), built with multiple AI agents (Claude, Copilot, Gemini & Codex). If your configs span files, environments, and tools, this should remove a few papercuts.

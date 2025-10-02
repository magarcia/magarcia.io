---
title: "Cross-platform secret storage with cross-keychain"
date: "2025-10-01"
spoiler: I shipped [`cross-keychain`](https://www.npmjs.com/package/cross-keychain), a TypeScript library that stores secrets in your OS's native credential manager — macOS Keychain, Windows Credential Manager, or Linux Secret Service. One API, zero plaintext config files.
tags:
  - TypeScript
  - Node.js
  - Security
  - Developer Tools
  - Open Source
---

I shipped **cross-keychain**, a TypeScript library that stores secrets in your OS's native credential manager—macOS Keychain, Windows Credential Manager, or Linux Secret Service. One API, **zero plaintext config files**.

Born out of **mcp-tool-selector** (_still work in progress 😅_), where I needed to manage API keys for multiple MCP servers without scattering secrets across `.env` files or worse, committing them to repos. It turned into a solid cross-platform utility, so I published it.

## At a glance

- Works on **macOS, Windows, and Linux** with native backend support
- Provides both **programmatic API** and **CLI** for storing/retrieving secrets
- Automatic fallback when native modules aren't available
- Zero deps on the public API, TS-first, Node 18+, ESM/CJS

**Docs & API:** read the [GitHub repo](https://github.com/magarcia/cross-keychain) and the [npm package page](https://www.npmjs.com/package/cross-keychain).

## Quick taste: store & retrieve secrets

**Programmatic usage:**

```ts
import { setPassword, getPassword } from "cross-keychain";

// Store a secret
await setPassword("myapp", "api-token", "sk-1234567890");

// Retrieve it later
const token = await getPassword("myapp", "api-token");
console.log(token); // "sk-1234567890"

// Delete when done
await deletePassword("myapp", "api-token");
```

**CLI usage:**

```bash
# Store a secret
npx cross-keychain set myapp api-token

# Retrieve it
npx cross-keychain get myapp api-token

# Delete it
npx cross-keychain delete myapp api-token
```

## Why this matters

Storing secrets in plaintext `.env` files or config files is a common pattern, but it's risky. You have to remember to `.gitignore` them, rotate them when they leak, and manage them across environments. **Native OS credential stores** are designed for this—encrypted at rest, access-controlled, and integrated with your system.

`cross-keychain` gives you a consistent API across platforms, so you can write once and trust the OS to handle the heavy lifting.

This is my third AI-engineered project (after [mcp-server-giphy](https://github.com/magarcia/mcp-server-giphy) and [env-interpolation](/blog/stop-sprinkling-process-env-everywhere)), built with multiple AI agents. If you're tired of managing secrets in plaintext, this should make your life easier.

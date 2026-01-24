# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Common Commands

- `yarn dev` - Start development server
- `yarn build` - Build static site and generate sitemap/RSS
- `yarn lint` - Run ESLint on app directory
- `yarn typecheck` - Run TypeScript type checking
- `yarn test:unit` - Run unit tests with Vitest
- `yarn test:e2e` - Run end-to-end tests with Playwright

## Architecture Overview

This is a static blog built with **React Router v7** that pre-renders to static
files. Key architectural patterns:

### Content Management

- Blog posts are stored as Markdown files in `data/blog/`
- `lib/blog.ts` handles all content parsing using gray-matter for frontmatter
  and reading-time for metrics
- Content is processed at build time via React Router's prerender feature
- Draft posts are filtered out in production builds
- Multi-language support: English (default), Spanish (`.es.mdx`), Catalan
  (`.ca.mdx`)

### Static Generation

- Uses React Router's static prerendering (`ssr: false` in
  react-router.config.ts)
- Routes are pre-rendered at build time based on `prerender()` function exports
- RSS feed and sitemap are generated via build scripts (`scripts/generate-*.ts`)
- `_redirects` and `_headers` files are copied to output for Cloudflare Pages

### Styling & Theming

- Tailwind CSS for styling with custom global styles in `styles/`
- Dark/light theme support via custom `useTheme` hook with localStorage
  persistence
- Syntax highlighting styles in `styles/highlight.css`

### Route Structure

- `app/routes/_index.tsx` - Homepage with blog list
- `app/routes/$slug.tsx` - Dynamic blog post pages
- `app/routes/tags.$tag.tsx` - Tag-based filtering
- Locale variants: `/es/`, `/ca/` prefixes

### Components

- Custom markdown components in `components/mdxComponents.tsx`
- Reusable UI components for blog elements (CodeBlock, Heading, etc.)
- Uses react-markdown with rehype-raw for HTML in markdown

### Security

- Input validation for slugs and tags (alphanumeric, hyphens only)
- Security headers configured in `_headers` file
- External links use `rel="noopener noreferrer"`

Package manager: Yarn (v4.1.1)

### Writing Blog Posts

When writing or editing blog articles, use semantic emphasis correctly:

**Use `**strong**` for:**

- Product/library names (e.g., **cross-keychain**, **React**)
- Labels and headings (e.g., **Docs & API:**, **CLI usage:**)
- Key technical terms being introduced
- Important information the reader must not miss

**Use `*em*` for:**

- Vocal stress emphasis (as if spoken aloud with stress)
- Foreign words or technical terms used conversationally
- Titles of works
- Introducing a term for the first time in a non-technical context

The site uses Newsreader serif font for italics (`em`/`i` tags), providing
visual contrast with the Inter sans-serif body text.

**Nested code blocks:**

When showing code examples that themselves contain code blocks (e.g., showing
the contents of a markdown file with embedded code blocks), use **4 backticks**
for the outer fence and **3 backticks** for the inner fence:

`````markdown
Here's an example SKILL.md file:

````markdown
# My Skill

Example usage:

```bash
./script.ts <input>
```
````
`````

```

**Why:** Standard markdown parsers only close a code fence when they encounter the matching number of backticks. Using 4 backticks for the outer fence prevents the inner 3-backtick fences from prematurely closing the outer block.

**Don't use:** Escaped backticks (`` \`\`\` ``) inside code blocks, as they will render literally and break the formatting.

### Blog Post Tags

Tags must be **lowercase and slug-friendly** (e.g., `developer-tools`, `node-js`, `open-source`).

**Before adding tags to a post:**
1. Check existing tags by running: `grep -rh "^  - " data/blog/*.mdx | sort -u`
2. Prefer reusing existing tags to maintain consistency and ensure tags have multiple posts
3. New tags are allowed when they represent a genuinely distinct topic not covered by existing tags

**Current tags:** `ai`, `angular`, `bun`, `cli`, `developer-tools`, `gsoc`, `javascript`, `mvp`, `node-js`, `open-source`, `patterns`, `performance`, `react`, `redux`, `security`, `service-workers`, `software-engineering`, `typescript`

**Note:** All tags should be in English, even for translated articles (Spanish/Catalan).
```

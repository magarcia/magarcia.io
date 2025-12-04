# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- `yarn dev` - Start development server
- `yarn build` - Build static site with image optimization and copy _redirects file
- `yarn lint` - Run Next.js linter
- `yarn start` - Start production server (after build)

## Architecture Overview

This is a static blog built with Next.js that exports to static files. Key architectural patterns:

### Content Management
- Blog posts are stored as Markdown files in `data/blog/`
- `lib/blog.js` handles all content parsing using gray-matter for frontmatter and reading-time for metrics
- Content is processed at build time, not runtime
- Draft posts are filtered out in production builds

### Static Generation
- Uses Next.js static export (`output: "export"` in next.config.js)
- Images are optimized using next-image-export-optimizer
- RSS feed and sitemap are generated during webpack build process (see next.config.js webpack function)
- _redirects file is copied to output for Netlify/Vercel redirects

### Styling & Theming
- Tailwind CSS for styling with custom global styles in `styles/`
- Dark/light theme support via next-themes with ThemeProvider in `_app.js`
- Syntax highlighting styles in `styles/highlight.css`

### Page Structure
- `[slug].js` - Dynamic blog post pages
- `index.js` - Homepage with blog list
- `tags/[tag].js` - Tag-based filtering
- API routes in `pages/api/views/` for view tracking

### Components
- Custom markdown components in `components/markdownComponents.js`
- Reusable UI components for blog elements (CodeBlock, Heading, etc.)
- ViewCounter component for post analytics

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

The site uses Newsreader serif font for italics (`em`/`i` tags), providing visual contrast with the Inter sans-serif body text.
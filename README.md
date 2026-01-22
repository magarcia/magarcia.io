# [magarcia.io](https://magarcia.io)

A personal blog by Martin Garcia. Thoughts, words, and experiments about code.

## Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Content**: Markdown with
  [gray-matter](https://github.com/jonschlinkert/gray-matter)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Syntax Highlighting**:
  [Prism React Renderer](https://github.com/FormidableLabs/prism-react-renderer)
- **Testing**: [Vitest](https://vitest.dev/) +
  [Playwright](https://playwright.dev/)
- **Package Manager**: [Yarn 4.1.1](https://yarnpkg.com/)

## Features

- Static site generation with React Router's prerender feature
- Multi-language support (English, Spanish, Catalan)
- Dark/light theme with system preference detection
- RSS feed and sitemap generation
- Tag-based content filtering
- Reading time estimation
- SEO optimization
- Accessibility testing with axe-core

## Project Structure

```
.
├── app/              # Application code and routes
│   ├── routes/       # React Router v7 routes
│   ├── root.tsx      # Root layout component
│   └── entry.*.tsx   # Client and server entry points
├── components/       # Reusable React components
├── data/
│   └── blog/         # Blog posts in Markdown format
├── hooks/            # Custom React hooks
├── lib/              # Utilities and helper functions
├── public/           # Static assets (fonts, images, robots.txt)
├── scripts/          # Build scripts (RSS, sitemap generation)
├── styles/           # Global styles and theme CSS
└── tests/            # Unit and E2E tests
```

## Running Locally

```bash
git clone https://github.com/magarcia/magarcia.io.git
cd magarcia.io
yarn install
yarn dev
```

The site will be available at `http://localhost:5173`

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build static site and generate sitemap/RSS
- `yarn serve` - Preview production build locally
- `yarn lint` - Run ESLint
- `yarn typecheck` - Run TypeScript type checking
- `yarn test:unit` - Run unit tests
- `yarn test:e2e` - Run end-to-end tests
- `yarn build:ci` - Full CI build with tests

## Content Management

Blog posts are stored as Markdown files in `data/blog/` with frontmatter for
metadata:

- `slug` - URL path for the post
- `title` - Post title
- `date` - Publication date
- `tags` - Array of tags
- `draft` - Boolean for draft status
- `summary` - Short description

Multi-language variants use file extensions: `.mdx` (English), `.es.mdx`
(Spanish), `.ca.mdx` (Catalan).

## Deployment

The site is deployed to Cloudflare Pages via GitHub integration. The build
command runs:

1. React Router build (static prerendering)
2. Sitemap generation
3. RSS feed generation
4. Static asset copying

The `_headers` and `_redirects` files configure redirects and security headers
for Cloudflare Pages.

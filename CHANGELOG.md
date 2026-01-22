# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## 2025-11-21

### Added

- End-to-end testing with Playwright (47 tests covering homepage, blog posts,
  tags, theme switching, i18n, and accessibility)
- Page objects pattern for test organization (Header, HomePage, BlogPostPage,
  TagPage)
- Accessibility testing with Axe integration
- Data-testid attributes to key components

### Changed

- Upgraded Node.js from 20 to 22 (latest LTS)
- Replaced Next.js ESLint config with React/TypeScript plugins
- Fixed TypeScript errors in route loaders

## 2025-11-19

### Added

- Internationalization (i18n) support for Spanish and Catalan languages (#15)

## 2025-11-16

### Changed

- **Major Migration**: Migrated from Next.js 14 to React Router 7 with
  TypeScript (#14)
  - Converted all JavaScript files to TypeScript
  - Converted all `.md` blog posts to `.mdx` format
  - Implemented custom `useTheme` hook for dark/light mode (replacing
    next-themes)
  - Used react-markdown with client-side dynamic imports
  - Configured static prerendering for all blog posts and tag pages
  - Updated build scripts for sitemap and RSS feed generation

### Removed

- View counter feature and associated API routes

## 2025-10-02

### Fixed

- Cross-links in recent blog posts

### Added

- Cross-links between related blog posts

## 2025-10-01

### Added

- New blog post: "cross-keychain" package

## 2025-09-29

### Added

- Markdown rendering in blog titles across all views (list, article, tags)
- New blog post: "env-interpolation" package

### Fixed

- Inline code scaling to use relative sizing (0.65em) instead of fixed text-sm
- Build error by removing conflicting package-lock.json (project uses Yarn)

## 2025-06-06

### Added

- New blog post: "Asking AI to Build the Tool Instead of Doing the Task"
- CLAUDE.md file for AI assistant guidance

### Fixed

- RSS generation issues
- Updated generated XML files

## 2024-04-27

### Changed

- **Major Upgrade**: Upgraded from Next.js 12 to Next.js 14 (#13)
  - Upgraded Yarn to version 4
  - Added support for Cloudflare Pages deployment
  - Fixed images and code rendering
  - Configured redirects for Cloudflare

## 2023-09-11

### Added

- New blog post

## 2023-01-26

### Security

- Bumped ua-parser-js from 1.0.2 to 1.0.33 (#9)

## 2023-01-10

### Security

- Bumped json5 from 1.0.1 to 1.0.2 (#8)

## 2022-08-31

### Fixed

- Sitemap generation

## 2022-06-18

### Added

- Plausible.io analytics tracking

## 2022-05-29

### Changed

- Updated README.md

## 2022-05-03

### Fixed

- Typos in content

## 2022-04-04

### Security

- Bumped minimist from 1.2.5 to 1.2.6 (#7)

## 2022-02-18

### Security

- Bumped Next.js from 12.0.10 to 12.1.0 (#6)

## 2022-02-13

### Changed

- Improved middleware performance
- Migrated Tailwind configuration

## 2022-02-12

### Added

- Analytics middleware
- Analytics integration

### Changed

- Updated dependencies

## 2022-02-01

### Security

- Bumped Next.js from 12.0.7 to 12.0.9 (#4)
- Bumped markdown-it from 12.2.0 to 12.3.2 (#2)
- Bumped nanoid from 3.1.30 to 3.2.0 (#3)

## 2022-01-28

### Security

- Bumped Next.js from 12.0.7 to 12.0.9

## 2022-01-12

### Security

- Bumped markdown-it from 12.2.0 to 12.3.2

## 2021-12-08

### Added

- View counter for each blog post

### Changed

- Upgraded Next.js
- Updated dependencies
- Switched to Yarn (removed package-lock.json)

## 2021-12-06

### Changed

- Cleaned up main page design

## 2021-06-29

### Added

- Dark mode support (class-based)
- VERCEL_URL as siteUrl configuration

### Changed

- **Initial Migration**: Migrated to Next.js framework

### Improved

- Accessibility (a11y) enhancements

## 2021-06-06

### Added

- Initial commit from Create Next App
- Project scaffolding and initial setup

---

## Summary

This blog has evolved through several major phases:

1. **2021**: Initial creation with Next.js, dark mode, accessibility features,
   and view counters
2. **2022**: Added analytics (Plausible.io), middleware optimizations, and
   security updates
3. **2023**: Security maintenance and continued content updates
4. **2024**: Major upgrade to Next.js 14 with Cloudflare Pages deployment
5. **2025**: Major migration to React Router 7 with TypeScript, added i18n
   support, and comprehensive E2E testing

The project uses Yarn as the package manager and is deployed automatically on
every merge to main.

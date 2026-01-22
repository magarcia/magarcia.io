---
name: translate-articles
description: |
  Use when user says "translate articles", "translate blog posts",
  "translate missing articles", "add Spanish translations",
  "add Catalan translations", or "translate untranslated posts".
allowed-tools:
  - Read
  - Bash
---

# Translate Articles Skill

Translates blog articles to Spanish (Castellano) and Catalan using Gemini CLI.

## Usage

Run the translation script:

```bash
npx -y tsx .claude/skills/translate-articles/scripts/translate.ts
```

## What It Does

1. Scans `data/blog/` for publishable `.mdx` articles (excludes `draft: true`)
2. Identifies articles missing `.es.mdx` or `.ca.mdx` translations
3. Translates in parallel using Gemini CLI (`gemini-3-pro-preview` model)
4. Saves translated files alongside originals

## Translation Conventions

- **Frontmatter**: Translates `title` and `spoiler`, keeps `tags` in English
- **Technical terms**: Keeps terms like API, CLI, TypeScript, hooks in English
- **Regional style**: Uses Castellano from Spain for Spanish, standard Catalan
- **Tone**: Informal "tú"/"tu" form
- **Formatting**: Preserves all markdown structure and code blocks

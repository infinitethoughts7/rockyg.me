# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal blog for Rocky G (rockyg.me) built with Astro 5 and the AstroPaper theme. Uses Tailwind CSS v4, TypeScript, and deploys to Vercel.

## Commands

- `npm run dev` — Start dev server (localhost:4321)
- `npm run build` — Type-check, build, and generate Pagefind search index
- `npm run preview` — Preview production build
- `npm run lint` — ESLint (`no-console` rule is enforced)
- `npm run format:check` / `npm run format` — Prettier check/fix

## Architecture

- **Site config**: `src/config.ts` — title, author, URL, pagination, OG settings
- **Blog content**: `src/data/blog/*.md` — Markdown posts with Zod-validated frontmatter (schema in `src/content.config.ts`)
- **Images**: `src/assets/images/posts/YYYY-MM/` — organized by year/month, referenced with relative paths from posts
- **OG image generation**: `src/pages/og.png.ts` and `src/pages/posts/[...slug]/index.png.ts` use Satori + sharp; templates in `src/utils/og-templates/`
- **Social links**: `src/constants.ts` — SOCIALS and SHARE_LINKS arrays with SVG icons from `src/assets/icons/`
- **Path alias**: `@/*` maps to `./src/*` (configured in tsconfig.json)

## Blog Post Frontmatter

Required fields: `pubDatetime`, `title`, `description`, `tags`. Optional: `featured`, `draft`, `ogImage`, `canonicalURL`, `modDatetime`, `hideEditPost`, `timezone`. Author defaults to "Rocky G".

## Key Patterns

- Posts with `draft: true` are excluded from production builds
- Posts with `featured: true` appear pinned on the homepage
- Markdown supports remark-toc (auto table of contents) and remark-collapse
- Code blocks use Shiki with diff notation, line highlighting, word highlighting, and file name transformers
- Pagefind provides client-side search (index built during `npm run build`, output in `public/pagefind/`)

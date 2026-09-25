# rocky.is-a.dev

Personal blog by Rocky G — built with [Astro](https://astro.build) and the [AstroPaper](https://github.com/satnaing/astro-paper) theme.

## Getting Started

```bash
npm install
npm run dev       # Start dev server at localhost:4321
npm run build     # Build for production
npm run preview   # Preview production build locally
```

## Adding a New Blog Post

1. Create a new `.md` file in `src/data/blog/`:

```md
---
author: Rocky G
pubDatetime: 2026-03-09T00:00:00Z
title: "Your Post Title"
featured: false
draft: false
tags:
  - your-tag
description: "A short description of your post."
---

Your content here in Markdown...
```

2. Set `draft: true` to hide a post from production.
3. Set `featured: true` to pin a post to the homepage.

## Adding Images

Store images in the organized folder structure:

```
src/assets/images/posts/
  2026-03/
    my-image.png
  2026-04/
    another-image.png
```

Reference them in your post:

```md
![Alt text](../../assets/images/posts/2026-03/my-image.png)
```

## Project Structure

```
src/
  config.ts          # Site config (title, author, URL, etc.)
  data/blog/         # Blog posts (.md files)
  assets/images/     # Images (organized by year/month in posts/)
  layouts/           # Page layouts
  pages/             # Astro pages & routes
  components/        # UI components
  styles/            # Global styles
public/              # Static assets (favicon, OG image, etc.)
vercel.json          # Vercel deployment config
```

## Deployment

This site is deployed to **GitHub Pages** with the custom domain `rocky.is-a.dev`.

`.github/workflows/deploy.yml` builds and deploys on every push to `main`. The subdomain is registered through [is-a.dev](https://github.com/is-a-dev/register) as a CNAME to `infinitethoughts7.github.io`.

## License

MIT

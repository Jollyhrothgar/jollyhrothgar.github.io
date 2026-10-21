# Introduction

Mike's personal website, mikebeaumier.com: a home page, a CV, projects, a blog, and a
consulting page.

## Stack

Astro static site, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to
`main` and weekly. The built site is plain HTML and CSS with no client-side JavaScript.

```bash
npm install
npm run dev      # local dev server; also shows drafts
npm run build    # writes dist/, without drafts
npm run check    # type check
```

- `src/pages/`: one file per page
- `src/layouts/Base.astro`: shared `<head>`, nav, and footer
- `src/styles/global.css`: site-wide styles, including `.page-header` and `.prose` (Markdown
  text). Page-specific styles live in each page's `<style>`.
- `src/content/blog/`: one post per `.md` or `.mdx` file, or per folder (`<slug>/index.md` with
  its images beside it, referenced as `./image.png`). Posts carry `tags` (display names); each
  tag gets a page at `/blog/tags/<slug>/`. A post can also belong to a `series` (posts meant to
  be read in order), which gets a page at `/blog/series/<slug>/` and adds "Part N of M" and
  previous/next links to each post. An optional `image` sets the post's share preview.
  `example-post.md` and `example-interactive.mdx` are draft templates. The "Bluegrass Book dev
  log" series came from bluegrassbook.com's old dev blog.
- `src/pages/rss.xml.ts`: the blog's RSS feed (description and link for each post)
- Sitemap: built by `@astrojs/sitemap` as `sitemap-index.xml`; `public/robots.txt` points to it
- Share previews: `Base.astro` sets the Open Graph tags. Pages without their own image use
  `public/og.png`, a 1200×630 card rendered once from HTML with headless Chrome.
- `src/components/sims/`: interactive components for MDX posts. `RandomWalk.astro` is the
  template: a canvas custom element that animates only while on screen.
- `src/content/projects/`: one Markdown file per project, with its `section` (see `SECTIONS` in
  `src/lib/content.ts`) and `links`. Text below the frontmatter becomes a write-up page at
  `/projects/<file name>/`.
- `src/assets/projects/<file name>.svg|png|jpg`: each project card's picture, made from
  something real in that repo (its data, its algorithm's output, its art). SVGs are 800×500 and
  inlined, so their text uses the site fonts.
- `src/content.config.ts`: the frontmatter each post and project must have
- `src/lib/content.ts`: post and project helpers
- `src/data/cv.json`: the public CV, exported from the private resume repo. Its format is
  specified in `docs/cv-json.md` and `docs/cv.schema.json`. Never add anything to it that isn't
  meant to be public.
- `public/`: copied as-is, including `CNAME`, images, and favicons

## Drafts

A post with `draft: true` appears only in `npm run dev`. The nav shows Blog only once a
published post exists.

## Style

Prefer simple, clear, modern design.

## List of Projects

The projects page is a curated list, not every public repo on
https://github.com/Jollyhrothgar/. Mike chose it in October 2026:

- Featured: Bluegrass Book (https://bluegrassbook.com)
- AI engineering: the arch, session, vault and write Claude Code plugins; Recursive Language Models;
  Data Takedown; Track Splitter
- Tools for life: Bluegrass Mic Plot, GitHub Fitness, Baby Tracker (public on purpose), Wood Cut, the equity tax
  calculator (`financial_calculator`), meshfix
- From the physics days: PhD research (`W_Analysis`, `UCR_Thesis_Template`, the thesis)

Left off on purpose: Banjo Tabinator and the TablEdit tools (Bluegrass Book does all of it), The
Passing Fancies (linked from the home page instead), the Lodi Fairgrounds prototype, and
mike_chronicles.

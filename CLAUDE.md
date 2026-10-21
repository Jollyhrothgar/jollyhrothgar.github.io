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
  tag gets a page at `/blog/tags/<slug>/`. `example-post.md` and `example-interactive.mdx` are
  draft templates. The "Bluegrass Book" posts came from bluegrassbook.com's old dev blog.
- `src/components/sims/`: interactive components for MDX posts. `RandomWalk.astro` is the
  template: a canvas custom element that animates only while on screen.
- `src/content/projects/`: one Markdown file per project. Text below the frontmatter becomes a
  write-up page at `/projects/<file name>/`.
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

`src/content/projects/` must always be kept up to date with the GitHub Pages sites Mike
maintains. His GitHub profile is https://github.com/Jollyhrothgar/.

- https://github.com/Jollyhrothgar/github-fitness
- https://github.com/Jollyhrothgar/Bluegrass-Songbook (live at https://bluegrassbook.com)
- https://github.com/Jollyhrothgar/The_Passing_Fancies
- https://github.com/Jollyhrothgar/wood_cut
- https://github.com/Jollyhrothgar/Banjo-Tabinator
- https://github.com/Jollyhrothgar/baby-tracker (public on purpose)

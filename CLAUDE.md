# Introduction

Mike's personal website, mikebeaumier.com. It is moving from a list of project links to a fuller
site: a CV, a project portfolio, a blog, and a landing page for consulting work.

## Stack

Astro static site, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to
`main`. The built site is plain HTML and CSS with no client-side JavaScript.

```bash
npm install
npm run dev      # local dev server
npm run build    # writes dist/
```

- `src/pages/`: one file per page
- `src/layouts/Base.astro`: shared `<head>` and page shell
- `src/styles/global.css`: site-wide styles. Page-specific styles live in each page's `<style>`.
- `src/data/projects.json`: the project list on the home page
- `src/data/cv.json`: the public CV, exported from the private resume repo. Its format is
  specified in `docs/cv-json.md` and `docs/cv.schema.json`. Never add anything to it that isn't
  meant to be public.
- `public/`: copied as-is, including `CNAME` and images

## Style

Prefer simple, clear, modern design.

## List of Projects

`src/data/projects.json` must always be kept up to date with the GitHub Pages sites Mike
maintains. His GitHub profile is https://github.com/Jollyhrothgar/.

- https://github.com/Jollyhrothgar/github-fitness
- https://github.com/Jollyhrothgar/Bluegrass-Songbook
- https://github.com/Jollyhrothgar/The_Passing_Fancies
- https://github.com/Jollyhrothgar/wood_cut
- https://github.com/Jollyhrothgar/Banjo-Tabinator
- https://github.com/Jollyhrothgar/baby-tracker (public on purpose)

# Share card

`public/og.png` is the image link previews show (LinkedIn, Slack, iMessage, X) for pages
without their own `image`: the favicon's inlay (`public/favicon.svg`) beside "Mike Beaumier" and
"AI Engineering and Data Science with a side of Bluegrass", white on black like the favicon.
Keep it bold: LinkedIn often shows it as a ~160px thumbnail.

Each section gets the same card with a label above it: Work History (`/cv/`), Writing
(`/blog/`, including posts without their own image), Project Portfolio (`/projects/`) and
Consulting (`/consulting/`), in `public/og/`. `Base.astro` picks the card by path.

`og.html` is the source, laid out at 1200×630 (1.91:1) and rendered at 2x, so 2400×1260;
`og.html?section=Writing` adds a label. It loads the site fonts from Google Fonts. To re-render
every card, from the repo root:

```bash
sh docs/og/render.sh
```

If the size changes, update the sizes in `src/layouts/Base.astro`. LinkedIn caches each card
for about a week: after deploying, re-scrape in https://www.linkedin.com/post-inspector/.

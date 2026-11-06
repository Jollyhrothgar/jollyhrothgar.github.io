# Share card

`public/og.png` is the image link previews show (LinkedIn, Slack, iMessage, X) for pages
without their own `image`: "Mike Beaumier" over two lines and "AI & Data Science" on the left,
and the favicon's inlay (`public/favicon.svg`) whole on the right, on off-black.

LinkedIn usually shows it as a ~160×84 thumbnail it scales itself, so a sharper source doesn't
help: only a few big elements survive. Check any change at that size
(`sips -z 84 160 public/og.png --out /tmp/thumb.png`).

Each section's card puts its name, in pearl, in place of "AI & Data Science": Work History
(`/cv/`), Writing (`/blog/`, including posts without their own image), Project Portfolio
(`/projects/`) and Consulting (`/consulting/`), in `public/og/`. `Base.astro` picks the card by
path, and adds a hash of the file to its URL so LinkedIn re-fetches a re-rendered card.

`og.html` is the source, laid out at 1200×630 (1.91:1) and rendered at 2x, so 2400×1260;
`og.html?section=Writing` renders a section's card. It loads the site fonts from Google Fonts. To re-render
every card, from the repo root:

```bash
sh docs/og/render.sh
```

If the size changes, update the sizes in `src/layouts/Base.astro`. LinkedIn caches each card
for about a week: after deploying, re-scrape in https://www.linkedin.com/post-inspector/.

# Share card

`public/og.png` is the image link previews show (LinkedIn, Slack, iMessage, X) for pages
without their own `image`: the favicon's inlay (`public/favicon.svg`) beside "Mike Beaumier",
"AI Engineer & Data Scientist" and the site's sections, white on black like the favicon. Keep it
bold: LinkedIn often shows it as a ~160px thumbnail.

`og.html` is the source, laid out at 1200×630 (1.91:1) and rendered at 2x, so 2400×1260. It
loads the site fonts from Google Fonts. To re-render, from the repo root:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=1200,630 --virtual-time-budget=5000 \
  --screenshot="$PWD/public/og.png" "file://$PWD/docs/og/og.html"
```

If the size changes, update the default in `src/layouts/Base.astro`. LinkedIn caches each card
for about a week: after deploying, re-scrape in https://www.linkedin.com/post-inspector/.

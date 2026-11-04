# Share card

`public/og.png` is the image link previews show (LinkedIn, Slack, iMessage, X) for pages
without their own `image`. It is the favicon's inlay (`public/favicon.svg`) centred on the site
background, kept bold and sparse because LinkedIn often shows it as a ~160px thumbnail.

`og.svg` is the source, 2400×1260 (1.91:1, rendered at 2x for sharpness). To re-render:

```bash
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
printf '<body style="margin:0"><img src="og.svg" width="1200" height="630" style="display:block">' > /tmp/og.html
cp docs/og/og.svg /tmp/ && "$CH" --headless --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=1200,630 --screenshot="$PWD/public/og.png" file:///tmp/og.html
```

If the size changes, update the default in `src/layouts/Base.astro`. LinkedIn caches each card
for about a week: after deploying, re-scrape in https://www.linkedin.com/post-inspector/.

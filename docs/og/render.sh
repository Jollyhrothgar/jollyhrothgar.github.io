#!/bin/sh
# Renders the share cards from og.html with headless Chrome: 1200×630 laid out, 2x, so 2400×1260.
# Run from the repo root: sh docs/og/render.sh
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
render() { # render <output> [section label]
  "$CHROME" --headless --hide-scrollbars --force-device-scale-factor=2 --window-size=1200,630 \
    --virtual-time-budget=5000 --screenshot="$PWD/$1" \
    "file://$PWD/docs/og/og.html?section=$(printf %s "$2" | sed 's/ /%20/g')" 2>/dev/null
}
mkdir -p public/og
render public/og.png
render public/og/cv.png 'Work History'
render public/og/blog.png 'Writing'
render public/og/projects.png 'Project Portfolio'
render public/og/consulting.png 'Consulting'

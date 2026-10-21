---
title: Example post
description: A draft that shows how a post is written and what Markdown renders as. It never appears on the live site.
date: 2026-10-21
tags: ["Meta"]
draft: true
---

This post is a draft, so it only appears when you run `npm run dev`. Copy this file to start a
new post: the file name becomes the URL, and the frontmatter above sets the title, the summary on
the blog index and the date. Remove `draft: true` (or set it to `false`) to publish.

## A section heading

Paragraphs are plain text. You can use **bold**, *italics*, [links](https://bluegrassbook.com) and
`inline code`.

- Lists work
- like this

> A blockquote, for when someone else said it better.

```python
def mean(xs: list[float]) -> float:
    return sum(xs) / len(xs)
```

### A smaller heading

Images go in `public/` and are referenced from the site root, like `![Alt text](/Mike.JPG)`.

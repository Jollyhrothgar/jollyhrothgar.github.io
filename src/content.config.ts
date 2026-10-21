import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown (.md) or MDX (.mdx) file per post in src/content/blog/. The file name is the URL:
// hello.md -> /blog/hello/. A post with images can be a folder: hello/index.md plus its images.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      // Display names, e.g. "Bluegrass Book". Each gets a page at /blog/tags/<slug>/
      tags: z.array(z.string()).default([]),
      // A run of posts meant to be read in order, e.g. "Bluegrass Book dev log". Each series
      // gets a page at /blog/series/<slug>/, and its posts show their part number.
      series: z.string().optional(),
      // The image shown when the post is shared, e.g. "./screenshot.png". Defaults to the site
      // card, public/og.png.
      image: image().optional(),
      // Drafts show up in `npm run dev` but are left out of the production build
      draft: z.boolean().default(false),
    }),
});

// One Markdown file per project in src/content/projects/. Anything written below the
// frontmatter becomes a write-up page at /projects/<file name>/. The card's picture is
// src/assets/projects/<file name>.svg, .png or .jpg.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Which part of the projects page the card goes in; see SECTIONS in src/lib/content.ts
    section: z.enum(['featured', 'ai', 'tools', 'physics']),
    // Lower numbers come first within a section
    order: z.number(),
    // The first link is the main one: the card's title links to it, unless there's a write-up
    links: z.array(z.object({ label: z.string(), url: z.string() })).min(1),
    // Alt text for a .png or .jpg picture. SVG pictures carry their own.
    imageAlt: z.string().optional(),
  }),
});

export const collections = { blog, projects };

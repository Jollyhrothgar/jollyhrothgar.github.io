import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per post in src/content/blog/. The file name is the URL: hello.md -> /blog/hello/
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    // Drafts show up in `npm run dev` but are left out of the production build
    draft: z.boolean().default(false),
  }),
});

// One Markdown file per project in src/content/projects/. Anything written below the
// frontmatter becomes a write-up page at /projects/<file name>/.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.url(),
    repo: z.url().optional(),
    // Lower numbers come first
    order: z.number(),
  }),
});

export const collections = { blog, projects };

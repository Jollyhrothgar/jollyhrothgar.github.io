import { getCollection, type CollectionEntry } from 'astro:content';

// Newest first. Drafts are included in dev only.
export async function getPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', (post) => import.meta.env.DEV || !post.data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export interface Tag {
  name: string;
  slug: string;
  count: number;
}

// "Bluegrass Book" -> "bluegrass-book"
export function tagSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function tagUrl(name: string): string {
  return `/blog/tags/${tagSlug(name)}/`;
}

// Every tag used by the given posts, most-used first
export function getTags(posts: CollectionEntry<'blog'>[]): Tag[] {
  const tags = new Map<string, Tag>();
  for (const post of posts) {
    for (const name of post.data.tags) {
      const slug = tagSlug(name);
      const tag = tags.get(slug) ?? { name, slug, count: 0 };
      tag.count += 1;
      tags.set(slug, tag);
    }
  }
  return [...tags.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order);
}

// Whether a project has a write-up below its frontmatter
export function hasWriteUp(project: CollectionEntry<'projects'>): boolean {
  return Boolean(project.body?.trim());
}

// "October 21, 2026". Frontmatter dates are midnight UTC, so format in UTC.
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

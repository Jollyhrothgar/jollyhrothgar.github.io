import { getCollection, type CollectionEntry } from 'astro:content';

// Set to true once the consulting offer is decided. Until then the page is built only by
// `npm run dev` and stays out of the production nav.
export const CONSULTING_READY = false;

export const showConsulting = CONSULTING_READY || import.meta.env.DEV;

// Newest first. Drafts are included in dev only.
export async function getPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', (post) => import.meta.env.DEV || !post.data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
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

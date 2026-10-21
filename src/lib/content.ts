import { getCollection, type CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'blog'>;

// Oldest first. Posts on the same date are ordered by file name.
function byDate(a: Post, b: Post): number {
  return a.data.date.valueOf() - b.data.date.valueOf() || a.id.localeCompare(b.id);
}

// Newest first. Drafts are included in dev only.
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', (post) => import.meta.env.DEV || !post.data.draft);
  return posts.sort((a, b) => byDate(b, a));
}

// "Bluegrass Book" -> "bluegrass-book"
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// A tag or a series, with how many posts it has
export interface Group {
  name: string;
  slug: string;
  count: number;
}

function countGroups(names: string[]): Group[] {
  const groups = new Map<string, Group>();
  for (const name of names) {
    const slug = slugify(name);
    const group = groups.get(slug) ?? { name, slug, count: 0 };
    group.count += 1;
    groups.set(slug, group);
  }
  return [...groups.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function tagUrl(name: string): string {
  return `/blog/tags/${slugify(name)}/`;
}

// Every tag used by the given posts, most-used first
export function getTags(posts: Post[]): Group[] {
  return countGroups(posts.flatMap((post) => post.data.tags));
}

export function seriesUrl(name: string): string {
  return `/blog/series/${slugify(name)}/`;
}

// Every series in the given posts, longest first
export function getSeries(posts: Post[]): Group[] {
  return countGroups(posts.flatMap((post) => post.data.series ?? []));
}

// A series' posts in reading order, oldest first
export function getSeriesPosts(posts: Post[], slug: string): Post[] {
  return posts.filter((post) => post.data.series && slugify(post.data.series) === slug).sort(byDate);
}

export interface SeriesPosition {
  name: string;
  url: string;
  part: number;
  total: number;
  prev?: Post;
  next?: Post;
}

// Where a post sits in its series, or undefined if it isn't in one
export function seriesPosition(post: Post, posts: Post[]): SeriesPosition | undefined {
  const name = post.data.series;
  if (!name) return undefined;
  const series = getSeriesPosts(posts, slugify(name));
  const index = series.findIndex((p) => p.id === post.id);
  return {
    name,
    url: seriesUrl(name),
    part: index + 1,
    total: series.length,
    prev: series[index - 1],
    next: series[index + 1],
  };
}

// The projects page's sections, in page order. Wide sections show each card with its picture
// beside the text rather than above it.
export const SECTIONS = [
  { id: 'featured', title: undefined, wide: true },
  { id: 'ai', title: 'AI engineering', wide: false },
  { id: 'tools', title: 'Tools for life', wide: false },
  { id: 'physics', title: 'From the physics days', wide: true },
] as const;

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

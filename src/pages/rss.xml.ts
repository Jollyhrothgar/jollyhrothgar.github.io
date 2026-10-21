import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/content';

// The blog's feed, for feed readers and newsletter tools. Items carry the description and a link
// rather than the full post, so readers come to the site to read it.
export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: 'Mike Beaumier',
    description: 'Writing by Mike Beaumier.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.series ? `${post.data.series}: ${post.data.title}` : post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
  });
}

import { getSortedPostsData, getPostsByAuthor } from "@/lib/posts";
import { PostMetadata } from "@/types";

export interface AuthorSummary {
  name: string;
  slug: string;
  postCount: number;
  // No bio data is available in the static build; these remain optional.
  bio?: string;
  x_link?: string;
  fb_link?: string;
  insta_link?: string;
  pfp_link?: string;
}

export interface AuthorWithPosts extends AuthorSummary {
  posts: PostMetadata[];
}

/**
 * Derive the list of authors from the posts' frontmatter.
 * The author `slug` is the author name itself, which is what
 * `getPostsByAuthor` filters on and what the `[author]` route uses.
 */
export async function getAllAuthors(): Promise<AuthorSummary[]> {
  const posts = await getSortedPostsData();

  const counts = new Map<string, number>();
  for (const post of posts) {
    if (!post.author) continue;
    counts.set(post.author, (counts.get(post.author) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, postCount]) => ({
      name,
      slug: name,
      postCount,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getAuthor(
  name: string,
): Promise<AuthorWithPosts | null> {
  const posts = await getPostsByAuthor(name);
  if (posts.length === 0) {
    return null;
  }

  return {
    name,
    slug: name,
    postCount: posts.length,
    posts,
  };
}

import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { getPost } from '../api';
import { useAsync } from '../lib/useAsync';
import CommentSection from '../components/CommentSection';

export default function PostPage() {
  const { slug = '' } = useParams();
  const { data: post, loading, error } = useAsync(() => getPost(slug), [slug]);

  if (loading) return <p className="text-primary-500">Loading…</p>;
  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold">Post not found</h1>
        <p className="text-primary-700">
          That post doesn&apos;t exist. <Link to="/posts">Browse the archive</Link>.
        </p>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl">
      {post.coverImage && (
        <div className="mb-8 h-72 w-full overflow-hidden rounded-md">
          <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}

      <h1 className="mb-3 text-3xl font-bold md:text-4xl">{post.title}</h1>

      <div className="mb-6 flex flex-wrap items-center text-sm text-primary-500">
        <Link to={`/authors/${encodeURIComponent(post.author)}`}>{post.author}</Link>
        <span className="mx-2">•</span>
        <time dateTime={post.date}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
      </div>

      <div className="blog-post" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

      {post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2 border-t border-primary-200 pt-6">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/tags/${encodeURIComponent(tag)}`}
              className="rounded-md bg-primary-100 px-2 py-1 text-sm text-primary-600 no-underline hover:bg-primary-200"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      <CommentSection postId={post.slug} />
    </article>
  );
}

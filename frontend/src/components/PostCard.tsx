import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import type { PostSummary } from '../types';

export default function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="card transition-shadow duration-200 hover:shadow-md">
      {post.coverImage && (
        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md">
          <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}
      <h2 className="mb-2 text-xl font-bold">
        <Link to={`/posts/${post.slug}`} className="hover:text-accent-dark">{post.title}</Link>
      </h2>
      <div className="mb-2 flex items-center text-sm text-primary-500">
        <span>{post.author}</span>
        <span className="mx-2">•</span>
        <time dateTime={post.date}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
      </div>
      <p className="mb-4 text-primary-600">{post.excerpt}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            to={`/tags/${encodeURIComponent(tag)}`}
            className="rounded-md bg-primary-100 px-2 py-1 text-xs text-primary-600 no-underline hover:bg-primary-200"
          >
            {tag}
          </Link>
        ))}
      </div>
      <Link to={`/posts/${post.slug}`} className="inline-flex items-center text-accent-dark hover:text-accent">
        Read more
        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </article>
  );
}

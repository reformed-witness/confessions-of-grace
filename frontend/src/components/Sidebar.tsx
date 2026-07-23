import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import type { PostSummary, TagCount } from '../types';
import SubscribeForm from './SubscribeForm';

interface Props {
  recentPosts: PostSummary[];
  tags: TagCount[];
}

export default function Sidebar({ recentPosts, tags }: Props) {
  return (
    <aside className="flex flex-col gap-8">
      <div className="card">
        <h3 className="mb-4 border-b border-primary-200 pb-2 text-xl font-bold">Recent Posts</h3>
        <ul className="space-y-3">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link to={`/posts/${post.slug}`} className="hover:text-accent">{post.title}</Link>
              <div className="text-sm text-primary-500">
                {format(new Date(post.date), 'MMMM d, yyyy')}
              </div>
            </li>
          ))}
          {recentPosts.length === 0 && <li className="text-primary-500">No posts yet.</li>}
        </ul>
      </div>

      <div className="card">
        <h3 className="mb-4 border-b border-primary-200 pb-2 text-xl font-bold">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Link
              key={t.tag}
              to={`/tags/${encodeURIComponent(t.tag)}`}
              className="rounded-md bg-primary-100 px-2 py-1 text-sm text-primary-600 no-underline hover:bg-primary-200"
            >
              {t.tag} <span className="text-primary-400">({t.count})</span>
            </Link>
          ))}
          {tags.length === 0 && <span className="text-primary-500">No tags yet.</span>}
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4 border-b border-primary-200 pb-2 text-xl font-bold">Subscribe</h3>
        <p className="mb-4 text-primary-600">Stay updated with the latest posts.</p>
        <SubscribeForm />
      </div>
    </aside>
  );
}

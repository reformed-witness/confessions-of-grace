import { Link, useParams } from 'react-router-dom';
import { getPosts } from '../api';
import { useAsync } from '../lib/useAsync';
import PostCard from '../components/PostCard';

export default function TagPage() {
  const { tag = '' } = useParams();
  const { data: posts, loading } = useAsync(() => getPosts({ tag }), [tag]);
  const list = posts ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-2 text-3xl font-bold md:text-4xl">
        Tagged &ldquo;{tag}&rdquo;
      </h1>
      <p className="mb-10 text-primary-600">
        {list.length} {list.length === 1 ? 'post' : 'posts'} · <Link to="/tags">all tags</Link>
      </p>
      {loading && <p className="text-primary-500">Loading…</p>}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {list.map((post) => <PostCard key={post.slug} post={post} />)}
      </div>
      {!loading && list.length === 0 && <p className="text-primary-500">Nothing tagged with that yet.</p>}
    </div>
  );
}

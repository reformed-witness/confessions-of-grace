import { getPosts } from '../api';
import { useAsync } from '../lib/useAsync';
import PostCard from '../components/PostCard';

export default function PostsPage() {
  const { data: posts, loading } = useAsync(() => getPosts(), []);
  const list = posts ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl">Archive</h1>
      <p className="mb-10 text-lg text-primary-700">Every post, newest first.</p>
      {loading && <p className="text-primary-500">Loading…</p>}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {list.map((post) => <PostCard key={post.slug} post={post} />)}
      </div>
      {!loading && list.length === 0 && <p className="text-primary-500">No posts yet.</p>}
    </div>
  );
}

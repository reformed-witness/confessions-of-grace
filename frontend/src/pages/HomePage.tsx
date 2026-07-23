import { Link } from 'react-router-dom';
import { getHome } from '../api';
import { useAsync } from '../lib/useAsync';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';

export default function HomePage() {
  // One call. Which post leads, what counts as recent, and the tag counts are all decided by the
  // backend — this page used to take element zero of the post list and call it "the latest".
  const { data, loading } = useAsync(() => getHome(), []);
  const featured = data?.featured ?? null;

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <main className="md:w-2/3">
        {featured && (
          <div className="mb-12">
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
              <div className="md:flex">
                <div className="relative h-64 w-full bg-accent md:h-auto md:w-1/3 md:shrink-0">
                  {featured.coverImage ? (
                    <img src={featured.coverImage} alt={featured.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-accent text-6xl font-bold text-white">
                      CG
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="text-sm font-semibold uppercase tracking-wide text-accent">Latest Post</div>
                  <Link
                    to={`/posts/${featured.slug}`}
                    className="mt-1 block text-2xl font-bold leading-tight text-primary-900 hover:text-accent-dark"
                  >
                    {featured.title}
                  </Link>
                  <p className="mt-2 text-primary-600">{featured.excerpt}</p>
                  <div className="mt-4">
                    <Link to={`/posts/${featured.slug}`} className="inline-flex items-center text-accent-dark hover:text-accent">
                      Read more
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="mb-6 border-b border-primary-200 pb-2 text-2xl font-bold">Recent Posts</h2>
          {loading && <p className="text-primary-500">Loading…</p>}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {(data?.posts ?? []).map((post) => <PostCard key={post.slug} post={post} />)}
          </div>
          {!loading && !featured && <p className="text-primary-500">No posts yet.</p>}
        </div>

        <div className="mt-12 text-center">
          <Link to="/posts" className="button">View All Posts</Link>
        </div>
      </main>

      <div className="md:w-1/3">
        <Sidebar recentPosts={data?.recent ?? []} tags={data?.tags ?? []} />
      </div>
    </div>
  );
}

import { Link, useParams } from 'react-router-dom';
import { getAuthor } from '../api';
import { useAsync } from '../lib/useAsync';
import PostCard from '../components/PostCard';

export default function AuthorPage() {
  const { name = '' } = useParams();
  const { data: author, loading, error } = useAsync(() => getAuthor(name), [name]);

  if (loading) return <p className="text-primary-500">Loading…</p>;
  if (error || !author) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold">Author not found</h1>
        <p className="text-primary-700"><Link to="/authors">See all authors</Link>.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="card mb-10">
        <div className="flex items-center gap-6">
          {author.pfpLink && (
            <img src={author.pfpLink} alt={author.name} className="h-24 w-24 rounded-full object-cover" />
          )}
          <div>
            <h1 className="mb-1 text-3xl font-bold">{author.name}</h1>
            <p className="text-primary-500">
              {author.postCount} {author.postCount === 1 ? 'post' : 'posts'}
            </p>
          </div>
        </div>
        {author.bio && <p className="mt-6 text-primary-700">{author.bio}</p>}
        <div className="mt-4 flex gap-4">
          {author.xLink && <a href={author.xLink} target="_blank" rel="noreferrer">X</a>}
          {author.fbLink && <a href={author.fbLink} target="_blank" rel="noreferrer">Facebook</a>}
          {author.instaLink && <a href={author.instaLink} target="_blank" rel="noreferrer">Instagram</a>}
        </div>
      </div>

      <h2 className="mb-6 border-b border-primary-200 pb-2 text-2xl font-bold">Posts</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {author.posts.map((post) => <PostCard key={post.slug} post={post} />)}
      </div>
    </div>
  );
}

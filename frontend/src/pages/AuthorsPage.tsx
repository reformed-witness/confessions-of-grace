import { Link } from 'react-router-dom';
import { getAuthors } from '../api';
import { useAsync } from '../lib/useAsync';

export default function AuthorsPage() {
  const { data: authors, loading } = useAsync(() => getAuthors(), []);
  const list = authors ?? [];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl">Authors</h1>
      {loading && <p className="text-primary-500">Loading…</p>}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {list.map((a) => (
          <div key={a.name} className="card">
            <div className="flex items-center gap-4">
              {a.pfpLink && <img src={a.pfpLink} alt={a.name} className="h-16 w-16 rounded-full object-cover" />}
              <div>
                <h2 className="mb-1 text-xl font-bold">
                  <Link to={`/authors/${encodeURIComponent(a.name)}`} className="hover:text-accent-dark">{a.name}</Link>
                </h2>
                <p className="text-sm text-primary-500">
                  {a.postCount} {a.postCount === 1 ? 'post' : 'posts'}
                </p>
              </div>
            </div>
            {a.bio && <p className="mt-4 text-primary-700">{a.bio}</p>}
          </div>
        ))}
      </div>
      {!loading && list.length === 0 && <p className="text-primary-500">No authors yet.</p>}
    </div>
  );
}

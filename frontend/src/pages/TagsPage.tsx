import { Link } from 'react-router-dom';
import { getTags } from '../api';
import { useAsync } from '../lib/useAsync';

export default function TagsPage() {
  const { data: tags, loading } = useAsync(() => getTags(), []);
  const list = tags ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl">Tags</h1>
      {loading && <p className="text-primary-500">Loading…</p>}
      <div className="flex flex-wrap gap-3">
        {list.map((t) => (
          <Link
            key={t.tag}
            to={`/tags/${encodeURIComponent(t.tag)}`}
            className="rounded-md bg-primary-100 px-3 py-2 text-primary-600 no-underline hover:bg-primary-200"
          >
            {t.tag} <span className="text-primary-400">({t.count})</span>
          </Link>
        ))}
      </div>
      {!loading && list.length === 0 && <p className="text-primary-500">No tags yet.</p>}
    </div>
  );
}

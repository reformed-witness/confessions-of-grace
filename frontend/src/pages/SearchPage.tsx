import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPosts } from '../api';
import { useAsync } from '../lib/useAsync';
import PostCard from '../components/PostCard';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [term, setTerm] = useState(q);
  const { data: posts, loading } = useAsync(() => getPosts(), []);

  const needle = q.trim().toLowerCase();
  const results = (posts ?? []).filter((p) =>
    !needle
    || p.title.toLowerCase().includes(needle)
    || p.excerpt.toLowerCase().includes(needle)
    || p.author.toLowerCase().includes(needle)
    || p.tags.some((t) => t.toLowerCase().includes(needle)));

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl">Search</h1>
      <form
        className="mb-10 flex gap-3"
        onSubmit={(e) => { e.preventDefault(); setParams(term.trim() ? { q: term.trim() } : {}); }}
      >
        <input
          className="field"
          placeholder="Search posts…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          aria-label="Search posts"
        />
        <button type="submit" className="button">Search</button>
      </form>

      {loading && <p className="text-primary-500">Loading…</p>}
      {!loading && needle && (
        <p className="mb-6 text-primary-600">
          {results.length} {results.length === 1 ? 'result' : 'results'} for &ldquo;{q}&rdquo;
        </p>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {results.map((post) => <PostCard key={post.slug} post={post} />)}
      </div>
    </div>
  );
}

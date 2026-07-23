import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../lib/auth';
import { useAsync } from '../../lib/useAsync';
import {
  adminDeleteComment, adminDeletePost, adminListComments, adminListPosts, adminListSubscribers,
} from '../../api';
import { cn } from '../../lib/utils';

type Tab = 'posts' | 'comments' | 'subscribers';

export default function AdminPage() {
  const { me, loading } = useAuth();
  const [tab, setTab] = useState<Tab>('posts');
  const [reload, setReload] = useState(0);
  const isAdmin = !!me?.admin;

  // Only call the admin API when signed in — otherwise a 401 would bounce us straight to the IdP.
  const { data: posts } = useAsync(() => (isAdmin ? adminListPosts() : Promise.resolve([])), [isAdmin, reload]);
  const { data: comments } = useAsync(() => (isAdmin ? adminListComments() : Promise.resolve([])), [isAdmin, reload]);
  const { data: subscribers } = useAsync(() => (isAdmin ? adminListSubscribers() : Promise.resolve([])), [isAdmin, reload]);

  if (loading) return <p className="text-primary-500">Loading…</p>;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="mb-4 text-3xl font-bold">Admin</h1>
        <p className="mb-8 text-primary-700">Sign in to manage posts, comments and subscribers.</p>
        <a href="/oauth2/authorization/authentik" className="button">Sign in</a>
      </div>
    );
  }

  async function removePost(slug: string) {
    if (!confirm(`Delete the post "${slug}"? This cannot be undone.`)) return;
    await adminDeletePost(slug);
    setReload((r) => r + 1);
  }

  async function removeComment(id: number) {
    if (!confirm('Delete this comment?')) return;
    await adminDeleteComment(id);
    setReload((r) => r + 1);
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'posts', label: 'Posts', count: posts?.length ?? 0 },
    { id: 'comments', label: 'Comments', count: comments?.length ?? 0 },
    { id: 'subscribers', label: 'Subscribers', count: subscribers?.length ?? 0 },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="mb-0 text-3xl font-bold md:text-4xl">Admin</h1>
        <Link to="/admin/posts/new" className="button">New post</Link>
      </div>

      <nav className="mb-8 flex flex-wrap gap-2 border-b border-primary-200 pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              tab === t.id ? 'bg-accent text-white' : 'text-primary-600 hover:bg-primary-100',
            )}
          >
            {t.label} <span className="opacity-70">({t.count})</span>
          </button>
        ))}
      </nav>

      {tab === 'posts' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-primary-200 text-primary-500">
              <tr>
                <th className="py-2">Title</th>
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {(posts ?? []).map((p) => (
                <tr key={p.slug} className="border-b border-primary-100 last:border-0">
                  <td className="py-3">
                    <div className="font-semibold text-primary-800">{p.title}</div>
                    <div className="text-xs text-primary-500">/{p.slug}</div>
                  </td>
                  <td className="py-3 text-primary-600">{p.date}</td>
                  <td className="py-3">
                    <span className={cn('rounded-md px-2 py-1 text-xs',
                      p.published ? 'bg-accent-light text-accent-dark' : 'bg-primary-100 text-primary-600')}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <Link to={`/admin/posts/${encodeURIComponent(p.slug)}/edit`} className="mr-4">Edit</Link>
                    <button onClick={() => removePost(p.slug)} className="text-red-700 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
              {(posts ?? []).length === 0 && (
                <tr><td colSpan={4} className="py-6 text-primary-500">No posts yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'comments' && (
        <div className="flex flex-col gap-4">
          {(comments ?? []).map((c) => (
            <div key={c.id} className="card">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-primary-500">
                <span className="font-semibold text-primary-700">{c.name}</span>
                <span>&lt;{c.email}&gt;</span>
                <span>·</span>
                <Link to={`/posts/${encodeURIComponent(c.postSlug)}`}>/{c.postSlug}</Link>
                {c.createdAt && <><span>·</span><span>{format(new Date(c.createdAt), 'MMMM d, yyyy')}</span></>}
                <button onClick={() => removeComment(c.id)} className="ml-auto text-red-700 hover:text-red-900">
                  Delete
                </button>
              </div>
              <p className="whitespace-pre-line text-primary-700">{c.body}</p>
            </div>
          ))}
          {(comments ?? []).length === 0 && <p className="text-primary-500">No comments yet.</p>}
        </div>
      )}

      {tab === 'subscribers' && (
        <div className="card">
          <ul className="space-y-1">
            {(subscribers ?? []).map((email) => (
              <li key={email} className="text-primary-700">{email}</li>
            ))}
          </ul>
          {(subscribers ?? []).length === 0 && <p className="text-primary-500">No subscribers yet.</p>}
        </div>
      )}
    </div>
  );
}

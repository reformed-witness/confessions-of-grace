import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { adminCreatePost, adminGetPost, adminUpdatePost, adminUploadImage } from '../../api';
import type { PostInput } from '../../api';

const today = () => new Date().toISOString().split('T')[0];

const EMPTY: PostInput = {
  slug: '', title: '', date: today(), excerpt: '', author: '',
  tags: [], coverImage: null, content: '', published: false,
};

export default function PostEditorPage() {
  const { slug } = useParams();
  const editing = Boolean(slug);
  const navigate = useNavigate();
  const { me, loading: authLoading } = useAuth();
  const isAdmin = !!me?.admin;

  const [form, setForm] = useState<PostInput>(EMPTY);
  const [tagsText, setTagsText] = useState('');
  const [loading, setLoading] = useState(editing);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editing || !isAdmin || !slug) return;
    adminGetPost(slug)
        .then((p) => {
          setForm({
            slug: p.slug, title: p.title, date: p.date, excerpt: p.excerpt, author: p.author,
            tags: p.tags, coverImage: p.coverImage, content: p.content, published: p.published,
          });
          setTagsText(p.tags.join(', '));
        })
        .catch((e) => setError(String(e)))
        .finally(() => setLoading(false));
  }, [editing, isAdmin, slug]);

  if (authLoading) return <p className="text-primary-500">Loading…</p>;
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="mb-4 text-3xl font-bold">Admin</h1>
        <a href="/oauth2/authorization/authentik" className="button">Sign in</a>
      </div>
    );
  }
  if (loading) return <p className="text-primary-500">Loading post…</p>;

  const set = <K extends keyof PostInput>(key: K, value: PostInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function onImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setError(null);
    try {
      set('coverImage', await adminUploadImage(file));
    } catch (x) {
      setError(String(x));
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    const payload: PostInput = {
      ...form,
      tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editing && slug) await adminUpdatePost(slug, payload);
      else await adminCreatePost(payload);
      navigate('/admin');
    } catch (x) {
      setError(String(x));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="mb-0 text-3xl font-bold">{editing ? 'Edit post' : 'New post'}</h1>
        <Link to="/admin">Back to admin</Link>
      </div>

      <form onSubmit={onSubmit} className="card space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-primary-700">Title</span>
            <input className="field" value={form.title} onChange={(e) => set('title', e.target.value)} required />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-primary-700">Slug (URL)</span>
            <input className="field" value={form.slug} onChange={(e) => set('slug', e.target.value)}
                   disabled={editing} required placeholder="a-certain-sound" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-primary-700">Date</span>
            <input className="field" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-primary-700">Author</span>
            <input className="field" value={form.author} onChange={(e) => set('author', e.target.value)} />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-primary-700">Excerpt</span>
          <textarea className="field min-h-20" value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-primary-700">Tags (comma separated)</span>
          <input className="field" value={tagsText} onChange={(e) => setTagsText(e.target.value)}
                 placeholder="grace, calvinism" />
        </label>

        <div>
          <span className="mb-1 block text-sm font-semibold text-primary-700">Cover image</span>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex h-10 cursor-pointer items-center rounded-md border border-primary-300 bg-white px-4 text-sm hover:bg-primary-100">
              Upload image
              <input hidden type="file" accept="image/*" onChange={onImage} disabled={busy} />
            </label>
            <input className="field flex-1" value={form.coverImage ?? ''}
                   onChange={(e) => set('coverImage', e.target.value || null)}
                   placeholder="/images/example.jpg or an uploaded URL" />
          </div>
          {form.coverImage && (
            <img src={form.coverImage} alt="cover preview" className="mt-3 h-40 rounded-md object-cover" />
          )}
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-primary-700">Content (markdown)</span>
          <textarea className="field min-h-96 font-mono text-sm" value={form.content}
                    onChange={(e) => set('content', e.target.value)} />
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} />
          <span className="text-sm font-semibold text-primary-700">Published</span>
        </label>

        <div className="flex items-center gap-4">
          <button type="submit" className="button" disabled={busy}>
            {busy ? 'Saving…' : editing ? 'Save changes' : 'Create post'}
          </button>
          {error && <span className="text-sm text-red-700">{error}</span>}
        </div>
      </form>
    </div>
  );
}

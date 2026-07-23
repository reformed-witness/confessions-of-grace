import { useState } from 'react';
import type { FormEvent } from 'react';
import { format } from 'date-fns';
import { getComments, postComment } from '../api';
import { useAsync } from '../lib/useAsync';

export default function CommentSection({ postId }: { postId: string }) {
  const [reloadKey, setReloadKey] = useState(0);
  const { data: comments, loading } = useAsync(() => getComments(postId), [postId, reloadKey]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'error'>('idle');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !comment.trim()) return;
    setState('busy');
    try {
      await postComment({ postId, name: name.trim(), email: email.trim(), comment: comment.trim() });
      setName(''); setEmail(''); setComment('');
      setState('idle');
      setReloadKey((k) => k + 1);
    } catch {
      setState('error');
    }
  }

  const list = comments ?? [];

  return (
    <section className="mt-12">
      <h2 className="mb-6 border-b border-primary-200 pb-2 text-2xl font-bold">
        {list.length === 1 ? '1 Comment' : `${list.length} Comments`}
      </h2>

      {loading && <p className="text-primary-500">Loading comments…</p>}

      <ul className="mb-10 space-y-4">
        {list.map((c) => (
          <li key={c.id} className="card">
            <div className="mb-1 flex items-center text-sm text-primary-500">
              <span className="font-semibold text-primary-700">{c.name}</span>
              {c.createdAt && (
                <>
                  <span className="mx-2">•</span>
                  <time dateTime={c.createdAt}>{format(new Date(c.createdAt), 'MMMM d, yyyy')}</time>
                </>
              )}
            </div>
            <p className="whitespace-pre-line text-primary-700">{c.body}</p>
          </li>
        ))}
        {!loading && list.length === 0 && (
          <li className="text-primary-500">No comments yet — be the first to share a thought.</li>
        )}
      </ul>

      <div className="card">
        <h3 className="mb-4 text-xl font-bold">Leave a comment</h3>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input className="field" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="field" type="email" placeholder="Email (not published)" value={email}
                   onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <textarea className="field min-h-32" placeholder="Your comment" value={comment}
                    onChange={(e) => setComment(e.target.value)} required />
          <button type="submit" className="button" disabled={state === 'busy'}>
            {state === 'busy' ? 'Posting…' : 'Post Comment'}
          </button>
          {state === 'error' && <p className="text-sm text-red-700">Something went wrong. Please try again.</p>}
        </form>
      </div>
    </section>
  );
}

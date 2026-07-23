import { useState } from 'react';
import { useAsync } from '../lib/useAsync';
import { cn } from '../lib/utils';

interface Chapter {
  title: string;
  paragraphs: Record<string, string>;
}
interface Confession {
  title: string;
  chapters: Record<string, Chapter>;
}

// Served from public/ rather than bundled — it's a large static document.
const loadConfession = async (): Promise<Confession> => {
  const res = await fetch('/data/1689-confession.json');
  if (!res.ok) throw new Error('could not load the confession');
  return res.json();
};

export default function ConfessionPage() {
  const { data, loading, error } = useAsync(loadConfession, []);
  const [selected, setSelected] = useState<string | null>(null);

  if (loading) return <p className="text-primary-500">Loading the confession…</p>;
  if (error || !data) return <p className="text-primary-700">The confession could not be loaded.</p>;

  const numbers = Object.keys(data.chapters).sort((a, b) => Number(a) - Number(b));
  const current = selected ?? numbers[0];
  const chapter = data.chapters[current];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl">{data.title}</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        <nav className="md:w-1/3">
          <div className="card max-h-[70vh] overflow-y-auto">
            <h2 className="mb-4 border-b border-primary-200 pb-2 text-xl font-bold">Chapters</h2>
            <ol className="space-y-2">
              {numbers.map((n) => (
                <li key={n}>
                  <button
                    type="button"
                    onClick={() => setSelected(n)}
                    className={cn(
                      'w-full text-left text-sm transition-colors',
                      current === n ? 'font-bold text-accent-dark' : 'text-primary-700 hover:text-accent-dark',
                    )}
                  >
                    {n}. {data.chapters[n].title}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="md:w-2/3">
          <div className="card">
            <h2 className="mb-6 border-b border-primary-200 pb-2 text-2xl font-bold">
              Chapter {current} — {chapter.title}
            </h2>
            <ol className="space-y-5">
              {Object.keys(chapter.paragraphs)
                .sort((a, b) => Number(a) - Number(b))
                .map((p) => (
                  <li key={p} className="leading-relaxed text-primary-700">
                    <span className="mr-2 font-bold text-accent-dark">{p}.</span>
                    {chapter.paragraphs[p]}
                  </li>
                ))}
            </ol>
          </div>
        </article>
      </div>
    </div>
  );
}

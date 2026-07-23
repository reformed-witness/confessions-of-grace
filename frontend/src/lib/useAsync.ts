import { useEffect, useState } from 'react';

/** Minimal data-loading helper: runs `fn` on mount / when `deps` change. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fn()
        .then((d) => { if (alive) { setData(d); setLoading(false); } })
        .catch((e) => { if (alive) { setError(String(e)); setLoading(false); } });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

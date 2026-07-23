// Shared HTTP core (canonical copy: platform/frontend-template/src/lib/http.ts). Same-origin fetch to
// /api, CSRF from the XSRF-TOKEN cookie, and 401 -> Authentik login redirect (only admin routes are gated).

export interface HttpOptions {
  loginUrl?: string;
  base?: string;
}

function csrfHeader(): Record<string, string> {
  const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return m ? { 'X-XSRF-TOKEN': decodeURIComponent(m[1]) } : {};
}

export function createApi(opts: HttpOptions = {}) {
  const loginUrl = opts.loginUrl ?? '/oauth2/authorization/authentik';
  const base = opts.base ?? '/api';

  async function req<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(base + path, {
      ...init,
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', ...csrfHeader(), ...(init?.headers ?? {}) },
    });
    if (res.status === 401) {
      window.location.href = loginUrl;
      throw new Error('unauthenticated');
    }
    if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} failed: ${res.status}`);
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    return (text ? JSON.parse(text) : null) as T;
  }

  return {
    get: <T>(path: string) => req<T>(path),
    post: <T>(path: string, body?: unknown) =>
      req<T>(path, { method: 'POST', body: body != null ? JSON.stringify(body) : undefined }),
    put: <T>(path: string, body?: unknown) =>
      req<T>(path, { method: 'PUT', body: body != null ? JSON.stringify(body) : undefined }),
    del: <T>(path: string) => req<T>(path, { method: 'DELETE' }),
    login(): void {
      window.location.href = loginUrl;
    },
    logout(): void {
      // Full-page form POST so the browser follows the RP-initiated logout redirect chain.
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/logout';
      document.body.appendChild(form);
      form.submit();
    },
  };
}

export type Api = ReturnType<typeof createApi>;

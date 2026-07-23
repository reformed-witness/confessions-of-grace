import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getMe } from '../api';
import type { MeInfo } from '../types';

interface AuthState {
  me: MeInfo | null;
  loading: boolean;
  refresh: () => void;
}

const AuthContext = createContext<AuthState>({ me: null, loading: true, refresh: () => {} });

/** This is a public site — /api/me is open and simply reports whether an admin is signed in. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<MeInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    getMe().then(setMe).catch(() => setMe(null)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return <AuthContext.Provider value={{ me, loading, refresh }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}

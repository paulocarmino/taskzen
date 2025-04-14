import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import api from '../api';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  role: 'USER' | 'ADMIN';
  exp: number;
}

export function useRestoreSession() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setStatus = useAuthStore((s) => s.setStatus);
  const isRestored = useAuthStore((s) => s.isRestored);
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current || isRestored) return;
    didRun.current = true;

    const checkRefresh = async () => {
      setStatus('checking');

      try {
        const res = await api.post('/auth/token/refresh', {}, { withCredentials: true });
        const token = res.data.accessToken;
        const decoded: JwtPayload = jwtDecode(token);

        const me = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAuth(token, {
          id: decoded.sub,
          role: decoded.role,
          name: me.data.name,
          email: me.data.email,
        });

        useAuthStore.getState().setRestored();
      } catch {
        setStatus('unauthenticated');
      }
    };

    checkRefresh();
  }, [setAuth, setStatus, isRestored]);
}

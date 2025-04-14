import api from './api';
import { useAuthStore } from './stores/useAuthStore';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  role: 'USER' | 'ADMIN';
  exp: number;
}

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });

  const token = res.data.accessToken;
  const decoded: JwtPayload = jwtDecode(token);
  const me = await fetchMe(token);

  useAuthStore.getState().setAuth(token, {
    id: decoded.sub,
    role: decoded.role,
    name: me.name,
    email: me.email,
  });
}

export async function signup(name: string, email: string, password: string) {
  const res = await api.post('/auth/signup', { name, email, password });

  const token = res.data.accessToken;
  const decoded: JwtPayload = jwtDecode(token);
  const me = await fetchMe(token);

  useAuthStore.getState().setAuth(token, {
    id: decoded.sub,
    role: decoded.role,
    name: me.name,
    email: me.email,
  });
}

export async function fetchMe(accessToken: string) {
  const res = await api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data;
}

export async function logout() {
  try {
    await api.post('/auth/logout', {}, { withCredentials: true });
  } catch {}

  useAuthStore.getState().logout();
}

export function getCurrentUser() {
  return useAuthStore.getState().user;
}

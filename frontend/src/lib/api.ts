import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from './stores/useAuthStore';

interface JwtPayload {
  exp: number;
  sub: string;
  role: 'USER' | 'ADMIN';
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  withCredentials: true, // necessário para enviar cookies HttpOnly
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

function onRefreshed() {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/token/refresh')) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await api.post('/auth/token/refresh', {}, { withCredentials: true });

          const newToken = res.data.accessToken;
          const decoded: JwtPayload = jwtDecode(newToken);

          useAuthStore.getState().setAuth(newToken, {
            id: decoded.sub,
            role: decoded.role,
          });

          isRefreshing = false;
          onRefreshed();
        } catch (e) {
          isRefreshing = false;
          useAuthStore.getState().logout();
          return Promise.reject(e);
        }
      }

      return new Promise((resolve) => {
        refreshSubscribers.push(() => {
          const token = useAuthStore.getState().accessToken;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  },
);

export default api;

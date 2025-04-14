import useSWR from 'swr';
import api from './api';
import { useAuthStore } from './stores/useAuthStore';

export function useProtectedFetcher<T = any>(url: string | null) {
  const isRestored = useAuthStore((s) => s.isRestored);

  const shouldFetch = url && isRestored;

  return useSWR<T>(shouldFetch ? url : null, (url: string) => api.get(url).then((res) => res.data));
}

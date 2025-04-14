'use client';

import useSWR from 'swr';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import api from '@/lib/api';

interface Task {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

export function useTasks() {
  const user = useAuthStore((s) => s.user);
  const isRestored = useAuthStore((s) => s.isRestored);

  const url = user?.role === 'ADMIN' ? '/tasks' : '/tasks/mine';

  const { data, error, isLoading, mutate } = useSWR<Task[]>(isRestored ? url : null, (url: string) => api.get(url).then((res) => res.data));

  return {
    tasks: data ?? [],
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}

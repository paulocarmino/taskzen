import { useProtectedFetcher } from '@/lib/fetcher';

export interface Task {
  id: string;
  title: string;
  content?: string;
  done?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useMyTasks() {
  const { data, error, isLoading, mutate } = useProtectedFetcher<Task[]>('/tasks/mine');

  return {
    tasks: data ?? [],
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}

export function useAllTasks() {
  const { data, error, isLoading, mutate } = useProtectedFetcher<Task[]>('/tasks');

  return {
    tasks: data ?? [],
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}

export function useTask(id?: string) {
  const { data, error, isLoading, mutate } = useProtectedFetcher<Task>(id ? `/tasks/${id}` : null);

  return {
    task: data,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}

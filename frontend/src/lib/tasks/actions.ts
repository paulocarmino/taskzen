import api from '@/lib/api';

export async function createTask(data: { title: string; content?: string; done?: boolean }) {
  const res = await api.post('/tasks', data);
  return res.data;
}

export async function updateTask(id: string, data: { title?: string; content?: string; done?: boolean }) {
  const res = await api.patch(`/tasks/${id}`, data);
  return res.data;
}

export async function deleteTask(id: string) {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
}

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTask, updateTask } from '@/lib/tasks';
import TaskForm from '@/components/tasks/TaskForm';
import AppTemplate from '@/components/templates/AppTemplate';

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const { task, isLoading, isError } = useTask(id);
  const router = useRouter();

  const handleUpdate = async (data: { title?: string; content?: string }) => {
    await updateTask(id, data);
    router.push('/dashboard');
  };

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Tarefa não encontrada.</p>;

  return (
    <AppTemplate>
      <h1 className="mb-4 text-xl font-semibold">Editar Tarefa</h1>
      <TaskForm onSubmit={handleUpdate} loading={false} initialData={task} />
    </AppTemplate>
  );
}

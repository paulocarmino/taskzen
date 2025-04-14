'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createTask } from '@/lib/tasks';
import TaskForm from '@/components/tasks/TaskForm';
import AppTemplate from '@/components/templates/AppTemplate';

export default function NewTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: { title: string; content?: string }) => {
    setLoading(true);
    await createTask(data);
    router.push('/dashboard');
  };

  return (
    <AppTemplate>
      <h1 className="mb-4 text-xl font-semibold">Nova Tarefa</h1>
      <TaskForm onSubmit={handleCreate} loading={loading} />
    </AppTemplate>
  );
}

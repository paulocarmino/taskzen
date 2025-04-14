'use client';

import { useMyTasks, deleteTask } from '@/lib/tasks';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import AppTemplate from '@/components/templates/AppTemplate';
import { useAuthStore } from '@/lib/stores/useAuthStore';

export default function DashboardPage() {
  const { tasks, isLoading, isError, refresh } = useMyTasks();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    refresh();
  };

  if (isLoading) return <p>Carregando tarefas...</p>;
  if (isError) return <p>Erro ao carregar tarefas.</p>;

  return (
    <AppTemplate>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Minhas Tarefas</h1>
          <Button onClick={() => router.push('/tasks/new')}>Nova Tarefa</Button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma tarefa encontrada.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-start justify-between p-4 bg-white border rounded-md shadow-sm">
                <div>
                  <h2 className="font-medium">{task.title}</h2>
                  {task.content && <p className="text-sm text-muted-foreground">{task.content}</p>}
                </div>
                {user?.id === task?.userId && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => router.push(`/tasks/${task.id}/edit`)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(task.id)}>
                      Excluir
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppTemplate>
  );
}

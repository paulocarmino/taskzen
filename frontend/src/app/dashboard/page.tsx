'use client';

import { useMyTasks, deleteTask, Task } from '@/lib/tasks';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import AppTemplate from '@/components/templates/AppTemplate';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { PlusCircle } from 'lucide-react';
import TaskTable from '@/components/tasks/TaskTable';
import Container from '@/components/common/Container';
import { useState } from 'react';
import TaskModal from '@/components/tasks/TaskModal';

export default function DashboardPage() {
  const { tasks, isLoading, isError, refresh } = useMyTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);

  const handleEdit = (task: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
    // router.push(`/tasks/${id}/edit`);
  };

  const handleAddTask = () => {
    setCurrentTask(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    refresh();
  };

  if (isLoading) return <p>Carregando tarefas...</p>;
  if (isError) return <p>Erro ao carregar tarefas.</p>;

  return (
    <AppTemplate>
      <Container>
        <div className="py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Minhas tarefas</h1>
              <p className="text-slate-500 mt-1">Gerencie e organize suas tarefas de forma eficiente</p>
            </div>
            <Button className="mt-4 sm:mt-0 bg-brand-600 hover:bg-brand-700" onClick={handleAddTask}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>

          <TaskTable tasks={tasks} onEditTask={handleEdit} onDeleteTask={handleDelete} />

          <TaskModal open={isModalOpen} onClose={() => setIsModalOpen(false)} task={currentTask} mutate={refresh} />
        </div>
      </Container>
    </AppTemplate>
  );
}

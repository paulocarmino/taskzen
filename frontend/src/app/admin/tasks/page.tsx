'use client';

import { useAllTasks } from '@/lib/tasks';
import AppTemplate from '@/components/templates/AppTemplate';
import TaskTable from '@/components/tasks/TaskTable';
import Container from '@/components/common/Container';

export default function DashboardAdminPage() {
  const { tasks, isLoading, isError } = useAllTasks();

  if (isLoading) return <p>Carregando tarefas...</p>;
  if (isError) return <p>Erro ao carregar tarefas.</p>;

  return (
    <AppTemplate>
      <Container>
        <div className="py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Visualização ADMIN</h1>
              <p className="text-slate-500 mt-1">Todas as tarefas de todos os usuários</p>
            </div>
          </div>

          <TaskTable tasks={tasks} readonly />
        </div>
      </Container>
    </AppTemplate>
  );
}

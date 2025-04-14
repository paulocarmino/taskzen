// 'use client';

// import { useAllTasks } from '@/lib/tasks';
// import { useRouter } from 'next/navigation';
// import AppTemplate from '@/components/templates/AppTemplate';
// import { useAuthStore } from '@/lib/stores/useAuthStore';
// import { useEffect } from 'react';

// export default function DashboardPage() {
//   const { tasks, isLoading, isError } = useAllTasks();
//   const router = useRouter();
//   const user = useAuthStore((s) => s.user);
//   const isRestored = useAuthStore((s) => s.isRestored);

//   useEffect(() => {
//     if (isRestored && user?.role !== 'ADMIN') {
//       router.replace('/dashboard');
//     }
//   }, [user, isRestored, router]);

//   if (isLoading) return <p>Carregando tarefas...</p>;
//   if (isError) return <p>Erro ao carregar tarefas.</p>;

//   return (
//     <AppTemplate>
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <h1 className="text-xl font-semibold">Visualização ADMIN</h1>
//         </div>

//         {tasks.length === 0 ? (
//           <p className="text-muted-foreground">Nenhuma tarefa encontrada.</p>
//         ) : (
//           <ul className="space-y-2">
//             {tasks.map((task) => (
//               <li key={task.id} className="flex items-start justify-between p-4 bg-white border rounded-md shadow-sm">
//                 <div>
//                   <h2 className="font-medium">{task.title}</h2>
//                   {task.content && <p className="text-sm text-muted-foreground">{task.content}</p>}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </AppTemplate>
//   );
// }

'use client';

import { Task, useAllTasks } from '@/lib/tasks';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import AppTemplate from '@/components/templates/AppTemplate';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { PlusCircle } from 'lucide-react';
import TaskTable from '@/components/tasks/TaskTable';
import Container from '@/components/common/Container';
import { useState } from 'react';
import TaskModal from '@/components/tasks/TaskModal';

export default function DashboardAdminPage() {
  const { tasks, isLoading, isError, refresh } = useAllTasks();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

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

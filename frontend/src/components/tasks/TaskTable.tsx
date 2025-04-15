'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Task, updateTask } from '@/lib/tasks';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { mutate } from 'swr';

interface TaskTableProps {
  tasks: Task[];
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  readonly?: boolean;
}

export default function TaskTable({ tasks, onEditTask, onDeleteTask, readonly }: TaskTableProps) {
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const handleDelete = (task: Task) => {
    setTaskToDelete(task);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      onDeleteTask?.(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const handleMarkAsDone = async (task: Task) => {
    await updateTask(task!.id, { done: !task.done });
    mutate(`/tasks/mine`);
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
        <h3 className="text-lg font-medium text-slate-700">Sem nenhuma tarefa</h3>
        <p className="mt-1 text-sm text-slate-500">Crie uma nova tarefa para comecar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <div className="text-sm text-slate-500">{`${tasks.length} tarefa(s) encontrada(s)`}</div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">Finalizada</TableHead>
              <TableHead className="w-[300px]">Titulo</TableHead>
              <TableHead>Conteúdo</TableHead>
              <TableHead className="w-[150px]">Criada em</TableHead>
              {!readonly && <TableHead className="w-[100px] text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div className="flex items-center justify-center">
                    {readonly && <Checkbox id="done" checked={task.done} disabled />}
                    {!readonly && <Checkbox id="done" checked={task.done} onCheckedChange={() => handleMarkAsDone(task)} />}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.content}</TableCell>
                <TableCell>
                  {new Date(task.createdAt || '').toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                {!readonly && (
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => onEditTask?.(task)}>
                        <Edit className="h-4 w-4 text-slate-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(task)}>
                        <Trash2 className="h-4 w-4 text-slate-500" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não poderá ser desfeita. Isso irá remover a tarefa <strong>{`"${taskToDelete?.title}"`}</strong> permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

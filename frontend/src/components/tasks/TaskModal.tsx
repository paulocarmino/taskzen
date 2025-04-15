'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createTask, Task, updateTask } from '@/lib/tasks';
import { Checkbox } from '@/components/ui/checkbox'; // Use o da sua UI lib, não o do Radix diretamente
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';

const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().optional(),
  done: z.boolean().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  task?: Task;
  mutate: () => void;
}

export default function TaskModal({ open, onClose, task, mutate }: TaskModalProps) {
  // const {
  //   register,
  //   handleSubmit,
  //   setValue,
  //   reset,
  //   formState: { errors },
  // } = useForm<TaskFormData>({
  //   resolver: zodResolver(taskSchema),
  //   defaultValues: {
  //     title: '',
  //     content: '',
  //     done: false,
  //   },
  // });
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      content: '',
      done: false,
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        content: task.content ?? '',
        done: task.done ?? false,
      });
    } else {
      form.reset({
        title: '',
        content: '',
        done: false,
      });
    }
  }, [task, open, form]);

  const onSubmit = async (data: TaskFormData) => {
    if (task) {
      await updateTask(task.id, data);
    } else {
      await createTask(data);
    }

    mutate();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Editar Tarefa' : 'Criar Nova Tarefa'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" {...form.register('title')} placeholder="Digite o título da tarefa" />
              {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title?.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea id="content" {...form.register('content')} placeholder="Digite o conteúdo" rows={4} />
            </div>

            <FormField
              control={form.control}
              name="done"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <Label htmlFor="content">Finalizada?</Label>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

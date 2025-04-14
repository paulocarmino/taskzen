'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createTask, Task, updateTask } from '@/lib/tasks';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  task?: Task;
  mutate: () => void;
}

export default function TaskModal({ open, onClose, task, mutate }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setContent(String(task.content));
    } else {
      setTitle('');
      setContent('');
    }
    setTitleError('');
  }, [task, open]);

  const handleSave = () => {
    if (!task) {
      handleCreate({ title, content });
    } else {
      handleUpdate({ title, content });
    }
  };

  const handleCreate = async (data: { title: string; content?: string }) => {
    await createTask(data);

    mutate();
    onClose();
  };

  const handleUpdate = async (data: { title?: string; content?: string }) => {
    await updateTask(task!.id, data);

    mutate();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Editar Tarefa' : 'Criar Nova Tarefa'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titulo</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setTitleError('');
              }}
              placeholder="Digite o título da tarefa"
            />
            {titleError && <p className="text-sm text-red-500">{titleError}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Conteúdo</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Digite o conteúdo" rows={4} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

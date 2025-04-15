'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';

interface TaskFormProps {
  initialData?: {
    title: string;
    content?: string;
    done?: boolean;
  };
  onSubmit: (data: { title: string; content?: string }) => void;
  loading?: boolean;
}

export default function TaskForm({ initialData, onSubmit, loading }: TaskFormProps) {
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm({
    defaultValues: initialData ?? { title: '', content: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input id="title" {...register('title', { required: true })} />
        {formState.errors.title && <p className="text-sm text-red-500">Título obrigatório</p>}
      </div>

      <div>
        <Label htmlFor="content">Conteúdo</Label>
        <Textarea id="content" {...register('content')} />
      </div>

      <div>
        <Label htmlFor="done">Concluído</Label>
        <Checkbox checked={initialData?.done} {...register('done')} />
      </div>

      <div className="flex items-center justify-between">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
        <Button variant={'secondary'} onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

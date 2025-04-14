'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { signup } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setError(null);

    try {
      await signup(data.name, data.email, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setError('Este e-mail já está em uso.');
      } else {
        setError('Erro ao cadastrar. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" type="text" {...register('name', { required: true })} />
        {errors.name && <p className="text-sm text-red-500">Nome obrigatório</p>}
      </div>

      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" {...register('email', { required: true })} />
        {errors.email && <p className="text-sm text-red-500">E-mail obrigatório</p>}
      </div>

      <div>
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" {...register('password', { required: true })} />
        {errors.password && <p className="text-sm text-red-500">Senha obrigatória</p>}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </Button>
    </form>
  );
}

'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { login } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/stores/useAuthStore';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      await login(data.email, data.password);
      useAuthStore.getState().setRestored();
      router.push('/dashboard');
    } catch (err: any) {
      setError('Credenciais inválidas ou servidor indisponível.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}

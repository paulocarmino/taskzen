'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { login } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      await login(data.email, data.password);
      useAuthStore.getState().setRestored();

      toast('Login realizado com sucesso.');
      router.push('/dashboard');
    } catch (err: any) {
      setError('Credenciais inválidas ou servidor indisponível.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg animate-fade-in">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
          <CardDescription className="text-center">Digite seu email e senha para acessar sua conta</CardDescription>
        </CardHeader>
        <CardContent className="mt-10 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" {...register('email', { required: true })} />
            {errors.email && <p className="text-sm text-red-500">E-mail obrigatório</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link href="#" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Input id="password" type={showPassword ? 'text' : 'password'} {...register('password', { required: true })} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-red-500">Senha obrigatória</p>}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
          <div className="text-center text-sm">
            Não tem conta ainda?{' '}
            <Link href="/signup" className="font-medium text-brand-600 hover:text-brand-700">
              Criar uma conta
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

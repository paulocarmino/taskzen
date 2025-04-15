'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signup } from '@/lib/auth';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const signupSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setError(null);

    try {
      await signup(data.name, data.email, data.password);
      useAuthStore.getState().setRestored();

      toast.success('Cadastro realizado com sucesso.');
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
    <Card className="w-full max-w-md shadow-lg animate-in slide-in-from-top-3 fade-in duration-300">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Criar uma conta</CardTitle>
            <CardDescription className="text-center">Digite suas informações para criar uma conta</CardDescription>
          </CardHeader>
          <CardContent className="mt-10 space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <FormControl>
                    <Input id="email" type="email" {...field} />
                  </FormControl>
                  {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <FormControl>
                    <Input id="name" type="text" {...field} />
                  </FormControl>
                  {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <FormControl>
                      <Input id="password" type={showPassword ? 'text' : 'password'} {...field} />
                    </FormControl>
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
                  {form.formState.errors.password && <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>}
                </FormItem>
              )}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
            <div className="text-center text-sm">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
                Entre aqui
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

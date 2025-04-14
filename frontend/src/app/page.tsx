'use client';

import { useAuthStore } from '@/lib/stores/useAuthStore';
import { SplashScreen } from '@/components/common/SplashScreen';
import { ListTodo } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRestoreSession } from '@/lib/hooks/useRestoreSession';

export default function RootRedirect() {
  useRestoreSession();

  const authStatus = useAuthStore((s) => s.authStatus);
  if (authStatus === 'checking' || authStatus === 'idle') {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <ListTodo className="h-12 w-12 text-brand-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 mb-6">Bem vindo(a) ao TaskZen</h1>
          <p className="text-xl text-slate-600 mb-10">
            Uma aplicação para gerenciamento de tarefas para aumentar a produtividade e a organização.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {authStatus !== 'unauthenticated' && (
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700">
                  Ir para o Dashboard
                </Button>
              </Link>
            )}
            {authStatus === 'unauthenticated' && (
              <>
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700">
                    Entrar
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Criar conta
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

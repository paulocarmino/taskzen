'use client';

import { redirect, usePathname } from 'next/navigation';
import { useRestoreSession } from '@/lib/hooks/useRestoreSession';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { SplashScreen } from '@/components/common/SplashScreen';
import { LogoutButton } from '@/components/common/LoggoutButton';
import { useRedirectIfUnauthenticated } from '@/lib/hooks/useRedirectIfUnauthenticated';
import Link from 'next/link';

export default function AppTemplate({ children }: { children: React.ReactNode }) {
  useRestoreSession();
  useRedirectIfUnauthenticated();

  const authStatus = useAuthStore((s) => s.authStatus);
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();
  const isAdminView = pathname === '/admin/tasks';

  if (authStatus === 'checking' || authStatus === 'idle') {
    return <SplashScreen />;
  }

  if (authStatus === 'unauthenticated') {
    redirect('/login');
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <header className="flex justify-between w-full max-w-4xl p-4 px-4 py-6 mx-auto border-b">
        <div className="text-sm text-muted-foreground">
          <p>{user?.name ? `Logado com ${user.name}` : null}</p>

          {user?.role === 'ADMIN' && (
            <Link href={isAdminView ? '/dashboard' : '/admin/tasks'}>
              {isAdminView ? 'Ir para visualização de usuário' : 'Ir para visualização de admin'}
            </Link>
          )}
        </div>
        <LogoutButton />
      </header>

      <main className="flex flex-col w-full max-w-4xl px-4 py-6 mx-auto">{children}</main>
    </div>
  );
}

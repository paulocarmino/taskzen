'use client';

import { redirect } from 'next/navigation';
import { useRestoreSession } from '@/lib/hooks/useRestoreSession';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { SplashScreen } from '@/components/common/SplashScreen';
import { LogoutButton } from '@/components/common/LoggoutButton';
import { useRedirectIfUnauthenticated } from '@/lib/hooks/useRedirectIfUnauthenticated';

export default function AppTemplate({ children }: { children: React.ReactNode }) {
  useRestoreSession();
  useRedirectIfUnauthenticated();

  const authStatus = useAuthStore((s) => s.authStatus);
  const user = useAuthStore((s) => s.user);

  if (authStatus === 'checking' || authStatus === 'idle') {
    return <SplashScreen />;
  }

  if (authStatus === 'unauthenticated') {
    redirect('/login');
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="text-sm text-muted-foreground">{user?.name ? `Logado com ${user.name}` : null}</div>
        <LogoutButton />
      </header>
      <main className="container flex-1 py-6">{children}</main>
    </div>
  );
}

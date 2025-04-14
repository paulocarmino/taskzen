'use client';

import { redirect } from 'next/navigation';
import { useRestoreSession } from '@/lib/hooks/useRestoreSession';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { SplashScreen } from '@/components/common/SplashScreen';
import { LogoutButton } from '@/components/common/LoggoutButton';
import { useRedirectIfUnauthenticated } from '@/lib/hooks/useRedirectIfUnauthenticated';
import Link from 'next/link';
import { Home, ListTodo, Menu, Settings2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Desktop Navigation */}
      <header className="w-full bg-white border-b border-slate-200 h-16 hidden md:flex items-center px-6">
        <div className="flex-1 flex items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <ListTodo className="h-6 w-6 text-brand-600" />
            <span className="font-bold text-xl text-slate-800">TaskZen</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <div className="flex items-center mr-4 text-sm text-slate-600">
            <User className="h-4 w-4 mr-2" />
            {user?.name}
          </div>

          {user?.role === 'ADMIN' && (
            <Link href="/admin/tasks">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <Settings2 className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Button>
            </Link>
          )}

          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>

          <LogoutButton />
        </nav>
      </header>

      {/* Mobile Navigation */}
      <header className="w-full bg-white border-b border-slate-200 h-16 flex md:hidden items-center px-4">
        <div className="flex-1 flex items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <ListTodo className="h-6 w-6 text-brand-600" />
            <span className="font-bold text-xl text-slate-800">TaskZen</span>
          </Link>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col space-y-4 mt-8">
              <div className="flex items-center p-2 text-slate-800">
                <User className="h-5 w-5 mr-2 text-slate-600" />
                {user?.name}
              </div>
              <Link href="/admin/tasks" className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-md">
                <Home className="h-5 w-5 text-slate-600" />
                <span className="text-slate-800">Admin Dashboard</span>
              </Link>
              <Link href="/dashboard" className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-md">
                <Home className="h-5 w-5 text-slate-600" />
                <span className="text-slate-800">Dashboard</span>
              </Link>
              <LogoutButton />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}

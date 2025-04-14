'use client';

import { logout } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();

    router.push('/');
  };

  return (
    <Button variant="ghost" onClick={handleLogout}>
      <LogOut className="h-5 w-5 text-slate-600" />
      <span className="text-slate-800">Logout</span>
    </Button>
  );
}

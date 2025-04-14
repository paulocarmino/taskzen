'use client';

import { logout } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <Button variant="ghost" onClick={handleLogout}>
      Sair
    </Button>
  );
}

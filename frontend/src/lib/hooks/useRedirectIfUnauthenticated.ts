import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/useAuthStore';

export function useRedirectIfUnauthenticated() {
  const user = useAuthStore((s) => s.user);
  const isRestored = useAuthStore((s) => s.isRestored);
  const router = useRouter();

  useEffect(() => {
    if (isRestored && !user) {
      router.replace('/login');
    }
  }, [user, isRestored, router]);
}

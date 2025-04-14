import { create } from 'zustand';

interface User {
  id: string;
  email?: string;
  name?: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  authStatus: 'idle' | 'checking' | 'authenticated' | 'unauthenticated';
  isRestored: boolean;
  setRestored: () => void;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  setStatus: (status: AuthState['authStatus']) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  authStatus: 'idle',
  isRestored: false,
  setRestored: () => set(() => ({ isRestored: true })),
  setAuth: (token, user) => set(() => ({ accessToken: token, user, authStatus: 'authenticated' })),
  logout: () =>
    set(() => ({
      accessToken: null,
      user: null,
      authStatus: 'unauthenticated',
    })),
  setStatus: (status) => set(() => ({ authStatus: status })),
}));

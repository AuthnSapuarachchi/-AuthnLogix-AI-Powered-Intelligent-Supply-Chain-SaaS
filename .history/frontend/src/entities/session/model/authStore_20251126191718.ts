import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Define valid roles
type Role = 'ADMIN' | 'MANAGER' | 'DRIVER';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  // Actions
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null, // <--- Initial state
      isAuthenticated: false,

      login: (token: string, role: Role) => {
        // Here we could decode the token to get the user email if we wanted
        set({ token, isAuthenticated: true });
      },

      logout: () => {
        set({ token: null, isAuthenticated: false });
        // Optional: clear query cache or redirect
      },
    }),
    {
      name: 'auth-storage', // The key name in localStorage
    }
  )
);
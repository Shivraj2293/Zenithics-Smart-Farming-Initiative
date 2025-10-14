// src/stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserProfile {
  email: string;
  role: 'admin' | 'farmer';
  isApproved: boolean;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  _hasHydrated: boolean; // Add this property
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void; // Add this function signature
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      _hasHydrated: false, // Set the initial value
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      // Implement the function
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: 'agrosphere-auth',
      storage: createJSONStorage(() => localStorage),
      // This function runs once the store has been loaded from storage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
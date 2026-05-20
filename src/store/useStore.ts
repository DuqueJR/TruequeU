import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types.ts'

export type ThemeMode = 'light' | 'dark' | 'system'

interface StoreState {
  user: User | null
  searchQuery: string
  theme: ThemeMode
  login: (userData: User) => void
  logout: () => void
  setSearchQuery: (query: string) => void
  setTheme: (theme: ThemeMode) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      searchQuery: '',
      theme: 'dark',
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'marketplace-storage',
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
      }),
    },
  ),
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types.ts'

interface StoreState {
  user: User | null
  searchQuery: string
  login: (userData: User) => void
  logout: () => void
  setSearchQuery: (query: string) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      searchQuery: '',
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'marketplace-storage',
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
)

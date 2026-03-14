import { create } from 'zustand'; //Importar la funcion de crear el store global 
import { persist } from 'zustand/middleware'; //Agrega persisitencia autoamticamete 
import type { Listing, User } from '../types.ts'; //Importa tipos 


//Es un estado de la tienda 
//Id d
interface StoreState {
  listings: Listing[];
  user: User | null;
  // Actions
  addListing: (item: Listing) => void;
  updateStatus: (id: string, status: Listing['status']) => void;
  toggleFavorite: (id: string) => void;
  login: (userData: User) => void;
  logout: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      listings: [],
      user: null,

      addListing: (item) =>
        set((state) => ({
          listings: [item, ...state.listings],
        })),

      updateStatus: (id, status) =>
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === id ? { ...l, status } : l
          ),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === id ? { ...l, isFavorite: !l.isFavorite } : l
          ),
        })),

      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'marketplace-storage', // Key in LocalStorage
    }
  )
);
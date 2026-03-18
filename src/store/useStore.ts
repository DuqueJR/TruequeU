import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Listing, User } from '../types.ts';
import { Items } from '../data/items';

/** Referencia estable para cuando no hay favoritos (evita bucle infinito en useSyncExternalStore) */
export const EMPTY_FAVORITES: readonly string[] = [];

export interface RegisteredUser extends User {
  password: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

export interface Chat {
  id: string;
  listingId: string;
  listingTitle: string;
  sellerId: string;
  buyerId: string;
  messages: ChatMessage[];
}

interface StoreState {
  listings: Listing[];
  listingStatusOverrides: Record<string, Listing['status']>;
  user: User | null;
  registeredUsers: RegisteredUser[];
  favoritesByUser: Record<string, string[]>;
  searchQuery: string;
  chats: Record<string, Chat>;
  addListing: (item: Listing) => void;
  updateStatus: (id: string, status: Listing['status']) => void;
  canTransitionStatus: (current: Listing['status'], next: Listing['status']) => boolean;
  toggleFavorite: (id: string) => void;
  addRegisteredUser: (user: RegisteredUser) => void;
  login: (userData: User) => void;
  logout: () => void;
  setSearchQuery: (query: string) => void;
  getOrCreateChat: (listingId: string, listingTitle: string, sellerId: string, buyerId: string) => Chat;
  addChatMessage: (chatId: string, senderId: string, text: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
    listings: [],
    listingStatusOverrides: {},
    user: null,
    registeredUsers: [],
    favoritesByUser: {},
    searchQuery: "",
    chats: {},

    addListing: (item) =>
        set((state) => ({
          listings: [item, ...state.listings],
        })),

      canTransitionStatus: (current, next) => {
        if (current === next) return true;
        if (current === "available") return next === "reserved" || next === "sold";
        if (current === "reserved") return next === "available" || next === "sold";
        return false;
      },

      updateStatus: (id, status) =>
        set((state) => {
          const target = state.listings.find((l) => l.id === id);
          const baseListing = Items.find((l) => l.id === id);
          const fallbackStatus = state.listingStatusOverrides[id];
          const currentStatus = target?.status ?? fallbackStatus ?? baseListing?.status;
          if (!currentStatus) return state;
          const canTransition = (state as StoreState).canTransitionStatus(currentStatus, status);
          if (!canTransition) return state;
          if (currentStatus === "sold" && status === "available") return state;
          return {
            listings: state.listings.map((l) =>
              l.id === id ? { ...l, status } : l
            ),
            listingStatusOverrides: {
              ...state.listingStatusOverrides,
              [id]: status,
            },
          };
        }),

      toggleFavorite: (id) =>
        set((state) => {
          const userId = state.user?.id;
          if (!userId) return state;
          const userFavs = (state.favoritesByUser ?? {})[userId] ?? [];
          const isFav = userFavs.includes(id);
          return {
            favoritesByUser: {
              ...(state.favoritesByUser ?? {}),
              [userId]: isFav ? userFavs.filter((f) => f !== id) : [...userFavs, id],
            },
            listings: state.listings.map((l) =>
              l.id === id ? { ...l, isFavorite: !l.isFavorite } : l
            ),
          };
        }),

    addRegisteredUser: (user) =>
      set((s) => ({
        registeredUsers: [...s.registeredUsers, user],
      })),
    login: (userData) => set({ user: userData }),
    logout: () => set({ user: null }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      getOrCreateChat: (listingId, listingTitle, sellerId, buyerId) => {
        const chatId = `${listingId}-${buyerId}`;
        const existing = get().chats[chatId];
        if (existing) return existing;
        const chat: Chat = {
          id: chatId,
          listingId,
          listingTitle,
          sellerId,
          buyerId,
          messages: [],
        };
        set((s) => ({ chats: { ...s.chats, [chatId]: chat } }));
        return chat;
      },

      addChatMessage: (chatId, senderId, text) => {
        const chat = get().chats[chatId];
        if (!chat) return;
        const msg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId,
          text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        set((s) => ({
          chats: {
            ...s.chats,
            [chatId]: { ...chat, messages: [...chat.messages, msg] },
          },
        }));
      },
    }),
    {
      name: 'marketplace-storage',
      partialize: (state) => ({
        listings: state.listings,
        listingStatusOverrides: state.listingStatusOverrides,
        user: state.user,
        registeredUsers: state.registeredUsers,
        favoritesByUser: state.favoritesByUser,
        chats: state.chats,
      }),
    }
  )
);
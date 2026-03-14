import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Listing, User } from '../types.ts';

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
  user: User | null;
  searchQuery: string;
  chats: Record<string, Chat>;
  addListing: (item: Listing) => void;
  updateStatus: (id: string, status: Listing['status']) => void;
  toggleFavorite: (id: string) => void;
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
      user: null,
      searchQuery: "",
      chats: {},

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
      partialize: (state) => ({ listings: state.listings, user: state.user, chats: state.chats }),
    }
  )
);
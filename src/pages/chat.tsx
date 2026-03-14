import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { users } from "../data/users";
import { Items } from "../data/items";

export default function ChatPage() {
  const { chatId } = useParams();
  const currentUser = useStore((state) => state.user);
  const chats = useStore((state) => state.chats);
  const getOrCreateChat = useStore((state) => state.getOrCreateChat);
  const addChatMessage = useStore((state) => state.addChatMessage);

  const [newMessage, setNewMessage] = useState("");

  const storeListings = useStore((state) => state.listings);
  const allListings = [...Items, ...storeListings];

  useEffect(() => {
    if (!chatId || !currentUser) return;
    if (chats[chatId]) return;
    const idx = chatId.lastIndexOf("-");
    if (idx === -1) return;
    const listingId = chatId.slice(0, idx);
    const buyerId = chatId.slice(idx + 1);
    const listing = allListings.find((l) => l.id === listingId);
    if (listing && buyerId === currentUser.id) {
      getOrCreateChat(listing.id, listing.title, listing.ownerId, buyerId);
    }
  }, [chatId, currentUser, allListings, chats, getOrCreateChat]);

  const myChats = Object.values(chats).filter(
    (c) => c.sellerId === currentUser?.id || c.buyerId === currentUser?.id
  );

  const getPartner = (chat: (typeof myChats)[0]) => {
    const partnerId = chat.sellerId === currentUser?.id ? chat.buyerId : chat.sellerId;
    return users.find((u) => u.id === partnerId);
  };

  const activeChat = chatId ? chats[chatId] : null;
  const partner = activeChat ? getPartner(activeChat) : null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !chatId) return;
    addChatMessage(chatId, currentUser.id, newMessage.trim());
    setNewMessage("");
  };

  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Inicia sesión para ver tus chats.</p>
          <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-73px)] overflow-hidden bg-[#0f172a]">
      {/* Sidebar: Lista de chats */}
      <aside className="w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-900/20 shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-black text-white tracking-tighter">Mensajes</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {myChats.length === 0 ? (
            <p className="text-slate-500 text-sm p-4">
              No tienes conversaciones. Contacta a un vendedor desde un listing.
            </p>
          ) : (
            myChats.map((chat) => {
              const p = getPartner(chat);
              const lastMsg = chat.messages[chat.messages.length - 1];
              const isActive = chatId === chat.id;
              return (
                <Link
                  key={chat.id}
                  to={`/chat/${chat.id}`}
                  className={`block p-4 rounded-2xl transition-colors ${
                    isActive ? "bg-indigo-600/20 border border-indigo-500/50" : "hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p?.id || "unknown"}`}
                      className="w-10 h-10 rounded-full bg-slate-800"
                      alt=""
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate text-sm">{p?.name || "Usuario"}</p>
                      <p className="text-slate-400 text-xs truncate">
                        {lastMsg ? lastMsg.text : chat.listingTitle}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </aside>

      {/* Área de chat */}
      <main className="flex-1 flex flex-col min-w-0">
        {activeChat && partner ? (
          <>
            <header className="p-4 border-b border-slate-800 bg-[#1e293b]/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.id}`}
                  className="w-10 h-10 rounded-full border border-slate-700"
                  alt=""
                />
                <div>
                  <h3 className="text-white font-bold text-sm">{partner.name}</h3>
                  <p className="text-slate-500 text-xs">{activeChat.listingTitle}</p>
                </div>
              </div>
              <Link
                to={`/listing/${activeChat.listingId}`}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold border border-indigo-500/30 px-3 py-1.5 rounded-lg"
              >
                Ver listing
              </Link>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0f172a]">
              {activeChat.messages.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">
                  Envía un mensaje para iniciar la conversación.
                </p>
              ) : (
                activeChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-4 rounded-2xl shadow-xl ${
                        msg.senderId === currentUser.id
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className="text-[10px] mt-2 opacity-60">{msg.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <footer className="p-4 bg-slate-900/50 border-t border-slate-800 shrink-0">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all"
                >
                  Enviar
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            {chatId ? (
              <p>Chat no encontrado.</p>
            ) : (
              <p>Selecciona una conversación o contacta a un vendedor.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

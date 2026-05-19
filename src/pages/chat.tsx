import { useState, useEffect, useCallback } from "react"
import { useParams, useSearchParams, Link } from "react-router-dom"
import { useStore } from "../store/useStore"
import {
  apiGetConversations,
  apiGetConversation,
  apiCreateConversation,
  apiGetMessages,
  apiSendMessage,
  apiGetUser,
} from "../api/client"
import type { Conversation, Message as MessageType, User } from "../types"

export default function ChatPage() {
  const { chatId } = useParams()
  const [searchParams] = useSearchParams()
  const currentUser = useStore((state) => state.user)

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [partner, setPartner] = useState<User | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)

  const fetchConversations = useCallback(async () => {
    if (!currentUser) return
    setLoadingConvs(true)
    try {
      const data = await apiGetConversations()
      setConversations(data)
    } catch {
      // ignore
    } finally {
      setLoadingConvs(false)
    }
  }, [currentUser])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  useEffect(() => {
    const listingId = searchParams.get("listingId")

    if (chatId) {
      apiGetConversation(chatId).then(async (conv) => {
        setActiveConv(conv)
        const partnerId = conv.buyerId === currentUser?.id ? conv.sellerId : conv.buyerId
        setPartner(await apiGetUser(partnerId).catch(() => null))
      })
    } else if (listingId && currentUser) {
      apiCreateConversation({ listingId, content: "Hi, I'm interested in your listing!" })
        .then((conv) => {
          fetchConversations()
          window.history.replaceState(null, "", `/chat/${conv.id}`)
          setActiveConv(conv)
          const partnerId = conv.buyerId === currentUser.id ? conv.sellerId : conv.buyerId
          return apiGetUser(partnerId)
        })
        .then((u) => {
          if (u) setPartner(u as User)
        })
        .catch(() => {})
    }
  }, [chatId, searchParams, currentUser, fetchConversations])

  useEffect(() => {
    if (!activeConv) return
    setLoadingMessages(true)
    apiGetMessages(activeConv.id)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoadingMessages(false))
  }, [activeConv])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser || !activeConv) return
    const msg = await apiSendMessage(activeConv.id, newMessage.trim())
    setMessages((prev) => [...prev, msg])
    setNewMessage("")
  }

  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Log in to see your chats.</p>
          <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-73px)] overflow-hidden bg-[#0f172a]">
      <aside className="w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-900/20 shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-black text-white tracking-tighter">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loadingConvs ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-slate-500 text-sm p-4">
              You don't have any chats yet. Browse listings and contact sellers to start a conversation.
            </p>
          ) : (
            conversations.map((conv) => {
              const isActive = chatId === conv.id
              return (
                <Link
                  key={conv.id}
                  to={`/chat/${conv.id}`}
                  className={`block p-4 rounded-2xl transition-colors ${
                    isActive ? "bg-indigo-600/20 border border-indigo-500/50" : "hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold">
                      {conv.buyerId === currentUser.id ? "S" : "B"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate text-sm">
                        {conv.lastMessageContent || "Conversation"}
                      </p>
                      <p className="text-slate-400 text-xs truncate">
                        {conv.lastMessageContent || "No messages yet"}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        {activeConv && partner ? (
          <>
            <header className="p-4 border-b border-slate-800 bg-[#1e293b]/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.id}`}
                  className="w-10 h-10 rounded-full border border-slate-700"
                  alt=""
                />
                <div>
                  <h3 className="text-white font-bold text-sm">{partner.fullName || partner.username}</h3>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0f172a]">
              {loadingMessages ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                </div>
              ) : messages.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">
                  Send a message to start a conversation
                </p>
              ) : (
                messages.map((msg) => (
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
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className="text-[10px] mt-2 opacity-60">
                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
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
                  placeholder="Write a message..."
                  className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all"
                >
                  Send
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            {chatId ? (
              <p>Chat not found.</p>
            ) : (
              <p>Select a conversation or contact a seller to start a chat.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

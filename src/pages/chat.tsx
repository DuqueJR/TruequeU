import { useState, useEffect, useCallback } from "react"
import { useParams, useSearchParams } from "react-router-dom"
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
import AuthGuard from "../components/AuthGuard"

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
        apiGetUser(partnerId).then(setPartner)
      })
      return
    }

    if (listingId && currentUser) {
      const existing = conversations.find((c) => c.listingId === listingId)
      if (existing) {
        setActiveConv(existing)
        const partnerId = existing.buyerId === currentUser.id ? existing.sellerId : existing.buyerId
        apiGetUser(partnerId).then(setPartner)
        return
      }
    }

    setActiveConv(null)
    setPartner(null)
  }, [chatId, searchParams, currentUser, conversations])

  useEffect(() => {
    if (!activeConv) return
    setLoadingMessages(true)
    apiGetMessages(activeConv.id)
      .then((data) => {
        setMessages(data)
      })
      .finally(() => setLoadingMessages(false))
  }, [activeConv])

  const handleSend = async () => {
    if (!newMessage.trim() || !currentUser || !activeConv) return
    const msg = await apiSendMessage(activeConv.id, newMessage.trim())
    setMessages((prev) => [...prev, msg])
    setNewMessage("")
  }

  if (!currentUser) {
    return <AuthGuard heading="Sign in to see your chats" description="Chat with sellers and buyers about your listings." />
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-73px)] overflow-hidden bg-brand-bg">
      <aside className="w-full md:w-80 border-r border-brand-border flex flex-col bg-brand-surface/20 shrink-0">
        <div className="p-6 border-b border-brand-border">
          <h2 className="text-xl font-black text-brand-header tracking-tighter">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="flex justify-center py-12">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-brand-text text-sm">No conversations yet.</p>
              <p className="text-brand-text/70 text-xs mt-1">Contact a seller to start a chat.</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = activeConv?.id === conv.id
              const isRead = conv.lastMessageAt != null
              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveConv(conv)
                    const pid = conv.buyerId === currentUser.id ? conv.sellerId : conv.buyerId
                    apiGetUser(pid).then(setPartner)
                  }}
                  className={`w-full text-left p-4 border-b border-brand-border transition-colors ${
                    isActive ? "bg-brand-accent/10 border-l-2 border-l-brand-accent" : "hover:bg-brand-surface/50"
                  }`}
                >
                  <p className="text-sm font-semibold text-brand-header/90 truncate">
                    {conv.lastMessageContent || "No messages yet"}
                  </p>
                  <p className="text-xs text-brand-text mt-1">
                    {isRead ? new Date(conv.lastMessageAt!).toLocaleDateString() : "New"}
                  </p>
                </button>
              )
            })
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {activeConv && partner ? (
          <>
            <div className="p-4 border-b border-brand-border bg-brand-surface/30">
              <p className="text-sm font-bold text-brand-header">{partner.fullName || partner.username}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="flex justify-center py-12">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
                </div>
              ) : messages.length === 0 ? (
                <p className="text-brand-text/70 text-center py-12">No messages yet. Start the conversation.</p>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === currentUser.id
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          isMine
                            ? "bg-brand-accent text-white rounded-br-md"
                            : "bg-brand-surface-secondary text-brand-header/80 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-[10px] mt-1 opacity-70">
                          {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            <div className="p-4 border-t border-brand-border bg-brand-surface/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-brand-input/50 border border-brand-input-border text-brand-header rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-sm"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl transition-all"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-brand-text text-lg mb-2">Select a conversation</p>
              <p className="text-brand-text/70 text-sm">Pick a chat from the sidebar to start messaging.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

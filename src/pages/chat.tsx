import { useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ChatPage() {
  const { id } = useParams(); // ID del listing o de la conversación
  const [newMessage, setNewMessage] = useState("");

  // Mock de mensajes
  const [messages, setMessages] = useState([
    { id: 1, sender: "other", text: "¡Hola! Vi tu iPad, ¿aún está disponible?", time: "10:30 AM" },
    { id: 2, sender: "me", text: "¡Hola! Sí, todavía lo tengo. ¿Te interesa para trueque o compra?", time: "10:32 AM" },
    { id: 3, sender: "other", text: "Tengo una MacBook Air M1 que podría darte como parte de pago. ¿Te interesa?", time: "10:35 AM" },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages([...messages, {
      id: messages.length + 1,
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewMessage("");
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-73px)] overflow-hidden bg-[#0f172a]">
      
      {/* SIDEBAR: Lista de Chats (Oculto en móvil si hay un chat abierto) */}
      <aside className="w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-900/20">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-black text-white tracking-tighter">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Item de Chat Activo */}
          <div className="p-4 rounded-2xl bg-indigo-600/20 border border-indigo-500/50 cursor-pointer">
            <div className="flex items-center gap-3">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Camilo" className="w-10 h-10 rounded-full bg-slate-800" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate text-sm">Camilo Andres</p>
                <p className="text-indigo-300 text-xs truncate italic">iPad Pro 12.9 M2...</p>
              </div>
            </div>
          </div>
          {/* Otros chats mock */}
          <div className="p-4 rounded-2xl hover:bg-slate-800/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">ML</div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-300 font-bold truncate text-sm group-hover:text-white transition-colors">Maria Lopez</p>
                <p className="text-slate-500 text-xs truncate">¿Sigue disponible el libro?</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ÁREA DE CHAT PRINCIPAL */}
      <main className="flex-1 flex flex-col relative">
        {/* Header del Chat */}
        <header className="p-4 border-b border-slate-800 bg-[#1e293b]/30 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/profile/camilo" className="flex items-center gap-3">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Camilo" className="w-10 h-10 rounded-full border border-slate-700" />
              <div>
                <h3 className="text-white font-bold text-sm">Camilo Andres</h3>
                <p className="text-green-500 text-[10px] uppercase font-black tracking-widest">Online</p>
              </div>
            </Link>
          </div>
          <Link to={`/listing/${id}`} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold border border-indigo-500/30 px-3 py-1.5 rounded-lg">
            View Item
          </Link>
        </header>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] p-4 rounded-2xl shadow-xl ${
                msg.sender === "me" 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-[10px] mt-2 opacity-60 ${msg.sender === "me" ? "text-right" : "text-left"}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input de Mensaje */}
        <footer className="p-4 bg-slate-900/50 backdrop-blur-xl border-t border-slate-800">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
            <button type="button" className="p-3 text-slate-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input 
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje para negociar..."
              className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
}
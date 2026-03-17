import type { Listing } from '../../types'
import { Link, useNavigate } from 'react-router-dom'
import { useStore, EMPTY_FAVORITES } from '../../store/useStore'

export default function ListingCard({ listing }: { listing: Listing }) {
  const navigate = useNavigate()
  const user = useStore((state) => state.user)
  const favoriteIds = useStore((state) => {
    const userId = state.user?.id
    if (!userId) return EMPTY_FAVORITES
    const ids = (state.favoritesByUser ?? {})[userId]
    return ids?.length ? ids : EMPTY_FAVORITES
  })
  const toggleFavorite = useStore((state) => state.toggleFavorite)
  const isFavorite = favoriteIds.includes(listing.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      navigate("/login")
      return
    }
    toggleFavorite(listing.id)
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#1e293b]/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
    
      <div className="aspect-square w-full overflow-hidden bg-slate-800 relative">
        {/* Se muestra la primera imagen del arreglo de imagenes del listing*/}
        <img 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
          src={listing.images[0] || 'https://via.placeholder.com/400'} 
          alt={listing.title} 
        />
        
        {/* Se muestra si esta disponible*/}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="rounded-full bg-indigo-600/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
            {listing.status}
          </span>
        </div>
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={!user ? "Inicia sesión para guardar favoritos" : isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all hover:scale-110 ${
            isFavorite ? "bg-red-500 text-white" : "bg-slate-900/60 text-white hover:bg-red-500"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Se muestra la primera imagen del arreglo de imagenes del listing*/}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
            {listing.title}
          </h3>
          <p className="whitespace-nowrap text-lg font-black text-white">
            ${listing.price.toLocaleString()}
          </p>
        </div>

        <p className="mb-4 text-[11px] text-slate-500 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
          Vendedor: <span className="text-slate-400 ml-1">@{listing.ownerId || 'usuario'}</span>
        </p>
        {/* Aqui si quiero chatear con mi propia publicación simplemente me lleva a mi página principal de chat, sino abre el chat con el usuario que tiene el id de quien hizo la publicación */}
        <div className="mt-auto flex gap-2">
          <Link 
            to={!user ? "/login" : listing.ownerId === user.id ? "/chat" : `/chat/${listing.id}-${user.id}`}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition-all hover:bg-emerald-500 active:scale-95 shadow-lg shadow-emerald-900/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat
          </Link>
          {/* Link a la página de detalle del propio listing*/}
          <Link 
            to={`/listing/${listing.id}`}
            className="px-4 flex items-center justify-center rounded-xl bg-slate-800 text-xs font-bold text-slate-300 transition-all hover:bg-slate-700 hover:text-white border border-slate-700"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}
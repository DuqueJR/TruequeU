import type { Listing } from '../../types'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { apiAddFavorite, apiRemoveFavorite } from '../../api/client'
import { useState } from 'react'

export default function ListingCard({ listing }: { listing: Listing }) {
  const navigate = useNavigate()
  const user = useStore((state) => state.user)
  const [isFavorite, setIsFavorite] = useState(listing.isFavorite)

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      navigate("/login")
      return
    }
    try {
      if (isFavorite) {
        await apiRemoveFavorite(listing.id)
        setIsFavorite(false)
      } else {
        await apiAddFavorite(listing.id)
        setIsFavorite(true)
      }
    } catch {
      // ignore
    }
  }

  const primaryImage = listing.images[0]?.url || 'https://via.placeholder.com/400'

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-surface/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]">

      <div className="aspect-square w-full overflow-hidden bg-brand-surface-secondary relative">
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={primaryImage}
          alt={listing.title}
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg ${
            listing.status === "available" ? "bg-emerald-500/90" :
            listing.status === "reserved" ? "bg-amber-500/90" :
            listing.status === "sold" ? "bg-red-500/90" :
            "bg-slate-500/90"
          }`}>
            {listing.status}
          </span>
        </div>
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={!user ? "Sign in to save favorites" : isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all hover:scale-110 ${
            isFavorite ? "bg-red-500 text-white" : "bg-brand-input/60 text-brand-header hover:bg-red-500"
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

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-brand-header/90 group-hover:text-brand-accent transition-colors">
            {listing.title}
          </h3>
          <p className="whitespace-nowrap text-lg font-black text-brand-header">
            ${listing.price.toLocaleString()}
          </p>
        </div>

        <div className="mt-auto flex gap-2">
          <Link
            to={!user ? "/login" : listing.ownerId === user.id ? "/chat" : `/chat?listingId=${listing.id}`}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition-all hover:bg-emerald-500 active:scale-95 shadow-lg shadow-emerald-900/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat
          </Link>
          <Link
            to={`/listing/${listing.id}`}
            className="px-4 flex items-center justify-center rounded-xl bg-brand-surface-secondary text-brand-header/80 text-xs font-bold transition-all hover:bg-brand-surface-secondary/80 hover:text-brand-header border border-brand-input-border"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}

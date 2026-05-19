import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useStore } from "../store/useStore"
import { apiGetFavorites } from "../api/client"
import type { Favorite } from "../types"

export default function FavoritesPage() {
  const user = useStore((state) => state.user)
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    setLoading(true)
    setError(null)
    apiGetFavorites()
      .then((data) => {
        if (!cancelled) setFavorites(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error loading favorites")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [user])

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-white mb-4">Sign in to see your favorites</h2>
          <p className="text-slate-400 mb-6">Favorites are saved per account.</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all"
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="mt-4 text-slate-400">Loading favorites...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <Link to="/listings" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Back to listings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0">
      <div className="mx-auto max-w-7xl px-6 pt-8 pb-4">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
          My favorites
        </h1>
        <p className="text-slate-400 text-sm">
          {favorites.length > 0
            ? `${favorites.length} ${favorites.length === 1 ? "item" : "items"} saved`
            : "Save listings to see them here."}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="bg-[#1e293b]/20 border border-slate-800 rounded-2xl p-12 text-center">
            <p className="text-slate-400 mb-4">You have no favorites yet. Browse listings and mark the ones you're interested in.</p>
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all"
            >
              View all listings
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-6 py-8">
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((fav) => (
              <Link
                key={fav.id}
                to={`/listing/${fav.listingId}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#1e293b]/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-5"
              >
                <span className={`self-start px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 ${
                  fav.listingState === "available" ? "bg-emerald-500/20 text-emerald-400" :
                  fav.listingState === "reserved" ? "bg-amber-500/20 text-amber-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {fav.listingState}
                </span>
                <h3 className="line-clamp-2 text-sm font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors mb-2">
                  {fav.listingTitle}
                </h3>
                <span className="text-xs text-slate-500 mb-2">{fav.listingCategory}</span>
                <p className="mt-auto text-lg font-black text-white">${fav.listingPrice}</p>
              </Link>
            ))}
          </section>
        </div>
      )}
    </div>
  )
}

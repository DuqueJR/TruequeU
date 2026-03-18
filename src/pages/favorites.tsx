import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useStore, EMPTY_FAVORITES } from "../store/useStore"
import ListingList from "../components/listings/ListingList"
import Profile from "../components/profile/Profile"
import { apiGetListings } from "../api/client"
import type { Listing } from "../types"

export default function FavoritesPage() {
  const user = useStore((state) => state.user)
  const storeListings = useStore((state) => state.listings)
  const favoriteIds = useStore((state) => {
    const userId = state.user?.id;
    if (!userId) return EMPTY_FAVORITES;
    const ids = (state.favoritesByUser ?? {})[userId];
    return ids?.length ? ids : EMPTY_FAVORITES;
  })
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    apiGetListings()
      .then((res) => {
        if (!cancelled) {
          const fromApi = res.data ?? []
          const merged: Listing[] = [...storeListings]
          for (const item of fromApi) {
            if (!merged.some((a) => a.id === item.id)) merged.push(item)
          }
          setListings(merged)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error al cargar")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [storeListings])

  const favoriteListings = listings.filter((l) => favoriteIds.includes(l.id))

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-white mb-4">Inicia sesión para ver tus favoritos</h2>
          <p className="text-slate-400 mb-6">Los favoritos se guardan por cuenta.</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all"
          >
            Iniciar sesión
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
          <p className="mt-4 text-slate-400">Cargando favoritos...</p>
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
            Volver a listings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 min-w-0">
        <div className="mx-auto max-w-7xl px-6 pt-8 pb-4">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
            Mis favoritos
          </h1>
          <p className="text-slate-400 text-sm">
            {favoriteListings.length > 0
              ? `${favoriteListings.length} ${favoriteListings.length === 1 ? "item" : "items"} guardados`
              : "Guarda listings para verlos aquí."}
          </p>
        </div>
        <ListingList
          listings={favoriteListings}
          emptyMessage={
            favoriteIds.length === 0
              ? "Aún no tienes favoritos. Explora los listings y marca los que te interesen."
              : "Algunos favoritos ya no están disponibles."
          }
        />
        {favoriteListings.length === 0 && favoriteIds.length === 0 && (
          <div className="mx-auto max-w-7xl px-6 pb-8">
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all"
            >
              Ver todos los listings
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
      <aside className="lg:w-80 shrink-0 px-6 lg:px-0">
        <div className="lg:sticky lg:top-24">
          <Profile />
        </div>
      </aside>
    </div>
  )
}

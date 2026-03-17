import { useState, useEffect } from "react"
import { useStore } from "../store/useStore"
import ListingList from "../components/listings/ListingList"
import Profile from "../components/profile/Profile"
import { apiGetListings } from "../api/client"
import type { Listing } from "../types"

export default function ListingsPage() {
  const storeListings = useStore((state) => state.listings)
  const searchQuery = useStore((state) => state.searchQuery)
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
          const merged = [...fromApi]
          for (const s of storeListings) {
            if (!merged.some((a) => a.id === s.id)) merged.push(s)
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

  const filteredListings = listings.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="mt-4 text-slate-400">Cargando listings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 min-w-0">
        <div className="mx-auto max-w-7xl px-6 pt-8 pb-4">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
            All listings
          </h1>
          <p className="text-slate-400 text-sm">
            Explore all that the community has to offer.
          </p>
        </div>
        <ListingList
          listings={filteredListings}
          emptyMessage={
            listings.length === 0
              ? "No hay listings aún. ¡Sé el primero en crear uno!"
              : "No hay resultados para tu búsqueda. Prueba otros términos."
          }
        />
      </div>
      <aside className="lg:w-80 shrink-0 px-6 lg:px-0">
        <div className="lg:sticky lg:top-24">
          <Profile />
        </div>
      </aside>
    </div>
  )
}

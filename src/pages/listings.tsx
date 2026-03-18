import { useState, useEffect } from "react"
import { useStore } from "../store/useStore"
import ListingList from "../components/listings/ListingList"
import Profile from "../components/profile/Profile"
import { apiGetListings } from "../api/client"
import type { Listing } from "../types"

export default function ListingsPage() {
  const storeListings = useStore((state) => state.listings)
  const listingStatusOverrides = useStore((state) => state.listingStatusOverrides)
  const searchQuery = useStore((state) => state.searchQuery)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState("all")
  const [condition, setCondition] = useState("all")
  const [status, setStatus] = useState("all")
  const [postedDate, setPostedDate] = useState("all")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

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
            if (!merged.some((a) => a.id === item.id)) {
              merged.push(item)
            }
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

  const filteredListings = listings.filter((item) => {
    const effectiveStatus = listingStatusOverrides[item.id] ?? item.status
    return (
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (category === "all" || item.category.toLowerCase() === category) &&
    (condition === "all" || (item.condition ?? "").toLowerCase() === condition) &&
    (status === "all" || effectiveStatus === status) &&
    (minPrice === "" || item.price >= Number(minPrice)) &&
    (maxPrice === "" || item.price <= Number(maxPrice)) &&
    (() => {
      if (postedDate === "all") return true
      if (!item.postedAt) return false
      const itemDate = new Date(item.postedAt)
      const today = new Date()
      const diffDays = Math.floor((today.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24))
      if (postedDate === "today") return diffDays === 0
      if (postedDate === "week") return diffDays <= 7
      if (postedDate === "month") return diffDays <= 30
      return true
    })()
    )
  })

  const clearFilters = () => {
    setCategory("all")
    setCondition("all")
    setStatus("all")
    setPostedDate("all")
    setMinPrice("")
    setMaxPrice("")
  }

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
        <div className="mx-auto max-w-7xl px-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 rounded-2xl border border-slate-800 bg-[#1e293b]/30 p-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => useStore.getState().setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              <option value="all">All categories</option>
              <option value="books">Books</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="accessories">Accessories</option>
              <option value="study">Study</option>
              <option value="appliances">Appliances</option>
            </select>
            <select value={condition} onChange={(e) => setCondition(e.target.value)} className="rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              <option value="all">All conditions</option>
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              <option value="all">All states</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min price"
              className="rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max price"
              className="rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <select value={postedDate} onChange={(e) => setPostedDate(e.target.value)} className="rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              <option value="all">Any date</option>
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
            </select>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
            >
              Clear filters
            </button>
          </div>
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

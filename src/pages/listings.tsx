import { useState, useEffect, useCallback } from "react"
import { useStore } from "../store/useStore"
import ListingList from "../components/listings/ListingList"
import { apiGetListings } from "../api/client"
import type { Listing, PagedResult } from "../types"

const CATEGORIES = ["Books", "Electronics", "Furniture", "Clothing", "Other"] as const
const CONDITIONS = ["New", "LikeNew", "UsedGood", "UsedFair"] as const
const STATUSES = ["available", "reserved", "sold"] as const
const DATES = [
  { label: "Any date", value: "all" },
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "week" },
  { label: "Last 30 days", value: "month" },
] as const

export default function ListingsPage() {
  const searchQuery = useStore((state) => state.searchQuery)
  const setSearchQuery = useStore((state) => state.setSearchQuery)

  const [paged, setPaged] = useState<PagedResult<Listing> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const [category, setCategory] = useState("")
  const [condition, setCondition] = useState("")
  const [status, setStatus] = useState("")
  const [postedDate, setPostedDate] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const fetchListings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let postedAfter: string | undefined
      if (postedDate && postedDate !== "all") {
        const now = new Date()
        if (postedDate === "today") now.setDate(now.getDate() - 1)
        else if (postedDate === "week") now.setDate(now.getDate() - 7)
        else if (postedDate === "month") now.setDate(now.getDate() - 30)
        postedAfter = now.toISOString()
      }
      const result = await apiGetListings({
        keyword: searchQuery || undefined,
        category: category || undefined,
        condition: condition || undefined,
        state: status || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        postedAfter,
        page,
        pageSize: 20,
      })
      setPaged(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading listings")
    } finally {
      setLoading(false)
    }
  }, [searchQuery, category, condition, status, postedDate, minPrice, maxPrice, page])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  const clearFilters = () => {
    setCategory("")
    setCondition("")
    setStatus("")
    setPostedDate("")
    setMinPrice("")
    setMaxPrice("")
    setSearchQuery("")
    setPage(1)
  }

  if (loading && !paged) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="mt-4 text-slate-400">Loading listings...</p>
        </div>
      </div>
    )
  }

  if (error && !paged) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchListings}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 rounded-2xl border border-slate-800 bg-[#1e293b]/30 p-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
            placeholder="Search..."
            className="col-span-1 rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1) }}
            className="rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c.toLowerCase()}>{c}</option>
            ))}
          </select>
          <select
            value={condition}
            onChange={(e) => { setCondition(e.target.value); setPage(1) }}
            className="rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="">All conditions</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c.toLowerCase()}>{c}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="">All states</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => { setMinPrice(e.target.value); setPage(1) }}
            placeholder="Min price"
            className="rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => { setMaxPrice(e.target.value); setPage(1) }}
            placeholder="Max price"
            className="rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <select
            value={postedDate}
            onChange={(e) => { setPostedDate(e.target.value); setPage(1) }}
            className="rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {DATES.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
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

      {loading && (
        <div className="flex justify-center py-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      )}

      <ListingList
        listings={paged?.items ?? []}
        emptyMessage={
          searchQuery || category || condition || status
            ? "No results match your search. Try different terms."
            : "No listings yet. Be the first to create one!"
        }
      />

      {paged && paged.totalPages > 1 && (
        <div className="mx-auto max-w-7xl px-6 pb-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-slate-400 text-sm">
            Page {paged.page} of {paged.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(paged.totalPages, p + 1))}
            disabled={page >= paged.totalPages}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

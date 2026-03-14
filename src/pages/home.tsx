import { useStore } from "../store/useStore"
import { useState } from "react"
import { Items } from "../data/items"
import ListingList from "../components/listings/ListingList"

export default function HomePage() {
  const storeListings = useStore((state) => state.listings)
  const [search, setSearch] = useState("")

  // Usar Items como fallback cuando el store está vacío (primera carga)
  const listings = storeListings.length > 0 ? storeListings : Items

  const filteredListings = listings.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col">
      <div className="mx-auto max-w-7xl w-full px-6 py-6">
        <input
          type="text"
          placeholder="Search for items, books, services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl bg-slate-900/50 border border-slate-700 text-slate-200 rounded-2xl px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>
      <ListingList listings={filteredListings} />
    </div>
  )
}
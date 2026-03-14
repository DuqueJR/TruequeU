import { useStore } from "../store/useStore"
import { Items } from "../data/items"
import ListingList from "../components/listings/ListingList"
import Profile from "../components/profile/Profile"

export default function   ListingsPage() {
  const storeListings = useStore((state) => state.listings)
  const searchQuery = useStore((state) => state.searchQuery)

  const listings = [...Items, ...storeListings]
  const filteredListings = listings.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              ? "There are no listings yet. Be the first to create one!"
              : "No listings match your search. Try adjusting your search terms."
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

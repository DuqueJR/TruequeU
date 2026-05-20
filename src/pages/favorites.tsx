import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useStore } from "../store/useStore"
import { apiGetFavorites, apiGetListing } from "../api/client"
import type { Listing } from "../types"
import AuthGuard from "../components/AuthGuard"
import ListingCard from "../components/listings/ListingCard"

export default function FavoritesPage() {
  const user = useStore((state) => state.user)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError(null)
    apiGetFavorites()
      .then(async (favs) => {
        if (cancelled) return
        if (favs.length === 0) {
          setListings([])
          return
        }
        const fetched = await Promise.all(
          favs.map((fav) => apiGetListing(fav.listingId))
        )
        if (!cancelled) setListings(fetched)
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
    return <AuthGuard heading="Sign in to see your favorites" description="Favorites are saved per account." />
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
          <p className="mt-4 text-brand-text">Loading favorites...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <Link to="/listings" className="text-brand-accent hover:text-brand-accent/80 font-medium">
            Back to listings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0">
      <div className="mx-auto max-w-7xl px-6 pt-8 pb-4">
        <h1 className="text-2xl md:text-3xl font-black text-brand-header tracking-tight mb-2">
          My favorites
        </h1>
        <p className="text-brand-text text-sm">
          {listings.length > 0
            ? `${listings.length} ${listings.length === 1 ? "item" : "items"} saved`
            : "Save listings to see them here."}
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="bg-brand-surface/20 border border-brand-border rounded-2xl p-12 text-center">
            <p className="text-brand-text mb-4">You have no favorites yet. Browse listings and mark the ones you're interested in.</p>
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-white font-bold rounded-xl transition-all"
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
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </section>
        </div>
      )}
    </div>
  )
}

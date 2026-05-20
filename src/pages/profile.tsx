import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useStore } from "../store/useStore"
import { apiGetMyListings, apiLogout } from "../api/client"
import type { Listing } from "../types"
import AuthGuard from "../components/AuthGuard"
import ListingCard from "../components/listings/ListingCard"

export default function ProfilePage() {
  const user = useStore((state) => state.user)
  const logout = useStore((state) => state.logout)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    apiGetMyListings()
      .then((data) => {
        if (!cancelled) setListings(data)
      })
      .catch(() => {
        // ignore
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [user])

  const handleLogout = async () => {
    try {
      await apiLogout()
    } catch {
      // ignore
    }
    logout()
  }

  if (!user) {
    return <AuthGuard heading="Sign in to view your profile" description="Create an account or sign in to manage your listings and profile." />
  }

  return (
    <div className="flex-1 px-6 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="bg-brand-surface/40 backdrop-blur-xl border border-brand-border p-8 rounded-[2.5rem] mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                alt={user.username}
                className="w-20 h-20 rounded-full bg-brand-accent/20 p-1 border-2 border-brand-input-border"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-brand-header tracking-tight">
                  {user.fullName || user.username}
                </h1>
                <p className="text-brand-text">{user.email}</p>
                {user.program && (
                  <p className="text-brand-text/70 text-sm">{user.program}</p>
                )}
                <p className="text-brand-text/70 text-xs mt-1">Rating: {user.rating}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to="/create"
                className="px-5 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-white font-bold rounded-xl transition-all"
              >
                + New Listing
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-brand-surface-secondary hover:bg-brand-surface-secondary/80 text-brand-header/80 font-medium rounded-xl border border-brand-input-border transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold text-brand-header mb-6">My Listings</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="bg-brand-surface/20 border border-brand-border rounded-2xl p-12 text-center">
              <p className="text-brand-text mb-4">You haven't published any listings yet.</p>
              <Link
                to="/create"
                className="inline-block px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-white font-bold rounded-xl transition-all"
              >
                Create your first listing
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

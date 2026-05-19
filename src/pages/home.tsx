import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useStore } from "../store/useStore"
import { apiGetListings } from "../api/client"
import type { Listing } from "../types"

const FEATURED_COUNT = 6

export default function HomePage() {
  const user = useStore((state) => state.user)
  const [featured, setFeatured] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    apiGetListings({ page: 1, pageSize: FEATURED_COUNT })
      .then((res) => {
        if (!cancelled) setFeatured(res.items)
      })
      .catch(() => {
        if (!cancelled) setFeatured([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="flex-1 min-w-0">
      <div className="mx-auto max-w-7xl px-6 pt-8 pb-6">
        <div className="bg-linear-to-br from-indigo-600/20 via-slate-800/30 to-transparent border border-slate-800 rounded-2xl p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
            {user
              ? `Hi, ${user.fullName?.split(" ")[0] || user.username}!`
              : "Welcome to TruequeU!"}
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mb-6">
            {user
              ? "The peer-to-peer platform for students. Find books, electronics and more to trade with your university community."
              : "Connect with other students to trade items. Sign up to post what you have and discover what others offer."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all"
            >
              See All listings
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            {!user && (
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition-all"
              >
                Create an account
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Featured</h2>
          <Link to="/listings" className="text-indigo-400 hover:text-indigo-300 text-sm font-bold">
            See All →
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featured.map((listing) => (
              <Link
                key={listing.id}
                to={`/listing/${listing.id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#1e293b]/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
              >
                <div className="aspect-square w-full overflow-hidden bg-slate-800">
                  <img
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={listing.images[0]?.url || "https://via.placeholder.com/400"}
                    alt={listing.title}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-indigo-600/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                      {listing.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-sm font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                      {listing.title}
                    </h3>
                    <p className="whitespace-nowrap text-lg font-black text-white">
                      ${listing.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[#1e293b]/20 border border-slate-800 rounded-2xl p-12 text-center">
            <p className="text-slate-400 mb-4">No listings yet.</p>
            <Link
              to="/create"
              className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all"
            >
              Be the first to create one!
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

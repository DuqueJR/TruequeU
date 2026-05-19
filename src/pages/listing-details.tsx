import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useStore } from "../store/useStore"
import {
  apiGetListing,
  apiGetUser,
  apiAddFavorite,
  apiRemoveFavorite,
  apiMarkListingSold,
  apiMarkListingReserved,
  apiMarkListingAvailable,
  ApiError,
} from "../api/client"
import type { Listing, User } from "../types"

export default function ListingDetailsPage() {
  const { id } = useParams()
  const currentUser = useStore((state) => state.user)

  const [listing, setListing] = useState<Listing | null>(null)
  const [seller, setSeller] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setError(null)

    apiGetListing(id)
      .then((l) => {
        if (cancelled) return
        setListing(l)
        setIsFavorite(l.isFavorite)
        return apiGetUser(l.ownerId)
      })
      .then((s) => {
        if (cancelled && s) return
        if (s) setSeller(s as User)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 404) {
          setError("Listing not found.")
        } else {
          setError(err instanceof Error ? err.message : "Error loading listing")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  const handleToggleFavorite = async () => {
    if (!id || !currentUser) return
    try {
      if (isFavorite) {
        await apiRemoveFavorite(id)
        setIsFavorite(false)
      } else {
        await apiAddFavorite(id)
        setIsFavorite(true)
      }
    } catch {
      // ignore
    }
  }

  const handleStatusChange = async (action: "sold" | "reserved" | "available") => {
    if (!id || !listing) return
    setStatusUpdating(true)
    try {
      let updated: Listing
      if (action === "sold") updated = await apiMarkListingSold(id)
      else if (action === "reserved") updated = await apiMarkListingReserved(id)
      else updated = await apiMarkListingAvailable(id)
      setListing(updated)
    } catch (err) {
      // could show error toast
    } finally {
      setStatusUpdating(false)
    }
  }

  const isOwner = currentUser && listing && currentUser.id === listing.ownerId

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="mt-4 text-slate-400">Loading listing...</p>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Listing not found</h2>
          <p className="text-slate-400 mb-6">{error || "This listing does not exist or has been removed."}</p>
          <Link to="/listings" className="text-indigo-400 hover:text-indigo-300 font-bold">
            Browse all listings
          </Link>
        </div>
      </div>
    )
  }

  const primaryImage = listing.images.find((i) => i.isPrimary)?.url || listing.images[0]?.url

  return (
    <div className="flex-1 px-6 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <Link to="/listings" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-slate-800 bg-slate-900/50">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  No image
                </div>
              )}
            </div>
            {listing.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {listing.images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(index)}
                    className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === index ? "border-indigo-500 scale-95" : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" alt={img.altText || listing.title} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-indigo-400 text-sm font-bold uppercase tracking-widest">{listing.category}</span>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mt-2 mb-4">
                    {listing.title}
                  </h1>
                </div>
                {id && currentUser && (
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all hover:scale-110 ${
                      isFavorite ? "bg-red-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 ${isFavorite ? "fill-current" : ""}`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-3xl font-black text-white">${listing.price}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  listing.status === "available" ? "bg-emerald-500/20 text-emerald-400" :
                  listing.status === "reserved" ? "bg-amber-500/20 text-amber-400" :
                  listing.status === "sold" ? "bg-red-500/20 text-red-400" :
                  "bg-slate-700 text-slate-400"
                }`}>
                  {listing.status}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase">
                  {listing.condition}
                </span>
                <span className="text-slate-500 text-xs">
                  {listing.campusLocation}
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed mb-8 text-lg">
              {listing.description}
            </p>

            {isOwner && listing.status !== "disabled" && listing.status !== "sold" && (
              <div className="bg-[#1e293b]/40 border border-slate-800 p-4 rounded-2xl mb-6">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Manage listing status</p>
                <div className="flex gap-2 flex-wrap">
                  {listing.status !== "available" && (
                    <button
                      onClick={() => handleStatusChange("available")}
                      disabled={statusUpdating}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all"
                    >
                      Mark Available
                    </button>
                  )}
                  {listing.status !== "reserved" && listing.status !== "sold" && (
                    <button
                      onClick={() => handleStatusChange("reserved")}
                      disabled={statusUpdating}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all"
                    >
                      Mark Reserved
                    </button>
                  )}
                  <button
                    onClick={() => handleStatusChange("sold")}
                    disabled={statusUpdating}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all"
                    title="This is final — Sold cannot be reverted"
                  >
                    Mark Sold
                  </button>
                </div>
              </div>
            )}

            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${listing.ownerId}`}
                  alt={seller?.username || "Seller"}
                  className="w-14 h-14 rounded-full bg-indigo-500/20 p-1"
                />
                <div>
                  <h4 className="text-white font-bold">{seller?.fullName || seller?.username || "Unknown"}</h4>
                  <p className="text-slate-400 text-sm">{seller?.program || listing.campusLocation}</p>
                  <p className="text-slate-500 text-xs">Rating: {seller?.rating ?? "—"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
              <Link
                to={!currentUser ? "/login" : isOwner ? "/chat" : `/chat?listingId=${listing.id}`}
                className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-900/20 active:scale-[0.98]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {isOwner ? "View messages" : "Contact Seller"}
              </Link>
              {currentUser && !isOwner && (
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-2xl transition-all border border-slate-700 active:scale-[0.98]"
                >
                  Report
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

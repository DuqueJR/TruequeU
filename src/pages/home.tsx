import { Link } from "react-router-dom"
import { useStore } from "../store/useStore"
import { Items } from "../data/items"
import ListingCard from "../components/listings/ListingCard"
import Profile from "../components/profile/Profile"

const FEATURED_COUNT = 6

export default function HomePage() {
  const storeListings = useStore((state) => state.listings)
  const user = useStore((state) => state.user)

  const listings = [...storeListings, ...Items]
  const featuredListings = listings.slice(0, FEATURED_COUNT)

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 min-w-0">
        {/* Welcome section */}
        <div className="mx-auto max-w-7xl px-6 pt-8 pb-6">
          <div className="bg-linear-to-br from-indigo-600/20 via-slate-800/30 to-transparent border border-slate-800 rounded-2xl p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
              {user
                ? `Hi, ${user.name.split(" ")[0]}!`
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

        {/* Featured listings preview */}
        <div className="mx-auto max-w-7xl px-6 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Featured</h2>
            <Link to="/listings" className="text-indigo-400 hover:text-indigo-300 text-sm font-bold">
              See All →
            </Link>
          </div>
          {featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="bg-[#1e293b]/20 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-slate-400 mb-4">Aún no hay listings publicados.</p>
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
      <aside className="lg:w-80 shrink-0 px-6 lg:px-0">
        <div className="lg:sticky lg:top-24">
          <Profile />
        </div>
      </aside>
    </div>
  )
}

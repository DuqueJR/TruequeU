import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Items } from "../data/items";
import ListingList from "../components/listings/ListingList";

export default function ProfilePage() {
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const storeListings = useStore((state) => state.listings);
  const allListings = [...storeListings, ...Items];
  const myListings = user ? allListings.filter((l) => l.ownerId === user.id) : [];

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-black text-white mb-4">
            Sign in to view your profile
          </h2>
          <p className="text-slate-400 mb-6">
            Create an account or sign in to manage your listings and profile.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                alt={user.name}
                className="w-20 h-20 rounded-full bg-indigo-500/20 p-1 border-2 border-slate-700"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {user.name}
                </h1>
                <p className="text-slate-400">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to="/create"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all"
              >
                + New Listing
              </Link>
              <button
                onClick={() => logout()}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl border border-slate-700 transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold text-white mb-6">My Listings</h2>
          {myListings.length > 0 ? (
            <ListingList listings={myListings} />
          ) : (
            <div className="bg-[#1e293b]/20 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-slate-400 mb-4">You haven't published any listings yet.</p>
              <Link
                to="/create"
                className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all"
              >
                Create your first listing
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

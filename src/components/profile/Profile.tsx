import { Link } from "react-router-dom";
import { useStore } from "../../store/useStore";

export default function Profile() {
  const user = useStore((state) => state.user);

  if (!user) {
    return (
      <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
          Your Profile
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          Sign in to view your profile and manage your listings.
        </p>
        <Link
          to="/login"
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition-all text-sm"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
        Your Profile
      </h3>
      <div className="flex items-center gap-4 mb-4">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
          alt={user.name}
          className="w-14 h-14 rounded-full bg-indigo-500/20 p-1 border border-slate-700"
        />
        <div className="min-w-0">
          <h4 className="text-white font-bold truncate">{user.name}</h4>
          <p className="text-slate-400 text-xs truncate">{user.email}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          to="/profile"
          className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 rounded-xl transition-all text-sm border border-slate-700"
        >
          View Profile
        </Link>
        <Link
          to="/create"
          className="flex-1 text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl transition-all text-sm"
        >
          + New Listing
        </Link>
      </div>
    </div>
  );
}

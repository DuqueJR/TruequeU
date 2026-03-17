import { Link, NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../../store/useStore";

export default function Navbar() {
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const navigate = useNavigate();

  const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-all duration-200 ${
      isActive 
        ? "text-indigo-400 border-b-2 border-indigo-400 pb-1" 
        : "text-slate-400 hover:text-white"
    }`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/listings");
  };

  return (
    <header className="w-full bg-[#0f172a] border-b border-slate-800 sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 gap-8">
        
        <div className="shrink-0">
          <Link to="/" className="text-2xl font-black text-white tracking-tighter">
            Trueque<span className="text-indigo-500">U</span>
          </Link>
        </div>

        <form 
          onSubmit={handleSearch}
          className="flex-1 max-w-xl group relative"
        >
          <input
            type="text"
            //El valor es la searchQuery actual que tenemos en nuestro estado global
            value={searchQuery}
            //Se actualiza en cada cambio
            onChange={(e) => setSearchQuery(e.target.value)}
            //Además esta sincronizado con el home para que cuando se cambie aquí se cambie allá
            placeholder="Search for items, books, services..."
            className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 text-sm rounded-2xl px-5 py-2.5 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 
                       transition-all placeholder:text-slate-500"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        <div className="flex items-center space-x-8 shrink-0">
          <div className="hidden lg:flex space-x-6">
            <NavLink to="/listings" className={navLinkStyles}>
              Listings
            </NavLink>
            <NavLink to="/favorites" className={navLinkStyles}>
              Favorites
            </NavLink>
            <NavLink to="/chat" className={navLinkStyles}>
              Chat
            </NavLink>
            <NavLink to="/profile" className={navLinkStyles}>
              Profile
            </NavLink>
          </div>

          <Link
            to="/create"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white 
                       hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] 
                       transition-all active:scale-95"
          >
            <span className="hidden sm:inline">+ Create Listing</span>
            <span className="sm:hidden">+ Create</span>
          </Link>
        </div>

      </nav>
    </header>
  );
}
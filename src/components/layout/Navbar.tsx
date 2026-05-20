import { Link, NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../../store/useStore";

export default function Navbar() {
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const navigate = useNavigate();

  const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-all duration-200 ${
      isActive 
        ? "text-brand-accent border-b-2 border-brand-accent pb-1" 
        : "text-brand-text hover:text-brand-header"
    }`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/listings");
  };

  return (
    <header className="w-full bg-brand-bg border-b border-brand-border sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 gap-8">
        
        <div className="shrink-0">
          <Link to="/" className="text-2xl font-black text-brand-header tracking-tighter">
            Trueque<span className="text-brand-accent">U</span>
          </Link>
        </div>

        <form 
          onSubmit={handleSearch}
          className="flex-1 max-w-xl group relative"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for items, books, services..."
            className="w-full bg-brand-input/50 border border-brand-input-border text-brand-header/80 text-sm rounded-2xl px-5 py-2.5 
                       focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent 
                       transition-all placeholder:text-brand-text/70"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-text hover:text-brand-accent transition-colors"
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
            className="rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-bold text-white 
                       hover:bg-brand-accent/90 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] 
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

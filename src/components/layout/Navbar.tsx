import { Link, NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../../store/useStore";
import type { ThemeMode } from "../../store/useStore";

export default function Navbar() {
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
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

  const cycleTheme = () => {
    const order: ThemeMode[] = ["dark", "light", "system"];
    const current = order.indexOf(theme);
    setTheme(order[(current + 1) % order.length]);
  };

  const themeIcon = theme === "dark" ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ) : theme === "light" ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

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

        <div className="flex items-center space-x-4 shrink-0">
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

          <button
            type="button"
            onClick={cycleTheme}
            title={`Theme: ${theme}`}
            className="p-2 rounded-xl text-brand-text hover:text-brand-header hover:bg-brand-surface/50 transition-all"
          >
            {themeIcon}
          </button>

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

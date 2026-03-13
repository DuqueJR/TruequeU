export default function Navbar() {
  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <h1 className="text-2xl font-bold text-brand-header tracking-tight">
        TruequeU
      </h1>

      <div className="flex space-x-6 items-center">
        <a href="/listings" className="text-brand-text hover:text-brand-accent transition-colors font-medium">
          Listings
        </a>
        <a href="/profile" className="text-brand-text hover:text-brand-accent transition-colors font-medium">
          Profile
        </a>
      </div>
    </nav>
  );
}
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Efectos de luces de fondo (Blur Orbs) para mantener la profundidad */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="text-center relative z-10 max-w-lg">
        {/* El número 404 con un degradado sutil */}
        <h1 className="text-[10rem] md:text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-800 select-none">
          404
        </h1>
        
        <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800 p-8 md:p-10 rounded-[2.5rem] -mt-12 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Lost in the campus<span className="text-indigo-500">?</span>
          </h2>
          
          <p className="text-slate-400 font-medium mb-8 leading-relaxed">
            The page you are looking for doesn't exist or has been moved to another building. Don't worry, your trades are safe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Botón Principal: Volver al Inicio */}
            <Link
              to="/"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </Link>

            {/* Botón Secundario: Ver Listados */}
            <Link
              to="/listings"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black rounded-2xl transition-all border border-slate-700 active:scale-95 flex items-center justify-center gap-2"
            >
              Browse Listings
            </Link>
          </div>
        </div>

        {/* Decoración inferior */}
        <p className="mt-8 text-slate-600 text-xs font-bold uppercase tracking-[0.3em]">
          TruequeU — 2026 Campus Network
        </p>
      </div>
    </div>
  );
}
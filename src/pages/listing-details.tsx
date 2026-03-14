import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../store/useStore";
import { Items } from "../data/items";

export default function ListingDetailsPage() {
  const { id } = useParams();
  const storeListings = useStore((state) => state.listings);
  const allListings = storeListings.length > 0 ? storeListings : Items;
  const foundListing = allListings.find((l) => l.id === id);

  const [activeImage, setActiveImage] = useState(0);

  // Mock de datos si no se encuentra el listing (fallback)
  const defaultListing = {
    title: "iPad Pro 12.9 M2 - 256GB",
    price: 850,
    description: "Prácticamente nuevo, usado solo para un semestre de diseño gráfico. Incluye Apple Pencil de 2da generación y funda protectora. Busco cambio por MacBook o venta directa.",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000",
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=1000",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000"
    ],
    category: "Electronics",
    condition: "Like New",
    owner: {
      name: "Camilo Andres",
      major: "Industrial Design",
      rating: 4.8,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Camilo"
    }
  };

  const listing = foundListing
    ? {
        title: foundListing.title,
        price: foundListing.price,
        description: foundListing.description,
        images: foundListing.images?.length ? foundListing.images : [defaultListing.images[0]],
        category: foundListing.category,
        condition: foundListing.status || "Like New",
        owner: defaultListing.owner
      }
    : defaultListing;

  return (
    <div className="flex-1 px-6 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        
        {/* Botón Volver */}
        <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* COLUMNA IZQUIERDA: Galería */}
          <div className="space-y-4">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-slate-800 bg-slate-900/50">
              <img 
                src={listing.images[activeImage]} 
                alt={listing.title} 
                className="w-full h-full object-cover animate-fade-in"
              />
            </div>
            <div className="flex gap-4">
              {listing.images.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === index ? "border-indigo-500 scale-95" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="text-indigo-400 text-sm font-bold uppercase tracking-widest">{listing.category}</span>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mt-2 mb-4">
                {listing.title}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black text-white">${listing.price}</span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase">
                  {listing.condition}
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed mb-8 text-lg">
              {listing.description}
            </p>

            {/* Card del Vendedor */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={listing.owner.avatar} className="w-14 h-14 rounded-full bg-indigo-500/20 p-1" />
                <div>
                  <h4 className="text-white font-bold">{listing.owner.name}</h4>
                  <p className="text-slate-400 text-sm">{listing.owner.major}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-yellow-500 font-bold">★ {listing.owner.rating}</div>
                <p className="text-slate-500 text-xs uppercase tracking-tighter">Seller Rating</p>
              </div>
            </div>

            {/* Acciones Finales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
              <Link 
                to={`/chat/${id}`}
                className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-900/20 active:scale-[0.98]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Seller
              </Link>
              <button className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-2xl transition-all border border-slate-700 active:scale-[0.98]">
                Make an Offer
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
import ListingCard from "./ListingCard"
import type { Listing } from '../../types'

interface ListingListProps {
  listings: Listing[];
  emptyMessage?: string;
}

export default function ListingList({ listings, emptyMessage = "No hay listings para mostrar." }: ListingListProps) {
    //Mensaje si no hay listings disponibles actualmente ya sea por la busqueda o por 
    if (listings.length === 0) {
      return (
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="bg-[#1e293b]/20 border border-slate-800 rounded-2xl p-12 text-center">
            <p className="text-slate-400 mb-2">{emptyMessage}</p>
            <p className="text-slate-500 text-sm">
              Intenta con otra búsqueda o crea un nuevo listing.
            </p>
          </div>
        </div>
      );
    }
    //Si hay listings, se muestran en una grid que cambia la cantidad de columnas dependiendo del tamaño de la pantalla
    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
            </section>
        </div>
    )
}
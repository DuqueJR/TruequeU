import { useStore } from "../store/useStore"
import { Items } from "../data/items"
import ListingList from "../components/listings/ListingList"
import Profile from "../components/profile/Profile"

export default function HomePage() {
  const storeListings = useStore((state) => state.listings)
  const searchQuery = useStore((state) => state.searchQuery)

  // Combinar Items iniciales con los creados por el usuario (guardados en store)
  const listings = [...Items, ...storeListings]

  const filteredListings = listings.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 min-w-0">
        <ListingList
          listings={filteredListings}
          emptyMessage={
            listings.length === 0
              ? "Aún no hay listings. ¡Sé el primero en publicar!"
              : "No se encontraron resultados para tu búsqueda."
          }
        />
      </div>
      <aside className="lg:w-80 shrink-0 px-6 lg:px-0">
        <div className="lg:sticky lg:top-24">
          <Profile />
        </div>
      </aside>
    </div>
  )
}
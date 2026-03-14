import { useStore } from "../store/useStore"
import { useState } from "react"

export default function HomePage() {

  const listings = useStore((state) => state.listings)

  const [search, setSearch] = useState("")  //setSearch actualia la busqueda - seState es un hook de React que permite a un componente guardar y actualizar estado interno

  //la función que React te da para actualizar el estado creado con useState.

  const filteredListings = listings.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  return (

    <div>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredListings.map((item) => (

        <div key={item.id}>

          <h3>{item.title}</h3>
          <p>${item.price}</p>

        </div>

      ))}

    </div>
  )
}
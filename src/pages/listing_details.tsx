import { useParams } from "react-router-dom"
import { useStore } from "../store/useStore"



export default function ListingDetailsPage() {
    
        
  const { id } = useParams()

  const listings = useStore((state) => state.listings)

  const item = listings.find((item) => item.id === id)

  if (!item) {
    return <div>Item not found</div>
  }

  return (

    <div>

      <h1>{item.title}</h1>

      <p>{item.description}</p>

      <p>Price: ${item.price}</p>

      {item.images.map((img) => (
        <img key={img} src={img} width="200"/>
      ))}

    </div>
    )
}


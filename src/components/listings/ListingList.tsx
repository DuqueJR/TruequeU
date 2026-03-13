import ListingCard from "./ListingCard"
import type { Listing } from '../../types'

export default function ListingList({ listings }: { listings: Listing[] }) {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
            {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
            ))}
        </section>
    )
}
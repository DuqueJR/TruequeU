import type { Listing } from '../../types'

export default function ListingCard({ listing }: { listing: Listing }) {
    return (
<div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative h-48 w-full">
        <img 
          className="w-full h-full object-cover" 
          src={listing.images[0]} 
          alt={listing.title} 
        />
        {/* Status Badge */}
        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
          {listing.status}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 truncate flex-1">
            {listing.title}
          </h3>
          <p className="text-xl font-bold text-green-600 ml-2">
            ${listing.price.toLocaleString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            View Details
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-red-500">
            ♥
          </button>
        </div>
      </div>
    </div>
    )
}
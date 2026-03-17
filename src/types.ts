//Types allowed for ItemStatus
export type ListingStatus = "available"|"reserved"|"sold";

//All the Listings to sell or buy
export interface Listing  {
    
    "id": string,
    "title": string,
    "description": string,
    "price": number,
    "category": string,
    "condition"?: string,
    "status": ListingStatus,
    "images": string[],
    "ownerId": string,
    "isFavorite": boolean,
    "postedAt"?: string
}

export interface User {
  id: string;
  email: string;
  name: string;
}
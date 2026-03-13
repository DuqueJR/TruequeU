//Types allowed for ItemStatus
export type ListingStatus = "available"|"reserved"|"sold";

//All the items to sell or buy
export interface Listing  {
    
    "id": string,
    "title": string,
    "description": string,
    "price": number,
    "category": string,
    "status": ListingStatus,
    "images": string[],
    "ownerId": string,
    "isFavorite": boolean 
}

export interface User {
  id: string;
  email: string;
  name: string;
}
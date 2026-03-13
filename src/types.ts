

//Types allowed for ItemStatus

export type ItemStatus = "available"|"reserved"|"sold";







//All the items to sell or buy
export interface Item  {
    
    "id": number,
    "title": string,
    "description": string,
    "price": number,
    "category": string,
    "status": ItemStatus,
    "images": string[],
    "ownerId": number,
    "isFavorite": boolean 
}
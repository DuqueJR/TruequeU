export type ListingStatus = "available" | "reserved" | "sold" | "disabled"

export interface ListingImage {
  id: string
  url: string
  isPrimary: boolean
  altText?: string
  displayOrder: number
}

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  status: string
  images: ListingImage[]
  ownerId: string
  postedAt?: string
  isFavorite: boolean
  campusLocation: string
}

export interface User {
  id: string
  username: string
  email: string
  fullName?: string
  program?: string
  bio?: string
  rating: number
}

export interface Conversation {
  id: string
  listingId: string
  buyerId: string
  sellerId: string
  createdAt: string
  lastMessageAt?: string
  lastMessageContent?: string
  unreadCount: number
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  sentAt: string
  isRead: boolean
}

export interface Favorite {
  id: string
  listingId: string
  userId: string
  favoritedAt: string
  listingTitle: string
  listingPrice: number
  listingCategory: string
  listingState: string
}

export interface Report {
  id: string
  reporterUserId: string
  reportedUserId: string
  reportedListingId?: string
  reason: string
  comment: string
  status: string
  resolutionNote?: string
  resolvedAt?: string
  createdAt: string
}

export interface ModerationAction {
  id: string
  moderatorId: string
  targetListingId?: string
  targetUserId?: string
  action: string
  reason: string
  createdAt: string
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ListingFilters {
  keyword?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  state?: string
  postedAfter?: string
  page?: number
  pageSize?: number
}

export interface ApiErrorResponse {
  error: string
}

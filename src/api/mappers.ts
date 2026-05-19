import type { Listing, ListingImage, User, Conversation, Message, Favorite } from '../types'

const CATEGORY_MAP: Record<number, string> = {
  0: 'Books',
  1: 'Electronics',
  2: 'Furniture',
  3: 'Clothing',
  4: 'Other',
}

const CONDITION_MAP: Record<number, string> = {
  0: 'New',
  1: 'LikeNew',
  2: 'UsedGood',
  3: 'UsedFair',
}

const STATE_MAP: Record<number, string> = {
  0: 'available',
  1: 'reserved',
  2: 'sold',
  3: 'disabled',
}

export function categoryToEnum(value: string): number {
  const lower = value.toLowerCase()
  if (lower === 'books') return 0
  if (lower === 'electronics') return 1
  if (lower === 'furniture') return 2
  if (lower === 'clothing') return 3
  return 4
}

export function conditionToEnum(value: string): number {
  const lower = value.toLowerCase()
  if (lower === 'new') return 0
  if (lower === 'likenew' || lower === 'likeNew') return 1
  if (lower === 'usedgood') return 2
  if (lower === 'usedfair') return 3
  return 2
}

function mapCategory(value: number): string {
  return CATEGORY_MAP[value] ?? 'Other'
}

function mapCondition(value: number): string {
  return CONDITION_MAP[value] ?? 'UsedGood'
}

function mapState(value: number): string {
  return STATE_MAP[value] ?? 'available'
}

function mapImage(raw: Record<string, unknown>): ListingImage {
  return {
    id: String(raw.Id ?? raw.id ?? ''),
    url: String(raw.Url ?? raw.url ?? ''),
    isPrimary: Boolean(raw.IsPrimary ?? raw.isPrimary ?? false),
    altText: raw.AltText != null ? String(raw.AltText) : (raw.altText != null ? String(raw.altText) : undefined),
    displayOrder: Number(raw.DisplayOrder ?? raw.displayOrder ?? 0),
  }
}

export function mapListingFromApi(raw: Record<string, unknown>): Listing {
  return {
    id: String(raw.Id ?? raw.id ?? ''),
    title: String(raw.Title ?? raw.title ?? ''),
    description: String(raw.Description ?? raw.description ?? ''),
    price: Number(raw.Price ?? raw.price ?? 0),
    category: mapCategory(Number(raw.Category ?? raw.category ?? 0)),
    condition: mapCondition(Number(raw.Condition ?? raw.condition ?? 0)),
    status: mapState(Number(raw.State ?? raw.state ?? 0)),
    images: Array.isArray(raw.Images)
      ? (raw.Images as Record<string, unknown>[]).map(mapImage)
      : Array.isArray(raw.images)
        ? (raw.images as Record<string, unknown>[]).map(mapImage)
        : [],
    ownerId: String(raw.OwnerId ?? raw.ownerId ?? ''),
    postedAt: raw.CreatedAt != null
      ? String(raw.CreatedAt)
      : raw.createdAt != null
        ? String(raw.createdAt)
        : undefined,
    isFavorite: false,
    campusLocation: String(raw.CampusLocation ?? raw.campusLocation ?? ''),
  }
}

export function mapUserFromApi(raw: Record<string, unknown>): User {
  return {
    id: String(raw.Id ?? raw.id ?? ''),
    username: String(raw.UserName ?? raw.username ?? ''),
    email: String(raw.Email ?? raw.email ?? ''),
    fullName: raw.FullName != null ? String(raw.FullName) : (raw.fullName != null ? String(raw.fullName) : undefined),
    program: raw.Program != null ? String(raw.Program) : (raw.program != null ? String(raw.program) : undefined),
    bio: raw.Bio != null ? String(raw.Bio) : (raw.bio != null ? String(raw.bio) : undefined),
    rating: Number(raw.Rating ?? raw.rating ?? 0),
  }
}

export function mapConversationFromApi(raw: Record<string, unknown>): Conversation {
  return {
    id: String(raw.Id ?? raw.id ?? ''),
    listingId: String(raw.ListingId ?? raw.listingId ?? ''),
    buyerId: String(raw.BuyerId ?? raw.buyerId ?? ''),
    sellerId: String(raw.SellerId ?? raw.sellerId ?? ''),
    createdAt: String(raw.CreatedAt ?? raw.createdAt ?? ''),
    lastMessageAt: raw.LastMessageAt != null ? String(raw.LastMessageAt) : (raw.lastMessageAt != null ? String(raw.lastMessageAt) : undefined),
    lastMessageContent: raw.LastMessageContent != null ? String(raw.LastMessageContent) : (raw.lastMessageContent != null ? String(raw.lastMessageContent) : undefined),
    unreadCount: Number(raw.UnreadCount ?? raw.unreadCount ?? 0),
  }
}

export function mapMessageFromApi(raw: Record<string, unknown>): Message {
  return {
    id: String(raw.Id ?? raw.id ?? ''),
    conversationId: String(raw.ConversationId ?? raw.conversationId ?? ''),
    senderId: String(raw.SenderId ?? raw.senderId ?? ''),
    content: String(raw.Content ?? raw.content ?? ''),
    sentAt: String(raw.SentAt ?? raw.sentAt ?? ''),
    isRead: Boolean(raw.IsRead ?? raw.isRead ?? false),
  }
}

export function mapFavoriteFromApi(raw: Record<string, unknown>): Favorite {
  return {
    id: String(raw.Id ?? raw.id ?? ''),
    listingId: String(raw.ListingId ?? raw.listingId ?? ''),
    userId: String(raw.UserId ?? raw.userId ?? ''),
    favoritedAt: String(raw.FavoritedAt ?? raw.favoritedAt ?? ''),
    listingTitle: String(raw.ListingTitle ?? raw.listingTitle ?? ''),
    listingPrice: Number(raw.ListingPrice ?? raw.listingPrice ?? 0),
    listingCategory: mapCategory(Number(raw.ListingCategory ?? raw.listingCategory ?? 0)),
    listingState: mapState(Number(raw.ListingState ?? raw.listingState ?? 0)),
  }
}

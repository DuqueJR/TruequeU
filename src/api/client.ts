import type { ListingFilters, PagedResult, Listing, User, Conversation, Message, Favorite } from '../types'
import {
  mapListingFromApi,
  mapUserFromApi,
  mapConversationFromApi,
  mapMessageFromApi,
  mapFavoriteFromApi,
  categoryToEnum,
  conditionToEnum,
} from './mappers'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5274/api'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new ApiError(response.status, body.error || body.title || response.statusText)
  }

  if (response.status === 204) return undefined as T
  return response.json()
}

// ── Auth ──────────────────────────────────────────────

export async function apiLogin(email: string, password: string): Promise<User> {
  const raw = await apiFetch<Record<string, unknown>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ Email: email, Password: password }),
  })
  return mapUserFromApi(raw)
}

export async function apiRegister(data: {
  userName: string
  email: string
  password: string
  fullName?: string
}): Promise<User> {
  const raw = await apiFetch<Record<string, unknown>>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      UserName: data.userName,
      Email: data.email,
      Password: data.password,
      FullName: data.fullName,
    }),
  })
  return mapUserFromApi(raw)
}

export async function apiLogout(): Promise<void> {
  await apiFetch('/auth/logout', { method: 'POST' })
}

export async function apiGetCurrentUser(): Promise<User> {
  const raw = await apiFetch<Record<string, unknown>>('/auth/me')
  return mapUserFromApi(raw)
}

// ── Users ─────────────────────────────────────────────

export async function apiGetUser(id: string): Promise<User> {
  const raw = await apiFetch<Record<string, unknown>>(`/users/${id}`)
  return mapUserFromApi(raw)
}

export async function apiGetUserProfile(): Promise<User> {
  const raw = await apiFetch<Record<string, unknown>>('/users/profile')
  return mapUserFromApi(raw)
}

export async function apiUpdateProfile(data: Record<string, unknown>): Promise<User> {
  const raw = await apiFetch<Record<string, unknown>>('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return mapUserFromApi(raw)
}

// ── Listings ──────────────────────────────────────────

export async function apiGetListings(
  filters: ListingFilters = {},
): Promise<PagedResult<Listing>> {
  const params = new URLSearchParams()
  if (filters.keyword) params.set('keyword', filters.keyword)
  if (filters.category) params.set('category', String(categoryToEnum(filters.category)))
  if (filters.minPrice != null) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice))
  if (filters.condition) params.set('condition', String(conditionToEnum(filters.condition)))
  if (filters.state) params.set('state', filters.state)
  if (filters.postedAfter) params.set('postedAfter', filters.postedAfter)
  params.set('page', String(filters.page ?? 1))
  params.set('pageSize', String(filters.pageSize ?? 20))

  const raw = await apiFetch<{ items: Record<string, unknown>[]; totalCount: number; page: number; pageSize: number; totalPages: number }>(
    `/listings?${params}`,
  )
  return {
    ...raw,
    items: raw.items.map(mapListingFromApi),
  }
}

export async function apiGetListing(id: string): Promise<Listing> {
  const raw = await apiFetch<Record<string, unknown>>(`/listings/${id}`)
  return mapListingFromApi(raw)
}

export async function apiGetMyListings(): Promise<Listing[]> {
  const raw = await apiFetch<Record<string, unknown>[]>('/listings/my')
  return raw.map(mapListingFromApi)
}

export async function apiCreateListing(data: {
  title: string
  description: string
  price: number
  category: number
  condition: number
  campusLocation: string
  imageUrls: string[]
}): Promise<Listing> {
  const raw = await apiFetch<Record<string, unknown>>('/listings', {
    method: 'POST',
    body: JSON.stringify({
      Title: data.title,
      Description: data.description,
      Price: data.price,
      Category: data.category,
      Condition: data.condition,
      CampusLocation: data.campusLocation,
      ImageUrls: data.imageUrls,
    }),
  })
  return mapListingFromApi(raw)
}

export async function apiUpdateListing(
  id: string,
  data: Record<string, unknown>,
): Promise<Listing> {
  const raw = await apiFetch<Record<string, unknown>>(`/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return mapListingFromApi(raw)
}

export async function apiDeleteListing(id: string): Promise<void> {
  await apiFetch(`/listings/${id}`, { method: 'DELETE' })
}

export async function apiMarkListingSold(id: string): Promise<Listing> {
  const raw = await apiFetch<Record<string, unknown>>(`/listings/${id}/sold`, { method: 'PATCH' })
  return mapListingFromApi(raw)
}

export async function apiMarkListingReserved(id: string): Promise<Listing> {
  const raw = await apiFetch<Record<string, unknown>>(`/listings/${id}/reserved`, { method: 'PATCH' })
  return mapListingFromApi(raw)
}

export async function apiMarkListingAvailable(id: string): Promise<Listing> {
  const raw = await apiFetch<Record<string, unknown>>(`/listings/${id}/available`, { method: 'PATCH' })
  return mapListingFromApi(raw)
}

// ── Favorites ─────────────────────────────────────────

export async function apiAddFavorite(listingId: string): Promise<Favorite> {
  const raw = await apiFetch<Record<string, unknown>>(`/listings/${listingId}/favorite`, { method: 'POST' })
  return mapFavoriteFromApi(raw)
}

export async function apiRemoveFavorite(listingId: string): Promise<void> {
  await apiFetch(`/listings/${listingId}/favorite`, { method: 'DELETE' })
}

export async function apiGetFavorites(): Promise<Favorite[]> {
  const raw = await apiFetch<Record<string, unknown>[]>('/favorites')
  return raw.map(mapFavoriteFromApi)
}

// ── Conversations ─────────────────────────────────────

export async function apiGetConversations(): Promise<Conversation[]> {
  const raw = await apiFetch<Record<string, unknown>[]>('/conversations')
  return raw.map(mapConversationFromApi)
}

export async function apiGetConversation(id: string): Promise<Conversation> {
  const raw = await apiFetch<Record<string, unknown>>(`/conversations/${id}`)
  return mapConversationFromApi(raw)
}

export async function apiCreateConversation(data: {
  listingId: string
  content: string
}): Promise<Conversation> {
  const raw = await apiFetch<Record<string, unknown>>('/conversations', {
    method: 'POST',
    body: JSON.stringify({ ListingId: data.listingId, Content: data.content }),
  })
  return mapConversationFromApi(raw)
}

export async function apiDeleteConversation(id: string): Promise<void> {
  await apiFetch(`/conversations/${id}`, { method: 'DELETE' })
}

export async function apiGetMessages(conversationId: string): Promise<Message[]> {
  const raw = await apiFetch<Record<string, unknown>[]>(`/conversations/${conversationId}/messages`)
  return raw.map(mapMessageFromApi)
}

export async function apiSendMessage(
  conversationId: string,
  content: string,
): Promise<Message> {
  const raw = await apiFetch<Record<string, unknown>>(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ Content: content }),
  })
  return mapMessageFromApi(raw)
}

// ── Reports ───────────────────────────────────────────

export async function apiCreateReport(data: {
  reportedUserId: string
  reportedListingId?: string
  reason: string
  comment: string
}): Promise<Record<string, unknown>> {
  return apiFetch('/reports', {
    method: 'POST',
    body: JSON.stringify({
      ReportedUserId: data.reportedUserId,
      ReportedListingId: data.reportedListingId,
      Reason: data.reason,
      Comment: data.comment,
    }),
  })
}

export async function apiGetReports(): Promise<Record<string, unknown>[]> {
  return apiFetch('/reports')
}

export async function apiGetReport(id: string): Promise<Record<string, unknown>> {
  return apiFetch(`/reports/${id}`)
}

export async function apiResolveReport(
  id: string,
  resolutionNote: string,
): Promise<Record<string, unknown>> {
  return apiFetch(`/reports/${id}/resolve`, {
    method: 'PATCH',
    body: JSON.stringify({ ResolutionNote: resolutionNote }),
  })
}

// ── Moderation ────────────────────────────────────────

export async function apiHideListing(
  listingId: string,
  reason: string,
): Promise<Record<string, unknown>> {
  return apiFetch(`/moderation/listings/${listingId}/hide`, {
    method: 'POST',
    body: JSON.stringify({ Reason: reason }),
  })
}

export async function apiUnhideListing(
  listingId: string,
  reason: string,
): Promise<Record<string, unknown>> {
  return apiFetch(`/moderation/listings/${listingId}/unhide`, {
    method: 'POST',
    body: JSON.stringify({ Reason: reason }),
  })
}

export async function apiSuspendUser(
  userId: string,
  reason: string,
): Promise<Record<string, unknown>> {
  return apiFetch(`/moderation/users/${userId}/suspend`, {
    method: 'POST',
    body: JSON.stringify({ Reason: reason }),
  })
}

export async function apiUnsuspendUser(
  userId: string,
  reason: string,
): Promise<Record<string, unknown>> {
  return apiFetch(`/moderation/users/${userId}/unsuspend`, {
    method: 'POST',
    body: JSON.stringify({ Reason: reason }),
  })
}

export async function apiGetModerationHistory(
  page = 1,
  pageSize = 20,
): Promise<{ actions: Record<string, unknown>[]; totalCount: number }> {
  return apiFetch(`/moderation/history?page=${page}&pageSize=${pageSize}`)
}

/**
 * API Client - Funciones que hacen fetch() a las rutas /api/*
 *
 * MSW intercepta estas peticiones y devuelve las respuestas mock.
 * Todas las funciones son async y devuelven Promises.
 */

import type { User } from "../types";
import type { Listing } from "../types";

const API_BASE = ""; // Rutas relativas: /api/... (MSW intercepta en el mismo origen)

// --- Auth ---

export async function apiLogin(
  email: string,
  password: string
): Promise<{ data?: User; error?: string }> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) return { error: json.error ?? "Error al iniciar sesión" };
  return { data: json.data };
}

export async function apiRegister(data: {
  email: string;
  name: string;
  password: string;
}): Promise<{ data?: User; error?: string }> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) return { error: json.error ?? "Error al registrar" };
  return { data: json.data };
}

export async function apiCheckEmail(email: string): Promise<{ taken: boolean }> {
  const res = await fetch(
    `${API_BASE}/api/auth/check-email?email=${encodeURIComponent(email)}`
  );
  const json = await res.json();
  return { taken: json.taken ?? false };
}

// --- Listings ---

export async function apiGetListings(): Promise<{ data: Listing[] }> {
  const res = await fetch(`${API_BASE}/api/listings`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Error al cargar listings");
  return { data: json.data ?? [] };
}

export async function apiGetListing(
  id: string
): Promise<{ data?: Listing; error?: string }> {
  const res = await fetch(`${API_BASE}/api/listings/${id}`);
  const json = await res.json();
  if (!res.ok) return { error: json.error ?? "Listing no encontrado" };
  return { data: json.data };
}

export async function apiCreateListing(
  listing: Omit<Listing, "id" | "isFavorite" | "postedAt">
): Promise<{ data?: Listing; error?: string }> {
  const res = await fetch(`${API_BASE}/api/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(listing),
  });
  const json = await res.json();
  if (!res.ok) return { error: json.error ?? "Error al crear listing" };
  return { data: json.data };
}

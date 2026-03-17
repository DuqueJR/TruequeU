/**
 * MSW Handlers - Define qué URLs interceptar y qué respuesta devolver
 *
 * Cada handler usa:
 * - http.get/post() para la ruta
 * - ctx.delay(ms) para simular latencia de red
 * - ctx.json() para devolver JSON
 * - ctx.status() para códigos de error
 */

import { http, HttpResponse, delay, passthrough } from "msw";
import type { User } from "../types";
import type { Listing } from "../types";
import { users } from "../data/users";
import { Items } from "../data/items";

// --- Estado en memoria (simula base de datos del backend) ---
// Los usuarios registrados se pierden al refrescar; los de users.ts siempre existen
const registeredUsers: Array<User & { password: string }> = [];

// Listings creados por usuarios (se pierden al refrescar; Items es el seed fijo)
const createdListings: Listing[] = [];

// --- Handlers de Auth ---

export const authHandlers = [
  // POST /api/auth/login - Valida credenciales y devuelve usuario o error
  http.post("/api/auth/login", async ({ request }) => {
    await delay(400); // Simula ~400ms de latencia

    const body = (await request.json()) as { email?: string; password?: string };
    const email = (body.email ?? "").toLowerCase().trim();
    const password = body.password ?? "";

    // Buscar en usuarios seed
    const fromSeed = users.find((u) => u.email.toLowerCase() === email);
    if (fromSeed && fromSeed.password === password) {
      return HttpResponse.json({
        data: { id: fromSeed.id, email: fromSeed.email, name: fromSeed.name },
      });
    }

    // Buscar en usuarios registrados (en memoria)
    const fromRegistered = registeredUsers.find((u) => u.email === email);
    if (fromRegistered && fromRegistered.password === password) {
      return HttpResponse.json({
        data: { id: fromRegistered.id, email: fromRegistered.email, name: fromRegistered.name },
      });
    }

    return HttpResponse.json(
      { error: "Email o contraseña incorrectos. Regístrate si no tienes cuenta." },
      { status: 401 }
    );
  }),

  // POST /api/auth/register - Crea usuario nuevo
  http.post("/api/auth/register", async ({ request }) => {
    await delay(500);

    const body = (await request.json()) as { email?: string; name?: string; password?: string };
    const email = (body.email ?? "").toLowerCase().trim();
    const name = (body.name ?? "").trim();
    const password = body.password ?? "";

    // Validar que el email no esté tomado
    const taken =
      users.some((u) => u.email.toLowerCase() === email) ||
      registeredUsers.some((u) => u.email === email);
    if (taken) {
      return HttpResponse.json(
        { error: "Este correo ya está registrado" },
        { status: 409 }
      );
    }

    const newUser: User & { password: string } = {
      id: `u${Date.now()}`,
      email,
      name,
      password,
    };
    registeredUsers.push(newUser);

    return HttpResponse.json({
      data: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  }),

  // GET /api/auth/check-email?email=x - Verifica si el email está tomado
  http.get("/api/auth/check-email", async ({ request }) => {
    await delay(200);

    const url = new URL(request.url);
    const email = (url.searchParams.get("email") ?? "").toLowerCase().trim();
    const taken =
      users.some((u) => u.email.toLowerCase() === email) ||
      registeredUsers.some((u) => u.email === email);

    return HttpResponse.json({ taken });
  }),
];

// --- Handlers de Listings ---

export const listingHandlers = [
  // GET /api/listings - Devuelve todos los listings (seed + creados)
  http.get("/api/listings", async () => {
    await delay(300);

    const all = [...Items, ...createdListings];
    return HttpResponse.json({ data: all });
  }),

  // GET /api/listings/:id - Devuelve un listing por ID
  http.get("/api/listings/:id", async ({ params }) => {
    await delay(200);

    const all = [...Items, ...createdListings];
    const listing = all.find((l) => l.id === params.id);
    if (!listing) {
      return HttpResponse.json({ error: "Listing no encontrado" }, { status: 404 });
    }
    return HttpResponse.json({ data: listing });
  }),

  // POST /api/listings - Crea un listing nuevo
  http.post("/api/listings", async ({ request }) => {
    await delay(600);

    const body = (await request.json()) as Partial<Listing>;
    const listing: Listing = {
      id: `listing-${Date.now()}`,
      title: body.title ?? "",
      description: body.description ?? "",
      price: body.price ?? 0,
      category: body.category ?? "Other",
      condition: body.condition ?? "good",
      status: "available",
      images: body.images?.length ? body.images : ["https://via.placeholder.com/400"],
      ownerId: body.ownerId ?? "",
      isFavorite: false,
      postedAt: new Date().toISOString().slice(0, 10),
    };
    createdListings.push(listing);

    return HttpResponse.json({ data: listing });
  }),
];

// Handler catch-all: deja pasar cualquier petición que no sea /api
// Evita errores "Failed to fetch" en navegación/prefetch (ej. /login)
const passthroughHandler = http.all("*", () => passthrough());

// Los handlers de API van primero; el catch-all solo atrapa lo que no coincida
export const handlers = [...authHandlers, ...listingHandlers, passthroughHandler];

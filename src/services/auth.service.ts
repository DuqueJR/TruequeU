import type { User } from "../types";
import { users } from "../data/users";

const STORAGE_KEY = "trueque-registered-users";

interface StoredUser extends User {
  password: string;
}

function getStoredUsers(): StoredUser[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(list: StoredUser[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function validateLogin(email: string, password: string): User | null {
  const stored = getStoredUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );
  if (stored && stored.password === password) {
    return { id: stored.id, email: stored.email, name: stored.name };
  }

  const fromData = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );
  if (fromData && fromData.password === password) {
    return { id: fromData.id, email: fromData.email, name: fromData.name };
  }
  return null;
}

export function registerUser(data: {
  email: string;
  name: string;
  password: string;
}): User {
  const list = getStoredUsers();
  const newUser: StoredUser = {
    id: `u${Date.now()}`,
    email: data.email.toLowerCase().trim(),
    name: data.name.trim(),
    password: data.password,
  };
  list.push(newUser);
  saveStoredUsers(list);
  return { id: newUser.id, email: newUser.email, name: newUser.name };
}

export function isEmailTaken(email: string): boolean {
  const emailLower = email.toLowerCase().trim();
  if (users.some((u) => u.email.toLowerCase() === emailLower)) return true;
  return getStoredUsers().some((u) => u.email.toLowerCase() === emailLower);
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: "Mínimo 8 caracteres" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Debe incluir una mayúscula" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Debe incluir una minúscula" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Debe incluir un número" };
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return { valid: false, message: "Debe incluir un carácter especial" };
  }
  return { valid: true, message: "" };
}

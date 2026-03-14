import type { User } from "../types";

export interface UserWithPassword extends User {
  password: string;
}

export const users: UserWithPassword[] = [
  { id: "u1", email: "juan.perez@eia.edu.co", name: "Juan Pérez", password: "Juan123!" },
  { id: "u2", email: "laura.gomez@eia.edu.co", name: "Laura Gómez", password: "Laura123!" },
  { id: "u3", email: "carlos.rodriguez@eia.edu.co", name: "Carlos Rodríguez", password: "Carlos123!" },
  { id: "u4", email: "andrea.martinez@eia.edu.co", name: "Andrea Martínez", password: "Andrea123!" },
  { id: "u5", email: "sebastian.lopez@eia.edu.co", name: "Sebastián López", password: "Sebastian123!" },
  { id: "u6", email: "camila.ramirez@eia.edu.co", name: "Camila Ramírez", password: "Camila123!" },
  { id: "u7", email: "daniel.torres@eia.edu.co", name: "Daniel Torres", password: "Daniel123!" },
  { id: "u8", email: "valentina.castro@eia.edu.co", name: "Valentina Castro", password: "Valentina123!" },
  { id: "u9", email: "felipe.herrera@eia.edu.co", name: "Felipe Herrera", password: "Felipe123!" },
  { id: "u10", email: "sofia.moreno@eia.edu.co", name: "Sofía Moreno", password: "Sofia123!" },
];
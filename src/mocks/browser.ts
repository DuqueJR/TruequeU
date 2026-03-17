/**
 * MSW Browser Setup
 *
 * setupWorker() crea el "worker" que intercepta peticiones en el navegador.
 * Se usa solo en desarrollo; en producción no cargaríamos MSW.
 */

import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

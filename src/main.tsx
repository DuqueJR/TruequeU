import { StrictMode } from 'react' //Detectar problemas durante el desarrollo
import { createRoot } from 'react-dom/client' //función que conecta React con el DOM del navegador.
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom" //HABILITA EL SISTEMA DE RUTAS DE REACT
import { worker } from './mocks/browser'

// Iniciar MSW antes de renderizar la app (solo en desarrollo)
// worker.start() devuelve una Promise; esperamos a que esté listo
async function bootstrap() {
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: false,
    serviceWorker: { url: "/mockServiceWorker.js" },
  })
  const root = document.getElementById('root')!
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
}

bootstrap()

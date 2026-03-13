import { StrictMode } from 'react' //Detectar problemas durante el desarrollo
import { createRoot } from 'react-dom/client' //función que conecta React con el DOM del navegador.
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom" //hABILITA EL SISTEMA DE RUATAS DE REACT

//Renderiza el index.html
createRoot(document.getElementById('root')!).render(
  <StrictMode>  
      <BrowserRouter>
        <App />
    </BrowserRouter>
  </StrictMode>,
)
//<BrowserRouter> Activa el sistema de navegacion basado en rutas </BrowserRouter>

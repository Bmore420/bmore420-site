import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const redirected = sessionStorage.redirect
if (redirected && redirected !== location.href) {
  delete sessionStorage.redirect
  const url = new URL(redirected)
  if (url.origin === location.origin) {
    history.replaceState(null, '', url.pathname + url.search + url.hash)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

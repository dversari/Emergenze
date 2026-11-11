import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Nuove versioni attive subito; controllo a ogni ritorno sull'app.
const aggiorna = registerSW({
  immediate: true,
  onNeedRefresh() {
    aggiorna(true)
  },
  onRegisteredSW(_url, reg) {
    if (!reg) return
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') reg.update().catch(() => {})
    })
  },
})

// iOS (soprattutto app installata): dopo la tastiera o uno zoom la barra fissa in basso può restare a metà schermo.
// Un piccolo «riallineamento» dello scroll quando la tastiera si chiude o il viewport cambia la rimette a posto.
const riallinea = () => setTimeout(() => window.scrollTo(window.scrollX, window.scrollY), 60)
document.addEventListener('focusout', (e) => {
  const t = e.target as HTMLElement | null
  if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) riallinea()
})
window.visualViewport?.addEventListener('resize', riallinea)
window.addEventListener('orientationchange', riallinea)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

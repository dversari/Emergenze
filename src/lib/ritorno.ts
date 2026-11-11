import { createContext, useContext } from 'react'
import { useLocation } from 'react-router-dom'

/*
 * Collegamenti «con ritorno»: dai PDTA ai calcolatori, antibiotici, procedure…
 * Il link porta con sé da dove si arriva; l'app mostra «← Torna a …» e,
 * tornando, il PDTA riprende dallo stesso punto della pagina.
 */

export interface Provenienza { to: string; etichetta: string }
export const RitornoCtx = createContext<string | null>(null)

/** Stato da passare a <Link state={...}> e funzione da chiamare al clic. */
export function useConRitorno() {
  const etichetta = useContext(RitornoCtx)
  const loc = useLocation()
  if (!etichetta) return { state: undefined, onClick: undefined }
  const da: Provenienza = { to: loc.pathname + loc.search, etichetta }
  return {
    state: { da },
    onClick: () => { try { sessionStorage.setItem('scroll:' + loc.pathname, String(window.scrollY)) } catch { /* */ } },
  }
}

/** Da chiamare nella pagina di partenza: ripristina lo scroll salvato. */
export function riprendiScroll(pathname: string) {
  try {
    const y = sessionStorage.getItem('scroll:' + pathname)
    if (y === null) return
    sessionStorage.removeItem('scroll:' + pathname)
    requestAnimationFrame(() => setTimeout(() => window.scrollTo(0, Number(y)), 30))
  } catch { /* */ }
}

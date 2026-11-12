import { useEffect, useRef } from 'react'
import { HashRouter, Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import type { Provenienza } from './lib/ritorno'
import Home from './pages/Home'
import Acr from './pages/Acr'
import Calcolatori from './pages/Calcolatori'
import Antibiotici from './pages/Antibiotici'
import Rubrica from './pages/Rubrica'
import Procedure from './pages/Procedure'
import Turni from './pages/Turni'
import Moduli from './pages/Moduli'
import ModuloTrasfusione from './pages/ModuloTrasfusione'
import ModuloTrasferimento from './pages/ModuloTrasferimento'
import PaginaTesti from './components/PaginaTesti'
import { DIMISSIONI } from './lib/dimissioni'
import { ANAMNESI } from './lib/anamnesi'
import PaginaSchede from './components/PaginaSchede'
import { SEDAZIONE } from './lib/schede'
import { ElencoLineeGuida, RiassuntoLineaGuida } from './pages/LineeGuida'
import Monogramma from './components/Monogramma'
import { PopupEcg } from './components/EcgEquivalenti'

declare const __VERSIONE__: string

const schede = [
  { to: '/rubrica', label: 'Rubrica', icona: '☎\uFE0E' },
  { to: '/linee-guida', label: 'PDTA', icona: '▤︎' },
  { to: '/calcolatori', label: 'Calcolatori', icona: '±' },
  { to: '/antibiotici', label: 'Antibiotici', icona: '℞' },
  { to: '/procedure', label: 'Procedure', icona: '⌖' },
  { to: '/sedazione', label: 'Sedazione', icona: '☾\uFE0E' },
  { to: '/anamnesi', label: 'Cartella', icona: '☰\uFE0E' },
  { to: '/dimissioni', label: 'Dimissione', icona: '✎\uFE0E' },
  { to: '/moduli', label: 'Moduli', icona: '⎙\uFE0E' },
  { to: '/turni', label: 'Turni', icona: '▦\uFE0E' },
]

/** Intestazione in alto, schede in basso a portata di pollice. */
function Guscio() {
  const barra = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  useEffect(() => {
    const el = barra.current?.querySelector('.attiva-si') as HTMLElement | null
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [pathname])
  return (
    <div className="min-h-screen bg-fondo text-testo">
      <header className="px-4 pt-[calc(14px+env(safe-area-inset-top))] pb-2 sticky top-0 bg-fondo/95 backdrop-blur z-10 flex items-center gap-2.5 lg:px-8 lg:pt-4 lg:pb-3 lg:border-b lg:border-linea">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Pagina iniziale">
          <img src="./favicon.svg" alt="" className="w-8 h-8" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-bordeaux font-bold leading-none">PS Prato</p>
            <h1 className="font-extrabold text-2xl tracking-tight leading-none">DEA-LIRIO</h1>
          </div>
        </Link>
        <span className="ml-auto text-[9.5px] text-tenue text-right leading-tight">versione<br />{__VERSIONE__}</span>
        <Link to="/acr" className="shrink-0 rounded-full bg-bordeaux text-white text-[12px] font-black px-3 py-2 leading-none shadow-sm active:opacity-80" aria-label="Timer arresto cardiaco">
          ⏱ ACR
        </Link>
      </header>

      <main className="px-3.5 py-3 pb-[calc(104px+env(safe-area-inset-bottom))] max-w-3xl mx-auto lg:ml-56 lg:mr-0 lg:max-w-none lg:px-8 lg:py-5 lg:pb-10">
        <div className="lg:max-w-[1400px] lg:mx-auto">
        <Outlet />
        </div>
        <TornaA />
        <PopupEcg />
      </main>

      <nav className="hidden lg:flex fixed left-0 top-[63px] bottom-0 w-56 z-20 flex-col gap-1 border-r border-linea bg-fondo px-3 py-4">
        {schede.map((s) => (
          <NavLink key={s.to} to={s.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-bold transition-colors ${
                isActive ? 'bg-verde text-white' : 'text-tenue hover:bg-sabbia hover:text-testo'}`}>
            <span className="w-6 text-center text-lg leading-none">{s.icona}</span>
            {s.label}
          </NavLink>
        ))}
        <div className="mt-auto flex items-center gap-2 px-3 text-[11px] text-tenue"><Monogramma size={28} /> DEA-LIRIO · PS Prato</div>
      </nav>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-fondo/95 backdrop-blur-md border-t border-linea pt-2 pb-[max(14px,calc(env(safe-area-inset-bottom)+6px))]">
        <div ref={barra} className="flex gap-1 overflow-x-auto snap-x px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {schede.map((s) => (
            <NavLink key={s.to} to={s.to}
              className={({ isActive }) =>
                `attiva-${isActive ? 'si' : 'no'} snap-start shrink-0 min-w-[68px] flex flex-col items-center justify-center gap-1 rounded-[14px] px-2 py-2 text-[11px] font-bold transition-colors ${
                  isActive ? 'bg-verde text-white' : 'text-tenue'}`}>
              <span className="text-[22px] leading-none">{s.icona}</span>
              {s.label}
            </NavLink>
          ))}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-fondo to-transparent" />
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Guscio />}>
          <Route index element={<Home />} />
          <Route path="calcolatori" element={<Calcolatori />} />
          <Route path="acr" element={<Acr />} />
          <Route path="antibiotici" element={<Antibiotici />} />
          <Route path="procedure" element={<Procedure />} />
          <Route path="sedazione" element={<PaginaSchede key="s" schede={SEDAZIONE} segnaposto="Cerca uno schema…" />} />
          <Route path="anamnesi" element={<PaginaTesti key="a" voci={ANAMNESI} prefisso="anamnesi" segnaposto="Cerca un sintomo…" nota="Testo da adattare al paziente prima di copiarlo in cartella; cancella la sezione «Da non dimenticare» se non serve." />} />
          <Route path="dimissioni" element={<PaginaTesti key="d" voci={DIMISSIONI} prefisso="dimissione" segnaposto="Cerca una diagnosi…" nota="Dosi per adulto: verificare allergie, funzione renale, gravidanza e terapie in corso." />} />
          <Route path="rubrica" element={<Rubrica />} />
          <Route path="turni" element={<Turni />} />
          <Route path="moduli" element={<Moduli />} />
          <Route path="modulo-trasfusione" element={<ModuloTrasfusione />} />
          <Route path="modulo-trasferimento" element={<ModuloTrasferimento />} />
          <Route path="linee-guida" element={<ElencoLineeGuida />} />
          <Route path="linee-guida/:id" element={<RiassuntoLineaGuida />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

/** Pulsante «← Torna a …» quando si arriva da un PDTA. */
function TornaA() {
  const loc = useLocation()
  const nav = useNavigate()
  const da = (loc.state as { da?: Provenienza } | null)?.da
  if (!da) return null
  return (
    <button onClick={() => (window.history.length > 1 ? nav(-1) : nav(da.to))}
      className="fixed left-1/2 lg:left-[calc(50%+7rem)] -translate-x-1/2 bottom-[86px] lg:bottom-6 z-30 rounded-full bg-verde-scuro text-white text-[13px] font-extrabold px-4 py-2.5 shadow-lg max-w-[90vw] truncate active:opacity-80">
      ← Torna a {da.etichetta}
    </button>
  )
}

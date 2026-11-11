import { HashRouter, Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import type { Provenienza } from './lib/ritorno'
import Home from './pages/Home'
import Acr from './pages/Acr'
import Calcolatori from './pages/Calcolatori'
import Antibiotici from './pages/Antibiotici'
import Rubrica from './pages/Rubrica'
import PaginaTesti from './components/PaginaTesti'
import { DIMISSIONI } from './lib/dimissioni'
import { ANAMNESI } from './lib/anamnesi'
import PaginaSchede from './components/PaginaSchede'
import { PROCEDURE, SEDAZIONE } from './lib/schede'
import { ElencoLineeGuida, RiassuntoLineaGuida } from './pages/LineeGuida'

declare const __VERSIONE__: string

const schede = [
  { to: '/calcolatori', label: 'Calcolatori', icona: '±' },
  { to: '/antibiotici', label: 'Antibiotici', icona: '℞' },
  { to: '/procedure', label: 'Procedure', icona: '⌖' },
  { to: '/sedazione', label: 'Sedazione', icona: '☾\uFE0E' },
  { to: '/linee-guida', label: 'PDTA', icona: '▤︎' },
  { to: '/anamnesi', label: 'Anamnesi', icona: '☰\uFE0E' },
  { to: '/dimissioni', label: 'Dimissioni', icona: '✎\uFE0E' },
  { to: '/rubrica', label: 'Rubrica', icona: '☎\uFE0E' },
]

/** Intestazione in alto, schede in basso a portata di pollice. */
function Guscio() {
  return (
    <div className="min-h-screen bg-fondo text-testo">
      <header className="px-4 pt-[calc(14px+env(safe-area-inset-top))] pb-2 sticky top-0 bg-fondo/95 backdrop-blur z-10 flex items-center gap-2.5">
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

      <main className="px-3.5 py-3 pb-[calc(90px+env(safe-area-inset-bottom))] max-w-3xl mx-auto">
        <Outlet />
        <TornaA />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-20 bg-fondo/95 backdrop-blur-md border-t border-linea px-2 pt-2 pb-[max(14px,calc(env(safe-area-inset-bottom)+6px))]">
        <div className="grid grid-cols-8 gap-0 max-w-lg mx-auto">
          {schede.map((s) => (
            <NavLink key={s.to} to={s.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 rounded-[12px] py-1.5 text-[8.5px] font-bold tracking-tighter transition-colors ${
                  isActive ? 'bg-verde text-white' : 'text-tenue'}`}>
              <span className="text-lg leading-none">{s.icona}</span>
              {s.label}
            </NavLink>
          ))}
        </div>
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
          <Route path="procedure" element={<PaginaSchede key="p" schede={PROCEDURE} segnaposto="Cerca una procedura…" />} />
          <Route path="sedazione" element={<PaginaSchede key="s" schede={SEDAZIONE} segnaposto="Cerca uno schema…" />} />
          <Route path="anamnesi" element={<PaginaTesti key="a" voci={ANAMNESI} prefisso="anamnesi" segnaposto="Cerca un sintomo…" nota="Testo da adattare al paziente prima di copiarlo in cartella; cancella la sezione «Da non dimenticare» se non serve." />} />
          <Route path="dimissioni" element={<PaginaTesti key="d" voci={DIMISSIONI} prefisso="dimissione" segnaposto="Cerca una diagnosi…" nota="Dosi per adulto: verificare allergie, funzione renale, gravidanza e terapie in corso." />} />
          <Route path="rubrica" element={<Rubrica />} />
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
      className="fixed left-1/2 -translate-x-1/2 bottom-[86px] z-30 rounded-full bg-verde-scuro text-white text-[13px] font-extrabold px-4 py-2.5 shadow-lg max-w-[90vw] truncate active:opacity-80">
      ← Torna a {da.etichetta}
    </button>
  )
}

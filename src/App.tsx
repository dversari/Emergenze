import { HashRouter, NavLink, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Calcolatori from './pages/Calcolatori'
import Antibiotici from './pages/Antibiotici'
import { ElencoLineeGuida, RiassuntoLineaGuida } from './pages/LineeGuida'

const schede = [
  { to: '/', label: 'Calcolatori', icona: '±', end: true },
  { to: '/antibiotici', label: 'Antibiotici', icona: '℞' },
  { to: '/linee-guida', label: 'Linee guida', icona: '▤︎' },
]

/** Intestazione in alto, schede in basso a portata di pollice. */
function Guscio() {
  return (
    <div className="min-h-screen bg-fondo text-testo">
      <header className="px-4 pt-[calc(14px+env(safe-area-inset-top))] pb-2 sticky top-0 bg-fondo/95 backdrop-blur z-10 flex items-center gap-2.5">
        <img src="./favicon.svg" alt="" className="w-8 h-8" />
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-bordeaux font-bold leading-none">Pronto soccorso</p>
          <h1 className="font-extrabold text-2xl tracking-tight leading-none">Emergenze</h1>
        </div>
      </header>

      <main className="px-3.5 py-3 pb-[calc(90px+env(safe-area-inset-bottom))] max-w-3xl mx-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-20 bg-fondo/95 backdrop-blur-md border-t border-linea px-3 pt-2 pb-[max(14px,calc(env(safe-area-inset-bottom)+6px))]">
        <div className="grid grid-cols-3 gap-1.5 max-w-md mx-auto">
          {schede.map((s) => (
            <NavLink key={s.to} to={s.to} end={s.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 rounded-[14px] py-1.5 text-[12px] font-bold transition-colors ${
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
          <Route index element={<Calcolatori />} />
          <Route path="antibiotici" element={<Antibiotici />} />
          <Route path="linee-guida" element={<ElencoLineeGuida />} />
          <Route path="linee-guida/:id" element={<RiassuntoLineaGuida />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

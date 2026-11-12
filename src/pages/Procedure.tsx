import { useSearchParams } from 'react-router-dom'
import PaginaSchede from '../components/PaginaSchede'
import Ecografie from '../components/Ecografie'
import { PROCEDURE } from '../lib/schede'

const VENT = new Set(['Ventilazione non invasiva'])
const ELETTR = new Set(['Terapia elettrica'])
const sezioneDi = (g: string) => (VENT.has(g) ? 'ventilazione' : ELETTR.has(g) ? 'elettrica' : 'invasive')
const SEZIONI = [
  { id: 'invasive', nome: 'Procedure invasive', testo: 'Vie aeree, torace, accessi, addome e SNC, blocchi nervosi', colore: 'bg-[#f4e9ea] border-[#e2c9cd] text-[#6b2f3a]', icona: '✚' },
  { id: 'elettrica', nome: 'Terapia elettrica', testo: 'Defibrillazione, cardioversione, pacing: comandi di TEC-5600, TEC-5531K, DFM100', colore: 'bg-[#f6eedd] border-[#e6d5b0] text-[#7a5a17]', icona: '⚡' },
  { id: 'ventilazione', nome: 'Ventilazione', testo: 'NIV/CPAP con Philips V60: montaggio, parametri, monitoraggio', colore: 'bg-[#e6efe9] border-[#c6dacd] text-[#2c5a43]', icona: '≋' },
  { id: 'eco', nome: 'Ecografia bedside', testo: 'CUS, addome, collo, cuore, occhio, muscoli, eFAST, polmone: scansioni e referti', colore: 'bg-[#e6edf4] border-[#c8d6e4] text-[#2d4f73]', icona: '◠' },
] as const

export default function Procedure() {
  const [params, setParams] = useSearchParams()
  const apri = params.get('apri')
  const daApri = apri ? PROCEDURE.find((s) => s.id === apri) : undefined
  const sez = params.get('sez') ?? (daApri ? sezioneDi(daApri.gruppo) : null)

  if (!sez) {
    return (
      <div className="grid gap-3 lg:grid-cols-2">
        {SEZIONI.map((s) => (
          <button key={s.id} onClick={() => setParams({ sez: s.id })}
            className={`relative overflow-hidden rounded-2xl border ${s.colore} p-5 text-left shadow-[var(--shadow-card)] active:scale-[0.99] transition-transform min-h-[120px]`}>
            <span className="absolute -right-2 -bottom-6 text-[110px] leading-none opacity-10">{s.icona}</span>
            <p className="text-2xl font-black">{s.nome}</p>
            <p className="mt-1 text-[13px] text-tenue leading-snug max-w-[85%]">{s.testo}</p>
          </button>
        ))}
      </div>
    )
  }
  const s = SEZIONI.find((x) => x.id === sez)!
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button onClick={() => setParams({})} className="rounded-full border border-linea px-3 py-1 text-sm font-bold text-tenue">‹ Sezioni</button>
        <h1 className="text-xl font-black">{s.nome}</h1>
      </div>
      {sez === 'eco' ? <Ecografie /> : sez === 'elettrica' ? <Elettrica /> : (
        <PaginaSchede key={sez} schede={PROCEDURE.filter((p) => sezioneDi(p.gruppo) === sez)} segnaposto={sez === 'invasive' ? 'Cerca una procedura…' : 'Cerca…'} />
      )}
    </div>
  )
}

const TERAPIE = ['defibrillazione', 'cve', 'pacing']
const APPARECCHI = [
  { id: 'nk-5600', marca: 'Nihon Kohden', nome: 'TEC-5600', nota: 'con pacing, tasto SCARICA' },
  { id: 'nk-5531', marca: 'Nihon Kohden', nome: 'TEC-5531K', nota: 'con piastre' },
  { id: 'dfm100', marca: 'Philips', nome: 'Efficia DFM100', nota: 'manopola verde' },
]

/** Terapia elettrica: a sinistra le terapie, a destra i defibrillatori; la scheda scelta si apre sotto a tutta larghezza. */
function Elettrica() {
  const [params, setParams] = useSearchParams()
  const sel = params.get('apri')
  const scegli = (id: string) => {
    const np = new URLSearchParams(params)
    if (sel === id) np.delete('apri'); else np.set('apri', id)
    setParams(np, { replace: true })
  }
  const scelta = PROCEDURE.filter((p) => p.id === sel)
  const nomeBreve: Record<string, string> = { defibrillazione: 'Defibrillazione', cve: 'Cardioversione', pacing: 'Pacing' }
  const sotto: Record<string, string> = { defibrillazione: 'FV/TV senza polso, energie', cve: 'sincronizzata', pacing: 'transcutaneo' }
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-2">
          <p className="etichetta px-1">Terapie</p>
          {TERAPIE.map((id) => (
            <button key={id} onClick={() => scegli(id)}
              className={`rounded-2xl border px-3 py-2.5 text-left transition-colors ${sel === id ? 'bg-[#7a5a17] border-[#7a5a17] text-white' : 'bg-[#f6eedd] border-[#e6d5b0] text-[#7a5a17]'}`}>
              <p className="font-black leading-tight">{nomeBreve[id]}</p>
              <p className={`text-[12px] leading-tight ${sel === id ? 'text-white/80' : 'text-tenue'}`}>{sotto[id]}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className="etichetta px-1">Defibrillatori</p>
          {APPARECCHI.map((a) => (
            <button key={a.id} onClick={() => scegli(a.id)}
              className={`rounded-2xl border px-3 py-2.5 text-left transition-colors ${sel === a.id ? 'bg-[#3c4a5c] border-[#3c4a5c] text-white' : 'bg-[#e7ebf0] border-[#c9d1dc] text-[#3c4a5c]'}`}>
              <p className={`text-[11px] font-bold leading-tight ${sel === a.id ? 'text-white/80' : 'text-tenue'}`}>{a.marca}</p>
              <p className="font-black leading-tight">{a.nome}</p>
              <p className={`text-[12px] leading-tight ${sel === a.id ? 'text-white/80' : 'text-tenue'}`}>{a.nota}</p>
            </button>
          ))}
        </div>
      </div>
      {scelta.length > 0 && <PaginaSchede key={sel} schede={scelta} segnaposto="" senzaCerca senzaGruppi />}
    </div>
  )
}

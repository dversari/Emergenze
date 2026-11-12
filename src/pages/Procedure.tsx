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
  { id: 'eco', nome: 'Ecografia bedside', testo: 'CUS, addome, vasi del collo, eFAST, polmone: scansioni e referti', colore: 'bg-[#e6edf4] border-[#c8d6e4] text-[#2d4f73]', icona: '◠' },
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
      {sez === 'eco' ? <Ecografie /> : (
        <PaginaSchede key={sez} schede={PROCEDURE.filter((p) => sezioneDi(p.gruppo) === sez)} segnaposto={sez === 'invasive' ? 'Cerca una procedura…' : 'Cerca…'} />
      )}
    </div>
  )
}

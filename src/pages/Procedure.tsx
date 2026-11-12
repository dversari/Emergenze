import { useSearchParams } from 'react-router-dom'
import PaginaSchede from '../components/PaginaSchede'
import Ecografie from '../components/Ecografie'
import { PROCEDURE } from '../lib/schede'

const VENT = new Set(['Ventilazione non invasiva'])
const SEZIONI = [
  { id: 'invasive', nome: 'Procedure invasive', testo: 'Vie aeree, torace, accessi, addome e SNC, blocchi nervosi', colore: 'from-[#7b3f4a] to-[#5a2833]', icona: '✚' },
  { id: 'ventilazione', nome: 'Ventilazione', testo: 'NIV/CPAP con Philips V60: montaggio, parametri, monitoraggio', colore: 'from-[#2f6652] to-[#1f4a3a]', icona: '≋' },
  { id: 'eco', nome: 'Ecografia bedside', testo: 'CUS, addome, vasi del collo, eFAST, polmone: scansioni e referti', colore: 'from-[#35577a] to-[#223c57]', icona: '◠' },
] as const

export default function Procedure() {
  const [params, setParams] = useSearchParams()
  const apri = params.get('apri')
  const daApri = apri ? PROCEDURE.find((s) => s.id === apri) : undefined
  const sez = params.get('sez') ?? (daApri ? (VENT.has(daApri.gruppo) ? 'ventilazione' : 'invasive') : null)

  if (!sez) {
    return (
      <div className="grid gap-3 lg:grid-cols-3">
        {SEZIONI.map((s) => (
          <button key={s.id} onClick={() => setParams({ sez: s.id })}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.colore} p-5 text-left text-white shadow-[var(--shadow-card)] active:scale-[0.99] transition-transform min-h-[120px]`}>
            <span className="absolute -right-2 -bottom-6 text-[110px] leading-none opacity-15">{s.icona}</span>
            <p className="text-2xl font-black">{s.nome}</p>
            <p className="mt-1 text-[13px] text-white/80 leading-snug max-w-[85%]">{s.testo}</p>
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
        <PaginaSchede key={sez} schede={PROCEDURE.filter((p) => (sez === 'ventilazione') === VENT.has(p.gruppo))} segnaposto={sez === 'ventilazione' ? 'Cerca…' : 'Cerca una procedura…'} />
      )}
    </div>
  )
}

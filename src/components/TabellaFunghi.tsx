import { Link } from 'react-router-dom'
import { useConRitorno } from '../lib/ritorno'
import { SINDROMI_FUNGHI } from '../lib/sindromiTossiche'

/** Tabella delle sindromi da funghi divise per latenza (breve < 6 h, lunga > 6 h). */
export default function TabellaFunghi({ senzaTitolo }: { senzaTitolo?: boolean }) {
  const r = useConRitorno()
  const gruppo = (breve: boolean) => (
    <div className="flex flex-col gap-1.5">
      <p className={`text-[11px] font-bold uppercase tracking-wide px-1 ${breve ? 'text-verde' : 'text-bordeaux'}`}>
        {breve ? 'Latenza breve (< 6 h) · di solito benigne' : 'Latenza lunga (> 6 h) · le più pericolose'}
      </p>
      {SINDROMI_FUNGHI.filter((s) => s.breve === breve).map((s) => (
        <div key={s.nome} className={`rounded-xl border px-3 py-2 ${breve ? 'border-verde3 bg-verde3/40' : 'border-bordeaux2/50 bg-bordeaux3/50'}`}>
          <div className="flex items-start justify-between gap-2">
            <p className="font-bold leading-tight">{s.nome}</p>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${breve ? 'bg-verde text-white' : 'bg-bordeaux text-white'}`}>{s.latenza}</span>
          </div>
          <p className="text-[12px] text-tenue italic leading-snug mt-0.5">{s.funghi}</p>
          <p className="text-[13px] leading-snug mt-1">{s.quadro}</p>
          <p className="text-[13px] leading-snug mt-1"><b className={breve ? 'text-verde' : 'text-bordeaux'}>In PS:</b> {s.ps}
            {s.to && <Link to={s.to} state={r.state} onClick={r.onClick} className="ml-1.5 text-xs font-semibold text-verde underline">apri ›</Link>}
          </p>
        </div>
      ))}
    </div>
  )
  return (
    <section className="card flex flex-col gap-3">
      {!senzaTitolo && <p className="etichetta">Sindromi da funghi per latenza</p>}
      <p className="text-[13px] leading-snug">La latenza fra pasto e primi sintomi è la domanda chiave. <b>Pasto misto o più pasti consecutivi: comportarsi come se fosse a latenza lunga.</b></p>
      {gruppo(true)}
      {gruppo(false)}
    </section>
  )
}

import { Fragment, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Scheda } from '../lib/schede'

// Nomi dei farmaci evidenziati in rosso grassetto dentro i testi.
const FARMACI = [
  'N-acetilcisteina','acetilcisteina','levetiracetam','valproato','fenitoina','tenecteplase','idrocortisone','calcio gluconato','calcio cloruro','insulina','Actrapid','zirconio ciclosilicato','glucagone','salbutamolo','KCl','desmopressina','magnesio solfato','carbone attivo',
  'aspirina','acido acetilsalicilico','prasugrel','ticagrelor','clopidogrel','metoprololo','amiodarone','furosemide','isosorbide dinitrato','nitroglicerina','metoclopramide','digossina','diltiazem','flecainide','propafenone','vernakalant','dobutamina','levosimendan','acetazolamide','idroclorotiazide','enoxaparina','apixaban','rivaroxaban','alteplase',
  'ketamina', 'propofol', 'ketofol', 'midazolam', 'fentanil', 'morfina',
  'rocuronio', 'succinilcolina', 'sugammadex', 'naloxone', 'flumazenil', 'noradrenalina', 'adrenalina',
  'ondansetron', 'olanzapina', 'lorazepam', 'aloperidolo', 'diazepam', 'tiamina', 'quetiapina',
  'clorpromazina', 'levomepromazina', 'butilscopolamina', 'lidocaina', 'atropina', 'albumina', 'caffeina',
  'desametasone', 'clorexidina', 'eparina',
]
const RE_FARMACI = new RegExp(`\\b(${FARMACI.join('|')})\\b`, 'gi')

export function Evidenzia({ t }: { t: string }) {
  const parti = t.split(RE_FARMACI)
  return <>{parti.map((p, i) => (i % 2 === 1 ? <strong key={i} className="font-extrabold text-bordeaux">{p}</strong> : p))}</>
}

/** Elenco di card raggruppate che si aprono sui passaggi (Procedure, Sedazione). */
export default function PaginaSchede({ schede, segnaposto }: { schede: Scheda[]; segnaposto: string }) {
  const [params, setParams] = useSearchParams()
  const [aperto, setAperto] = useState<string | null>(params.get('apri'))
  const [cerca, setCerca] = useState('')
  const q = cerca.trim().toLowerCase()

  useEffect(() => {
    if (!aperto) return
    document.getElementById(`s-${aperto}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [aperto])

  const toggle = (id: string) => {
    const nuovo = aperto === id ? null : id
    setAperto(nuovo)
    setParams(nuovo ? { apri: nuovo } : {}, { replace: true })
  }

  const voci = schede.filter((s) => !q || `${s.nome} ${s.sintesi} ${s.gruppo}`.toLowerCase().includes(q))
  const gruppi = [...new Set(voci.map((s) => s.gruppo))]

  return (
    <div className="elenco">
      <input value={cerca} onChange={(e) => setCerca(e.target.value)} placeholder={segnaposto}
        className="rounded-xl border border-linea px-3 py-2.5 text-base" />
      {gruppi.map((g) => (
        <Fragment key={g}>
          <p className="etichetta px-1 mt-1">{g}</p>
          {voci.filter((s) => s.gruppo === g).map((s) => {
            const open = aperto === s.id
            return (
              <section key={s.id} id={`s-${s.id}`} className="card !p-0 overflow-hidden scroll-mt-24">
                <button onClick={() => toggle(s.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold leading-tight">{s.nome}</p>
                    <p className="text-xs text-tenue leading-snug mt-0.5"><Evidenzia t={s.sintesi} /></p>
                  </div>
                  <span className={`text-tenue transition-transform shrink-0 ${open ? 'rotate-90' : ''}`}>›</span>
                </button>
                {open && (
                  <div className="px-4 pb-4 pt-1 border-t border-linea flex flex-col gap-3">
                    {s.blocchi.map((b) => (
                      <div key={b.titolo}>
                        <p className="etichetta mt-2 mb-1.5">{b.titolo}</p>
                        {b.numerato ? (
                          <ol className="flex flex-col gap-1.5">
                            {b.righe.map((r, i) => (
                              <li key={i} className="flex gap-2.5 text-sm leading-snug">
                                <span className="shrink-0 w-5 h-5 rounded-full bg-verde text-white text-[11px] font-bold flex items-center justify-center mt-px">{i + 1}</span>
                                <span><Evidenzia t={r} /></span>
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <ul className="flex flex-col gap-1">
                            {b.righe.map((r, i) => (
                              <li key={i} className="text-sm leading-snug pl-3 relative">
                                <span className="absolute left-0 top-[0.55em] w-1 h-1 rounded-full bg-tenue" /><Evidenzia t={r} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                    {s.fonte && <p className="text-[11px] text-tenue">Fonte: {s.fonte}</p>}
                  </div>
                )}
              </section>
            )
          })}
        </Fragment>
      ))}
      {!voci.length && <p className="intero text-sm text-tenue px-1">Nessun risultato.</p>}
      <p className="intero text-[11px] text-tenue px-1 mt-1">Adulto. Dosi da verificare su peso, età, funzione d’organo e protocolli locali.</p>
    </div>
  )
}

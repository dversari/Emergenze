import { useState } from 'react'
import Algoritmo from '../components/Algoritmo'
import { ALGORITMI } from '../lib/algoritmi'
import { Link, useParams } from 'react-router-dom'
import { LINEE_GUIDA, lineaGuida } from '../lib/lineeGuida'
import ChiediLineaGuida from '../components/ChiediLineaGuida'

/** «ESC 2024», oppure l'ente così com'è se contiene già gli anni (confronti tra società). */
const enteAnno = (l: { ente: string; anno: number }) => (/\d{4}/.test(l.ente) ? l.ente : `${l.ente} ${l.anno}`)

const data = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })

/** Elenco delle linee guida: tocca una voce per aprirne il riassunto. */
export function ElencoLineeGuida() {
  const [cerca, setCerca] = useState('')
  const q = cerca.trim().toLowerCase()
  const voci = LINEE_GUIDA.filter((l) => !q || `${l.titolo} ${l.ente} ${l.area}`.toLowerCase().includes(q))
  return (
    <div className="flex flex-col gap-2.5">
      <input value={cerca} onChange={(e) => setCerca(e.target.value)} placeholder="Cerca una linea guida…"
        className="rounded-xl border border-linea px-3 py-2.5 text-base" />
      {voci.map((l) => (
        <Link key={l.id} to={`/linee-guida/${l.id}`} className="card !py-3 flex items-center gap-3 active:bg-sabbia">
          <div className="w-11 h-11 rounded-xl bg-bordeaux3 text-bordeaux flex items-center justify-center font-extrabold text-sm shrink-0">
            {(l.titolo.includes(' ') ? l.titolo.split(' ').map((p) => p[0]).join('') : l.titolo).slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold leading-tight">{l.titolo}</p>
            <p className="text-xs text-tenue">{enteAnno(l)} · {l.area}</p>
            <p className="text-[11px] text-verde mt-0.5">✓ controllata il {data(l.controllata)}</p>
          </div>
          <span className="text-tenue">›</span>
        </Link>
      ))}
      <div className="rounded-[18px] border border-dashed border-linea-forte px-4 py-3 text-sm text-tenue">
        Le altre linee guida si aggiungono qui: ogni voce ha il riassunto, il link all’originale e il registro degli aggiornamenti.
      </div>
    </div>
  )
}

/** Riassunto di una linea guida. */
export function RiassuntoLineaGuida() {
  const { id = '' } = useParams()
  const l = lineaGuida(id)
  if (!l) return <p className="text-sm text-tenue">Linea guida non trovata. <Link to="/linee-guida" className="underline">Torna all’elenco</Link></p>

  return (
    <div className="flex flex-col gap-3">
      <Link to="/linee-guida" className="text-sm text-tenue">‹ Linee guida</Link>

      <div>
        <p className="text-[11px] uppercase tracking-[0.12em] text-bordeaux font-bold">{enteAnno(l)} · {l.area}</p>
        <h2 className="font-extrabold text-2xl tracking-tight leading-tight">{l.titolo}</h2>
        <a href={l.fonte.url} target="_blank" rel="noreferrer" className="text-sm text-verde font-semibold underline">
          Testo completo: {l.fonte.etichetta} ↗
        </a>
      </div>

      <section className="card">
        <p className="etichetta mb-2">In PS, in breve</p>
        <ul className="flex flex-col gap-2">
          {l.inBreve.map((p, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] leading-snug">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-bordeaux shrink-0" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        {l.calcolatori && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {l.calcolatori.map((c) => (
              <Link key={c.id} to={`/calcolatori?apri=${c.id}`}
                className="text-xs font-semibold rounded-full px-3 py-1.5 bg-verde text-white">
                {c.nome} →
              </Link>
            ))}
          </div>
        )}
      </section>

      {ALGORITMI[l.id] && <Algoritmo {...ALGORITMI[l.id]} />}

      {l.sezioni.map((s) => (
        <details key={s.titolo} className="card !p-0 overflow-hidden group">
          <summary className="px-4 py-3 font-bold cursor-pointer list-none flex items-center justify-between">
            {s.titolo}
            <span className="text-tenue transition-transform group-open:rotate-90">›</span>
          </summary>
          <ul className="px-4 pb-4 pt-1 flex flex-col gap-2 border-t border-linea">
            {s.punti.map((p, i) => <li key={i} className="text-sm leading-snug pt-2">{p}</li>)}
          </ul>
        </details>
      ))}

      <section className="card">
        <p className="etichetta mb-2">Aggiornamenti</p>
        <ol className="flex flex-col gap-3 border-l-2 border-linea pl-3">
          {l.aggiornamenti.map((a, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-oro" />
              <p className="text-[11px] font-bold text-oro">{data(a.data)}</p>
              <p className="text-sm leading-snug">{a.testo}</p>
              {a.link && <a href={a.link.url} target="_blank" rel="noreferrer" className="text-xs text-verde underline">{a.link.etichetta} ↗</a>}
            </li>
          ))}
        </ol>
      </section>

      {l.fonti && <ChiediLineaGuida key={l.id} fonti={l.fonti} />}

      <p className="text-[11px] text-tenue px-1">Riassunto personale: le dosi vanno verificate su linee guida e scheda tecnica.</p>
    </div>
  )
}

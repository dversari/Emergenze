import { useEffect, useState } from 'react'
import { RitornoCtx, riprendiScroll, useConRitorno } from '../lib/ritorno'
import Algoritmo, { idSezione, Testo } from '../components/Algoritmo'
import Manovre from '../components/Manovre'
import EcgEquivalenti from '../components/EcgEquivalenti'
import { ALGORITMI } from '../lib/algoritmi'
import { Link, useParams } from 'react-router-dom'
import { LINEE_GUIDA, lineaGuida, conCav, CAV_FIRENZE } from '../lib/lineeGuida'
import ChiediLineaGuida from '../components/ChiediLineaGuida'

/** «ESC 2024», oppure l'ente così com'è se contiene già gli anni (confronti tra società). */
const enteAnno = (l: { ente: string; anno: number }) => (/\d{4}/.test(l.ente) ? l.ente : `${l.ente} ${l.anno}`)

const data = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })

/** PDTA tempo-dipendenti mostrati in cima all'elenco. */
const EVIDENZA = ['post-rosc', 'stemi', 'ictus', 'sepsi', 'anafilassi', 'trauma-maggiore', 'stato-di-male', 'emorragia-cerebrale', 'dissezione-aortica', 'embolia-polmonare', 'tachicardia', 'bradicardia', 'anticoagulato-sanguinamento', 'emorragia-digestiva', 'iperkaliemia', 'chetoacidosi']

/** Elenco delle linee guida: tocca una voce per aprirne il riassunto. */
export function ElencoLineeGuida() {
  const [cerca, setCerca] = useState('')
  const q = cerca.trim().toLowerCase()
  const voci = LINEE_GUIDA.filter((l) => !q || `${l.titolo} ${l.ente} ${l.area}`.toLowerCase().includes(q))
  return (
    <div className="flex flex-col gap-2.5">
      <input value={cerca} onChange={(e) => setCerca(e.target.value)} placeholder="Cerca un PDTA…"
        className="rounded-xl border border-linea px-3 py-2.5 text-base" />
      {!q && (
        <div className="elenco !gap-2">
          <p className="etichetta px-1 mt-1 !text-bordeaux">In evidenza · tempo-dipendenti</p>
          {EVIDENZA.map((id) => LINEE_GUIDA.find((l) => l.id === id)).filter((l) => !!l).map((l) => (
            <Link key={l.id} to={`/linee-guida/${l.id}`} className="card !py-2.5 flex items-center gap-3 active:bg-sabbia !border-bordeaux2/50">
              <div className="w-9 h-9 rounded-xl bg-bordeaux text-white flex items-center justify-center font-extrabold text-xs shrink-0">
                {(l.titolo.includes(' ') ? l.titolo.split(' ').map((p) => p[0]).join('') : l.titolo).slice(0, 2).toUpperCase()}
              </div>
              <p className="flex-1 min-w-0 font-bold leading-tight">{l.titolo}</p>
              <span className="text-tenue">›</span>
            </Link>
          ))}
          <p className="etichetta px-1 mt-3">Tutti i PDTA per area</p>
        </div>
      )}
      {[...new Set(voci.map((l) => l.area.split(' · ')[0]))].sort().map((area) => (
        <div key={area} className="elenco !gap-2">
          <p className="etichetta px-1 mt-1">{area}</p>
      {voci.filter((l) => l.area.split(' · ')[0] === area).map((l) => (
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
        </div>
      ))}
      <div className="rounded-[18px] border border-dashed border-linea-forte px-4 py-3 text-sm text-tenue">
        Gli altri PDTA si aggiungono qui: ogni voce ha il riassunto, l’algoritmo, il link alle linee guida originali e il registro degli aggiornamenti.
      </div>
    </div>
  )
}

/** Riassunto di una linea guida. */
/** Link interno che ricorda il PDTA di partenza (pulsante «Torna a …»). */
function LinkR(props: React.ComponentProps<typeof Link>) {
  const r = useConRitorno()
  return <Link {...props} state={r.state} onClick={r.onClick} />
}

export function RiassuntoLineaGuida() {
  const { id = '' } = useParams()
  const l = lineaGuida(id)
  useEffect(() => { riprendiScroll(`/linee-guida/${id}`) }, [id])
  if (!l) return <p className="text-sm text-tenue">PDTA non trovato. <Link to="/linee-guida" className="underline">Torna all’elenco</Link></p>

  return (
    <RitornoCtx.Provider value={l.titolo}>
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-6 lg:items-start">
    <div className="flex flex-col gap-3">
      <Link to="/linee-guida" className="text-sm text-tenue">‹ PDTA</Link>

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
              <span><Testo t={p} /></span>
            </li>
          ))}
        </ul>
        {l.calcolatori && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {l.calcolatori.map((c) => (
              <LinkR key={c.id} to={`/calcolatori?apri=${c.id}`}
                className="text-xs font-semibold rounded-full px-3 py-1.5 bg-verde text-white">
                {c.nome} →
              </LinkR>
            ))}
          </div>
        )}
      </section>

      {conCav(l) && (
        <a href={CAV_FIRENZE.tel} className="card !py-3 flex items-center justify-between gap-3 bg-bordeaux text-white no-underline">
          <span><span className="block text-[11px] font-bold uppercase tracking-wide opacity-80">Centro antiveleni di Firenze · 24 h</span><span className="text-lg font-extrabold">{CAV_FIRENZE.numero}</span></span>
          <span className="rounded-full bg-white text-bordeaux font-extrabold text-sm px-4 py-2">Chiama</span>
        </a>
      )}

      {(l.id === 'stemi' || l.id === 'nste-sca') && <EcgEquivalenti />}

      <div className="flex flex-col gap-3 lg:hidden">
        {ALGORITMI[l.id] && <Algoritmo {...ALGORITMI[l.id]} sezioni={l.sezioni} />}
        {l.manovre && <Manovre ids={l.manovre} />}
      </div>

      {(l.vediAnche || l.approfondimenti) && (
        <section className="card">
          {l.vediAnche && (
            <>
              <p className="etichetta mb-2">Nell’app</p>
              <div className="flex flex-wrap gap-1.5 mb-1">
                {l.vediAnche.map((v) => (
                  <LinkR key={v.to} to={v.to} className="text-xs font-semibold rounded-full px-3 py-1.5 bg-verde3 text-verde-scuro">{v.etichetta} →</LinkR>
                ))}
              </div>
            </>
          )}
          {l.approfondimenti && (
            <>
              <p className={`etichetta mb-2 ${l.vediAnche ? 'mt-3' : ''}`}>Approfondimenti e figure</p>
              <ul className="flex flex-col gap-2">
                {l.approfondimenti.map((a) => (
                  <li key={a.url}>
                    <a href={a.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-verde underline">{a.etichetta} ↗</a>
                    {a.nota && <p className="text-[12px] text-tenue leading-snug">{a.nota}</p>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {l.sezioni.map((s) => (
        <details key={s.titolo} id={idSezione(s.titolo)} className="card !p-0 overflow-hidden group scroll-mt-24">
          <summary className="px-4 py-3 font-bold cursor-pointer list-none flex items-center justify-between">
            {s.titolo}
            <span className="text-tenue transition-transform group-open:rotate-90">›</span>
          </summary>
          <ul className="px-4 pb-4 pt-1 flex flex-col gap-2 border-t border-linea">
            {s.punti.map((p, i) => <li key={i} className="text-sm leading-snug pt-2"><Testo t={p} /></li>)}
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
    {(ALGORITMI[l.id] || l.manovre) && (
      <aside className="hidden lg:flex flex-col gap-3 sticky top-[80px] max-h-[calc(100vh-96px)] overflow-y-auto pr-1 pb-4">
        {ALGORITMI[l.id] && <Algoritmo {...ALGORITMI[l.id]} sezioni={l.sezioni} />}
        {l.manovre && <Manovre ids={l.manovre} />}
      </aside>
    )}
    </div>
    </RitornoCtx.Provider>
  )
}

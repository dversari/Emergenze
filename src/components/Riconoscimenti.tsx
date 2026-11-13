import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { REVISORI, aziendale, statoRevisione, type Filtro, type StatoRevisione } from '../lib/riconoscimenti'

const base = import.meta.env.BASE_URL
const pdf = (d: { file: string; titolo: string }) => `/pdf?f=${encodeURIComponent(d.file)}&t=${encodeURIComponent(d.titolo)}`
const dataIt = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })

const TONO: Record<StatoRevisione, { cerchio: string; testo: string; etichetta: string }> = {
  revisionata: { cerchio: 'bg-verde text-white border-verde', testo: 'text-verde', etichetta: 'Revisionata' },
  aperta: { cerchio: 'bg-[#c98a1b] text-white border-[#c98a1b]', testo: 'text-[#9a6a12]', etichetta: 'Revisione in corso' },
  superata: { cerchio: 'bg-white text-tenue border-linea-forte border-dashed', testo: 'text-tenue', etichetta: 'Modificata dopo la revisione' },
}
const BLU = '#2d4f73'

/** Ferma il tocco: i simboli stanno dentro pulsanti e link delle card. */
const ferma = (e: React.SyntheticEvent) => { e.stopPropagation(); e.preventDefault() }

/**
 * Simboli di una card: cerchio con le sigle dei revisori (verde / ambra / grigio tratteggiato)
 * e scudo ASL se la card deriva da un documento aziendale. Toccandoli si apre il dettaglio.
 */
export default function Riconoscimenti({ chiave, contenuto, grande }: { chiave: string; contenuto?: unknown; grande?: boolean }) {
  const [aperto, setAperto] = useState(false)
  const rev = statoRevisione(chiave, contenuto)
  const docs = aziendale(chiave)
  if (!rev && !docs.length) return null

  const sigle = rev ? [...new Set(rev.voci.map((v) => v.sigla))] : []
  const dim = grande ? 'h-7 min-w-7 text-[11px]' : 'h-6 min-w-6 text-[10px]'
  const apri = (e: React.SyntheticEvent) => { ferma(e); setAperto(true) }
  const tasto = (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') apri(e) }

  return (
    <>
      <span className="inline-flex items-center gap-1 shrink-0 align-middle">
        {rev && (
          <span role="button" tabIndex={0} onClick={apri} onKeyDown={tasto} aria-label={`${TONO[rev.stato].etichetta}: ${sigle.join(', ')}`}
            className={`${dim} ${TONO[rev.stato].cerchio} inline-flex items-center justify-center rounded-full border-2 px-1.5 font-black tracking-tight leading-none cursor-pointer`}>
            {rev.stato === 'superata' ? '!' : sigle.slice(0, 2).join('·')}{sigle.length > 2 ? '+' : ''}
          </span>
        )}
        {docs.length > 0 && (
          <span role="button" tabIndex={0} onClick={apri} onKeyDown={tasto} aria-label="Impianto aziendale ASL"
            className={`${grande ? 'h-7 w-8' : 'h-6 w-7'} inline-flex items-center justify-center cursor-pointer`}>
            <svg viewBox="0 0 28 30" className="h-full w-full" aria-hidden>
              <path d="M14 1.5 L26 5.5 V14 C26 21.5 20.8 26.6 14 28.5 C7.2 26.6 2 21.5 2 14 V5.5 Z" fill={BLU} />
              <text x="14" y="18.2" textAnchor="middle" fontSize="8.6" fontWeight="900" fill="#fff" fontFamily="system-ui, sans-serif">ASL</text>
            </svg>
          </span>
        )}
      </span>
      {aperto && <Dettaglio chiave={chiave} contenuto={contenuto} onChiudi={() => setAperto(false)} />}
    </>
  )
}

function Dettaglio({ chiave, contenuto, onChiudi }: { chiave: string; contenuto?: unknown; onChiudi: () => void }) {
  const rev = statoRevisione(chiave, contenuto)
  const docs = aziendale(chiave)
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onChiudi() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onChiudi])

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30" onClick={(e) => { e.stopPropagation(); onChiudi() }}>
      <div onClick={(e) => e.stopPropagation()} className="w-full sm:max-w-md max-h-[80vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-carta p-5 pb-8 shadow-xl flex flex-col gap-4">
        {rev && (
          <section>
            <p className={`text-[11px] font-black uppercase tracking-[0.12em] ${TONO[rev.stato].testo}`}>Revisione tra pari · {TONO[rev.stato].etichetta}</p>
            {rev.stato === 'superata' && (
              <p className="text-[13px] text-tenue leading-snug mt-1">Il testo è cambiato dopo l’ultima revisione: va riconfermato.</p>
            )}
            <ul className="mt-2 flex flex-col gap-2.5">
              {rev.voci.map((v, i) => (
                <li key={i} className="flex gap-3">
                  <span className={`h-8 min-w-8 px-1 inline-flex items-center justify-center rounded-full text-[11px] font-black ${v.esito === 'ok' ? 'bg-verde text-white' : 'bg-[#c98a1b] text-white'}`}>{v.sigla}</span>
                  <div className="min-w-0">
                    <p className="font-bold leading-tight">{REVISORI[v.sigla] ?? v.sigla}</p>
                    <p className="text-[12px] text-tenue">{dataIt(v.data)} · {v.esito === 'ok' ? 'revisione conclusa' : 'in attesa di approvazione definitiva'}</p>
                    {v.nota && <p className="text-[13px] leading-snug mt-0.5">{v.nota}</p>}
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-tenue mt-2">Controllo di un collega, non approvazione ufficiale.</p>
          </section>
        )}
        {docs.length > 0 && (
          <section>
            <p className="text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: BLU }}>Impianto aziendale</p>
            <ul className="mt-2 flex flex-col gap-3">
              {docs.map((d, i) => (
                <li key={i} className="rounded-2xl border border-linea p-3">
                  <p className="font-bold leading-tight text-[15px]">{d.titolo}</p>
                  <p className="text-[12px] text-tenue mt-0.5">{[d.codice, d.doc?.ente, d.data].filter(Boolean).join(' · ')}</p>
                  {d.nota && <p className="text-[12px] text-tenue mt-0.5">{d.nota}</p>}
                  {d.doc && (
                    <div className="flex gap-2 mt-2 text-[12px]">
                      <Link to={pdf(d.doc)} onClick={onChiudi} className="rounded-full px-3 py-1.5 font-bold text-white" style={{ background: BLU }}>Apri il documento</Link>
                      <a href={`${base}${d.doc.file}`} target="_blank" rel="noreferrer" className="rounded-full border border-linea px-3 py-1.5 font-bold text-tenue">PDF ↗</a>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-tenue mt-2">In caso di differenze vale il documento aziendale. <Link to="/documenti" onClick={onChiudi} className="underline">Tutti i Docs ASL</Link></p>
          </section>
        )}
        <button onClick={onChiudi} className="rounded-xl border border-linea py-2.5 font-bold text-tenue">Chiudi</button>
      </div>
    </div>,
    document.body,
  )
}

/** Filtro sopra gli elenchi: compare solo se nell'elenco ci sono card revisionate o aziendali. */
export function FiltroRiconoscimenti({ valore, onCambia, revisionate, aziendali }: { valore: Filtro; onCambia: (f: Filtro) => void; revisionate: number; aziendali: number }) {
  if (!revisionate && !aziendali) return null
  const voci: [Filtro, string, number?][] = [['tutte', 'Tutte'], ['revisionate', 'Revisionate', revisionate], ['aziendali', 'ASL', aziendali]]
  return (
    <div className="flex gap-1.5 flex-wrap">
      {voci.filter(([, , n]) => n === undefined || n > 0).map(([f, et, n]) => (
        <button key={f} onClick={() => onCambia(f)}
          className={`rounded-full px-3 py-1.5 text-xs font-bold border ${valore === f ? 'bg-testo text-white border-testo' : 'bg-carta text-tenue border-linea'}`}>
          {et}{n !== undefined ? ` · ${n}` : ''}
        </button>
      ))}
    </div>
  )
}

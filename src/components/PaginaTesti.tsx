import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

/** Testo modificabile con versione salvata sul telefono (dimissioni, anamnesi…). */
export interface TestoModificabile { id: string; nome: string; gruppo: string; testo: string }
type Dimissione = TestoModificabile

// La chiave include il prefisso della pagina (es. «dimissione», «anamnesi»).
function leggi(k: string): string | null {
  try { return localStorage.getItem(k) } catch { return null }
}
function salva(k: string, testo: string | null) {
  try {
    if (testo === null) localStorage.removeItem(k)
    else localStorage.setItem(k, testo)
  } catch { /* storage non disponibile */ }
}

function Editor({ d, k, onSalvato, onSporco }: { d: Dimissione; k: string; onSalvato: () => void; onSporco: (sporco: boolean) => void }) {
  const [salvato, setSalvato] = useState(() => leggi(k) ?? d.testo)
  const [testo, setTesto] = useState(salvato)
  const [msg, setMsg] = useState('')
  const sporco = testo !== salvato
  const diversoDaOriginale = salvato !== d.testo

  useEffect(() => { onSporco(sporco) }, [sporco, onSporco])

  const avviso = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 1800) }
  const registra = (t: string) => {
    salva(k, t === d.testo ? null : t)
    setSalvato(t); setTesto(t); onSalvato()
  }

  const copia = async () => {
    try { await navigator.clipboard.writeText(testo); avviso('Copiato') }
    catch { avviso('Copia non riuscita') }
  }
  const condividi = async () => {
    try { await navigator.share({ title: d.nome, text: testo }) } catch { /* annullato */ }
  }
  const ripristina = () => {
    if (!confirm('Tornare al testo originale dell’app? La tua versione salvata andrà persa.')) return
    registra(d.testo); avviso('Ripristinato')
  }

  return (
    <div className="px-3 pb-3 pt-1 border-t border-linea flex flex-col gap-2">
      <textarea value={testo} onChange={(e) => setTesto(e.target.value)}
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-[15px] leading-snug font-[inherit] ${sporco ? 'border-oro2' : 'border-linea'}`}
        style={{ minHeight: '60vh' }} spellCheck />
      <div className="flex gap-2 items-center flex-wrap">
        <button onClick={() => { registra(testo); avviso('Salvato') }} disabled={!sporco}
          className="rounded-xl bg-bordeaux text-white font-bold text-sm px-4 py-2 disabled:opacity-35">Salva</button>
        {sporco && <button onClick={() => setTesto(salvato)} className="rounded-xl border border-linea text-tenue font-bold text-sm px-3 py-2">Annulla</button>}
        <button onClick={copia} className="rounded-xl bg-verde text-white font-bold text-sm px-4 py-2">Copia</button>
        {'share' in navigator && (
          <button onClick={condividi} className="rounded-xl border border-verde text-verde font-bold text-sm px-4 py-2">Condividi</button>
        )}
        {msg && <span className="text-xs text-verde font-bold">{msg}</span>}
      </div>
      <div className="flex items-center gap-2">
        <p className="flex-1 text-[11px] text-tenue">
          {sporco ? 'Modifiche non salvate: «Salva» le rende il testo fisso di questa diagnosi.' : 'Copia usa il testo così com’è; «Salva» solo per renderlo fisso.'}
        </p>
        {diversoDaOriginale && !sporco && (
          <button onClick={ripristina} className="text-[11px] text-tenue underline shrink-0">Ripristina originale</button>
        )}
      </div>
    </div>
  )
}

/** Elenco di card che aprono un testo modificabile, salvabile e copiabile. */
export default function PaginaTesti({ voci: tutte, prefisso, segnaposto, nota }: { voci: TestoModificabile[]; prefisso: string; segnaposto: string; nota: string }) {
  const chiave = (id: string) => `emergenze.${prefisso}.${id}`
  const [params, setParams] = useSearchParams()
  const [aperto, setAperto] = useState<string | null>(params.get('apri'))
  const [cerca, setCerca] = useState('')
  const [, forza] = useState(0)
  const q = cerca.trim().toLowerCase()

  useEffect(() => {
    if (aperto) document.getElementById(`d-${aperto}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [aperto])

  const sporco = useRef(false)
  const segnaSporco = useCallback((v: boolean) => { sporco.current = v }, [])

  const toggle = (id: string) => {
    if (sporco.current && !confirm('Ci sono modifiche non salvate. Chiudere comunque?')) return
    sporco.current = false
    const nuovo = aperto === id ? null : id
    setAperto(nuovo)
    setParams(nuovo ? { apri: nuovo } : {}, { replace: true })
  }

  const voci = tutte.filter((d) => !q || `${d.nome} ${d.gruppo}`.toLowerCase().includes(q))
  const gruppi = [...new Set(voci.map((d) => d.gruppo))]

  return (
    <div className="flex flex-col gap-2.5">
      <input value={cerca} onChange={(e) => setCerca(e.target.value)} placeholder={segnaposto}
        className="rounded-xl border border-linea px-3 py-2.5 text-base" />
      {gruppi.map((g) => (
        <Fragment key={g}>
          <p className="etichetta px-1 mt-1">{g}</p>
          {voci.filter((d) => d.gruppo === g).map((d) => {
            const open = aperto === d.id
            const mod = leggi(chiave(d.id)) !== null
            return (
              <section key={d.id} id={`d-${d.id}`} className="card !p-0 overflow-hidden scroll-mt-24">
                <button onClick={() => toggle(d.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                  <p className="flex-1 min-w-0 font-bold leading-tight">{d.nome}</p>
                  {mod && <span className="text-[10px] font-bold uppercase tracking-wide text-oro bg-oro3 rounded-full px-2 py-0.5">personalizzata</span>}
                  <span className={`text-tenue transition-transform shrink-0 ${open ? 'rotate-90' : ''}`}>›</span>
                </button>
                {open && <Editor d={d} k={chiave(d.id)} onSalvato={() => forza((n) => n + 1)} onSporco={segnaSporco} />}
              </section>
            )
          })}
        </Fragment>
      ))}
      {!voci.length && <p className="text-sm text-tenue px-1">Nessun risultato.</p>}
      <p className="text-[11px] text-tenue px-1 mt-1">{nota}</p>
    </div>
  )
}

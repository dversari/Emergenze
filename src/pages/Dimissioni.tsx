import { Fragment, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DIMISSIONI, type Dimissione } from '../lib/dimissioni'

const chiave = (id: string) => `emergenze.dimissione.${id}`
function leggi(id: string): string | null {
  try { return localStorage.getItem(chiave(id)) } catch { return null }
}
function salva(id: string, testo: string | null) {
  try {
    if (testo === null) localStorage.removeItem(chiave(id))
    else localStorage.setItem(chiave(id), testo)
  } catch { /* storage non disponibile */ }
}

function Editor({ d, onCambio }: { d: Dimissione; onCambio: () => void }) {
  const [testo, setTesto] = useState(() => leggi(d.id) ?? d.testo)
  const [msg, setMsg] = useState('')
  const modificato = testo !== d.testo

  const aggiorna = (t: string) => {
    setTesto(t)
    salva(d.id, t === d.testo ? null : t)
    onCambio()
  }
  const avviso = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 1800) }

  const copia = async () => {
    try { await navigator.clipboard.writeText(testo); avviso('Copiato') }
    catch { avviso('Copia non riuscita') }
  }
  const condividi = async () => {
    try { await navigator.share({ title: d.nome, text: testo }) } catch { /* annullato */ }
  }
  const ripristina = () => {
    if (modificato && !confirm('Ripristinare il testo originale? Le modifiche andranno perse.')) return
    aggiorna(d.testo)
  }

  return (
    <div className="px-3 pb-3 pt-1 border-t border-linea flex flex-col gap-2">
      <textarea value={testo} onChange={(e) => aggiorna(e.target.value)}
        className="w-full rounded-xl border border-linea bg-white px-3 py-2.5 text-[15px] leading-snug font-[inherit]"
        style={{ minHeight: '60vh' }} spellCheck />
      <div className="flex gap-2 items-center flex-wrap">
        <button onClick={copia} className="rounded-xl bg-verde text-white font-bold text-sm px-4 py-2">Copia</button>
        {'share' in navigator && (
          <button onClick={condividi} className="rounded-xl border border-verde text-verde font-bold text-sm px-4 py-2">Condividi</button>
        )}
        <button onClick={ripristina} disabled={!modificato}
          className="rounded-xl border border-linea text-tenue font-bold text-sm px-3 py-2 disabled:opacity-40">Ripristina originale</button>
        {msg && <span className="text-xs text-verde font-bold">{msg}</span>}
      </div>
      <p className="text-[11px] text-tenue">Le modifiche si salvano da sole su questo telefono. Completa o togli le parti tra [parentesi].</p>
    </div>
  )
}

/** Formule di dimissione: card che aprono un testo modificabile. */
export default function Dimissioni() {
  const [params, setParams] = useSearchParams()
  const [aperto, setAperto] = useState<string | null>(params.get('apri'))
  const [cerca, setCerca] = useState('')
  const [, forza] = useState(0)
  const q = cerca.trim().toLowerCase()

  useEffect(() => {
    if (aperto) document.getElementById(`d-${aperto}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [aperto])

  const toggle = (id: string) => {
    const nuovo = aperto === id ? null : id
    setAperto(nuovo)
    setParams(nuovo ? { apri: nuovo } : {}, { replace: true })
  }

  const voci = DIMISSIONI.filter((d) => !q || `${d.nome} ${d.gruppo}`.toLowerCase().includes(q))
  const gruppi = [...new Set(voci.map((d) => d.gruppo))]

  return (
    <div className="flex flex-col gap-2.5">
      <input value={cerca} onChange={(e) => setCerca(e.target.value)} placeholder="Cerca una diagnosi…"
        className="rounded-xl border border-linea px-3 py-2.5 text-base" />
      {gruppi.map((g) => (
        <Fragment key={g}>
          <p className="etichetta px-1 mt-1">{g}</p>
          {voci.filter((d) => d.gruppo === g).map((d) => {
            const open = aperto === d.id
            const mod = leggi(d.id) !== null
            return (
              <section key={d.id} id={`d-${d.id}`} className="card !p-0 overflow-hidden scroll-mt-24">
                <button onClick={() => toggle(d.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                  <p className="flex-1 min-w-0 font-bold leading-tight">{d.nome}</p>
                  {mod && <span className="text-[10px] font-bold uppercase tracking-wide text-oro bg-oro3 rounded-full px-2 py-0.5">modificata</span>}
                  <span className={`text-tenue transition-transform shrink-0 ${open ? 'rotate-90' : ''}`}>›</span>
                </button>
                {open && <Editor d={d} onCambio={() => forza((n) => n + 1)} />}
              </section>
            )
          })}
        </Fragment>
      ))}
      {!voci.length && <p className="text-sm text-tenue px-1">Nessun risultato.</p>}
      <p className="text-[11px] text-tenue px-1 mt-1">Dosi per adulto: verificare allergie, funzione renale, gravidanza e terapie in corso.</p>
    </div>
  )
}

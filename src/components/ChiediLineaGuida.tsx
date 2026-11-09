import { useEffect, useRef, useState } from 'react'

/*
 * Barra in fondo a ogni linea guida: domanda sul testo completo.
 * La risposta arriva dalla Edge Function Supabase "emergenze-chiedi" (Claude),
 * protetta da un PIN che si inserisce una volta e resta salvato su questo telefono.
 */

const URL_FUNZIONE = 'https://djruxnduelhzxkomxvcb.supabase.co/functions/v1/emergenze-chiedi'
const CHIAVE_PIN = 'emergenze.pin'

interface Turno { role: 'user' | 'assistant'; content: string }

const leggiPin = () => { try { return localStorage.getItem(CHIAVE_PIN) ?? '' } catch { return '' } }
const salvaPin = (p: string) => { try { if (p) localStorage.setItem(CHIAVE_PIN, p); else localStorage.removeItem(CHIAVE_PIN) } catch { /* modalità privata */ } }

async function chiama(corpo: Record<string, unknown>) {
  const res = await fetch(URL_FUNZIONE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) })
  const j = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error(j.error ?? `Errore ${res.status}`), { status: res.status })
  return j
}

export default function ChiediLineaGuida({ fonti }: { fonti: { id: string; etichetta: string }[] }) {
  const [fonte, setFonte] = useState(fonti[0].id)
  const [pin, setPin] = useState(leggiPin)
  const [nuovoPin, setNuovoPin] = useState('')
  const [domanda, setDomanda] = useState('')
  const [storia, setStoria] = useState<Turno[]>([])
  const [attesa, setAttesa] = useState(false)
  const [errore, setErrore] = useState<string | null>(null)
  const fine = useRef<HTMLDivElement>(null)

  useEffect(() => { setStoria([]); setErrore(null) }, [fonte])
  useEffect(() => { fine.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [storia, attesa])

  const confermaPin = async () => {
    setErrore(null)
    try {
      await chiama({ azione: 'verifica', pin: nuovoPin.trim() })
      salvaPin(nuovoPin.trim()); setPin(nuovoPin.trim()); setNuovoPin('')
    } catch (e) { setErrore((e as Error).message) }
  }

  const invia = async () => {
    const d = domanda.trim()
    if (!d || attesa) return
    setAttesa(true); setErrore(null)
    setStoria((s) => [...s, { role: 'user', content: d }]); setDomanda('')
    try {
      const r = await chiama({ fonte, domanda: d, pin, storia })
      setStoria((s) => [...s, { role: 'assistant', content: r.risposta }])
    } catch (e) {
      setStoria((s) => s.slice(0, -1)); setDomanda(d)
      if ((e as { status?: number }).status === 401) { salvaPin(''); setPin('') }
      setErrore((e as Error).message)
    } finally { setAttesa(false) }
  }

  return (
    <section className="card">
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="etichetta">Chiedi al testo completo</p>
        {fonti.length > 1 && (
          <div className="flex gap-1">
            {fonti.map((f) => (
              <button key={f.id} onClick={() => setFonte(f.id)}
                className={`text-[11px] font-bold rounded-full px-2.5 py-1 border ${fonte === f.id ? 'bg-verde text-white border-verde' : 'bg-sabbia border-linea text-tenue'}`}>
                {f.etichetta}
              </button>
            ))}
          </div>
        )}
      </div>

      {!pin ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-tenue">Inserisci il PIN una volta: resta salvato su questo telefono.</p>
          <div className="flex gap-2">
            <input type="password" inputMode="numeric" value={nuovoPin} onChange={(e) => setNuovoPin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confermaPin()} placeholder="PIN"
              className="flex-1 rounded-xl border border-linea px-3 py-2" />
            <button onClick={confermaPin} className="rounded-xl bg-verde text-white font-bold px-4">OK</button>
          </div>
        </div>
      ) : (
        <>
          {storia.length > 0 && (
            <div className="flex flex-col gap-2 mb-3 max-h-[60vh] overflow-y-auto">
              {storia.map((t, i) => (
                <div key={i} className={t.role === 'user'
                  ? 'self-end max-w-[85%] rounded-2xl rounded-br-md bg-verde text-white px-3 py-2 text-sm'
                  : 'self-start max-w-[95%] rounded-2xl rounded-bl-md bg-sabbia border border-linea px-3 py-2 text-sm leading-snug whitespace-pre-wrap'}>
                  {t.content}
                </div>
              ))}
              {attesa && <div className="self-start rounded-2xl bg-sabbia border border-linea px-3 py-2 text-sm text-tenue">Sto leggendo la linea guida…</div>}
              <div ref={fine} />
            </div>
          )}
          <div className="flex gap-2 items-end">
            <textarea value={domanda} onChange={(e) => setDomanda(e.target.value)} rows={1}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); invia() } }}
              placeholder="Es. dose di carico di amiodarone?"
              className="flex-1 rounded-xl border border-linea px-3 py-2 resize-none" />
            <button onClick={invia} disabled={attesa || !domanda.trim()}
              className="rounded-xl bg-verde text-white font-bold px-4 py-2 disabled:opacity-40">↑</button>
          </div>
          <div className="flex justify-between mt-1.5">
            <p className="text-[11px] text-tenue">Risponde solo dal testo della linea guida, con sezione e classe.</p>
            {storia.length > 0 && <button onClick={() => setStoria([])} className="text-[11px] text-tenue underline">Nuova</button>}
          </div>
        </>
      )}
      {errore && <p className="text-sm text-bordeaux mt-2">{errore}</p>}
    </section>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { CHIAVE_PIN, leggi, scarica } from '../pages/Rubrica'
import { componi, dataBreve, etichetta, interpreta, NOME_TURNO, TURNI, type Mese, type Nuovo, type Sel, type Turno, type Voce } from '../lib/turni'

/*
 * Cambi turno nella scheda Turni. Chiunque abbia il PIN può segnare un cambio: vale subito,
 * resta nel registro con autore dichiarato e ora, e si può annullare.
 * Modo principale: «⇄ Cambio» e poi si toccano i box nel calendario (componi in src/lib/turni.ts).
 * In alternativa una riga di testo (interpreta). Funzione: supabase/functions/emergenze-cambi.
 */
const URL_CAMBI = 'https://djruxnduelhzxkomxvcb.supabase.co/functions/v1/emergenze-cambi'

async function chiama(corpo: Record<string, unknown>) {
  const pin = leggi(CHIAVE_PIN)
  if (!pin) throw new Error('Serve il PIN della Rubrica')
  const res = await fetch(URL_CAMBI, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin, ...corpo }) })
  const j = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(j.error ?? `Errore ${res.status}`)
  await scarica(pin)
  return j
}
const ora = (iso: string) => new Date(iso).toLocaleString('it-IT', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })

const sigleNote = (mesi: Mese[]) => {
  const s = new Set<string>()
  for (const m of mesi) for (const g of m.dati.giorni) for (const t of TURNI) for (const x of g[t].split(' ')) if (x) s.add(x.replace(/[*~]/g, ''))
  for (const m of mesi) for (const v of m.registro ?? []) s.add(v.a)
  s.delete('YY')
  return s
}

function Anteprima({ cambi, avvisi, sigla, invio, salva }: { cambi: Nuovo[]; avvisi: string[]; sigla: string; invio: boolean; salva: () => void }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-oro3 p-2.5">
      {cambi.map((c, i) => <p key={i} className="text-[14px] font-bold">{c.descr}</p>)}
      {avvisi.map((a, i) => <p key={i} className="text-[12.5px] font-bold text-[#8a5a00]">⚠︎ {a}</p>)}
      <div className="mt-1 flex items-center gap-2">
        <button onClick={salva} disabled={invio} className="rounded-full bg-verde px-4 py-2 text-[14px] font-extrabold text-white disabled:opacity-50">{invio ? 'Salvo…' : 'Conferma cambio'}</button>
        <span className="text-[11.5px] text-tenue">{sigla ? `firmato ${sigla}` : 'scrivi «La mia sigla» per firmarlo'}</span>
      </div>
    </div>
  )
}

/* Pannello della modalità cambio, fisso in alto mentre si scorrono i giorni */
export function PannelloCambio({ mesi, visto, sigla, sel, setSel, esci, aggiornato }: {
  mesi: Mese[]; visto: string; sigla: string; sel: Sel[]; setSel: (s: Sel[]) => void; esci: () => void; aggiornato: () => void
}) {
  const [dest, setDest] = useState('')
  const [testo, setTesto] = useState('')
  const [scrivi, setScrivi] = useState(false)
  const [scelte, setScelte] = useState<{ 1?: Turno; 2?: Turno }>({})
  const [invio, setInvio] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)
  const note = useMemo(() => sigleNote(mesi), [mesi])
  useEffect(() => { if (sel.length) setMsg(null) }, [sel.length])
  useEffect(() => { if (!sel.length) setDest('') }, [sel.length])

  const D = dest.trim().toUpperCase()
  const composto = useMemo(() => componi(sel, mesi, /^[A-Z]{2,3}$/.test(D) ? D : null, note), [sel, mesi, D, note])
  const esito = useMemo(() => interpreta(testo, { mesi, visto, sigleNote: note, scelte }), [testo, mesi, visto, note, scelte])

  const salva = async (cambi: Nuovo[]) => {
    setInvio(true); setMsg(null)
    try {
      await chiama({ azione: 'aggiungi', autore: sigla || null, cambi: cambi.map(({ descr: _d, ...c }) => c) })
      setSel([]); setDest(''); setTesto(''); setScelte({}); aggiornato()
      setMsg({ ok: true, t: 'Cambio segnato: lo vedono tutti.' })
    } catch (e) { setMsg({ ok: false, t: (e as Error).message }) } finally { setInvio(false) }
  }

  const persone = [...new Set(sel.map((x) => x.s))]
  const suggerite = [...note].filter((s) => !persone.includes(s) && (!D || s.startsWith(D)) && s !== D).sort().slice(0, D ? 12 : 40)

  return (
    <section className="card !p-3 flex flex-col gap-2 shadow-sm max-h-[55vh] overflow-y-auto border-2 !border-verde">
      <div className="flex items-center gap-2">
        <h2 className="font-black text-[15px]">⇄ Cambio turno</h2>
        <span className="flex-1" />
        {sel.length > 0 && <button onClick={() => { setSel([]); setDest(''); setMsg(null) }} className="rounded-full border border-linea px-3 py-1 text-[13px] font-bold text-tenue">Ricomincia</button>}
        <button onClick={esci} className="rounded-full bg-verde px-3 py-1 text-[13px] font-bold text-white">Fine</button>
      </div>

      {sel.length === 0 && !scrivi && (
        <p className="text-[12.5px] leading-snug text-tenue">
          Tocca nel calendario i turni che passano di mano. <b>Turni di una persona</b>: li regala a chi scegli. <b>Turni di due persone</b>: se li scambiano
          (anche due diurni contro una notte). Si possono scegliere più giorni, anche di altri mesi.{' '}
          <button onClick={() => setScrivi(true)} className="font-bold text-verde underline">Oppure scrivi il cambio</button>
        </p>
      )}

      {sel.length === 0 && scrivi && (
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1.5">
            <input value={testo} autoFocus onChange={(e) => { setTesto(e.target.value); setScelte({}); setMsg(null) }}
              onKeyDown={(e) => { if (e.key === 'Enter' && esito.tipo === 'ok' && !invio) salva(esito.cambi) }}
              placeholder="12/12 VR > BN" autoCapitalize="characters" autoCorrect="off" autoComplete="off" spellCheck={false} enterKeyHint="done"
              className="min-w-0 flex-1 rounded-xl border border-linea-forte bg-white px-3 py-2 font-mono text-[16px] font-bold uppercase tracking-wide" />
            <button onClick={() => { setScrivi(false); setTesto('') }} className="rounded-xl border border-linea px-3 text-tenue font-bold" aria-label="Chiudi">×</button>
          </div>
          {esito.tipo === 'vuoto' && <p className="text-[12px] text-tenue"><b className="font-mono">12/12 VR &gt; BN</b> regala · <b className="font-mono">12/12 VR &lt;&gt; BN 15/12</b> scambio · data anche 12, oggi, sab</p>}
          {esito.tipo === 'errore' && testo.trim().length > 4 && <p className="text-[13px] font-bold text-bordeaux">{esito.msg}</p>}
          {esito.tipo === 'scegli' && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[13px] font-bold">{esito.sigla} {esito.data}: quale turno?</span>
              {esito.opzioni.map((o) => <button key={o.t} onClick={() => setScelte((s) => ({ ...s, [esito.lato]: o.t }))} className="rounded-lg bg-verde px-2.5 py-1 text-[13px] font-bold text-white">{o.descr}</button>)}
            </div>
          )}
          {esito.tipo === 'ok' && <Anteprima cambi={esito.cambi} avvisi={esito.avvisi} sigla={sigla} invio={invio} salva={() => salva(esito.cambi)} />}
        </div>
      )}

      {persone.map((p) => (
        <div key={p} className="flex flex-wrap items-center gap-1.5">
          <span className="text-[13px] font-black">{p} lascia:</span>
          {sel.filter((x) => x.s === p).map((x) => (
            <button key={`${x.mese}-${x.g}-${x.t}-${x.i}`} onClick={() => setSel(sel.filter((y) => y !== x))}
              className="rounded-lg bg-[#e8c34a] px-2 py-0.5 text-[12.5px] font-bold text-[#2b2410]" title="Tocca per togliere">
              {dataBreve(x.mese, x.g)} {etichetta(x.t, x.t === 'm' || x.t === 'p' ? x.p : undefined)} ×
            </button>
          ))}
        </div>
      ))}

      {composto.tipo === 'destinatario' && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold">A chi lo regala {composto.da}?</span>
            <input value={dest} onChange={(e) => setDest(e.target.value.toUpperCase())} maxLength={3} placeholder="sigla"
              autoCapitalize="characters" autoCorrect="off" className="w-20 rounded-lg border border-linea-forte bg-white px-2 py-1 text-center font-bold uppercase" />
          </div>
          <div className="flex flex-wrap gap-1">
            {suggerite.map((s) => <button key={s} onClick={() => setDest(s)} className="rounded-lg border border-linea-forte bg-white px-2 py-0.5 text-[12.5px] font-bold">{s}</button>)}
          </div>
          <p className="text-[11.5px] text-tenue">Per uno scambio, invece, tocca un turno dell’altra persona.</p>
        </div>
      )}
      {composto.tipo === 'errore' && <p className="text-[13px] font-bold text-bordeaux">{composto.msg}</p>}
      {composto.tipo === 'ok' && <Anteprima cambi={composto.cambi} avvisi={composto.avvisi} sigla={sigla} invio={invio} salva={() => salva(composto.cambi)} />}
      {msg && <p className={`text-[13px] font-bold ${msg.ok ? 'text-verde' : 'text-bordeaux'}`}>{msg.t}</p>}
    </section>
  )
}

/* Registro dei cambi segnati nell'app per il mese visualizzato, con Annulla */
export function RegistroCambi({ mesi, visto, sigla, aggiornato }: { mesi: Mese[]; visto: string; sigla: string; aggiornato: () => void }) {
  const [invio, setInvio] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)
  const [daAnnullare, setDaAnnullare] = useState<string | null>(null)
  const registro = mesi.find((m) => m.mese === visto)?.registro ?? []
  const gruppi = useMemo(() => {
    const out = new Map<string, Voce[]>()
    for (const v of registro) out.set(v.gruppo, [...(out.get(v.gruppo) ?? []), v])
    return [...out.values()].reverse()
  }, [registro])
  if (!gruppi.length) return null
  const attivi = gruppi.filter((g) => !g[0].annullato_il).length

  const annulla = async (gruppo: string) => {
    setInvio(true); setMsg(null)
    try { await chiama({ azione: 'annulla', gruppo, autore: sigla || null }); aggiornato(); setMsg({ ok: true, t: 'Cambio annullato.' }) }
    catch (e) { setMsg({ ok: false, t: (e as Error).message }) } finally { setInvio(false); setDaAnnullare(null) }
  }

  return (
    <section className="card !p-3">
      <details>
        <summary className="cursor-pointer text-[13px] font-bold text-tenue">⇄ Registro dei cambi segnati nell’app ({attivi}{attivi !== gruppi.length ? ` + ${gruppi.length - attivi} annullati` : ''})</summary>
        {msg && <p className={`mt-2 text-[13px] font-bold ${msg.ok ? 'text-verde' : 'text-bordeaux'}`}>{msg.t}</p>}
        <ul className="mt-2 flex flex-col gap-2">
          {gruppi.map((g) => {
            const v0 = g[0], annullato = !!v0.annullato_il
            return (
              <li key={v0.gruppo} className={`rounded-xl border border-linea bg-white p-2.5 ${annullato ? 'opacity-60' : ''}`}>
                {g.map((v) => (
                  <p key={v.id} className={`text-[13.5px] font-bold ${annullato ? 'line-through' : ''}`}>
                    {dataBreve(v.mese, v.g)} · {NOME_TURNO[v.t]}{v.pos && (v.t === 'm' || v.t === 'p') ? ` ${v.pos}` : ''} · {v.da} → {v.a}
                  </p>
                ))}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11.5px] text-tenue">
                  <span>segnato da {v0.autore ?? 'non firmato'} · {ora(v0.creato_il)}</span>
                  {annullato && <span>· annullato da {v0.annullato_autore ?? 'non firmato'} · {ora(v0.annullato_il!)}</span>}
                  <span className="flex-1" />
                  {!annullato && (daAnnullare === v0.gruppo
                    ? <>
                        <button onClick={() => annulla(v0.gruppo)} disabled={invio} className="rounded-full bg-bordeaux px-3 py-1 font-bold text-white">Sì, annulla</button>
                        <button onClick={() => setDaAnnullare(null)} className="rounded-full border border-linea px-3 py-1 font-bold">No</button>
                      </>
                    : <button onClick={() => setDaAnnullare(v0.gruppo)} className="rounded-full border border-linea-forte px-3 py-1 font-bold text-bordeaux">Annulla</button>)}
                </div>
              </li>
            )
          })}
        </ul>
      </details>
    </section>
  )
}

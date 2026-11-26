import { useMemo, useState } from 'react'
import { CHIAVE_PIN, leggi, scarica } from '../pages/Rubrica'
import { dataBreve, interpreta, NOME_TURNO, TURNI, type Mese, type Turno, type Voce } from '../lib/turni'

/*
 * Riga di comando dei cambi turno (scheda Turni). Chiunque abbia il PIN può segnare un cambio:
 * vale subito, resta nel registro con autore dichiarato e ora, e si può annullare.
 * Funzione: supabase/functions/emergenze-cambi. Sintassi in src/lib/turni.ts (interpreta).
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

export default function RigaCambi({ mesi, visto, sigla, aggiornato }: { mesi: Mese[]; visto: string; sigla: string; aggiornato: () => void }) {
  const [testo, setTesto] = useState('')
  const [scelte, setScelte] = useState<{ 1?: Turno; 2?: Turno }>({})
  const [invio, setInvio] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)
  const [daAnnullare, setDaAnnullare] = useState<string | null>(null)

  const note = useMemo(() => {
    const s = new Set<string>()
    for (const m of mesi) for (const g of m.dati.giorni) for (const t of TURNI) for (const x of g[t].split(' ')) if (x) s.add(x.replace(/[*~]/g, ''))
    s.delete('YY')
    return s
  }, [mesi])
  const esito = useMemo(() => interpreta(testo, { mesi, visto, sigleNote: note, scelte }), [testo, mesi, visto, note, scelte])

  // suggerimenti: sigle che iniziano con le lettere che si stanno scrivendo
  const ultimo = testo.match(/([A-Za-z]{1,2})$/)?.[1]?.toUpperCase()
  const suggerite = ultimo && testo.trim().split(/\s+/).length > 1 ? [...note].filter((s) => s.startsWith(ultimo) && s !== ultimo).sort().slice(0, 8) : []
  const aggiungi = (pezzo: string) => { setTesto((t) => (t.replace(/\s+$/, '') + ' ' + pezzo + ' ').replace(/^\s+/, '')); setScelte({}); setMsg(null) }
  const completa = (s: string) => { setTesto((t) => t.replace(/[A-Za-z]{1,2}$/, s) + ' '); setMsg(null) }

  const salva = async () => {
    if (esito.tipo !== 'ok') return
    setInvio(true); setMsg(null)
    try {
      await chiama({ azione: 'aggiungi', autore: sigla || null, cambi: esito.cambi.map(({ descr: _d, ...c }) => c) })
      setTesto(''); setScelte({}); aggiornato()
      setMsg({ ok: true, t: 'Cambio segnato. Lo vedono tutti al prossimo aggiornamento.' })
    } catch (e) { setMsg({ ok: false, t: (e as Error).message }) } finally { setInvio(false) }
  }
  const annulla = async (gruppo: string) => {
    setInvio(true); setMsg(null)
    try { await chiama({ azione: 'annulla', gruppo, autore: sigla || null }); aggiornato(); setMsg({ ok: true, t: 'Cambio annullato.' }) }
    catch (e) { setMsg({ ok: false, t: (e as Error).message }) } finally { setInvio(false); setDaAnnullare(null) }
  }

  // registro del mese visualizzato, raggruppato per cambio (uno scambio = due righe)
  const registro = mesi.find((m) => m.mese === visto)?.registro ?? []
  const gruppi = useMemo(() => {
    const out = new Map<string, Voce[]>()
    for (const v of registro) out.set(v.gruppo, [...(out.get(v.gruppo) ?? []), v])
    return [...out.values()].reverse()
  }, [registro])
  const attivi = gruppi.filter((g) => !g[0].annullato_il).length

  return (
    <section className="card !p-3 flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <h2 className="font-black text-[15px]">Segna un cambio</h2>
        <span className="text-[11.5px] text-tenue">solo cambi turno · vale subito per tutti</span>
      </div>
      <div className="flex gap-1.5">
        <input value={testo} onChange={(e) => { setTesto(e.target.value); setScelte({}); setMsg(null) }}
          onKeyDown={(e) => { if (e.key === 'Enter' && esito.tipo === 'ok' && !invio) salva() }}
          placeholder="12/12 VR > BN" autoCapitalize="characters" autoCorrect="off" autoComplete="off" spellCheck={false} enterKeyHint="done"
          className="min-w-0 flex-1 rounded-xl border border-linea-forte bg-white px-3 py-2 font-mono text-[16px] font-bold uppercase tracking-wide" />
        {testo && <button onClick={() => { setTesto(''); setScelte({}); setMsg(null) }} className="rounded-xl border border-linea px-3 text-tenue font-bold" aria-label="Svuota">×</button>}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => aggiungi('>')} className="rounded-lg border border-linea-forte bg-white px-2.5 py-1 text-[13px] font-bold">&gt; cede</button>
        <button onClick={() => aggiungi('<>')} className="rounded-lg border border-linea-forte bg-white px-2.5 py-1 text-[13px] font-bold">&lt;&gt; scambia</button>
        {suggerite.map((s) => <button key={s} onClick={() => completa(s)} className="rounded-lg bg-oro3 px-2.5 py-1 text-[13px] font-black">{s}</button>)}
      </div>

      {esito.tipo === 'vuoto' && (
        <p className="text-[12px] leading-snug text-tenue">
          <b className="font-mono">12/12 VR &gt; BN</b> VR cede il turno a BN · <b className="font-mono">12/12 VR &lt;&gt; BN</b> scambio nello stesso giorno ·{' '}
          <b className="font-mono">12/12 VR &lt;&gt; BN 15/12</b> scambio tra due giorni. Data anche come 12, oggi, domani, sab. Il turno si ricava dall’orario
          (se serve: <b className="font-mono">12 P VR &gt; BN</b>).
        </p>
      )}
      {esito.tipo === 'errore' && testo.trim().length > 4 && <p className="text-[13px] font-bold text-bordeaux">{esito.msg}</p>}
      {esito.tipo === 'scegli' && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[13px] font-bold">{esito.sigla} {esito.data}: quale turno?</span>
          {esito.opzioni.map((o) => (
            <button key={o.t} onClick={() => setScelte((s) => ({ ...s, [esito.lato]: o.t }))} className="rounded-lg bg-verde px-2.5 py-1 text-[13px] font-bold text-white">{o.descr}</button>
          ))}
        </div>
      )}
      {esito.tipo === 'ok' && (
        <div className="flex flex-col gap-1.5 rounded-xl bg-oro3/60 p-2.5">
          {esito.cambi.map((c, i) => <p key={i} className="text-[14px] font-bold">{c.descr}</p>)}
          {esito.avvisi.map((a, i) => <p key={i} className="text-[12.5px] font-bold text-[#8a5a00]">⚠︎ {a}</p>)}
          <div className="flex items-center gap-2">
            <button onClick={salva} disabled={invio} className="rounded-full bg-verde px-4 py-2 text-[14px] font-extrabold text-white disabled:opacity-50">{invio ? 'Salvo…' : 'Conferma cambio'}</button>
            <span className="text-[11.5px] text-tenue">{sigla ? `firmato ${sigla}` : 'scrivi «La mia sigla» per firmarlo'}</span>
          </div>
        </div>
      )}
      {msg && <p className={`text-[13px] font-bold ${msg.ok ? 'text-verde' : 'text-bordeaux'}`}>{msg.t}</p>}

      {gruppi.length > 0 && (
        <details className="mt-1">
          <summary className="cursor-pointer text-[13px] font-bold text-tenue">Registro dei cambi segnati nell’app ({attivi}{attivi !== gruppi.length ? ` + ${gruppi.length - attivi} annullati` : ''})</summary>
          <ul className="mt-2 flex flex-col gap-2">
            {gruppi.map((g) => {
              const v0 = g[0], annullato = !!v0.annullato_il
              return (
                <li key={v0.gruppo} className={`rounded-xl border border-linea bg-white p-2.5 ${annullato ? 'opacity-60' : ''}`}>
                  {g.map((v) => (
                    <p key={v.id} className={`text-[13.5px] font-bold ${annullato ? 'line-through' : ''}`}>
                      {dataBreve(v.mese, v.g)} · {NOME_TURNO[v.t]} · {v.da} → {v.a}
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
      )}
    </section>
  )
}

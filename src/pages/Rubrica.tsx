import { useEffect, useMemo, useRef, useState } from 'react'
import { CATEGORIE, ICONE, VOCI, type Numero, type Tono, type Voce } from '../lib/rubrica'

/* ---------- Segnalazioni (restano sul telefono, si inviano con Copia/Condividi) ---------- */
interface Segnalazione { id: string; voce: string; cat: string; numero: string; tipo: 'modifica' | 'elimina' | 'nota'; nuovo: string; nota: string; data: string; vid: string }
const CHIAVE = 'emergenze.rubrica.segnalazioni'
function leggiSegn(): Segnalazione[] {
  try { return JSON.parse(localStorage.getItem(CHIAVE) || '[]') } catch { return [] }
}
function salvaSegn(s: Segnalazione[]) {
  try { localStorage.setItem(CHIAVE, JSON.stringify(s)) } catch { /* storage non disponibile */ }
}

const COLORE: Record<Tono, { fondo: string; tratto: string }> = {
  verde: { fondo: 'var(--color-verde3)', tratto: 'var(--color-verde)' },
  bordeaux: { fondo: 'var(--color-bordeaux3)', tratto: 'var(--color-bordeaux)' },
  oro: { fondo: 'var(--color-oro3)', tratto: 'var(--color-oro)' },
  tenue: { fondo: 'var(--color-sabbia)', tratto: 'var(--color-tenue)' },
}
const catDi = Object.fromEntries(CATEGORIE.map((c) => [c.id, c]))
const vocePer = Object.fromEntries(VOCI.map((v) => [v.id, v]))

// Interni a 4 cifre presenti in più voci: li segnalo sotto la voce.
const usi: Record<string, string[]> = {}
VOCI.forEach((v) => v.numeri.forEach((n) => { if (!n.esterno && n.cifre.length === 4) (usi[n.cifre] ??= []).push(v.id) }))

const dubbia = (v: Voce) => v.cat === 'dub' || v.numeri.some((n) => n.incerto || n.anomalo || n.barrato)
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

function Icona({ cat, size = 40 }: { cat: string; size?: number }) {
  const c = COLORE[catDi[cat].tono]
  return (
    <span className="shrink-0 grid place-items-center rounded-[12px]" style={{ width: size, height: size, background: c.fondo }}>
      <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none" stroke={c.tratto} strokeWidth={1.7}
        strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ICONE[cat] }} />
    </span>
  )
}

type Filtro = 'tutti' | 'guardie' | 'esterni' | 'verificare'

export default function Rubrica() {
  const [cerca, setCerca] = useState('')
  const [tendina, setTendina] = useState(false)
  const [filtro, setFiltro] = useState<Filtro>('tutti')
  const [aperti, setAperti] = useState<Set<string>>(new Set())
  const [foglio, setFoglio] = useState<null | { v: Voce; n: Numero; modo: 'azioni' | 'segnala' }>(null)
  const [elenco, setElenco] = useState(false)
  const [segn, setSegn] = useState<Segnalazione[]>(leggiSegn)
  const [evidenza, setEvidenza] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const boxCerca = useRef<HTMLDivElement>(null)

  const avviso = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 1600) }
  const aggiorna = (s: Segnalazione[]) => { setSegn(s); salvaSegn(s) }

  useEffect(() => {
    const chiudi = (e: MouseEvent) => { if (!boxCerca.current?.contains(e.target as Node)) setTendina(false) }
    document.addEventListener('click', chiudi)
    return () => document.removeEventListener('click', chiudi)
  }, [])

  const visibile = (v: Voce) =>
    filtro === 'guardie' ? v.guardia
      : filtro === 'esterni' ? v.numeri.some((n) => n.esterno)
        : filtro === 'verificare' ? dubbia(v) || segn.some((s) => s.vid === v.id)
          : true

  const risultati = useMemo(() => {
    const q = norm(cerca.trim())
    if (!q) return []
    const termini = q.split(/\s+/)
    const cifre = q.replace(/\D/g, '')
    return VOCI.map((v) => {
      const c = catDi[v.cat]
      const testo = norm(`${v.nome} ${c.nome} ${c.parole} ${v.nota}`)
      let p = 0
      if (termini.every((t) => testo.includes(t))) p += 2 + (norm(v.nome).includes(termini[0]) ? 2 : 0)
      if (cifre.length >= 3 && v.numeri.some((n) => n.cifre.includes(cifre))) p += 5
      if (v.guardia) p += 0.5
      return { v, p }
    }).filter((x) => x.p >= 2).sort((a, b) => b.p - a.p).slice(0, 14).map((x) => x.v)
  }, [cerca])

  const vai = (v: Voce) => {
    setTendina(false); setCerca('')
    ;(document.activeElement as HTMLElement | null)?.blur()
    if (!visibile(v)) setFiltro('tutti')
    setAperti((a) => new Set(a).add(v.cat))
    setEvidenza(v.id)
    setTimeout(() => document.getElementById(`r-${v.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60)
    setTimeout(() => setEvidenza(null), 1800)
  }

  const scegliFiltro = (f: Filtro) => {
    setFiltro(f)
    if (f !== 'tutti') setAperti(new Set(CATEGORIE.map((c) => c.id)))
  }
  const tuttiAperti = aperti.size === CATEGORIE.length
  const segnalata = (v: Voce, n: Numero) => segn.some((s) => s.vid === v.id && s.numero === n.n)

  return (
    <div className="flex flex-col gap-2.5">
      {/* Ricerca con tendina */}
      <div ref={boxCerca} className="relative">
        <input value={cerca} onChange={(e) => { setCerca(e.target.value); setTendina(true) }} onFocus={() => setTendina(true)}
          onKeyDown={(e) => { if (e.key === 'Enter' && risultati[0]) vai(risultati[0]); if (e.key === 'Escape') setTendina(false) }}
          placeholder="Cerca specialità, servizio o numero…" type="search"
          className="w-full rounded-xl border border-linea px-3 py-2.5 text-base" />
        {tendina && cerca.trim() && (
          <div className="absolute inset-x-0 top-[calc(100%+6px)] z-30 card !p-0 max-h-[60vh] overflow-auto">
            {risultati.length ? risultati.map((v) => (
              <button key={v.id} onClick={() => vai(v)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left border-b border-linea last:border-0 active:bg-sabbia">
                <Icona cat={v.cat} size={30} />
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-sm leading-tight">{v.nome}{v.guardia && <span className="ml-1.5 text-[9px] uppercase tracking-wide font-bold text-white bg-verde rounded px-1.5 py-px align-middle">guardia</span>}</span>
                  <span className="block text-[11px] text-tenue leading-tight mt-0.5">{catDi[v.cat].nome}</span>
                </span>
                <span className="text-right font-mono text-[13px] font-semibold leading-tight shrink-0">
                  {v.numeri.slice(0, 2).map((n) => <span key={n.n} className="block">{n.n}</span>)}
                  {v.numeri.length > 2 && <span className="block text-tenue">…</span>}
                </span>
              </button>
            )) : <p className="px-3 py-3 text-sm text-tenue">Nessun risultato.</p>}
          </div>
        )}
      </div>

      {/* Filtri */}
      <div className="flex gap-1.5 overflow-x-auto -mx-0.5 px-0.5 pb-0.5" style={{ scrollbarWidth: 'none' }}>
        {([['tutti', 'Tutti'], ['guardie', 'Guardie'], ['esterni', 'Esterni'], ['verificare', 'Da verificare']] as [Filtro, string][]).map(([f, l]) => (
          <button key={f} onClick={() => scegliFiltro(f)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold border ${filtro === f ? 'bg-verde text-white border-verde' : 'bg-carta text-testo border-linea'}`}>{l}</button>
        ))}
        <button onClick={() => setAperti(tuttiAperti ? new Set() : new Set(CATEGORIE.map((c) => c.id)))}
          className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold border bg-carta border-linea text-tenue">{tuttiAperti ? 'Chiudi tutti' : 'Apri tutti'}</button>
        <button onClick={() => setElenco(true)}
          className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold border bg-carta border-linea">Segnalazioni <span className="text-bordeaux">{segn.length}</span></button>
      </div>

      <p className="text-[11px] text-tenue px-1 leading-snug">
        Tocca un numero per chiamare, copiare o segnalarlo. <span className="rounded px-1 bg-oro3 text-oro font-semibold">giallo</span> lettura incerta ·{' '}
        <span className="rounded px-1 bg-bordeaux3 text-bordeaux font-semibold">rosso</span> formato anomalo · <s>barrato</s> barrato sul foglio.
      </p>

      {/* Blocchi per specialità */}
      {CATEGORIE.map((c) => {
        const voci = VOCI.filter((v) => v.cat === c.id && visibile(v)).sort((a, b) => Number(b.guardia) - Number(a.guardia))
        if (!voci.length) return null
        const guardie = VOCI.filter((v) => v.cat === c.id && v.guardia)
        const open = aperti.has(c.id)
        const esterni = voci.filter((v) => v.numeri.some((n) => n.esterno)).length
        const tratto = COLORE[c.tono].tratto
        return (
          <section key={c.id} className="card !p-0 overflow-hidden">
            <button onClick={() => setAperti((a) => { const s = new Set(a); if (s.has(c.id)) s.delete(c.id); else s.add(c.id); return s })}
              className="w-full flex items-start gap-3 px-3.5 py-3 text-left">
              <Icona cat={c.id} />
              <div className="flex-1 min-w-0">
                <p className="font-bold leading-tight">{c.nome}</p>
                <p className="text-[11px] text-tenue mt-0.5">{voci.length} voci{esterni ? ` · ${esterni} esterne` : ''}</p>
                {guardie.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {guardie.slice(0, 4).map((g) => (
                      <span key={g.id} className="rounded-lg border px-2 py-0.5 text-[11px] leading-tight" style={{ borderColor: tratto, color: tratto }}>
                        <span className="opacity-80 mr-1">{g.nome.replace(/ di guardia| \(.*\)/g, '')}</span>
                        <b className="font-mono text-[12.5px]">{g.numeri.find((n) => !n.barrato)?.n}</b>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className={`text-tenue text-lg leading-none mt-2.5 transition-transform shrink-0 ${open ? 'rotate-90' : ''}`}>›</span>
            </button>
            {open && (
              <div className="border-t border-linea">
                {voci.map((v) => {
                  const condivisi = [...new Set(v.numeri.flatMap((n) => n.esterno ? [] : (usi[n.cifre] ?? []).filter((x) => x !== v.id).map((x) => `${n.cifre} → ${vocePer[x].nome}`)))]
                  const soloEsterno = v.numeri.every((n) => n.esterno)
                  return (
                    <div key={v.id} id={`r-${v.id}`}
                      className={`px-3.5 py-2.5 border-b border-linea last:border-0 scroll-mt-28 transition-colors duration-700 ${evidenza === v.id ? 'bg-oro3' : v.guardia ? 'bg-verde3/45' : ''}`}>
                      <p className="text-sm font-semibold leading-tight flex flex-wrap items-center gap-1.5">
                        {v.nome}
                        {v.guardia && <span className="text-[9px] uppercase tracking-wide font-bold text-white bg-verde rounded px-1.5 py-px">guardia</span>}
                        {soloEsterno && <span className="text-[9px] uppercase tracking-wide font-bold text-tenue border border-linea rounded px-1.5 py-px">esterno</span>}
                      </p>
                      {v.nota && <p className="text-[11px] text-tenue mt-0.5">{v.nota}</p>}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {v.numeri.map((n) => (
                          <button key={n.n} onClick={() => setFoglio({ v, n, modo: 'azioni' })}
                            className={`relative font-mono font-semibold text-[14px] rounded-[10px] border px-2.5 py-1.5 ${
                              n.anomalo ? 'bg-bordeaux3 border-bordeaux2' : n.incerto ? 'bg-oro3 border-oro2' : v.guardia ? 'bg-white border-verde2' : 'bg-white border-linea'
                            } ${n.barrato ? 'line-through opacity-55' : ''}`}>
                            {n.n}{n.incerto ? '?' : ''}
                            {(n.ricostruito || n.penna) && <span className="ml-1 font-sans text-[9.5px] text-tenue font-semibold">{[n.ricostruito && 'ricostr.', n.penna && 'a penna'].filter(Boolean).join(' · ')}</span>}
                            {segnalata(v, n) && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-bordeaux border-2 border-carta" />}
                          </button>
                        ))}
                      </div>
                      {condivisi.length > 0 && <p className="text-[11px] text-bordeaux mt-1.5">Numero presente anche in: {condivisi.join(' · ')}</p>}
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )
      })}

      <p className="text-[11px] text-tenue px-1 mt-1">Trascritta dalle foto dei fogli del PS: guardie e voci evidenziate vanno verificate prima di affidarsi ai numeri.</p>

      {foglio && <FoglioNumero {...foglio} chiudi={() => setFoglio(null)} avviso={avviso}
        segnala={() => setFoglio({ ...foglio, modo: 'segnala' })}
        salva={(s) => { aggiorna([...segn, s]); setFoglio(null); avviso('Segnalazione salvata') }} />}
      {elenco && <ElencoSegnalazioni segn={segn} chiudi={() => setElenco(false)} avviso={avviso}
        rimuovi={(id) => aggiorna(segn.filter((s) => s.id !== id))} />}
      {msg && <div className="fixed left-1/2 -translate-x-1/2 bottom-[calc(100px+env(safe-area-inset-bottom))] z-50 rounded-xl bg-testo text-white text-sm px-3.5 py-2">{msg}</div>}
    </div>
  )
}

function Foglio({ chiudi, children }: { chiudi: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-end justify-center" onClick={chiudi}>
      <div className="bg-carta w-full max-w-lg rounded-t-[20px] px-4 pt-4 pb-[calc(20px+env(safe-area-inset-bottom))] max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

function FoglioNumero({ v, n, modo, chiudi, segnala, salva, avviso }: {
  v: Voce; n: Numero; modo: 'azioni' | 'segnala'; chiudi: () => void; segnala: () => void
  salva: (s: Segnalazione) => void; avviso: (m: string) => void
}) {
  const [tipo, setTipo] = useState<Segnalazione['tipo']>('modifica')
  const [nuovo, setNuovo] = useState('')
  const [nota, setNota] = useState('')
  const stato = [n.incerto && 'lettura incerta', n.anomalo && 'formato anomalo', n.ricostruito && 'ricostruito da notazione abbreviata',
    n.penna && 'aggiunto a penna', n.barrato && 'barrato sul foglio', !n.esterno && 'interno'].filter(Boolean).join(' · ')
  const copia = async () => { try { await navigator.clipboard.writeText(n.cifre); avviso('Copiato') } catch { avviso('Copia non riuscita') } }

  if (modo === 'azioni') return (
    <Foglio chiudi={chiudi}>
      <p className="font-bold text-lg leading-tight">{v.nome}</p>
      <p className="text-xs text-tenue mt-0.5">{catDi[v.cat].nome}{stato && ` — ${stato}`}</p>
      <p className="font-mono font-bold text-3xl my-3">{n.n}</p>
      <div className="grid grid-cols-2 gap-2">
        {n.esterno && <a href={`tel:${n.cifre}`} className="rounded-xl bg-verde text-white font-bold text-sm py-3 text-center">Chiama</a>}
        <button onClick={copia} className={`rounded-xl border border-verde text-verde font-bold text-sm py-3 ${n.esterno ? '' : 'col-span-2'}`}>Copia</button>
        <button onClick={() => { setTipo('modifica'); segnala() }} className="rounded-xl border border-linea font-bold text-sm py-3">Segnala modifica</button>
        <button onClick={() => { setTipo('elimina'); segnala() }} className="rounded-xl border border-linea text-bordeaux font-bold text-sm py-3">Segnala da eliminare</button>
      </div>
    </Foglio>
  )

  return (
    <Foglio chiudi={chiudi}>
      <p className="font-bold text-lg">Segnalazione</p>
      <p className="text-xs text-tenue mt-0.5">{v.nome} · <b className="font-mono">{n.n}</b></p>
      <div className="flex gap-1.5 mt-3">
        {(['modifica', 'elimina', 'nota'] as const).map((t) => (
          <button key={t} onClick={() => setTipo(t)}
            className={`flex-1 rounded-xl border py-2 text-sm font-bold capitalize ${tipo === t ? 'bg-verde text-white border-verde' : 'border-linea'}`}>{t}</button>
        ))}
      </div>
      {tipo === 'modifica' && (
        <label className="block mt-3"><span className="etichetta">Numero corretto</span>
          <input value={nuovo} onChange={(e) => setNuovo(e.target.value)} inputMode="tel" placeholder="es. 4731 oppure 055 7947530"
            className="mt-1 w-full rounded-xl border border-linea px-3 py-2.5" /></label>
      )}
      <label className="block mt-3"><span className="etichetta">Nota (facoltativa)</span>
        <textarea value={nota} onChange={(e) => setNota(e.target.value)} rows={2} placeholder="es. è il cordless del capoturno"
          className="mt-1 w-full rounded-xl border border-linea px-3 py-2.5" /></label>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <button onClick={chiudi} className="rounded-xl border border-linea font-bold text-sm py-3 text-tenue">Annulla</button>
        <button onClick={() => {
          if (tipo === 'modifica' && !nuovo.trim() && !nota.trim()) { avviso('Scrivi il numero corretto o una nota'); return }
          salva({ id: Date.now().toString(36), vid: v.id, voce: v.nome, cat: catDi[v.cat].nome, numero: n.n, tipo, nuovo: tipo === 'modifica' ? nuovo.trim() : '', nota: nota.trim(), data: new Date().toISOString() })
        }} className="rounded-xl bg-bordeaux text-white font-bold text-sm py-3">Salva</button>
      </div>
    </Foglio>
  )
}

function ElencoSegnalazioni({ segn, chiudi, rimuovi, avviso }: { segn: Segnalazione[]; chiudi: () => void; rimuovi: (id: string) => void; avviso: (m: string) => void }) {
  const testo = 'Correzioni rubrica PS:\n' + segn.map((s) =>
    `- [${s.tipo}] ${s.voce} (${s.cat}): ${s.numero}${s.nuovo ? ` → ${s.nuovo}` : ''}${s.nota ? ` — ${s.nota}` : ''}`).join('\n')
  const copia = async () => { try { await navigator.clipboard.writeText(testo); avviso('Elenco copiato') } catch { avviso('Copia non riuscita') } }
  const condividi = async () => { try { await navigator.share({ title: 'Correzioni rubrica PS', text: testo }) } catch { /* annullato */ } }
  return (
    <Foglio chiudi={chiudi}>
      <p className="font-bold text-lg">Segnalazioni ({segn.length})</p>
      <p className="text-xs text-tenue mt-0.5 mb-3">Restano su questo telefono. Copia o condividi l’elenco e incollalo a Claude per aggiornare la rubrica.</p>
      {segn.length ? segn.map((s) => (
        <div key={s.id} className="rounded-xl border border-linea px-3 py-2 mb-2 text-sm">
          <div className="flex justify-between gap-2 font-bold"><span>{s.tipo.toUpperCase()} · {s.voce}</span>
            <button onClick={() => rimuovi(s.id)} className="text-bordeaux text-xs font-bold shrink-0">Rimuovi</button></div>
          <p className="font-mono mt-0.5">{s.numero}{s.nuovo && ` → ${s.nuovo}`}</p>
          {s.nota && <p className="text-xs text-tenue mt-0.5">{s.nota}</p>}
        </div>
      )) : <p className="text-sm text-tenue">Nessuna segnalazione.</p>}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button onClick={copia} disabled={!segn.length} className="rounded-xl bg-verde text-white font-bold text-sm py-3 disabled:opacity-35">Copia elenco</button>
        {'share' in navigator
          ? <button onClick={condividi} disabled={!segn.length} className="rounded-xl border border-verde text-verde font-bold text-sm py-3 disabled:opacity-35">Condividi</button>
          : <button onClick={chiudi} className="rounded-xl border border-linea font-bold text-sm py-3">Chiudi</button>}
      </div>
    </Foglio>
  )
}

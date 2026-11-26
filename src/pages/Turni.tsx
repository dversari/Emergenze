import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CHIAVE_DATI, CHIAVE_PIN, leggi, scarica } from './Rubrica'
import { leggiNumeri, type Numero } from '../lib/rubrica'
import SelettoreMese, { nomeMese, useMeseUrl } from '../components/SelettoreMese'

import { cambiDel, conCambi, conPos, spezza, GIORNI, type Cambio, type Mese, type Sigla } from '../lib/turni'
import RigaCambi from '../components/RigaCambi'

const CHIAVE_SIGLA = 'emergenze.turni.sigla'

const leggiTurni = (): Mese[] => { try { return JSON.parse(leggi(CHIAVE_DATI) ?? '{}').turni ?? [] } catch { return [] } }

/* Colleghi dalla rubrica (dati.colleghi: [etichetta, numero, { s: sigla, n: gruppo }]); più voci con la stessa sigla restano tutte */
type Collega = { nome: string; gruppo: string; numeri: Numero[] }
const leggiColleghi = (): Record<string, Collega[]> => {
  const out: Record<string, Collega[]> = {}
  try {
    const righe: [string, string, { s?: string; n?: string }?][] = JSON.parse(leggi(CHIAVE_DATI) ?? '{}').dati?.colleghi ?? []
    for (const [nome, num, o] of righe) {
      const s = o?.s?.trim().toUpperCase()
      if (s) (out[s] ??= []).push({ nome, gruppo: o?.n ?? '', numeri: leggiNumeri(num ?? '').filter((n) => n.cifre) })
    }
  } catch { /* cache rovinata */ }
  return out
}
/* Numero internazionale per WhatsApp: solo cellulari italiani (3xx) */
const perWa = (c: string) => { const d = c.replace(/^0039|^39(?=3\d{8,9}$)/, ''); return /^3\d{8,9}$/.test(d) ? '39' + d : null }

function SchedaCollega({ sigla, voci, chiudi }: { sigla: string; voci: Collega[]; chiudi: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') chiudi() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [chiudi])
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30" onClick={chiudi}>
      <div onClick={(e) => e.stopPropagation()} className="w-full sm:max-w-md max-h-[80vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-carta p-5 pb-8 shadow-xl flex flex-col gap-4">
        {voci.map((v, i) => (
          <section key={i} className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <span className="h-11 min-w-11 px-1.5 inline-flex items-center justify-center rounded-full bg-verde text-white text-[15px] font-black">{sigla}</span>
              <div className="min-w-0">
                <p className="font-black text-lg leading-tight">{v.nome}</p>
                {v.gruppo && <p className="text-[13px] text-tenue">{v.gruppo}</p>}
              </div>
            </div>
            {v.numeri.length ? v.numeri.map((n, j) => {
              const wa = perWa(n.cifre)
              return (
                <div key={j} className="flex flex-col gap-2">
                  <p className={`text-xl font-bold tracking-wide ${n.barrato ? 'line-through opacity-60' : ''}`}>
                    {n.n}{n.anomalo && <span className="ml-2 text-[12px] font-bold text-bordeaux">formato anomalo</span>}{n.incerto && <span className="ml-2 text-[12px] font-bold text-bordeaux">da verificare</span>}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <a href={`tel:${n.cifre}`} className="rounded-xl bg-verde text-white font-bold text-sm py-3 text-center">Chiama</a>
                    {wa
                      ? <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#1f7a4d] text-white font-bold text-sm py-3 text-center">WhatsApp</a>
                      : <span className="rounded-xl border border-linea text-tenue text-sm py-3 text-center">WhatsApp n.d.</span>}
                  </div>
                </div>
              )
            }) : <p className="text-sm italic text-tenue">Numero non presente in rubrica.</p>}
          </section>
        ))}
        <button onClick={chiudi} className="rounded-full border border-linea-forte py-2.5 font-bold text-tenue">Chiudi</button>
      </div>
    </div>,
    document.body,
  )
}

/* Colori uguali per turno: mattina verde, pomeriggio rosso, notte grigio, nottina nero */
const TONO: Record<string, string> = {
  m: 'bg-[#e1ece4] text-[#2c5a43] border-[#c5d9cb]',
  p: 'bg-[#f3e1df] text-[#6e2f2f] border-[#e3c4c0]',
  n: 'bg-[#e4e4e2] text-[#3a3d3b] border-[#cfcfcc]',
  nn: 'bg-[#2b2d2c] text-white border-[#2b2d2c]',
  r: 'bg-white text-tenue border-dashed border-linea-forte',
}
/* Chi subentra con un cambio: stesso colore del turno, più scuro */
const SCURO: Record<string, string> = {
  m: 'bg-[#2c5a43] text-white border-[#2c5a43]',
  p: 'bg-[#6e2f2f] text-white border-[#6e2f2f]',
  n: 'bg-[#3a3d3b] text-white border-[#3a3d3b]',
  nn: 'bg-[#000000] text-white border-[#000000] ring-1 ring-[#8a8d8b]',
  r: 'bg-[#3a3d3b] text-white border-[#3a3d3b]',
}

function Chip({ x, tono, mia, apri }: { x: Sigla; tono: string; mia: boolean; apri?: (s: string) => void }) {
  const t = tono
  const colore = mia && !x.barrato ? 'bg-[#e8c34a] text-[#2b2410] border-[#b8902a] font-black shadow-sm' : x.sub ? `${SCURO[t]} font-black` : `${TONO[t]} font-bold`
  const cls = `inline-flex items-baseline gap-1 rounded-lg border px-1.5 py-0.5 text-[13px] leading-tight ${colore} ${x.agg ? 'border-2 !border-current' : ''} ${x.barrato ? 'opacity-55' : ''} ${mia && x.barrato ? 'outline outline-2 outline-[#e8c34a]' : ''}`
  const title = x.barrato ? 'Cambio turno: sostituito' : x.sub ? (x.app ? 'Subentrato con cambio segnato nell’app (vedi registro)' : 'Subentrato con cambio turno') : x.agg ? 'Produttività aggiuntiva' : undefined
  const dentro = (<>
    {x.p && <span className="text-[9.5px] font-extrabold opacity-70">{x.p}</span>}
    <span className={`${x.s === 'YY' ? 'opacity-50' : ''} ${x.barrato ? 'line-through decoration-2' : ''} ${apri ? 'underline decoration-dotted decoration-1 underline-offset-2' : ''}`}>{x.s}</span>
    {x.app && <span className="text-[10px] font-black opacity-80" aria-label="cambio segnato nell'app">⇄</span>}
  </>)
  return apri
    ? <button type="button" onClick={() => apri(x.s)} className={`${cls} cursor-pointer active:scale-95`} title={title}>{dentro}</button>
    : <span className={cls} title={title}>{dentro}</span>
}

function Riga({ et, v, tono, mia, vuoto, apri }: { et: string; v: Sigla[]; tono: string; mia: (s: string) => boolean; vuoto?: string; apri: (s: string) => ((s: string) => void) | undefined }) {
  return (
    <div className="flex gap-2 items-start">
      <span className="w-[62px] shrink-0 pt-1 text-[10.5px] font-extrabold uppercase tracking-wide text-tenue">{et}</span>
      <div className="flex flex-wrap gap-1">
        {v.length ? v.map((x, i) => <Chip key={i} x={x} tono={tono} mia={mia(x.s)} apri={apri(x.s)} />) : <span className="pt-0.5 text-[12px] italic text-bordeaux">{vuoto ?? '—'}</span>}
      </div>
    </div>
  )
}

function PinTurni({ fatto }: { fatto: () => void }) {
  const [pin, setPin] = useState(''); const [err, setErr] = useState<string | null>(null); const [att, setAtt] = useState(false)
  const entra = async () => { setAtt(true); setErr(null); try { await scarica(pin.trim()); fatto() } catch (e) { setErr((e as Error).message) } finally { setAtt(false) } }
  return (
    <section className="card text-center max-w-md mx-auto w-full">
      <h2 className="font-black text-xl">Turni del PS</h2>
      <p className="text-[13px] text-tenue mt-1 leading-snug">I turni sono riservati ai colleghi: serve lo stesso PIN della Rubrica (una volta sola su questo dispositivo).</p>
      <input value={pin} onChange={(e) => setPin(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && entra()} inputMode="numeric" placeholder="PIN"
        className="mt-3 w-full rounded-xl border border-linea-forte bg-white px-3 py-2 text-center text-lg tracking-[0.3em]" />
      {err && <p className="mt-2 text-sm text-bordeaux">{err}</p>}
      <button onClick={entra} disabled={att || !pin.trim()} className="mt-3 w-full rounded-full bg-verde py-2.5 font-extrabold text-white disabled:opacity-50">{att ? 'Verifico…' : 'Entra'}</button>
    </section>
  )
}

export default function Turni() {
  const [mesi, setMesi] = useState<Mese[]>(leggiTurni)
  const [sigla, setSigla] = useState(() => leggi(CHIAVE_SIGLA) ?? '')
  const oggi = new Date()
  const disponibili = useMemo(() => mesi.map((m) => m.mese), [mesi])
  const { mese: scelto, vai } = useMeseUrl(disponibili)
  const [soloMiei, setSoloMiei] = useState(false)
  const [colleghi, setColleghi] = useState(leggiColleghi)
  const [aperto, setAperto] = useState<string | null>(null)
  const apri = (s: string) => (colleghi[s] ? setAperto : undefined)
  const rifOggi = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const p = leggi(CHIAVE_PIN)
    if (p) scarica(p).then(() => { setMesi(leggiTurni()); setColleghi(leggiColleghi()) }).catch(() => {})
  }, [])
  const mese = mesi.find((m) => m.mese === scelto)
  useEffect(() => { rifOggi.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }) }, [mese?.mese])

  const S = sigla.trim().toUpperCase()
  const mia = (s: string) => !!S && s === S
  const giorni = useMemo(() => {
    if (!mese) return []
    const [a, mm] = mese.mese.split('-').map(Number)
    const cambi = cambiDel(mese)
    return mese.dati.giorni.map((g) => {
      const d = new Date(a, mm - 1, g.g)
      const cc = (t: Cambio['t']) => cambi.filter((c) => c.g === g.g && c.t === t)
      const r = {
        d, g, m: conCambi(conPos(g.m), cc('m')), p: conCambi(conPos(g.p), cc('p')), n: conCambi(spezza(g.n), cc('n')), nn: conCambi(spezza(g.nn), cc('nn')),
        rm: conCambi(spezza(g.rm), cc('rm')), rp: conCambi(spezza(g.rp), cc('rp')), rn: conCambi(spezza(g.rn), cc('rn')),
      }
      const tutti = [...r.m, ...r.p, ...r.n, ...r.nn, ...r.rm, ...r.rp, ...r.rn].filter((x) => !x.barrato)
      return { ...r, mio: !!S && tutti.some((x) => x.s === S) }
    })
  }, [mese, S])

  if (!leggi(CHIAVE_PIN) && !mesi.length) return <PinTurni fatto={() => { setMesi(leggiTurni()); setColleghi(leggiColleghi()) }} />
  const selettore = (
    <div className="flex flex-wrap items-center gap-2">
      <h1 className="font-display text-2xl font-extrabold">Turni</h1>
      <span className="flex-1" />
      <SelettoreMese mese={scelto} disponibili={disponibili} vai={vai} />
    </div>
  )
  if (!mese) return (
    <div className="flex flex-col gap-3">
      {selettore}
      <p className="card text-tenue">{mesi.length ? `Nessun prospetto per ${nomeMese(scelto)}.` : 'Nessun prospetto caricato.'}</p>
    </div>
  )

  const miei = giorni.filter((x) => x.mio)
  const io = (y: Sigla) => y.s === S && !y.barrato
  const turniMiei = (x: typeof giorni[number]) => [
    ...x.m.filter(io).map((y) => `M-${y.p}`), ...x.p.filter(io).map((y) => `P-${y.p}`),
    ...(x.n.some(io) ? ['Notte'] : []), ...(x.nn.some(io) ? ['Nottina'] : []),
    ...(x.rm.some(io) ? ['Rep M'] : []), ...(x.rp.some(io) ? ['Rep P'] : []), ...(x.rn.some(io) ? ['Rep N'] : []),
  ]

  return (
    <div className="flex flex-col gap-3">
      {selettore}
      {aperto && colleghi[aperto] && <SchedaCollega sigla={aperto} voci={colleghi[aperto]} chiudi={() => setAperto(null)} />}

      <div className="sticky top-[var(--h-testata,0px)] z-[9] -mx-1 px-1 py-1.5 bg-fondo/95 backdrop-blur">
        <section className="card !p-3 flex flex-wrap items-center gap-2 shadow-sm">
          <label className="text-sm font-bold">La mia sigla</label>
          <input value={sigla} maxLength={3} onChange={(e) => { const v = e.target.value.toUpperCase(); setSigla(v); try { localStorage.setItem(CHIAVE_SIGLA, v) } catch { /* privata */ } }}
            placeholder="es. VR" className="w-20 rounded-lg border border-linea-forte bg-white px-2 py-1 text-center font-bold uppercase" />
          {S && <button onClick={() => setSoloMiei((v) => !v)} className={`rounded-full px-3 py-1 text-sm font-bold ${soloMiei ? 'bg-verde text-white' : 'border border-linea text-tenue'}`}>Solo i miei giorni</button>}
          {S && <span className="text-sm text-tenue">{miei.length} giorni con turni</span>}
        </section>
      </div>

      <RigaCambi mesi={mesi} visto={mese.mese} sigla={S} aggiornato={() => { setMesi(leggiTurni()); setColleghi(leggiColleghi()) }} />

      {S && miei.length > 0 && (
        <section className="card !p-3 flex flex-wrap gap-1.5">
          {miei.map((x) => (
            <span key={x.g.g} className="rounded-lg bg-oro3 px-2 py-0.5 text-[12px]"><b>{GIORNI[x.d.getDay()]} {x.g.g}</b> {turniMiei(x).join(' · ')}</span>
          ))}
        </section>
      )}

      <div className="grid gap-2.5 lg:grid-cols-2 xl:grid-cols-3">
        {giorni.filter((x) => !soloMiei || x.mio).map((x) => {
          const festivo = x.d.getDay() === 0 || x.d.getDay() === 6
          const eOggi = x.d.toDateString() === oggi.toDateString()
          return (
            <div key={x.g.g} ref={eOggi ? rifOggi : undefined} style={{ scrollMarginTop: 'calc(var(--h-testata, 0px) + 76px)' }}
              className={`card !p-3 scroll-mt-24 flex flex-col gap-1.5 ${eOggi ? '!border-verde border-2' : ''} ${x.d < oggi && !eOggi ? 'opacity-60' : ''}`}>
              <div className="flex items-baseline gap-2">
                <span className={`text-xl font-black ${festivo ? 'text-bordeaux' : ''}`}>{x.g.g}</span>
                <span className={`text-sm font-bold capitalize ${festivo ? 'text-bordeaux' : 'text-tenue'}`}>{GIORNI[x.d.getDay()]}</span>
                {eOggi && <span className="rounded-full bg-verde px-2 text-[11px] font-bold text-white">oggi</span>}
              </div>
              <Riga et="Mattina" v={x.m} tono="m" mia={mia} apri={apri} />
              <Riga et="Pomer." v={x.p} tono="p" mia={mia} apri={apri} />
              <Riga et="Notte" v={x.n} tono="n" mia={mia} apri={apri} />
              <Riga et="Nottina" v={x.nn} tono="nn" mia={mia} apri={apri} vuoto="scoperta" />
              <div className="flex gap-2 items-start">
                <span className="w-[62px] shrink-0 pt-1 text-[10.5px] font-extrabold uppercase tracking-wide text-tenue">Reper.</span>
                <div className="flex flex-wrap gap-1">
                  {([['M', x.rm], ['P', x.rp], ['N', x.rn]] as const).flatMap(([k, v]) => v.map((y, i) => <Chip key={k + i} x={{ ...y, p: k }} tono="r" mia={mia(y.s)} apri={apri(y.s)} />))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <section className="card !p-3 text-[12px] text-tenue leading-snug flex flex-wrap gap-x-4 gap-y-1">
        <span><b>F1/F2</b> flussi</span><span><b>A</b> alta</span><span><b>B</b> boarding</span><span><b>L</b> bassa</span><span><b>TVR</b></span>
        <span>bordo spesso = produttività aggiuntiva</span><span>sigla sottolineata: tocca per nome e numero</span><span>in giallo: la sigla scritta in «La mia sigla»</span><span>fuori turno e OBI non riportati</span>
        <span><s>barrato</s> = ceduto con cambio turno; in colore scuro, in fondo alla riga, chi subentra; ⇄ = cambio segnato nell’app</span>
        <span>Fonte: prospetto mensile (I. Grassi) + cambi turno segnalati.</span>
      </section>
    </div>
  )
}

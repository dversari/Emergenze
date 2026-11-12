import { useEffect, useMemo, useRef, useState } from 'react'
import { CHIAVE_DATI, CHIAVE_PIN, leggi, scarica } from './Rubrica'

/*
 * Turni del PS dal prospetto mensile (scaricati con il PIN della rubrica, mai nel codice pubblico).
 * Ogni cella: sigle separate da spazio; «*» = produttività aggiuntiva (grassetto nel PDF), «~» = TVR (corsivo).
 * Postazioni per posizione — mattina: F1 F2 A A B B L L L; pomeriggio: TVR (se la prima è in corsivo) poi come la mattina.
 */
type Giorno = { g: number; m: string; p: string; n: string; nn: string; rm: string; rp: string; rn: string }
type Mese = { mese: string; dati: { mese: string; giorni: Giorno[] } }
type Sigla = { s: string; agg: boolean; tvr: boolean; p?: string }

const POS = ['F1', 'F2', 'A', 'A', 'B', 'B', 'L', 'L', 'L']
const spezza = (t: string): Sigla[] => t.split(' ').filter(Boolean).map((x) => ({ s: x.replace(/[*~]/g, ''), agg: x.includes('*'), tvr: x.includes('~') }))
const conPos = (t: string): Sigla[] => {
  const v = spezza(t)
  const pos = v[0]?.tvr ? ['TVR', ...POS] : POS
  return v.map((x, i) => ({ ...x, p: pos[i] ?? '' }))
}
const GIORNI = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab']
const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre']
const CHIAVE_SIGLA = 'emergenze.turni.sigla'

const leggiTurni = (): Mese[] => { try { return JSON.parse(leggi(CHIAVE_DATI) ?? '{}').turni ?? [] } catch { return [] } }

/* Colori uguali per turno: mattina verde, pomeriggio rosso, notte grigio, nottina nero */
const TONO: Record<string, string> = {
  m: 'bg-[#e1ece4] text-[#2c5a43] border-[#c5d9cb]',
  p: 'bg-[#f3e1df] text-[#6e2f2f] border-[#e3c4c0]',
  n: 'bg-[#e4e4e2] text-[#3a3d3b] border-[#cfcfcc]',
  nn: 'bg-[#2b2d2c] text-white border-[#2b2d2c]',
  r: 'bg-white text-tenue border-dashed border-linea-forte',
}

function Chip({ x, tono, mia }: { x: Sigla; tono: string; mia: boolean }) {
  const t = tono
  return (
    <span className={`inline-flex items-baseline gap-1 rounded-lg border px-1.5 py-0.5 text-[13px] leading-tight ${mia ? 'bg-[#e8c34a] text-[#2b2410] border-[#b8902a] font-black shadow-sm' : `${TONO[t]} font-bold`} ${x.agg ? 'border-2 !border-current' : ''}`}
      title={x.agg ? 'Produttività aggiuntiva' : undefined}>
      {x.p && <span className="text-[9.5px] font-extrabold opacity-70">{x.p}</span>}
      <span className={x.s === 'YY' ? 'opacity-50' : ''}>{x.s}</span>
    </span>
  )
}

function Riga({ et, v, tono, mia, vuoto }: { et: string; v: Sigla[]; tono: string; mia: (s: string) => boolean; vuoto?: string }) {
  return (
    <div className="flex gap-2 items-start">
      <span className="w-[62px] shrink-0 pt-1 text-[10.5px] font-extrabold uppercase tracking-wide text-tenue">{et}</span>
      <div className="flex flex-wrap gap-1">
        {v.length ? v.map((x, i) => <Chip key={i} x={x} tono={tono} mia={mia(x.s)} />) : <span className="pt-0.5 text-[12px] italic text-bordeaux">{vuoto ?? '—'}</span>}
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
  const chiaveOggi = `${oggi.getFullYear()}-${String(oggi.getMonth() + 1).padStart(2, '0')}`
  const [scelto, setScelto] = useState<string | null>(null)
  const [soloMiei, setSoloMiei] = useState(false)
  const rifOggi = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const p = leggi(CHIAVE_PIN)
    if (p) scarica(p).then(() => setMesi(leggiTurni())).catch(() => {})
  }, [])
  const mese = mesi.find((m) => m.mese === (scelto ?? chiaveOggi)) ?? mesi[mesi.length - 1]
  useEffect(() => { rifOggi.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }) }, [mese?.mese])

  const S = sigla.trim().toUpperCase()
  const mia = (s: string) => !!S && s === S
  const giorni = useMemo(() => {
    if (!mese) return []
    const [a, mm] = mese.mese.split('-').map(Number)
    return mese.dati.giorni.map((g) => {
      const d = new Date(a, mm - 1, g.g)
      const r = { d, g, m: conPos(g.m), p: conPos(g.p), n: spezza(g.n), nn: spezza(g.nn), rm: spezza(g.rm), rp: spezza(g.rp), rn: spezza(g.rn) }
      const tutti = [...r.m, ...r.p, ...r.n, ...r.nn, ...r.rm, ...r.rp, ...r.rn]
      return { ...r, mio: !!S && tutti.some((x) => x.s === S) }
    })
  }, [mese, S])

  if (!leggi(CHIAVE_PIN) && !mesi.length) return <PinTurni fatto={() => setMesi(leggiTurni())} />
  if (!mese) return <p className="card text-tenue">Nessun prospetto caricato.</p>

  const [anno, nm] = mese.mese.split('-').map(Number)
  const miei = giorni.filter((x) => x.mio)
  const turniMiei = (x: typeof giorni[number]) => [
    ...x.m.filter((y) => y.s === S).map((y) => `M-${y.p}`), ...x.p.filter((y) => y.s === S).map((y) => `P-${y.p}`),
    ...(x.n.some((y) => y.s === S) ? ['Notte'] : []), ...(x.nn.some((y) => y.s === S) ? ['Nottina'] : []),
    ...(x.rm.some((y) => y.s === S) ? ['Rep M'] : []), ...(x.rp.some((y) => y.s === S) ? ['Rep P'] : []), ...(x.rn.some((y) => y.s === S) ? ['Rep N'] : []),
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="font-display text-2xl font-extrabold capitalize">Turni {MESI[nm - 1]} {anno}</h1>
        <span className="flex-1" />
        {mesi.length > 1 && mesi.map((m) => (
          <button key={m.mese} onClick={() => setScelto(m.mese)} className={`rounded-full px-3 py-1 text-sm font-bold capitalize ${m.mese === mese.mese ? 'bg-verde text-white' : 'border border-linea text-tenue'}`}>{MESI[Number(m.mese.slice(5)) - 1].slice(0, 3)}</button>
        ))}
      </div>

      <section className="card !p-3 flex flex-wrap items-center gap-2">
        <label className="text-sm font-bold">La mia sigla</label>
        <input value={sigla} maxLength={3} onChange={(e) => { const v = e.target.value.toUpperCase(); setSigla(v); try { localStorage.setItem(CHIAVE_SIGLA, v) } catch { /* privata */ } }}
          placeholder="es. VR" className="w-20 rounded-lg border border-linea-forte bg-white px-2 py-1 text-center font-bold uppercase" />
        {S && <button onClick={() => setSoloMiei((v) => !v)} className={`rounded-full px-3 py-1 text-sm font-bold ${soloMiei ? 'bg-verde text-white' : 'border border-linea text-tenue'}`}>Solo i miei giorni</button>}
        {S && <span className="text-sm text-tenue">{miei.length} giorni con turni</span>}
        {S && miei.length > 0 && (
          <div className="w-full flex flex-wrap gap-1.5 pt-1">
            {miei.map((x) => (
              <span key={x.g.g} className="rounded-lg bg-oro3 px-2 py-0.5 text-[12px]"><b>{GIORNI[x.d.getDay()]} {x.g.g}</b> {turniMiei(x).join(' · ')}</span>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-2.5 lg:grid-cols-2 xl:grid-cols-3">
        {giorni.filter((x) => !soloMiei || x.mio).map((x) => {
          const festivo = x.d.getDay() === 0 || x.d.getDay() === 6
          const eOggi = x.d.toDateString() === oggi.toDateString()
          return (
            <div key={x.g.g} ref={eOggi ? rifOggi : undefined}
              className={`card !p-3 scroll-mt-24 flex flex-col gap-1.5 ${eOggi ? '!border-verde border-2' : ''} ${x.d < oggi && !eOggi ? 'opacity-60' : ''}`}>
              <div className="flex items-baseline gap-2">
                <span className={`text-xl font-black ${festivo ? 'text-bordeaux' : ''}`}>{x.g.g}</span>
                <span className={`text-sm font-bold capitalize ${festivo ? 'text-bordeaux' : 'text-tenue'}`}>{GIORNI[x.d.getDay()]}</span>
                {eOggi && <span className="rounded-full bg-verde px-2 text-[11px] font-bold text-white">oggi</span>}
              </div>
              <Riga et="Mattina" v={x.m} tono="m" mia={mia} />
              <Riga et="Pomer." v={x.p} tono="p" mia={mia} />
              <Riga et="Notte" v={x.n} tono="n" mia={mia} />
              <Riga et="Nottina" v={x.nn} tono="nn" mia={mia} vuoto="scoperta" />
              <div className="flex gap-2 items-start">
                <span className="w-[62px] shrink-0 pt-1 text-[10.5px] font-extrabold uppercase tracking-wide text-tenue">Reper.</span>
                <div className="flex flex-wrap gap-1">
                  {([['M', x.rm], ['P', x.rp], ['N', x.rn]] as const).flatMap(([k, v]) => v.map((y, i) => <Chip key={k + i} x={{ ...y, p: k }} tono="r" mia={mia(y.s)} />))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <section className="card !p-3 text-[12px] text-tenue leading-snug flex flex-wrap gap-x-4 gap-y-1">
        <span><b>F1/F2</b> flussi</span><span><b>A</b> alta</span><span><b>B</b> boarding</span><span><b>L</b> bassa</span><span><b>TVR</b></span>
        <span>bordo spesso = produttività aggiuntiva</span><span>in giallo: la sigla scritta in «La mia sigla»</span><span>fuori turno e OBI non riportati</span>
        <span>Fonte: prospetto mensile (I. Grassi); i cambi successivi non sono inclusi.</span>
      </section>
    </div>
  )
}

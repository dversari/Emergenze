import { useEffect, useMemo, useState } from 'react'
import { CHIAVE_DATI, CHIAVE_PIN, leggi, scarica } from './Rubrica'

/*
 * Riunioni e comunicazioni del Direttore (email di S. Magazzini).
 * I testi e gli allegati sono pubblicati cifrati (AES-256-GCM) in public/r/; la chiave arriva
 * dalla funzione della rubrica solo dopo il PIN e resta nella cache del dispositivo.
 */
type Allegato = { nome: string; file: string; mime: string; kb: number }
type Voce = { id: string; data: string; tipo: 'riunione' | 'comunicazione'; titolo: string; descrizione: string; testo: string; allegati: Allegato[] }

const base = import.meta.env.BASE_URL
const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']
export const chiaveSalvata = (): string | null => { try { return JSON.parse(leggi(CHIAVE_DATI) ?? '{}').riunioni ?? null } catch { return null } }

export async function decifra(chiave: string, file: string): Promise<ArrayBuffer> {
  const r = await fetch(`${base}r/${file}`, { cache: 'no-cache' })
  if (!r.ok) throw new Error('File non trovato')
  const b = new Uint8Array(await r.arrayBuffer())
  const k = await crypto.subtle.importKey('raw', Uint8Array.from(atob(chiave), (c) => c.charCodeAt(0)), 'AES-GCM', false, ['decrypt'])
  return crypto.subtle.decrypt({ name: 'AES-GCM', iv: b.slice(0, 12) }, k, b.slice(12))
}

const STILE = {
  riunione: { card: 'border-[#b9cbe0] bg-[#e8eff7]', chip: 'bg-[#2f5680] text-white', testo: 'text-[#24476d]', nome: 'Riunione' },
  comunicazione: { card: 'border-linea bg-white', chip: 'bg-[#ece6da] text-[#6b5a3a]', testo: '', nome: 'Comunicazione' },
}

function Data({ d }: { d: string }) {
  const [a, m, g] = d.split('-').map(Number)
  return (
    <span className="flex w-12 shrink-0 flex-col items-center rounded-xl border border-linea bg-white py-1 leading-none">
      <span className="text-[19px] font-black">{g}</span>
      <span className="text-[10.5px] font-bold uppercase text-tenue">{MESI[m - 1]}</span>
      <span className="text-[9.5px] text-tenue">{a}</span>
    </span>
  )
}

function FileAllegato({ a, chiave }: { a: Allegato; chiave: string }) {
  const [url, setUrl] = useState<string | null>(null)
  const [stato, setStato] = useState<'' | 'carico' | 'errore'>('')
  useEffect(() => () => { if (url) URL.revokeObjectURL(url) }, [url])
  const prepara = async () => {
    setStato('carico')
    try { setUrl(URL.createObjectURL(new Blob([await decifra(chiave, a.file)], { type: a.mime }))); setStato('') } catch { setStato('errore') }
  }
  const icona = a.mime.includes('pdf') ? '📄' : '📝'
  return (
    <div className="flex items-center gap-2 rounded-xl border border-linea bg-sabbia/40 px-3 py-2">
      <span className="text-lg leading-none">{icona}</span>
      <span className="min-w-0 flex-1 text-[13px] font-bold leading-tight">{a.nome}<span className="ml-1 font-normal text-tenue">· {a.kb >= 1024 ? `${(a.kb / 1024).toFixed(1)} MB` : `${a.kb} KB`}</span></span>
      {url
        ? <a href={url} target="_blank" rel="noopener" download={a.mime.includes('pdf') ? undefined : a.nome} className="rounded-full bg-verde px-3 py-1 text-[13px] font-extrabold text-white">Apri</a>
        : <button onClick={prepara} disabled={stato === 'carico'} className="rounded-full border border-verde px-3 py-1 text-[13px] font-extrabold text-verde disabled:opacity-50">
            {stato === 'carico' ? 'Carico…' : stato === 'errore' ? 'Riprova' : 'Scarica'}
          </button>}
    </div>
  )
}

function Scheda({ v, chiave, aperta, apri }: { v: Voce; chiave: string; aperta: boolean; apri: () => void }) {
  const s = STILE[v.tipo]
  return (
    <article id={`r-${v.id}`} className={`rounded-2xl border p-3 shadow-[var(--shadow-card)] ${s.card} ${aperta ? 'lg:col-span-2' : ''}`}>
      <button onClick={apri} className="flex w-full items-start gap-3 text-left">
        <Data d={v.data} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wide ${s.chip}`}>{s.nome}</span>
            {v.allegati.length > 0 && <span className="text-[11px] font-bold text-tenue">📎 {v.allegati.length}</span>}
          </span>
          <span className={`mt-1 block text-[15.5px] font-black leading-tight ${s.testo}`}>{v.titolo}</span>
          <span className={`mt-1 block text-[13px] leading-snug text-tenue ${aperta ? '' : 'line-clamp-2'}`}>{v.descrizione}</span>
        </span>
        <span className={`pt-1 text-tenue transition-transform ${aperta ? 'rotate-90' : ''}`}>›</span>
      </button>
      {aperta && (
        <div className="mt-3 flex flex-col gap-2 border-t border-linea pt-3">
          <p className="etichetta">Testo dell’email</p>
          <div className="whitespace-pre-line rounded-xl bg-white px-3 py-2.5 text-[14px] leading-relaxed">{v.testo}</div>
          {v.allegati.length > 0 && <p className="etichetta mt-1">Allegati</p>}
          {v.allegati.map((a) => <FileAllegato key={a.file} a={a} chiave={chiave} />)}
        </div>
      )}
    </article>
  )
}

export function PinRiunioni({ fatto, titolo = 'Riunioni e comunicazioni', testo = 'Comunicazioni interne del reparto' }: { fatto: () => void; titolo?: string; testo?: string }) {
  const [pin, setPin] = useState(''); const [err, setErr] = useState<string | null>(null); const [att, setAtt] = useState(false)
  const entra = async () => { setAtt(true); setErr(null); try { await scarica(pin.trim()); fatto() } catch (e) { setErr((e as Error).message) } finally { setAtt(false) } }
  return (
    <section className="card text-center max-w-md mx-auto w-full">
      <h2 className="font-black text-xl">{titolo}</h2>
      <p className="text-[13px] text-tenue mt-1 leading-snug">{testo}: serve lo stesso PIN della Rubrica (una volta sola su questo dispositivo).</p>
      <input value={pin} onChange={(e) => setPin(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && entra()} inputMode="numeric" placeholder="PIN"
        className="mt-3 w-full rounded-xl border border-linea-forte bg-white px-3 py-2 text-center text-lg tracking-[0.3em]" />
      {err && <p className="mt-2 text-sm text-bordeaux">{err}</p>}
      <button onClick={entra} disabled={att || !pin.trim()} className="mt-3 w-full rounded-full bg-verde py-2.5 font-extrabold text-white disabled:opacity-50">{att ? 'Verifico…' : 'Entra'}</button>
    </section>
  )
}

export default function Riunioni() {
  const [chiave, setChiave] = useState<string | null>(chiaveSalvata)
  const [voci, setVoci] = useState<Voce[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<'tutte' | 'riunione' | 'comunicazione'>('tutte')
  const [aperta, setAperta] = useState<string | null>(null)
  const [cerca, setCerca] = useState('')

  // Aggiorna in silenzio (o recupera la chiave se la cache è di una versione precedente)
  useEffect(() => {
    const p = leggi(CHIAVE_PIN)
    if (p) scarica(p).then(() => setChiave(chiaveSalvata())).catch(() => {})
  }, [])
  useEffect(() => {
    if (!chiave) return
    decifra(chiave, 'indice.bin').then((b) => setVoci(JSON.parse(new TextDecoder().decode(b)).voci)).catch(() => setErr('Impossibile leggere le comunicazioni: riprova con la rete attiva.'))
  }, [chiave])

  const elenco = useMemo(() => {
    const q = cerca.trim().toLowerCase()
    return (voci ?? []).filter((v) => (filtro === 'tutte' || v.tipo === filtro) && (!q || `${v.titolo} ${v.descrizione} ${v.testo}`.toLowerCase().includes(q)))
  }, [voci, filtro, cerca])

  if (!chiave) {
    if (leggi(CHIAVE_PIN)) return <p className="card text-tenue">Aggiorno i dati…</p>
    return <PinRiunioni fatto={() => setChiave(chiaveSalvata())} />
  }
  const n = (t: string) => (voci ?? []).filter((v) => v.tipo === t).length

  return (
    <div className="flex flex-col gap-3 lg:max-w-5xl lg:mx-auto w-full">
      <div>
        <h1 className="font-display text-2xl font-extrabold">Riunioni e comunicazioni</h1>
        <p className="text-[13px] text-tenue">Dalle email del Direttore del DEA (S. Magazzini), dalla più recente. Tocca una scheda per il testo completo e gli allegati.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {([['tutte', `Tutte · ${voci?.length ?? 0}`], ['riunione', `Riunioni · ${n('riunione')}`], ['comunicazione', `Comunicazioni · ${n('comunicazione')}`]] as const).map(([k, t]) => (
          <button key={k} onClick={() => setFiltro(k)}
            className={`rounded-full px-3 py-1 text-sm font-bold ${filtro === k ? (k === 'riunione' ? 'bg-[#2f5680] text-white' : 'bg-verde text-white') : 'border border-linea text-tenue'}`}>{t}</button>
        ))}
        <input value={cerca} onChange={(e) => setCerca(e.target.value)} placeholder="Cerca…" className="ml-auto w-full sm:w-56 rounded-full border border-linea-forte bg-white px-3 py-1 text-sm" />
      </div>
      {err && <p className="card text-bordeaux">{err}</p>}
      {!voci && !err && <p className="card text-tenue">Carico…</p>}
      <div className="grid gap-2.5 lg:grid-cols-2">
        {elenco.map((v) => <Scheda key={v.id} v={v} chiave={chiave} aperta={aperta === v.id} apri={() => setAperta(aperta === v.id ? null : v.id)} />)}
      </div>
      {voci && !elenco.length && <p className="card text-tenue">Nessuna voce.</p>}
    </div>
  )
}

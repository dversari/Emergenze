/*
 * «Figurine» degli equivalenti di STEMI e dei pattern da non perdere (ESC 2023, ACC/AHA 2025).
 * ECG schematici disegnati in SVG: 1 mm = 4 px; non sono tracciati reali.
 */
import { useEffect, useState } from 'react'

interface Battito {
  p?: number; q?: number; r: number; s?: number
  /** ST al punto J e a fine segmento (mm, positivo = sopraslivellato) */
  j?: number; st?: number
  /** onda T (mm, negativo = invertita); bifasica: prima su poi giù */
  t?: number; bifasica?: boolean; tLarga?: boolean
  /** QRS largo (blocco di branca / pacemaker) */
  largo?: boolean
}
interface Derivazione { nome: string; b: Battito; nota?: string; evidenzia?: boolean }
export interface Ecg { id: string; nome: string; breve: string; righe: string[]; derivazioni: Derivazione[] }

export const ECG: Ecg[] = [
  {
    id: 'bbsx', nome: 'Blocco di branca sinistro o pacemaker (Sgarbossa)', breve: 'BBS/PM con ischemia',
    righe: [
      'BBS o ritmo da pacemaker con sintomi ischemici in atto = trattare come STEMI (ESC 2023), soprattutto se Sgarbossa positivo.',
      'Criteri di Sgarbossa (modificati da Smith): ST↑ concordante ≥ 1 mm dove il QRS è positivo; ST↓ concordante ≥ 1 mm in V1–V3; ST↑ discordante eccessivo (≥ 25% della profondità della S).',
    ],
    derivazioni: [
      { nome: 'V5', b: { r: 12, s: 0, j: 2, st: 2, t: 4, largo: true }, nota: 'ST↑ concordante ≥ 1 mm', evidenzia: true },
      { nome: 'V2', b: { r: 1, s: 14, j: -2, st: -2, t: -2, largo: true }, nota: 'ST↓ concordante ≥ 1 mm', evidenzia: true },
      { nome: 'V3', b: { r: 1, s: 12, j: 5, st: 5.5, t: 7, largo: true }, nota: 'ST↑ discordante ≥ 25% della S', evidenzia: true },
      { nome: 'V1 (BBS non ischemico)', b: { r: 1, s: 14, j: 1.5, st: 2, t: 4, largo: true }, nota: 'discordanza attesa, proporzionata' },
    ],
  },
  {
    id: 'posteriore', nome: 'Infarto posteriore (circonflessa)', breve: 'Posteriore',
    righe: [
      'ST↓ orizzontale in V1–V3 (spesso con R alta e T positiva) = immagine speculare di un sopraslivellamento posteriore.',
      'Registrare V7–V9: ST↑ ≥ 0,5 mm (≥ 1 mm nell’uomo < 40 anni) = STEMI posteriore → emodinamica.',
    ],
    derivazioni: [
      { nome: 'V2', b: { r: 9, s: 2, j: -2.5, st: -2.5, t: 4 }, nota: 'ST↓ orizzontale, R alta, T positiva', evidenzia: true },
      { nome: 'V3', b: { r: 8, s: 3, j: -2, st: -2, t: 4 } },
      { nome: 'V8', b: { q: 1.5, r: 4, s: 0, j: 1, st: 1.2, t: 2.5 }, nota: 'ST↑ ≥ 0,5 mm', evidenzia: true },
    ],
  },
  {
    id: 'de-winter', nome: 'Onde T di de Winter', breve: 'de Winter',
    righe: [
      'ST↓ ascendente 1–3 mm al punto J in V1–V6 che continua in onde T alte, simmetriche; spesso lieve ST↑ in aVR.',
      'Occlusione acuta della discendente anteriore prossimale: equivalente di STEMI → emodinamica.',
    ],
    derivazioni: [
      { nome: 'V2', b: { r: 6, s: 6, j: -2.5, st: 0, t: 11, tLarga: true }, nota: 'J depresso, ST ascendente, T gigante', evidenzia: true },
      { nome: 'V4', b: { r: 10, s: 3, j: -2, st: 0, t: 10, tLarga: true }, evidenzia: true },
      { nome: 'aVR', b: { r: 1, s: 7, j: 1, st: 1, t: -2 }, nota: 'lieve ST↑' },
    ],
  },
  {
    id: 'avr', nome: 'ST↑ in aVR con sottoslivellamento diffuso', breve: 'aVR',
    righe: [
      'ST↓ ≥ 1 mm in ≥ 6 derivazioni (soprattutto V4–V6, I, II) con ST↑ in aVR e/o V1.',
      'Ischemia sottoendocardica diffusa: tronco comune o malattia trivasale (o anemia/shock). Con instabilità → coronarografia immediata.',
    ],
    derivazioni: [
      { nome: 'aVR', b: { r: 1, s: 8, j: 2, st: 2, t: -2 }, nota: 'ST↑', evidenzia: true },
      { nome: 'II', b: { r: 10, s: 1, j: -2, st: -2, t: 2 }, nota: 'ST↓', evidenzia: true },
      { nome: 'V5', b: { r: 12, s: 1, j: -2.5, st: -2.5, t: 2 }, nota: 'ST↓', evidenzia: true },
    ],
  },
  {
    id: 'iperacute', nome: 'Onde T iperacute', breve: 'T iperacute',
    righe: [
      'T larghe alla base, alte e simmetriche, sproporzionate rispetto al QRS: spesso precedono il sopraslivellamento.',
      'Ripetere l’ECG ogni 10–15 min; con dolore in atto parlare subito con l’emodinamista.',
    ],
    derivazioni: [
      { nome: 'V2', b: { r: 5, s: 8, j: 1, st: 2, t: 11, tLarga: true }, nota: 'T larga e simmetrica', evidenzia: true },
      { nome: 'V3', b: { r: 7, s: 6, j: 1, st: 2, t: 12, tLarga: true }, evidenzia: true },
      { nome: 'V3 normale', b: { r: 7, s: 6, j: 0.5, st: 0.8, t: 4 }, nota: 'confronto' },
    ],
  },
  {
    id: 'vd', nome: 'Infarto del ventricolo destro', breve: 'Ventricolo destro',
    righe: [
      'In ogni STEMI inferiore registrare V3R–V4R: ST↑ ≥ 0,5 mm (≥ 1 mm nell’uomo < 30 anni) = coinvolgimento del VD.',
      'Niente nitrati né diuretici; liquidi se ipoteso.',
    ],
    derivazioni: [
      { nome: 'III', b: { q: 2, r: 7, s: 0, j: 3, st: 3.5, t: 5 }, nota: 'STEMI inferiore', evidenzia: true },
      { nome: 'V4R', b: { r: 3, s: 4, j: 1, st: 1.2, t: 3 }, nota: 'ST↑ ≥ 0,5 mm', evidenzia: true },
      { nome: 'aVL', b: { r: 5, s: 2, j: -1.5, st: -1.5, t: -2 }, nota: 'speculare' },
    ],
  },
  {
    id: 'wellens', nome: 'Sindrome di Wellens (da non perdere)', breve: 'Wellens',
    righe: [
      'Fuori dal dolore: T bifasiche (tipo A) o profondamente invertite e simmetriche (tipo B) in V2–V3, troponina spesso normale o poco alta.',
      'Stenosi critica della discendente anteriore prossimale: non è uno STEMI ma serve coronarografia precoce; niente test da sforzo.',
    ],
    derivazioni: [
      { nome: 'V2 tipo A', b: { r: 6, s: 6, j: 0, st: 0.3, t: 3, bifasica: true }, nota: 'T bifasica', evidenzia: true },
      { nome: 'V3 tipo B', b: { r: 7, s: 5, j: 0, st: 0, t: -7, tLarga: true }, nota: 'T profonda e simmetrica', evidenzia: true },
    ],
  },
]

const mm = 4
/** Un battito schematico a partire da x0 sulla linea di base y. */
function battito(x0: number, y: number, b: Battito) {
  const w = b.largo ? 1.8 : 1
  const Y = (v: number) => y - v * mm
  const p = b.p ?? 1.5
  const pts: string[] = []
  pts.push(`M${x0} ${y}`, `L${x0 + 4} ${y}`, `Q${x0 + 10} ${Y(p * 2)} ${x0 + 16} ${y}`, `L${x0 + 22} ${y}`)
  let x = x0 + 22
  if (b.q) { x += 2 * w; pts.push(`L${x} ${Y(-b.q)}`) }
  x += 4 * w; pts.push(`L${x} ${Y(b.r)}`)
  if (b.largo && b.r > 6) { x += 2 * w; pts.push(`L${x} ${Y(b.r - 2)}`); x += 2 * w; pts.push(`L${x} ${Y(b.r)}`) }
  x += 4 * w; pts.push(`L${x} ${Y(-(b.s ?? 0))}`)
  x += 3 * w; const j = b.j ?? 0; pts.push(`L${x} ${Y(j)}`)
  const st = b.st ?? j
  x += 10; pts.push(`L${x} ${Y(st)}`)
  const tw = b.tLarga ? 26 : 20
  const t = b.t ?? 2.5
  if (b.bifasica) {
    pts.push(`Q${x + tw / 4} ${Y(st + t * 2)} ${x + tw / 2} ${Y(st)}`, `Q${x + (tw * 3) / 4} ${Y(st - t * 2)} ${x + tw} ${y}`)
  } else {
    pts.push(`Q${x + tw / 2} ${Y(st + t * 2)} ${x + tw} ${y}`)
  }
  x += tw; pts.push(`L${x + 10} ${y}`)
  return { d: pts.join(' '), fine: x + 10 }
}

function Traccia({ d }: { d: Derivazione }) {
  const W = 190, H = 130, base = 82
  const b1 = battito(6, base, d.b)
  const b2 = battito(b1.fine, base, d.b)
  return (
    <figure className={`rounded-xl border ${d.evidenzia ? 'border-bordeaux2' : 'border-linea'} bg-white overflow-hidden`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`ECG ${d.nome}`}>
        <defs>
          <pattern id="mm" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M4 0 L0 0 0 4" fill="none" stroke="#f3c9cf" strokeWidth="0.4" /></pattern>
          <pattern id="cm" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="url(#mm)" /><path d="M20 0 L0 0 0 20" fill="none" stroke="#e9a3ad" strokeWidth="0.8" /></pattern>
        </defs>
        <rect width={W} height={H} fill="url(#cm)" />
        <path d={`M0 ${base} L${W} ${base}`} stroke="#9aa5a0" strokeWidth={0.6} strokeDasharray="2 3" />
        <path d={b1.d + ' ' + b2.d.replace(/^M/, 'L')} fill="none" stroke="#1f2b26" strokeWidth={1.8} strokeLinejoin="round" />
        <text x="5" y="13" fontSize="11" fontWeight={800} fill="#1f2b26">{d.nome}</text>
      </svg>
      {d.nota && <figcaption className={`text-[11px] leading-tight px-1.5 py-1 ${d.evidenzia ? 'text-bordeaux font-bold' : 'text-tenue'}`}>{d.nota}</figcaption>}
    </figure>
  )
}

/** Apre il popup di un ECG da qualunque punto dell'app. */
export const apriEcg = (id: string) => window.dispatchEvent(new CustomEvent('apri-ecg', { detail: id }))

/** Popup unico, montato una volta in App. */
export function PopupEcg() {
  const [id, setId] = useState<string | null>(null)
  useEffect(() => {
    const h = (e: Event) => setId((e as CustomEvent<string>).detail)
    window.addEventListener('apri-ecg', h)
    return () => window.removeEventListener('apri-ecg', h)
  }, [])
  const e = ECG.find((x) => x.id === id)
  if (!e) return null
  const i = ECG.indexOf(e)
  return (
    <div className="fixed inset-0 z-50 bg-black/45 flex items-end sm:items-center justify-center" onClick={() => setId(null)}>
      <div className="bg-carta w-full max-w-2xl rounded-t-[22px] sm:rounded-[22px] p-4 pb-[calc(16px+env(safe-area-inset-bottom))] max-h-[92vh] overflow-auto" onClick={(ev) => ev.stopPropagation()}>
        <div className="flex items-start gap-2">
          <p className="font-black text-lg leading-tight flex-1">{e.nome}</p>
          <button onClick={() => setId(null)} className="text-tenue text-2xl leading-none px-1" aria-label="Chiudi">×</button>
        </div>
        <div className={`grid gap-2 mt-3 ${e.derivazioni.length > 3 ? 'grid-cols-2 sm:grid-cols-4' : e.derivazioni.length === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'}`}>
          {e.derivazioni.map((d) => <Traccia key={d.nome} d={d} />)}
        </div>
        <ul className="mt-3 flex flex-col gap-1.5 text-[13.5px] leading-snug">
          {e.righe.map((r) => <li key={r} className="flex gap-2"><span className="text-bordeaux font-black">•</span><span>{r}</span></li>)}
        </ul>
        <p className="text-[10.5px] text-tenue mt-2">Disegni schematici (1 mm = 1 quadretto), non tracciati reali.</p>
        <div className="flex gap-2 mt-3">
          <button disabled={i === 0} onClick={() => setId(ECG[i - 1].id)} className="flex-1 rounded-full border border-linea-forte py-2 font-bold text-tenue disabled:opacity-30">‹ Precedente</button>
          <button disabled={i === ECG.length - 1} onClick={() => setId(ECG[i + 1].id)} className="flex-1 rounded-full border border-linea-forte py-2 font-bold text-tenue disabled:opacity-30">Successivo ›</button>
        </div>
      </div>
    </div>
  )
}

/** Riquadro con le figurine da toccare (usato nei PDTA STEMI e NSTE-SCA). */
export default function EcgEquivalenti() {
  return (
    <section className="card">
      <p className="etichetta mb-2 !text-bordeaux">Equivalenti di STEMI e pattern da non perdere</p>
      <div className="grid grid-cols-2 gap-1.5">
        {ECG.map((e) => (
          <button key={e.id} onClick={() => apriEcg(e.id)} className="rounded-xl border border-bordeaux2/50 bg-bordeaux3/40 px-2.5 py-2 text-left active:bg-bordeaux3">
            <span className="block text-[13px] font-extrabold leading-tight text-bordeaux">♡&#xFE0E; {e.breve}</span>
            <span className="block text-[10.5px] text-tenue leading-tight mt-0.5">tocca per l’ECG</span>
          </button>
        ))}
      </div>
    </section>
  )
}

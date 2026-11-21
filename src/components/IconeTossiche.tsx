/*
 * Iconografia delle sindromi tossiche: un simbolo per sindrome (da ricordare) e piccoli segni
 * standard (pupilla, cute, frecce) per il confronto. Linee semplici, colori dell'app.
 */
import type { Cute, Freccia, Icona, Pupille } from '../lib/sindromiTossiche'

const goccia = (x: number, y: number, s = 1) =>
  `M${x} ${y - 4.5 * s} C${x + 3.4 * s} ${y - 0.5 * s} ${x + 3.4 * s} ${y + 3.5 * s} ${x} ${y + 3.5 * s} C${x - 3.4 * s} ${y + 3.5 * s} ${x - 3.4 * s} ${y - 0.5 * s} ${x} ${y - 4.5 * s}Z`

/** Simbolo grande di una sindrome (48×48), colore = currentColor. */
export function IconaSindrome({ id, className = 'w-10 h-10' }: { id: Icona; className?: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  let g: React.ReactNode
  switch (id) {
    case 'anticolinergico': // occhio dilatato sotto il sole: caldo, secco, midriasi
      g = (<>
        <path d="M7 27 C14 18 34 18 41 27 C34 36 14 36 7 27Z" {...p} />
        <circle cx="24" cy="27" r="6.5" fill="currentColor" />
        <path d="M24 4v5M13 7.5l2.5 4.3M35 7.5l-2.5 4.3M5.5 14.5l4.3 2.5M42.5 14.5l-4.3 2.5" {...p} />
      </>)
      break
    case 'colinergico': // pupilla a spillo che gocciola: secrezioni
      g = (<>
        <path d="M5 19 C13 8.5 35 8.5 43 19 C35 29.5 13 29.5 5 19Z" {...p} />
        <circle cx="24" cy="19" r="1.8" fill="currentColor" />
        <path d={goccia(14, 37)} fill="currentColor" />
        <path d={goccia(24, 41)} fill="currentColor" />
        <path d={goccia(34, 37)} fill="currentColor" />
      </>)
      break
    case 'simpaticomimetico': // cuore con fulmine
      g = (<>
        <path d="M24 41 C10 31 5 23 5 16.5 C5 10.5 9.5 6.5 15 6.5 C19 6.5 22 9 24 12 C26 9 29 6.5 33 6.5 C38.5 6.5 43 10.5 43 16.5 C43 23 38 31 24 41Z" {...p} />
        <path d="M26.5 12 L19 25 H25.5 L21.5 35.5 L30.5 21 H24 Z" fill="currentColor" />
      </>)
      break
    case 'oppioide': // pupilla a spillo + respiro che si spegne
      g = (<>
        <path d="M5 17 C13 6.5 35 6.5 43 17 C35 27.5 13 27.5 5 17Z" {...p} />
        <path d="M8 13.5 C15 9.5 33 9.5 40 13.5" {...p} strokeWidth={1.6} />
        <circle cx="24" cy="17" r="1.6" fill="currentColor" />
        <path d="M4 37 C7 29 10 29 13 37 C15.5 43 18 43 20 37 C21.7 33 23.3 33 25 37 C26.2 39.5 27.6 39.5 29 37 C30 35.6 31 35.6 32 37 H44" {...p} />
      </>)
      break
    case 'sedativo': // luna
      g = (<>
        <path d="M30 6 A17 17 0 1 0 42 33 A14 14 0 1 1 30 6Z" {...p} />
        <path d="M33 13h6l-6 7h6" {...p} strokeWidth={1.8} />
      </>)
      break
    case 'serotoninergico': // molla (clono) + termometro
      g = (<>
        <path d="M4 30 L9 18 L14 40 L19 18 L24 40 L29 18 L33 30" {...p} />
        <path d="M40 8 a3 3 0 0 0 -3 3 v17 a5.5 5.5 0 1 0 6 0 v-17 a3 3 0 0 0 -3 -3Z" {...p} />
        <circle cx="40" cy="32.5" r="2.5" fill="currentColor" />
        <path d="M40 31 V14" {...p} strokeWidth={2.6} />
      </>)
      break
    case 'neurolettico': // tubo di piombo rigido + termometro
      g = (<>
        <rect x="3" y="20" width="29" height="10" rx="5" {...p} />
        <path d="M10 20v10M17.5 20v10M25 20v10" {...p} strokeWidth={1.6} />
        <path d="M40 8 a3 3 0 0 0 -3 3 v17 a5.5 5.5 0 1 0 6 0 v-17 a3 3 0 0 0 -3 -3Z" {...p} />
        <circle cx="40" cy="32.5" r="2.5" fill="currentColor" />
        <path d="M40 31 V12" {...p} strokeWidth={2.6} />
      </>)
      break
    case 'astinenza': // bicchiere che trema
      g = (<>
        <path d="M15 8 H33 L31 24 C30.4 28.5 27.5 31 24 31 C20.5 31 17.6 28.5 17 24 Z" {...p} />
        <path d="M24 31 V40 M17 40 H31" {...p} />
        <path d="M8 12 c-2 3 2 5 0 8 c-2 3 2 5 0 8 M40 12 c2 3 -2 5 0 8 c2 3 -2 5 0 8" {...p} strokeWidth={1.8} />
      </>)
      break
  }
  return <svg viewBox="0 0 48 48" className={className} aria-hidden="true">{g}</svg>
}

/** Pupilla: il diametro del cerchio dice tutto. */
export function SegnoPupille({ v, className = 'w-7 h-7' }: { v: Pupille; className?: string }) {
  const r = v === 'miosi' ? 1.6 : v === 'midriasi' ? 7 : 4
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label={v}>
      <path d="M1.5 12 C6 5 18 5 22.5 12 C18 19 6 19 1.5 12Z" fill="none" stroke="currentColor" strokeWidth={1.5} />
      <circle cx="12" cy="12" r={r} fill="currentColor" />
    </svg>
  )
}

/** Cute: goccia piena = sudata, goccia barrata = secca, goccia vuota = normale. */
export function SegnoCute({ v, className = 'w-7 h-7' }: { v: Cute; className?: string }) {
  const d = goccia(12, 13, 1.9)
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label={v}>
      <path d={d} fill={v === 'sudata' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} />
      {v === 'secca' && <path d="M4 21 L20 3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />}
    </svg>
  )
}

const FRECCE: Record<Freccia, { s: string; cl: string; t: string }> = {
  su: { s: '▲', cl: 'bg-bordeaux text-white', t: 'aumentata' },
  giu: { s: '▼', cl: 'bg-verde text-white', t: 'ridotta' },
  norm: { s: '=', cl: 'bg-sabbia text-tenue', t: 'normale' },
  var: { s: '↕', cl: 'bg-oro3 text-oro', t: 'variabile' },
}

export function SegnoFreccia({ v }: { v: Freccia }) {
  const f = FRECCE[v]
  return <span title={f.t} className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-extrabold ${f.cl}`}>{f.s}</span>
}

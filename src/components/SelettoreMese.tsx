import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre']
export const nomeMese = (k: string) => `${MESI[Number(k.slice(5, 7)) - 1]} ${k.slice(0, 4)}`
export const chiaveMese = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
const valida = (k: string | null): k is string => !!k && /^\d{4}-(0[1-9]|1[0-2])$/.test(k)
const indice = (k: string) => Number(k.slice(0, 4)) * 12 + Number(k.slice(5, 7)) - 1

/** Mese più vicino a quello cercato tra i disponibili (a parità, il successivo). */
export function piuVicino(disponibili: string[], k: string) {
  if (!disponibili.length || disponibili.includes(k)) return k
  const i = indice(k)
  return [...disponibili].sort((a, b) => Math.abs(indice(a) - i) - Math.abs(indice(b) - i) || indice(b) - indice(a))[0]
}

/**
 * Mese scelto, ricordato nell'URL (?mese=AAAA-MM). Senza parametro: il mese corrente,
 * o il più vicino tra quelli disponibili.
 */
export function useMeseUrl(disponibili: string[]) {
  const [params, setParams] = useSearchParams()
  const daUrl = params.get('mese')
  const mese = valida(daUrl) ? daUrl : piuVicino(disponibili, chiaveMese(new Date()))
  const vai = (k: string) => setParams((p) => { const n = new URLSearchParams(p); n.set('mese', k); return n }, { replace: true })
  return { mese, vai }
}

/** Frecce ← → ai lati del nome del mese + tendina dei mesi disponibili. */
export default function SelettoreMese({ mese, disponibili, vai }: { mese: string; disponibili: string[]; vai: (k: string) => void }) {
  const ordinati = useMemo(() => [...new Set(disponibili)].sort(), [disponibili])
  const prima = [...ordinati].reverse().find((k) => k < mese)
  const dopo = ordinati.find((k) => k > mese)
  const opzioni = ordinati.includes(mese) ? ordinati : [...ordinati, mese].sort()
  const freccia = 'w-10 h-10 shrink-0 rounded-xl border border-linea-forte bg-white text-testo text-lg disabled:opacity-30 disabled:cursor-default'
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" aria-label="Mese precedente" disabled={!prima} onClick={() => prima && vai(prima)} className={freccia}>←</button>
      <label className="relative">
        <span className="sr-only">Scegli il mese</span>
        <select value={mese} onChange={(e) => vai(e.target.value)}
          className="appearance-none h-10 rounded-xl border border-linea-forte bg-white pl-3 pr-7 font-extrabold text-lg tracking-tight capitalize text-testo cursor-pointer">
          {opzioni.map((k) => <option key={k} value={k}>{nomeMese(k)}{ordinati.includes(k) ? '' : ' (vuoto)'}</option>)}
        </select>
        <span aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-tenue">▾</span>
      </label>
      <button type="button" aria-label="Mese successivo" disabled={!dopo} onClick={() => dopo && vai(dopo)} className={freccia}>→</button>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Riconoscimenti from '../components/Riconoscimenti'
import {
  FARMACI_URGENZA, GRUPPI, allOra, converti, mLh, num, quantita, unitaDose,
  type Dose, type Farmaco, type Prep,
} from '../lib/farmaciInfusione'

/*
 * Farmaci d'urgenza: fiale, preparazione e velocità di partenza calcolata sul peso.
 * Il peso è uno solo per tutta la pagina (ricordato su questo dispositivo). #/farmaci?apri=<id>
 */

const CHIAVE_PESO = 'emergenze.farmaci.peso'
const leggiPeso = () => {
  try { const v = Number(localStorage.getItem(CHIAVE_PESO)); return v >= 30 && v <= 200 ? v : 70 } catch { return 70 }
}

const VIA: Record<Prep['via'], string> = { siringa: 'Pompa siringa', volumetrica: 'Pompa volumetrica', bolo: 'Diluizione per boli', puro: 'Puro' }

function Riga({ d, peso, f }: { d: Dose; peso: number; f: Farmaco }) {
  const [v, setV] = useState(d.start)
  const { q, tagliata } = quantita(d, v, peso)
  const prep = f.prep ?? []
  const fisso = d.min === d.max
  const decimali = (d.passo.toString().split('.')[1] ?? '').length

  let risultati: { etichetta: string; valore: string }[] = []
  if (d.t) {
    const ora = allOra(d, q)
    const indici = d.prep ?? prep.map((p, i) => (p.via === 'bolo' ? -1 : i)).filter((i) => i >= 0)
    risultati = indici.map((i) => ({ etichetta: `${VIA[prep[i].via]} (${prep[i].testo})`, valore: `${num(mLh(ora, d.q, prep[i]))} mL/h` }))
    risultati.unshift({ etichetta: 'Quantità', valore: `${num(ora)} ${d.q}/h${d.t === 'die' ? ` (${num(q)} ${d.q}/die)` : d.t === 'min' ? ` (${num(q)} ${d.q}/min)` : ''}` })
  } else {
    risultati.push({ etichetta: 'Dose', valore: `${num(q)} ${d.q}` })
    if (d.prep) {
      for (const i of d.prep) {
        const ml = converti(q, d.q, prep[i].q) / prep[i].conc
        risultati.push({ etichetta: `${VIA[prep[i].via]} (${prep[i].testo})`, valore: `${num(ml)} mL` })
        if (d.inMin) risultati.push({ etichetta: `In ${d.inMin} min`, valore: `${num(ml / (d.inMin / 60))} mL/h` })
      }
    } else if (f.conc) {
      const ml = converti(q, d.q, f.conc.q) / f.conc.v
      risultati.push({ etichetta: 'Fiala pura', valore: `${num(ml)} mL` })
      if (d.inMin && d.sacca) risultati.push({ etichetta: `${d.sacca} mL in ${d.inMin} min`, valore: `${num((d.sacca + ml) / (d.inMin / 60))} mL/h` })
    }
  }

  return (
    <div className="rounded-2xl border border-linea p-3 flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-bold text-sm leading-tight">{d.etichetta}</p>
        <p className="text-sm font-black whitespace-nowrap">{num(v)} <span className="text-tenue font-semibold">{unitaDose(d)}</span></p>
      </div>
      {!fisso && (
        <div className="flex items-center gap-2">
          <button onClick={() => setV((x) => Math.max(d.min, +(x - d.passo).toFixed(4)))} className="h-8 w-8 rounded-full border border-linea font-black text-tenue" aria-label="Riduci">−</button>
          <input type="range" min={d.min} max={d.max} step={d.passo} value={v} onChange={(e) => setV(+e.target.value)}
            className="flex-1 accent-[var(--color-verde)]" aria-label={`Dose ${d.etichetta}`} />
          <button onClick={() => setV((x) => Math.min(d.max, +(x + d.passo).toFixed(4)))} className="h-8 w-8 rounded-full border border-linea font-black text-tenue" aria-label="Aumenta">+</button>
        </div>
      )}
      {!fisso && <p className="text-[11px] text-tenue -mt-1">Intervallo {num(d.min)}–{num(d.max)} {unitaDose(d)}{decimali > 2 ? '' : ''}</p>}
      <ul className="flex flex-col gap-1">
        {risultati.map((r, i) => (
          <li key={i} className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-tenue leading-snug min-w-0">{r.etichetta}</span>
            <span className={`font-black whitespace-nowrap ${i === 0 ? '' : 'text-verde'}`}>{r.valore}</span>
          </li>
        ))}
      </ul>
      {tagliata && <p className="text-xs font-bold text-bordeaux">Raggiunto il tetto massimo: {num(d.tetto!)} {d.q}{d.t ? `/${d.t}` : ''}.</p>}
      {d.nota && <p className="text-xs text-tenue">{d.nota}</p>}
    </div>
  )
}

function Card({ f, aperto, onToggle, peso }: { f: Farmaco; aperto: boolean; onToggle: () => void; peso: number }) {
  return (
    <section id={`farmaco-${f.id}`} className="card !p-0 overflow-hidden scroll-mt-28">
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3 text-left">
        <div className="flex-1 min-w-0">
          <p className="leading-tight"><span className="font-black text-verde">{f.nome}</span>{f.commerciale && <span className="text-tenue font-semibold"> ({f.commerciale})</span>}</p>
          <p className="text-xs text-tenue leading-snug mt-0.5">
            {f.fiala}
            {f.frigo && <span className="ml-1.5 text-[10px] font-extrabold uppercase rounded-full px-1.5 py-0.5 bg-verde3 text-verde-scuro">frigo</span>}
            {f.foto && <span className="ml-1 text-[10px] font-extrabold uppercase rounded-full px-1.5 py-0.5 bg-oro3 text-oro">al buio</span>}
          </p>
        </div>
        <Riconoscimenti chiave={`farmaci/${f.id}`} contenuto={f} />
        <span className={`text-tenue transition-transform shrink-0 ${aperto ? 'rotate-90' : ''}`}>›</span>
      </button>
      {aperto && (
        <div className="px-4 pb-4 pt-2 border-t border-linea flex flex-col gap-3">
          {f.prep && f.prep.length > 0 && (
            <div>
              <p className="etichetta mb-1">Preparazione</p>
              <ul className="flex flex-col gap-0.5">
                {f.prep.map((p, i) => (
                  <li key={i} className="text-sm leading-snug"><span className="font-bold">{VIA[p.via]}:</span> {p.testo} <span className="text-tenue">= {num(p.conc)} {p.q}/mL</span></li>
                ))}
              </ul>
            </div>
          )}
          {f.dosi?.map((d, i) => <Riga key={`${f.id}-${i}`} d={d} f={f} peso={peso} />)}
          {f.righe && (
            <ul className="flex flex-col gap-1">
              {f.righe.map((r, i) => (
                <li key={i} className="text-sm leading-snug pl-3 relative"><span className="absolute left-0 top-[0.55em] w-1 h-1 rounded-full bg-tenue" />{r}</li>
              ))}
            </ul>
          )}
          {f.tabella && (
            <div>
              <p className="etichetta mb-1">{f.tabella.titolo}</p>
              <div className="overflow-x-auto">
                <table className="text-xs w-full border-collapse">
                  <tbody>
                    {f.tabella.righe.map((r, i) => (
                      <tr key={i} className={i === 0 ? 'font-bold bg-sabbia' : 'border-t border-linea'}>
                        {r.map((c, j) => <td key={j} className="px-2 py-1 align-top">{c}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {f.avvisi?.map((a, i) => (
            <p key={i} className="text-xs font-semibold text-bordeaux leading-snug">⚠︎ {a}</p>
          ))}
        </div>
      )}
    </section>
  )
}

export default function Farmaci() {
  const [params, setParams] = useSearchParams()
  const [aperto, setAperto] = useState<string | null>(params.get('apri'))
  const [peso, setPeso] = useState(leggiPeso)
  const [cerca, setCerca] = useState('')
  const q = cerca.trim().toLowerCase()

  useEffect(() => { try { localStorage.setItem(CHIAVE_PESO, String(peso)) } catch { /* niente */ } }, [peso])
  useEffect(() => {
    if (aperto) document.getElementById(`farmaco-${aperto}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [aperto])

  const toggle = (id: string) => {
    const nuovo = aperto === id ? null : id
    setAperto(nuovo)
    setParams(nuovo ? { apri: nuovo } : {}, { replace: true })
  }
  const voci = FARMACI_URGENZA.filter((f) => !q || `${f.nome} ${f.commerciale ?? ''} ${f.gruppo}`.toLowerCase().includes(q))

  return (
    <div className="elenco">
      <div className="intero sticky top-0 z-10 -mx-1 px-1 pt-1 pb-2 bg-fondo">
        <div className="card !py-2.5 flex items-center gap-3">
          <p className="font-black">Peso</p>
          <button onClick={() => setPeso((p) => Math.max(30, p - 5))} className="h-9 w-9 rounded-full border border-linea font-black text-tenue" aria-label="Meno 5 kg">−</button>
          <input type="number" inputMode="numeric" min={30} max={200} value={peso}
            onChange={(e) => { const v = Number(e.target.value); if (v > 0) setPeso(Math.min(200, v)) }}
            className="w-20 rounded-xl border border-linea px-2 py-1.5 text-center text-lg font-black" aria-label="Peso in kg" />
          <button onClick={() => setPeso((p) => Math.min(200, p + 5))} className="h-9 w-9 rounded-full border border-linea font-black text-tenue" aria-label="Più 5 kg">+</button>
          <p className="text-tenue font-bold">kg</p>
        </div>
      </div>
      <input value={cerca} onChange={(e) => setCerca(e.target.value)} placeholder="Cerca un farmaco…"
        className="intero rounded-xl border border-linea px-3 py-2.5 text-base" />
      <p className="intero text-xs text-tenue leading-snug">
        Velocità di partenza calcolate sul peso e sulle diluizioni indicate: verificare fiale e preparazioni del reparto e titolare sul paziente.
      </p>
      {GRUPPI.map((g) => {
        const lista = voci.filter((f) => f.gruppo === g)
        if (!lista.length) return null
        return (
          <div key={g} className="intero flex flex-col gap-2">
            <p className="etichetta mt-2">{g}</p>
            {lista.map((f) => <Card key={f.id} f={f} aperto={aperto === f.id || (!!q && lista.length === 1)} onToggle={() => toggle(f.id)} peso={peso} />)}
          </div>
        )
      })}
      {!voci.length && <p className="intero text-sm text-tenue">Nessun farmaco trovato.</p>}
    </div>
  )
}

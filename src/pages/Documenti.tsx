import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DOCUMENTI_ASL } from '../lib/documentiAsl'

const base = import.meta.env.BASE_URL

/** Documenti aziendali originali usati come riferimento nelle schede dell'app. */
export default function Documenti() {
  const [cerca, setCerca] = useState('')
  const q = cerca.trim().toLowerCase()
  const voci = DOCUMENTI_ASL.filter((d) => !q || `${d.titolo} ${d.codice ?? ''} ${d.ente} ${d.area} ${d.descr}`.toLowerCase().includes(q))
  const aree = [...new Set(voci.map((d) => d.area))].sort()
  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-display text-2xl font-extrabold">Documenti ASL</h1>
      <p className="text-sm text-tenue">Originali aziendali e regionali a cui rimandano le schede dell’app. In caso di differenze vale il documento.</p>
      <input value={cerca} onChange={(e) => setCerca(e.target.value)} placeholder="Cerca un documento…" className="rounded-xl border border-linea px-3 py-2.5 text-base" />
      {aree.map((a) => (
        <div key={a} className="flex flex-col gap-2">
          <p className="etichetta px-1 mt-1">{a}</p>
          {voci.filter((d) => d.area === a).map((d) => (
            <div key={d.id} className="rounded-2xl border border-linea bg-white p-4 shadow-[var(--shadow-card)]">
              <a href={`${base}${d.file}`} target="_blank" rel="noreferrer" className="block">
                <div className="text-[16px] font-bold leading-tight">📄 {d.titolo}</div>
                <div className="mt-0.5 text-[11px] font-bold text-oro">{[d.codice, d.ente, d.data].filter(Boolean).join(' · ')}</div>
                <div className="mt-1 text-sm text-tenue leading-snug">{d.descr}</div>
              </a>
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                <a href={`${base}${d.file}`} target="_blank" rel="noreferrer" className="rounded-full bg-verde px-3 py-1.5 font-bold text-white">Apri</a>
                {d.usatoIn?.map((u) => <Link key={u.to} to={u.to} className="rounded-full border border-linea px-3 py-1.5 font-bold text-tenue">{u.etichetta} →</Link>)}
              </div>
            </div>
          ))}
        </div>
      ))}
      {!voci.length && <p className="text-sm text-tenue px-1">Nessun documento.</p>}
    </div>
  )
}

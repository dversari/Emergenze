import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DOCUMENTI_ASL } from '../lib/documentiAsl'
import { condividiFileUrl } from '../lib/stampaModulo'
import { urlRiservato, useSessione } from '../lib/riservati'
import AccessoRiservato from '../components/AccessoRiservato'

const pdf = (d: { file: string; titolo: string }) => `/pdf?f=${encodeURIComponent(d.file)}&t=${encodeURIComponent(d.titolo)}`

/** Documenti aziendali originali usati come riferimento nelle schede dell'app. */
export default function Documenti() {
  const sessione = useSessione()
  const [cerca, setCerca] = useState('')
  const q = cerca.trim().toLowerCase()
  const voci = DOCUMENTI_ASL.filter((d) => !q || `${d.titolo} ${d.codice ?? ''} ${d.ente} ${d.area} ${d.descr}`.toLowerCase().includes(q))
  const aree = [...new Set(voci.map((d) => d.area))].sort()
  if (sessione === undefined) return null
  if (sessione === null) return <div className="flex flex-col gap-3"><h1 className="font-display text-2xl font-extrabold">Documenti ASL</h1><AccessoRiservato /></div>
  const scarica = async (d: { file: string; titolo: string }) => {
    try { const u = await urlRiservato(d.file); await condividiFileUrl(u, d.file.split('/').pop() ?? 'documento.pdf', d.titolo); setTimeout(() => URL.revokeObjectURL(u), 60000) }
    catch { alert('Non riesco a scaricare il documento.') }
  }
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
              <Link to={pdf(d)} className="block">
                <div className="text-[16px] font-bold leading-tight">📄 {d.titolo}</div>
                <div className="mt-0.5 text-[11px] font-bold text-oro">{[d.codice, d.ente, d.data].filter(Boolean).join(' · ')}</div>
                <div className="mt-1 text-sm text-tenue leading-snug">{d.descr}</div>
              </Link>
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                <Link to={pdf(d)} className="rounded-full bg-verde px-3 py-1.5 font-bold text-white">Apri</Link>
                <button onClick={() => scarica(d)} className="rounded-full border border-verde px-3 py-1.5 font-bold text-verde">⬇︎ Scarica</button>
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

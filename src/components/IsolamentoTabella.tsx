import { useState } from 'react'
import { DURATE, ISOLAMENTO, PRECAUZIONI } from '../lib/isolamento'

/** Tabella ricercabile delle precauzioni aggiuntive (PA.DRO.01, tabella 5.5). */
export default function IsolamentoTabella() {
  const [q, setQ] = useState('')
  const t = q.trim().toLowerCase()
  const voci = ISOLAMENTO.filter((v) => !t || `${v.nome} ${v.alias ?? ''} ${v.materiale ?? ''}`.toLowerCase().includes(t))
  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-1.5">
        {Object.entries(PRECAUZIONI).map(([k, p]) => (
          <p key={k} className="text-[12px] leading-snug"><span className={`mr-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-black ${p.colore}`}>{k}</span><b>{p.nome}:</b> {p.dpi}</p>
        ))}
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca: TBC, C. difficile, KPC, varicella…" className="rounded-xl border border-linea px-3 py-2 text-base" />
      <ul className="flex flex-col divide-y divide-linea">
        {voci.map((v) => (
          <li key={v.nome} className="py-2">
            <div className="flex items-start gap-2">
              <span className="flex shrink-0 gap-0.5 pt-0.5">
                {v.prec.split('+').map((k) => <span key={k} className={`rounded px-1.5 py-0.5 text-[10px] font-black ${PRECAUZIONI[k]?.colore ?? ''}`}>{k}</span>)}
              </span>
              <span className="text-sm font-bold leading-tight">{v.nome}</span>
            </div>
            {(v.materiale || v.durata || v.note) && (
              <p className="mt-0.5 text-[12px] leading-snug text-tenue">
                {v.materiale && <>Materiale: {v.materiale}. </>}
                {v.durata && <>Durata: {DURATE[v.durata] ?? v.durata}. </>}
                {v.note}
              </p>
            )}
          </li>
        ))}
        {!voci.length && <li className="py-2 text-sm text-tenue">Non in tabella: precauzioni standard e chiedere a Malattie infettive / ICA.</li>}
      </ul>
    </div>
  )
}

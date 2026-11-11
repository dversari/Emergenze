import { Fragment, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CONDIZIONI, FARMACI, REGOLE, farmaco, type Condizione } from '../lib/antibiotici'

/* Terapia antibiotica empirica: card per condizione e per farmaco.
   I nomi dei farmaci dentro le condizioni aprono la scheda del farmaco (dose, fiale, preparazione, rene). */

const GRUPPI: Condizione['gruppo'][] = ['Respiratorie', 'Urogenitali', 'Addominali', 'SNC', 'Cute', 'Sistemiche']

/** Testo con {id}: i farmaci diventano pulsanti. */
function Testo({ t, apri }: { t: string; apri: (id: string) => void }) {
  const parti = t.split(/(\{[a-z]+\})/g)
  return (
    <>
      {parti.map((p, i) => {
        const m = p.match(/^\{([a-z]+)\}$/)
        const f = m && farmaco(m[1])
        if (!f) return <Fragment key={i}>{p}</Fragment>
        return (
          <button key={i} onClick={(e) => { e.stopPropagation(); apri(f.id) }}
            className="font-bold text-verde underline decoration-verde2/50 underline-offset-2">
            {f.nome}
          </button>
        )
      })}
    </>
  )
}

function Freccia({ aperto }: { aperto: boolean }) {
  return <span className={`text-tenue transition-transform shrink-0 ${aperto ? 'rotate-90' : ''}`}>›</span>
}

function CardCondizione({ c, aperto, onToggle, apri }: { c: Condizione; aperto: boolean; onToggle: () => void; apri: (id: string) => void }) {
  return (
    <section id={`c-${c.id}`} className="card !p-0 overflow-hidden scroll-mt-24">
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3 text-left">
        <div className="flex-1 min-w-0">
          <p className="font-bold leading-tight">{c.nome}</p>
          <p className="text-xs text-tenue leading-snug mt-0.5">{c.sintesi}</p>
        </div>
        <Freccia aperto={aperto} />
      </button>
      {aperto && (
        <div className="px-4 pb-4 pt-1 border-t border-linea flex flex-col gap-3">
          {c.blocchi.map((b) => (
            <div key={b.titolo}>
              <p className="etichetta mt-2 mb-1">{b.titolo}</p>
              <ul className="flex flex-col gap-1">
                {b.righe.map((r, i) => (
                  <li key={i} className="text-sm leading-snug pl-3 relative">
                    <span className="absolute left-0 top-[0.55em] w-1 h-1 rounded-full bg-tenue" />
                    <Testo t={r} apri={apri} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="rounded-xl bg-oro3 border border-oro2/40 px-3 py-2 text-sm">
            <span className="font-bold text-oro">Durata </span><Testo t={c.durata} apri={apri} />
          </div>
          {c.note?.map((n, i) => <p key={i} className="text-xs text-tenue leading-snug"><Testo t={n} apri={apri} /></p>)}
        </div>
      )}
    </section>
  )
}

function CardFarmaco({ id, aperto, onToggle }: { id: string; aperto: boolean; onToggle: () => void }) {
  const f = farmaco(id)!
  return (
    <section id={`f-${f.id}`} className="card !p-0 overflow-hidden scroll-mt-24">
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3 text-left">
        <div className="flex-1 min-w-0">
          <p className="font-bold leading-tight">{f.nome} <span className="ml-1 align-middle text-[10px] font-extrabold uppercase tracking-wide rounded-full px-2 py-0.5 bg-verde3 text-verde-scuro">{f.via}</span></p>
          <p className="text-xs text-tenue leading-snug mt-0.5">{f.dose}</p>
        </div>
        <Freccia aperto={aperto} />
      </button>
      {aperto && (
        <div className="px-4 pb-4 pt-1 border-t border-linea flex flex-col gap-2.5 text-sm leading-snug">
          <div><p className="etichetta mt-2 mb-0.5">Confezioni</p>{f.fiale}</div>
          <div><p className="etichetta mb-0.5">Preparazione</p>{f.prep}</div>
          <div><p className="etichetta mb-0.5">Dose</p><span className="font-semibold">{f.dose}</span></div>
          <div className="rounded-xl bg-bordeaux3/60 border border-bordeaux2/30 px-3 py-2">
            <p className="etichetta !text-bordeaux mb-1">Rene (CrCl mL/min)</p>
            <ul className="flex flex-col gap-0.5">{f.rene.map((r, i) => <li key={i}>{r}</li>)}</ul>
          </div>
          {f.monitor && (
            <div><p className="etichetta mb-0.5">Monitorare</p>
              <ul className="flex flex-col gap-0.5">{f.monitor.map((m, i) => <li key={i}>{m}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default function Antibiotici() {
  const [params, setParams] = useSearchParams()
  const vista = params.get('vista') === 'farmaci' ? 'farmaci' : 'condizioni'
  const [aperto, setAperto] = useState<string | null>(params.get('apri'))
  const [cerca, setCerca] = useState('')
  const q = cerca.trim().toLowerCase()

  // Aprire un farmaco da una condizione aggiunge un passo alla cronologia: «indietro» torna alla condizione.
  const vai = (v: 'condizioni' | 'farmaci', id: string | null = null) => {
    setCerca(''); setAperto(id)
    setParams(id ? { vista: v, apri: id } : { vista: v }, { replace: !id })
  }
  useEffect(() => { setAperto(params.get('apri')) }, [params])
  const apriFarmaco = (id: string) => vai('farmaci', id)

  useEffect(() => {
    if (!aperto) return
    const el = document.getElementById(`${vista === 'farmaci' ? 'f' : 'c'}-${aperto}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [aperto, vista])

  const condizioni = CONDIZIONI.filter((c) => !q || `${c.nome} ${c.sintesi} ${c.gruppo}`.toLowerCase().includes(q))
  const farmaci = [...FARMACI].sort((a, b) => a.nome.localeCompare(b.nome, 'it'))
    .filter((f) => !q || `${f.nome} ${f.fiale}`.toLowerCase().includes(q))

  return (
    <div className="elenco">
      <div className="intero grid grid-cols-2 gap-1 p-1 rounded-2xl bg-sabbia border border-linea">
        {(['condizioni', 'farmaci'] as const).map((v) => (
          <button key={v} onClick={() => vai(v)}
            className={`rounded-xl py-2 text-sm font-bold ${vista === v ? 'bg-carta shadow-card text-testo' : 'text-tenue'}`}>
            {v === 'condizioni' ? 'Condizioni' : 'Farmaci e rene'}
          </button>
        ))}
      </div>
      <input value={cerca} onChange={(e) => setCerca(e.target.value)}
        placeholder={vista === 'farmaci' ? 'Cerca un farmaco…' : 'Cerca una condizione…'}
        className="rounded-xl border border-linea px-3 py-2.5 text-base" />

      {vista === 'condizioni' ? (
        <>
          {GRUPPI.map((g) => {
            const voci = condizioni.filter((c) => c.gruppo === g)
            if (!voci.length) return null
            return (
              <Fragment key={g}>
                <p className="etichetta px-1 mt-1">{g}</p>
                {voci.map((c) => (
                  <CardCondizione key={c.id} c={c} aperto={aperto === c.id} apri={apriFarmaco}
                    onToggle={() => setAperto((a) => (a === c.id ? null : c.id))} />
                ))}
              </Fragment>
            )
          })}
          {!q && (
            <>
              <p className="etichetta px-1 mt-1">Regole</p>
              {REGOLE.map((r) => (
                <section key={r.titolo} className="card !py-3">
                  <p className="font-bold mb-1">{r.titolo}</p>
                  <ul className="flex flex-col gap-1 text-sm leading-snug">{r.righe.map((x, i) => <li key={i}>{x}</li>)}</ul>
                </section>
              ))}
            </>
          )}
        </>
      ) : (
        farmaci.map((f) => (
          <CardFarmaco key={f.id} id={f.id} aperto={aperto === f.id}
            onToggle={() => setAperto((a) => (a === f.id ? null : f.id))} />
        ))
      )}
      <p className="intero text-[11px] text-tenue px-1 mt-1">Adulto, funzione epatica normale. Terapia empirica: adattarla all’antibiogramma locale e alle colture.</p>
    </div>
  )
}

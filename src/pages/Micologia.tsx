import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { RitornoCtx, riprendiScroll, useConRitorno } from '../lib/ritorno'
import Fungo from '../components/Fungo'
import { SPECIE, specie, specieDi } from '../lib/micologia'
import { SINDROMI_FUNGHI } from '../lib/sindromiTossiche'
import { CAV_FIRENZE } from '../lib/lineeGuida'

function LinkR(props: React.ComponentProps<typeof Link>) {
  const r = useConRitorno()
  return <Link {...props} state={r.state} onClick={r.onClick} />
}

/** Micologia: tavole dei funghi tossici principali, raggruppate per sindrome. */
export default function Micologia() {
  const [params, setParams] = useSearchParams()
  const apri = params.get('apri')
  const [aperta, setAperta] = useState<string | null>(apri && specie(apri) ? apri : null)
  const rif = useRef<HTMLDivElement>(null)
  useEffect(() => { riprendiScroll('/linee-guida/micologia') }, [])
  useEffect(() => { if (apri && specie(apri)) setAperta(apri) }, [apri])
  useEffect(() => { if (aperta) rif.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, [aperta])
  const scegli = (id: string) => {
    const nuovo = aperta === id ? null : id
    setAperta(nuovo)
    setParams(nuovo ? { apri: nuovo } : {}, { replace: true })
  }
  const sel = aperta ? specie(aperta) : undefined
  const sin = sel ? SINDROMI_FUNGHI.find((x) => x.id === sel.sindrome) : undefined

  return (
    <RitornoCtx.Provider value="Micologia">
      <div className="flex flex-col gap-3">
        <Link to="/linee-guida/tossicologia" className="text-sm text-tenue">‹ Tossicologia</Link>
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-bordeaux font-bold">Tossicologia · funghi</p>
          <h2 className="font-extrabold text-2xl tracking-tight leading-tight">Micologia</h2>
          <p className="text-sm text-tenue">{SPECIE.length} funghi tossici, con le parti da guardare.</p>
        </div>
        <div className="rounded-2xl border border-[#e6d5b0] bg-[#f6eedd] px-4 py-3 text-[13px] leading-snug text-[#7a5a17]">
          Tavole schematiche per orientarsi e fare le domande giuste. <b>L’identificazione la fa il micologo</b> (Ispettorato micologico ASL, tramite il CAV): conservare resti, scarti di pulizia e vomito. Un fungo raccolto strappato può aver perso la volva.
        </div>
        <a href={CAV_FIRENZE.tel} className="card !py-2.5 flex items-center justify-between gap-3 bg-bordeaux text-white no-underline">
          <span className="text-sm font-bold">CAV Firenze · {CAV_FIRENZE.numero}</span>
          <span className="rounded-full bg-white text-bordeaux font-extrabold text-sm px-4 py-1.5">Chiama</span>
        </a>

        <div ref={rif} className="scroll-mt-24">
          {sel && (
            <article className="card !p-0 overflow-hidden">
              <div className="bg-bordeaux text-white px-4 py-3 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-xl leading-tight italic">{sel.nome}</h3>
                  <p className="text-sm opacity-90">{sel.comune}{sin ? ` · sindrome ${sin.nome.toLowerCase()}` : ''}</p>
                </div>
                <button onClick={() => scegli(sel.id)} className="text-white/80 text-xl leading-none px-1" aria-label="Chiudi">×</button>
              </div>
              <div className="bg-[#fbfaf5] border-b border-linea"><Fungo s={sel} className="w-full h-auto" /></div>
              <div className="p-4 flex flex-col gap-2.5">
                <ul className="flex flex-col gap-1.5">{sel.riconoscimento.map((r) => <li key={r} className="text-sm leading-snug flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-bordeaux shrink-0" /><span>{r}</span></li>)}</ul>
                <p className="text-sm leading-snug"><b>Si confonde con:</b> {sel.confusione}</p>
                <p className="text-sm leading-snug"><b>Dove e quando:</b> {sel.habitat}</p>
                {sin && (
                  <div className="rounded-xl bg-sabbia px-3 py-2 text-[13px] leading-snug">
                    <b className="text-bordeaux">Sindrome {sin.nome.toLowerCase()}</b> · latenza {sin.latenza}<br />{sin.quadro}<br /><b>In PS:</b> {sin.ps}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  <LinkR to="/linee-guida/funghi" className="text-xs font-semibold rounded-full px-3 py-1.5 bg-verde text-white">PDTA funghi →</LinkR>
                  {sin?.to && sin.to !== '/linee-guida/funghi' && <LinkR to={sin.to} className="text-xs font-semibold rounded-full px-3 py-1.5 bg-verde3 text-verde-scuro">{sin.to.includes('colinergico') ? 'Sindrome colinergica' : 'Rabdomiolisi'} →</LinkR>}
                </div>
              </div>
            </article>
          )}
        </div>

        {[...SINDROMI_FUNGHI.filter((x) => !x.breve), ...SINDROMI_FUNGHI.filter((x) => x.breve)].filter((x) => specieDi(x.id).length).map((x) => (
          <section key={x.id} className="flex flex-col gap-2">
            <p className={`etichetta px-1 ${x.breve ? '!text-verde' : '!text-bordeaux'}`}>{x.nome} · {x.latenza}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {specieDi(x.id).map((f) => (
                <button key={f.id} onClick={() => scegli(f.id)} aria-expanded={aperta === f.id}
                  className={`rounded-2xl border-2 overflow-hidden text-left shadow-[var(--shadow-card)] ${aperta === f.id ? 'border-bordeaux' : 'border-linea'} bg-carta`}>
                  <div className="bg-[#fbfaf5]"><Fungo s={f} etichette={false} className="w-full h-28" /></div>
                  <div className="px-2.5 py-2">
                    <p className="font-bold text-[13px] leading-tight italic">{f.nome}</p>
                    <p className="text-[11px] text-tenue leading-tight">{f.comune}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
        <p className="text-[11px] text-tenue px-1 leading-snug">Disegni schematici realizzati per l’app, non in scala fra specie diverse. Fonti: Ministero della Salute, schede sui funghi tossici; Goldfrank’s Toxicologic Emergencies, 11ª ed.</p>
      </div>
    </RitornoCtx.Provider>
  )
}

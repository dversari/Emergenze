import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { RitornoCtx, riprendiScroll, useConRitorno } from '../lib/ritorno'
import { Testo } from '../components/Algoritmo'
import { IconaSindrome, SegnoCute, SegnoFreccia, SegnoPupille } from '../components/IconeTossiche'
import { APPROCCIO, INDIZI, SINDROMI, sindrome, type Freccia, type Sindrome } from '../lib/sindromiTossiche'
import TabellaFunghi from '../components/TabellaFunghi'
import { LINEE_GUIDA, conCav, CAV_FIRENZE } from '../lib/lineeGuida'

/** PDTA dell'area tossicologica (area Tossicologia o con pulsante CAV). */
export const PDTA_TOSSICOLOGIA = LINEE_GUIDA.filter(conCav)

function LinkR(props: React.ComponentProps<typeof Link>) {
  const r = useConRitorno()
  return <Link {...props} state={r.state} onClick={r.onClick} />
}

const COLONNE: { k: 'temp' | 'fc' | 'pa' | 'fr' | 'peristalsi'; t: string }[] = [
  { k: 'temp', t: 'T' }, { k: 'fc', t: 'FC' }, { k: 'pa', t: 'PA' }, { k: 'fr', t: 'FR' }, { k: 'peristalsi', t: 'Peristalsi' },
]

function Segni({ s }: { s: Sindrome }) {
  const cella = (t: string, n: React.ReactNode, sotto?: string) => (
    <div className="flex flex-col items-center gap-0.5 min-w-0">
      <span className="text-[10px] uppercase tracking-wide text-tenue font-bold">{t}</span>
      <span className="h-7 flex items-center text-bordeaux">{n}</span>
      {sotto && <span className="text-[10px] text-tenue leading-none">{sotto}</span>}
    </div>
  )
  return (
    <div className="grid grid-cols-7 gap-1 rounded-xl bg-sabbia px-1.5 py-2">
      {cella('Pupille', <SegnoPupille v={s.segni.pupille} />, s.segni.pupille)}
      {cella('Cute', <SegnoCute v={s.segni.cute} />, s.segni.cute)}
      {COLONNE.map((c) => <div key={c.k}>{cella(c.t, <SegnoFreccia v={s.segni[c.k] as Freccia} />)}</div>)}
    </div>
  )
}

function Scheda({ s }: { s: Sindrome }) {
  return (
    <article className="card !p-0 overflow-hidden scroll-mt-24">
      <div className="bg-bordeaux text-white px-4 py-3 flex items-center gap-3">
        <IconaSindrome id={s.id} className="w-14 h-14 shrink-0" />
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.12em] font-bold opacity-80">Sindrome</p>
          <h3 className="font-extrabold text-xl leading-tight">{s.nome}</h3>
          <p className="text-sm opacity-90 leading-snug">{s.breve}</p>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <Segni s={s} />
        <div className="text-sm leading-snug flex flex-col gap-1">
          <p><b>Mente:</b> {s.segni.mente}</p>
          <p><b>Muscoli:</b> {s.segni.muscoli}</p>
        </div>
        {s.mnemonico && (
          <div className="rounded-xl border border-oro2 bg-oro3 px-3 py-2.5">
            <p className="text-[11px] uppercase tracking-wide font-bold text-oro mb-1">{s.mnemonico.titolo}</p>
            <ul className="flex flex-col gap-0.5">
              {s.mnemonico.voci.map((v) => (
                <li key={v} className="text-sm leading-snug">{/^[A-Z]{4,}/.test(s.mnemonico!.titolo) ? <><b className="text-bordeaux text-base">{v.charAt(0)}</b>{v.slice(1)}</> : v}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <p className="etichetta mb-1">Per riconoscerla</p>
          <ul className="flex flex-col gap-1.5">{s.chiave.map((c) => <li key={c} className="text-sm leading-snug flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-bordeaux shrink-0" /><span><Testo t={c} /></span></li>)}</ul>
        </div>
        <p className="text-sm leading-snug"><b>Cause:</b> {s.cause}</p>
        <p className="text-sm leading-snug"><b>Da distinguere da:</b> {s.distinguere}</p>
        <div>
          <p className="etichetta mb-1">Terapia (70 kg)</p>
          <ul className="flex flex-col gap-1.5">{s.terapia.map((c) => <li key={c} className="text-sm leading-snug flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-verde shrink-0" /><span><Testo t={c} /></span></li>)}</ul>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {s.pdta.map((p) => <LinkR key={p.to} to={p.to} className="text-xs font-semibold rounded-full px-3 py-1.5 bg-verde text-white">{p.etichetta} →</LinkR>)}
        </div>
      </div>
    </article>
  )
}

/** Area Tossicologia dei PDTA: sindromi tossiche con iconografia, confronto, approccio, indizi, elenco dei PDTA. */
export default function Tossicologia() {
  const [params, setParams] = useSearchParams()
  const apri = params.get('apri')
  const [aperta, setAperta] = useState<string | null>(apri && sindrome(apri) ? apri : null)
  const rif = useRef<HTMLDivElement>(null)
  useEffect(() => { riprendiScroll('/linee-guida/tossicologia') }, [])
  useEffect(() => { if (apri && sindrome(apri)) setAperta(apri) }, [apri])
  useEffect(() => { if (aperta) rif.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, [aperta])
  const scegli = (id: string) => {
    const nuovo = aperta === id ? null : id
    setAperta(nuovo)
    setParams(nuovo ? { apri: nuovo } : {}, { replace: true })
  }
  const sel = aperta ? sindrome(aperta) : undefined

  return (
    <RitornoCtx.Provider value="Tossicologia">
      <div className="flex flex-col gap-3">
        <Link to="/linee-guida" className="text-sm text-tenue">‹ PDTA</Link>
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-bordeaux font-bold">PDTA · area</p>
          <h2 className="font-extrabold text-2xl tracking-tight leading-tight">Tossicologia</h2>
          <p className="text-sm text-tenue">Sindromi tossiche, approccio, indizi e {PDTA_TOSSICOLOGIA.length} PDTA specifici.</p>
        </div>

        <a href={CAV_FIRENZE.tel} className="card !py-3 flex items-center justify-between gap-3 bg-bordeaux text-white no-underline">
          <span><span className="block text-[11px] font-bold uppercase tracking-wide opacity-80">Centro antiveleni di Firenze · 24 h</span><span className="text-lg font-extrabold">{CAV_FIRENZE.numero}</span></span>
          <span className="rounded-full bg-white text-bordeaux font-extrabold text-sm px-4 py-2">Chiama</span>
        </a>

        <section className="flex flex-col gap-2">
          <p className="etichetta px-1">Sindromi tossiche · tocca per aprire</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SINDROMI.map((s) => {
              const on = aperta === s.id
              return (
                <button key={s.id} onClick={() => scegli(s.id)} aria-expanded={on}
                  className={`rounded-2xl border-2 p-3 text-left flex flex-col gap-1.5 shadow-[var(--shadow-card)] transition-colors ${on ? 'bg-bordeaux border-bordeaux text-white' : 'bg-bordeaux3 border-bordeaux2/40 text-bordeaux'}`}>
                  <IconaSindrome id={s.id} className="w-11 h-11" />
                  <span className="font-extrabold text-[15px] leading-tight">{s.nome}</span>
                  <span className={`text-[11px] leading-snug ${on ? 'text-white/85' : 'text-testo/70'}`}>{s.breve}</span>
                </button>
              )
            })}
          </div>
          <div ref={rif} className="scroll-mt-24">{sel && <Scheda s={sel} />}</div>
        </section>

        <section className="card !px-2.5">
          <p className="etichetta mb-2 px-1.5">A colpo d’occhio</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] border-separate border-spacing-y-1">
              <thead>
                <tr className="text-[10px] uppercase tracking-wide text-tenue">
                  <th className="text-left font-bold px-1">Sindrome</th>
                  <th className="font-bold px-1">Pupille</th><th className="font-bold px-1">Cute</th>
                  {COLONNE.map((c) => <th key={c.k} className="font-bold px-0.5">{c.t === 'Peristalsi' ? 'Intest.' : c.t}</th>)}
                  <th className="text-left font-bold px-1 min-w-[9rem]">Il segno chiave</th>
                </tr>
              </thead>
              <tbody>
                {SINDROMI.map((s) => (
                  <tr key={s.id} onClick={() => scegli(s.id)} className="cursor-pointer bg-sabbia/70 hover:bg-sabbia">
                    <td className="rounded-l-lg px-1 py-1">
                      <span className="flex items-center gap-1.5 text-bordeaux font-bold"><IconaSindrome id={s.id} className="w-6 h-6 shrink-0" />{s.nome}</span>
                    </td>
                    <td className="text-center text-bordeaux"><span className="inline-flex"><SegnoPupille v={s.segni.pupille} className="w-6 h-6" /></span></td>
                    <td className="text-center text-bordeaux"><span className="inline-flex"><SegnoCute v={s.segni.cute} className="w-6 h-6" /></span></td>
                    {COLONNE.map((c) => <td key={c.k} className="text-center"><SegnoFreccia v={s.segni[c.k] as Freccia} /></td>)}
                    <td className="rounded-r-lg px-1 leading-tight">{s.distintivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 px-1.5 text-[11px] text-tenue">
            <span className="inline-flex items-center gap-1"><SegnoPupille v="miosi" className="w-5 h-5" />miosi</span>
            <span className="inline-flex items-center gap-1"><SegnoPupille v="midriasi" className="w-5 h-5" />midriasi</span>
            <span className="inline-flex items-center gap-1"><SegnoCute v="sudata" className="w-5 h-5" />sudata</span>
            <span className="inline-flex items-center gap-1"><SegnoCute v="secca" className="w-5 h-5" />secca</span>
            <span className="inline-flex items-center gap-1"><SegnoFreccia v="su" />aumentata</span>
            <span className="inline-flex items-center gap-1"><SegnoFreccia v="giu" />ridotta</span>
            <span className="inline-flex items-center gap-1"><SegnoFreccia v="var" />variabile</span>
          </div>
        </section>

        <section className="card">
          <p className="etichetta mb-2">Approccio all’intossicato in 6 passi</p>
          <ol className="flex flex-col gap-2.5">
            {APPROCCIO.map((a, i) => (
              <li key={a.titolo} className="flex gap-3">
                <span className="w-7 h-7 rounded-full bg-verde text-white font-extrabold text-sm flex items-center justify-center shrink-0">{i + 1}</span>
                <div className="min-w-0">
                  <p className="font-bold leading-tight">{a.titolo}</p>
                  <p className="text-sm leading-snug text-testo/85"><Testo t={a.testo} /></p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <details className="card !p-0 overflow-hidden group">
          <summary className="px-4 py-3 font-bold cursor-pointer list-none flex items-center justify-between">
            Funghi · sindromi per latenza
            <span className="text-tenue transition-transform group-open:rotate-90">›</span>
          </summary>
          <div className="border-t border-linea [&>section]:!border-0 [&>section]:!shadow-none"><TabellaFunghi senzaTitolo /></div>
        </details>

        {INDIZI.map((g) => (
          <details key={g.titolo} className="card !p-0 overflow-hidden group">
            <summary className="px-4 py-3 font-bold cursor-pointer list-none flex items-center justify-between">
              Indizi · {g.titolo}
              <span className="text-tenue transition-transform group-open:rotate-90">›</span>
            </summary>
            <ul className="px-4 pb-3 border-t border-linea flex flex-col">
              {g.voci.map((v) => (
                <li key={v.segno} className="py-2 border-b border-linea last:border-0 text-sm leading-snug">
                  <b className="text-bordeaux">{v.segno}</b> → {v.pensa}
                  {v.to && <LinkR to={v.to} className="ml-1.5 text-xs font-semibold text-verde underline">PDTA ›</LinkR>}
                </li>
              ))}
            </ul>
          </details>
        ))}

        <section className="elenco !gap-2">
          <p className="etichetta px-1 mt-1">PDTA di tossicologia</p>
          {PDTA_TOSSICOLOGIA.map((l) => (
            <LinkR key={l.id} to={`/linee-guida/${l.id}`} className="card !py-2.5 flex items-center gap-3 active:bg-sabbia">
              <div className="w-9 h-9 rounded-xl bg-bordeaux3 text-bordeaux flex items-center justify-center font-extrabold text-xs shrink-0">
                {(l.titolo.replace(/^Intossicazione da /, '').includes(' ') ? l.titolo.replace(/^Intossicazione da /, '').split(' ').map((p) => p[0]).join('') : l.titolo).slice(0, 2).toUpperCase()}
              </div>
              <p className="flex-1 min-w-0 font-bold leading-tight">{l.titolo}</p>
              <span className="text-tenue">›</span>
            </LinkR>
          ))}
        </section>

        <p className="text-[11px] text-tenue px-1 leading-snug">
          Fonti: Goldfrank’s Toxicologic Emergencies, 11ª ed.; Lavonas et al., Circulation 2023 (AHA, avvelenamenti); criteri di Hunter (Dunkley, QJM 2003); consenso SNM (Gurrera, J Clin Psychiatry 2011); EXTRIP (dializzabilità). Le dosi sono coerenti con i PDTA dell’app.
        </p>
      </div>
    </RitornoCtx.Provider>
  )
}

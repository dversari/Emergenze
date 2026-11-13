import { Fragment, createElement, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Scheda } from '../lib/schede'
import { FIGURE } from './FigureProcedure'
import Riconoscimenti, { FiltroRiconoscimenti } from './Riconoscimenti'
import { aziendale, passaFiltro, statoRevisione, type Filtro } from '../lib/riconoscimenti'

// Nomi dei farmaci evidenziati in rosso grassetto dentro i testi.
const FARMACI = [
  'N-acetilcisteina','acetilcisteina','levetiracetam','valproato','fenitoina','tenecteplase','idrocortisone','calcio gluconato','calcio cloruro','insulina','Actrapid','zirconio ciclosilicato','glucagone','salbutamolo','KCl','desmopressina','magnesio solfato','carbone attivo',
  'aspirina','acido acetilsalicilico','prasugrel','ticagrelor','clopidogrel','metoprololo','amiodarone','furosemide','isosorbide dinitrato','nitroglicerina','metoclopramide','digossina','diltiazem','flecainide','propafenone','vernakalant','dobutamina','levosimendan','acetazolamide','idroclorotiazide','enoxaparina','apixaban','rivaroxaban','alteplase',
  'ketamina', 'propofol', 'ketofol', 'midazolam', 'fentanil', 'morfina',
  'rocuronio', 'succinilcolina', 'sugammadex', 'naloxone', 'flumazenil', 'noradrenalina', 'adrenalina',
  'ondansetron', 'olanzapina', 'lorazepam', 'aloperidolo', 'diazepam', 'tiamina', 'quetiapina',
  'clorpromazina', 'levomepromazina', 'butilscopolamina', 'lidocaina', 'atropina', 'albumina', 'caffeina',
  'desametasone', 'clorexidina', 'eparina', 'ropivacaina', 'levobupivacaina',
  'adenosina', 'labetalolo', 'urapidil', 'esmololo', 'nitroprussiato', 'verapamil', 'nifedipina', 'nimodipina', 'ivabradina',
  'dabigatran', 'edoxaban', 'fondaparinux', 'warfarin', 'acenocumarolo', 'idarucizumab', 'andexanet', 'protamina', 'vitamina K',
  'complesso protrombinico', 'acido tranexamico', 'fibrinogeno', 'caplacizumab', 'rituximab', 'eculizumab', 'ravulizumab', 'atorvastatina',
  'metilprednisolone', 'prednisone', 'prednisolone', 'betametasone', 'mometasone', 'clorfenamina', 'cetirizina', 'ketotifene',
  'paracetamolo', 'ibuprofene', 'ketorolac', 'diclofenac', 'tramadolo', 'oxazepam', 'sumatriptan', 'lacosamide', 'colchicina',
  'omeprazolo', 'pantoprazolo', 'esomeprazolo', 'alginato', 'macrogol', 'lattulosio', 'octreotide', 'terlipressina',
  'ipratropio', 'polistirene sulfonato', 'bicarbonato di sodio', 'bicarbonato', 'mannitolo', 'glucosio', 'idrossocobalamina', 'anticorpi antidigossina',
  'amoxicillina', 'clavulanato', 'ampicillina', 'piperacillina', 'tazobactam', 'ceftriaxone', 'cefotaxime', 'cefazolina', 'ceftazidima', 'cefepime',
  'meropenem', 'ertapenem', 'vancomicina', 'linezolid', 'daptomicina', 'clindamicina', 'gentamicina', 'amikacina', 'azitromicina', 'claritromicina',
  'doxiciclina', 'ciprofloxacina', 'levofloxacina', 'metronidazolo', 'fosfomicina', 'nitrofurantoina', 'cotrimossazolo', 'tobramicina',
'pralidossima', 'dantrolene', 'ciproeptadina', 'bromocriptina', 'fomepizolo', 'emulsione lipidica', 'acido zoledronico', 'zoledronato', 'denosumab', 'calcitonina', 'metimazolo', 'propiltiouracile', 'propranololo', 'Lugol', 'levotiroxina', 'silibinina', 'siero antivipera', 'lattulosio', 'rifaximina', 'immunoglobuline', 'ossitocina', 'metilergometrina', 'misoprostolo', 'sulprostone', 'rasburicase', 'allopurinolo', 'fattore VIII', 'fattore IX', 'artesunato', 'artemetere', 'atovaquone', 'dolutegravir', 'raltegravir', 'emtricitabina', 'tenofovir', 'icatibant', 'C1-inibitore', 'oxacillina', 'rifampicina', 'piridossina', 'acido folinico', 'Gastrografin', 'anti-D', 'Cyanokit', 'Igantet', 'Truvada', 'Tivicay',
  'aciclovir', 'valaciclovir', 'oseltamivir', 'fluconazolo', 'timololo', 'ATRA', 'procainamide', 'plasma', 'emazie',
]
const RE_FARMACI = new RegExp(`\\b(${[...FARMACI].sort((a, b) => b.length - a.length).join('|')})\\b`, 'gi')

export function Evidenzia({ t }: { t: string }) {
  const parti = t.split(RE_FARMACI)
  return <>{parti.map((p, i) => (i % 2 === 1 ? <strong key={i} className="font-extrabold text-bordeaux">{p}</strong> : p))}</>
}

/** Elenco di card raggruppate che si aprono sui passaggi (Procedure, Sedazione). */
export default function PaginaSchede({ schede, segnaposto, senzaCerca, senzaGruppi, sezione }: { schede: Scheda[]; segnaposto: string; senzaCerca?: boolean; senzaGruppi?: boolean; /** pagina per i riconoscimenti: 'procedure', 'sedazione', 'percorsi' */ sezione: string }) {
  const [filtro, setFiltro] = useState<Filtro>('tutte')
  const ch = (id: string) => `${sezione}/${id}`
  const [params, setParams] = useSearchParams()
  const [aperto, setAperto] = useState<string | null>(params.get('apri'))
  const [cerca, setCerca] = useState('')
  const q = cerca.trim().toLowerCase()

  const apri = params.get('apri')
  useEffect(() => { if (apri) setAperto(apri) }, [apri])

  useEffect(() => {
    if (!aperto) return
    document.getElementById(`s-${aperto}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [aperto])

  const toggle = (id: string) => {
    const nuovo = aperto === id ? null : id
    setAperto(nuovo)
    const np = new URLSearchParams(params)
    if (nuovo) np.set('apri', nuovo); else np.delete('apri')
    setParams(np, { replace: true })
  }

  const voci = schede.filter((s) => (!q || `${s.nome} ${s.sintesi} ${s.gruppo}`.toLowerCase().includes(q)) && passaFiltro(filtro, ch(s.id), s))
  const nRev = schede.filter((s) => statoRevisione(ch(s.id), s)?.stato === 'revisionata').length
  const nAsl = schede.filter((s) => aziendale(ch(s.id)).length).length
  const gruppi = [...new Set(voci.map((s) => s.gruppo))]

  return (
    <div className="elenco">
      {!senzaCerca && <input value={cerca} onChange={(e) => setCerca(e.target.value)} placeholder={segnaposto}
        className="rounded-xl border border-linea px-3 py-2.5 text-base" />}
      {!senzaCerca && <FiltroRiconoscimenti valore={filtro} onCambia={setFiltro} revisionate={nRev} aziendali={nAsl} />}
      {gruppi.map((g) => (
        <Fragment key={g}>
          {!senzaGruppi && <p className="etichetta px-1 mt-1">{g}</p>}
          {voci.filter((s) => s.gruppo === g).map((s) => {
            const open = aperto === s.id
            return (
              <section key={s.id} id={`s-${s.id}`} className={`card !p-0 overflow-hidden scroll-mt-24 ${s.urgente ? '!border-bordeaux border-2' : ''}`}>
                <button onClick={() => toggle(s.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold leading-tight">{s.urgente && <span className="mr-1.5 align-middle text-[10px] font-black uppercase tracking-wide rounded-full px-2 py-0.5 bg-bordeaux text-white">Urgenza</span>}{s.nome}</p>
                    <p className="text-xs text-tenue leading-snug mt-0.5"><Evidenzia t={s.sintesi} /></p>
                  </div>
                  <Riconoscimenti chiave={ch(s.id)} contenuto={s} />
                  <span className={`text-tenue transition-transform shrink-0 ${open ? 'rotate-90' : ''}`}>›</span>
                </button>
                {open && (
                  <div className="px-4 pb-4 pt-1 border-t border-linea flex flex-col gap-3">
                    {FIGURE[s.id] && <div className="mt-2">{createElement(FIGURE[s.id])}</div>}
                    {s.blocchi.map((b) => (
                      <div key={b.titolo}>
                        <p className="etichetta mt-2 mb-1.5">{b.titolo}</p>
                        {b.numerato ? (
                          <ol className="flex flex-col gap-1.5">
                            {b.righe.map((r, i) => (
                              <li key={i} className="flex gap-2.5 text-sm leading-snug">
                                <span className="shrink-0 w-5 h-5 rounded-full bg-verde text-white text-[11px] font-bold flex items-center justify-center mt-px">{i + 1}</span>
                                <span><Evidenzia t={r} /></span>
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <ul className="flex flex-col gap-1">
                            {b.righe.map((r, i) => (
                              <li key={i} className="text-sm leading-snug pl-3 relative">
                                <span className="absolute left-0 top-[0.55em] w-1 h-1 rounded-full bg-tenue" /><Evidenzia t={r} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                    {s.link && (
                      <div className="flex flex-wrap gap-1.5">
                        {s.link.map((l) => {
                          const cls = `text-xs font-bold rounded-full px-3 py-1.5 ${l.primario ? 'bg-verde text-white' : 'border border-verde text-verde'}`
                          if (l.href.startsWith('docs/')) return <Link key={l.href} to={`/pdf?f=${encodeURIComponent(l.href)}&t=${encodeURIComponent(l.etichetta.replace(/^\S+\s/, ''))}`} className={cls}>{l.etichetta}</Link>
                          return l.href.startsWith('/')
                            ? <Link key={l.href} to={l.href} className={cls}>{l.etichetta} →</Link>
                            : <a key={l.href} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={cls}>{l.etichetta}</a>
                        })}
                      </div>
                    )}
                    {s.fonte && <p className="text-[11px] text-tenue">Fonte: {s.fonte}</p>}
                  </div>
                )}
              </section>
            )
          })}
        </Fragment>
      ))}
      {!voci.length && <p className="intero text-sm text-tenue px-1">Nessun risultato.</p>}
      <p className="intero text-[11px] text-tenue px-1 mt-1">Adulto. Dosi da verificare su peso, età, funzione d’organo e protocolli locali.</p>
    </div>
  )
}

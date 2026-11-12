import { useState } from 'react'
import { Link } from 'react-router-dom'

/*
 * «Modulo per trasferimento di Emergenza» (Allegato 1 alla PA.A118.01, Dipartimento Emergenza ed Area Critica,
 * Area Emergenza Territoriale 118), ridisegnato dalla scansione con campi compilabili.
 * Ospedale e reparto di partenza sono precompilati ma modificabili. I dati del paziente NON vengono salvati;
 * nome e telefono del medico richiedente si condividono con il modulo trasfusione.
 */

const IOS = typeof navigator !== 'undefined' && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

async function creaPdf(): Promise<File> {
  const el = document.getElementById('modulo-stampa')!
  const [{ toPng }, { jsPDF }] = await Promise.all([import('html-to-image'), import('jspdf')])
  el.classList.add('in-pdf')
  const ph = [...el.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[placeholder]')].map((i) => [i, i.placeholder] as const)
  ph.forEach(([i]) => { i.placeholder = '' })
  try {
    const png = await toPng(el, { pixelRatio: 3, backgroundColor: '#ffffff' })
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const r = el.offsetHeight / el.offsetWidth
    const w = 210, h = Math.min(297, w * r)
    doc.addImage(png, 'PNG', 0, 0, h < 297 ? w : 297 / r, h)
    return new File([doc.output('blob')], 'trasferimento-emergenza.pdf', { type: 'application/pdf' })
  } finally { el.classList.remove('in-pdf'); ph.forEach(([i, t]) => { i.placeholder = t }) }
}

const CHIAVE_MEDICO = 'emergenze.trasfusione.medico'
const leggiMedico = () => { try { return JSON.parse(localStorage.getItem(CHIAVE_MEDICO) ?? '{}') as { nome?: string; tel?: string } } catch { return {} } }
const oggi = () => new Date().toLocaleDateString('it-IT')

const PRESIDI_1 = [
  ['resp', 'Respiro spontaneo'], ['o2', 'Ossigenoterapia l/min'], ['iot', 'Intubazione oro-tracheale'], ['int', 'Intubazione naso-tracheale'],
  ['trach', 'Tracheotomia'], ['dren', 'Drenaggio toracico'], ['vass', 'Ventilazione assistita'], ['vmecc', 'Ventilazione meccanica'],
] as const
const PRESIDI_2 = [
  ['vp', 'Linea venosa periferica'], ['cvc', 'Linea venosa centrale'], ['sng', 'Sondino naso-gastrico'], ['cv', 'Catetere vescicale'],
  ['coll', 'Collare cervicale'], ['tav', 'Tavola spinale'], ['stab', 'Emodinamica stabile'], ['instab', 'Emodinamica instabile'],
] as const
const PUPILLE = [['miosi', 'Pupille isocoriche: miosi'], ['midriasi', 'Pupille isocoriche: midriasi'], ['anisodx', 'Anisocoria dx > sn'], ['anisosn', 'Anisocoria sn > dx']] as const

const CLASSI: { titolo: string; voci: string[] }[] = [
  { titolo: 'Classe I e II', voci: ['Non richiede o richiede di rado il monitoraggio dei P.V.', 'Può avere bisogno di un accesso venoso', 'Non richiede la somministrazione continua di O₂', 'Non deve essere trasferito in una Terapia Intensiva'] },
  { titolo: 'Classe III', voci: ['Richiede frequente controllo dei P.V.', 'Ha bisogno di un accesso venoso', 'Non ha bisogno di monitoraggio invasivo', 'Può presentare lieve o modesto distress respiratorio', 'Può presentare lieve compromissione dello stato di coscienza (GCS > 9)', 'Richiede continua somministrazione di O₂'] },
  { titolo: 'Classe IV', voci: ['Richiede intubazione oro-tracheale', 'Richiede supporto ventilatorio', 'Ha bisogno di due linee venose o di CVC', 'Può presentare distress respiratorio grave', 'Può presentare compromissione dello stato di coscienza (GCS ≤ 9)', 'Può richiedere la somministrazione di farmaci salvavita', 'È trasferito in reparto di Terapia Intensiva'] },
  { titolo: 'Classe V', voci: ['Non può essere completamente stabilizzato', 'Richiede monitoraggio e supporto vitale invasivo', 'Richiede terapia salvavita durante il trasporto'] },
]

function C({ className = '', ...p }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={`campo ${className}`} />
}

export default function ModuloTrasferimento() {
  const medico = leggiMedico()
  const [spunte, setSpunte] = useState<Record<string, boolean>>({})
  const [gcs, setGcs] = useState({ e: '', v: '', m: '' })
  const [chiave, setChiave] = useState(0)
  const [nomeMed, setNomeMed] = useState(medico.nome ?? '')
  const [telMed, setTelMed] = useState(medico.tel ?? '')

  const salvaMedico = (n: string, t: string) => { try { localStorage.setItem(CHIAVE_MEDICO, JSON.stringify({ ...leggiMedico(), nome: n, tel: t })) } catch { /* privata */ } }
  /** Casella singola; `gruppo` rende esclusive le caselle con lo stesso prefisso (sì/no). */
  const K = ({ id, gruppo, children }: { id: string; gruppo?: string[]; children?: React.ReactNode }) => {
    const on = !!spunte[id]
    const tocca = () => setSpunte((s) => {
      const n = { ...s, [id]: !s[id] }
      if (!on && gruppo) gruppo.filter((g) => g !== id).forEach((g) => { n[g] = false })
      return n
    })
    return (
      <label className="inline-flex items-start gap-[1.5mm] cursor-pointer">
        <span className={`casella shrink-0 mt-[0.4mm] ${on ? 'piena' : ''}`} onClick={tocca} role="checkbox" aria-checked={on} aria-label={typeof children === 'string' ? children : id} />
        {children && <span onClick={tocca}>{children}</span>}
      </label>
    )
  }

  const n = (x: string) => (/^\d+$/.test(x.trim()) ? Number(x) : NaN)
  const tot = n(gcs.e) + n(gcs.v) + n(gcs.m)

  const svuota = () => {
    if (!confirm('Cancellare i dati del paziente dal modulo?')) return
    setSpunte({}); setGcs({ e: '', v: '', m: '' }); setChiave((k) => k + 1)
  }

  const [pdf, setPdf] = useState<File | null>(null)
  const [preparo, setPreparo] = useState(false)
  const stampa = async () => {
    if (!IOS) { window.print(); return }
    setPreparo(true)
    try { setPdf(await creaPdf()) } catch (e) { alert('Non riesco a creare il PDF: ' + (e as Error).message) } finally { setPreparo(false) }
  }
  const apriPdf = async () => {
    if (!pdf) return
    try {
      if (navigator.canShare?.({ files: [pdf] })) { await navigator.share({ files: [pdf], title: 'Trasferimento di emergenza' }); return }
    } catch (e) { if ((e as Error).name === 'AbortError') return }
    const url = URL.createObjectURL(pdf)
    const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.download = pdf.name; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 60000)
  }

  return (
    <div className="flex flex-col gap-3 lg:max-w-4xl lg:mx-auto">
      {pdf && (
        <div className="no-print fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4" onClick={() => setPdf(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-lg font-extrabold">PDF pronto</div>
            <p className="mt-1 text-sm text-tenue">Tocca «Stampa», poi nel menu di condivisione scegli <b>Stampa</b> (AirPrint) o salvalo/invialo.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setPdf(null)} className="flex-1 rounded-full border border-linea-forte py-2.5 font-bold text-tenue">Chiudi</button>
              <button onClick={apriPdf} className="flex-1 rounded-full bg-verde py-2.5 font-extrabold text-white">🖨︎ Stampa</button>
            </div>
          </div>
        </div>
      )}
      <div className="no-print flex flex-wrap items-center gap-2">
        <Link to="/moduli" className="text-sm text-tenue">‹ Moduli</Link>
        <span className="flex-1" />
        <button onClick={svuota} className="rounded-full border border-linea-forte px-4 py-2 text-sm font-bold text-tenue">Svuota</button>
        <button onClick={stampa} disabled={preparo} className="rounded-full bg-verde text-white px-5 py-2 text-sm font-extrabold disabled:opacity-60">{preparo ? 'Preparo…' : '🖨︎ Stampa'}</button>
      </div>
      <p className="no-print text-[12px] text-tenue leading-snug">Compila i campi (anche incollando da FirstAid) e premi Stampa. Il totale GCS si calcola da solo. I dati del paziente non vengono salvati; nome e telefono del medico sono quelli del modulo trasfusione.</p>

      <div className="overflow-x-auto -mx-3.5 px-3.5 lg:mx-0 lg:px-0">
        <div id="modulo-stampa" key={chiave} className="foglio trasf">
          <div className="flex items-start">
            <img src="./logo-asl-toscana-centro.png" alt="Azienda USL Toscana centro" className="w-[24mm] h-auto" />
            <div className="flex-1 text-center pr-[24mm] mt-[3mm]">
              <p>Dipartimento Emergenza ed Area Critica</p>
              <p>Area Emergenza Territoriale 118</p>
            </div>
          </div>
          <p className="text-right font-bold mt-[1mm]">Allegato 1</p>
          <p className="text-center font-bold text-[11.5pt] mb-[2mm]">MODULO PER TRASFERIMENTO DI EMERGENZA</p>

          <table className="riquadro">
            <tbody>
              <tr>
                <td colSpan={2}>
                  <p className="flex items-end gap-1"><b>Paziente</b> Cognome/Nome <C className="flex-1" /> nato a <C className="w-[45mm]" /></p>
                  <p className="flex items-end gap-1 mt-[1.5mm]">il <C className="w-[24mm]" placeholder="gg/mm/aaaa" /> residenza <C className="flex-1" /></p>
                </td>
              </tr>
              <tr>
                <td className="w-1/2">
                  <p className="flex items-end gap-1">Partenza da (Ospedale) <C className="flex-1" defaultValue="PO S. Stefano – Prato" /></p>
                  <p className="flex items-end gap-1">Reparto <C className="flex-1" defaultValue="Pronto Soccorso – DEA" /></p>
                  <p className="flex items-end gap-1">Medico richiedente <C className="flex-1" value={nomeMed} onChange={(e) => { setNomeMed(e.target.value); salvaMedico(e.target.value, telMed) }} /></p>
                  <p className="flex items-end gap-1">Telefono <C className="flex-1" value={telMed} onChange={(e) => { setTelMed(e.target.value); salvaMedico(nomeMed, e.target.value) }} /></p>
                </td>
                <td>
                  <p className="flex items-end gap-1">Destinazione (Ospedale) <C className="flex-1" /></p>
                  <p className="flex items-end gap-1">Reparto <C className="flex-1" /></p>
                  <p className="flex items-end gap-1">Medico accettante <C className="flex-1" /></p>
                  <p className="flex items-end gap-1">Telefono <C className="flex-1" /></p>
                </td>
              </tr>
              <tr><td colSpan={2}><div className="flex items-start gap-1"><b>DIAGNOSI:</b><textarea rows={2} className="campo flex-1 resize-none leading-[1.5]" /></div></td></tr>
              <tr><td colSpan={2} className="text-center font-bold !py-[0.8mm]">SINTESI CONDIZIONI CLINICHE</td></tr>
              <tr>
                <td colSpan={2} className="!p-0">
                  <div className="grid grid-cols-[1fr_1fr_0.95fr]">
                    <div className="flex flex-col gap-[0.6mm] p-[1.5mm] border-r border-black">
                      {PRESIDI_1.map(([id, t]) => (
                        <span key={id} className="flex items-end gap-1 whitespace-nowrap"><K id={id}>{t}</K>{id === 'o2' && <C className="w-[10mm] text-center" />}</span>
                      ))}
                    </div>
                    <div className="flex flex-col gap-[0.6mm] p-[1.5mm] border-r border-black">
                      {PRESIDI_2.map(([id, t]) => (
                        <span key={id} className="flex items-end gap-1 whitespace-nowrap"><K id={id} gruppo={id === 'stab' || id === 'instab' ? ['stab', 'instab'] : undefined}>{t}</K>
                          {id === 'vp' && <> n.<C className="w-[6mm] text-center" />G<C className="w-[7mm] text-center" /></>}
                          {id === 'cvc' && <C className="flex-1 min-w-0" />}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-col gap-[0.6mm] p-[1.5mm]">
                      <span className="flex items-end gap-1"><b>GCS</b>
                        {(['e', 'v', 'm'] as const).map((k) => (
                          <span key={k} className="flex items-end gap-[0.5mm] ml-[1mm]">{k.toUpperCase()}<C className="w-[7mm] text-center" inputMode="numeric" value={gcs[k]} onChange={(ev) => setGcs((g) => ({ ...g, [k]: ev.target.value }))} /></span>
                        ))}
                        <span className="ml-[1mm]">Tot</span><span className="fisso min-w-[7mm] text-center">{Number.isNaN(tot) ? '' : tot}</span>
                      </span>
                      <span className="h-[1mm]" />
                      {PUPILLE.map(([id, t]) => <K key={id} id={id} gruppo={PUPILLE.map((p) => p[0])}>{t}</K>)}
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <p className="flex items-end gap-1 flex-wrap">
                    {[['F.R.', 10], ['FiO₂', 12], ['SpO₂', 12], ['EtCO₂', 12], ['pH', 12], ['PaO₂', 14], ['PaCO₂', 14]].map(([k, w]) => (
                      <span key={k} className="flex items-end gap-[0.5mm] mr-[1.5mm]">{k}<C style={{ width: `${w}mm` }} /></span>
                    ))}
                  </p>
                  <p className="flex items-end gap-1 mt-[1mm]">
                    {[['F.C.', 12], ['P.A.', 20], ['PVC', 12]].map(([k, w]) => (
                      <span key={k} className="flex items-end gap-[0.5mm] mr-[1.5mm]">{k}<C style={{ width: `${w}mm` }} /></span>
                    ))}
                    Altro <C className="flex-1" />
                  </p>
                </td>
              </tr>
              <tr><td colSpan={2} className="text-center font-bold !py-[0.8mm]">LIVELLO DI ASSISTENZA DA GARANTIRE IN ITINERE: CLASSIFICAZIONE DI EHRENWERTH</td></tr>
              {[0, 2].map((i) => (
                <tr key={i}>
                  {CLASSI.slice(i, i + 2).map((c) => (
                    <td key={c.titolo} className="w-1/2">
                      <p className="font-bold flex items-center gap-[2mm]"><span className="scelta-classe"><K id={`classe-${c.titolo}`} gruppo={CLASSI.map((x) => `classe-${x.titolo}`)}>{c.titolo}</K></span><span className="font-normal">– Il paziente:</span></p>
                      <div className="flex flex-col gap-[0.4mm] mt-[0.5mm]">
                        {c.voci.map((v, j) => <K key={v} id={`${c.titolo}-${j}`}>{v}</K>)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={2}>
                  <p className="flex items-end gap-1">Documentazione allegata <C className="flex-1" /> Terapia in atto <C className="flex-1" /></p>
                  <p className="flex items-end gap-1 mt-[1mm]">Allergie e note <C className="flex-1" /></p>
                  <p className="flex items-end gap-1 mt-[1mm]">Eventuale patologia infettiva in atto o sospetta <C className="w-[38mm]" /> Ulteriori notizie utili <C className="flex-1" /></p>
                  <p className="flex items-end gap-1 mt-[1mm]">Multiresistenza nota <K id="mdr-si" gruppo={['mdr-si', 'mdr-no']}>SÌ</K> <C className="flex-1" /> <K id="mdr-no" gruppo={['mdr-si', 'mdr-no']}>NO</K>
                    <span className="ml-[3mm]">Paziente a rischio colonizzazione</span> <K id="col-si" gruppo={['col-si', 'col-no']}>SÌ</K> <K id="col-no" gruppo={['col-si', 'col-no']}>NO</K>
                  </p>
                  <p className="flex items-end gap-1 mt-[1mm]">Precauzioni da adottare <C className="flex-1" /></p>
                </td>
              </tr>
              <tr>
                <td className="h-[20mm]"><p className="flex items-end gap-1">Data <C className="w-[26mm]" defaultValue={oggi()} /> ora <C className="w-[14mm]" /></p></td>
                <td className="text-center">Timbro e firma del Medico richiedente</td>
              </tr>
            </tbody>
          </table>
          <p className="flex justify-between text-[7.5pt] mt-[1.5mm]"><span>Allegato 1 alla PA.A118.01</span><span>Pag. 1 di 1</span><span>Rev. 0</span></p>
        </div>
      </div>
    </div>
  )
}

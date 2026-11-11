import { useState } from 'react'
import { Link } from 'react-router-dom'

/*
 * Modulo aziendale «Richiesta di sangue e emocomponenti» (SOC Immunoematologia e Medicina Trasfusionale
 * Prato-Pistoia, versione 2019), ridisegnato con linee nere e campi compilabili per copiare i dati da FirstAid.
 * Centro di costo e struttura sono fissi (DEA, 8981C). I dati del paziente NON vengono salvati:
 * restano solo nella pagina finché non la si chiude; si ricordano solo nome e telefono del medico.
 */

const IOS = typeof navigator !== 'undefined' && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

/** Su iPhone window.print() non funziona nell'app installata: si genera un PDF A4 da condividere/stampare. */
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
    return new File([doc.output('blob')], 'richiesta-trasfusione.pdf', { type: 'application/pdf' })
  } finally { el.classList.remove('in-pdf'); ph.forEach(([i, t]) => { i.placeholder = t }) }
}

const CHIAVE_MEDICO = 'emergenze.trasfusione.medico'
const leggiMedico = () => { try { return JSON.parse(localStorage.getItem(CHIAVE_MEDICO) ?? '{}') as { nome?: string; tel?: string } } catch { return {} } }

const COMPONENTI = [
  'Globuli rossi concentrati',
  'Plasma fresco congelato',
  'Plasma da Aferesi',
  'Concentrato piastrinico da Pool di Buffy',
  'Concentrato piastrinico da Aferesi (previa prenotazione)',
  'Sangue da predeposito per AUTOTRASFUSIONE',
  'Altro (specificare)',
]

const oggi = () => new Date().toLocaleDateString('it-IT')

/** Campo di testo su riga punteggiata, stampabile. */
function C({ className = '', ...p }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={`campo ${className}`} />
}
function Scelta({ nome, valori, valore, set }: { nome: string; valori: string[]; valore: string; set: (v: string) => void }) {
  return (
    <span className="inline-flex gap-3">
      {valori.map((v) => (
        <label key={v} className="inline-flex items-center gap-1 cursor-pointer">
          <span className={`casella ${valore === v ? 'piena' : ''}`} onClick={() => set(valore === v ? '' : v)} role="checkbox" aria-checked={valore === v} aria-label={`${nome} ${v}`} />
          <span onClick={() => set(valore === v ? '' : v)}>{v}</span>
        </label>
      ))}
    </span>
  )
}

export default function ModuloTrasfusione() {
  const medico = leggiMedico()
  const [sesso, setSesso] = useState('')
  const [intervento, setIntervento] = useState('')
  const [pregresse, setPregresse] = useState('')
  const [reazioni, setReazioni] = useState('')
  const [urgenza, setUrgenza] = useState('')
  const [nonUrg, setNonUrg] = useState('')
  const [chiave, setChiave] = useState(0)
  const [nomeMed, setNomeMed] = useState(medico.nome ?? '')
  const [telMed, setTelMed] = useState(medico.tel ?? '')

  const salvaMedico = (n: string, t: string) => { try { localStorage.setItem(CHIAVE_MEDICO, JSON.stringify({ nome: n, tel: t })) } catch { /* privata */ } }
  const svuota = () => {
    if (!confirm('Cancellare i dati del paziente dal modulo?')) return
    setSesso(''); setIntervento(''); setPregresse(''); setReazioni(''); setUrgenza(''); setNonUrg(''); setChiave((k) => k + 1)
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
      if (navigator.canShare?.({ files: [pdf] })) { await navigator.share({ files: [pdf], title: 'Richiesta trasfusione' }); return }
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
        <span className="flex gap-4"><Link to="/moduli" className="text-sm text-tenue">‹ Moduli</Link><Link to="/linee-guida/anemia-acuta" className="text-sm text-tenue">PDTA anemia acuta</Link></span>
        <span className="flex-1" />
        <button onClick={svuota} className="rounded-full border border-linea-forte px-4 py-2 text-sm font-bold text-tenue">Svuota</button>
        <button onClick={stampa} disabled={preparo} className="rounded-full bg-verde text-white px-5 py-2 text-sm font-extrabold disabled:opacity-60">{preparo ? 'Preparo…' : '🖨︎ Stampa'}</button>
      </div>
      <p className="no-print text-[12px] text-tenue leading-snug">Compila i campi (anche incollando da FirstAid) e premi Stampa. Centro di costo e struttura sono già impostati. I dati del paziente non vengono salvati: restano solo finché la pagina è aperta. Nome e telefono del medico vengono ricordati su questo dispositivo.</p>

      <div className="overflow-x-auto -mx-3.5 px-3.5 lg:mx-0 lg:px-0">
        <div id="modulo-stampa" key={chiave} className="foglio">
          <div className="flex items-start">
            <img src="./logo-asl-toscana-centro.png" alt="Azienda USL Toscana centro" className="w-[26mm] h-auto" />
            <div className="flex-1 text-center pr-[26mm]">
              <p className="font-bold text-[13pt] mt-[6mm]">RICHIESTA DI SANGUE E EMOCOMPONENTI</p>
              <p>SOC Immunoematologia e Medicina Trasfusionale Prato-Pistoia</p>
              <p>PO S. Stefano di Prato</p>
              <p>Direttore: Dott. Crocco Antonio</p>
            </div>
          </div>

          <p className="text-right mt-[3mm]">Data <C defaultValue={oggi()} className="w-[32mm]" /></p>
          <p className="mt-[2mm] flex items-end gap-1">
            <span>Struttura organizzativa richiedente</span><span className="fisso flex-1">DEA</span>
            <span className="ml-2">Centro di costo</span><span className="fisso w-[28mm]">8981C</span>
          </p>

          <table className="riquadro mt-[3mm]">
            <tbody>
              <tr>
                <td className="w-[68%]">Cognome <C className="w-[75%]" /></td>
                <td>Data di nascita <C className="w-[24mm]" placeholder="gg/mm/aaaa" /></td>
              </tr>
              <tr>
                <td>Nome <C className="w-[80%]" /></td>
                <td>
                  <div className="flex items-center gap-3">
                    <span>Sesso</span><Scelta nome="Sesso" valori={['M', 'F']} valore={sesso} set={setSesso} />
                    <span>Peso</span><C className="w-[12mm]" /><span>Kg</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-[4mm] flex items-center gap-2 flex-wrap">
            <span className="leading-tight">Gruppo sanguigno AB0<br /><span className="text-[8pt]">(se documentato)</span></span><C className="box w-[20mm]" />
            <span className="ml-3">Rh</span><C className="box w-[20mm]" />
            <span className="ml-3">Fenotipo</span><C className="box w-[22mm]" />
            <span className="ml-3">Kell</span><C className="box w-[18mm]" />
          </div>

          <div className="riquadro mt-[3mm] p-[2mm]">
            <div className="flex items-start gap-1"><span>Diagnosi</span><textarea rows={2} className="campo flex-1 resize-none leading-[1.6]" /></div>
          </div>

          <p className="mt-[3mm]">Parametri da correggere:</p>
          <table className="riquadro griglia">
            <tbody>
              <tr>{['G.R.', 'G.B.', 'Hb', 'Ht', 'PLT'].map((k) => <td key={k}>{k} <C className="w-[60%]" /></td>)}</tr>
            </tbody>
          </table>
          <table className="riquadro griglia">
            <tbody>
              <tr>
                {[['* PT', 'vn: 70-100'], ['* APTT', '22-32 sec'], ['* INR', '0.8-1.2'], ['* Fibrinogeno', '200-400 mg/dl'], ['* D-Dimero', '<500 µg/l'], ['* Antitrombina III', '70-120 %']].map(([k, n]) => (
                  <td key={k}>{k} <C className="w-[45%]" /><br /><span className="text-[7.5pt]">({n})</span></td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="text-[8.5pt]">* parametri necessari per la richiesta di plasma.</p>

          <div className="mt-[3mm] grid grid-cols-[auto_auto_1fr] gap-x-4 gap-y-1 items-center">
            <span>Per intervento chirurgico?</span><Scelta nome="Intervento" valori={['SI', 'NO']} valore={intervento} set={setIntervento} />
            <span>Tipo di intervento: <C className="w-[55%]" /></span>
            <span>Pregresse trasfusioni?</span><Scelta nome="Pregresse trasfusioni" valori={['SI', 'NO']} valore={pregresse} set={setPregresse} />
            <span className="flex items-center gap-3">Pregresse reazioni trasfusionali? <Scelta nome="Reazioni" valori={['SI', 'NO']} valore={reazioni} set={setReazioni} /></span>
          </div>

          <table className="riquadro mt-[3mm]">
            <tbody>
              <tr>
                <td className="w-[58%] !p-0 align-top">
                  <table className="w-full interna">
                    <thead><tr><th className="text-left">SI RICHIEDE</th><th className="w-[18mm] text-[8pt] font-normal">N° Unità</th></tr></thead>
                    <tbody>
                      {COMPONENTI.map((c) => (
                        <tr key={c}><td>{c}</td><td><C className="w-full text-center" /></td></tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td className="align-top">
                  <p className="font-bold underline">RICHIESTA</p>
                  <div className="flex flex-col gap-[2.5mm] mt-[2mm]">
                    <Scelta nome="Urgenza" valori={['URGENTISSIMA (senza prove di compatibilità)']} valore={urgenza} set={setUrgenza} />
                    <Scelta nome="Urgenza" valori={['URGENTE']} valore={urgenza} set={setUrgenza} />
                    <span className="flex flex-wrap items-center gap-2">
                      <Scelta nome="Urgenza" valori={['NON URGENTE']} valore={urgenza} set={setUrgenza} />
                      (<Scelta nome="Non urgente" valori={['pomeriggio', 'giorno successivo']} valore={nonUrg} set={setNonUrg} />)
                    </span>
                    <span className="flex flex-wrap items-center gap-1">
                      <Scelta nome="Urgenza" valori={['PROGRAMMATA PER IL GIORNO']} valore={urgenza} set={setUrgenza} />
                      <C className="w-[20mm]" /> ora <C className="w-[12mm]" />
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <p className="text-[8.5pt] mt-[3mm] leading-snug">Invio due provette contenenti sangue intero in EDTA/citrato del suddetto paziente (prelevato da non più di 72 ore), dopo aver controllato che le provette sono state accuratamente contrassegnate con nome cognome e data di nascita ed ora del prelievo.<br />Attesto di aver verificato la corrispondenza paziente/prelievo (art.24 D.M. 2 Novembre 2015). Riconsegnare prima possibile il sangue non trasfuso.</p>
          <hr className="border-black mt-[2mm]" />

          <p className="mt-[5mm] flex items-end gap-1">Responsabile del prelievo Nome Cognome <C className="flex-1" /> Firma <span className="riga w-[55mm]" /></p>
          <p className="text-right text-[7.5pt] pr-[15mm]">(Firma leggibile)</p>
          <p className="mt-[4mm] flex items-end gap-1">Medico richiedente Nome Cognome
            <C className="flex-1" value={nomeMed} onChange={(e) => { setNomeMed(e.target.value); salvaMedico(e.target.value, telMed) }} /> Firma <span className="riga w-[55mm]" />
          </p>
          <p className="flex justify-between text-[8pt]"><span>Recapito Telef. Medico richiedente: <C className="w-[32mm]" value={telMed} onChange={(e) => { setTelMed(e.target.value); salvaMedico(nomeMed, e.target.value) }} /></span><span className="pr-[12mm]">(Firma leggibile o timbro)</span></p>

          <p className="mt-[6mm]">PER IL CENTRO:</p>
          <p className="mt-[4mm] flex items-end gap-1">Richiesta pervenuta al centro il <span className="riga w-[32mm]" /> ore <span className="riga w-[20mm]" /> UNITA’ N° <span className="riga w-[22mm]" /></p>
          <p className="text-right text-[7.5pt] mt-[4mm]">Originale per U.O. Medicina Trasfusionale e Immunoematologia</p>
        </div>
      </div>
    </div>
  )
}

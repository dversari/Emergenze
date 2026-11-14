import { useState } from 'react'
import BarraModulo from '../components/BarraModulo'

/*
 * «Schema terapia con eparina» (modulo DEA/OBI/HDU cod. az. 01125MOD16 rev. 0 del 03/01/2011), rivisto:
 * stesso schema (bolo 60 UI/kg, infusione 12 UI/kg/h, tabella per peso, aggiustamento per aPTT),
 * con calcolo dal peso, mL/h esatti, registro delle variazioni e controlli di sicurezza.
 * I dati del paziente NON vengono salvati.
 */
const oggi = () => new Date().toLocaleDateString('it-IT')
const ora = () => new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })

/** Siringa: 2 mL di eparina sodica 25.000 UI/5 mL (= 10.000 UI) + 48 mL di fisiologica = 50 mL a 200 UI/mL. */
const UI_ML_SIRINGA = 200
/** Fiala/flacone 25.000 UI/5 mL = 5.000 UI/mL, per il bolo. */
const UI_ML_FIALA = 5000

/** Tabella per peso del modulo originale. */
const TABELLA: { da: number; a: number; etichetta: string; bolo: number; uih: number }[] = [
  { da: 51, a: 55, etichetta: '51–55', bolo: 3000, uih: 650 },
  { da: 56, a: 60, etichetta: '56–60', bolo: 3500, uih: 700 },
  { da: 61, a: 65, etichetta: '61–65', bolo: 3750, uih: 750 },
  { da: 66, a: 70, etichetta: '66–70', bolo: 4000, uih: 800 },
  { da: 71, a: 75, etichetta: '71–75', bolo: 4000, uih: 850 },
  { da: 76, a: 80, etichetta: '76–80', bolo: 4000, uih: 900 },
  { da: 81, a: 999, etichetta: '> 80', bolo: 4000, uih: 1000 },
]

/** Aggiustamento secondo aPTT (secondi), come nel modulo originale. */
const AGGIUSTA: { aptt: string; bolo: string; stop: string; uih: number | null; ripeti: string }[] = [
  { aptt: '< 40', bolo: '2000 UI', stop: '—', uih: +150, ripeti: '6 h' },
  { aptt: '40–49', bolo: '—', stop: '—', uih: +100, ripeti: '6 h' },
  { aptt: '50–70', bolo: '—', stop: '—', uih: null, ripeti: '6 h (12 h dopo la 24ª ora)' },
  { aptt: '71–85', bolo: '—', stop: '—', uih: -50, ripeti: '6 h' },
  { aptt: '86–110', bolo: '—', stop: '30 min', uih: -100, ripeti: '6 h' },
  { aptt: '111–140', bolo: '—', stop: '60 min', uih: -150, ripeti: '6 h' },
  { aptt: '> 140', bolo: '—', stop: '60 min', uih: -300, ripeti: '6 h' },
]

const ml = (ui: number, conc: number) => (ui / conc).toLocaleString('it-IT', { maximumFractionDigits: 2 })
const segno = (n: number) => (n > 0 ? '+' : '−') + Math.abs(n)

function dosi(kg: number) {
  if (!kg || kg < 30 || kg > 250) return null
  const riga = TABELLA.find((r) => kg >= r.da && kg <= r.a)
  if (riga) return { bolo: riga.bolo, uih: riga.uih, fuori: false }
  // sotto i 51 kg il modulo non dà valori: 60 UI/kg e 12 UI/kg/h arrotondati a 50 UI
  const r50 = (x: number) => Math.round(x / 50) * 50
  return { bolo: r50(60 * kg), uih: r50(12 * kg), fuori: true }
}

function C({ className = '', ...p }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={`campo ${className}`} />
}

export default function ModuloEparina() {
  const [chiave, setChiave] = useState(0)
  const [peso, setPeso] = useState('')
  const kg = Number(peso.replace(',', '.'))
  const d = dosi(kg)

  return (
    <div className="flex flex-col gap-3 lg:max-w-4xl lg:mx-auto">
      <BarraModulo nomeFile="schema-eparina.pdf" titolo="Schema terapia con eparina" onSvuota={() => { setPeso(''); setChiave((k) => k + 1) }}
        nota="Inserisci il peso: bolo e velocità iniziale si compilano da soli. Il foglio va in cartella e si aggiorna a ogni aPTT nel registro in fondo." />

      <details className="no-print rounded-2xl border border-[#e6d5b0] bg-[#f6eedd] px-4 py-3 text-[13px] leading-snug text-[#7a5a17]">
        <summary className="cursor-pointer font-bold">Revisione del modulo 2011: cosa cambia e cosa va confermato</summary>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li><b>Invariati</b>: bolo 60 UI/kg (max 4000 UI), infusione 12 UI/kg/h (max 1000 UI/h), tabella per peso, soglie e azioni per aPTT, siringa 10.000 UI in 50 mL.</li>
          <li><b>Calcolo dal peso</b>: bolo in UI e in mL della fiala da 25.000 UI/5 mL; velocità in mL/h.</li>
          <li><b>mL/h esatti</b> nelle variazioni: +0,75 / −0,25 / −0,75 mL/h (il modulo arrotondava a +0,7 / −0,2 / −0,7).</li>
          <li><b>Peso &lt; 51 kg</b>: il modulo non lo prevedeva; si calcola 60 UI/kg e 12 UI/kg/h.</li>
          <li><b>Aggiunti</b>: registro delle variazioni, emocromo con piastrine (HIT), sanguinamento e protamina.</li>
          <li><b>Da confermare</b>: il range 50–70 s dipende dal reagente del laboratorio (va ricontrollato con il laboratorio di Prato); il modulo originale cita anche un aPTT «a tre ore», che qui non compare perché la tabella prevede il controllo a 6 h.</li>
          <li><b>Da decidere</b>: 60/12 UI/kg con tetti è lo schema delle sindromi coronariche acute; per il tromboembolismo venoso le linee guida usano 80 UI/kg e 18 UI/kg/h. Se il modulo si usa anche per la TEV, va scelto se aggiungere il secondo schema.</li>
        </ul>
      </details>

      <div className="overflow-x-auto -mx-3.5 px-3.5 lg:mx-0 lg:px-0">
        <div id="modulo-stampa" key={chiave} className="foglio trasf">
          <div className="flex items-start">
            <img src="./logo-asl-toscana-centro.png" alt="Azienda USL Toscana centro" className="w-[24mm] h-auto" />
            <div className="flex-1 text-center pr-[24mm] mt-[1mm] leading-tight">
              <p className="font-bold">EMERGENZA E ACCETTAZIONE</p>
              <p>Osservazione Breve Intensiva · HDU · letti monitorizzati</p>
              <p>Osservazione temporanea medico-chirurgica</p>
            </div>
          </div>
          <p className="text-center font-bold text-[13pt] mt-[3mm]">SCHEMA TERAPIA CON EPARINA SODICA EV</p>
          <p className="text-center text-[8.5pt]">da inserire sempre in cartella</p>

          <table className="riquadro mt-[3mm]">
            <tbody>
              <tr>
                <td className="w-[50%]">Cognome e nome <C className="w-full" /></td>
                <td>Nato/a il <C className="w-[24mm]" placeholder="gg/mm/aaaa" /></td>
                <td>Letto <C className="w-[14mm]" /></td>
              </tr>
              <tr>
                <td>Peso <input value={peso} onChange={(e) => setPeso(e.target.value)} inputMode="decimal" className="campo w-[16mm] text-center font-bold" /> kg</td>
                <td>Inizio infusione: data <C className="w-[22mm]" defaultValue={oggi()} /></td>
                <td>ora <C className="w-[14mm]" defaultValue={ora()} /></td>
              </tr>
              <tr>
                <td colSpan={3}>Indicazione <C className="w-[150mm]" /></td>
              </tr>
              <tr>
                <td colSpan={3}>aPTT basale (prima del bolo) <C className="w-[16mm]" /> s &nbsp; · &nbsp; Piastrine basali <C className="w-[18mm]" /> /mm³ &nbsp; · &nbsp; Hb <C className="w-[14mm]" /> g/dL &nbsp; · &nbsp; Creatinina <C className="w-[14mm]" /></td>
              </tr>
            </tbody>
          </table>

          <table className="riquadro mt-[3mm]">
            <tbody>
              <tr><td colSpan={3} className="font-bold">PREPARAZIONE E DOSE INIZIALE</td></tr>
              <tr>
                <td className="w-[38%]"><b>Siringa da 50 mL</b>: 2 mL di eparina sodica 25.000 UI/5 mL (= 10.000 UI) + 48 mL di fisiologica → <b>200 UI/mL</b></td>
                <td className="w-[31%]"><b>Bolo</b> (60 UI/kg, max 4000 UI)<br />
                  <span className="text-[12pt] font-bold">{d ? `${d.bolo} UI` : '______ UI'}</span>
                  {d && <> = <b>{ml(d.bolo, UI_ML_FIALA)} mL</b> della fiala 25.000 UI/5 mL</>}</td>
                <td><b>Infusione</b> (12 UI/kg/h, max 1000 UI/h)<br />
                  <span className="text-[12pt] font-bold">{d ? `${d.uih} UI/h` : '______ UI/h'}</span>
                  {d && <> = <b>{ml(d.uih, UI_ML_SIRINGA)} mL/h</b></>}</td>
              </tr>
              {d?.fuori && <tr><td colSpan={3} className="text-[8.5pt]">Peso fuori dalla tabella aziendale: valori calcolati a 60 UI/kg e 12 UI/kg/h, arrotondati a 50 UI.</td></tr>}
            </tbody>
          </table>

          <table className="riquadro mt-[3mm] text-center">
            <tbody>
              <tr><td colSpan={8} className="font-bold text-left">SCHEMA PER L’INIZIO DELL’INFUSIONE</td></tr>
              <tr><td className="text-left font-bold">kg</td>{TABELLA.map((r) => <td key={r.etichetta} className={d && !d.fuori && kg >= r.da && kg <= r.a ? 'font-bold bg-[#fff1b8]' : ''}>{r.etichetta}</td>)}</tr>
              <tr><td className="text-left font-bold">Bolo UI</td>{TABELLA.map((r) => <td key={r.etichetta}>{r.bolo}</td>)}</tr>
              <tr><td className="text-left font-bold">UI/h</td>{TABELLA.map((r) => <td key={r.etichetta}>{r.uih}</td>)}</tr>
              <tr><td className="text-left font-bold">mL/h</td>{TABELLA.map((r) => <td key={r.etichetta}>{ml(r.uih, UI_ML_SIRINGA)}</td>)}</tr>
            </tbody>
          </table>

          <table className="riquadro mt-[3mm] text-center">
            <tbody>
              <tr><td colSpan={5} className="font-bold text-left">AGGIUSTAMENTO DELL’INFUSIONE SECONDO aPTT</td></tr>
              <tr className="font-bold"><td>aPTT (s)</td><td>Bolo</td><td>Stop infusione</td><td>Variazione</td><td>Ripetere aPTT</td></tr>
              {AGGIUSTA.map((r) => (
                <tr key={r.aptt}>
                  <td className="font-bold">{r.aptt}</td><td>{r.bolo}</td><td>{r.stop}</td>
                  <td>{r.uih === null ? 'nessuna (range)' : `${segno(r.uih)} UI/h (${segno(r.uih / UI_ML_SIRINGA).replace('.', ',')} mL/h)`}</td>
                  <td>{r.ripeti}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[8.5pt] mt-[1mm]">aPTT: basale; primo controllo a 6 h dall’inizio e 6 h dopo ogni variazione. Con aPTT nel range il controllo passa a 12 h solo dopo la 24ª ora. Dopo uno stop si riprende alla nuova velocità.</p>

          <table className="riquadro mt-[3mm]">
            <tbody>
              <tr><td className="font-bold">SICUREZZA</td></tr>
              <tr><td className="text-[9pt] leading-snug">
                • Emocromo con piastrine basale e a giorni alterni: calo delle piastrine &gt; 50% o trombosi nuova tra il 5° e il 10° giorno (prima se eparina nei 100 giorni precedenti) → sospetto HIT: sospendere l’eparina e chiamare il medico.<br />
                • Sanguinamento: sospendere l’infusione, aPTT ed emocromo urgenti, avvisare il medico. Antidoto: <b>protamina</b> 1 mg ogni 100 UI di eparina infuse nelle ultime 2–3 h (max 50 mg), ev lenta in 10 minuti.<br />
                • Ogni variazione va registrata qui sotto e firmata.
              </td></tr>
            </tbody>
          </table>

          <table className="riquadro mt-[3mm] text-center text-[8.5pt]">
            <tbody>
              <tr className="font-bold"><td>Data</td><td>Ora</td><td>aPTT (s)</td><td>Bolo UI</td><td>Stop (min)</td><td>Nuova UI/h</td><td>mL/h</td><td>Prossimo aPTT</td><td>Firma</td></tr>
              {Array.from({ length: 9 }, (_, i) => (
                <tr key={i}>{Array.from({ length: 9 }, (_, j) => <td key={j} className="h-[6.5mm] p-0"><input className="campo w-full h-full text-center border-0" /></td>)}</tr>
              ))}
            </tbody>
          </table>

          <p className="flex justify-between text-[7.5pt] mt-[3mm]"><span>Da cod. az. 01125MOD16 rev. 0 del 03/01/2011, rivisto</span><span>Medico <span className="riga w-[45mm]" /></span></p>
        </div>
      </div>
    </div>
  )
}

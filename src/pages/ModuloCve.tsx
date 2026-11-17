import { useState } from 'react'
import BarraModulo from '../components/BarraModulo'

/*
 * Check-list della cardioversione elettrica (PS Prato), impaginata DEA-LIRIO.
 * Spunte cliccabili a schermo, stampabile in una pagina A4. I dati del paziente NON vengono salvati.
 */
const oggi = () => new Date().toLocaleDateString('it-IT')

type Sezione = { lettera: string; titolo: string; colore: string; voci: string[] }

const SEZIONI: Sezione[] = [
  {
    lettera: 'A', titolo: 'Airway', colore: '#2f6652',
    voci: ['Cannula di Guedel disponibile', 'Aspiratore acceso con sondino montato', 'Materiale per intubazione pronto e funzionante'],
  },
  {
    lettera: 'B', titolo: 'Breathing', colore: '#3f7f95',
    voci: ['Pallone autoespandibile o Mapleson C collegato all’O₂, con maschera', 'Saturimetro posizionato; capnografia se disponibile'],
  },
  {
    lettera: 'C', titolo: 'Circulation', colore: '#92794e',
    voci: ['Accesso venoso periferico ≥ 18 G (valutare il secondo)', 'Pervietà della linea verificata', 'Cristalloidi in flusso lento disponibili', 'Pressione arteriosa (bracciale ogni 3–5 min o linea arteriosa)', 'Monitor multiparametrico collegato', 'Elettrocardiografo pronto per l’ECG post-procedura'],
  },
  {
    lettera: 'D', titolo: 'Defibrillatore', colore: '#7b3f4a',
    voci: ['Elettrodi ECG posizionati, traccia pulita con QRS ben visibili', 'Piastre adesive posizionate (antero-laterali o antero-posteriori)', 'Defibrillatore funzionante, modalità manuale', 'SINC attiva: marcatore su ogni QRS', 'Energia selezionata e carica pronta'],
  },
]

const PRIMA = [
  'Consenso informato firmato e in cartella',
  'Allergie a farmaci verificate',
  'Digiuno: liquidi chiari ≥ 2 h, solidi ≥ 6 h (ASA); se a stomaco pieno valutare sondino o rinvio',
  'Anticoagulazione: FA ≥ 24 h o non databile → anticoagulante da ≥ 3 settimane senza interruzioni (o ETE negativa); FA databile < 24 h → si può procedere',
  'Rimosse protesi dentarie mobili, anelli, bracciali, orologi; cute asciutta e senza peli sotto le piastre',
]

const DOPO = [
  'Risveglio completo controllato (parametri ogni 15 min fino a ripresa)',
  'Cute sotto le piastre trattata (Connettivina o pomata lenitiva)',
  'ECG a 12 derivazioni dopo la procedura',
  'Materiale riordinato, defibrillatore in carica',
]

const SEDAZIONE: { nome: string; dose: string; perKg: [number, number]; unita: string; nota?: string }[] = [
  { nome: 'Propofol', dose: '0,5–1 mg/kg in bolo lento, poi 0,25–0,5 mg/kg', perKg: [0.5, 1], unita: 'mg', nota: '10 o 20 mg/mL' },
  { nome: 'Midazolam', dose: '0,03–0,05 mg/kg (anziano: metà)', perKg: [0.03, 0.05], unita: 'mg' },
  { nome: 'Ketamina', dose: '0,5–1 mg/kg', perKg: [0.5, 1], unita: 'mg', nota: 'se ipotensione' },
  { nome: 'Fentanil', dose: '0,5–1 mcg/kg', perKg: [0.5, 1], unita: 'mcg', nota: 'in associazione' },
]

const RISERVA = ['Atropina', 'Naloxone (Narcan)', 'Flumazenil (Anexate)', 'Adrenalina']

function Spunta({ testo, colore = '#1f2b26' }: { testo: string; colore?: string }) {
  const [si, setSi] = useState(false)
  return (
    <label className="flex items-start gap-[2mm] cursor-pointer select-none py-[0.6mm]">
      <span onClick={() => setSi((x) => !x)} className="mt-[0.4mm] shrink-0 w-[4mm] h-[4mm] rounded-[1mm] border-[1.5px] flex items-center justify-center text-[8pt] font-black leading-none"
        style={{ borderColor: colore, color: colore }}>{si ? '✓' : ''}</span>
      <span onClick={() => setSi((x) => !x)}>{testo}</span>
    </label>
  )
}

function Blocco({ lettera, titolo, colore, children }: { lettera?: string; titolo: string; colore: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[2.5mm] border-[1.2px] overflow-hidden break-inside-avoid" style={{ borderColor: colore }}>
      <div className="flex items-center gap-[2mm] px-[3mm] py-[1.2mm] text-white" style={{ background: colore }}>
        {lettera && <span className="w-[6mm] h-[6mm] rounded-full bg-white/25 flex items-center justify-center font-black text-[11pt]">{lettera}</span>}
        <span className="font-extrabold uppercase tracking-[0.08em] text-[9.5pt]">{titolo}</span>
      </div>
      <div className="px-[3mm] py-[1.5mm]">{children}</div>
    </section>
  )
}

export default function ModuloCve() {
  const [chiave, setChiave] = useState(0)
  const [peso, setPeso] = useState('')
  const kg = Number(peso.replace(',', '.'))
  const fmt = (n: number) => n.toLocaleString('it-IT', { maximumFractionDigits: 1 })

  return (
    <div className="flex flex-col gap-3 lg:max-w-4xl lg:mx-auto">
      <BarraModulo nomeFile="checklist-cardioversione.pdf" titolo="Check-list cardioversione elettrica"
        onSvuota={() => { setPeso(''); setChiave((k) => k + 1) }}
        nota="Spunta le voci toccandole. Con il peso compilato, le dosi della sedazione si calcolano da sole." />

      <div className="overflow-x-auto -mx-3.5 px-3.5 lg:mx-0 lg:px-0">
        <div id="modulo-stampa" key={chiave} className="foglio trasf !text-[9.5pt]">
          {/* Intestazione DEA-LIRIO */}
          <div className="flex items-center gap-[3mm] pb-[2.5mm] border-b-[1.5px] border-[#2f6652]">
            <img src="./favicon.svg" alt="" className="w-[13mm] h-[13mm]" />
            <div className="leading-none">
              <p className="text-[7pt] uppercase tracking-[0.18em] font-bold text-[#7b3f4a]">PS Prato</p>
              <p className="text-[17pt] font-black tracking-tight text-[#1f2b26]">DEA-LIRIO</p>
            </div>
            <div className="ml-auto text-right leading-tight">
              <p className="text-[13pt] font-black text-[#2f6652]">Cardioversione elettrica</p>
              <p className="text-[8.5pt] text-[#737b76]">Check-list di sicurezza · da allegare in cartella</p>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_auto] gap-[3mm] items-end mt-[3mm]">
            <p>Paziente <input className="campo w-[80mm]" /></p>
            <p>Peso <input value={peso} onChange={(e) => setPeso(e.target.value)} inputMode="decimal" className="campo w-[12mm] text-center font-bold" /> kg</p>
            <p>Data <input className="campo w-[22mm]" defaultValue={oggi()} /></p>
          </div>
          <p className="mt-[1.5mm]">Ritmo <input className="campo w-[45mm]" placeholder="FA, flutter, TV…" /> &nbsp; Indicazione <input className="campo w-[50mm]" placeholder="elettiva / urgente" /> &nbsp; Ora <input className="campo w-[14mm]" /></p>

          <div className="mt-[3mm] flex flex-col gap-[2.5mm]">
            <Blocco titolo="Prima della procedura" colore="#264f40">
              {PRIMA.map((v) => <Spunta key={v} testo={v} colore="#264f40" />)}
            </Blocco>

            <div className="grid grid-cols-2 gap-[2.5mm]">
              {SEZIONI.map((s) => (
                <Blocco key={s.lettera} lettera={s.lettera} titolo={s.titolo} colore={s.colore}>
                  {s.voci.map((v) => <Spunta key={v} testo={v} colore={s.colore} />)}
                </Blocco>
              ))}
            </div>

            <Blocco titolo="Farmaci" colore="#2d4f73">
              <p className="text-[8.5pt] text-[#737b76] mb-[1mm]">Sedazione: sceglierne uno (± fentanil). Dosi titolate, iniettare lentamente.</p>
              <table className="w-full text-[9pt] border-collapse">
                <tbody>
                  {SEDAZIONE.map((f) => (
                    <tr key={f.nome} className="border-t border-[#d9d7d0] first:border-0">
                      <td className="py-[0.8mm] w-[34mm]"><Spunta testo={f.nome} colore="#2d4f73" /></td>
                      <td className="py-[0.8mm]">{f.dose}{f.nota && <span className="text-[#737b76]"> · {f.nota}</span>}</td>
                      <td className="py-[0.8mm] text-right font-bold whitespace-nowrap w-[30mm]">
                        {kg > 0 ? `${fmt(f.perKg[0] * kg)}–${fmt(f.perKg[1] * kg)} ${f.unita}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="font-bold text-[8.5pt] mt-[1.5mm]">Pronti all’uso</p>
              <div className="flex flex-wrap gap-x-[6mm]">{RISERVA.map((r) => <Spunta key={r} testo={r} colore="#2d4f73" />)}</div>
            </Blocco>

            <Blocco titolo="Durante" colore="#7b3f4a">
              <p className="leading-snug">Prima di <b>ogni</b> scarica: SINC attiva (molti defibrillatori tornano in asincrono dopo la scarica), «Via tutti», O₂ allontanato.</p>
              <div className="grid grid-cols-4 mt-[2mm] text-center text-[8.5pt]">
                {['1ª scarica', '2ª scarica', '3ª scarica', 'Ritmo ottenuto'].map((t, i) => (
                  <div key={t} className={i ? 'border-l border-[#d9d7d0]' : ''}>
                    <p className="text-[#737b76]">{t}</p>
                    <p className="mt-[1mm]"><input className="campo w-[20mm] text-center" />{i < 3 ? ' J' : ''}</p>
                  </div>
                ))}
              </div>
            </Blocco>

            <Blocco titolo="Dopo la procedura" colore="#264f40">
              {DOPO.map((v) => <Spunta key={v} testo={v} colore="#264f40" />)}
            </Blocco>
          </div>

          <div className="flex justify-between items-end mt-[5mm] text-[9pt]">
            <p>Medico <span className="riga w-[55mm]" /></p>
            <p>Infermiere <span className="riga w-[55mm]" /></p>
          </div>
          <p className="text-[7pt] text-[#737b76] mt-[3mm]">DEA-LIRIO · PS Prato · Check-list CVE. Digiuno: ASA, Anesthesiology 2018;128:437–479. Anticoagulazione: ESC 2024 fibrillazione atriale.</p>
        </div>
      </div>
    </div>
  )
}

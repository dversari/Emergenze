import { useState } from 'react'
import BarraModulo from '../components/BarraModulo'

/*
 * «Dimissione contro parere medico» (Allegato I alla IO.DRO.72 rev. 2 del 25/03/2025, ASL Toscana Centro),
 * ridisegnato con campi compilabili. I dati del paziente NON vengono salvati.
 */
const oggi = () => new Date().toLocaleDateString('it-IT')
const ora = () => new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })

function C({ className = '', ...p }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={`campo ${className}`} />
}

export default function ModuloDimissioneContro() {
  const [chiave, setChiave] = useState(0)
  const [gt, setGt] = useState<'' | 'si' | 'no'>('')
  return (
    <div className="flex flex-col gap-3 lg:max-w-4xl lg:mx-auto">
      <BarraModulo nomeFile="dimissione-contro-parere.pdf" titolo="Dimissione contro parere medico" onSvuota={() => { setGt(''); setChiave((k) => k + 1) }}
        nota="Prima di farlo firmare: verificare la capacità di decidere, spiegare i rischi concreti e le alternative, annotare tutto in cartella. Se rifiuta di firmare: annotarlo con un testimone." />
      <div className="overflow-x-auto -mx-3.5 px-3.5 lg:mx-0 lg:px-0">
        <div id="modulo-stampa" key={chiave} className="foglio">
          <div className="flex items-start">
            <img src="./logo-asl-toscana-centro.png" alt="Azienda USL Toscana centro" className="w-[24mm] h-auto" />
            <div className="flex-1 text-center pr-[24mm] mt-[2mm]">
              <p className="font-bold">Rete Ospedaliera · IO.DRO.72</p>
              <p>REGIONE TOSCANA – AZIENDA USL TOSCANA CENTRO</p>
            </div>
          </div>
          <p className="font-bold mt-[4mm]">ALLEGATO I</p>
          <table className="riquadro mt-[2mm]">
            <tbody>
              <tr><td colSpan={2} className="font-bold text-center">DATI CARTELLA CLINICA</td></tr>
              <tr><td className="w-[40mm]">Paziente</td><td><C className="w-full" /></td></tr>
              <tr><td>Nata/o il</td><td><C className="w-[40mm]" placeholder="gg/mm/aaaa" /></td></tr>
              <tr><td>Sesso</td><td><C className="w-[20mm]" /></td></tr>
              <tr><td>Data ingresso</td><td><C className="w-[40mm]" defaultValue={oggi()} /></td></tr>
              <tr><td>Data dimissione</td><td><C className="w-[40mm]" defaultValue={oggi()} /></td></tr>
              <tr><td>Nosologico</td><td><C className="w-full" /></td></tr>
            </tbody>
          </table>
          <p className="text-center font-bold text-[12pt] mt-[8mm]">DIMISSIONE CONTRO PARERE MEDICO</p>
          <div className="mt-[4mm]">
            <p>Motivazioni:</p>
            <textarea rows={4} className="campo w-full resize-none leading-[1.6] mt-[1mm]" />
          </div>
          <p className="mt-[6mm] leading-relaxed">Io sottoscritto/a, informato/a circa i possibili rischi per la salute derivanti dalla dimissione volontaria, decido in piena consapevolezza di lasciare il reparto contro il parere dei sanitari.</p>
          <p className="mt-[10mm]">Firma del/la paziente / tutore / curatore / amm. di sostegno</p>
          <p className="mt-[8mm] border-b border-black w-[90mm]" />
          <p className="mt-[8mm] flex items-center gap-[6mm]">Segnalazione Giudice Tutelare
            <label className="inline-flex items-center gap-[1.5mm] cursor-pointer" onClick={() => setGt(gt === 'si' ? '' : 'si')}><span className={`casella ${gt === 'si' ? 'piena' : ''}`} /> SÌ (allegata)</label>
            <label className="inline-flex items-center gap-[1.5mm] cursor-pointer" onClick={() => setGt(gt === 'no' ? '' : 'no')}><span className={`casella ${gt === 'no' ? 'piena' : ''}`} /> NO</label>
          </p>
          <p className="mt-[8mm] flex items-end gap-2">Data <C className="w-[28mm]" defaultValue={oggi()} /> Ora <C className="w-[16mm]" defaultValue={ora()} /><span className="flex-1 text-right">Firma del Medico</span></p>
          <p className="mt-[8mm] ml-auto border-b border-black w-[70mm]" />
          <p className="flex justify-between text-[8pt] mt-[20mm]"><span>Allegato I IO.DRO.72</span><span>Pag. 1 di 1</span><span>Rev. 2 del 25/03/2025</span></p>
        </div>
      </div>
    </div>
  )
}

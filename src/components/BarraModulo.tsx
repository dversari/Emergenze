import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IOS, condividiPdf, creaPdfModulo } from '../lib/stampaModulo'

/** Barra comune dei moduli: Svuota, Stampa/PDF (su iPhone crea il PDF e apre la condivisione: Stampa, Mail, File). */
export default function BarraModulo({ nomeFile, titolo, onSvuota, extra, nota }: { nomeFile: string; titolo: string; onSvuota: () => void; extra?: React.ReactNode; nota?: React.ReactNode }) {
  const [pdf, setPdf] = useState<File | null>(null)
  const [preparo, setPreparo] = useState(false)
  const stampa = async () => {
    if (!IOS) { window.print(); return }
    setPreparo(true)
    try { setPdf(await creaPdfModulo(nomeFile)) } catch (e) { alert('Non riesco a creare il PDF: ' + (e as Error).message) } finally { setPreparo(false) }
  }
  const pdfCondividi = async () => {
    setPreparo(true)
    try { await condividiPdf(await creaPdfModulo(nomeFile), titolo) } catch (e) { alert('Non riesco a creare il PDF: ' + (e as Error).message) } finally { setPreparo(false) }
  }
  return (
    <>
      {pdf && (
        <div className="no-print fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4" onClick={() => setPdf(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-lg font-extrabold">PDF pronto</div>
            <p className="mt-1 text-sm text-tenue">Tocca «Condividi», poi scegli <b>Stampa</b> (AirPrint), Mail o File.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setPdf(null)} className="flex-1 rounded-full border border-linea-forte py-2.5 font-bold text-tenue">Chiudi</button>
              <button onClick={() => condividiPdf(pdf, titolo)} className="flex-1 rounded-full bg-verde py-2.5 font-extrabold text-white">Condividi</button>
            </div>
          </div>
        </div>
      )}
      <div className="no-print flex flex-wrap items-center gap-2">
        <Link to="/moduli" className="text-sm text-tenue">‹ Moduli</Link>
        <span className="flex-1" />
        {extra}
        <button onClick={() => { if (confirm('Cancellare i dati del paziente dal modulo?')) onSvuota() }} className="rounded-full border border-linea-forte px-4 py-2 text-sm font-bold text-tenue">Svuota</button>
        {!IOS && <button onClick={pdfCondividi} disabled={preparo} className="rounded-full border border-verde px-4 py-2 text-sm font-bold text-verde disabled:opacity-60">PDF</button>}
        <button onClick={stampa} disabled={preparo} className="rounded-full bg-verde text-white px-5 py-2 text-sm font-extrabold disabled:opacity-60">{preparo ? 'Preparo…' : IOS ? '🖨︎ PDF / Stampa' : '🖨︎ Stampa'}</button>
      </div>
      {nota && <p className="no-print text-[12px] text-tenue leading-snug">{nota}</p>}
    </>
  )
}

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import { condividiFileUrl } from '../lib/stampaModulo'
import { riservato, urlRiservato, useSessione } from '../lib/riservati'
import AccessoRiservato from '../components/AccessoRiservato'
import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
const base = import.meta.env.BASE_URL


/**
 * Visore PDF dentro l'app (pdf.js). Aprire il PDF direttamente nell'app installata
 * lascia senza modo di tornare indietro; qui c'è sempre «‹ Indietro» e «Scarica».
 */
export default function VisorePdf() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const file = params.get('f') ?? ''
  const titolo = params.get('t') ?? file.split('/').pop() ?? 'Documento'
  const blob = params.get('b')
  const prot = !blob && riservato(file)
  const sessione = useSessione()
  const [urlProt, setUrlProt] = useState<string | null>(null)
  const url = blob?.startsWith('blob:') ? blob : prot ? (urlProt ?? '') : `${base}${file}`
  const box = useRef<HTMLDivElement>(null)
  const [stato, setStato] = useState<'carico' | 'ok' | 'errore'>('carico')
  const [pagine, setPagine] = useState(0)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!prot || !sessione) return
    let vivo = true
    let u: string | null = null
    urlRiservato(file).then((x) => { u = x; if (vivo) setUrlProt(x); else URL.revokeObjectURL(x) }).catch(() => { if (vivo) setStato('errore') })
    return () => { vivo = false; if (u) URL.revokeObjectURL(u); setUrlProt(null) }
  }, [prot, sessione, file])

  useEffect(() => {
    if (prot && !urlProt) return
    if (!url.startsWith('blob:') && (!file.startsWith('docs/') || file.includes('..'))) { setStato('errore'); return }
    let annullato = false
    const contenitore = box.current
    if (!contenitore) return
    contenitore.innerHTML = ''
    setStato('carico')
    const task = pdfjs.getDocument({ url })
    task.promise.then(async (doc) => {
      if (annullato) return
      setPagine(doc.numPages)
      const larghezza = Math.min(contenitore.clientWidth || 360, 1000) * zoom
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5)
      for (let n = 1; n <= doc.numPages; n++) {
        if (annullato) return
        const pagina = await doc.getPage(n)
        const v0 = pagina.getViewport({ scale: 1 })
        const scala = larghezza / v0.width
        const v = pagina.getViewport({ scale: scala * dpr })
        const canvas = document.createElement('canvas')
        canvas.width = Math.floor(v.width)
        canvas.height = Math.floor(v.height)
        canvas.style.width = `${Math.floor(v.width / dpr)}px`
        canvas.style.height = `${Math.floor(v.height / dpr)}px`
        canvas.className = 'bg-white shadow-[var(--shadow-card)] rounded-md mx-auto max-w-none shrink-0'
        contenitore.appendChild(canvas)
        await pagina.render({ canvasContext: canvas.getContext('2d')!, viewport: v }).promise
        if (n === 1) setStato('ok')
      }
    }).catch(() => { if (!annullato) setStato('errore') })
    return () => { annullato = true; task.destroy() }
  }, [file, url, zoom, prot, urlProt])

  const indietro = () => (window.history.length > 1 ? navigate(-1) : navigate('/documenti'))

  if (prot && sessione === null) return <AccessoRiservato />

  return (
    <div className="flex flex-col gap-3">
      <div className="sticky top-0 z-10 -mx-1 flex items-center gap-2 bg-fondo/95 px-1 py-2 backdrop-blur">
        <button onClick={indietro} className="rounded-full bg-verde px-4 py-2 text-sm font-bold text-white shrink-0">‹ Indietro</button>
        <p className="flex-1 min-w-0 truncate text-sm font-bold">{titolo}</p>
        <div className="flex shrink-0 rounded-full border border-linea overflow-hidden text-sm font-bold">
          <button onClick={() => setZoom((z) => Math.max(1, z - 0.5))} disabled={zoom <= 1} className="px-3 py-2 disabled:opacity-30">−</button>
          <button onClick={() => setZoom((z) => Math.min(3, z + 0.5))} disabled={zoom >= 3} className="px-3 py-2 border-l border-linea disabled:opacity-30">+</button>
        </div>
        <button onClick={() => condividiFileUrl(url, (file.split('/').pop() || titolo.replace(/[^\w.-]+/g, '-')) + (file ? '' : '.pdf'), titolo)} aria-label="Scarica o condividi" className="rounded-full border border-verde px-3 py-2 text-sm font-bold text-verde shrink-0">⬇︎</button>
      </div>
      {stato === 'carico' && <p className="text-sm text-tenue px-1">Apro il documento…</p>}
      {stato === 'errore' && <p className="text-sm text-bordeaux px-1">Non riesco ad aprire il documento. Prova con «Scarica».</p>}
      {stato === 'ok' && pagine > 1 && <p className="text-[11px] text-tenue px-1">{pagine} pagine</p>}
      <div ref={box} className={`flex flex-col gap-3 pb-8 ${zoom > 1 ? 'overflow-x-auto items-start' : ''}`} />
      <p className="text-[11px] text-tenue px-1 -mt-6">⬇︎ apre la condivisione: Salva su File, Stampa, Mail.</p>
    </div>
  )
}

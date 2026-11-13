/** Stampa dei moduli: su iPhone/iPad si crea un PDF da condividere (AirPrint, Mail), altrove window.print(). */
export const IOS = typeof navigator !== 'undefined' && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

export async function creaPdfModulo(nomeFile: string, id = 'modulo-stampa'): Promise<File> {
  const el = document.getElementById(id)!
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
    return new File([doc.output('blob')], nomeFile, { type: 'application/pdf' })
  } finally { el.classList.remove('in-pdf'); ph.forEach(([i, t]) => { i.placeholder = t }) }
}

export async function condividiPdf(pdf: File, titolo: string) {
  try {
    if (navigator.canShare?.({ files: [pdf] })) { await navigator.share({ files: [pdf], title: titolo }); return }
  } catch (e) { if ((e as Error).name === 'AbortError') return }
  const url = URL.createObjectURL(pdf)
  const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.download = pdf.name; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}

/**
 * «Scarica» di un PDF pubblicato: nell'app installata un link diretto apre il PDF a tutto schermo
 * senza modo di tornare indietro. Si scarica il file e si apre il foglio di condivisione (Salva su File, Stampa, Mail).
 */
export async function condividiFileUrl(url: string, nome: string, titolo: string) {
  try {
    const blob = await (await fetch(url)).blob()
    const file = new File([blob], nome, { type: 'application/pdf' })
    if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: titolo }); return }
    const u = URL.createObjectURL(file)
    const a = document.createElement('a'); a.href = u; a.download = nome; document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(u), 60000)
  } catch (e) { if ((e as Error).name !== 'AbortError') alert('Non riesco a scaricare il documento.') }
}

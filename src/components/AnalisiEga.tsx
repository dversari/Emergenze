import { useMemo, useState } from 'react'

/*
 * Analisi EGA: algoritmo in passi (pH → disturbo primario → compenso → anion gap → delta ratio →
 * cause → ossigenazione). Inseriti i dati, resta acceso solo il percorso valido.
 * Formule: Winter (acidosi metabolica), 0,7×HCO₃+21 (alcalosi metabolica), regole 1–3,5 / 2–4 per i respiratori,
 * AG corretto per albumina (+2,5 per ogni g/dL sotto 4), delta ratio (AG−12)/(24−HCO₃).
 */

type Opz = { id: string; titolo: string; sotto?: string }
type Passo = { n: number; titolo: string; opzioni: Opz[]; attivi: string[]; dettaglio?: string; nonApplicabile?: string }

const num = (s?: string) => { if (!s) return null; const v = parseFloat(s.replace(',', '.')); return Number.isFinite(v) ? v : null }
const f1 = (v: number) => v.toFixed(1).replace('.', ',')
const f0 = (v: number) => Math.round(v).toString()

const ESEMPI: { nome: string; v: Record<string, string> }[] = [
  { nome: 'Chetoacidosi', v: { ph: '7.12', co2: '19', hco3: '7', na: '134', cl: '98', alb: '4', latt: '1.8', po2: '98', fio2: '21', eta: '24' } },
  { nome: 'BPCO riacutizzata', v: { ph: '7.28', co2: '72', hco3: '33', na: '140', cl: '96', alb: '3.5', latt: '1.2', po2: '55', fio2: '28', eta: '74' } },
  { nome: 'Vomito', v: { ph: '7.52', co2: '48', hco3: '38', na: '136', cl: '86', alb: '4', latt: '1', po2: '88', fio2: '21', eta: '40' } },
  { nome: 'Sepsi + diarrea', v: { ph: '7.19', co2: '22', hco3: '9', na: '138', cl: '112', alb: '2.5', latt: '4.5', po2: '70', fio2: '40', eta: '68' } },
]

function analizza(v: Record<string, string>) {
  const ph = num(v.ph), co2 = num(v.co2), hco3 = num(v.hco3)
  const na = num(v.na), cl = num(v.cl), alb = num(v.alb), latt = num(v.latt)
  const po2 = num(v.po2), fio2p = num(v.fio2), eta = num(v.eta)
  const passi: Passo[] = []
  const conclusioni: string[] = []
  if (ph === null || co2 === null || hco3 === null) return { passi, conclusioni, pronto: false }

  // 1. pH
  const stato = ph < 7.35 ? 'acid' : ph > 7.45 ? 'alc' : 'norm'
  passi.push({ n: 1, titolo: 'pH', attivi: [stato], opzioni: [
    { id: 'acid', titolo: 'Acidemia', sotto: '< 7,35' }, { id: 'norm', titolo: 'Normale', sotto: '7,35–7,45' }, { id: 'alc', titolo: 'Alcalemia', sotto: '> 7,45' },
  ], dettaglio: `pH ${ph.toFixed(2).replace('.', ',')}` })

  // 2. disturbo primario
  const mAc = hco3 < 22, mAl = hco3 > 26, rAc = co2 > 45, rAl = co2 < 35
  let primari: string[] = []
  if (stato === 'acid') primari = [...(mAc ? ['mac'] : []), ...(rAc ? ['rac'] : [])]
  else if (stato === 'alc') primari = [...(mAl ? ['mal'] : []), ...(rAl ? ['ral'] : [])]
  else {
    if (rAc && mAl) primari = ['rac', 'mal']
    else if (rAl && mAc) primari = ['ral', 'mac']
    else if (rAc || mAl || rAl || mAc) primari = [rAc ? 'rac' : mAl ? 'mal' : rAl ? 'ral' : 'mac']
  }
  const misto = primari.length === 2
  passi.push({ n: 2, titolo: 'Disturbo primario', attivi: primari.length ? primari : ['nessuno'], opzioni: [
    { id: 'mac', titolo: 'Acidosi metabolica', sotto: 'HCO₃⁻ < 22' }, { id: 'rac', titolo: 'Acidosi respiratoria', sotto: 'PaCO₂ > 45' },
    { id: 'mal', titolo: 'Alcalosi metabolica', sotto: 'HCO₃⁻ > 26' }, { id: 'ral', titolo: 'Alcalosi respiratoria', sotto: 'PaCO₂ < 35' },
    { id: 'nessuno', titolo: 'Nessuno evidente', sotto: 'valori nei limiti' },
  ], dettaglio: misto ? `Disturbo misto: PaCO₂ ${f0(co2)} e HCO₃⁻ ${f1(hco3)} spingono il pH nella stessa direzione${stato === 'norm' ? ' o si annullano' : ''}.`
    : `PaCO₂ ${f0(co2)} mmHg · HCO₃⁻ ${f1(hco3)} mmol/L` })
  const nomi: Record<string, string> = { mac: 'acidosi metabolica', rac: 'acidosi respiratoria', mal: 'alcalosi metabolica', ral: 'alcalosi respiratoria' }
  primari.forEach((p) => conclusioni.push(nomi[p][0].toUpperCase() + nomi[p].slice(1) + (misto ? ' (disturbo misto)' : ' primaria')))

  // 3. compenso (solo con un disturbo primario singolo)
  const p0 = primari.length === 1 ? primari[0] : null
  if (p0 === 'mac' || p0 === 'mal') {
    const atteso = p0 === 'mac' ? 1.5 * hco3 + 8 : 0.7 * hco3 + 21
    const r = co2 < atteso - 2 ? 'basso' : co2 > atteso + 2 ? 'alto' : 'ok'
    passi.push({ n: 3, titolo: p0 === 'mac' ? 'Compenso respiratorio (Winter)' : 'Compenso respiratorio', attivi: [r], opzioni: [
      { id: 'basso', titolo: 'PaCO₂ < attesa', sotto: '+ alcalosi respiratoria' }, { id: 'ok', titolo: 'PaCO₂ = attesa', sotto: 'compenso adeguato' }, { id: 'alto', titolo: 'PaCO₂ > attesa', sotto: '+ acidosi respiratoria' },
    ], dettaglio: `PaCO₂ attesa = ${p0 === 'mac' ? '1,5 × HCO₃⁻ + 8' : '0,7 × HCO₃⁻ + 21'} = ${f0(atteso - 2)}–${f0(atteso + 2)} mmHg; misurata ${f0(co2)}` })
    if (r === 'basso') conclusioni.push('+ alcalosi respiratoria associata')
    if (r === 'alto') conclusioni.push(p0 === 'mac' ? '+ acidosi respiratoria associata (fatica? intubare?)' : '+ acidosi respiratoria associata')
  } else if (p0 === 'rac' || p0 === 'ral') {
    const d = Math.abs(co2 - 40) / 10
    const acuto = p0 === 'rac' ? 24 + 1 * d : 24 - 2 * d
    const cronico = p0 === 'rac' ? 24 + 3.5 * d : 24 - 4 * d
    let r: string
    if (p0 === 'rac') r = hco3 < acuto - 2 ? 'mac' : hco3 <= acuto + 2 ? 'acuta' : hco3 < cronico - 2 ? 'mista' : hco3 <= cronico + 2 ? 'cronica' : 'mal'
    else r = hco3 > acuto + 2 ? 'mal' : hco3 >= acuto - 2 ? 'acuta' : hco3 > cronico + 2 ? 'mista' : hco3 >= cronico - 2 ? 'cronica' : 'mac'
    passi.push({ n: 3, titolo: 'Compenso metabolico', attivi: [r], opzioni: [
      { id: 'mac', titolo: 'HCO₃⁻ più basso', sotto: '+ acidosi metabolica' }, { id: 'acuta', titolo: 'Acuta', sotto: p0 === 'rac' ? '+1 ogni 10 mmHg' : '−2 ogni 10 mmHg' },
      { id: 'mista', titolo: 'Acuta su cronica', sotto: 'tra i due' }, { id: 'cronica', titolo: 'Cronica', sotto: p0 === 'rac' ? '+3,5 ogni 10 mmHg' : '−4 ogni 10 mmHg' },
      { id: 'mal', titolo: 'HCO₃⁻ più alto', sotto: '+ alcalosi metabolica' },
    ].sort((a, b) => (p0 === 'ral' ? (['mal', 'acuta', 'mista', 'cronica', 'mac'].indexOf(a.id) - ['mal', 'acuta', 'mista', 'cronica', 'mac'].indexOf(b.id)) : 0)),
    dettaglio: `HCO₃⁻ atteso: acuto ${f1(acuto)}, cronico ${f1(cronico)} mmol/L; misurato ${f1(hco3)}` })
    const t: Record<string, string> = { mac: '+ acidosi metabolica associata', mal: '+ alcalosi metabolica associata', acuta: 'forma acuta', mista: 'acuta su cronica', cronica: 'forma cronica compensata' }
    conclusioni[conclusioni.length - 1] += ` – ${t[r].startsWith('+') ? 'non compensata come atteso' : t[r]}`
    if (t[r].startsWith('+')) conclusioni.push(t[r])
  } else {
    passi.push({ n: 3, titolo: 'Compenso', attivi: [], opzioni: [], nonApplicabile: misto ? 'Disturbo misto: il compenso non si calcola, i due disturbi sono entrambi primari.' : 'Nessun disturbo primario da compensare.' })
  }

  // 4. anion gap
  if (na !== null && cl !== null) {
    const ag = na - cl - hco3
    const agc = alb !== null ? ag + 2.5 * (4 - alb) : ag
    const alto = agc > 14
    passi.push({ n: 4, titolo: 'Anion gap', attivi: [alto ? 'alto' : 'norm'], opzioni: [
      { id: 'norm', titolo: 'Normale', sotto: '12 ± 2' }, { id: 'alto', titolo: 'Aumentato', sotto: '> 14' },
    ], dettaglio: `AG = Na⁺ − (Cl⁻ + HCO₃⁻) = ${f1(ag)}${alb !== null ? `; corretto per albumina ${f1(alb)} g/dL = ${f1(agc)}` : ' (inserisci l’albumina per correggerlo)'}` })
    const iMac = conclusioni.findIndex((c) => c.startsWith('Acidosi metabolica'))
    if (iMac >= 0) conclusioni[iMac] = conclusioni[iMac].replace('Acidosi metabolica', `Acidosi metabolica ad AG ${alto ? 'aumentato' : 'normale'} (${f0(agc)})`)
    if (alto && latt !== null && latt > 2) conclusioni.push(`Componente lattica (lattati ${f1(latt)})`)
    if (alto && !primari.includes('mac') && !conclusioni.some((c) => c.includes('acidosi metabolica'))) conclusioni.push(`Acidosi metabolica ad AG aumentato nascosta (AG ${f0(agc)})`)

    // 5. delta ratio / cause
    if (alto && hco3 < 24) {
      const dr = (agc - 12) / (24 - hco3)
      const r = dr < 0.4 ? 'a' : dr < 0.8 ? 'b' : dr <= 2 ? 'c' : 'd'
      passi.push({ n: 5, titolo: 'Delta ratio', attivi: [r], opzioni: [
        { id: 'a', titolo: '< 0,4', sotto: 'ipercloremica' }, { id: 'b', titolo: '0,4–0,8', sotto: 'AG alto + AG normale' },
        { id: 'c', titolo: '0,8–2', sotto: 'AG alto pura' }, { id: 'd', titolo: '> 2', sotto: '+ alcalosi metabolica' },
      ], dettaglio: `(AG − 12) / (24 − HCO₃⁻) = ${f1(agc - 12)} / ${f1(24 - hco3)} = ${dr.toFixed(2).replace('.', ',')}` })
      if (r === 'b') conclusioni.push('+ acidosi metabolica ipercloremica (AG normale) associata')
      if (r === 'd') conclusioni.push('+ alcalosi metabolica associata (o HCO₃⁻ già alto per compenso cronico)')
      passi.push({ n: 6, titolo: 'Cause di acidosi ad AG aumentato', attivi: latt !== null && latt >= 4 ? ['lat'] : latt !== null && latt > 2 ? ['lat'] : [], opzioni: [
        { id: 'lat', titolo: 'Lattica', sotto: latt !== null ? `lattati ${f1(latt)}` : 'shock, sepsi, ischemia, metformina' },
        { id: 'cheto', titolo: 'Chetoacidosi', sotto: 'diabetica, alcolica, digiuno' }, { id: 'ren', titolo: 'Insuff. renale', sotto: 'urea, creatinina' },
        { id: 'tox', titolo: 'Tossici', sotto: 'metanolo, glicole (gap osmolare), salicilati, paracetamolo (5-oxoprolina)' },
      ], dettaglio: latt !== null && latt > 2 ? `Lattati ${f1(latt)} mmol/L: componente lattica${latt >= 4 ? ' importante' : ''}.` : 'GOLDMARK: glicoli, 5-oxoprolina, L- e D-lattato, metanolo, aspirina, insufficienza renale, chetoni.' })
    } else if (primari.includes('mac') && !alto) {
      passi.push({ n: 5, titolo: 'Acidosi ad AG normale (ipercloremica)', attivi: [], opzioni: [
        { id: 'gi', titolo: 'Perdite intestinali', sotto: 'diarrea, fistole, stomie' }, { id: 'sf', titolo: 'Fisiologica in eccesso', sotto: 'NaCl 0,9% abbondante' },
        { id: 'atr', titolo: 'Acidosi tubulare', sotto: 'AG urinario positivo' }, { id: 'far', titolo: 'Farmaci', sotto: 'acetazolamide, topiramato' },
      ], dettaglio: 'AG urinario (Na⁺ + K⁺ − Cl⁻ urinari): negativo = perdita intestinale; positivo = causa renale.' })
    }
  } else {
    passi.push({ n: 4, titolo: 'Anion gap', attivi: [], opzioni: [], nonApplicabile: 'Inserisci Na⁺ e Cl⁻ (e l’albumina) per l’anion gap: un’acidosi ad AG alto può nascondersi anche con pH normale.' })
  }
  if (primari.includes('mal')) {
    passi.push({ n: passi.length + 1, titolo: 'Alcalosi metabolica: cause', attivi: [], opzioni: [
      { id: 'cr', titolo: 'Cloro-responsiva', sotto: 'Cl⁻ urinario < 20: vomito, SNG, diuretici sospesi' },
      { id: 'cnr', titolo: 'Cloro-resistente', sotto: 'Cl⁻ urinario > 20: diuretici in corso, iperaldosteronismo, ipoK grave' },
    ], dettaglio: 'Correggere volemia, K⁺ e Cl⁻ (fisiologica + KCl).' })
  }

  // ossigenazione
  if (po2 !== null && fio2p !== null && fio2p >= 21) {
    const fio2 = fio2p / 100
    const pf = po2 / fio2
    const pao2 = fio2 * 713 - co2 / 0.8
    const aa = pao2 - po2
    const aaAtt = eta !== null ? eta / 4 + 4 : null
    const r = pf > 300 ? 'ok' : pf > 200 ? 'lieve' : pf > 100 ? 'mod' : 'grave'
    passi.push({ n: passi.length + 1, titolo: 'Ossigenazione', attivi: [r], opzioni: [
      { id: 'ok', titolo: 'P/F > 300', sotto: 'normale' }, { id: 'lieve', titolo: '200–300', sotto: 'lieve' }, { id: 'mod', titolo: '100–200', sotto: 'moderata' }, { id: 'grave', titolo: '≤ 100', sotto: 'grave' },
    ], dettaglio: `P/F = ${f0(pf)} · gradiente A-a = ${f0(aa)} mmHg${aaAtt !== null ? ` (atteso ≤ ${f0(aaAtt)} per l’età)` : ''}${aaAtt !== null ? (aa > aaAtt + 5 ? ' → aumentato: problema V/Q, shunt o diffusione' : ' → normale: ipossiemia da ipoventilazione') : ''}` })
    if (pf <= 300) conclusioni.push(`Ipossiemia (P/F ${f0(pf)})`)
  }
  if (!conclusioni.length) conclusioni.push('EGA senza disturbi acido-base evidenti')
  return { passi, conclusioni, pronto: true }
}

function Gauge({ ph }: { ph: number | null }) {
  const x = ph === null ? null : Math.min(1, Math.max(0, (ph - 6.9) / (7.7 - 6.9)))
  return (
    <div className="relative h-9 mt-1">
      <div className="absolute inset-x-0 top-3 h-3 rounded-full bg-gradient-to-r from-[#7b3f4a] via-[#2f6652] to-[#3d6fb0]" />
      <div className="absolute top-3 h-3 border-x-2 border-white/80" style={{ left: `${((7.35 - 6.9) / 0.8) * 100}%`, width: `${(0.1 / 0.8) * 100}%` }} />
      {x !== null && (
        <div className="absolute top-0 -translate-x-1/2 transition-all duration-500" style={{ left: `${x * 100}%` }}>
          <div className="h-9 w-1.5 rounded-full bg-testo shadow-[0_0_0_3px_rgba(255,255,255,0.9)]" />
        </div>
      )}
      <div className="absolute inset-x-0 -bottom-3 flex justify-between text-[10px] text-tenue font-bold"><span>6,9</span><span>7,35–7,45</span><span>7,7</span></div>
    </div>
  )
}

function PassoVista({ p, ultimo }: { p: Passo; ultimo: boolean }) {
  const acceso = p.attivi.length > 0
  return (
    <div className="relative pl-10">
      {!ultimo && <div className={`absolute left-[15px] top-8 bottom-[-12px] w-[3px] rounded ${acceso ? 'bg-verde' : 'bg-linea'}`} />}
      <div className={`absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full text-sm font-black ${acceso ? 'bg-verde text-white shadow-[0_0_0_4px_rgba(47,102,82,0.18)]' : 'bg-sabbia text-tenue border border-linea'}`}>{p.n}</div>
      <p className="pt-1 text-[13px] font-extrabold uppercase tracking-wide text-tenue">{p.titolo}</p>
      {p.nonApplicabile ? <p className="mt-1 text-[13px] italic text-tenue">{p.nonApplicabile}</p> : (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {p.opzioni.map((o) => {
            const on = p.attivi.includes(o.id)
            return (
              <div key={o.id} className={`rounded-xl border px-2.5 py-1.5 transition-all duration-300 ${on ? 'border-verde bg-verde text-white shadow-md scale-[1.02]' : p.attivi.length ? 'border-linea bg-white/60 text-tenue opacity-35' : 'border-linea bg-white text-testo'}`}>
                <p className="text-[13.5px] font-extrabold leading-tight">{on && '✓ '}{o.titolo}</p>
                {o.sotto && <p className={`text-[11px] leading-tight ${on ? 'text-white/85' : 'text-tenue'}`}>{o.sotto}</p>}
              </div>
            )
          })}
        </div>
      )}
      {p.dettaglio && <p className="mt-1.5 rounded-lg bg-sabbia px-2.5 py-1.5 text-[12.5px] leading-snug">{p.dettaglio}</p>}
    </div>
  )
}

const CAMPI: { id: string; et: string; u: string; ph?: string }[] = [
  { id: 'ph', et: 'pH', u: '', ph: '7,40' }, { id: 'co2', et: 'PaCO₂', u: 'mmHg', ph: '40' }, { id: 'hco3', et: 'HCO₃⁻', u: 'mmol/L', ph: '24' },
  { id: 'na', et: 'Na⁺', u: 'mmol/L', ph: '140' }, { id: 'cl', et: 'Cl⁻', u: 'mmol/L', ph: '104' }, { id: 'alb', et: 'Albumina', u: 'g/dL', ph: '4' },
  { id: 'latt', et: 'Lattati', u: 'mmol/L', ph: '1' }, { id: 'po2', et: 'PaO₂', u: 'mmHg', ph: '90' }, { id: 'fio2', et: 'FiO₂', u: '%', ph: '21' },
  { id: 'eta', et: 'Età', u: 'anni', ph: '60' },
]

export function AnalisiEga({ chiudi }: { chiudi: () => void }) {
  const [v, setV] = useState<Record<string, string>>({})
  const r = useMemo(() => analizza(v), [v])
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-fondo">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-linea bg-[#1f2b26] px-4 pb-3 pt-[calc(12px+env(safe-area-inset-top))] text-white">
        <div className="flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9fd3b5]">Algoritmo</p>
          <p className="text-xl font-black leading-tight">Analisi EGA</p>
        </div>
        <button onClick={() => setV({})} className="rounded-full border border-white/30 px-3 py-1 text-sm font-bold">Azzera</button>
        <button onClick={chiudi} className="rounded-full bg-white px-3 py-1 text-sm font-extrabold text-testo">Chiudi ✕</button>
      </div>
      <div className="mx-auto max-w-5xl p-3.5 lg:grid lg:grid-cols-[340px_1fr] lg:gap-6 lg:p-6">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <section className="card !p-3">
            <div className="grid grid-cols-3 gap-2">
              {CAMPI.map((c) => (
                <label key={c.id} className={`flex flex-col ${['ph', 'co2', 'hco3'].includes(c.id) ? '' : ''}`}>
                  <span className="text-[11px] font-extrabold text-tenue">{c.et} {c.u && <span className="font-semibold">{c.u}</span>}</span>
                  <input inputMode="decimal" value={v[c.id] ?? ''} placeholder={c.ph} onChange={(e) => setV((o) => ({ ...o, [c.id]: e.target.value }))}
                    className={`w-full rounded-lg border px-2 py-1.5 text-base font-bold ${['ph', 'co2', 'hco3'].includes(c.id) ? 'border-verde2 bg-verde3/40' : 'border-linea bg-white'} placeholder:text-linea-forte placeholder:font-semibold`} />
                </label>
              ))}
            </div>
            <Gauge ph={num(v.ph ?? '')} />
            <p className="mt-5 text-[11px] text-tenue">Obbligatori pH, PaCO₂, HCO₃⁻. Gli altri aggiungono anion gap, cause e ossigenazione.</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[11px] font-bold text-tenue self-center">Prova:</span>
              {ESEMPI.map((e) => <button key={e.nome} onClick={() => setV(e.v)} className="rounded-full border border-linea px-2.5 py-0.5 text-[12px] font-bold text-verde">{e.nome}</button>)}
            </div>
          </section>
          {r.pronto && (
            <section className="card mt-3 !p-3 !border-verde border-2">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-verde">Conclusione</p>
              <ul className="mt-1 space-y-1">
                {r.conclusioni.map((c, i) => <li key={i} className={`text-[15px] leading-snug ${i === 0 ? 'font-black' : 'font-bold'}`}>{c}</li>)}
              </ul>
            </section>
          )}
        </div>
        <div className="mt-4 lg:mt-0 flex flex-col gap-5">
          {r.pronto ? r.passi.map((p, i) => <PassoVista key={p.titolo} p={p} ultimo={i === r.passi.length - 1} />) : (
            <div className="card text-center text-tenue">
              <p className="text-4xl">⚗︎</p>
              <p className="mt-1 font-bold">Inserisci pH, PaCO₂ e HCO₃⁻</p>
              <p className="text-sm">oppure prova un esempio: l’algoritmo accende solo il percorso valido.</p>
            </div>
          )}
          <p className="text-[11px] text-tenue">Regole: Winter (PaCO₂ = 1,5 × HCO₃⁻ + 8 ± 2); alcalosi metabolica PaCO₂ = 0,7 × HCO₃⁻ + 21 ± 2; respiratorie acute/croniche +1/+3,5 e −2/−4 mmol/L ogni 10 mmHg; AG normale 12 ± 2 (corretto per albumina); delta ratio di Wrenn. Non sostituisce il giudizio clinico.</p>
        </div>
      </div>
    </div>
  )
}

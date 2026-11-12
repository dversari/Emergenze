import { useMemo, useState } from 'react'

/*
 * Analisi EGA: algoritmo in passi (pH → disturbo primario → compenso → anion gap → delta ratio →
 * cause → ossigenazione). Inseriti i dati, resta acceso solo il percorso valido.
 * Formule: Winter (acidosi metabolica), 0,7×HCO₃+21 (alcalosi metabolica), regole 1–3,5 / 2–4 per i respiratori,
 * AG dall'EGA (o calcolato da Na e Cl), delta ratio (AG−12)/(24−HCO₃).
 */

type Opz = { id: string; titolo: string; sotto?: string }
type Passo = { n: number; titolo: string; opzioni: Opz[]; attivi: string[]; dettaglio?: string; nonApplicabile?: string; mnemonico?: { titolo: string; voci: { l: string; t: string; on?: boolean }[] } }

const num = (s?: string) => { if (!s) return null; const v = parseFloat(s.replace(',', '.')); return Number.isFinite(v) ? v : null }
const f1 = (v: number) => v.toFixed(1).replace('.', ',')
const f0 = (v: number) => Math.round(v).toString()


function analizza(v: Record<string, string>) {
  let ph = num(v.ph), co2 = num(v.co2), hco3 = num(v.hco3)
  const na = num(v.na), cl = num(v.cl), agEga = num(v.ag), conK = v.agk === '1', latt = num(v.latt)
  const po2 = num(v.po2), fio2p = num(v.fio2), eta = num(v.eta)
  const passi: Passo[] = []
  const conclusioni: string[] = []
  const calcolati: string[] = []
  const nBase = [ph, co2, hco3].filter((x) => x !== null).length
  if (nBase === 0) return { passi, conclusioni, pronto: false, calcolati }
  // Con due dei tre valori il terzo si ricava (Henderson-Hasselbalch); con uno solo si dice solo ciò che è certo.
  if (nBase === 2) {
    if (hco3 === null) { hco3 = 0.0307 * co2! * 10 ** (ph! - 6.1); calcolati.push('HCO₃⁻') }
    else if (co2 === null) { co2 = hco3 / (0.0307 * 10 ** (ph! - 6.1)); calcolati.push('PaCO₂') }
    else { ph = 6.1 + Math.log10(hco3 / (0.0307 * co2)); calcolati.push('pH') }
  }
  if (nBase === 1) {
    if (ph !== null) {
      const st = ph < 7.35 ? 'acid' : ph > 7.45 ? 'alc' : 'norm'
      passi.push({ n: 1, titolo: 'pH', attivi: [st], opzioni: [
        { id: 'acid', titolo: 'Acidemia', sotto: '< 7,35' }, { id: 'norm', titolo: 'Normale', sotto: '7,35–7,45' }, { id: 'alc', titolo: 'Alcalemia', sotto: '> 7,45' },
      ], dettaglio: `pH ${ph.toFixed(2).replace('.', ',')}` })
      conclusioni.push(st === 'acid' ? 'Acidemia' : st === 'alc' ? 'Alcalemia' : 'pH normale (non esclude disturbi misti)')
    } else if (co2 !== null) {
      conclusioni.push(co2 > 45 ? `PaCO₂ ${f0(co2)}: ipoventilazione (acidosi respiratoria o compenso di un’alcalosi metabolica)` : co2 < 35 ? `PaCO₂ ${f0(co2)}: iperventilazione (alcalosi respiratoria o compenso di un’acidosi metabolica)` : `PaCO₂ ${f0(co2)} nei limiti`)
    } else if (hco3 !== null) {
      conclusioni.push(hco3 < 22 ? `HCO₃⁻ ${f1(hco3)}: acidosi metabolica o compenso di un’alcalosi respiratoria` : hco3 > 26 ? `HCO₃⁻ ${f1(hco3)}: alcalosi metabolica o compenso di un’acidosi respiratoria` : `HCO₃⁻ ${f1(hco3)} nei limiti`)
    }
    passi.push({ n: passi.length + 1, titolo: 'Disturbo primario e compenso', attivi: [], opzioni: [], nonApplicabile: 'Serve almeno un altro dei tre valori (pH, PaCO₂, HCO₃⁻): con due, il terzo viene calcolato.' })
    return { passi, conclusioni, pronto: true, calcolati }
  }
  ph = ph!; co2 = co2!; hco3 = hco3!

  // 1. pH
  const stato = ph < 7.35 ? 'acid' : ph > 7.45 ? 'alc' : 'norm'
  passi.push({ n: 1, titolo: 'pH', attivi: [stato], opzioni: [
    { id: 'acid', titolo: 'Acidemia', sotto: '< 7,35' }, { id: 'norm', titolo: 'Normale', sotto: '7,35–7,45' }, { id: 'alc', titolo: 'Alcalemia', sotto: '> 7,45' },
  ], dettaglio: `pH ${ph.toFixed(2).replace('.', ',')}${calcolati.length ? ` · ${calcolati[0]} calcolato con Henderson-Hasselbalch (verificare sul referto)` : ''}` })

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

  // 4. anion gap: dall'EGA (con o senza K⁺) oppure calcolato da Na⁺ e Cl⁻
  if (agEga !== null || (na !== null && cl !== null)) {
    const base = agEga !== null && conK ? 16 : 12
    const agc = agEga ?? (na! - cl! - hco3)
    const alto = agc > base + 2
    passi.push({ n: 4, titolo: 'Anion gap', attivi: [alto ? 'alto' : 'norm'], opzioni: [
      { id: 'norm', titolo: 'Normale', sotto: `${base} ± 2` }, { id: 'alto', titolo: 'Aumentato', sotto: `> ${base + 2}` },
    ], dettaglio: (agEga !== null ? `AG dall’EGA ${f1(agc)}${conK ? ' (con K⁺: normale ~16)' : ''}` : `AG = Na⁺ − (Cl⁻ + HCO₃⁻) = ${f1(agc)}`) + '. Con albumina bassa l’AG reale è più alto (+2,5 per ogni g/dL sotto 4).' })
    const iMac = conclusioni.findIndex((c) => c.startsWith('Acidosi metabolica'))
    if (iMac >= 0) conclusioni[iMac] = conclusioni[iMac].replace(/^Acidosi metabolica( primaria| \(disturbo misto\))?/, (m) => `${m} ad AG ${alto ? 'aumentato' : 'normale'} (${f0(agc)})`)
    if (alto && latt !== null && latt > 2) conclusioni.push(`Componente lattica (lattati ${f1(latt)})`)
    if (alto && !primari.includes('mac') && !conclusioni.some((c) => c.includes('acidosi metabolica'))) conclusioni.push(`Acidosi metabolica ad AG aumentato nascosta (AG ${f0(agc)})`)

    // 5. delta ratio / cause
    if (alto && hco3 < 24) {
      const dr = (agc - base) / (24 - hco3)
      const r = dr < 0.4 ? 'a' : dr < 0.8 ? 'b' : dr <= 2 ? 'c' : 'd'
      passi.push({ n: 5, titolo: 'Delta ratio', attivi: [r], opzioni: [
        { id: 'a', titolo: '< 0,4', sotto: 'ipercloremica' }, { id: 'b', titolo: '0,4–0,8', sotto: 'AG alto + AG normale' },
        { id: 'c', titolo: '0,8–2', sotto: 'AG alto pura' }, { id: 'd', titolo: '> 2', sotto: '+ alcalosi metabolica' },
      ], dettaglio: `(AG − ${base}) / (24 − HCO₃⁻) = ${f1(agc - base)} / ${f1(24 - hco3)} = ${dr.toFixed(2).replace('.', ',')}` })
      if (r === 'b') conclusioni.push('+ acidosi metabolica ipercloremica (AG normale) associata')
      if (r === 'd') conclusioni.push('+ alcalosi metabolica associata (o HCO₃⁻ già alto per compenso cronico)')
      passi.push({ n: 6, titolo: 'Cause di acidosi ad AG aumentato', attivi: latt !== null && latt >= 4 ? ['lat'] : latt !== null && latt > 2 ? ['lat'] : [], opzioni: [
        { id: 'lat', titolo: 'Lattica', sotto: latt !== null ? `lattati ${f1(latt)}` : 'shock, sepsi, ischemia, metformina' },
        { id: 'cheto', titolo: 'Chetoacidosi', sotto: 'diabetica, alcolica, digiuno' }, { id: 'ren', titolo: 'Insuff. renale', sotto: 'urea, creatinina' },
        { id: 'tox', titolo: 'Tossici', sotto: 'metanolo, glicole (gap osmolare), salicilati, paracetamolo (5-oxoprolina)' },
      ], dettaglio: latt !== null && latt > 2 ? `Lattati ${f1(latt)} mmol/L: componente lattica${latt >= 4 ? ' importante' : ''}.` : `${latt === null ? 'Lattati non inseriti: dosarli. ' : ''}Gap osmolare se sospetto metanolo o glicole.`,
      mnemonico: { titolo: 'CAT MUDPILES', voci: [
        { l: 'C', t: 'CO (monossido), cianuro' }, { l: 'A', t: 'Alcolica (chetoacidosi)' }, { l: 'T', t: 'Toluene' },
        { l: 'M', t: 'Metanolo, metformina' }, { l: 'U', t: 'Uremia (insufficienza renale)' }, { l: 'D', t: 'Diabetica (chetoacidosi)' },
        { l: 'P', t: 'Paracetamolo (5-oxoprolina), propilenglicole' }, { l: 'I', t: 'Isoniazide, ferro (iron)' },
        { l: 'L', t: 'Lattica (shock, sepsi, ischemia)', on: latt !== null && latt > 2 }, { l: 'E', t: 'Etilenglicole' }, { l: 'S', t: 'Salicilati' },
      ] } })
    } else if (primari.includes('mac') && !alto) {
      passi.push({ n: 5, titolo: 'Acidosi ad AG normale (ipercloremica)', attivi: [], opzioni: [
        { id: 'gi', titolo: 'Perdite intestinali', sotto: 'diarrea, fistole, stomie' }, { id: 'sf', titolo: 'Fisiologica in eccesso', sotto: 'NaCl 0,9% abbondante' },
        { id: 'atr', titolo: 'Acidosi tubulare', sotto: 'AG urinario positivo' }, { id: 'far', titolo: 'Farmaci', sotto: 'acetazolamide, topiramato' },
      ], dettaglio: 'AG urinario (Na⁺ + K⁺ − Cl⁻ urinari): negativo = perdita intestinale; positivo = causa renale.' })
    }
  } else {
    if (primari.includes('mac')) conclusioni.push('Anion gap non valutabile (mancano AG o Na⁺/Cl⁻)')
    passi.push({ n: 4, titolo: 'Anion gap', attivi: [], opzioni: [], nonApplicabile: 'Inserisci l’anion gap dell’EGA (o Na⁺ e Cl⁻) per l’anion gap: un’acidosi ad AG alto può nascondersi anche con pH normale.' })
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
    ], dettaglio: `P/F = ${f0(pf)} · gradiente A-a = ${f0(aa)} mmHg${aaAtt !== null ? ` (atteso ≤ ${f0(aaAtt)} per l’età)${aa > aaAtt + 5 ? ' → aumentato: problema V/Q, shunt o diffusione' : ' → normale: se ipossiemico, da ipoventilazione'}` : ' (per il valore atteso serve l’età)'}` })
    if (pf <= 300) conclusioni.push(`Ipossiemia (P/F ${f0(pf)})`)
  } else if (po2 !== null) {
    passi.push({ n: passi.length + 1, titolo: 'Ossigenazione', attivi: [], opzioni: [], nonApplicabile: `PaO₂ ${f0(po2)} mmHg${po2 < 60 ? ': ipossiemia' : ''}. Senza FiO₂ non si calcolano P/F né gradiente A-a.` })
    if (po2 < 60) conclusioni.push(`Ipossiemia (PaO₂ ${f0(po2)}, FiO₂ non nota)`)
  } else {
    passi.push({ n: passi.length + 1, titolo: 'Ossigenazione', attivi: [], opzioni: [], nonApplicabile: 'Non valutata: servono PaO₂ e FiO₂ (e l’età per il gradiente A-a atteso).' })
  }
  if (!conclusioni.length) conclusioni.push('Nessun disturbo acido-base evidente')
  return { passi, conclusioni, pronto: true, calcolati, val: { ph, co2, hco3 } }
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
      {p.mnemonico && (
        <div className="mt-2 rounded-xl border border-linea bg-white p-2">
          <p className="mb-1 text-[12px] font-black tracking-[0.25em] text-bordeaux">{p.mnemonico.titolo}</p>
          <div className="grid gap-x-3 gap-y-0.5 sm:grid-cols-2">
            {p.mnemonico.voci.map((x, i) => (
              <p key={i} className={`flex items-baseline gap-2 rounded px-1 text-[12.5px] ${x.on ? 'bg-verde text-white font-bold' : ''}`}>
                <span className={`w-4 text-center text-[15px] font-black ${x.on ? '' : 'text-bordeaux'}`}>{x.l}</span>{x.t}
              </p>
            ))}
          </div>
        </div>
      )}
      {p.dettaglio && <p className="mt-1.5 rounded-lg bg-sabbia px-2.5 py-1.5 text-[12.5px] leading-snug">{p.dettaglio}</p>}
    </div>
  )
}

const CAMPI: { id: string; et: string; u: string }[] = [
  { id: 'ph', et: 'pH', u: '' }, { id: 'co2', et: 'PaCO₂', u: 'mmHg' }, { id: 'hco3', et: 'HCO₃⁻', u: 'mmol/L' },
  { id: 'na', et: 'Na⁺', u: 'mmol/L' }, { id: 'cl', et: 'Cl⁻', u: 'mmol/L' }, { id: 'ag', et: 'Anion gap', u: 'EGA' },
  { id: 'latt', et: 'Lattati', u: 'mmol/L' }, { id: 'po2', et: 'PaO₂', u: 'mmHg' }, { id: 'fio2', et: 'FiO₂', u: '%' },
  { id: 'eta', et: 'Età', u: 'anni' },
]


const CAUSE: Record<string, { titolo: string; tono: string; voci: string[] }> = {
  rac: { titolo: 'Acidosi respiratoria', tono: 'bg-[#f6e3e3] border-[#e2bcbc] text-[#6e2f2f]', voci: [
    'Depressione del respiro: oppioidi, benzodiazepine, alcol, lesioni del tronco', 'BPCO, asma grave, edema polmonare avanzato',
    'Neuromuscolari: Guillain-Barré, miastenia, SLA', 'Parete: obesità-ipoventilazione, cifoscoliosi, volet costale', 'O₂ eccessivo nel BPCO; NIV/ventilazione insufficiente'] },
  ral: { titolo: 'Alcalosi respiratoria', tono: 'bg-[#e2ecf6] border-[#bcd0e4] text-[#2d4f73]', voci: [
    'Dolore, ansia, iperventilazione', 'Ipossiemia: embolia polmonare, polmonite, edema', 'Sepsi iniziale, febbre', 'Salicilati (fase precoce), gravidanza, cirrosi',
    'Lesioni del SNC; ventilazione meccanica eccessiva'] },
  'mac-alto': { titolo: 'Acidosi metabolica ad AG aumentato', tono: 'bg-[#f3dede] border-[#dcb0b0] text-[#6b2430]', voci: [
    'Lattica: shock, sepsi, ischemia mesenterica, convulsioni, metformina', 'Chetoacidosi diabetica, alcolica, da digiuno', 'Insufficienza renale',
    'Tossici: metanolo, glicole etilenico, salicilati, paracetamolo (5-oxoprolina), ferro, isoniazide'] },
  'mac-norm': { titolo: 'Acidosi metabolica ad AG normale', tono: 'bg-[#f7e8dc] border-[#e6c8ae] text-[#74421f]', voci: [
    'Diarrea, fistole, stomie ad alta portata', 'Fisiologica in eccesso (acidosi ipercloremica)', 'Acidosi tubulare renale',
    'Acetazolamide, topiramato; ureterosigmoidostomia', 'Fase di risoluzione della chetoacidosi'] },
  mac: { titolo: 'Acidosi metabolica (AG non noto)', tono: 'bg-[#f3dede] border-[#dcb0b0] text-[#6b2430]', voci: [
    'AG alto: lattica, chetoacidosi, uremia, tossici', 'AG normale: diarrea, fisiologica in eccesso, acidosi tubulare', 'Calcolare l’AG per distinguere'] },
  mal: { titolo: 'Alcalosi metabolica', tono: 'bg-[#e3eef0] border-[#b9d3d8] text-[#285860]', voci: [
    'Vomito, sondino naso-gastrico in aspirazione', 'Diuretici (tiazidici, dell’ansa)', 'Ipokaliemia; iperaldosteronismo, Cushing',
    'Post-ipercapnia (dopo NIV/ventilazione di un BPCO)', 'Bicarbonato o alcali in eccesso; trasfusioni massive (citrato)'] },
  ipox: { titolo: 'Ipossiemia', tono: 'bg-[#ecebe6] border-[#d3d1c8] text-[#45463f]', voci: [
    'Alterato V/Q: BPCO, asma, embolia polmonare, polmonite', 'Shunt: ARDS, atelettasia, edema polmonare, shunt cardiaco (non risponde all’O₂)',
    'Ipoventilazione: gradiente A-a normale, PaCO₂ alta', 'Difetto di diffusione: interstiziopatie', 'FiO₂ bassa (altitudine)'] },
}

function trovati(conclusioni: string[]) {
  const t = new Set<string>()
  for (const c of conclusioni) {
    const l = c.toLowerCase()
    if (l.includes('acidosi respiratoria')) t.add('rac')
    if (l.includes('alcalosi respiratoria')) t.add('ral')
    if (l.includes('alcalosi metabolica')) t.add('mal')
    if (l.includes('acidosi metabolica')) t.add(l.includes('ag aumentato') ? 'mac-alto' : l.includes('ipercloremica') || l.includes('ag normale') ? 'mac-norm' : 'mac')
    if (l.includes('ipossiemia')) t.add('ipox')
  }
  if (t.has('mac') && (t.has('mac-alto') || t.has('mac-norm'))) t.delete('mac')
  return [...t]
}

function referto(v: Record<string, string>, r: ReturnType<typeof analizza>) {
  const val = 'val' in r ? r.val : undefined
  const c = (k: string) => r.calcolati.includes(k) ? ' (calcolato)' : ''
  const ph = val?.ph ?? num(v.ph), co2 = val?.co2 ?? num(v.co2), hco3 = val?.hco3 ?? num(v.hco3)
  const fio2 = num(v.fio2)
  const p: string[] = []
  if (ph !== null) p.push(`pH ${ph.toFixed(2).replace('.', ',')}${c('pH')}`)
  if (co2 !== null) p.push(`PaCO₂ ${f0(co2)} mmHg${c('PaCO₂')}`)
  if (hco3 !== null) p.push(`HCO₃⁻ ${f1(hco3)} mmol/L${c('HCO₃⁻')}`)
  if (num(v.po2) !== null) p.push(`PaO₂ ${f0(num(v.po2)!)} mmHg`)
  if (num(v.po2) !== null && fio2 !== null) p.push(`P/F ${f0(num(v.po2)! / (fio2 / 100))}`)
  if (num(v.ag) !== null) p.push(`AG ${f1(num(v.ag)!)}${v.agk === '1' ? ' (con K⁺)' : ''}`)
  else if (num(v.na) !== null && num(v.cl) !== null && hco3 !== null) p.push(`Na⁺ ${f0(num(v.na)!)}, Cl⁻ ${f0(num(v.cl)!)}, AG ${f1(num(v.na)! - num(v.cl)! - hco3)}`)
  if (num(v.latt) !== null) p.push(`lattati ${f1(num(v.latt)!)} mmol/L`)
  const aria = fio2 === null ? '' : fio2 <= 21 ? ' in aria ambiente' : ` in O₂ (FiO₂ ${f0(fio2)}%)`
  return `EGA arterioso${aria}: ${p.join(', ')}.\nConclusione: ${r.conclusioni.map((x, i) => (i ? x.replace(/^\+ /, '') : x)).join('; ')}.`
}

export function AnalisiEga({ chiudi }: { chiudi: () => void }) {
  const [v, setV] = useState<Record<string, string>>({})
  const r = useMemo(() => analizza(v), [v])
  const [copiato, setCopiato] = useState(false)
  const testo = r.pronto ? referto(v, r) : ''
  const copia = async () => { try { await navigator.clipboard.writeText(testo); setCopiato(true); setTimeout(() => setCopiato(false), 1500) } catch { /* niente */ } }
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
                  <input inputMode="decimal" value={v[c.id] ?? ''} onChange={(e) => setV((o) => ({ ...o, [c.id]: e.target.value }))}
                    className={`w-full rounded-lg border px-2 py-1.5 text-base font-bold ${['ph', 'co2', 'hco3'].includes(c.id) ? 'border-verde2 bg-verde3/40' : 'border-linea bg-white'} placeholder:text-linea-forte placeholder:font-semibold`} />
                </label>
              ))}
            </div>
            <label className="mt-2 flex items-center gap-2 text-[12px] text-tenue">
              <input type="checkbox" checked={v.agk === '1'} onChange={(e) => setV((o) => ({ ...o, agk: e.target.checked ? '1' : '' }))} />
              l’anion gap dell’EGA include il K⁺ (Na⁺ + K⁺ − Cl⁻ − HCO₃⁻)
            </label>
            <Gauge ph={num(v.ph ?? '')} />
            <p className="mt-5 text-[11px] text-tenue">Bastano due tra pH, PaCO₂ e HCO₃⁻ (il terzo si calcola). I campi vuoti non vengono mai considerati normali: l’algoritmo dice solo ciò che si può concludere.</p>
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
              <p className="text-sm">(bastano due): l’algoritmo accende solo il percorso valido.</p>
            </div>
          )}
          {r.pronto && (
            <section className="card !p-3">
              <div className="flex items-center gap-2">
                <p className="flex-1 text-[11px] font-extrabold uppercase tracking-wide text-verde">Lettura da copiare in cartella</p>
                <button onClick={copia} className="rounded-full bg-verde px-3 py-1 text-sm font-extrabold text-white">{copiato ? 'Copiato ✓' : 'Copia'}</button>
              </div>
              <p className="mt-2 whitespace-pre-wrap rounded-lg bg-sabbia px-3 py-2 text-[13.5px] leading-snug select-all">{testo}</p>
            </section>
          )}
          {'val' in r && r.val && trovati(r.conclusioni).length > 0 && (
            <section>
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-tenue">Possibili cause</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {trovati(r.conclusioni).map((k) => (
                  <div key={k} className={`rounded-xl border p-2.5 ${CAUSE[k].tono}`}>
                    <p className="text-[13px] font-black">{CAUSE[k].titolo}</p>
                    <ul className="mt-1 space-y-0.5 text-[12px] leading-snug">{CAUSE[k].voci.map((v) => <li key={v}>· {v}</li>)}</ul>
                  </div>
                ))}
              </div>
            </section>
          )}
          <p className="text-[11px] text-tenue">Regole: Winter (PaCO₂ = 1,5 × HCO₃⁻ + 8 ± 2); alcalosi metabolica PaCO₂ = 0,7 × HCO₃⁻ + 21 ± 2; respiratorie acute/croniche +1/+3,5 e −2/−4 mmol/L ogni 10 mmHg; AG normale 12 ± 2 (16 ± 2 se calcolato con il K⁺); delta ratio di Wrenn. Non sostituisce il giudizio clinico.</p>
        </div>
      </div>
    </div>
  )
}

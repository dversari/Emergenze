/*
 * Turni del PS: tipi, lettura delle celle del prospetto, applicazione dei cambi e riga di comando dei cambi.
 * Ogni cella: sigle separate da spazio; «*» = produttività aggiuntiva (grassetto nel PDF), «~» = TVR (corsivo).
 * Postazioni per posizione — mattina: F1 F2 A A B B L L L; pomeriggio: TVR (se la prima è in corsivo) poi come la mattina.
 */
export type Giorno = { g: number; m: string; p: string; n: string; nn: string; rm: string; rp: string; rn: string }
export type Turno = keyof Omit<Giorno, 'g'>
/* Cambio turno: nel giorno g, turno t, la sigla in posizione i (da) è sostituita da «a» */
export type Cambio = { g: number; t: Turno; i: number; da: string; a: string; app?: boolean }
/* Riga del registro dei cambi segnati nell'app (tabella emergenze_cambi) */
export type Voce = Cambio & {
  id: number; gruppo: string; mese: string; pos?: string | null; autore: string | null; creato_il: string; annullato_il: string | null; annullato_autore: string | null
}
export type Mese = { mese: string; dati: { mese: string; giorni: Giorno[]; cambi?: Cambio[] }; registro?: Voce[] }
export type Sigla = { s: string; agg: boolean; tvr: boolean; p?: string; barrato?: boolean; sub?: boolean; app?: boolean }

export const TURNI: Turno[] = ['m', 'p', 'n', 'nn', 'rm', 'rp', 'rn']
const POS = ['F1', 'F2', 'A', 'A', 'B', 'B', 'L', 'L', 'L']
export const spezza = (t: string): Sigla[] => t.split(' ').filter(Boolean).map((x) => ({ s: x.replace(/[*~]/g, ''), agg: x.includes('*'), tvr: x.includes('~') }))
export const conPos = (t: string): Sigla[] => {
  const v = spezza(t)
  const pos = v[0]?.tvr ? ['TVR', ...POS] : POS
  return v.map((x, i) => ({ ...x, p: pos[i] ?? '' }))
}
/* Applica i cambi in ordine: l'originale resta barrato, chi subentra va in fondo alla riga con la stessa postazione.
 * Un cambio può riguardare anche chi era già subentrato (cambi a catena). */
export const conCambi = (v: Sigla[], cambi: Cambio[]): Sigla[] => {
  const out = v.map((x) => ({ ...x }))
  for (const c of cambi) {
    const j = out[c.i]?.s === c.da && !out[c.i].barrato ? c.i : out.findIndex((x) => x.s === c.da && !x.barrato)
    if (j < 0) continue
    out[j].barrato = true
    out.push({ s: c.a, agg: false, tvr: false, p: out[j].p, sub: true, app: c.app })
  }
  return out
}
/* Tutti i cambi validi di un mese: prima quelli del prospetto/inseriti da Daniele, poi quelli segnati nell'app */
export const cambiDel = (m: Mese): Cambio[] => [
  ...(m.dati.cambi ?? []),
  ...(m.registro ?? []).filter((v) => !v.annullato_il).map((v) => ({ g: v.g, t: v.t, i: v.i, da: v.da, a: v.a, app: true })),
]
/* Sigle di un turno di un giorno, con i cambi applicati */
export const cella = (m: Mese, g: number, t: Turno, cambi = cambiDel(m)): Sigla[] => {
  const giorno = m.dati.giorni.find((x) => x.g === g)
  if (!giorno) return []
  const base = t === 'm' || t === 'p' ? conPos(giorno[t]) : spezza(giorno[t])
  return conCambi(base, cambi.filter((c) => c.g === g && c.t === t))
}

export const GIORNI = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab']
export const NOME_TURNO: Record<Turno, string> = { m: 'Mattina', p: 'Pomeriggio', n: 'Notte', nn: 'Nottina', rm: 'Rep. mattina', rp: 'Rep. pomeriggio', rn: 'Rep. notte' }
export const etichetta = (t: Turno, p?: string) => (p && (t === 'm' || t === 'p') ? `${NOME_TURNO[t]} ${p}` : NOME_TURNO[t])
export const dataBreve = (mese: string, g: number) => {
  const [a, mm] = mese.split('-').map(Number)
  return `${GIORNI[new Date(a, mm - 1, g).getDay()]} ${g}/${mm}`
}

/* ---------- Riga di comando dei cambi ----------
 * Cessione:              12/12 VR > BN        (anche «12 VR a BN», «->», «→»)
 * Scambio stesso giorno: 12/12 VR <> BN       (anche «con», «x», «<->», «⇄»)
 * Scambio due giorni:    12/12 VR <> BN 15/12
 * Facoltativo il turno dopo la data: 12 P VR > BN (M, P, N, NN, RM, RP, RN).
 * Date: 12 (mese visualizzato), 12/12, 12/12/26, oggi, domani, lun…dom (il prossimo).
 */
export type Nuovo = { mese: string; g: number; t: Turno; i: number; da: string; a: string; pos: string | null; descr: string }
export type Esito =
  | { tipo: 'vuoto' }
  | { tipo: 'errore'; msg: string }
  | { tipo: 'scegli'; lato: 1 | 2; sigla: string; data: string; opzioni: { t: Turno; descr: string }[] }
  | { tipo: 'ok'; cambi: Nuovo[]; avvisi: string[] }

const TOK_TURNO: Record<string, Turno> = {
  M: 'm', MAT: 'm', MATT: 'm', MATTINA: 'm', P: 'p', POM: 'p', POMERIGGIO: 'p', N: 'n', NOTTE: 'n', NN: 'nn', NOTTINA: 'nn',
  RM: 'rm', RP: 'rp', RN: 'rn',
}
const SETTIMANA = ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB']
const chiave = (a: number, m: number) => `${a}-${String(m).padStart(2, '0')}`

type Data = { mese: string; g: number }
function leggiData(tok: string, visto: string, mesi: Mese[], oggi: Date): Data | null | 'assente' {
  const esiste = (d: Data) => mesi.some((m) => m.mese === d.mese && m.dati.giorni.some((x) => x.g === d.g))
  const daDate = (d: Date): Data => ({ mese: chiave(d.getFullYear(), d.getMonth() + 1), g: d.getDate() })
  let r: RegExpMatchArray | null
  if ((r = tok.match(/^(\d{1,2})$/))) return { mese: visto, g: +r[1] }
  if ((r = tok.match(/^(\d{1,2})[/.-](\d{1,2})(?:[/.-](\d{2}|\d{4}))?$/))) {
    const g = +r[1], m = +r[2]
    if (m < 1 || m > 12) return null
    if (r[3]) return { mese: chiave(r[3].length === 2 ? 2000 + +r[3] : +r[3], m), g }
    // anno sottinteso: quello in cui esiste un prospetto per quel mese, preferendo il più vicino a oggi
    const cand = [oggi.getFullYear() - 1, oggi.getFullYear(), oggi.getFullYear() + 1].map((a) => ({ mese: chiave(a, m), g }))
    return cand.filter(esiste).sort((x, y) => Math.abs(+new Date(x.mese) - +oggi) - Math.abs(+new Date(y.mese) - +oggi))[0] ?? cand[1]
  }
  if (tok === 'OGGI') return daDate(oggi)
  if (tok === 'DOMANI') return daDate(new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate() + 1))
  const w = SETTIMANA.indexOf(tok.slice(0, 3))
  if (w >= 0 && /^[A-Z]+$/.test(tok) && tok.length >= 3 && 'LUNEDIMARTEDIMERCOLEDIGIOVEDIVENERDISABATODOMENICA'.includes(tok)) {
    const d = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate())
    while (d.getDay() !== w) d.setDate(d.getDate() + 1)
    return daDate(d)
  }
  return 'assente'
}

/* In quali turni compare una sigla quel giorno (cambi compresi) */
function turniDi(m: Mese, g: number, s: string, cambi: Cambio[]) {
  const out: { t: Turno; i: number; p?: string }[] = []
  for (const t of TURNI) {
    const v = cella(m, g, t, cambi)
    const i = v.findIndex((x) => x.s === s && !x.barrato)
    if (i >= 0) out.push({ t, i, p: v[i].p })
  }
  return out
}

export function interpreta(testo: string, ctx: { mesi: Mese[]; visto: string; oggi?: Date; sigleNote?: Set<string>; scelte?: { 1?: Turno; 2?: Turno } }): Esito {
  const oggi = ctx.oggi ?? new Date()
  const norm = testo.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()
    .replace(/<\s*=?-?\s*>|⇄|⇆|↔/g, ' § ')
    .replace(/-\s*>|→|=>|>/g, ' > ')
    .replace(/[,;:]/g, ' ')
    .trim()
  if (!norm) return { tipo: 'vuoto' }
  const tok = norm.split(/\s+/).map((x) => (x === 'CON' || x === 'X' || x === '§' ? '<>' : x === 'A' ? '>' : x))
  const op = tok.findIndex((x) => x === '>' || x === '<>')
  if (op < 0) return { tipo: 'errore', msg: 'Manca «>» (cessione) o «<>» (scambio). Es.: 12/12 VR > BN' }
  if (tok.filter((x) => x === '>' || x === '<>').length > 1) return { tipo: 'errore', msg: 'Un solo cambio per riga' }
  const scambio = tok[op] === '<>'
  const sx = tok.slice(0, op), dx = tok.slice(op + 1)

  // Lato sinistro: DATA [TURNO] SIGLA
  if (sx.length < 2 || sx.length > 3) return { tipo: 'errore', msg: 'Scrivi data e sigla prima del simbolo. Es.: 12/12 VR > BN' }
  const d1 = leggiData(sx[0], ctx.visto, ctx.mesi, oggi)
  if (d1 === 'assente') return { tipo: 'errore', msg: `«${sx[0]}» non è una data. Usa 12, 12/12, oggi, domani o il giorno (sab)` }
  if (!d1) return { tipo: 'errore', msg: `Data «${sx[0]}» non valida` }
  let t1: Turno | undefined = ctx.scelte?.[1]
  if (sx.length === 3) {
    t1 = TOK_TURNO[sx[1]]
    if (!t1) return { tipo: 'errore', msg: `«${sx[1]}» non è un turno: M, P, N, NN, RM, RP, RN` }
  }
  const da = sx[sx.length - 1]
  // Lato destro: SIGLA [DATA2] [TURNO2]
  if (dx.length < 1 || dx.length > 3) return { tipo: 'errore', msg: 'Dopo il simbolo scrivi la sigla del collega' }
  const a = dx[0]
  for (const s of [da, a]) if (!/^[A-Z]{2,3}$/.test(s)) return { tipo: 'errore', msg: `«${s}» non è una sigla (2 lettere, es. VR)` }
  if (da === a) return { tipo: 'errore', msg: 'Le due sigle sono uguali' }
  let d2: Data | null = null
  let t2: Turno | undefined = ctx.scelte?.[2]
  for (const x of dx.slice(1)) {
    const d = leggiData(x, ctx.visto, ctx.mesi, oggi)
    if (d !== 'assente' && !d2) { if (!d) return { tipo: 'errore', msg: `Data «${x}» non valida` }; d2 = d; continue }
    if (TOK_TURNO[x]) { t2 = TOK_TURNO[x]; continue }
    return { tipo: 'errore', msg: `Non capisco «${x}»` }
  }
  if (!scambio && dx.length > 1) return { tipo: 'errore', msg: 'Nella cessione dopo la sigla non va altro. Per uno scambio usa «<>»' }

  const trova = (d: Data) => {
    const m = ctx.mesi.find((x) => x.mese === d.mese)
    return m && m.dati.giorni.some((x) => x.g === d.g) ? m : undefined
  }
  const m1 = trova(d1)
  if (!m1) return { tipo: 'errore', msg: `Nessun prospetto per il ${d1.g}/${+d1.mese.slice(5)}` }
  const c1 = cambiDel(m1)
  const scegliTurno = (m: Mese, d: Data, s: string, t: Turno | undefined, lato: 1 | 2, cambi: Cambio[]) => {
    const tutti = turniDi(m, d.g, s, cambi)
    const v = t ? tutti.filter((x) => x.t === t) : tutti
    if (!v.length) return { err: t ? `${s} non risulta in ${NOME_TURNO[t].toLowerCase()} ${dataBreve(d.mese, d.g)}` : `${s} non risulta in turno ${dataBreve(d.mese, d.g)}` }
    if (v.length > 1) return { scegli: { tipo: 'scegli' as const, lato, sigla: s, data: dataBreve(d.mese, d.g), opzioni: v.map((x) => ({ t: x.t, descr: etichetta(x.t, x.p) })) } }
    return { x: v[0] }
  }
  const avvisi: string[] = []
  const note = ctx.sigleNote
  if (note && !note.has(a)) avvisi.push(`${a} non compare nei turni caricati: controlla la sigla`)
  if (note && !note.has(da)) avvisi.push(`${da} non compare nei turni caricati`)

  const r1 = scegliTurno(m1, d1, da, t1, 1, c1)
  if (r1.err) return { tipo: 'errore', msg: r1.err }
  if (r1.scegli) return r1.scegli
  const x1 = r1.x!
  const ripetuto = (m: Mese, d: Data, s: string, t: Turno, cambi: Cambio[]) => cella(m, d.g, t, cambi).some((y) => y.s === s && !y.barrato)
  const altri = (m: Mese, d: Data, s: string, escluso: Turno, cambi: Cambio[]) => turniDi(m, d.g, s, cambi).filter((y) => y.t !== escluso)

  if (!scambio) {
    if (ripetuto(m1, d1, a, x1.t, c1)) return { tipo: 'errore', msg: `${a} è già in ${NOME_TURNO[x1.t].toLowerCase()} ${dataBreve(d1.mese, d1.g)}` }
    const al = altri(m1, d1, a, x1.t, c1)
    if (al.length) avvisi.push(`${a} quel giorno è anche in ${al.map((y) => etichetta(y.t, y.p)).join(', ')}`)
    return {
      tipo: 'ok', avvisi,
      cambi: [{ mese: d1.mese, g: d1.g, t: x1.t, i: x1.i, da, a, pos: x1.p || null, descr: `${dataBreve(d1.mese, d1.g)} · ${etichetta(x1.t, x1.p)} · ${da} → ${a}` }],
    }
  }

  // Scambio: l'altro turno è di «a», nello stesso giorno o in d2
  const dd = d2 ?? d1
  const m2 = trova(dd)
  if (!m2) return { tipo: 'errore', msg: `Nessun prospetto per il ${dd.g}/${+dd.mese.slice(5)}` }
  // il primo cambio vale già quando si cerca il secondo turno (se nello stesso mese)
  const c2 = cambiDel(m2)
  const r2 = scegliTurno(m2, dd, a, t2, 2, c2)
  if (r2.err) return { tipo: 'errore', msg: r2.err }
  if (r2.scegli) return r2.scegli
  const x2 = r2.x!
  if (!d2 && x1.t === x2.t) return { tipo: 'errore', msg: `${da} e ${a} sono già entrambi in ${NOME_TURNO[x1.t].toLowerCase()}` }
  if (d2 && d2.mese === d1.mese && d2.g === d1.g && x1.t === x2.t) return { tipo: 'errore', msg: 'Stesso giorno e stesso turno: niente da scambiare' }
  if (ripetuto(m1, d1, a, x1.t, c1)) return { tipo: 'errore', msg: `${a} è già in ${NOME_TURNO[x1.t].toLowerCase()} ${dataBreve(d1.mese, d1.g)}` }
  if (ripetuto(m2, dd, da, x2.t, c2)) return { tipo: 'errore', msg: `${da} è già in ${NOME_TURNO[x2.t].toLowerCase()} ${dataBreve(dd.mese, dd.g)}` }
  if (d2) {
    const al1 = altri(m1, d1, a, x1.t, c1), al2 = altri(m2, dd, da, x2.t, c2)
    if (al1.length) avvisi.push(`${a} ${dataBreve(d1.mese, d1.g)} è anche in ${al1.map((y) => etichetta(y.t, y.p)).join(', ')}`)
    if (al2.length) avvisi.push(`${da} ${dataBreve(dd.mese, dd.g)} è anche in ${al2.map((y) => etichetta(y.t, y.p)).join(', ')}`)
  }
  return {
    tipo: 'ok', avvisi,
    cambi: [
      { mese: d1.mese, g: d1.g, t: x1.t, i: x1.i, da, a, pos: x1.p || null, descr: `${dataBreve(d1.mese, d1.g)} · ${etichetta(x1.t, x1.p)} · ${da} → ${a}` },
      { mese: dd.mese, g: dd.g, t: x2.t, i: x2.i, da: a, a: da, pos: x2.p || null, descr: `${dataBreve(dd.mese, dd.g)} · ${etichetta(x2.t, x2.p)} · ${a} → ${da}` },
    ],
  }
}

/* ---------- Cambio a tocchi ----------
 * Si toccano i box nel calendario. Turni di una sola persona → li regala a chi si sceglie;
 * turni di due persone → ognuno prende quelli dell'altro (anche 2 diurni contro 1 notte).
 */
export type Sel = { mese: string; g: number; t: Turno; i: number; s: string; p?: string }
export type Composto =
  | { tipo: 'vuoto' }
  | { tipo: 'errore'; msg: string }
  | { tipo: 'destinatario'; da: string }
  | { tipo: 'ok'; cambi: Nuovo[]; avvisi: string[] }

export const stessoBox = (a: Sel, b: Sel) => a.mese === b.mese && a.g === b.g && a.t === b.t && a.i === b.i
const confronta = (a: Sel, b: Sel) => a.mese.localeCompare(b.mese) || a.g - b.g || TURNI.indexOf(a.t) - TURNI.indexOf(b.t)

export function componi(sel: Sel[], mesi: Mese[], dest?: string | null, note?: Set<string>): Composto {
  if (!sel.length) return { tipo: 'vuoto' }
  const persone = [...new Set(sel.map((x) => x.s))]
  if (persone.length > 2) return { tipo: 'errore', msg: `Hai toccato turni di ${persone.length} persone (${persone.join(', ')}): un cambio è tra due` }
  if (persone.length === 1 && !dest) return { tipo: 'destinatario', da: persone[0] }
  if (persone.length === 1 && dest === persone[0]) return { tipo: 'errore', msg: 'Il turno è già suo' }
  const altro = (s: string) => (persone.length === 2 ? persone.find((p) => p !== s)! : dest!)
  const avvisi: string[] = []
  const cambi: Nuovo[] = []
  for (const x of [...sel].sort(confronta)) {
    const m = mesi.find((y) => y.mese === x.mese)
    if (!m) return { tipo: 'errore', msg: 'Prospetto non trovato: ricarica la pagina' }
    const a = altro(x.s)
    const lascia = (s: string, t: Turno) => sel.some((y) => y.s === s && y.mese === x.mese && y.g === x.g && y.t === t)
    if (lascia(a, x.t)) return { tipo: 'errore', msg: `${dataBreve(x.mese, x.g)}: ${x.s} e ${a} sono già entrambi in ${NOME_TURNO[x.t].toLowerCase()}` }
    if (cella(m, x.g, x.t).some((y) => y.s === a && !y.barrato)) return { tipo: 'errore', msg: `${a} è già in ${NOME_TURNO[x.t].toLowerCase()} ${dataBreve(x.mese, x.g)}` }
    const altri = turniDi(m, x.g, a, cambiDel(m)).filter((y) => y.t !== x.t && !lascia(a, y.t))
    if (altri.length) avvisi.push(`${a} ${dataBreve(x.mese, x.g)} è anche in ${altri.map((y) => etichetta(y.t, y.p)).join(', ')}`)
    cambi.push({ mese: x.mese, g: x.g, t: x.t, i: x.i, da: x.s, a, pos: x.p && (x.t === 'm' || x.t === 'p') ? x.p : null,
      descr: `${dataBreve(x.mese, x.g)} · ${etichetta(x.t, x.t === 'm' || x.t === 'p' ? x.p : undefined)} · ${x.s} → ${a}` })
  }
  if (note) for (const s of new Set(cambi.map((c) => c.a))) if (!note.has(s)) avvisi.push(`${s} non compare nei turni caricati: controlla la sigla`)
  return { tipo: 'ok', cambi, avvisi }
}

/*
 * Farmaci d'urgenza: fiale, preparazioni, dosi e calcolo della velocità per il peso del paziente.
 * Base: schede di infusione del DEA (versione 4.0, 05/05/2025), corrette e integrate (16/11/2026).
 * 17/11/2026: fiale e preparazioni allineate alla tabella delle infusioni del PS di Prato e alle confezioni
 * fotografate in reparto (le voci con «PS Prato» nella preparazione). Le altre restano come nella scheda di partenza.
 *
 * Calcolo: dose × peso (se /kg) → quantità all'ora → mL/h = quantità / concentrazione della preparazione.
 */

export type Q = 'g' | 'mg' | 'mcg' | 'UI' | 'mEq'
export type Tempo = 'min' | 'h' | 'die'

export interface Prep {
  /** siringa da 50 mL, volumetrica, diluizione per boli, puro */
  via: 'siringa' | 'volumetrica' | 'bolo' | 'puro'
  testo: string
  /** concentrazione finale per mL */
  conc: number
  q: Q
}

export interface Dose {
  etichetta: string
  q: Q
  kg?: boolean
  /** assente = bolo (quantità singola) */
  t?: Tempo
  min: number
  max: number
  start: number
  passo: number
  /** tetto assoluto nella stessa unità di q (per t se infusione) */
  tetto?: number
  /** indici delle preparazioni su cui calcolare i mL (default: tutte se infusione; fiala pura se bolo) */
  prep?: number[]
  /** bolo da infondere in N minuti: mostra anche la velocità */
  inMin?: number
  /** volume del diluente del bolo (mL), per la velocità */
  sacca?: number
  nota?: string
}

export interface Farmaco {
  id: string
  nome: string
  commerciale?: string
  gruppo: Gruppo
  /** confezione e concentrazione della fiala */
  fiala: string
  conc?: { v: number; q: Q }
  frigo?: boolean
  foto?: boolean
  prep?: Prep[]
  dosi?: Dose[]
  righe?: string[]
  avvisi?: string[]
  tabella?: { titolo: string; righe: string[][] }
}

export type Gruppo =
  | 'Vasoattivi e inotropi'
  | 'Vasopressori in bolo'
  | 'Antiaritmici e frequenza'
  | 'Antipertensivi e nitrati'
  | 'Coagulazione e trombolisi'
  | 'Antidoti'
  | 'Respiratorio e allergia'
  | 'Analgesia e sedazione'
  | 'Intubazione (RSI)'
  | 'Agitazione'
  | 'Elettroliti e metabolismo'
  | 'Gastro e diuretici'

export const GRUPPI: Gruppo[] = [
  'Vasoattivi e inotropi', 'Vasopressori in bolo', 'Antiaritmici e frequenza', 'Antipertensivi e nitrati',
  'Coagulazione e trombolisi', 'Antidoti', 'Respiratorio e allergia', 'Analgesia e sedazione', 'Intubazione (RSI)', 'Agitazione',
  'Elettroliti e metabolismo', 'Gastro e diuretici',
]

/* ───────────────────────── calcolo ───────────────────────── */

const FATT: Record<Q, number> = { g: 1e6, mg: 1e3, mcg: 1, UI: 1, mEq: 1 }
/** converte una quantità da un'unità all'altra (g/mg/mcg fra loro; UI e mEq restano) */
export const converti = (v: number, da: Q, a: Q) => (da === a ? v : (v * FATT[da]) / FATT[a])

export function quantita(d: Dose, valore: number, peso: number) {
  let q = valore * (d.kg ? peso : 1)
  const tagliata = d.tetto !== undefined && q > d.tetto
  if (tagliata) q = d.tetto!
  return { q, tagliata }
}

/** quantità all'ora nell'unità della dose */
export const allOra = (d: Dose, q: number) => (d.t === 'min' ? q * 60 : d.t === 'die' ? q / 24 : q)

export const mLh = (qOra: number, dq: Q, p: Prep) => converti(qOra, dq, p.q) / p.conc

export function num(v: number, cifre = 1) {
  if (!isFinite(v)) return '—'
  const r = Math.abs(v) >= 100 ? Math.round(v) : Math.abs(v) >= 10 ? Math.round(v * 10) / 10 : Math.round(v * 10 ** Math.max(cifre, 2)) / 10 ** Math.max(cifre, 2)
  return r.toLocaleString('it-IT', { maximumFractionDigits: 2 })
}

export const unitaDose = (d: Dose) => `${d.q}${d.kg ? '/kg' : ''}${d.t ? `/${d.t}` : ''}`

/* ───────────────────────── farmaci ───────────────────────── */

export const FARMACI_URGENZA: Farmaco[] = [
  // ── Vasoattivi e inotropi ──
  {
    id: 'noradrenalina', nome: 'Noradrenalina', gruppo: 'Vasoattivi e inotropi', foto: true,
    fiala: 'fiale 2 mg/1 mL', conc: { v: 2, q: 'mg' },
    prep: [{ via: 'siringa', testo: 'PS Prato: 4 fiale (8 mg) + 36 mL SF = 40 mL (0,2 mg/mL)', conc: 200, q: 'mcg' }],
    dosi: [{ etichetta: 'Infusione', q: 'mcg', kg: true, t: 'min', min: 0.01, max: 1, start: 0.1, passo: 0.01 }],
    righe: ['Range 0,01–1 mcg/kg/min; abituale 0,05–0,5, titolare sulla PAM ≥ 65 mmHg.', 'Via centrale appena possibile; periferica solo temporanea, in vena grossa e controllata.'],
  },
  {
    id: 'adrenalina-infusione', nome: 'Adrenalina in infusione', gruppo: 'Vasoattivi e inotropi', frigo: true, foto: true,
    fiala: 'fiale 1 mg/1 mL', conc: { v: 1, q: 'mg' },
    prep: [{ via: 'siringa', testo: 'PS Prato: 5 fiale (5 mg) + 45 mL SF = 50 mL (0,1 mg/mL)', conc: 100, q: 'mcg' }],
    dosi: [{ etichetta: 'Infusione', q: 'mcg', kg: true, t: 'min', min: 0.01, max: 0.5, start: 0.05, passo: 0.005 }],
    righe: ['Range 0,01–0,5 mcg/kg/min (inotropo e vasopressore; anafilassi refrattaria, bradicardia). Bradicardia: 2–10 mcg/min = 1,2–6 mL/h.'],
  },
  {
    id: 'dopamina', nome: 'Dopamina', commerciale: 'Revivan', gruppo: 'Vasoattivi e inotropi',
    fiala: 'fiale 200 mg/5 mL', conc: { v: 40, q: 'mg' },
    prep: [
      { via: 'siringa', testo: 'PS Prato: 2 fiale (400 mg) + 40 mL SF = 50 mL (8 mg/mL)', conc: 8, q: 'mg' },
      { via: 'volumetrica', testo: '1 fiala + 250 mL SF (circa 0,8 mg/mL)', conc: 200 / 255, q: 'mg' },
    ],
    dosi: [{ etichetta: 'Infusione', q: 'mcg', kg: true, t: 'min', min: 2, max: 20, start: 5, passo: 0.5 }],
    righe: ['Dose base 5–10 mcg/kg/min; alta 10–20 mcg/kg/min (oltre 20 nessun beneficio, più aritmie).'],
  },
  {
    id: 'dobutamina', nome: 'Dobutamina', commerciale: 'Dobutrex', gruppo: 'Vasoattivi e inotropi',
    fiala: 'fiale 250 mg/20 mL', conc: { v: 12.5, q: 'mg' },
    prep: [
      { via: 'siringa', testo: 'PS Prato: 1 fiala (250 mg) + 30 mL SF = 50 mL (5 mg/mL)', conc: 5, q: 'mg' },
      { via: 'volumetrica', testo: '1 fiala + 230 mL SF o G5% = 250 mL', conc: 1, q: 'mg' },
    ],
    dosi: [{ etichetta: 'Infusione', q: 'mcg', kg: true, t: 'min', min: 2.5, max: 20, start: 5, passo: 0.5 }],
    righe: ['Range 2–20 mcg/kg/min; abituale 2,5–10.'],
  },
  {
    id: 'argipressina', nome: 'Argipressina (vasopressina)', gruppo: 'Vasoattivi e inotropi', frigo: true,
    fiala: 'fiale 20 UI/1 mL', conc: { v: 20, q: 'UI' },
    prep: [{ via: 'siringa', testo: 'PS Prato: 2 fiale (40 UI) + 48 mL SF = 50 mL (0,8 UI/mL)', conc: 0.8, q: 'UI' }],
    dosi: [{ etichetta: 'Infusione', q: 'UI', t: 'min', min: 0.01, max: 0.05, start: 0.03, passo: 0.005 }],
    righe: ['Range 0,01–0,05 UI/min in aggiunta alla noradrenalina; di solito 0,03 UI/min.'],
    avvisi: ['La tabella del reparto riporta 1 UI/mL, ma 40 UI in 50 mL fanno 0,8 UI/mL: il calcolo usa 0,8.'],
  },
  {
    id: 'isoprenalina', nome: 'Isoprenalina', gruppo: 'Vasoattivi e inotropi',
    fiala: 'fiale 0,2 mg/1 mL', conc: { v: 0.2, q: 'mg' },
    prep: [{ via: 'siringa', testo: 'PS Prato: 5 fiale (1 mg) + 45 mL SF = 50 mL (20 mcg/mL)', conc: 20, q: 'mcg' }],
    dosi: [{ etichetta: 'Infusione', q: 'mcg', t: 'min', min: 1, max: 20, start: 2, passo: 0.5 }],
    righe: ['Range 1–20 mcg/min, titolare sulla frequenza (di solito 2–10).'],
    avvisi: ['NO se aritmie ventricolari o sindrome coronarica acuta.'],
  },
  {
    id: 'terlipressina', nome: 'Terlipressina', commerciale: 'EVER Pharma, SUN', gruppo: 'Vasoattivi e inotropi', frigo: true,
    fiala: 'EVER 0,2 mg/mL, fiale 5 mL = 1 mg; SUN 0,1 mg/mL, fiale 8,5 mL = 0,85 mg', conc: { v: 0.2, q: 'mg' },
    prep: [{ via: 'siringa', testo: 'infusione: 2 fiale EVER (2 mg, 10 mL) + 40 mL SF = 50 mL (0,04 mg/mL)', conc: 0.04, q: 'mg' }],
    dosi: [
      { etichetta: 'Bolo lento ev (mL della EVER 0,2 mg/mL)', q: 'mg', min: 1, max: 2, start: 2, passo: 1 },
      { etichetta: 'Infusione continua (sindrome epatorenale)', q: 'mg', t: 'die', min: 2, max: 12, start: 2, passo: 1, prep: [0] },
    ],
    righe: [
      'Emorragia da varici: 2 mg ev ogni 4 h fino al controllo (24–48 h), poi 1 mg ogni 4 h, per 2–5 giorni.',
      'EVER (0,2 mg/mL): 1 mg = 5 mL = 1 fiala; 2 mg = 10 mL = 2 fiale.',
      'SUN (0,1 mg/mL): 1 mg = 10 mL (1 fiala + 1,5 mL); 2 mg = 20 mL (2 fiale + 3 mL).',
    ],
    avvisi: ['Due concentrazioni in reparto: a parità di mL la SUN dà metà dose. Controllare la scatola.', 'Evitarla se cardiopatia ischemica, arteriopatia periferica, ischemia d’arto o intestinale: usare octreotide.'],
  },
  // ── Vasopressori in bolo ──
  {
    id: 'adrenalina-bolo', nome: 'Adrenalina in bolo («push dose»)', gruppo: 'Vasopressori in bolo', frigo: true, foto: true,
    fiala: 'fiale 1 mg/1 mL',
    prep: [{ via: 'bolo', testo: '1 fiala + 99 mL SF', conc: 10, q: 'mcg' }],
    dosi: [{ etichetta: 'Bolo', q: 'mcg', min: 5, max: 20, start: 10, passo: 5, prep: [0] }],
    righe: ['Inizio 1 min, durata 5–10 min; ripetibile ogni 2–5 min. Inopressore, utile se bassa gittata.'],
  },
  {
    id: 'fenilefrina', nome: 'Fenilefrina', gruppo: 'Vasopressori in bolo',
    fiala: 'siringhe preriempite 500 mcg/10 mL (50 mcg/mL)',
    prep: [{ via: 'bolo', testo: 'pura', conc: 50, q: 'mcg' }],
    dosi: [{ etichetta: 'Bolo', q: 'mcg', min: 50, max: 200, start: 100, passo: 50, prep: [0] }],
    righe: ['Inizio 1 min, durata 10–20 min; ripetibile ogni 2–5 min. Può dare bradicardia riflessa.'],
  },
  {
    id: 'efedrina', nome: 'Efedrina', gruppo: 'Vasopressori in bolo',
    fiala: 'fiale 10 mg/1 mL',
    prep: [{ via: 'bolo', testo: '5 fiale + 5 mL SF = 10 mL', conc: 5, q: 'mg' }],
    dosi: [{ etichetta: 'Bolo', q: 'mg', min: 2.5, max: 10, start: 5, passo: 2.5, prep: [0] }],
    righe: ['Inizio 1 min, durata 60 min; ripetibile ogni 2–5 min. Effetto prolungato: non di prima scelta.'],
  },
  {
    id: 'metaraminolo', nome: 'Metaraminolo', gruppo: 'Vasopressori in bolo',
    fiala: 'fiale 10 mg/1 mL',
    prep: [{ via: 'bolo', testo: '1 fiala + 9 mL SF = 10 mL', conc: 1, q: 'mg' }],
    dosi: [{ etichetta: 'Bolo', q: 'mg', min: 0.5, max: 1, start: 0.5, passo: 0.5, prep: [0] }],
    righe: ['0,5 mg ogni 2–3 min; poi eventuale infusione 0,5–3 mg/h.'],
  },
  // ── Antiaritmici e frequenza ──
  {
    id: 'amiodarone', nome: 'Amiodarone', commerciale: 'Cordarone', gruppo: 'Antiaritmici e frequenza',
    fiala: 'fiale 150 mg/3 mL', conc: { v: 50, q: 'mg' },
    prep: [
      { via: 'siringa', testo: 'PS Prato: 6 fiale (900 mg) + 32 mL G5% = 50 mL (18 mg/mL), vena centrale se possibile', conc: 18, q: 'mg' },
      { via: 'volumetrica', testo: '4 fiale (600 mg) + 250 mL G5% (circa 2,3 mg/mL)', conc: 600 / 262, q: 'mg' },
    ],
    dosi: [
      { etichetta: 'Carico in 100 mL G5% in 30 min', q: 'mg', kg: true, min: 5, max: 5, start: 5, passo: 1, inMin: 30, sacca: 100 },
      { etichetta: 'Infusione', q: 'mg', kg: true, t: 'die', min: 8, max: 15, start: 13, passo: 1, tetto: 1200 },
    ],
    righe: ['Siringa del PS: 2,1 mL/h = 900 mg/die; 1,7 mL/h = 750 mg/die; 1,4 mL/h = 600 mg/die.', 'Arresto in FV/TV senza polso: 300 mg ev in bolo, poi 150 mg.'],
    avvisi: ['Massimo 1200 mg nelle 24 h (oltre 80 kg il calcolo si ferma al tetto).', 'Concentrazioni > 2 mg/mL: preferire la vena centrale (flebiti).'],
  },
  {
    id: 'flecainide', nome: 'Flecainide', commerciale: 'Almarytm', gruppo: 'Antiaritmici e frequenza',
    fiala: 'fiale 150 mg/15 mL (10 mg/mL)', conc: { v: 10, q: 'mg' },
    prep: [{ via: 'volumetrica', testo: '1 fiala + 235 mL G5% = 250 mL', conc: 0.6, q: 'mg' }],
    dosi: [
      { etichetta: 'Bolo lento in 10 min (puro)', q: 'mg', kg: true, min: 1, max: 2, start: 2, passo: 0.5, tetto: 150 },
      { etichetta: 'Infusione: prima ora', q: 'mg', kg: true, t: 'h', min: 1.5, max: 1.5, start: 1.5, passo: 0.5 },
      { etichetta: 'Infusione: 2ª–24ª ora', q: 'mg', kg: true, t: 'h', min: 0.1, max: 0.25, start: 0.15, passo: 0.05 },
    ],
    avvisi: ['Bolo massimo 150 mg; massimo 600 mg nelle prime 24 h.', 'NO se cardiopatia strutturale o ischemica, FE ridotta, BAV, QRS largo.'],
  },
  {
    id: 'propafenone', nome: 'Propafenone', commerciale: 'Rytmonorm', gruppo: 'Antiaritmici e frequenza',
    fiala: 'fiale 70 mg/20 mL (3,5 mg/mL)', conc: { v: 3.5, q: 'mg' },
    dosi: [{ etichetta: 'Bolo lento in 10 min (puro)', q: 'mg', kg: true, min: 1, max: 2, start: 2, passo: 0.5 }],
    avvisi: ['NO se cardiopatia strutturale o ischemica, BPCO grave, BAV.'],
  },
  {
    id: 'diltiazem', nome: 'Diltiazem', commerciale: 'Dilzene, Altiazem', gruppo: 'Antiaritmici e frequenza',
    fiala: 'fiale 50 mg', conc: { v: 50 / 3, q: 'mg' },
    prep: [{ via: 'volumetrica', testo: '5 fiale (250 mg) + 250 mL SF o G5% (circa 1 mg/mL)', conc: 250 / 265, q: 'mg' }],
    dosi: [
      { etichetta: 'Bolo in 2 min', q: 'mg', kg: true, min: 0.25, max: 0.35, start: 0.25, passo: 0.05, nota: 'ripetibile 0,35 mg/kg dopo 15 min' },
      { etichetta: 'Infusione', q: 'mg', t: 'h', min: 5, max: 15, start: 10, passo: 1 },
    ],
    avvisi: ['NO se scompenso con FE ridotta, ipotensione, WPW.'],
  },
  {
    id: 'verapamil', nome: 'Verapamil', commerciale: 'Isoptin', gruppo: 'Antiaritmici e frequenza',
    fiala: 'fiale 5 mg/2 mL', conc: { v: 2.5, q: 'mg' },
    prep: [
      { via: 'siringa', testo: '10 fiale (50 mg) + 30 mL SF = 50 mL', conc: 1, q: 'mg' },
      { via: 'volumetrica', testo: '10 fiale + 480 mL SF = 500 mL', conc: 0.1, q: 'mg' },
    ],
    dosi: [
      { etichetta: 'TPSV: bolo in 2 min', q: 'mg', min: 5, max: 10, start: 5, passo: 2.5, nota: 'ripetibile dopo 15 min' },
      { etichetta: 'Infusione', q: 'mcg', kg: true, t: 'min', min: 1, max: 2.5, start: 1, passo: 0.25 },
    ],
    avvisi: ['NO se scompenso, ipotensione, WPW, tachicardia a QRS largo di origine incerta.'],
  },
  {
    id: 'esmololo', nome: 'Esmololo', commerciale: 'Brevibloc', gruppo: 'Antiaritmici e frequenza',
    fiala: 'fiale 100 mg/10 mL (10 mg/mL)', conc: { v: 10, q: 'mg' },
    prep: [{ via: 'siringa', testo: 'puro: 5 fiale = 50 mL', conc: 10, q: 'mg' }],
    dosi: [
      { etichetta: 'Carico in 1 min', q: 'mg', kg: true, min: 0.5, max: 0.5, start: 0.5, passo: 0.1 },
      { etichetta: 'Mantenimento', q: 'mcg', kg: true, t: 'min', min: 25, max: 300, start: 50, passo: 25 },
    ],
    righe: ['Range 25–300 mcg/kg/min; bolo iniziale con la stessa siringa (PS Prato: 5 fiale pure = 500 mg in 50 mL).', 'Aumentare di 50 mcg/kg/min ogni 5 min, ripetendo ogni volta il carico, fino al bersaglio.'],
  },
  {
    id: 'landiololo', nome: 'Landiololo', commerciale: 'Landiobloc', gruppo: 'Antiaritmici e frequenza',
    fiala: 'fiale 300 mg polvere; fiale 20 mg/2 mL (frigo) per i boli', conc: { v: 10, q: 'mg' },
    prep: [{ via: 'siringa', testo: '1 fiala da 300 mg + 50 mL SF', conc: 6, q: 'mg' }],
    dosi: [
      { etichetta: 'Carico opzionale in 1 min', q: 'mcg', kg: true, min: 100, max: 100, start: 100, passo: 10, prep: [0], inMin: 1 },
      { etichetta: 'Infusione', q: 'mcg', kg: true, t: 'min', min: 1, max: 40, start: 10, passo: 1 },
    ],
    righe: ['10–40 mcg/kg/min; con disfunzione cardiaca partire da 1 mcg/kg/min e salire fino a 10.', 'Oltre 10 mcg/kg/min: massimo 24 h.'],
  },
  {
    id: 'lidocaina', nome: 'Lidocaina', gruppo: 'Antiaritmici e frequenza',
    fiala: 'fiale 200 mg/10 mL (20 mg/mL)', conc: { v: 20, q: 'mg' },
    prep: [{ via: 'siringa', testo: 'PS Prato: 5 fiale pure (1000 mg) = 50 mL (20 mg/mL)', conc: 20, q: 'mg' }],
    dosi: [
      { etichetta: 'Bolo', q: 'mg', kg: true, min: 1, max: 1.5, start: 1, passo: 0.5 },
      { etichetta: 'Infusione', q: 'mcg', kg: true, t: 'min', min: 15, max: 50, start: 20, passo: 5 },
    ],
    righe: ['Range 15–50 mcg/kg/min (circa 1–3,5 mg/min a 70 kg).'],
    avvisi: ['NO se WPW o BAV avanzato.'],
  },
  // ── Antipertensivi ──
  {
    id: 'urapidil', nome: 'Urapidil', commerciale: 'Ebrantil', gruppo: 'Antipertensivi e nitrati',
    fiala: 'fiale 50 mg/10 mL (5 mg/mL)', conc: { v: 5, q: 'mg' },
    prep: [
      { via: 'siringa', testo: 'PS Prato: 5 fiale pure (250 mg) = 50 mL (5 mg/mL)', conc: 5, q: 'mg' },
      { via: 'volumetrica', testo: '5 fiale + 450 mL SF = 500 mL', conc: 0.5, q: 'mg' },
    ],
    dosi: [
      { etichetta: 'Bolo ogni 5–10 min', q: 'mg', min: 10, max: 50, start: 12.5, passo: 2.5 },
      { etichetta: 'Infusione', q: 'mg', t: 'h', min: 9, max: 120, start: 20, passo: 1 },
    ],
  },
  {
    id: 'labetalolo', nome: 'Labetalolo', commerciale: 'Trandate', gruppo: 'Antipertensivi e nitrati',
    fiala: 'fiale 100 mg/20 mL (5 mg/mL)', conc: { v: 5, q: 'mg' },
    prep: [
      { via: 'siringa', testo: 'PS Prato: 2 fiale pure (200 mg) = 40 mL (5 mg/mL)', conc: 5, q: 'mg' },
      { via: 'volumetrica', testo: '10 fiale + 300 mL SF = 500 mL', conc: 2, q: 'mg' },
    ],
    dosi: [
      { etichetta: 'Bolo (carico 20 mg, poi 20–80 mg ogni 5–10 min)', q: 'mg', min: 20, max: 80, start: 20, passo: 10 },
      { etichetta: 'Infusione', q: 'mg', t: 'h', min: 15, max: 160, start: 60, passo: 5, nota: 'range del PS 15–160 mg/h (1–2 mg/min = 60–120 mg/h)' },
    ],
    avvisi: ['Massimo 300 mg in totale con i boli. NO se asma, BAV, bradicardia, scompenso acuto.'],
  },
  {
    id: 'clonidina', nome: 'Clonidina', commerciale: 'Catapresan', gruppo: 'Antipertensivi e nitrati',
    fiala: 'fiale 0,150 mg/1 mL', conc: { v: 150, q: 'mcg' },
    prep: [{ via: 'siringa', testo: '10 fiale (1,5 mg) + 40 mL SF = 50 mL', conc: 30, q: 'mcg' }],
    dosi: [
      { etichetta: 'Bolo in 10 mL SF in 10 min', q: 'mcg', min: 75, max: 150, start: 150, passo: 75, nota: 'massimo 4 volte al giorno' },
      { etichetta: 'Infusione', q: 'mcg', kg: true, t: 'min', min: 0.05, max: 0.1, start: 0.05, passo: 0.01 },
    ],
  },
  {
    id: 'nitroglicerina', nome: 'Nitroglicerina', commerciale: 'Venitrin', gruppo: 'Antipertensivi e nitrati',
    fiala: 'fiale 5 mg/1,5 mL', conc: { v: 5 / 1.5, q: 'mg' },
    prep: [{ via: 'siringa', testo: 'PS Prato: 10 fiale (50 mg, 15 mL) + 35 mL SF = 50 mL (1 mg/mL)', conc: 1, q: 'mg' }],
    dosi: [{ etichetta: 'Infusione', q: 'mcg', t: 'min', min: 5, max: 200, start: 10, passo: 5 }],
    righe: ['Range 5–200 mcg/min: partire da 10–20 mcg/min (0,6–1,2 mL/h), aumentare ogni 3–5 min.'],
    avvisi: ['NO se PAS < 90, infarto del ventricolo destro, inibitori della PDE-5 nelle 24–48 h, stenosi aortica severa.'],
  },
  {
    id: 'isosorbide', nome: 'Isosorbide dinitrato', commerciale: 'Diniket', gruppo: 'Antipertensivi e nitrati',
    fiala: 'fiale 10 mg/10 mL (1 mg/mL)', conc: { v: 1, q: 'mg' },
    prep: [
      { via: 'siringa', testo: 'puro (1 mg/mL)', conc: 1, q: 'mg' },
      { via: 'volumetrica', testo: '2,5 fiale (25 mg) + 225 mL SF = 250 mL', conc: 0.1, q: 'mg' },
    ],
    dosi: [{ etichetta: 'Infusione', q: 'mg', t: 'h', min: 2, max: 10, start: 2, passo: 1 }],
    avvisi: ['NO se PAS < 90, infarto del ventricolo destro, inibitori della PDE-5 nelle 24–48 h.'],
  },
  // ── Coagulazione e trombolisi ──
  {
    id: 'eparina', nome: 'Eparina sodica', gruppo: 'Coagulazione e trombolisi',
    fiala: 'fiale 25.000 UI/5 mL (5000 UI/mL)', conc: { v: 5000, q: 'UI' },
    prep: [{ via: 'siringa', testo: 'PS Prato: 2 mL (10.000 UI) + 48 mL SF = 50 mL (200 UI/mL)', conc: 200, q: 'UI' }],
    dosi: [
      { etichetta: 'TEV: bolo', q: 'UI', kg: true, min: 80, max: 80, start: 80, passo: 10 },
      { etichetta: 'TEV: infusione iniziale', q: 'UI', kg: true, t: 'h', min: 18, max: 18, start: 18, passo: 1 },
      { etichetta: 'SCA: bolo', q: 'UI', kg: true, min: 60, max: 70, start: 60, passo: 5, tetto: 4000, nota: 'STEMI con PCI primaria: 70–100 UI/kg (max 5000) secondo l’emodinamica' },
      { etichetta: 'SCA: infusione', q: 'UI', kg: true, t: 'h', min: 12, max: 12, start: 12, passo: 1, tetto: 1000 },
      { etichetta: 'Variazione da nomogramma', q: 'UI', kg: true, t: 'h', min: 2, max: 4, start: 2, passo: 1 },
    ],
    tabella: {
      titolo: 'Aggiustamento per aPTT (soglie in secondi del laboratorio della scheda di partenza: verificare quelle del proprio)',
      righe: [
        ['aPTT', 'Cosa fare'],
        ['< 38,5″', 'bolo 80 UI/kg, aumentare di 4 UI/kg/h'],
        ['38,6–48″', 'bolo 40 UI/kg, aumentare di 2 UI/kg/h'],
        ['48,1–74″', 'nessuna variazione'],
        ['74,1–96″', 'ridurre di 2 UI/kg/h'],
        ['> 96,1″', 'sospendere 1 h, poi ridurre di 3 UI/kg/h'],
      ],
    },
    righe: ['Range in pompa 200–2000 UI/h (1–10 mL/h). Modulo eparina compilabile nella scheda Moduli.'],
    avvisi: ['80 + 18 UI/kg nel tromboembolismo venoso; nelle SCA 60 UI/kg (max 4000) + 12 UI/kg/h (max 1000).'],
  },
  {
    id: 'protamina', nome: 'Protamina cloridrato', gruppo: 'Coagulazione e trombolisi',
    fiala: 'fiale 50 mg/5 mL (10 mg/mL)', conc: { v: 10, q: 'mg' },
    righe: [
      'PS Prato: in pompa pura, 2 fiale = 100 mg in 10 mL (10 mg/mL).',
      '1 mg neutralizza 100 UI di eparina non frazionata; infondere in 10 min, massimo 50 mg per volta.',
      'Dopo un bolo recente: 1 mg ogni 100 UI del bolo.',
      'Durante un’infusione: 1 mg ogni 100 UI dell’eparina infusa nelle ultime 2–3 ore (es. 1250 UI/h → circa 3000 UI → 30 mg).',
      'Enoxaparina: 1 mg ogni 1 mg di enoxaparina se data da < 8 h (neutralizzazione parziale).',
    ],
  },
  {
    id: 'proplex', nome: 'Complesso protrombinico (PCC)', commerciale: 'Proplex', gruppo: 'Coagulazione e trombolisi', frigo: true,
    fiala: 'flaconi 600 UI/20 mL (30 UI/mL di fattore IX); fattori II, VII, IX, X', conc: { v: 30, q: 'UI' },
    dosi: [
      { etichetta: 'INR 2–3,9', q: 'UI', kg: true, min: 25, max: 25, start: 25, passo: 5 },
      { etichetta: 'INR 4–6', q: 'UI', kg: true, min: 35, max: 35, start: 35, passo: 5 },
      { etichetta: 'INR > 6', q: 'UI', kg: true, min: 50, max: 50, start: 50, passo: 5 },
    ],
    righe: ['1 UI/kg aumenta l’attività del fattore IX di circa l’1%.', 'Velocità massima 2 mL/min (60 UI/min). Sempre con vitamina K 10 mg ev.'],
  },
  {
    id: 'confidex', nome: 'Complesso protrombinico (PCC)', commerciale: 'Confidex', gruppo: 'Coagulazione e trombolisi',
    fiala: 'flaconi 500 UI/20 mL o 1000 UI/40 mL (25 UI/mL); fattori II, VII, IX, X, proteine C e S', conc: { v: 25, q: 'UI' },
    dosi: [
      { etichetta: 'INR 2–4 (1 mL/kg)', q: 'UI', kg: true, min: 25, max: 25, start: 25, passo: 5, tetto: 5000 },
      { etichetta: 'INR 4,1–6 (1,4 mL/kg)', q: 'UI', kg: true, min: 35, max: 35, start: 35, passo: 5, tetto: 5000 },
      { etichetta: 'INR > 6 (2 mL/kg)', q: 'UI', kg: true, min: 50, max: 50, start: 50, passo: 5, tetto: 5000 },
    ],
    righe: ['Velocità massima 3 UI/kg/min (circa 8 mL/min a 70 kg). Dose singola massima 5000 UI. Sempre con vitamina K.'],
  },
  {
    id: 'vitamina-k', nome: 'Fitomenadione (vitamina K)', commerciale: 'Konakion', gruppo: 'Coagulazione e trombolisi',
    fiala: 'fiale 10 mg/1 mL', conc: { v: 10, q: 'mg' },
    dosi: [{ etichetta: 'Ev lenta (in 50–100 mL, 20–30 min)', q: 'mg', min: 5, max: 10, start: 10, passo: 5 }],
  },
  {
    id: 'tranexamico', nome: 'Acido tranexamico', commerciale: 'Tranex, Ugurol', gruppo: 'Coagulazione e trombolisi',
    fiala: 'fiale 500 mg/5 mL', conc: { v: 100, q: 'mg' },
    righe: ['Trauma (entro 3 h): 1 g ev in 10 min, poi 1 g in 250 mL SF in 8 h (31 mL/h).'],
  },
  {
    id: 'fibrinogeno', nome: 'Fibrinogeno umano', commerciale: 'RiaSTAP', gruppo: 'Coagulazione e trombolisi',
    fiala: 'flacone 1 g di polvere (con filtro e dispositivo di trasferimento)',
    righe: ['Ricostituire con 50 mL di acqua per preparazioni iniettabili (20 mg/mL); infondere con il filtro, non oltre 5 mL/min.', '3–4 g ev = 3–4 flaconi se fibrinogeno < 1,5 g/L (< 2 g/L nell’emorragia ostetrica) o sanguinamento massivo, se possibile guidati da ROTEM.'],
  },
  {
    id: 'fattore-vii', nome: 'Fattore VII umano', commerciale: 'Provertinum', gruppo: 'Coagulazione e trombolisi', frigo: true,
    fiala: 'flacone 600 UI (polvere e solvente)',
    righe: ['Solo deficit congenito di fattore VII, su indicazione dell’ematologo.'],
    avvisi: ['Non è il fattore VII attivato (NovoSeven) degli emofilici con inibitori e non sostituisce il complesso protrombinico nel paziente anticoagulato.'],
  },
  {
    id: 'alteplase', nome: 'Alteplase', commerciale: 'Actilyse', gruppo: 'Coagulazione e trombolisi',
    fiala: 'flaconi 20 mg/20 mL o 50 mg/50 mL (1 mg/mL)', conc: { v: 1, q: 'mg' },
    prep: [{ via: 'volumetrica', testo: 'ricostituita 1 mg/mL', conc: 1, q: 'mg' }],
    dosi: [
      { etichetta: 'Ictus: dose totale (massimo 90 mg)', q: 'mg', kg: true, min: 0.9, max: 0.9, start: 0.9, passo: 0.1, tetto: 90 },
      { etichetta: 'Ictus: bolo (10%) in 1 min', q: 'mg', kg: true, min: 0.09, max: 0.09, start: 0.09, passo: 0.01, tetto: 9 },
      { etichetta: 'Ictus: resto (90%) in 60 min', q: 'mg', kg: true, t: 'h', min: 0.81, max: 0.81, start: 0.81, passo: 0.01, tetto: 81 },
    ],
    righe: [
      'Embolia polmonare: 10 mg (10 mL) in bolo in 1–2 min, poi 90 mg in 2 h (45 mL/h). Sotto i 65 kg: totale massimo 1,5 mg/kg (10% bolo, 90% in 2 h).',
    ],
  },
  // ── Antidoti ──
  {
    id: 'acetilcisteina', nome: 'N-acetilcisteina', commerciale: 'Fluimucil', gruppo: 'Antidoti',
    fiala: 'fiale 300 mg/3 mL (100 mg/mL)', conc: { v: 100, q: 'mg' },
    dosi: [
      { etichetta: '1ª sacca: 200 mL G5% in 60 min', q: 'mg', kg: true, min: 150, max: 150, start: 150, passo: 10, tetto: 16500, inMin: 60, sacca: 200 },
      { etichetta: '2ª sacca: 500 mL G5% in 4 h', q: 'mg', kg: true, min: 50, max: 50, start: 50, passo: 10, tetto: 5500, inMin: 240, sacca: 500 },
      { etichetta: '3ª sacca: 1000 mL G5% in 16 h', q: 'mg', kg: true, min: 100, max: 100, start: 100, passo: 10, tetto: 11000, inMin: 960, sacca: 1000 },
    ],
    avvisi: ['Peso massimo di calcolo 110 kg.'],
  },
  {
    id: 'naloxone', nome: 'Naloxone', commerciale: 'Narcan', gruppo: 'Antidoti',
    fiala: 'fiale 0,4 mg/1 mL', conc: { v: 0.4, q: 'mg' },
    dosi: [{ etichetta: 'Bolo ogni 2–3 min', q: 'mg', min: 0.4, max: 2, start: 0.4, passo: 0.2 }],
    righe: ['Massimo 10 mg (25 fiale).'],
  },
  {
    id: 'flumazenil', nome: 'Flumazenil', commerciale: 'Anexate', gruppo: 'Antidoti',
    fiala: 'fiale 0,5 mg/5 mL o 1 mg/10 mL (0,1 mg/mL)', conc: { v: 0.1, q: 'mg' },
    dosi: [
      { etichetta: 'Primo bolo in 15 s', q: 'mg', min: 0.2, max: 0.2, start: 0.2, passo: 0.1 },
      { etichetta: 'Boli successivi ogni 60 s', q: 'mg', min: 0.1, max: 0.1, start: 0.1, passo: 0.1 },
    ],
    righe: ['Fino a un massimo di 1 mg (di solito bastano 0,3–0,6 mg).'],
    avvisi: ['Rischio di convulsioni se uso cronico di benzodiazepine o intossicazione da proconvulsivanti (triciclici).'],
  },
  {
    id: 'glucagone', nome: 'Glucagone', commerciale: 'Glucagen', gruppo: 'Antidoti', frigo: true,
    fiala: 'fiale 1 mg/1 mL', conc: { v: 1, q: 'mg' },
    prep: [{ via: 'siringa', testo: '5 fiale + 45 mL SF = 50 mL', conc: 0.1, q: 'mg' }],
    dosi: [
      { etichetta: 'Betabloccanti: bolo ev', q: 'mg', min: 3, max: 10, start: 5, passo: 1 },
      { etichetta: 'Infusione', q: 'mg', t: 'h', min: 1, max: 5, start: 2, passo: 0.5 },
    ],
    righe: ['Ipoglicemia: 1 mg IM o SC.'],
    avvisi: ['Nei betabloccanti 50–150 mcg/kg. Dà vomito: proteggere le vie aeree.'],
  },
  // ── Respiratorio e allergia ──
  {
    id: 'salbutamolo-ev', nome: 'Salbutamolo ev', commerciale: 'Ventolin', gruppo: 'Respiratorio e allergia',
    fiala: 'fiale 500 mcg/1 mL', conc: { v: 500, q: 'mcg' },
    prep: [{ via: 'siringa', testo: 'PS Prato: 2 fiale (1 mg) + 48 mL SF = 50 mL (20 mcg/mL)', conc: 20, q: 'mcg' }],
    dosi: [{ etichetta: 'Infusione', q: 'mcg', t: 'min', min: 3, max: 20, start: 5, passo: 1 }],
    righe: ['Asma grave che non risponde all’aerosol: range 3–20 mcg/min (9–60 mL/h).'],
    avvisi: ['Tachicardia, aritmie, ipokaliemia, iperlattatemia: monitor, potassio e lattati.'],
  },
  {
    id: 'c1-inibitore', nome: 'C1-inibitore umano', commerciale: 'Berinert', gruppo: 'Respiratorio e allergia', frigo: true,
    fiala: 'flacone 500 UI (polvere e solvente)',
    righe: ['Angioedema ereditario (o da deficit acquisito di C1-inibitore): 20 UI/kg ev lenta; a 70 kg 1.400 UI → 3 flaconi = 1.500 UI.', 'Nell’angioedema da ACE-inibitori l’efficacia è incerta.'],
  },
  // ── Analgesia e sedazione ──
  {
    id: 'fentanil', nome: 'Fentanil', commerciale: 'Fentanest', gruppo: 'Analgesia e sedazione',
    fiala: 'fiale 0,1 mg/2 mL (50 mcg/mL)', conc: { v: 50, q: 'mcg' },
    prep: [{ via: 'siringa', testo: '5 fiale + 40 mL SF = 50 mL', conc: 10, q: 'mcg' }],
    dosi: [
      { etichetta: 'Analgesia: bolo ogni 30–60 min', q: 'mcg', kg: true, min: 0.35, max: 1, start: 0.5, passo: 0.05 },
      { etichetta: 'RSI: lento in 1–2 min', q: 'mcg', kg: true, min: 1, max: 2, start: 1, passo: 0.5 },
      { etichetta: 'Infusione', q: 'mcg', kg: true, t: 'h', min: 0.7, max: 2, start: 1, passo: 0.1 },
    ],
    righe: ['Sedazione procedurale: 25–100 mcg per bolo, ripetibili.'],
  },
  {
    id: 'morfina', nome: 'Morfina cloridrato', gruppo: 'Analgesia e sedazione',
    fiala: 'fiale 10 mg/1 mL', conc: { v: 10, q: 'mg' },
    prep: [
      { via: 'bolo', testo: '1 fiala + 9 mL SF = 1 mg/mL', conc: 1, q: 'mg' },
      { via: 'siringa', testo: 'PS Prato: 2 fiale (20 mg) + 18 mL SF = 20 mL (1 mg/mL)', conc: 1, q: 'mg' },
    ],
    dosi: [
      { etichetta: 'Bolo (diluita 1 mg/mL)', q: 'mg', min: 2, max: 4, start: 2, passo: 1, prep: [0], nota: 'titolare ogni 5–10 min nel dolore acuto' },
      { etichetta: 'Infusione', q: 'mg', kg: true, t: 'h', min: 0.003, max: 0.15, start: 0.02, passo: 0.005, prep: [1] },
    ],
  },
  {
    id: 'ketamina', nome: 'Ketamina', gruppo: 'Analgesia e sedazione',
    fiala: 'fiale 100 mg/2 mL (50 mg/mL)', conc: { v: 50, q: 'mg' },
    prep: [{ via: 'siringa', testo: '1 fiala + 48 mL SF = 50 mL', conc: 2, q: 'mg' }],
    dosi: [
      { etichetta: 'Analgesia: bolo in 1–2 min', q: 'mg', kg: true, min: 0.1, max: 0.3, start: 0.2, passo: 0.05, prep: [0] },
      { etichetta: 'Sedazione procedurale / RSI ev', q: 'mg', kg: true, min: 1, max: 2, start: 1, passo: 0.5 },
      { etichetta: 'Dissociativa IM', q: 'mg', kg: true, min: 4, max: 5, start: 4, passo: 0.5 },
      { etichetta: 'Analgesia: infusione', q: 'mg', kg: true, t: 'h', min: 0.15, max: 0.2, start: 0.15, passo: 0.01 },
    ],
  },
  {
    id: 'midazolam', nome: 'Midazolam', commerciale: 'Ipnovel', gruppo: 'Analgesia e sedazione',
    fiala: 'fiale 15 mg/3 mL (5 mg/mL)', conc: { v: 5, q: 'mg' },
    prep: [
      { via: 'siringa', testo: 'PS Prato: 3 fiale (45 mg) + 36 mL SF = 45 mL (1 mg/mL)', conc: 1, q: 'mg' },
    ],
    dosi: [
      { etichetta: 'Carico in 5 min', q: 'mg', kg: true, min: 0.03, max: 0.3, start: 0.05, passo: 0.01, prep: [0] },
      { etichetta: 'Mantenimento', q: 'mg', kg: true, t: 'h', min: 0.03, max: 0.2, start: 0.05, passo: 0.01 },
    ],
  },
  {
    id: 'propofol', nome: 'Propofol', commerciale: 'Diprivan', gruppo: 'Analgesia e sedazione',
    fiala: '1% 500 mg/50 mL (10 mg/mL) o 2% 1000 mg/50 mL (20 mg/mL); alcune in frigo', conc: { v: 10, q: 'mg' },
    prep: [
      { via: 'puro', testo: '1% puro (10 mg/mL)', conc: 10, q: 'mg' },
      { via: 'puro', testo: '2% puro (20 mg/mL)', conc: 20, q: 'mg' },
    ],
    dosi: [
      { etichetta: 'Induzione (bolo lento)', q: 'mg', kg: true, min: 0.5, max: 2, start: 1, passo: 0.25, prep: [0] },
      { etichetta: 'Infusione', q: 'mg', kg: true, t: 'h', min: 0.3, max: 6, start: 1, passo: 0.1 },
    ],
    righe: ['Range del PS 1–6 mg/kg/h, puro (1% o 2%). Oltre 4 mg/kg/h e oltre 48 h: rischio di sindrome da infusione di propofol (acidosi, rabdomiolisi, trigliceridi).'],
  },
  {
    id: 'dexmedetomidina', nome: 'Dexmedetomidina', commerciale: 'Dexdor', gruppo: 'Analgesia e sedazione',
    fiala: 'fiale 200 mcg/2 mL (100 mcg/mL)', conc: { v: 100, q: 'mcg' },
    prep: [{ via: 'siringa', testo: 'PS Prato: 1 fiala (200 mcg) + 48 mL SF = 50 mL (4 mcg/mL)', conc: 4, q: 'mcg' }],
    dosi: [
      { etichetta: 'Procedurale: bolo in 10–20 min', q: 'mcg', kg: true, min: 0.5, max: 1, start: 0.5, passo: 0.1, prep: [0], inMin: 15 },
      { etichetta: 'Infusione', q: 'mcg', kg: true, t: 'h', min: 0.2, max: 1.4, start: 0.5, passo: 0.1 },
    ],
    righe: ['NIV: 0,2–0,7 mcg/kg/h; paziente intubato: 0,7–1,4. Procedurale: dopo il bolo 0,6–0,7 mcg/kg/h (0,2–1).', 'Bradicardia e ipotensione frequenti.'],
  },
  {
    id: 'remifentanil', nome: 'Remifentanil', commerciale: 'Ultiva', gruppo: 'Analgesia e sedazione',
    fiala: 'flaconi 1 mg (polvere)',
    prep: [
      { via: 'siringa', testo: 'PS Prato: 4 flaconi (4 mg) + 40 mL SF (0,1 mg/mL)', conc: 100, q: 'mcg' },
      { via: 'siringa', testo: 'sala operatoria/risveglio: 2 flaconi (2 mg) + 40 mL SF (0,05 mg/mL)', conc: 50, q: 'mcg' },
    ],
    dosi: [{ etichetta: 'Infusione', q: 'mcg', kg: true, t: 'min', min: 0.01, max: 0.2, start: 0.05, passo: 0.01 }],
    righe: ['Range 0,01–0,2 mcg/kg/min. Effetto che finisce in pochi minuti alla sospensione: prevedere l’analgesia successiva.'],
    avvisi: ['Bradicardia, ipotensione, rigidità toracica con boli rapidi.'],
  },
  {
    id: 'diazepam', nome: 'Diazepam', commerciale: 'Valium', gruppo: 'Analgesia e sedazione',
    fiala: 'fiale 10 mg/2 mL (5 mg/mL)', conc: { v: 5, q: 'mg' },
    dosi: [{ etichetta: 'Bolo ev', q: 'mg', kg: true, min: 0.05, max: 0.2, start: 0.1, passo: 0.05 }],
    righe: ['Mantenimento 0,03–0,1 mg/kg (1–7 mg) ogni 30 min–6 h. Infusione continua non raccomandata.'],
  },
  {
    id: 'lorazepam', nome: 'Lorazepam', commerciale: 'Lorazepam Macure', gruppo: 'Analgesia e sedazione', frigo: true,
    fiala: 'fiale 4 mg/1 mL', conc: { v: 4, q: 'mg' },
    prep: [{ via: 'siringa', testo: '10 fiale (40 mg) + 40 mL SF = 50 mL', conc: 0.8, q: 'mg' }],
    dosi: [
      { etichetta: 'Stato di male: bolo in 2 min', q: 'mg', kg: true, min: 0.1, max: 0.1, start: 0.1, passo: 0.05, tetto: 4, nota: 'ripetibile dopo 5 min' },
      { etichetta: 'Infusione', q: 'mg', kg: true, t: 'h', min: 0.005, max: 0.12, start: 0.02, passo: 0.005 },
    ],
  },
  {
    id: 'sedazione-palliativa', nome: 'Sedazione palliativa (miscela)', gruppo: 'Analgesia e sedazione',
    fiala: '500 mL SF + midazolam 30 mg + morfina 30 mg + aloperidolo 4 mg',
    righe: ['Partire a 21 mL/h (circa 1,25 mg/h di midazolam e morfina) e titolare sull’effetto.', 'Già in terapia con oppioidi: raddoppiare la morfina in corso.', 'Secrezioni o rantolo: aggiungere butilscopolamina (Buscopan) 60 mg.'],
  },
  // ── RSI ──
  {
    id: 'rsi', nome: 'Sequenza rapida di intubazione', gruppo: 'Intubazione (RSI)',
    fiala: 'Schema',
    righe: [
      '−10 → 0 min: monitor, pallone con maschera, Guedel, videolaringoscopio e alternative, mount, filtro, aspirazione, farmaci induttori e bloccanti neuromuscolari, piano B e C.',
      '−3 → 0 min: preossigenazione con O₂ 100% per 3 min (NIV o alti flussi se ipossiemico).',
      '0: induzione: ketamina 1–2 mg/kg (preferita se instabile) oppure propofol 1–2 mg/kg (bolo lento) oppure midazolam 0,1 mg/kg + fentanil 1–2 mcg/kg; poi succinilcolina 1–1,5 mg/kg oppure rocuronio 1,2 mg/kg.',
      '0 → 45 s: posizionamento e intubazione; conferma con capnografia (ETCO₂) e saturazione.',
      'Dopo: sedazione in infusione (propofol 1–4 mg/kg/h ± fentanil).',
    ],
    avvisi: ['La pressione cricoidea (Sellick) non è più raccomandata di routine.'],
  },
  {
    id: 'succinilcolina', nome: 'Succinilcolina', commerciale: 'Midarine', gruppo: 'Intubazione (RSI)', frigo: true,
    fiala: '100 mg/10 mL (10 mg/mL)', conc: { v: 10, q: 'mg' },
    dosi: [{ etichetta: 'Bolo', q: 'mg', kg: true, min: 1, max: 1.5, start: 1.5, passo: 0.5 }],
    righe: ['Inizio 45 s–1 min, durata 5–10 min.'],
    avvisi: ['NO se iperkaliemia, ipertermia maligna, ustioni o schiacciamento dopo 24–48 h, denervazione (ictus, lesione midollare non recente), miopatie, immobilità prolungata.'],
  },
  {
    id: 'rocuronio', nome: 'Rocuronio', commerciale: 'Esmeron', gruppo: 'Intubazione (RSI)', frigo: true,
    fiala: 'fiale 50 mg/5 mL (10 mg/mL)', conc: { v: 10, q: 'mg' },
    prep: [{ via: 'siringa', testo: 'PS Prato: 10 fiale pure (500 mg) = 50 mL (10 mg/mL)', conc: 10, q: 'mg' }],
    dosi: [
      { etichetta: 'Intubazione (RSI 1,2)', q: 'mg', kg: true, min: 0.6, max: 1.2, start: 1.2, passo: 0.1 },
      { etichetta: 'Richiamo', q: 'mg', kg: true, min: 0.15, max: 0.15, start: 0.15, passo: 0.05 },
      { etichetta: 'Infusione', q: 'mg', kg: true, t: 'h', min: 0.3, max: 0.6, start: 0.3, passo: 0.05 },
    ],
    righe: ['Inizio 1–3 min, durata 20–40 min (più lunga a dosi alte).'],
  },
  {
    id: 'cisatracurio', nome: 'Cisatracurio', commerciale: 'Nimbex', gruppo: 'Intubazione (RSI)', frigo: true,
    fiala: 'fiale 10 mg/5 mL (2 mg/mL)', conc: { v: 2, q: 'mg' },
    prep: [{ via: 'siringa', testo: 'PS Prato: 10 fiale pure (100 mg) = 50 mL (2 mg/mL)', conc: 2, q: 'mg' }],
    dosi: [{ etichetta: 'Infusione', q: 'mg', kg: true, t: 'h', min: 0.03, max: 0.6, start: 0.1, passo: 0.01 }],
    righe: ['Range della tabella del reparto 0,03–0,6 mg/kg/h (scheda tecnica: di solito 0,06–0,18 mg/kg/h). Eliminazione indipendente da rene e fegato.'],
  },
  {
    id: 'atracurio', nome: 'Atracurio', commerciale: 'Tracrium', gruppo: 'Intubazione (RSI)', frigo: true,
    fiala: 'fiale 50 mg/5 mL (10 mg/mL)', conc: { v: 10, q: 'mg' },
    prep: [{ via: 'siringa', testo: 'PS Prato: 10 fiale pure (500 mg) = 50 mL (10 mg/mL)', conc: 10, q: 'mg' }],
    dosi: [{ etichetta: 'Infusione', q: 'mg', kg: true, t: 'h', min: 0.3, max: 0.6, start: 0.3, passo: 0.05 }],
    righe: ['Libera istamina (ipotensione, broncospasmo) a dosi alte.'],
  },
  {
    id: 'sugammadex', nome: 'Sugammadex', commerciale: 'Bridion', gruppo: 'Intubazione (RSI)',
    fiala: '100 mg/mL', conc: { v: 100, q: 'mg' },
    dosi: [
      { etichetta: 'Antagonismo immediato (dopo rocuronio 1,2)', q: 'mg', kg: true, min: 16, max: 16, start: 16, passo: 1 },
      { etichetta: 'Antagonismo di routine', q: 'mg', kg: true, min: 2, max: 4, start: 2, passo: 2 },
    ],
    righe: ['Ricomparsa del blocco: 4 mg/kg.'],
  },
  // ── Agitazione ──
  {
    id: 'promazina', nome: 'Promazina', commerciale: 'Talofen', gruppo: 'Agitazione',
    fiala: 'fiale 50 mg/2 mL', conc: { v: 25, q: 'mg' },
    righe: ['50 mg IM, ripetibile dopo 30 min; massimo 300 mg/die.', 'Ev: 25–50 mg in 100 mL SF o G5% lentamente.'],
  },
  {
    id: 'olanzapina', nome: 'Olanzapina', commerciale: 'Zyprexa', gruppo: 'Agitazione',
    fiala: 'fiale 10 mg (ricostituite in 2 mL)', conc: { v: 5, q: 'mg' },
    righe: ['5–10 mg IM, ripetibile dopo 2–4 h. Massimo 20 mg/die.', 'Per os: 5–10 mg una volta al giorno, eventualmente +5 mg fino a 20 mg/die.'],
    avvisi: ['Massimo 20 mg/die. NO insieme a benzodiazepine parenterali (ipotensione, depressione respiratoria): distanziare di almeno 1 h.'],
  },
  {
    id: 'aloperidolo', nome: 'Aloperidolo', commerciale: 'Serenase', gruppo: 'Agitazione',
    fiala: 'fiale 2 mg/2 mL oppure 5 mg/2 mL',
    righe: ['Agitazione lieve: 0,5–1 mg, ripetibile; paziente agitato: 5 mg IM/ev. Massimo 20 mg/die.'],
    avvisi: ['Ev: ECG con QTc prima e monitoraggio.'],
  },
  // ── Elettroliti e metabolismo ──
  {
    id: 'potassio', nome: 'Potassio cloruro', gruppo: 'Elettroliti e metabolismo',
    fiala: 'fiale 20 mEq/10 mL (2 mEq/mL)', conc: { v: 2, q: 'mEq' },
    prep: [
      { via: 'volumetrica', testo: 'bassa concentrazione: 2 fiale (40 mEq) in 500 mL SF (periferica o centrale)', conc: 40 / 520, q: 'mEq' },
      { via: 'volumetrica', testo: 'alta concentrazione (solo centrale): 5 fiale (100 mEq) in 200 mL SF = 250 mL (togliere 50 mL dalla sacca da 250)', conc: 0.4, q: 'mEq' },
    ],
    dosi: [{ etichetta: 'Infusione', q: 'mEq', t: 'h', min: 2, max: 20, start: 5, passo: 1 }],
    avvisi: ['Periferica massimo 10 mEq/h (flebiti); centrale massimo 20 mEq/h, con monitor.'],
  },
  {
    id: 'nacl-3', nome: 'Sodio cloruro 3%', gruppo: 'Elettroliti e metabolismo',
    fiala: 'Preparazione con fiale NaCl 2 mEq/mL (20 mEq/10 mL)',
    righe: [
      'SF 500 mL, togliere 100 mL, aggiungere 10 fiale di NaCl 20 mEq: 500 mL al 3,06%.',
      'Oppure 200 mL di SF + 5 fiale = 250 mL al 3%.',
      'Iponatriemia grave sintomatica: 150 mL in 20 min, ripetibile 2–3 volte (aumento massimo 10 mmol/L nelle prime 24 h).',
    ],
  },
  {
    id: 'calcio-cloruro', nome: 'Calcio cloruro 10%', gruppo: 'Elettroliti e metabolismo',
    fiala: 'fiale 10 mL al 10% (1,36 mEq/mL; 27,2 mg/mL di calcio)', conc: { v: 1.36, q: 'mEq' },
    dosi: [{ etichetta: 'Dose (ev lenta)', q: 'mEq', kg: true, min: 0.4, max: 0.8, start: 0.4, passo: 0.1 }],
    righe: ['0,4–0,8 mEq/kg = 0,3–0,6 mL/kg al giorno.', 'Urgenza (iperkaliemia con alterazioni ECG, calcioantagonisti, ipocalcemia sintomatica): 10 mL in 5–10 min, meglio in vena centrale.'],
    avvisi: ['Necrosi se stravasa.'],
  },
  {
    id: 'calcio-gluconato', nome: 'Calcio gluconato 10%', gruppo: 'Elettroliti e metabolismo',
    fiala: 'fiale 10 mL al 10% (0,45 mEq/mL; 9 mg/mL di calcio)', conc: { v: 0.45, q: 'mEq' },
    dosi: [{ etichetta: 'Dose (ev lenta)', q: 'mEq', kg: true, min: 0.4, max: 0.8, start: 0.4, passo: 0.1 }],
    righe: ['0,4–0,8 mEq/kg = 1–2 mL/kg al giorno.', 'Urgenza: 30 mL (3 fiale) in 5–10 min, ripetibile.'],
  },
  {
    id: 'insulina', nome: 'Insulina rapida in infusione', commerciale: 'Actrapid', gruppo: 'Elettroliti e metabolismo', frigo: true,
    fiala: 'flaconi 1000 UI/10 mL (100 UI/mL)', conc: { v: 100, q: 'UI' },
    prep: [{ via: 'siringa', testo: 'PS Prato: 0,2 mL (20 UI) + 19,8 mL SF = 20 mL (1 UI/mL)', conc: 1, q: 'UI' }],
    tabella: {
      titolo: 'Iperglicemia nel paziente critico (stick ogni 1–2 h per 12 h)',
      righe: [
        ['Glicemia', 'Bolo (UI)', 'UI/h = mL/h', 'Controllo', 'GIK (G5% 500 + KCl 20 mEq)'],
        ['> 500', '10', '5', '1 h', 'no'],
        ['400–500', '8', '4', '1 h', 'no'],
        ['300–400', '5', '3', '1 h', 'no'],
        ['250–300', 'no', '2,5', '2 h', 'no'],
        ['200–250', 'no', '2', '2 h', 'no'],
        ['150–200', 'no', '1,5', '3 h', '30 mL/h'],
        ['110–150', 'no', '1', '3 h', '30 mL/h'],
        ['70–110', 'no', 'stop', '1 h', '30 mL/h'],
        ['≤ 70', 'no', 'stop', '1 h', 'G10% 30 mL/h'],
      ],
    },
    righe: ['Chetoacidosi: seguire lo schema dedicato (0,1 UI/kg/h a dose fissa).', 'Soluzione tamponata: 5 g di glucosio per 1 UI (2,5 g/UI nei diabetici). Iperkaliemia: 10 UI in 500 mL G5% in 15 min (o 25 g di glucosio).'],
  },
  // ── Gastro e diuretici ──
  {
    id: 'omeprazolo', nome: 'Omeprazolo', commerciale: 'Antra', gruppo: 'Gastro e diuretici',
    fiala: 'fiale 40 mg (polvere)',
    prep: [{ via: 'siringa', testo: 'PS Prato: 5 fiale (200 mg) in 50 mL SF (4 mg/mL)', conc: 4, q: 'mg' }],
    dosi: [
      { etichetta: 'Bolo in 15 min (2 fiale)', q: 'mg', min: 80, max: 80, start: 80, passo: 40 },
      { etichetta: 'Infusione', q: 'mg', t: 'h', min: 8, max: 8, start: 8, passo: 1 },
    ],
    righe: ['8 mg/h = 2 mL/h (la tabella del reparto indica 2,1 mL/h). Per 72 h dopo emostasi endoscopica ad alto rischio.'],
  },
  {
    id: 'pantoprazolo', nome: 'Pantoprazolo', commerciale: 'Pantorc', gruppo: 'Gastro e diuretici',
    fiala: 'flaconi 40 mg liofilizzato (precipita in 12 h)',
    prep: [
      { via: 'volumetrica', testo: '2 fiale in 100 mL SF (0,8 mg/mL)', conc: 0.8, q: 'mg' },
      { via: 'volumetrica', testo: '2 fiale in 250 mL SF (0,32 mg/mL)', conc: 0.32, q: 'mg' },
    ],
    dosi: [{ etichetta: 'Infusione dopo bolo di 80 mg in 15 min', q: 'mg', t: 'h', min: 8, max: 8, start: 8, passo: 1 }],
    righe: ['Per 72 h dopo emostasi endoscopica ad alto rischio.'],
  },
  {
    id: 'somatostatina', nome: 'Somatostatina', gruppo: 'Gastro e diuretici',
    fiala: 'fiale 3 mg (attenzione: esistono anche da 1 mg)',
    prep: [{ via: 'volumetrica', testo: '1 fiala da 3 mg in 250 mL SF (12 mcg/mL)', conc: 12, q: 'mcg' }],
    dosi: [
      { etichetta: 'Bolo', q: 'mcg', min: 250, max: 250, start: 250, passo: 50, prep: [0] },
      { etichetta: 'Infusione', q: 'mcg', t: 'h', min: 250, max: 500, start: 250, passo: 50 },
    ],
    righe: ['Per 3–5 giorni.'],
  },
  {
    id: 'octreotide', nome: 'Octreotide', commerciale: 'Bioindustria L.I.M.', gruppo: 'Gastro e diuretici', frigo: true,
    fiala: 'fiale 0,1 mg/1 mL (100 mcg), sc o ev', conc: { v: 100, q: 'mcg' },
    prep: [{ via: 'siringa', testo: '5 fiale (500 mcg) + 45 mL SF = 50 mL (10 mcg/mL)', conc: 10, q: 'mcg' }],
    dosi: [
      { etichetta: 'Bolo', q: 'mcg', min: 50, max: 50, start: 50, passo: 50, prep: [0] },
      { etichetta: 'Infusione', q: 'mcg', t: 'h', min: 50, max: 50, start: 50, passo: 10 },
    ],
    righe: ['Bolo 50 mcg = ½ fiala; infusione 50 mcg/h = 5 mL/h, per 3–5 giorni (varici: preferirla alla terlipressina se rischio ischemico).', 'Ipoglicemia da sulfaniluree: 50–100 mcg sc ogni 6–8 h.'],
  },
  {
    id: 'furosemide', nome: 'Furosemide', commerciale: 'Lasix', gruppo: 'Gastro e diuretici', foto: true,
    fiala: 'fiale 250 mg/25 mL (10 mg/mL)', conc: { v: 10, q: 'mg' },
    prep: [{ via: 'siringa', testo: '2 fiale pure (10 mg/mL)', conc: 10, q: 'mg' }],
    dosi: [
      { etichetta: 'Bolo ev (massimo 4 mg/min)', q: 'mg', min: 10, max: 200, start: 40, passo: 10 },
      { etichetta: 'Infusione', q: 'mg', t: 'h', min: 10, max: 40, start: 10, passo: 5 },
    ],
    righe: ['Alte dosi: 1 fiala in 225 mL di Ringer lattato in 1 h; se senza effetto 2 fiale pure a 2–4 mg/min (12–24 mL/h).', 'Insufficienza renale grave: dosi più alte possono servire per avere effetto; ototossicità oltre 4 mg/min.'],
  },
  {
    id: 'etacrinico', nome: 'Acido etacrinico', commerciale: 'Reomax', gruppo: 'Gastro e diuretici',
    fiala: 'flaconi liofilizzati 50 mg (in 20 mL)',
    righe: ['0,5–1 mg/kg (di solito 50 mg) in 20–40 mL di G5% in infusione ev lenta (diversi minuti).'],
  },
]

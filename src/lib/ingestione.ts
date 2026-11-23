/*
 * Farmaci per la maschera «Ingestione multipla» dell'area Tossicologia.
 * Per ogni farmaco: cosa aspettarsi, tempi, cosa monitorare, terapia mirata e i «marcatori» di effetto
 * con cui si calcolano le interazioni. Niente soglie di dose: per la gravità del singolo caso → CAV.
 * Dosi delle terapie per adulto di 70 kg, coerenti con i PDTA dell'app.
 */

export type Effetto =
  | 'sedazione' | 'respiro' | 'serotoninergico' | 'qt' | 'qrs' | 'anticolinergico'
  | 'bradicardia' | 'ipotensione' | 'convulsioni' | 'ipoglicemia' | 'sanguinamento'
  | 'fegato' | 'rene' | 'iperkaliemia' | 'acidosi'

export const EFFETTI: Record<Effetto, { nome: string; monitor: string }> = {
  sedazione: { nome: 'Depressione del SNC', monitor: 'GCS seriato, protezione vie aeree' },
  respiro: { nome: 'Depressione respiratoria', monitor: 'FR, SpO₂, EtCO₂ o pCO₂ su EGA' },
  serotoninergico: { nome: 'Tossicità serotoninergica', monitor: 'Clono (inducibile, oculare), riflessi, temperatura' },
  qt: { nome: 'QT lungo / torsioni', monitor: 'ECG seriati (QTc), K e Mg nella norma alta' },
  qrs: { nome: 'Blocco dei canali del sodio (QRS largo)', monitor: 'ECG ogni ora: QRS, R in aVR' },
  anticolinergico: { nome: 'Sindrome anticolinergica', monitor: 'Delirium, globo vescicale, temperatura, FC' },
  bradicardia: { nome: 'Bradicardia / blocchi AV', monitor: 'Monitor ECG continuo, PA' },
  ipotensione: { nome: 'Ipotensione', monitor: 'PA ogni 15 min (cruenta se instabile), diuresi, lattati' },
  convulsioni: { nome: 'Convulsioni', monitor: 'Osservazione neurologica; diazepam pronto' },
  ipoglicemia: { nome: 'Ipoglicemia', monitor: 'Glicemia capillare ogni ora (anche di notte)' },
  sanguinamento: { nome: 'Rischio emorragico', monitor: 'Emocromo, INR/aPTT, segni di sanguinamento' },
  fegato: { nome: 'Epatotossicità', monitor: 'ALT, INR, bilirubina all’ingresso e a 24 h' },
  rene: { nome: 'Danno renale / ridotta eliminazione', monitor: 'Creatinina, diuresi' },
  iperkaliemia: { nome: 'Iperkaliemia', monitor: 'K seriato, ECG' },
  acidosi: { nome: 'Acidosi metabolica', monitor: 'EGA con lattati e gap anionico' },
}

export type Carbone = 'si' | 'no' | 'ripetuto'

export interface Farmaco {
  id: string
  nome: string
  /** Nomi commerciali (per la ricerca e tra parentesi). */
  commerciali: string[]
  classe: string
  /** mg per compressa più comuni (il primo è il predefinito). */
  dosaggi?: number[]
  /** Forma liquida: mg/mL. */
  mgMl?: number
  /** Associazione: mg di ciascun componente per compressa. */
  componenti?: { id: string; mg: number }[]
  /** Somministrato in UI (insulina). */
  ui?: boolean
  effetti: Effetto[]
  aspettarsi: string[]
  tempi: string
  monitorare: string[]
  terapia: string[]
  carbone: Carbone
  notaCarbone?: string
  dialisi?: string
  sindrome?: string
  pdta?: { etichetta: string; to: string }
}

const PDTA = {
  paracetamolo: { etichetta: 'Paracetamolo', to: '/linee-guida/paracetamolo' },
  oppioidi: { etichetta: 'Oppioidi e benzodiazepine', to: '/linee-guida/oppioidi-benzodiazepine' },
  triciclici: { etichetta: 'Triciclici / bloccanti Na', to: '/linee-guida/triciclici' },
  bbcca: { etichetta: 'Beta-bloccanti e calcio-antagonisti', to: '/linee-guida/betabloccanti-calcioantagonisti' },
  salicilati: { etichetta: 'Salicilati', to: '/linee-guida/salicilati' },
  litio: { etichetta: 'Litio', to: '/linee-guida/litio' },
  serotonina: { etichetta: 'Serotoninergica e SNM', to: '/linee-guida/serotoninergica-snm' },
  digossina: { etichetta: 'Digossina', to: '/linee-guida/digossina' },
  anticoagulati: { etichetta: 'Anticoagulato che sanguina', to: '/linee-guida/anticoagulato-sanguinamento' },
  statoMale: { etichetta: 'Stato di male', to: '/linee-guida/stato-di-male' },
}

const BZD_ASPETTARSI = [
  'Sonnolenza fino al coma «tranquillo» con parametri vitali conservati; atassia, disartria.',
  'Da sole raramente gravi: la depressione respiratoria è data dalle co-ingestioni (alcol, oppioidi, altri sedativi) e dall’età.',
  'Coma profondo o instabilità emodinamica → cercare un’altra causa o un altro farmaco.',
]
const BZD_MONITOR = ['GCS, FR, SpO₂ (EtCO₂ se sedato)', 'Glicemia, etanolemia, paracetamolemia di routine', 'Ab ingestis']
const BZD_TERAPIA = [
  'Supporto: vie aeree e ventilazione; decubito laterale.',
  'Flumazenil (Anexate) solo se nessun rischio convulsivo (no uso cronico di BZD, no triciclici/proconvulsivanti, no epilessia): 0,2 mg ev, poi 0,1 mg/min fino a 1 mg.',
]

const SSRI_ASPETTARSI = [
  'Spesso pochi sintomi: nausea, vomito, tremore, tachicardia, sonnolenza o agitazione.',
  'Rischio di sindrome serotoninergica, soprattutto se associati ad altri serotoninergici.',
]
const SSRI_TERAPIA = [
  'Supporto; benzodiazepine (diazepam 5–10 mg ev) per agitazione, tremore, clono.',
  'Sindrome serotoninergica moderata-grave: ciproeptadina (Periactin) 12 mg per os/SNG, poi 2 mg ogni 2 h; ipertermia > 41 °C → sedazione, curarizzazione, intubazione.',
]

export const FARMACI: Farmaco[] = [
  // ——— Analgesici
  {
    id: 'paracetamolo', nome: 'Paracetamolo', commerciali: ['Tachipirina', 'Efferalgan'], classe: 'Analgesico', dosaggi: [500, 1000],
    effetti: ['fegato'],
    aspettarsi: [
      'Nelle prime 24 h spesso asintomatico o solo nausea e vomito: l’assenza di sintomi non rassicura.',
      'Epatite da 24–72 h (ALT in salita, dolore all’ipocondrio destro), picco a 72–96 h; possibile insufficienza epatica e renale.',
      'Ingestioni massive: coma e acidosi lattica precoci.',
    ],
    tempi: 'Picco plasmatico 1–2 h (più tardi con rilascio modificato o con oppioidi/anticolinergici associati). Paracetamolemia a 4 h.',
    monitorare: ['Paracetamolemia a 4 h (o appena possibile dopo)', 'ALT, INR, creatinina, glicemia, EGA con lattati; ripetere a fine NAC'],
    terapia: [
      'N-acetilcisteina (Hidonac) a due sacche secondo il nomogramma o subito se ora ignota, assunzioni ripetute, rilascio modificato o arrivo oltre 8 h.',
    ],
    carbone: 'si', notaCarbone: 'Entro 2 h (fino a 4 h nelle ingestioni grandi o a rilascio modificato).',
    pdta: PDTA.paracetamolo,
  },
  {
    id: 'ibuprofene', nome: 'Ibuprofene', commerciali: ['Moment', 'Brufen', 'Nurofen'], classe: 'FANS', dosaggi: [400, 200, 600, 800],
    effetti: ['rene', 'acidosi', 'sanguinamento'],
    aspettarsi: [
      'Di solito nausea, vomito, epigastralgia.',
      'Ingestioni grandi: sopore, convulsioni, acidosi metabolica, ipotensione, danno renale acuto.',
    ],
    tempi: 'Sintomi entro 4 h; se asintomatico a 4–6 h il rischio è basso.',
    monitorare: ['Creatinina, K', 'EGA con gap anionico se sintomatico', 'Emocromo se dolore epigastrico o melena'],
    terapia: ['Supporto; IPP (pantoprazolo 40 mg ev) se sintomi gastrici.', 'Convulsioni: diazepam.'],
    carbone: 'si',
  },
  {
    id: 'ketoprofene', nome: 'Ketoprofene', commerciali: ['Oki', 'Orudis'], classe: 'FANS', dosaggi: [80, 50, 200],
    effetti: ['rene', 'sanguinamento'],
    aspettarsi: ['Disturbi gastrointestinali; raramente sopore, convulsioni, danno renale nelle ingestioni grandi.'],
    tempi: 'Sintomi entro 4 h.',
    monitorare: ['Creatinina, K', 'Emocromo se dolore epigastrico o melena'],
    terapia: ['Supporto; IPP.'],
    carbone: 'si',
  },
  {
    id: 'diclofenac', nome: 'Diclofenac', commerciali: ['Voltaren', 'Dicloreum'], classe: 'FANS', dosaggi: [75, 50, 100, 150],
    effetti: ['rene', 'sanguinamento'],
    aspettarsi: ['Disturbi gastrointestinali; raramente sopore, convulsioni, danno renale o epatico.'],
    tempi: 'Sintomi entro 4 h.',
    monitorare: ['Creatinina, K, ALT'],
    terapia: ['Supporto; IPP.'],
    carbone: 'si',
  },
  {
    id: 'naprossene', nome: 'Naprossene', commerciali: ['Momendol', 'Synflex'], classe: 'FANS', dosaggi: [220, 550],
    effetti: ['rene', 'sanguinamento'],
    aspettarsi: ['Disturbi gastrointestinali; raramente convulsioni, acidosi, danno renale.'],
    tempi: 'Sintomi entro 4 h.',
    monitorare: ['Creatinina, K'],
    terapia: ['Supporto; IPP.'],
    carbone: 'si',
  },
  {
    id: 'nimesulide', nome: 'Nimesulide', commerciali: ['Aulin'], classe: 'FANS', dosaggi: [100],
    effetti: ['rene', 'fegato'],
    aspettarsi: ['Disturbi gastrointestinali; possibile epatotossicità.'],
    tempi: 'Sintomi gastrici entro 4 h; transaminasi a 24–48 h.',
    monitorare: ['ALT, creatinina'],
    terapia: ['Supporto; IPP.'],
    carbone: 'si',
  },
  {
    id: 'asa', nome: 'Acido acetilsalicilico', commerciali: ['Aspirina', 'Cardioaspirin'], classe: 'Salicilato', dosaggi: [500, 100, 300],
    effetti: ['acidosi', 'sanguinamento', 'convulsioni'],
    aspettarsi: [
      'Tinnito, ipoacusia, nausea, vomito, iperpnea (alcalosi respiratoria), poi acidosi metabolica a gap aumentato.',
      'Gravità: alterazione della coscienza, febbre, edema polmonare non cardiogeno, convulsioni.',
      'L’intubazione può far precipitare: se inevitabile, iperventilare.',
    ],
    tempi: 'Assorbimento lento e irregolare (bezoar, gastroprotetta): livelli in salita fino a 12–24 h; salicilemia ogni 2 h.',
    monitorare: ['Salicilemia ogni 2 h fino a due valori in calo', 'EGA, gap anionico, K, glicemia, creatinina', 'pH urinario durante alcalinizzazione'],
    terapia: ['Bicarbonato in bolo e poi in infusione (pH urine 7,5–8), K 4–4,5.', 'Criteri EXTRIP → emodialisi.'],
    carbone: 'si', notaCarbone: 'Utile anche dopo 2 h (assorbimento prolungato).',
    dialisi: 'Sì (EXTRIP).',
    pdta: PDTA.salicilati,
  },
  {
    id: 'ketorolac', nome: 'Ketorolac', commerciali: ['Toradol', 'Lixidol'], classe: 'FANS', dosaggi: [10],
    effetti: ['rene', 'sanguinamento'],
    aspettarsi: ['Disturbi gastrointestinali, sanguinamento digestivo, danno renale.'],
    tempi: 'Sintomi entro 4 h.',
    monitorare: ['Creatinina, K, emocromo'],
    terapia: ['Supporto; IPP.'],
    carbone: 'si',
  },

  // ——— Oppioidi
  {
    id: 'tramadolo', nome: 'Tramadolo', commerciali: ['Contramal', 'Fortradol'], classe: 'Oppioide', dosaggi: [50, 100, 150, 200], mgMl: 100,
    effetti: ['sedazione', 'respiro', 'convulsioni', 'serotoninergico'],
    aspettarsi: [
      'Sopore, miosi, depressione respiratoria (meno marcata degli altri oppioidi).',
      'Convulsioni frequenti, anche senza coma.',
      'Tossicità serotoninergica (inibisce la ricaptazione di serotonina e noradrenalina), tachicardia, ipertensione.',
    ],
    tempi: 'Picco 2–3 h; convulsioni di solito entro 6 h (più tardi con rilascio prolungato).',
    monitorare: ['FR, SpO₂, GCS', 'Clono e temperatura', 'Glicemia, Na'],
    terapia: [
      'Naloxone (Narcan) a piccole dosi se depressione respiratoria (può slatentizzare le convulsioni).',
      'Convulsioni: diazepam 10 mg ev.',
      'Serotoninergica: benzodiazepine, ciproeptadina.',
    ],
    carbone: 'si', sindrome: 'oppioide', pdta: PDTA.oppioidi,
  },
  {
    id: 'tapentadolo', nome: 'Tapentadolo', commerciali: ['Palexia'], classe: 'Oppioide', dosaggi: [50, 100, 150, 200, 250],
    effetti: ['sedazione', 'respiro', 'serotoninergico', 'convulsioni'],
    aspettarsi: ['Sindrome oppioide; possibili convulsioni e tossicità serotoninergica.'],
    tempi: 'Formulazioni a rilascio prolungato: effetto per molte ore.',
    monitorare: ['FR, SpO₂, GCS', 'Clono'],
    terapia: ['Naloxone; osservazione prolungata se rilascio prolungato.'],
    carbone: 'si', sindrome: 'oppioide', pdta: PDTA.oppioidi,
  },
  {
    id: 'ossicodone', nome: 'Ossicodone', commerciali: ['OxyContin', 'Targin (con naloxone)'], classe: 'Oppioide', dosaggi: [10, 5, 20, 40],
    effetti: ['sedazione', 'respiro'],
    aspettarsi: ['Sindrome oppioide: miosi, coma, bradipnea; ipotensione, ipotermia, edema polmonare non cardiogeno.'],
    tempi: 'Rilascio prolungato: depressione respiratoria ricorrente per 12–24 h.',
    monitorare: ['FR, SpO₂, EtCO₂, GCS'],
    terapia: ['Naloxone (Narcan) 0,04–0,1 mg ev ripetuti fino a FR ≥ 10; infusione con 2/3 della dose efficace all’ora.'],
    carbone: 'si', sindrome: 'oppioide', pdta: PDTA.oppioidi,
  },
  {
    id: 'morfina', nome: 'Morfina', commerciali: ['MS Contin', 'Oramorph'], classe: 'Oppioide', dosaggi: [10, 30, 60], mgMl: 2,
    effetti: ['sedazione', 'respiro', 'ipotensione'],
    aspettarsi: ['Sindrome oppioide; accumulo del metabolita attivo nell’insufficienza renale.'],
    tempi: 'Rilascio immediato 4–6 h; rilascio prolungato fino a 24 h.',
    monitorare: ['FR, SpO₂, EtCO₂, GCS', 'Creatinina'],
    terapia: ['Naloxone.'],
    carbone: 'si', sindrome: 'oppioide', pdta: PDTA.oppioidi,
  },
  {
    id: 'codeina', nome: 'Codeina', commerciali: [], classe: 'Oppioide', dosaggi: [30],
    effetti: ['sedazione', 'respiro'],
    aspettarsi: ['Sindrome oppioide (variabile: metabolizzatori rapidi più tossici). Quasi sempre associata a paracetamolo.'],
    tempi: 'Picco 1–2 h.',
    monitorare: ['FR, SpO₂, GCS', 'Paracetamolemia se associazione'],
    terapia: ['Naloxone.'],
    carbone: 'si', sindrome: 'oppioide', pdta: PDTA.oppioidi,
  },
  {
    id: 'metadone', nome: 'Metadone', commerciali: ['Eptadone'], classe: 'Oppioide', mgMl: 1, dosaggi: [5, 10, 40],
    effetti: ['sedazione', 'respiro', 'qt'],
    aspettarsi: ['Sindrome oppioide molto prolungata; QT lungo e torsioni.'],
    tempi: 'Emivita 15–60 h: la depressione respiratoria torna dopo l’effetto del naloxone. Osservazione ≥ 24 h.',
    monitorare: ['FR, SpO₂, EtCO₂, GCS', 'ECG con QTc, K, Mg'],
    terapia: ['Naloxone in boli poi infusione.', 'Torsioni: magnesio solfato 2 g ev.'],
    carbone: 'si', sindrome: 'oppioide', pdta: PDTA.oppioidi,
  },
  {
    id: 'buprenorfina', nome: 'Buprenorfina', commerciali: ['Subutex', 'Suboxone (con naloxone)'], classe: 'Oppioide (agonista parziale)', dosaggi: [8, 2],
    effetti: ['sedazione', 'respiro'],
    aspettarsi: ['Nell’adulto tollerante depressione respiratoria limitata (effetto tetto), ma grave se associata a BZD o alcol o nel naïve.'],
    tempi: 'Lunga durata.',
    monitorare: ['FR, SpO₂, GCS'],
    terapia: ['Naloxone: possono servire dosi più alte (2–4 mg) e infusione.'],
    carbone: 'si', sindrome: 'oppioide', pdta: PDTA.oppioidi,
  },

  // ——— Benzodiazepine e ipnotici
  { id: 'alprazolam', nome: 'Alprazolam', commerciali: ['Xanax'], classe: 'Benzodiazepina', dosaggi: [0.5, 0.25, 1, 2], mgMl: 0.75, effetti: ['sedazione', 'respiro'], aspettarsi: BZD_ASPETTARSI, tempi: 'Picco 1–2 h; durata breve-intermedia (rilascio prolungato più a lungo).', monitorare: BZD_MONITOR, terapia: BZD_TERAPIA, carbone: 'si', notaCarbone: 'Solo se vie aeree protette: da sole raramente giustificano il carbone.', sindrome: 'sedativo', pdta: PDTA.oppioidi },
  { id: 'lorazepam', nome: 'Lorazepam', commerciali: ['Tavor', 'Control'], classe: 'Benzodiazepina', dosaggi: [1, 2.5], effetti: ['sedazione', 'respiro'], aspettarsi: BZD_ASPETTARSI, tempi: 'Picco 2 h; durata intermedia.', monitorare: BZD_MONITOR, terapia: BZD_TERAPIA, carbone: 'si', notaCarbone: 'Solo se vie aeree protette.', sindrome: 'sedativo', pdta: PDTA.oppioidi },
  { id: 'diazepam', nome: 'Diazepam', commerciali: ['Valium'], classe: 'Benzodiazepina', dosaggi: [5, 2, 10], mgMl: 5, effetti: ['sedazione', 'respiro'], aspettarsi: BZD_ASPETTARSI, tempi: 'Picco 1 h; metaboliti attivi a lunga emivita (sedazione prolungata nell’anziano).', monitorare: BZD_MONITOR, terapia: BZD_TERAPIA, carbone: 'si', notaCarbone: 'Solo se vie aeree protette.', sindrome: 'sedativo', pdta: PDTA.oppioidi },
  { id: 'delorazepam', nome: 'Delorazepam', commerciali: ['En'], classe: 'Benzodiazepina', dosaggi: [1, 0.5, 2], mgMl: 1, effetti: ['sedazione', 'respiro'], aspettarsi: BZD_ASPETTARSI, tempi: 'Emivita molto lunga: sedazione prolungata.', monitorare: BZD_MONITOR, terapia: BZD_TERAPIA, carbone: 'si', notaCarbone: 'Solo se vie aeree protette.', sindrome: 'sedativo', pdta: PDTA.oppioidi },
  { id: 'lormetazepam', nome: 'Lormetazepam', commerciali: ['Minias'], classe: 'Benzodiazepina', dosaggi: [1, 2], mgMl: 2.5, effetti: ['sedazione', 'respiro'], aspettarsi: BZD_ASPETTARSI, tempi: 'Durata intermedia.', monitorare: BZD_MONITOR, terapia: BZD_TERAPIA, carbone: 'si', notaCarbone: 'Solo se vie aeree protette.', sindrome: 'sedativo', pdta: PDTA.oppioidi },
  { id: 'clonazepam', nome: 'Clonazepam', commerciali: ['Rivotril'], classe: 'Benzodiazepina', dosaggi: [0.5, 2], mgMl: 2.5, effetti: ['sedazione', 'respiro'], aspettarsi: BZD_ASPETTARSI, tempi: 'Emivita lunga.', monitorare: BZD_MONITOR, terapia: BZD_TERAPIA, carbone: 'si', notaCarbone: 'Solo se vie aeree protette.', sindrome: 'sedativo', pdta: PDTA.oppioidi },
  { id: 'bromazepam', nome: 'Bromazepam', commerciali: ['Lexotan'], classe: 'Benzodiazepina', dosaggi: [3, 1.5, 6], mgMl: 2.5, effetti: ['sedazione', 'respiro'], aspettarsi: BZD_ASPETTARSI, tempi: 'Durata intermedia.', monitorare: BZD_MONITOR, terapia: BZD_TERAPIA, carbone: 'si', notaCarbone: 'Solo se vie aeree protette.', sindrome: 'sedativo', pdta: PDTA.oppioidi },
  { id: 'triazolam', nome: 'Triazolam', commerciali: ['Halcion'], classe: 'Benzodiazepina', dosaggi: [0.25, 0.125], effetti: ['sedazione', 'respiro'], aspettarsi: BZD_ASPETTARSI, tempi: 'Breve durata.', monitorare: BZD_MONITOR, terapia: BZD_TERAPIA, carbone: 'si', notaCarbone: 'Solo se vie aeree protette.', sindrome: 'sedativo', pdta: PDTA.oppioidi },
  { id: 'zolpidem', nome: 'Zolpidem', commerciali: ['Stilnox'], classe: 'Ipnotico Z', dosaggi: [10], effetti: ['sedazione', 'respiro'], aspettarsi: ['Come le benzodiazepine: sonnolenza, coma; talvolta agitazione o allucinazioni.'], tempi: 'Breve durata (poche ore).', monitorare: BZD_MONITOR, terapia: BZD_TERAPIA, carbone: 'si', notaCarbone: 'Solo se vie aeree protette.', sindrome: 'sedativo', pdta: PDTA.oppioidi },

  // ——— Antidepressivi
  { id: 'sertralina', nome: 'Sertralina', commerciali: ['Zoloft', 'Tatig'], classe: 'SSRI', dosaggi: [50, 100], effetti: ['serotoninergico'], aspettarsi: SSRI_ASPETTARSI, tempi: 'Sintomi entro 6 h.', monitorare: ['Clono, temperatura', 'ECG'], terapia: SSRI_TERAPIA, carbone: 'si', sindrome: 'serotoninergico', pdta: PDTA.serotonina },
  { id: 'paroxetina', nome: 'Paroxetina', commerciali: ['Daparox', 'Sereupin', 'Seroxat'], classe: 'SSRI', dosaggi: [20], mgMl: 10, effetti: ['serotoninergico'], aspettarsi: SSRI_ASPETTARSI, tempi: 'Sintomi entro 6 h.', monitorare: ['Clono, temperatura', 'ECG'], terapia: SSRI_TERAPIA, carbone: 'si', sindrome: 'serotoninergico', pdta: PDTA.serotonina },
  { id: 'fluoxetina', nome: 'Fluoxetina', commerciali: ['Prozac', 'Fluoxeren'], classe: 'SSRI', dosaggi: [20], effetti: ['serotoninergico'], aspettarsi: SSRI_ASPETTARSI, tempi: 'Emivita lunga (giorni): rischio di interazioni serotoninergiche prolungato.', monitorare: ['Clono, temperatura', 'ECG'], terapia: SSRI_TERAPIA, carbone: 'si', sindrome: 'serotoninergico', pdta: PDTA.serotonina },
  {
    id: 'citalopram', nome: 'Citalopram', commerciali: ['Elopram', 'Seropram'], classe: 'SSRI', dosaggi: [20, 40], mgMl: 40,
    effetti: ['serotoninergico', 'qt', 'convulsioni'],
    aspettarsi: [...SSRI_ASPETTARSI, 'QT lungo dose-dipendente, anche tardivo; convulsioni.'],
    tempi: 'Allungamento del QT anche dopo molte ore (picco 6–24 h): ECG seriati.',
    monitorare: ['ECG con QTc all’ingresso e seriati per almeno 12–24 h', 'K, Mg', 'Clono, temperatura'],
    terapia: [...SSRI_TERAPIA, 'QT lungo: K > 4, magnesio solfato 2 g ev; torsioni → magnesio, overdrive.'],
    carbone: 'si', sindrome: 'serotoninergico', pdta: PDTA.serotonina,
  },
  {
    id: 'escitalopram', nome: 'Escitalopram', commerciali: ['Cipralex', 'Entact'], classe: 'SSRI', dosaggi: [10, 20], mgMl: 20,
    effetti: ['serotoninergico', 'qt', 'convulsioni'],
    aspettarsi: [...SSRI_ASPETTARSI, 'QT lungo dose-dipendente; convulsioni.'],
    tempi: 'QT anche tardivo: ECG seriati.',
    monitorare: ['ECG con QTc seriati', 'K, Mg', 'Clono, temperatura'],
    terapia: [...SSRI_TERAPIA, 'QT lungo: K > 4, magnesio solfato 2 g ev.'],
    carbone: 'si', sindrome: 'serotoninergico', pdta: PDTA.serotonina,
  },
  {
    id: 'venlafaxina', nome: 'Venlafaxina', commerciali: ['Efexor', 'Faxine'], classe: 'SNRI', dosaggi: [75, 37.5, 150],
    effetti: ['serotoninergico', 'convulsioni', 'qrs', 'qt'],
    aspettarsi: [
      'Tachicardia, ipertensione o ipotensione, midriasi, agitazione.',
      'Convulsioni frequenti; tossicità serotoninergica.',
      'Ingestioni grandi: QRS largo, QT lungo, aritmie, cardiomiopatia (rara).',
    ],
    tempi: 'Formulazioni a rilascio prolungato: convulsioni e aritmie fino a 12–24 h.',
    monitorare: ['ECG seriati: QRS e QTc', 'Clono, temperatura', 'CK'],
    terapia: ['Convulsioni: diazepam.', 'QRS > 100 ms: bicarbonato come nei triciclici.', 'Serotoninergica: benzodiazepine, ciproeptadina.'],
    carbone: 'si', sindrome: 'serotoninergico', pdta: PDTA.serotonina,
  },
  {
    id: 'duloxetina', nome: 'Duloxetina', commerciali: ['Cymbalta', 'Xeristar'], classe: 'SNRI', dosaggi: [60, 30],
    effetti: ['serotoninergico', 'convulsioni'],
    aspettarsi: ['Sonnolenza, tachicardia, tremore, tossicità serotoninergica; raramente convulsioni.'],
    tempi: 'Sintomi entro 6–8 h.',
    monitorare: ['Clono, temperatura', 'ECG'],
    terapia: SSRI_TERAPIA,
    carbone: 'si', sindrome: 'serotoninergico', pdta: PDTA.serotonina,
  },
  {
    id: 'mirtazapina', nome: 'Mirtazapina', commerciali: ['Remeron', 'Mirtazapina'], classe: 'Antidepressivo NaSSA', dosaggi: [30, 15, 45],
    effetti: ['sedazione'],
    aspettarsi: ['Sonnolenza, tachicardia lieve; di solito decorso benigno. Contribuisce alla tossicità serotoninergica in associazione.'],
    tempi: 'Sintomi entro 6 h.',
    monitorare: ['GCS, FC'],
    terapia: ['Supporto.'],
    carbone: 'si', sindrome: 'sedativo',
  },
  {
    id: 'trazodone', nome: 'Trazodone', commerciali: ['Trittico'], classe: 'Antidepressivo SARI', dosaggi: [75, 50, 100, 150], mgMl: 25,
    effetti: ['sedazione', 'ipotensione', 'qt', 'serotoninergico'],
    aspettarsi: ['Sonnolenza, ipotensione ortostatica (alfa-blocco), QT lungo; priapismo.'],
    tempi: 'Picco 1–2 h (rilascio prolungato più tardi).',
    monitorare: ['PA', 'ECG con QTc', 'GCS'],
    terapia: ['Liquidi, noradrenalina se ipotensione persistente.', 'QT lungo: K, magnesio.', 'Priapismo > 4 h: urologo.'],
    carbone: 'si', sindrome: 'sedativo',
  },
  {
    id: 'vortioxetina', nome: 'Vortioxetina', commerciali: ['Brintellix'], classe: 'Antidepressivo multimodale', dosaggi: [10, 5, 20],
    effetti: ['serotoninergico'],
    aspettarsi: ['Nausea, vomito, vertigini; contribuisce alla tossicità serotoninergica.'],
    tempi: 'Emivita lunga.',
    monitorare: ['Clono, temperatura'],
    terapia: SSRI_TERAPIA,
    carbone: 'si', sindrome: 'serotoninergico', pdta: PDTA.serotonina,
  },
  {
    id: 'bupropione', nome: 'Bupropione', commerciali: ['Wellbutrin', 'Elontril', 'Zyban'], classe: 'Antidepressivo NDRI', dosaggi: [150, 300],
    effetti: ['convulsioni', 'qrs', 'qt'],
    aspettarsi: ['Agitazione, tachicardia, tremori; convulsioni frequenti, anche ripetute; QRS largo e QT lungo nelle ingestioni grandi.'],
    tempi: 'Rilascio prolungato (XR): convulsioni fino a 24 h dopo. Osservazione ≥ 24 h.',
    monitorare: ['ECG seriati: QRS e QTc', 'Osservazione neurologica'],
    terapia: ['Convulsioni: benzodiazepine (diazepam), poi propofol o fenobarbitale.', 'QRS largo: bicarbonato.'],
    carbone: 'si', sindrome: 'simpaticomimetico',
  },
  {
    id: 'amitriptilina', nome: 'Amitriptilina', commerciali: ['Laroxyl'], classe: 'Triciclico', dosaggi: [25, 10], mgMl: 40,
    effetti: ['qrs', 'qt', 'anticolinergico', 'convulsioni', 'ipotensione', 'sedazione'],
    aspettarsi: [
      'Peggiora in fretta: sopore → coma, convulsioni, ipotensione, aritmie ventricolari.',
      'Segni anticolinergici (tachicardia, midriasi, cute secca, ritenzione urinaria).',
      'ECG: QRS > 100 ms, R in aVR > 3 mm.',
    ],
    tempi: 'Gravità entro 6 h: se a 6 h ECG normale e paziente asintomatico, rischio basso.',
    monitorare: ['ECG ogni ora: QRS, R in aVR, QTc', 'EGA, K, glicemia', 'PA'],
    terapia: [
      'QRS > 100 ms, aritmie o ipotensione: bicarbonato 8,4% 70–140 mL in bolo, ripetere; pH 7,45–7,55.',
      'Convulsioni: diazepam. NO flumazenil, fisostigmina, flecainide, propafenone.',
    ],
    carbone: 'si', sindrome: 'anticolinergico', pdta: PDTA.triciclici,
  },
  {
    id: 'clomipramina', nome: 'Clomipramina', commerciali: ['Anafranil'], classe: 'Triciclico', dosaggi: [25, 75],
    effetti: ['qrs', 'qt', 'anticolinergico', 'convulsioni', 'ipotensione', 'sedazione', 'serotoninergico'],
    aspettarsi: ['Come gli altri triciclici; in più forte azione serotoninergica.'],
    tempi: 'Gravità entro 6 h.',
    monitorare: ['ECG ogni ora: QRS, R in aVR, QTc', 'EGA, K', 'Clono, temperatura'],
    terapia: ['Bicarbonato se QRS largo; diazepam per convulsioni. NO flumazenil, fisostigmina.'],
    carbone: 'si', sindrome: 'anticolinergico', pdta: PDTA.triciclici,
  },
  {
    id: 'litio', nome: 'Litio carbonato', commerciali: ['Carbolithium'], classe: 'Stabilizzatore dell’umore', dosaggi: [300, 150],
    effetti: ['convulsioni', 'rene', 'qt'],
    aspettarsi: [
      'Acuta: nausea, vomito, diarrea; neurotossicità tardiva (tremore, atassia, confusione, mioclonie, convulsioni).',
      'Acuta su cronica (pazienti in terapia): la più pericolosa, neurotossicità anche con livelli moderati.',
      'Bradicardia, QT lungo; diabete insipido nefrogenico.',
    ],
    tempi: 'Rilascio prolungato: picco ritardato (fino a 12 h e oltre). Litiemia all’ingresso e ogni 4–6 h.',
    monitorare: ['Litiemia seriata', 'Creatinina, Na, diuresi', 'ECG', 'Esame neurologico'],
    terapia: ['Soluzione fisiologica per euvolemia (attenzione al Na).', 'Irrigazione intestinale totale per il rilascio prolungato.', 'Criteri EXTRIP → emodialisi.'],
    carbone: 'no', notaCarbone: 'Non adsorbito dal carbone (utile solo per i co-ingeriti).',
    dialisi: 'Sì (EXTRIP).',
    pdta: PDTA.litio,
  },

  // ——— Antipsicotici
  {
    id: 'quetiapina', nome: 'Quetiapina', commerciali: ['Seroquel'], classe: 'Antipsicotico atipico', dosaggi: [25, 100, 200, 300, 400],
    effetti: ['sedazione', 'ipotensione', 'anticolinergico', 'qt', 'respiro'],
    aspettarsi: ['Sopore fino al coma, tachicardia sinusale, ipotensione (alfa-blocco), segni anticolinergici, QT lungo (raramente torsioni), convulsioni rare.'],
    tempi: 'Rilascio prolungato (RP): coma e ipotensione possono comparire o peggiorare dopo 6–12 h.',
    monitorare: ['GCS, vie aeree', 'PA', 'ECG con QTc'],
    terapia: ['Liquidi; noradrenalina se ipotensione refrattaria.', 'Intubazione se coma con vie aeree a rischio.'],
    carbone: 'si', sindrome: 'sedativo',
  },
  {
    id: 'olanzapina', nome: 'Olanzapina', commerciali: ['Zyprexa'], classe: 'Antipsicotico atipico', dosaggi: [10, 5, 20],
    effetti: ['sedazione', 'anticolinergico'],
    aspettarsi: ['Sopore alternato ad agitazione, miosi, tachicardia, segni anticolinergici; raramente ipotensione o convulsioni.'],
    tempi: 'Sintomi entro 4–6 h, durata 24–48 h.',
    monitorare: ['GCS, vie aeree', 'FC, PA', 'CK, temperatura (SNM)'],
    terapia: ['Supporto; benzodiazepine per l’agitazione.'],
    carbone: 'si', sindrome: 'sedativo',
  },
  {
    id: 'aloperidolo', nome: 'Aloperidolo', commerciali: ['Serenase', 'Haldol'], classe: 'Antipsicotico tipico', dosaggi: [1, 5], mgMl: 2,
    effetti: ['qt', 'sedazione'],
    aspettarsi: ['Distonie, acatisia, rigidità extrapiramidale; QT lungo e torsioni; sindrome neurolettica maligna.'],
    tempi: 'Distonie anche dopo ore.',
    monitorare: ['ECG con QTc, K, Mg', 'CK, temperatura'],
    terapia: ['Distonia: biperidene (Akineton) 5 mg ev/im o difenidramina.', 'QT lungo/torsioni: magnesio solfato 2 g ev.'],
    carbone: 'si', sindrome: 'neurolettico', pdta: PDTA.serotonina,
  },
  {
    id: 'promazina', nome: 'Promazina', commerciali: ['Talofen'], classe: 'Antipsicotico fenotiazinico', dosaggi: [25, 50, 100], mgMl: 40,
    effetti: ['sedazione', 'ipotensione', 'anticolinergico', 'qt', 'convulsioni'],
    aspettarsi: ['Sopore, ipotensione, tachicardia, segni anticolinergici, QT lungo; abbassa la soglia convulsiva.'],
    tempi: 'Sintomi entro 4–6 h.',
    monitorare: ['GCS', 'PA', 'ECG con QTc'],
    terapia: ['Liquidi, noradrenalina.', 'QT lungo: magnesio.'],
    carbone: 'si', sindrome: 'sedativo',
  },
  {
    id: 'risperidone', nome: 'Risperidone', commerciali: ['Risperdal'], classe: 'Antipsicotico atipico', dosaggi: [1, 2, 3, 4], mgMl: 1,
    effetti: ['sedazione', 'ipotensione', 'qt'],
    aspettarsi: ['Sonnolenza, tachicardia, ipotensione, distonie; QT lungo (lieve).'],
    tempi: 'Sintomi entro 4–6 h.',
    monitorare: ['PA', 'ECG con QTc'],
    terapia: ['Supporto; distonia: biperidene.'],
    carbone: 'si', sindrome: 'neurolettico',
  },
  {
    id: 'aripiprazolo', nome: 'Aripiprazolo', commerciali: ['Abilify'], classe: 'Antipsicotico atipico', dosaggi: [10, 5, 15, 30],
    effetti: ['sedazione'],
    aspettarsi: ['Sonnolenza, nausea, tachicardia; di solito decorso benigno.'],
    tempi: 'Emivita lunga.',
    monitorare: ['GCS, PA'],
    terapia: ['Supporto.'],
    carbone: 'si', sindrome: 'neurolettico',
  },
  {
    id: 'clozapina', nome: 'Clozapina', commerciali: ['Leponex'], classe: 'Antipsicotico atipico', dosaggi: [100, 25],
    effetti: ['sedazione', 'anticolinergico', 'convulsioni', 'ipotensione', 'respiro'],
    aspettarsi: ['Coma, scialorrea, tachicardia, ipotensione, convulsioni, polmonite ab ingestis; miocardite (rara).'],
    tempi: 'Sintomi entro 6 h, durata prolungata.',
    monitorare: ['GCS, vie aeree', 'PA, ECG', 'Emocromo'],
    terapia: ['Supporto; intubazione se coma o scialorrea con vie aeree a rischio.', 'Convulsioni: diazepam.'],
    carbone: 'si', sindrome: 'sedativo',
  },

  // ——— Antiepilettici
  {
    id: 'valproato', nome: 'Acido valproico', commerciali: ['Depakin', 'Depakin Chrono'], classe: 'Antiepilettico', dosaggi: [500, 300], mgMl: 200,
    effetti: ['sedazione', 'fegato', 'acidosi'],
    aspettarsi: [
      'Sopore fino al coma, miosi; ipotensione e tachicardia.',
      'Iperammoniemia (anche con transaminasi normali), acidosi metabolica, ipernatriemia, ipocalcemia; edema cerebrale nei casi gravi; pancitopenia tardiva.',
    ],
    tempi: 'Rilascio prolungato (Chrono): picco fino a 12–24 h; valproatemia ogni 4–6 h fino al calo.',
    monitorare: ['Valproatemia seriata', 'Ammoniemia', 'EGA, Na, Ca, ALT, emocromo'],
    terapia: ['L-carnitina (Carnitene) se iperammoniemia, coma o epatotossicità: 100 mg/kg (7 g) ev in 30 min, poi 15 mg/kg (1 g) ogni 4 h.', 'Criteri EXTRIP → emodialisi.'],
    carbone: 'si',
    dialisi: 'Sì (EXTRIP) nei casi gravi.',
  },
  {
    id: 'carbamazepina', nome: 'Carbamazepina', commerciali: ['Tegretol'], classe: 'Antiepilettico', dosaggi: [200, 400],
    effetti: ['sedazione', 'anticolinergico', 'qrs', 'convulsioni', 'respiro'],
    aspettarsi: ['Atassia, nistagmo, sopore fino al coma, segni anticolinergici, convulsioni paradosse, QRS largo, iponatriemia.'],
    tempi: 'Assorbimento lento ed erratico: livelli in salita o secondo picco fino a 24 h e oltre; carbamazepinemia ripetuta.',
    monitorare: ['Carbamazepinemia seriata', 'ECG: QRS', 'Na, GCS'],
    terapia: ['Carbone attivo ripetuto (50 g, poi 25 g ogni 4 h) se vie aeree protette.', 'QRS largo: bicarbonato.', 'Gravi: emodialisi/emoperfusione (EXTRIP).'],
    carbone: 'ripetuto',
    dialisi: 'Sì (EXTRIP) nei casi gravi.',
    sindrome: 'anticolinergico',
  },
  {
    id: 'lamotrigina', nome: 'Lamotrigina', commerciali: ['Lamictal'], classe: 'Antiepilettico', dosaggi: [100, 25, 50, 200],
    effetti: ['qrs', 'convulsioni', 'sedazione'],
    aspettarsi: ['Atassia, nistagmo, sopore; convulsioni; QRS largo nelle ingestioni grandi; serotoninergica rara.'],
    tempi: 'Sintomi entro 6 h.',
    monitorare: ['ECG: QRS', 'GCS'],
    terapia: ['QRS largo: bicarbonato.', 'Convulsioni: diazepam.'],
    carbone: 'si',
  },
  {
    id: 'levetiracetam', nome: 'Levetiracetam', commerciali: ['Keppra'], classe: 'Antiepilettico', dosaggi: [500, 1000],
    effetti: ['sedazione'],
    aspettarsi: ['Sonnolenza, agitazione; di solito benigno.'],
    tempi: 'Breve durata.',
    monitorare: ['GCS'],
    terapia: ['Supporto.'],
    carbone: 'si',
  },
  {
    id: 'pregabalin', nome: 'Pregabalin', commerciali: ['Lyrica'], classe: 'Gabapentinoide', dosaggi: [75, 25, 150, 300],
    effetti: ['sedazione', 'respiro'],
    aspettarsi: ['Sonnolenza, confusione, agitazione, mioclonie; depressione respiratoria se associato a oppioidi o BZD.'],
    tempi: 'Picco 1 h; eliminazione renale (più lunga se creatinina alta).',
    monitorare: ['GCS, FR', 'Creatinina'],
    terapia: ['Supporto.'],
    carbone: 'si',
    dialisi: 'Dializzabile se insufficienza renale.',
  },
  {
    id: 'gabapentin', nome: 'Gabapentin', commerciali: ['Neurontin'], classe: 'Gabapentinoide', dosaggi: [300, 100, 400, 600, 800],
    effetti: ['sedazione', 'respiro'],
    aspettarsi: ['Sonnolenza, atassia, diplopia; depressione respiratoria in associazione a oppioidi.'],
    tempi: 'Assorbimento saturabile; eliminazione renale.',
    monitorare: ['GCS, FR', 'Creatinina'],
    terapia: ['Supporto.'],
    carbone: 'si',
  },

  // ——— Cardiovascolari
  {
    id: 'propranololo', nome: 'Propranololo', commerciali: ['Inderal'], classe: 'Beta-bloccante (lipofilo, stabilizzante di membrana)', dosaggi: [40, 10, 80],
    effetti: ['bradicardia', 'ipotensione', 'qrs', 'convulsioni', 'ipoglicemia', 'sedazione'],
    aspettarsi: ['Il beta-bloccante più tossico: bradicardia, ipotensione, coma, convulsioni, QRS largo, ipoglicemia, broncospasmo.'],
    tempi: 'Sintomi entro 6 h (rilascio prolungato più tardi).',
    monitorare: ['Monitor ECG continuo, QRS', 'PA', 'Glicemia, K'],
    terapia: ['Atropina → calcio → insulina ad alte dosi + noradrenalina → glucagone; QRS largo: bicarbonato.'],
    carbone: 'si', pdta: PDTA.bbcca,
  },
  {
    id: 'metoprololo', nome: 'Metoprololo', commerciali: ['Lopresor', 'Seloken'], classe: 'Beta-bloccante', dosaggi: [100, 50, 200],
    effetti: ['bradicardia', 'ipotensione'],
    aspettarsi: ['Bradicardia, ipotensione, blocchi AV; ipoglicemia possibile.'],
    tempi: 'Rilascio prolungato: osservazione ≥ 24 h.',
    monitorare: ['Monitor ECG', 'PA', 'Glicemia'],
    terapia: ['Atropina → calcio → insulina ad alte dosi + vasopressore → glucagone.'],
    carbone: 'si', pdta: PDTA.bbcca,
  },
  {
    id: 'bisoprololo', nome: 'Bisoprololo', commerciali: ['Concor', 'Congescor'], classe: 'Beta-bloccante', dosaggi: [1.25, 2.5, 5, 10],
    effetti: ['bradicardia', 'ipotensione'],
    aspettarsi: ['Bradicardia, ipotensione.'],
    tempi: 'Emivita 10–12 h.',
    monitorare: ['Monitor ECG', 'PA', 'Glicemia'],
    terapia: ['Atropina → calcio → insulina ad alte dosi + vasopressore → glucagone.'],
    carbone: 'si', pdta: PDTA.bbcca,
  },
  {
    id: 'atenololo', nome: 'Atenololo', commerciali: ['Tenormin'], classe: 'Beta-bloccante (idrofilo)', dosaggi: [100, 50],
    effetti: ['bradicardia', 'ipotensione'],
    aspettarsi: ['Bradicardia, ipotensione; eliminazione renale.'],
    tempi: 'Prolungato se insufficienza renale.',
    monitorare: ['Monitor ECG', 'PA', 'Creatinina'],
    terapia: ['Come gli altri beta-bloccanti.'],
    carbone: 'si', dialisi: 'Dializzabile.', pdta: PDTA.bbcca,
  },
  {
    id: 'sotalolo', nome: 'Sotalolo', commerciali: ['Sotalex'], classe: 'Beta-bloccante (classe III)', dosaggi: [80, 160],
    effetti: ['bradicardia', 'ipotensione', 'qt'],
    aspettarsi: ['Bradicardia, ipotensione; QT lungo e torsioni.'],
    tempi: 'Eliminazione renale; QT anche tardivo.',
    monitorare: ['ECG seriati con QTc', 'K, Mg, creatinina'],
    terapia: ['Magnesio solfato 2 g ev; overdrive (isoprenalina o pacing) per le torsioni.'],
    carbone: 'si', dialisi: 'Dializzabile.', pdta: PDTA.bbcca,
  },
  {
    id: 'carvedilolo', nome: 'Carvedilolo', commerciali: ['Dilatrend'], classe: 'Beta e alfa-bloccante', dosaggi: [25, 6.25, 12.5],
    effetti: ['bradicardia', 'ipotensione'],
    aspettarsi: ['Bradicardia e ipotensione (anche vasodilatazione).'],
    tempi: 'Sintomi entro 6 h.',
    monitorare: ['Monitor ECG', 'PA', 'Glicemia'],
    terapia: ['Come gli altri beta-bloccanti.'],
    carbone: 'si', pdta: PDTA.bbcca,
  },
  {
    id: 'nebivololo', nome: 'Nebivololo', commerciali: ['Lobivon', 'Nebilox'], classe: 'Beta-bloccante', dosaggi: [5],
    effetti: ['bradicardia', 'ipotensione'],
    aspettarsi: ['Bradicardia, ipotensione.'],
    tempi: 'Sintomi entro 6 h.',
    monitorare: ['Monitor ECG', 'PA'],
    terapia: ['Come gli altri beta-bloccanti.'],
    carbone: 'si', pdta: PDTA.bbcca,
  },
  {
    id: 'amlodipina', nome: 'Amlodipina', commerciali: ['Norvasc'], classe: 'Calcio-antagonista diidropiridinico', dosaggi: [5, 10],
    effetti: ['ipotensione'],
    aspettarsi: ['Vasoplegia con tachicardia riflessa; nelle forme gravi bradicardia, shock, iperglicemia (indice di gravità), edema polmonare non cardiogeno.'],
    tempi: 'Emivita molto lunga (30–50 h): ipotensione per giorni; osservazione ≥ 24 h.',
    monitorare: ['PA (cruenta se instabile)', 'Glicemia, lattati, K', 'Ecocardio'],
    terapia: ['Calcio; insulina ad alte dosi; noradrenalina (vasoplegia).'],
    carbone: 'si', pdta: PDTA.bbcca,
  },
  {
    id: 'nifedipina', nome: 'Nifedipina', commerciali: ['Adalat'], classe: 'Calcio-antagonista diidropiridinico', dosaggi: [30, 20, 60],
    effetti: ['ipotensione'],
    aspettarsi: ['Vasoplegia, tachicardia riflessa; nei casi gravi shock.'],
    tempi: 'Formulazioni Crono/RP: sintomi tardivi, osservazione ≥ 24 h.',
    monitorare: ['PA', 'Glicemia, lattati'],
    terapia: ['Calcio; insulina ad alte dosi; noradrenalina.', 'Irrigazione intestinale per RP.'],
    carbone: 'si', pdta: PDTA.bbcca,
  },
  {
    id: 'verapamil', nome: 'Verapamil', commerciali: ['Isoptin'], classe: 'Calcio-antagonista non diidropiridinico', dosaggi: [80, 120, 240],
    effetti: ['bradicardia', 'ipotensione'],
    aspettarsi: ['Il calcio-antagonista più pericoloso: bradicardia, blocchi AV, shock cardiogeno e vasoplegico, iperglicemia.'],
    tempi: 'RP: sintomi fino a 12–24 h; osservazione ≥ 24 h anche se asintomatico.',
    monitorare: ['Monitor ECG continuo', 'PA', 'Glicemia, K, lattati', 'Ecocardio'],
    terapia: ['Atropina → calcio → insulina ad alte dosi + vasopressore → pacing → lipidi → ECMO.', 'Irrigazione intestinale totale per RP.'],
    carbone: 'si', pdta: PDTA.bbcca,
  },
  {
    id: 'diltiazem', nome: 'Diltiazem', commerciali: ['Dilzene', 'Altiazem'], classe: 'Calcio-antagonista non diidropiridinico', dosaggi: [60, 120, 300],
    effetti: ['bradicardia', 'ipotensione'],
    aspettarsi: ['Bradicardia, blocchi AV, ipotensione, iperglicemia.'],
    tempi: 'RP: osservazione ≥ 24 h.',
    monitorare: ['Monitor ECG continuo', 'PA', 'Glicemia, K'],
    terapia: ['Come verapamil.'],
    carbone: 'si', pdta: PDTA.bbcca,
  },
  {
    id: 'ramipril', nome: 'Ramipril', commerciali: ['Triatec'], classe: 'ACE-inibitore', dosaggi: [5, 2.5, 10],
    effetti: ['ipotensione', 'iperkaliemia', 'rene'],
    aspettarsi: ['Ipotensione (di solito lieve e responsiva ai liquidi); iperkaliemia, danno renale.'],
    tempi: 'Sintomi entro 6 h.',
    monitorare: ['PA', 'K, creatinina'],
    terapia: ['Liquidi; vasopressore raramente necessario.'],
    carbone: 'si',
  },
  {
    id: 'enalapril', nome: 'Enalapril', commerciali: ['Enapren'], classe: 'ACE-inibitore', dosaggi: [20, 5],
    effetti: ['ipotensione', 'iperkaliemia', 'rene'],
    aspettarsi: ['Ipotensione; iperkaliemia, danno renale.'],
    tempi: 'Sintomi entro 6 h.',
    monitorare: ['PA', 'K, creatinina'],
    terapia: ['Liquidi.'],
    carbone: 'si',
  },
  {
    id: 'sartano', nome: 'Sartani (valsartan, olmesartan, losartan…)', commerciali: ['Tareg', 'Olpress', 'Lortaan'], classe: 'Sartano', dosaggi: [80, 160, 20, 50],
    effetti: ['ipotensione', 'iperkaliemia', 'rene'],
    aspettarsi: ['Ipotensione; iperkaliemia, danno renale.'],
    tempi: 'Sintomi entro 6 h.',
    monitorare: ['PA', 'K, creatinina'],
    terapia: ['Liquidi.'],
    carbone: 'si',
  },
  {
    id: 'furosemide', nome: 'Furosemide', commerciali: ['Lasix'], classe: 'Diuretico dell’ansa', dosaggi: [25, 500],
    effetti: ['ipotensione', 'rene'],
    aspettarsi: ['Ipovolemia, ipotensione, ipokaliemia, iponatriemia.'],
    tempi: 'Diuresi entro 1 h.',
    monitorare: ['PA, diuresi', 'Na, K, Mg, creatinina'],
    terapia: ['Liquidi ed elettroliti.'],
    carbone: 'si',
  },
  {
    id: 'idroclorotiazide', nome: 'Idroclorotiazide', commerciali: ['Esidrex'], classe: 'Diuretico tiazidico', dosaggi: [25, 12.5],
    effetti: ['ipotensione'],
    aspettarsi: ['Ipovolemia, iponatriemia, ipokaliemia.'],
    tempi: 'Sintomi entro poche ore.',
    monitorare: ['PA', 'Na, K'],
    terapia: ['Liquidi ed elettroliti.'],
    carbone: 'si',
  },
  {
    id: 'spironolattone', nome: 'Spironolattone', commerciali: ['Aldactone'], classe: 'Diuretico risparmiatore di K', dosaggi: [25, 100],
    effetti: ['iperkaliemia'],
    aspettarsi: ['Di solito pochi sintomi; iperkaliemia, soprattutto con ACE-i/sartani o insufficienza renale.'],
    tempi: 'K da ricontrollare a 6–12 h.',
    monitorare: ['K, creatinina', 'ECG'],
    terapia: ['Trattare l’iperkaliemia.'],
    carbone: 'si',
  },
  {
    id: 'digossina', nome: 'Digossina', commerciali: ['Lanoxin'], classe: 'Digitalico', dosaggi: [0.125, 0.25], mgMl: 0.05,
    effetti: ['bradicardia', 'iperkaliemia'],
    aspettarsi: ['Vomito, iperkaliemia (indice di gravità nell’acuta), bradiaritmie, blocchi AV, tachicardie ventricolari, TPSV con blocco; disturbi visivi, confusione.'],
    tempi: 'Digossinemia almeno 6 h dopo l’ingestione (prima non interpretabile).',
    monitorare: ['Monitor ECG', 'K, Mg, creatinina', 'Digossinemia a ≥ 6 h'],
    terapia: ['Anticorpi antidigossina (DigiFab) se aritmie pericolose o K > 5,0: tramite Tossicologia Careggi.', 'Atropina per la bradicardia in attesa.'],
    carbone: 'si',
    pdta: PDTA.digossina,
  },
  {
    id: 'clonidina', nome: 'Clonidina', commerciali: ['Catapresan'], classe: 'Alfa-2 agonista', dosaggi: [0.15, 0.3],
    effetti: ['sedazione', 'bradicardia', 'ipotensione', 'respiro'],
    aspettarsi: ['Simile agli oppioidi: miosi, sopore fino al coma, bradicardia, ipotensione (ipertensione transitoria iniziale), apnee.'],
    tempi: 'Sintomi entro 1–2 h, durata fino a 24 h.',
    monitorare: ['Monitor ECG, PA', 'FR, GCS'],
    terapia: ['Supporto; atropina per la bradicardia; il naloxone può rispondere parzialmente.'],
    carbone: 'si', sindrome: 'oppioide',
  },
  {
    id: 'flecainide', nome: 'Flecainide', commerciali: ['Almarytm'], classe: 'Antiaritmico IC', dosaggi: [100, 50, 150],
    effetti: ['qrs', 'bradicardia', 'ipotensione', 'convulsioni'],
    aspettarsi: ['Molto tossica: QRS largo, bradicardia, TV, shock cardiogeno, convulsioni.'],
    tempi: 'Sintomi entro 1–3 h; RP più tardi.',
    monitorare: ['ECG ogni ora: QRS', 'PA', 'K'],
    terapia: ['Bicarbonato 8,4% in bolo ripetuto; lipidi ed ECMO se refrattaria. Niente altri antiaritmici IA/IC.'],
    carbone: 'si', pdta: PDTA.triciclici,
  },
  {
    id: 'propafenone', nome: 'Propafenone', commerciali: ['Rytmonorm'], classe: 'Antiaritmico IC', dosaggi: [150, 300],
    effetti: ['qrs', 'bradicardia', 'ipotensione', 'convulsioni'],
    aspettarsi: ['QRS largo, bradicardia, ipotensione, convulsioni.'],
    tempi: 'Sintomi entro 1–3 h.',
    monitorare: ['ECG ogni ora: QRS', 'PA'],
    terapia: ['Bicarbonato; lipidi ed ECMO se refrattario.'],
    carbone: 'si', pdta: PDTA.triciclici,
  },
  {
    id: 'amiodarone', nome: 'Amiodarone', commerciali: ['Cordarone'], classe: 'Antiaritmico III', dosaggi: [200],
    effetti: ['bradicardia', 'qt', 'ipotensione'],
    aspettarsi: ['L’ingestione acuta è di solito poco tossica: bradicardia, QT lungo, ipotensione.'],
    tempi: 'Emivita lunghissima.',
    monitorare: ['ECG con QTc', 'PA'],
    terapia: ['Supporto; magnesio se QT lungo.'],
    carbone: 'si',
  },

  // ——— Metabolici e coagulazione
  {
    id: 'metformina', nome: 'Metformina', commerciali: ['Glucophage', 'Metforal'], classe: 'Biguanide', dosaggi: [500, 850, 1000],
    effetti: ['acidosi'],
    aspettarsi: ['Nausea, vomito, dolore addominale; acidosi lattica (MALA) nelle ingestioni grandi o con danno renale; ipoglicemia rara.'],
    tempi: 'Acidosi entro 6–12 h.',
    monitorare: ['EGA con lattati ripetuto', 'Creatinina, glicemia'],
    terapia: ['Bicarbonato non risolutivo; criteri EXTRIP (lattati, pH, shock) → emodialisi.'],
    carbone: 'si',
    dialisi: 'Sì (EXTRIP).',
  },
  {
    id: 'gliclazide', nome: 'Gliclazide', commerciali: ['Diamicron'], classe: 'Sulfanilurea', dosaggi: [30, 60, 80],
    effetti: ['ipoglicemia'],
    aspettarsi: ['Ipoglicemia ricorrente e prolungata, anche tardiva.'],
    tempi: 'Ipoglicemia anche dopo 8–12 h (RP fino a 24 h e oltre): osservazione ≥ 24 h con glicemie.',
    monitorare: ['Glicemia ogni ora', 'K'],
    terapia: ['Glucosio 33% 50 mL ev, poi glucosio in infusione.', 'Ipoglicemia ricorrente: octreotide 50–100 µg sc ogni 6–12 h (fiala 0,1 mg/1 mL).'],
    carbone: 'si',
  },
  {
    id: 'glibenclamide', nome: 'Glibenclamide', commerciali: ['Daonil', 'Glucovance (con metformina)'], classe: 'Sulfanilurea', dosaggi: [5],
    effetti: ['ipoglicemia'],
    aspettarsi: ['Ipoglicemia ricorrente, molto prolungata.'],
    tempi: 'Ipoglicemia fino a 24–72 h.',
    monitorare: ['Glicemia ogni ora', 'K'],
    terapia: ['Glucosio; octreotide 50–100 µg sc ogni 6–12 h.'],
    carbone: 'si',
  },
  {
    id: 'glimepiride', nome: 'Glimepiride', commerciali: ['Amaryl'], classe: 'Sulfanilurea', dosaggi: [2, 1, 4],
    effetti: ['ipoglicemia'],
    aspettarsi: ['Ipoglicemia ricorrente.'],
    tempi: 'Osservazione ≥ 24 h.',
    monitorare: ['Glicemia ogni ora'],
    terapia: ['Glucosio; octreotide.'],
    carbone: 'si',
  },
  {
    id: 'repaglinide', nome: 'Repaglinide', commerciali: ['NovoNorm'], classe: 'Glinide', dosaggi: [1, 2],
    effetti: ['ipoglicemia'],
    aspettarsi: ['Ipoglicemia (più breve delle sulfaniluree).'],
    tempi: 'Osservazione con glicemie per almeno 12 h.',
    monitorare: ['Glicemia ogni ora'],
    terapia: ['Glucosio; octreotide.'],
    carbone: 'si',
  },
  {
    id: 'insulina', nome: 'Insulina (iniezione)', commerciali: ['Humalog', 'Novorapid', 'Lantus', 'Toujeo', 'Tresiba'], classe: 'Insulina', ui: true,
    effetti: ['ipoglicemia'],
    aspettarsi: ['Ipoglicemia profonda e ricorrente; ipokaliemia, ipofosforemia. Le basali (glargine, degludec) danno ipoglicemie per giorni.'],
    tempi: 'Rapida: alcune ore; basali: 24–72 h e oltre.',
    monitorare: ['Glicemia ogni 30–60 min', 'K, P'],
    terapia: ['Glucosio 33% in bolo, poi G10–20% in infusione continua; alimentazione appena possibile.', 'Depot sc molto grande: chirurgo per escissione è eccezionale; CAV.'],
    carbone: 'no', notaCarbone: 'Iniettata: carbone inutile.',
  },
  {
    id: 'warfarin', nome: 'Warfarin', commerciali: ['Coumadin'], classe: 'Anticoagulante AVK', dosaggi: [5],
    effetti: ['sanguinamento'],
    aspettarsi: ['Ingestione singola: INR in salita dopo 24–48 h, picco a 2–3 giorni. Ingestione in terapia cronica: rischio più alto.'],
    tempi: 'INR all’ingresso, a 24 e a 48 h.',
    monitorare: ['INR seriato', 'Emocromo, segni di sanguinamento'],
    terapia: ['Vitamina K (Konakion 10 mg) per os/ev se INR alto; PCC se sanguinamento.'],
    carbone: 'si',
    pdta: PDTA.anticoagulati,
  },
  {
    id: 'apixaban', nome: 'Apixaban', commerciali: ['Eliquis'], classe: 'Anticoagulante diretto (anti-Xa)', dosaggi: [5, 2.5],
    effetti: ['sanguinamento'],
    aspettarsi: ['Senza sanguinamento spesso solo osservazione; rischio emorragico per 24–48 h.'],
    tempi: 'Picco 3–4 h.',
    monitorare: ['Emocromo, creatinina, attività anti-Xa se disponibile'],
    terapia: ['Sanguinamento maggiore: PCC 50 UI/kg (andexanet se disponibile).'],
    carbone: 'si', notaCarbone: 'Utile entro 2–6 h.',
    pdta: PDTA.anticoagulati,
  },
  {
    id: 'rivaroxaban', nome: 'Rivaroxaban', commerciali: ['Xarelto'], classe: 'Anticoagulante diretto (anti-Xa)', dosaggi: [20, 15, 10],
    effetti: ['sanguinamento'],
    aspettarsi: ['Rischio emorragico per 24–48 h.'],
    tempi: 'Picco 2–4 h.',
    monitorare: ['Emocromo, creatinina'],
    terapia: ['Sanguinamento maggiore: PCC 50 UI/kg.'],
    carbone: 'si',
    pdta: PDTA.anticoagulati,
  },
  {
    id: 'edoxaban', nome: 'Edoxaban', commerciali: ['Lixiana'], classe: 'Anticoagulante diretto (anti-Xa)', dosaggi: [60, 30],
    effetti: ['sanguinamento'],
    aspettarsi: ['Rischio emorragico per 24–48 h.'],
    tempi: 'Picco 1–2 h.',
    monitorare: ['Emocromo, creatinina'],
    terapia: ['Sanguinamento maggiore: PCC 50 UI/kg.'],
    carbone: 'si',
    pdta: PDTA.anticoagulati,
  },
  {
    id: 'dabigatran', nome: 'Dabigatran', commerciali: ['Pradaxa'], classe: 'Anticoagulante diretto (anti-IIa)', dosaggi: [150, 110],
    effetti: ['sanguinamento', 'rene'],
    aspettarsi: ['Rischio emorragico; eliminazione renale.'],
    tempi: 'Picco 1–2 h; prolungato se insufficienza renale.',
    monitorare: ['Emocromo, aPTT/tempo di trombina, creatinina'],
    terapia: ['Sanguinamento: idarucizumab (Praxbind) 5 g ev.'],
    carbone: 'si',
    dialisi: 'Dializzabile.',
    pdta: PDTA.anticoagulati,
  },
  {
    id: 'ferro', nome: 'Ferro (mg di ferro elementare)', commerciali: ['Ferrograd', 'Ferro-Grad'], classe: 'Sali di ferro', dosaggi: [105, 80],
    effetti: ['acidosi', 'fegato', 'ipotensione'],
    aspettarsi: [
      'Fase 1 (0–6 h): vomito, diarrea, ematemesi; se asintomatico a 6 h la tossicità sistemica è improbabile.',
      'Fase latente apparente, poi shock, acidosi metabolica, insufficienza epatica (12–96 h); stenosi pilorica tardiva.',
    ],
    tempi: 'Sideremia a 4–6 h; Rx addome (compresse radiopache).',
    monitorare: ['Sideremia a 4–6 h', 'EGA, lattati, glicemia, ALT, INR', 'Rx addome'],
    terapia: ['Irrigazione intestinale totale se compresse visibili.', 'Tossicità sistemica: deferoxamina (Desferal) ev in infusione, tramite CAV.'],
    carbone: 'no', notaCarbone: 'Il ferro non è adsorbito dal carbone.',
  },
  {
    id: 'colchicina', nome: 'Colchicina', commerciali: ['Colchicina Lirca'], classe: 'Antimitotico', dosaggi: [1, 0.5],
    effetti: ['ipotensione', 'acidosi', 'rene'],
    aspettarsi: [
      'Insidiosa: vomito e diarrea a 2–24 h, poi insufficienza multiorgano (shock cardiogeno, aritmie, ARDS, rabdomiolisi, insufficienza renale) a 24–72 h.',
      'Aplasia midollare a 3–7 giorni; alopecia tardiva.',
    ],
    tempi: 'Qualsiasi ingestione intenzionale: ricovero e CAV, anche se asintomatico.',
    monitorare: ['Emocromo quotidiano', 'EGA, lattati, CK, troponina, creatinina, coagulazione', 'Monitor ECG'],
    terapia: ['Supporto intensivo; nessun antidoto disponibile. CAV subito.'],
    carbone: 'ripetuto', notaCarbone: 'Ciclo enteroepatico: carbone ripetuto se vie aeree protette.',
  },
  {
    id: 'teofillina', nome: 'Teofillina', commerciali: ['Theo-Dur', 'Theolair'], classe: 'Metilxantina', dosaggi: [300, 200],
    effetti: ['convulsioni', 'acidosi', 'ipotensione'],
    aspettarsi: ['Vomito incoercibile, tachicardia, aritmie (TPSV, TV), ipokaliemia, iperglicemia, acidosi lattica, convulsioni refrattarie.'],
    tempi: 'Rilascio prolungato: picco fino a 12–24 h; teofillinemia ogni 2–4 h.',
    monitorare: ['Teofillinemia seriata', 'Monitor ECG', 'K, glicemia, EGA'],
    terapia: ['Carbone ripetuto; antiemetico (ondansetron).', 'Convulsioni: benzodiazepine, poi fenobarbitale.', 'Tachiaritmie con ipotensione: beta-bloccante a breve durata (CAV).', 'Criteri EXTRIP → emodialisi.'],
    carbone: 'ripetuto',
    dialisi: 'Sì (EXTRIP).',
  },
  {
    id: 'levotiroxina', nome: 'Levotiroxina', commerciali: ['Eutirox', 'Tirosint'], classe: 'Ormone tiroideo', dosaggi: [0.1, 0.05, 0.075, 0.125],
    effetti: [],
    aspettarsi: ['L’ingestione acuta è di solito benigna; tachicardia, agitazione, febbre possibili dopo 2–7 giorni.'],
    tempi: 'Effetti ritardati di giorni.',
    monitorare: ['FC, temperatura'],
    terapia: ['Propranololo se sintomatico (tachicardia).'],
    carbone: 'si',
  },

  // ——— Altri
  {
    id: 'baclofene', nome: 'Baclofene', commerciali: ['Lioresal'], classe: 'Miorilassante GABA-B', dosaggi: [10, 25],
    effetti: ['sedazione', 'respiro', 'bradicardia', 'convulsioni', 'ipotensione'],
    aspettarsi: ['Coma profondo anche prolungato (giorni), ipotonia, iporeflessia (può mimare la morte cerebrale), bradicardia, ipotermia, convulsioni.'],
    tempi: 'Eliminazione renale: molto prolungato se insufficienza renale.',
    monitorare: ['GCS, vie aeree', 'Monitor ECG', 'Creatinina'],
    terapia: ['Supporto; intubazione se coma.'],
    carbone: 'si',
    dialisi: 'Dializzabile (utile se insufficienza renale).',
  },
  {
    id: 'ciclobenzaprina', nome: 'Ciclobenzaprina', commerciali: ['Flexiban'], classe: 'Miorilassante (struttura triciclica)', dosaggi: [10],
    effetti: ['anticolinergico', 'sedazione', 'qrs'],
    aspettarsi: ['Sonnolenza, segni anticolinergici, tachicardia; raramente QRS largo.'],
    tempi: 'Sintomi entro 6 h.',
    monitorare: ['ECG: QRS', 'GCS'],
    terapia: ['Supporto; bicarbonato se QRS largo.'],
    carbone: 'si', sindrome: 'anticolinergico',
  },
  {
    id: 'idrossizina', nome: 'Idrossizina', commerciali: ['Atarax'], classe: 'Antistaminico H1', dosaggi: [25],
    effetti: ['sedazione', 'anticolinergico', 'qt', 'convulsioni'],
    aspettarsi: ['Sonnolenza, segni anticolinergici, QT lungo, convulsioni.'],
    tempi: 'Sintomi entro 2–4 h.',
    monitorare: ['ECG con QTc', 'GCS'],
    terapia: ['Supporto; magnesio se QT lungo; diazepam per convulsioni o agitazione.'],
    carbone: 'si', sindrome: 'anticolinergico',
  },
  {
    id: 'prometazina', nome: 'Prometazina', commerciali: ['Farganesse', 'Fenergan'], classe: 'Antistaminico fenotiazinico', dosaggi: [25],
    effetti: ['sedazione', 'anticolinergico', 'qt'],
    aspettarsi: ['Sonnolenza o delirium anticolinergico, tachicardia, distonie.'],
    tempi: 'Sintomi entro 2–4 h.',
    monitorare: ['ECG', 'GCS, temperatura'],
    terapia: ['Supporto; benzodiazepine per il delirium.'],
    carbone: 'si', sindrome: 'anticolinergico',
  },
  {
    id: 'difenidramina', nome: 'Difenidramina', commerciali: ['Benadryl'], classe: 'Antistaminico H1', dosaggi: [25, 50],
    effetti: ['anticolinergico', 'sedazione', 'qrs', 'convulsioni'],
    aspettarsi: ['Delirium anticolinergico, convulsioni, QRS largo nelle ingestioni grandi.'],
    tempi: 'Sintomi entro 2 h.',
    monitorare: ['ECG: QRS', 'Temperatura, globo vescicale'],
    terapia: ['Benzodiazepine; bicarbonato se QRS largo.'],
    carbone: 'si', sindrome: 'anticolinergico', pdta: PDTA.triciclici,
  },
  {
    id: 'cetirizina', nome: 'Cetirizina', commerciali: ['Zirtec', 'Formistin'], classe: 'Antistaminico H1 (2ª generazione)', dosaggi: [10],
    effetti: ['sedazione'],
    aspettarsi: ['Sonnolenza o agitazione; di solito benigno.'],
    tempi: 'Breve.',
    monitorare: ['GCS'],
    terapia: ['Supporto.'],
    carbone: 'si',
  },
  {
    id: 'metoclopramide', nome: 'Metoclopramide', commerciali: ['Plasil'], classe: 'Antidopaminergico', dosaggi: [10],
    effetti: ['sedazione'],
    aspettarsi: ['Distonie acute, acatisia, sonnolenza; metaemoglobinemia rara.'],
    tempi: 'Distonie entro 24–48 h.',
    monitorare: ['Esame neurologico'],
    terapia: ['Distonia: biperidene (Akineton) 5 mg ev/im.'],
    carbone: 'si', sindrome: 'neurolettico',
  },

  // ——— Associazioni frequenti
  { id: 'tachidol', nome: 'Paracetamolo + codeina', commerciali: ['Tachidol', 'Coefferalgan'], classe: 'Associazione', componenti: [{ id: 'paracetamolo', mg: 500 }, { id: 'codeina', mg: 30 }], effetti: [], aspettarsi: [], tempi: '', monitorare: [], terapia: [], carbone: 'si' },
  { id: 'patrol', nome: 'Tramadolo + paracetamolo', commerciali: ['Patrol', 'Kolibri'], classe: 'Associazione', componenti: [{ id: 'tramadolo', mg: 37.5 }, { id: 'paracetamolo', mg: 325 }], effetti: [], aspettarsi: [], tempi: '', monitorare: [], terapia: [], carbone: 'si' },
  { id: 'depalgos', nome: 'Ossicodone + paracetamolo', commerciali: ['Depalgos'], classe: 'Associazione', componenti: [{ id: 'ossicodone', mg: 10 }, { id: 'paracetamolo', mg: 325 }], effetti: [], aspettarsi: [], tempi: '', monitorare: [], terapia: [], carbone: 'si' },
]

export const farmaco = (id: string) => FARMACI.find((f) => f.id === id)

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
export function cercaFarmaci(q: string, max = 8): Farmaco[] {
  const n = norm(q.trim())
  if (n.length < 2) return []
  const score = (f: Farmaco) => {
    const nomi = [f.nome, ...f.commerciali].map(norm)
    if (nomi.some((x) => x.startsWith(n))) return 0
    if (nomi.some((x) => x.includes(n))) return 1
    if (norm(f.classe).includes(n)) return 2
    return 9
  }
  return FARMACI.map((f) => [f, score(f)] as const).filter(([, s]) => s < 9).sort((a, b) => a[1] - b[1]).slice(0, max).map(([f]) => f)
}

/* ——— Interazioni ——— */

/** Testo per ogni effetto quando lo condividono ≥ 2 sostanze. */
export const SOMMA: Partial<Record<Effetto, string>> = {
  sedazione: 'Depressione del SNC additiva: coma più profondo e più lungo, rischio di ab ingestis.',
  respiro: 'Depressione respiratoria sinergica (soprattutto oppioidi + benzodiazepine/gabapentinoidi/alcol): ventilazione, naloxone se oppioide coinvolto.',
  serotoninergico: 'Rischio di sindrome serotoninergica: clono inducibile o oculare, ipertermia, rigidità. Benzodiazepine, ciproeptadina; raffreddare.',
  qt: 'Allungamento del QT additivo: ECG seriati, K > 4 e Mg > 2; magnesio solfato 2 g ev se QTc > 500 ms.',
  qrs: 'Blocco dei canali del sodio additivo: QRS largo e aritmie ventricolari; bicarbonato in bolo.',
  anticolinergico: 'Carico anticolinergico additivo: delirium, ipertermia, ritenzione urinaria, tachicardia.',
  bradicardia: 'Bradicardia e blocchi AV sinergici (in particolare beta-bloccante + verapamil/diltiazem, o + digossina): pacing pronto.',
  ipotensione: 'Ipotensione additiva: liquidi precoci, vasopressore; ecocardio per distinguere vasoplegia e pompa.',
  convulsioni: 'Soglia convulsiva abbassata da più farmaci: diazepam pronto; niente flumazenil.',
  ipoglicemia: 'Ipoglicemia additiva e più prolungata: glicemia ogni ora.',
  sanguinamento: 'Rischio emorragico additivo (anticoagulanti, antiaggreganti, FANS): IPP, emocromo, coagulazione.',
  fegato: 'Epatotossicità additiva: ALT e INR a 24 h.',
  rene: 'Danno renale additivo, con accumulo dei farmaci a eliminazione renale: creatinina, diuresi, idratazione.',
  iperkaliemia: 'Iperkaliemia additiva: K seriato, ECG.',
  acidosi: 'Acidosi metabolica da più cause: EGA con lattati e gap anionico seriati.',
}

/** Interazioni specifiche tra sostanze o classi. `a`/`b`: id, o «classe:<testo>». */
export const INTERAZIONI: { a: string[]; b: string[]; testo: string }[] = [
  { a: ['classe:Oppioide'], b: ['classe:Benzodiazepina', 'classe:Ipnotico Z', 'classe:Gabapentinoide', 'alcol'], testo: 'Oppioide + sedativo: la principale causa di arresto respiratorio. Naloxone per il respiro; il flumazenil non va dato «per svegliare».' },
  { a: ['tramadolo', 'tapentadolo', 'metadone'], b: ['classe:SSRI', 'classe:SNRI', 'classe:Triciclico', 'litio', 'trazodone', 'vortioxetina', 'mirtazapina'], testo: 'Oppioide serotoninergico + antidepressivo: sindrome serotoninergica e (tramadolo) convulsioni.' },
  { a: ['classe:Benzodiazepina', 'classe:Ipnotico Z'], b: ['classe:Triciclico', 'bupropione', 'venlafaxina', 'tramadolo', 'carbamazepina', 'teofillina', 'citalopram', 'escitalopram', 'clozapina'], testo: 'Flumazenil controindicato: la benzodiazepina sta proteggendo da convulsioni del co-ingerito.' },
  { a: ['classe:Triciclico', 'carbamazepina', 'ciclobenzaprina'], b: ['*'], testo: 'Con un bloccante dei canali del sodio presente: NO fisostigmina, flecainide, propafenone; bicarbonato se QRS > 100 ms.' },
  { a: ['classe:Beta-bloccante', 'propranololo', 'metoprololo', 'bisoprololo', 'atenololo', 'sotalolo', 'carvedilolo', 'nebivololo'], b: ['verapamil', 'diltiazem'], testo: 'Beta-bloccante + verapamil/diltiazem: bradicardia, BAV e shock sinergici, anche con quantità modeste. Insulina ad alte dosi precoce.' },
  { a: ['digossina'], b: ['verapamil', 'diltiazem', 'amiodarone', 'classe:Beta-bloccante'], testo: 'Digossina + farmaci che rallentano il nodo AV o ne aumentano i livelli (verapamil, amiodarone): bradiaritmie, digossinemia più alta.' },
  { a: ['digossina'], b: ['furosemide', 'idroclorotiazide'], testo: 'Digossina + diuretico: ipokaliemia e ipomagnesiemia aumentano l’aritmogenicità.' },
  { a: ['litio'], b: ['ramipril', 'enalapril', 'sartano', 'furosemide', 'idroclorotiazide', 'classe:FANS', 'asa'], testo: 'Litio + ACE-i/sartani/diuretici/FANS: ridotta eliminazione renale del litio, livelli più alti e più duraturi.' },
  { a: ['litio'], b: ['classe:SSRI', 'classe:SNRI', 'classe:Triciclico', 'tramadolo'], testo: 'Litio + serotoninergici: sindrome serotoninergica e neurotossicità.' },
  { a: ['litio'], b: ['classe:Antipsicotico tipico', 'classe:Antipsicotico atipico', 'classe:Antipsicotico fenotiazinico'], testo: 'Litio + antipsicotico: neurotossicità, sindrome neurolettica maligna.' },
  { a: ['metformina'], b: ['classe:FANS', 'asa', 'ramipril', 'enalapril', 'sartano', 'furosemide', 'alcol'], testo: 'Metformina + nefrotossici o alcol: maggior rischio di acidosi lattica.' },
  { a: ['classe:Sulfanilurea', 'repaglinide', 'insulina'], b: ['classe:Beta-bloccante', 'propranololo', 'alcol'], testo: 'Ipoglicemizzante + beta-bloccante o alcol: ipoglicemia più profonda e con meno segni adrenergici.' },
  { a: ['paracetamolo'], b: ['carbamazepina', 'alcol'], testo: 'Paracetamolo + induttori (carbamazepina, alcolismo cronico): metabolita epatotossico aumentato; non abbassare la soglia di trattamento con NAC.' },
  { a: ['valproato'], b: ['lamotrigina'], testo: 'Valproato aumenta i livelli di lamotrigina.' },
  { a: ['valproato'], b: ['carbamazepina', 'paracetamolo'], testo: 'Valproato + carbamazepina o paracetamolo: epatotossicità e iperammoniemia più probabili.' },
  { a: ['warfarin', 'apixaban', 'rivaroxaban', 'edoxaban', 'dabigatran'], b: ['classe:FANS', 'asa', 'classe:SSRI'], testo: 'Anticoagulante + FANS/ASA/SSRI: rischio emorragico (soprattutto digestivo) aumentato.' },
  { a: ['amiodarone'], b: ['warfarin'], testo: 'Amiodarone aumenta l’effetto del warfarin.' },
  { a: ['classe:Calcio-antagonista diidropiridinico', 'classe:Calcio-antagonista non diidropiridinico'], b: ['ramipril', 'enalapril', 'sartano', 'trazodone', 'quetiapina', 'carvedilolo'], testo: 'Calcio-antagonista + altri vasodilatatori: vasoplegia più marcata.' },
  { a: ['spironolattone'], b: ['ramipril', 'enalapril', 'sartano'], testo: 'Spironolattone + ACE-i/sartano: iperkaliemia, peggiore se danno renale.' },
  { a: ['clozapina', 'olanzapina', 'quetiapina'], b: ['classe:Benzodiazepina', 'alcol'], testo: 'Antipsicotico sedativo + BZD/alcol: depressione respiratoria (clozapina in particolare).' },
]

export const ALCOL = { id: 'alcol', nome: 'Alcol', effetti: ['sedazione', 'respiro', 'ipoglicemia', 'ipotensione'] as Effetto[] }

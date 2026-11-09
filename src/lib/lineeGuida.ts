/*
 * Riassunti brevi delle linee guida per il pronto soccorso.
 * Ogni voce: fonte originale (link), data dell'ultimo controllo di aggiornamenti,
 * punti essenziali per il PS, sezioni pratiche e un registro degli aggiornamenti.
 * Le dosi sono quelle delle tabelle delle linee guida: vanno sempre verificate
 * sulla scheda tecnica e sul paziente.
 */

export interface Collegamento { etichetta: string; url: string }

export interface LineaGuida {
  id: string
  titolo: string
  ente: string
  anno: number
  area: string
  fonte: Collegamento
  /** data (AAAA-MM-GG) in cui si è verificato che non ci sono versioni più recenti */
  controllata: string
  inBreve: string[]
  sezioni: { titolo: string; punti: string[] }[]
  aggiornamenti: { data: string; testo: string; link?: Collegamento }[]
  /** id dei calcolatori collegati (pagina Calcolatori) */
  calcolatori?: { id: string; nome: string }[]
}

export const LINEE_GUIDA: LineaGuida[] = [
  {
    id: 'fibrillazione-atriale',
    titolo: 'Fibrillazione atriale',
    ente: 'ESC/EACTS',
    anno: 2024,
    area: 'Cardiologia',
    fonte: { etichetta: 'Van Gelder et al., Eur Heart J 2024', url: 'https://doi.org/10.1093/eurheartj/ehae176' },
    controllata: '2026-11-09',
    calcolatori: [
      { id: 'cha2ds2va', nome: 'CHA₂DS₂-VA' },
      { id: 'hasbled', nome: 'HAS-BLED' },
      { id: 'cockcroft', nome: 'Clearance creatinina' },
    ],
    inBreve: [
      'Instabile (shock, ischemia, edema polmonare): cardioversione elettrica sincronizzata subito.',
      'Stabile: prima il controllo della frequenza. Obiettivo iniziale FC a riposo <110.',
      'Cardioversione precoce solo se esordio certo <24 h, oppure OAC efficace da ≥3 settimane, oppure ETE senza trombi.',
      "Alternativa sicura alla cardioversione precoce: attendere con solo controllo della frequenza (spesso cardioverte da sola) e rivalutare entro 48 h.",
      'Dopo qualunque cardioversione: OAC per almeno 4 settimane, poi secondo CHA₂DS₂-VA.',
      'OAC a lungo termine: CHA₂DS₂-VA ≥2 raccomandata, =1 da considerare. DOAC preferiti agli AVK.',
    ],
    sezioni: [
      {
        titolo: 'Controllo della frequenza in acuto',
        punti: [
          'FE >40%: beta-bloccante (metoprololo 2,5–5 mg ev in 2 min, ripetibile fino a 15 mg; esmololo 500 µg/kg in 1 min, poi 50–300 µg/kg/min) oppure diltiazem 0,25 mg/kg ev in 5 min, poi 5–15 mg/h, o verapamil 2,5–10 mg ev in 5 min.',
          'FE ≤40% o scompenso: beta-bloccante a basse dosi con cautela, digossina 0,5 mg ev (fino a 0,75–1,5 mg in 24 h in dosi frazionate), amiodarone se refrattaria o instabile.',
          'Niente diltiazem/verapamil con FE ≤40%.',
          'FA pre-eccitata (QRS larghi, irregolari, molto veloci): niente farmaci nodali (beta-bloccanti, calcioantagonisti, digossina, amiodarone). Cardioversione elettrica.',
        ],
      },
      {
        titolo: 'Cardioversione farmacologica',
        punti: [
          'Senza cardiopatia strutturale (no IVS marcata, no FE ridotta, no coronaropatia): flecainide 2 mg/kg ev in 10 min (max 150 mg) o 200–300 mg os; propafenone 1,5–2 mg/kg ev in 10 min o 450–600 mg os.',
          'Con flecainide/propafenone associare un farmaco nodale: rischio di flutter con conduzione 1:1.',
          'Vernakalant 3 mg/kg ev in 10 min, seconda dose 2 mg/kg dopo 15 min. Non con SCA recente, scompenso grave, PAS <100, stenosi aortica severa, QT lungo.',
          'Con cardiopatia strutturale o scompenso: amiodarone 300 mg ev in 30–60 min, poi 900–1200 mg nelle 24 h. Conversione lenta (ore).',
        ],
      },
      {
        titolo: 'Cardioversione elettrica',
        punti: [
          'Sincronizzata, bifasica, in sedazione. Energie elevate fin dal primo shock.',
          'Se durata >24 h o incerta: solo dopo ≥3 settimane di OAC efficace o ETE senza trombi (in urgenza da instabilità si procede comunque, iniziando subito l’eparina).',
        ],
      },
      {
        titolo: 'Anticoagulazione',
        punti: [
          'CHA₂DS₂-VA (il sesso femminile non conta più): 0 nessuna OAC, 1 da considerare, ≥2 raccomandata.',
          'DOAC preferiti agli AVK, tranne protesi valvolari meccaniche e stenosi mitralica moderata-severa (lì AVK).',
          'Dosi ridotte dei DOAC solo se soddisfatti i criteri della scheda tecnica: calcolare la CrCl con Cockcroft-Gault.',
          'HAS-BLED alto non è un motivo per non anticoagulare: correggere i fattori modificabili.',
          'Gli antiaggreganti non sostituiscono l’OAC per la prevenzione dell’ictus. OAC + antiaggregante solo se indicato (SCA/PCI), per al massimo 12 mesi.',
        ],
      },
    ],
    aggiornamenti: [
      {
        data: '2026-11-09',
        testo: 'Controllo: nessuna nuova versione ESC dopo il 2024. Le linee guida USA restano quelle ACC/AHA/ACCP/HRS 2023.',
      },
      {
        data: '2026-01-28',
        testo: 'Ann Emerg Med: confronto ESC 2024, ACC/AHA 2023 e CCS 2020 dal punto di vista del PS. Utile dove le soglie differiscono (es. durata per la cardioversione).',
        link: { etichetta: 'PubMed 41603838', url: 'https://pubmed.ncbi.nlm.nih.gov/41603838/' },
      },
      {
        data: '2024-08-30',
        testo: 'Novità rispetto al 2020: percorso AF-CARE; CHA₂DS₂-VA al posto di CHA₂DS₂-VASc; soglia per la cardioversione precoce da 48 a 24 h; attesa vigile come alternativa; ablazione di prima linea nella FA parossistica.',
        link: { etichetta: 'Le 10 novità (Europace 2024)', url: 'https://doi.org/10.1093/europace/euae298' },
      },
    ],
  },
]

export const lineaGuida = (id: string) => LINEE_GUIDA.find((l) => l.id === id)

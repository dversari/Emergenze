/*
 * Terapia antibiotica empirica in PS (adulto, funzione epatica normale).
 * Nei testi, {id} diventa un collegamento alla scheda del farmaco.
 * Riferimenti: ATS/IDSA CAP 2019 + aggiornamento ATS 2025; IDSA/ATS HAP-VAP 2016;
 * IDSA cUTI 2025; EAU 2025; IDSA/SIS infezioni intra-addominali; Tokyo 2018;
 * ESCMID meningite 2016; IDSA C. difficile 2021; IDSA cute 2014; CDC IST 2021; EASL 2018;
 * resistenze: ARS Toscana, «L’antibiotico-resistenza e l’uso di antibiotici in Toscana nel 2024» (giugno 2025).
 * Le dosi renali sono per CrCl (Cockcroft-Gault) e seguono le schede tecniche europee.
 */

export interface Farmaco {
  id: string
  /** vie di somministrazione */
  via: string
  nome: string
  /** confezioni disponibili */
  fiale: string
  /** come si prepara e in quanto tempo */
  prep: string
  dose: string
  /** aggiustamento renale per CrCl, già pronto */
  rene: string[]
  monitor?: string[]
}

export interface Condizione {
  id: string
  nome: string
  gruppo: 'Respiratorie' | 'Urogenitali' | 'Addominali' | 'SNC' | 'Cute' | 'Sistemiche'
  /** la riga che si legge a card chiusa */
  sintesi: string
  blocchi: { titolo: string; righe: string[] }[]
  durata: string
  note?: string[]
}

export const FARMACI: Farmaco[] = [
  {
    id: 'amoxicillina', via: 'os', nome: 'Amoxicillina', fiale: 'cp 1 g',
    prep: 'Orale.',
    dose: '1 g ogni 8 h',
    rene: ['CrCl 10–30: 500 mg ogni 12 h', 'CrCl <10: 500 mg ogni 24 h'],
  },
  {
    id: 'amoxclav', via: 'os · ev', nome: 'Amoxicillina/clavulanato', fiale: 'cp 875/125 mg · fl ev 2 g/200 mg e 1 g/200 mg',
    prep: 'Ev: fiala in 20 mL di acqua ppi, poi in 100 mL di SF, in 30 min. Non in glucosata.',
    dose: 'Os 875/125 mg ogni 8 h (ogni 12 h nelle forme lievi) · Ev 2,2 g ogni 8 h (forme lievi 1,2 g ogni 8 h)',
    rene: [
      'Os: CrCl <30 non usare le cp da 875; 10–30: 500/125 mg ogni 12 h; <10: 500/125 mg ogni 24 h',
      'Ev: CrCl 10–30: 1,2 g, poi 600 mg ogni 12 h; <10: 1,2 g, poi 600 mg ogni 24 h',
    ],
    monitor: ['Transaminasi se terapia >7 giorni (epatite colestatica da clavulanato)'],
  },
  {
    id: 'ampisulb', via: 'ev', nome: 'Ampicillina/sulbactam', fiale: 'fl 3 g (2 g + 1 g) e 1,5 g',
    prep: '3 g in 100 mL di SF, in 30 min.',
    dose: '3 g ogni 6 h',
    rene: ['CrCl 15–29: 3 g ogni 12 h', 'CrCl 5–14: 3 g ogni 24 h'],
  },
  {
    id: 'piptazo', via: 'ev', nome: 'Piperacillina/tazobactam', fiale: 'fl 4,5 g (4 g + 0,5 g)',
    prep: '4,5 g in 100 mL di SF, in 30 min. Dopo la prima dose, meglio in infusione estesa di 4 h (ogni 6 h nella sepsi, ogni 8 h altrimenti).',
    dose: '4,5 g ogni 6 h (o ogni 8 h in infusione di 4 h) · sepsi: prima dose in 30 min, poi ogni 6 h in 4 h',
    rene: ['Prima dose sempre piena', 'CrCl 20–40: 4,5 g ogni 8 h', 'CrCl <20: 4,5 g ogni 12 h', 'Emodialisi: 4,5 g ogni 12 h, dose dopo la seduta'],
    monitor: ['Creatinina: nefrotossicità aumentata se associata a vancomicina'],
  },
  {
    id: 'ceftriaxone', via: 'ev · im', nome: 'Ceftriaxone', fiale: 'fl 1 g e 2 g (im 500 mg/1 g con lidocaina)',
    prep: '2 g in 100 mL di SF, in 30 min. 1 g in 10 mL di acqua ppi, ev lento in 5 min. Mai in linea con soluzioni contenenti calcio (Ringer lattato).',
    dose: '1–2 g ogni 24 h · meningite 2 g ogni 12 h',
    rene: ['Nessun aggiustamento', 'CrCl <10: massimo 2 g/die'],
    monitor: ['Fango biliare con dosi alte e prolungate'],
  },
  {
    id: 'cefepime', via: 'ev', nome: 'Cefepime', fiale: 'fl 1 g e 2 g',
    prep: '2 g in 100 mL di SF, in 30 min.',
    dose: '2 g ogni 8 h',
    rene: ['CrCl 30–60: 2 g ogni 12 h', 'CrCl 11–29: 2 g ogni 24 h', 'CrCl ≤10: 1 g ogni 24 h'],
    monitor: ['Neurotossicità (confusione, mioclonie, stato di male non convulsivo), soprattutto se la dose non è ridotta per il rene'],
  },
  {
    id: 'cefazolina', via: 'ev', nome: 'Cefazolina', fiale: 'fl 1 g e 2 g',
    prep: '2 g in 100 mL di SF, in 30 min (1 g anche ev lento in 3–5 min).',
    dose: '2 g ogni 8 h',
    rene: ['CrCl 35–54: dose piena ogni 8 h', 'CrCl 11–34: metà dose ogni 12 h', 'CrCl ≤10: metà dose ogni 18–24 h'],
  },
  {
    id: 'cefixima', via: 'os', nome: 'Cefixima', fiale: 'cp 400 mg',
    prep: 'Orale.',
    dose: '400 mg ogni 24 h',
    rene: ['CrCl <20: 200 mg ogni 24 h'],
  },
  {
    id: 'cefalexina', via: 'os', nome: 'Cefalexina', fiale: 'cp/cps 500 mg',
    prep: 'Orale.',
    dose: '500 mg ogni 6–8 h',
    rene: ['CrCl 10–50: 500 mg ogni 8–12 h', 'CrCl <10: 250–500 mg ogni 12–24 h'],
  },
  {
    id: 'meropenem', via: 'ev', nome: 'Meropenem', fiale: 'fl 500 mg e 1 g',
    prep: '1–2 g in 100 mL di SF, in 15–30 min la prima dose; poi infusione estesa in 3–4 h (stabile 8 h a temperatura ambiente).',
    dose: '1 g ogni 8 h · shock, meningite, ascesso cerebrale: 2 g ogni 8 h',
    rene: ['CrCl 26–50: stessa dose ogni 12 h', 'CrCl 10–25: metà dose ogni 12 h', 'CrCl <10: metà dose ogni 24 h'],
    monitor: ['Abbassa molto i livelli di valproato: evitare l’associazione'],
  },
  {
    id: 'ertapenem', via: 'ev', nome: 'Ertapenem', fiale: 'fl 1 g',
    prep: '1 g in 50–100 mL di SF, in 30 min. Non in glucosata.',
    dose: '1 g ogni 24 h',
    rene: ['CrCl ≤30: 500 mg ogni 24 h'],
    monitor: ['Non copre Pseudomonas né enterococco', 'Interazione con valproato'],
  },
  {
    id: 'ampicillina', via: 'ev', nome: 'Ampicillina', fiale: 'fl 1 g',
    prep: '2 g in 100 mL di SF, in 30 min.',
    dose: 'Listeria: 2 g ogni 4 h (o 3 g ogni 6 h)',
    rene: ['CrCl 10–50: 2 g ogni 6–8 h', 'CrCl <10: 2 g ogni 12 h'],
  },
  {
    id: 'vancomicina', via: 'ev', nome: 'Vancomicina', fiale: 'fl 500 mg e 1 g',
    prep: 'Massimo 10 mg/min e 5 mg/mL: 1 g in 250 mL di SF in 100 min; 1,5 g in 300–500 mL in 150 min. Più veloce = sindrome dell’uomo rosso.',
    dose: 'Paziente di 70 kg: carico 2 g ev = 2 fiale da 1 g (25–30 mg/kg di peso reale, massimo 3 g), poi 1–1,5 g ogni 12 h = 1 fiala da 1 g + 1 da 500 mg (15–20 mg/kg). In alternativa, dopo il carico, infusione continua 2 g/24 h in pompa (livello stazionario 20–25 mg/L): siringa del PS 2 g (o 1 g) in 50 mL di SF a 2 mL/h',
    rene: [
      'Carico sempre pieno',
      'CrCl 50–90: 1–1,5 g ogni 12 h',
      'CrCl 20–49: 1–1,5 g ogni 24 h',
      'CrCl <20 o dialisi: dosi successive guidate dai livelli',
    ],
    monitor: ['Valle prima della 4ª dose: 15–20 mg/L nelle infezioni gravi (oppure AUC 400–600)', 'Creatinina ogni 48 h'],
  },
  {
    id: 'linezolid', via: 'ev · os', nome: 'Linezolid', fiale: 'sacca 600 mg/300 mL · cp 600 mg',
    prep: 'Sacca pronta in 30–120 min. Biodisponibilità orale ~100%.',
    dose: '600 mg ogni 12 h',
    rene: ['Nessun aggiustamento'],
    monitor: ['Piastrine se >10 giorni', 'Sindrome serotoninergica con SSRI, SNRI, IMAO'],
  },
  {
    id: 'clindamicina', via: 'ev · os', nome: 'Clindamicina', fiale: 'fl 600 mg/4 mL · cps 150–300 mg',
    prep: '600 mg in 100 mL di SF in 20 min; 900 mg in 100 mL in 30 min (massimo 30 mg/min).',
    dose: 'Ev 600–900 mg ogni 8 h · os 300–450 mg ogni 6–8 h',
    rene: ['Nessun aggiustamento'],
    monitor: ['Diarrea: rischio alto di C. difficile'],
  },
  {
    id: 'metronidazolo', via: 'ev · os', nome: 'Metronidazolo', fiale: 'sacca 500 mg/100 mL · cp 250–500 mg',
    prep: 'Sacca pronta in 20–30 min.',
    dose: '500 mg ogni 8 h (ev o os)',
    rene: ['Nessun aggiustamento', 'Emodialisi: dose dopo la seduta'],
    monitor: ['Neuropatia se terapia lunga', 'Potenzia il warfarin'],
  },
  {
    id: 'levofloxacina', via: 'ev · os', nome: 'Levofloxacina', fiale: 'sacca 500 mg/100 mL · cp 500 mg',
    prep: 'Sacca pronta in almeno 60 min. Biodisponibilità orale ~100%: preferire os.',
    dose: '500 mg ogni 24 h · forme gravi 500 mg ogni 12 h',
    rene: [
      '500 mg/24 h — CrCl 20–49: 500 mg, poi 250 mg ogni 24 h; 10–19: 500 mg, poi 125 mg ogni 24 h; <10: 500 mg, poi 125 mg ogni 48 h',
      '500 mg/12 h — CrCl 20–49: 500 mg, poi 250 mg ogni 12 h; 10–19: 500 mg, poi 125 mg ogni 12 h; <10: 500 mg, poi 125 mg ogni 24 h',
    ],
    monitor: ['QT', 'Tendinopatia (anziani, steroidi), aneurisma/dissezione aortica, disglicemie, neuropatia: avvertenze EMA, solo se non ci sono alternative'],
  },
  {
    id: 'ciprofloxacina', via: 'ev · os', nome: 'Ciprofloxacina', fiale: 'sacca 400 mg/200 mL · cp 500 mg',
    prep: 'Sacca pronta in 60 min. Biodisponibilità orale ~80%: preferire os.',
    dose: 'Os 500 mg ogni 12 h (750 mg ogni 12 h se Pseudomonas) · ev 400 mg ogni 12 h (ogni 8 h se Pseudomonas)',
    rene: ['CrCl 30–60: os 250–500 mg ogni 12 h; ev 200–400 mg ogni 12 h', 'CrCl <30: os 250–500 mg ogni 24 h; ev 200–400 mg ogni 24 h'],
    monitor: ['Come levofloxacina; inibisce CYP1A2 (teofillina, clozapina, tizanidina)'],
  },
  {
    id: 'claritromicina', via: 'ev · os', nome: 'Claritromicina', fiale: 'fl 500 mg · cp 500 mg',
    prep: '500 mg in 10 mL di acqua ppi, poi in 250 mL di SF, in 60 min. Mai in bolo.',
    dose: '500 mg ogni 12 h',
    rene: ['CrCl <30: 250 mg ogni 12 h'],
    monitor: ['QT', 'Inibisce CYP3A4: statine, colchicina, alcuni DOAC, calcioantagonisti'],
  },
  {
    id: 'azitromicina', via: 'ev · os', nome: 'Azitromicina', fiale: 'fl 500 mg · cp 500 mg',
    prep: '500 mg in 250 mL di SF (2 mg/mL), in 60 min.',
    dose: '500 mg ogni 24 h',
    rene: ['Nessun aggiustamento; cautela se CrCl <10'],
    monitor: ['QT'],
  },
  {
    id: 'doxiciclina', via: 'os', nome: 'Doxiciclina', fiale: 'cp 100 mg',
    prep: 'Orale, con molta acqua e da seduti/in piedi (esofagite).',
    dose: '100 mg ogni 12 h (primo giorno anche 200 mg in una dose)',
    rene: ['Nessun aggiustamento'],
    monitor: ['Fotosensibilità', 'Non con antiacidi, ferro, calcio'],
  },
  {
    id: 'cotrimossazolo', via: 'os · ev', nome: 'Cotrimossazolo', fiale: 'cp forte 800/160 mg · fl 400/80 mg',
    prep: 'Orale.',
    dose: '1 cp forte (800/160 mg) ogni 12 h',
    rene: ['CrCl 15–30: metà dose', 'CrCl <15: evitare'],
    monitor: ['Potassio e creatinina (iperkaliemia, aumento creatinina)', 'Potenzia il warfarin', 'Emocromo se terapia lunga'],
  },
  {
    id: 'fosfomicina', via: 'os', nome: 'Fosfomicina trometamolo', fiale: 'bustina 3 g',
    prep: 'In mezzo bicchiere d’acqua, a stomaco vuoto, la sera dopo aver urinato.',
    dose: '3 g in dose singola',
    rene: ['CrCl <10: controindicata'],
  },
  {
    id: 'nitrofurantoina', via: 'os', nome: 'Nitrofurantoina', fiale: 'cps macrocristalli 50 e 100 mg',
    prep: 'Orale, a stomaco pieno.',
    dose: '100 mg ogni 6 h (macrocristalli 50–100 mg ×4)',
    rene: ['CrCl <45: evitare (accettabile un ciclo breve se 30–44 e non ci sono alternative)', 'CrCl <30: non usare'],
    monitor: ['Solo cistite: non raggiunge concentrazioni utili nel rene o nel sangue'],
  },
  {
    id: 'gentamicina', via: 'ev', nome: 'Gentamicina', fiale: 'fl 80 mg/2 mL',
    prep: 'Dose in 100 mL di SF, in 30–60 min.',
    dose: 'Paziente di 70 kg: 400 mg ev ogni 24 h = 5 fiale da 80 mg (5–7 mg/kg di peso ideale; peso corretto se obeso)',
    rene: ['CrCl <60: meglio evitare; se necessaria, stessa dose con intervallo guidato dai livelli (valle <1 mg/L)', 'Dose singola in PS (sepsi urinaria): dose piena senza aggiustamento'],
    monitor: ['Valle, creatinina, udito', 'Durata breve (≤3–5 giorni)'],
  },
  {
    id: 'amikacina', via: 'ev', nome: 'Amikacina', fiale: 'fl 500 mg/2 mL',
    prep: 'Dose in 100–200 mL di SF, in 30–60 min.',
    dose: 'Paziente di 70 kg: 1–1,5 g ev ogni 24 h = 2–3 fiale da 500 mg (15–20 mg/kg di peso ideale)',
    rene: ['CrCl <60: meglio evitare; se necessaria, intervallo guidato dai livelli (valle <2,5 mg/L)'],
    monitor: ['Valle, creatinina, udito'],
  },
  {
    id: 'aciclovir', via: 'ev', nome: 'Aciclovir', fiale: 'fl 250 mg',
    prep: 'Concentrazione ≤5 mg/mL (es. 750 mg in 250 mL di SF), in 60 min. Idratare bene.',
    dose: 'Paziente di 70 kg: 750 mg ev ogni 8 h = 3 fiale da 250 mg (10 mg/kg; peso ideale se obeso)',
    rene: ['CrCl 25–50: 750 mg ogni 12 h', 'CrCl 10–25: 750 mg ogni 24 h', 'CrCl <10: 375 mg ogni 24 h (1 fiala e mezza)'],
    monitor: ['Creatinina: nefropatia da cristalli', 'Neurotossicità se accumulo'],
  },
  {
    id: 'vancomicinaos', via: 'os', nome: 'Vancomicina orale', fiale: 'cps 125/250 mg, oppure fl ev da 500 mg sciolta e data per bocca/SNG',
    prep: 'Per bocca o da sondino. Ev non funziona sul C. difficile.',
    dose: '125 mg ogni 6 h · fulminante 500 mg ogni 6 h',
    rene: ['Nessun aggiustamento (non si assorbe)'],
  },
  {
    id: 'fidaxomicina', via: 'os', nome: 'Fidaxomicina', fiale: 'cp 200 mg',
    prep: 'Orale.',
    dose: '200 mg ogni 12 h',
    rene: ['Nessun aggiustamento'],
  },
  {
    id: 'benzatina', via: 'im', nome: 'Benzilpenicillina benzatina', fiale: 'fl 1.200.000 UI',
    prep: 'Solo intramuscolo profondo (gluteo). Mai ev.',
    dose: '1.200.000 UI in dose singola',
    rene: ['Nessun aggiustamento'],
  },
  {
    id: 'imipenem', via: 'ev', nome: 'Imipenem/cilastatina', fiale: 'fl 500 mg',
    prep: '500 mg in 100 mL di SF in 30 min (1 g in 60 min); infusione estesa fino a 3 h (stabile 4 h).',
    dose: '500 mg ogni 6 h · grave: carico 1 g, poi 1 g ogni 6–8 h',
    rene: ['CrCl 60–89: 400 mg ogni 6 h', 'CrCl 30–59: 300 mg ogni 6 h', 'CrCl 15–29: 200 mg ogni 6 h', 'CrCl <15: solo se in dialisi'],
    monitor: ['Convulsioni (più del meropenem): evitarlo nelle infezioni del SNC', 'Interazione con valproato'],
  },
  {
    id: 'daptomicina', via: 'ev', nome: 'Daptomicina', fiale: 'fl 350 mg e 500 mg',
    prep: 'In 50 mL di SF in 30 min (o bolo in 2 min). Non in glucosata.',
    dose: '10 mg/kg ogni 24 h (70 kg: 700 mg)',
    rene: ['CrCl <30 o dialisi: stessa dose ogni 48 h'],
    monitor: ['CPK settimanale; sospendere le statine', 'Non per la polmonite (inattivata dal surfattante)'],
  },
  {
    id: 'caspofungina', via: 'ev', nome: 'Caspofungina', fiale: 'fl 50 mg e 70 mg (frigo)',
    prep: 'In 250 mL di SF in 1 h. Non in glucosata.',
    dose: '70 mg il primo giorno, poi 50 mg ogni 24 h (70 mg se > 80 kg)',
    rene: ['Nessun aggiustamento', 'Insufficienza epatica moderata: 35 mg/die dopo il carico'],
  },
  {
    id: 'ceftazavi', via: 'ev', nome: 'Ceftazidime/avibactam', fiale: 'fl 2,5 g (2 g + 0,5 g)',
    prep: 'In 100 mL di SF, infusione di 2 h.',
    dose: '2,5 g ogni 8 h (riservato: consulenza infettivologica)',
    rene: ['CrCl 31–50: 1,25 g ogni 8 h', 'CrCl 16–30: 0,94 g ogni 12 h', 'CrCl 6–15: 0,94 g ogni 24 h', 'CrCl ≤5: 0,94 g ogni 48 h'],
  },
  {
    id: 'aztreonam', via: 'ev', nome: 'Aztreonam', fiale: 'fl 1 g',
    prep: '2 g in 100 mL di SF in 30–60 min; con ceftazidime/avibactam darli in contemporanea.',
    dose: '2 g ogni 8 h',
    rene: ['CrCl 10–30: 2 g, poi 1 g ogni 8 h', 'CrCl <10: 2 g, poi 500 mg ogni 8 h'],
    monitor: ['Sicuro nell’allergia alle penicilline; reazione crociata con ceftazidime (stessa catena laterale)'],
  },
  {
    id: 'cefiderocol', via: 'ev', nome: 'Cefiderocol', fiale: 'fl 1 g',
    prep: '2 g in 100 mL di SF, infusione di 3 h.',
    dose: '2 g ogni 8 h (riservato: consulenza infettivologica)',
    rene: ['CrCl ≥120: 2 g ogni 6 h', 'CrCl 30–59: 1,5 g ogni 8 h', 'CrCl 15–29: 1 g ogni 8 h', 'CrCl <15: 0,75 g ogni 12 h'],
  },
  {
    id: 'ceftolozano', via: 'ev', nome: 'Ceftolozano/tazobactam', fiale: 'fl 1,5 g (1 g + 0,5 g)',
    prep: 'In 100 mL di SF in 1 h.',
    dose: 'Polmonite: 3 g ogni 8 h · altre infezioni: 1,5 g ogni 8 h',
    rene: ['CrCl 30–50: metà dose ogni 8 h', 'CrCl 15–29: un quarto della dose ogni 8 h'],
  },
  {
    id: 'tigeciclina', via: 'ev', nome: 'Tigeciclina', fiale: 'fl 50 mg',
    prep: 'In 100 mL di SF in 30–60 min.',
    dose: '100 mg, poi 50 mg ogni 12 h · alte dosi (Acinetobacter, KPC): 200 mg, poi 100 mg ogni 12 h',
    rene: ['Nessun aggiustamento'],
    monitor: ['Nausea e vomito; pancreatite; non per batteriemie isolate (livelli ematici bassi)'],
  },
  {
    id: 'colistina', via: 'ev', nome: 'Colistimetato', fiale: 'fl 1 e 2 milioni di UI (MU)',
    prep: 'In 50–100 mL di SF in 30–60 min.',
    dose: 'Carico 9 MU, poi 4,5 MU ogni 12 h (riservato: consulenza infettivologica)',
    rene: ['Carico sempre pieno', 'CrCl <50: ridurre il mantenimento (calcolo su CrCl, consulenza)'],
    monitor: ['Nefrotossicità: creatinina ogni giorno; evitare vancomicina e aminoglicosidi insieme'],
  },
  {
    id: 'desametasone', via: 'ev', nome: 'Desametasone', fiale: 'fl 4 mg e 8 mg',
    prep: 'Ev in bolo.',
    dose: '10 mg ogni 6 h per 4 giorni, prima o insieme alla prima dose di antibiotico',
    rene: ['Nessun aggiustamento'],
    monitor: ['Glicemia', 'Sospendere se non è pneumococco'],
  },
  {
    id: 'idrocortisone', via: 'ev', nome: 'Idrocortisone', fiale: 'fl 100 mg',
    prep: 'Ev in bolo o infusione continua.',
    dose: '200 mg/die (50 mg ogni 6 h o infusione continua)',
    rene: ['Nessun aggiustamento'],
    monitor: ['Glicemia'],
  },
]

export const CONDIZIONI: Condizione[] = [
  // ─── Respiratorie ───
  {
    id: 'cap', nome: 'Polmonite comunitaria (CAP)', gruppo: 'Respiratorie',
    sintesi: 'Domicilio: amoxicillina. Ricovero: ceftriaxone + macrolide.',
    blocchi: [
      { titolo: 'Domicilio, senza comorbidità', righe: ['{amoxicillina} 1 g os ogni 8 h', 'Alternative: {doxiciclina} 100 mg os ogni 12 h; {claritromicina} 500 mg os ogni 12 h (Toscana: pneumococco resistente ai macrolidi 17%, sotto la soglia IDSA del 25%)'] },
      { titolo: 'Domicilio, con comorbidità (BPCO, cuore, rene, fegato, diabete, alcol, neoplasia)', righe: ['{amoxclav} 875/125 mg os ogni 8 h + {claritromicina} 500 mg os ogni 12 h (o {doxiciclina})', 'Alternativa: {levofloxacina} 500 mg os ogni 24 h da sola'] },
      { titolo: 'Ricovero, non grave', righe: ['{ceftriaxone} 1–2 g ev ogni 24 h + {claritromicina} 500 mg ev ogni 12 h (o {azitromicina} 500 mg ev ogni 24 h)', 'Alternativa: {amoxclav} 2,2 g ev ogni 8 h + macrolide'] },
      { titolo: 'Grave (shock, ventilazione, ≥3 criteri minori ATS)', righe: ['{ceftriaxone} 2 g ev ogni 24 h + {azitromicina} 500 mg ev ogni 24 h (o {claritromicina})', '+ {idrocortisone} 200 mg/die ev (ATS 2025: suggerito nella CAP grave, non se influenza)'] },
      { titolo: 'Rischio Pseudomonas o MRSA (isolamento respiratorio precedente; ricovero con antibiotici ev negli ultimi 90 giorni)', righe: ['Pseudomonas: {piptazo} 4,5 g ev ogni 6 h o {cefepime} 2 g ev ogni 8 h, al posto del ceftriaxone', 'MRSA: aggiungere {vancomicina} o {linezolid} 600 mg ev/os ogni 12 h'] },
      { titolo: 'Allergia grave ai betalattamici', righe: ['{levofloxacina} 500 mg ev o os ogni 12 h (in reparto), 500 mg os ogni 24 h (a domicilio)'] },
    ],
    durata: 'Almeno 3 giorni se non grave e stabile (ATS 2025), di solito 5; ≥5 giorni se grave; 7 se Pseudomonas o MRSA.',
    note: ['Nel ricovero: emocolture ed espettorato se grave; antigeni urinari per Legionella e pneumococco', 'Aspirazione senza ascesso o empiema: nessuna copertura anaerobi aggiuntiva', 'Toscana 2024 (ARS): pneumococco resistente alla penicillina 1,6%, ai macrolidi 17%; S. aureus resistente alla meticillina 18,9%'],
  },
  {
    id: 'hap', nome: 'Polmonite nosocomiale o legata all’assistenza', gruppo: 'Respiratorie',
    sintesi: 'Piperacillina/tazobactam o cefepime; doppia copertura e anti-MRSA se grave.',
    blocchi: [
      { titolo: 'Non grave, senza fattori di rischio MDR', righe: ['{piptazo} 4,5 g ev ogni 6 h', 'Oppure {cefepime} 2 g ev ogni 8 h', 'Oppure {levofloxacina} 500 mg ev ogni 12 h'] },
      { titolo: 'Shock, ventilazione o antibiotici ev negli ultimi 90 giorni', righe: ['Due anti-Pseudomonas di classi diverse: {piptazo} o {cefepime} o {meropenem} 1 g ev ogni 8 h + {levofloxacina} 500 mg ev ogni 12 h o {amikacina} 1–1,5 g ev ogni 24 h (15–20 mg/kg)', '{meropenem} se colonizzazione nota da ESBL'] },
      { titolo: 'Rischio MRSA (MRSA noto, reparto con MRSA >20%, antibiotici ev nei 90 giorni)', righe: ['Aggiungere {vancomicina} carico 2 g ev = 2 fiale da 1 g (25–30 mg/kg) o {linezolid} 600 mg ev/os ogni 12 h'] },
      { titolo: 'Allergia grave ai betalattamici', righe: ['{levofloxacina} 500 mg ev ogni 12 h + {amikacina} + {vancomicina} o {linezolid}; consulenza infettivologica'] },
    ],
    durata: '7 giorni.',
    note: ['La «HCAP» non esiste più: una polmonite in RSA senza fattori di rischio si tratta come la CAP',
      'Colonizzazione nota da Klebsiella resistente ai carbapenemi: vedi Sepsi', 'Togliere l’anti-MRSA se il tampone nasale MRSA è negativo e la coltura non lo trova'],
  },
  {
    id: 'bpco', nome: 'Riacutizzazione di BPCO', gruppo: 'Respiratorie',
    sintesi: 'Solo se espettorato purulento o ventilazione: amoxicillina/clavulanato.',
    blocchi: [
      { titolo: 'Indicazione', righe: ['Aumento della purulenza dell’espettorato + dispnea o volume dell’espettorato; oppure NIV o ventilazione invasiva'] },
      { titolo: 'Prima scelta', righe: ['{amoxclav} 875/125 mg os ogni 12 h', 'Alternative: {doxiciclina} 100 mg os ogni 12 h; {claritromicina} 500 mg os ogni 12 h'] },
      { titolo: 'Rischio Pseudomonas (FEV1 <30%, bronchiectasie, isolamento precedente)', righe: ['{ciprofloxacina} 750 mg os ogni 12 h o {levofloxacina} 500 mg os ogni 12 h'] },
    ],
    durata: '5 giorni.',
  },
  {
    id: 'faringite', nome: 'Faringotonsillite streptococcica', gruppo: 'Respiratorie',
    sintesi: 'Solo se test rapido positivo: amoxicillina 10 giorni.',
    blocchi: [
      { titolo: 'Indicazione', righe: ['Centor/McIsaac ≥2–3 → test rapido o coltura. Antibiotico solo se positivo'] },
      { titolo: 'Prima scelta', righe: ['{amoxicillina} 1 g os ogni 24 h (o 500 mg ogni 12 h)', 'Oppure {benzatina} 1.200.000 UI im in dose singola (se aderenza incerta)'] },
      { titolo: 'Allergia non grave', righe: ['{cefalexina} 500 mg os ogni 12 h'] },
      { titolo: 'Allergia grave', righe: ['{claritromicina} 250 mg os ogni 12 h per 10 giorni', 'Oppure {azitromicina} 500 mg os ogni 24 h per 5 giorni', 'Oppure {clindamicina} 300 mg os ogni 8 h per 10 giorni'] },
      { titolo: 'Ascesso peritonsillare', righe: ['Drenaggio ORL + {ampisulb} 3 g ev ogni 6 h o {amoxclav} 2,2 g ev ogni 8 h; allergia: {clindamicina} 600 mg ev ogni 8 h'] },
    ],
    durata: '10 giorni (azitromicina 5).',
    note: ['Amoxicillina nella mononucleosi: rash, ma non è un’allergia'],
  },
  // ─── Urogenitali ───
  {
    id: 'cistite', nome: 'Cistite non complicata (donna)', gruppo: 'Urogenitali',
    sintesi: 'Fosfomicina 3 g dose unica o nitrofurantoina 5 giorni.',
    blocchi: [
      { titolo: 'Prima scelta', righe: ['{fosfomicina} 3 g os in dose singola', 'Oppure {nitrofurantoina} 100 mg os ogni 6 h per 5 giorni'] },
      { titolo: 'Da non usare in empirica in Toscana (ARS 2024, E. coli urinario)', righe: ['Cotrimossazolo (resistente 26,5%), amoxicillina/clavulanato (31,9%), chinoloni (25,3%; anche avvertenza EMA): solo se l’urinocoltura li dà sensibili'] },
      { titolo: 'Uomo', righe: ['Trattare 7 giorni, guidati dall’urinocoltura: {cotrimossazolo} o {nitrofurantoina}; febbre o dolore perineale → prostatite'] },
      { titolo: 'Gravidanza', righe: ['{fosfomicina} 3 g os dose singola, oppure {cefalexina} 500 mg os ogni 8 h per 5–7 giorni. Sempre urinocoltura e controllo dopo la terapia'] },
    ],
    durata: 'Fosfomicina 1 dose; nitrofurantoina 5 giorni; cotrimossazolo 3 giorni; uomo 7 giorni.',
    note: ['Batteriuria asintomatica: non trattare (eccezioni: gravidanza, prima di procedure urologiche invasive)'],
  },
  {
    id: 'pielonefrite', nome: 'Pielonefrite e IVU complicata', gruppo: 'Urogenitali',
    sintesi: 'Ceftriaxone; ESBL o sepsi: carbapenemico o piperacillina/tazobactam.',
    blocchi: [
      { titolo: 'Domicilio', righe: ['{ceftriaxone} 1 g ev o im in PS, poi orale secondo antibiogramma', 'Chinoloni orali ({ciprofloxacina} 500 mg os ogni 12 h, {levofloxacina} 500 mg os ogni 24 h) solo su antibiogramma: in Toscana E. coli urinario resistente nel 25%', 'Proseguimento empirico: {cefixima} 400 mg os ogni 24 h per 10 giorni (E. coli urinario resistente alle cefalosporine di 3ª generazione 12,8% in Toscana)'] },
      { titolo: 'Ricovero senza sepsi', righe: ['{ceftriaxone} 1–2 g ev ogni 24 h', 'Rischio ESBL (ESBL noto, antibiotici o ricovero negli ultimi 3 mesi, RSA, catetere): {ertapenem} 1 g ev ogni 24 h'] },
      { titolo: 'Sepsi o shock', righe: ['{meropenem} 1 g ev ogni 8 h (in Toscana E. coli delle emocolture resistente al ceftriaxone nel 28%), oppure {piptazo} 4,5 g ev ogni 6 h se meno di 2 fattori di rischio ESBL', 'Shock: {meropenem} 2 g ev ogni 8 h + {vancomicina} (enterococco)', 'Eventuale {gentamicina} 400 mg ev (5–7 mg/kg) dose singola o {amikacina} 1–1,5 g ev (15–20 mg/kg)', 'Ostruzione (calcolo, idronefrosi): drenaggio urgente'] },
      { titolo: 'Allergia grave ai betalattamici', righe: ['{ciprofloxacina} 400 mg ev ogni 12 h o {levofloxacina} 500 mg ev ogni 24 h ± {amikacina} 1–1,5 g ev ogni 24 h (15–20 mg/kg)'] },
      { titolo: 'Catetere vescicale', righe: ['Sostituire il catetere prima della coltura; terapia come sopra'] },
    ],
    durata: '7 giorni se miglioramento rapido, anche con batteriemia (IDSA 2025); 10–14 giorni se ascesso, ostruzione non risolta, immunodepressione, prostatite non esclusa. Passare a os appena possibile.',
    note: ['Urinocoltura ed emocolture prima dell’antibiotico', 'Eco renale se sepsi, mancata risposta a 48–72 h, sospetta ostruzione'],
  },
  {
    id: 'prostatite', nome: 'Prostatite acuta', gruppo: 'Urogenitali',
    sintesi: 'Ceftriaxone ev, poi chinolone os per 2–4 settimane.',
    blocchi: [
      { titolo: 'Ricovero/grave', righe: ['{ceftriaxone} 2 g ev ogni 24 h; sepsi o rischio ESBL: {piptazo} 4,5 g ev ogni 6 h o {meropenem} 1 g ev ogni 8 h'] },
      { titolo: 'Domicilio o passaggio a os', righe: ['{levofloxacina} 500 mg os ogni 24 h o {ciprofloxacina} 500 mg os ogni 12 h, secondo antibiogramma', 'Alternativa: {cotrimossazolo} 800/160 mg os ogni 12 h'] },
      { titolo: 'Allergia grave ai betalattamici', righe: ['{levofloxacina} o {ciprofloxacina} ev'] },
    ],
    durata: '2–4 settimane (EAU).',
    note: ['Niente massaggio prostatico', 'Ritenzione: catetere sovrapubico o uretrale a breve', 'Mancata risposta a 48 h: TC o eco transrettale per ascesso'],
  },
  {
    id: 'orchiepididimite', nome: 'Orchiepididimite', gruppo: 'Urogenitali',
    sintesi: 'Rischio IST: ceftriaxone 500 mg im + doxiciclina. Enterici: levofloxacina.',
    blocchi: [
      { titolo: 'Rischio IST (di solito <35 anni)', righe: ['{ceftriaxone} 500 mg im in dose singola (1 g se ≥150 kg) + {doxiciclina} 100 mg os ogni 12 h per 10 giorni'] },
      { titolo: 'Rischio IST + enterici (rapporti anali insertivi)', righe: ['{ceftriaxone} 500 mg im in dose singola + {levofloxacina} 500 mg os ogni 24 h per 10 giorni'] },
      { titolo: 'Solo enterici (>35 anni, procedure urologiche, ostruzione, nessun rischio IST)', righe: ['{levofloxacina} 500 mg os ogni 24 h per 10 giorni', 'Alternativa secondo urinocoltura: {cotrimossazolo}'] },
    ],
    durata: '10 giorni.',
    note: ['Escludere sempre la torsione (eco-doppler)', 'Tampone o urine di primo getto per gonococco e clamidia (PCR); trattare il partner'],
  },
  // ─── Addominali ───
  {
    id: 'enterocolite', nome: 'Gastroenterite / enterocolite infettiva', gruppo: 'Addominali',
    sintesi: 'Di solito niente antibiotico. Se indicato: azitromicina.',
    blocchi: [
      { titolo: 'Quando trattare', righe: ['Febbre alta o sangue nelle feci con quadro sistemico, sepsi, immunodepressione, età avanzata con comorbidità, protesi vascolari, diarrea del viaggiatore grave'] },
      { titolo: 'Empirica', righe: ['{azitromicina} 1 g os in dose singola o 500 mg ogni 24 h per 3 giorni', 'Alternativa: {ciprofloxacina} 500 mg os ogni 12 h per 3 giorni (Campylobacter spesso resistente)'] },
      { titolo: 'Sepsi', righe: ['{ceftriaxone} 2 g ev ogni 24 h'] },
      { titolo: 'Non dare antibiotici', righe: ['Sospetta E. coli produttore di Shiga-tossina (diarrea sanguinolenta senza febbre, focolaio): rischio di SEU', 'Salmonella non tifoidea nell’immunocompetente senza fattori di rischio'] },
    ],
    durata: '1–3 giorni (Salmonella con batteriemia: 7–14).',
    note: ['Antibiotici recenti o ricovero: cercare C. difficile'],
  },
  {
    id: 'cdiff', nome: 'Colite da C. difficile', gruppo: 'Addominali',
    sintesi: 'Fidaxomicina o vancomicina orale. Metronidazolo ev solo nel fulminante.',
    blocchi: [
      { titolo: 'Primo episodio', righe: ['{fidaxomicina} 200 mg os ogni 12 h (preferita, meno recidive)', 'Oppure {vancomicinaos} 125 mg os ogni 6 h'] },
      { titolo: 'Fulminante (ipotensione, shock, ileo, megacolon)', righe: ['{vancomicinaos} 500 mg os ogni 6 h per bocca o SNG + {metronidazolo} 500 mg ev ogni 8 h', 'Se ileo: anche vancomicina per clistere (500 mg in 100 mL di SF ogni 6 h)', 'Consulenza chirurgica'] },
      { titolo: 'Prima recidiva', righe: ['{fidaxomicina} 200 mg os ogni 12 h per 10 giorni', 'Valutare bezlotoxumab o trapianto fecale per le recidive successive'] },
    ],
    durata: '10 giorni.',
    note: ['Sospendere l’antibiotico che l’ha provocata se possibile; niente antidiarroici', 'Metronidazolo os solo se gli altri non sono disponibili, nella forma non grave'],
  },
  {
    id: 'diverticolite', nome: 'Diverticolite acuta', gruppo: 'Addominali',
    sintesi: 'Non complicata: spesso senza antibiotico. Complicata: amoxicillina/clavulanato ev.',
    blocchi: [
      { titolo: 'Non complicata, immunocompetente, senza sepsi', righe: ['Osservazione senza antibiotico (WSES, AGA)', 'Antibiotico se comorbidità importanti, immunodepressione, PCR > 140 mg/L, leucociti > 15.000 o febbre persistente: {amoxclav} 875/125 mg os ogni 8 h'] },
      { titolo: 'Complicata (ascesso, perforazione)', righe: ['{amoxclav} 2,2 g ev ogni 8 h', 'Oppure {ceftriaxone} 2 g ev ogni 24 h + {metronidazolo} 500 mg ev ogni 8 h', 'Ascesso ≥ 3–4 cm (soglia 3–5 cm secondo le linee guida e il radiologo): drenaggio percutaneo'] },
      { titolo: 'Sepsi, peritonite diffusa o infezione nosocomiale', righe: ['{piptazo} 4,5 g ev ogni 6 h; rischio ESBL o shock: {meropenem} 1 g ev ogni 8 h'] },
      { titolo: 'Allergia grave ai betalattamici', righe: ['{ciprofloxacina} 400 mg ev ogni 12 h (500 mg os) + {metronidazolo} 500 mg ev ogni 8 h'] },
    ],
    durata: 'Non complicata 4–7 giorni se trattata; complicata 4 giorni dopo il controllo della fonte (drenaggio o chirurgia).',
  },
  {
    id: 'appendicite', nome: 'Appendicite', gruppo: 'Addominali',
    sintesi: 'Profilassi preoperatoria; antibiotico dopo l’intervento solo se complicata.',
    blocchi: [
      { titolo: 'Non complicata, operata', righe: ['Profilassi in dose singola prima dell’intervento: {cefazolina} 2 g ev + {metronidazolo} 500 mg ev, oppure {amoxclav} 2,2 g ev', 'Nessun antibiotico dopo l’intervento'] },
      { titolo: 'Non complicata, gestione conservativa', righe: ['{amoxclav} 2,2 g ev ogni 8 h, poi 875/125 mg ogni 8 h os'] },
      { titolo: 'Complicata (perforata, ascesso, peritonite)', righe: ['{amoxclav} 2,2 g ev ogni 8 h, oppure {ceftriaxone} 2 g ev ogni 24 h + {metronidazolo} 500 mg ev ogni 8 h', 'Grave o nosocomiale: {piptazo} 4,5 g ev ogni 6 h'] },
      { titolo: 'Allergia grave ai betalattamici', righe: ['{ciprofloxacina} 400 mg ev ogni 12 h + {metronidazolo} 500 mg ev ogni 8 h (profilassi: {clindamicina} 900 mg ev + {gentamicina} 350 mg ev (5 mg/kg))'] },
    ],
    durata: 'Gestione conservativa 7–10 giorni totali; complicata 4 giorni dopo il controllo della fonte (3–5).',
  },
  {
    id: 'colecistite', nome: 'Colecistite e colangite', gruppo: 'Addominali',
    sintesi: 'Ceftriaxone + metronidazolo; grave: piperacillina/tazobactam.',
    blocchi: [
      { titolo: 'Grado I–II (Tokyo), comunitaria', righe: ['{ceftriaxone} 2 g ev ogni 24 h + {metronidazolo} 500 mg ev ogni 8 h', 'Oppure {amoxclav} 2,2 g ev ogni 8 h (o {ampisulb} 3 g ev ogni 6 h) se le resistenze locali lo consentono', 'Oppure {ertapenem} 1 g ev ogni 24 h se rischio ESBL'] },
      { titolo: 'Grado III o legata all’assistenza (stent biliare, anastomosi bilio-digestiva)', righe: ['{piptazo} 4,5 g ev ogni 6 h', 'Oppure {cefepime} 2 g ev ogni 8 h + {metronidazolo}', 'Shock o ESBL: {meropenem} 1 g ev ogni 8 h', 'Grado III o nosocomiale: aggiungere {vancomicina} per l’enterococco; se colonizzato da VRE (E. faecium resistente alla vancomicina nel 35% in Toscana) {linezolid} 600 mg ev ogni 12 h'] },
      { titolo: 'Allergia grave ai betalattamici', righe: ['{ciprofloxacina} 400 mg ev ogni 12 h + {metronidazolo} 500 mg ev ogni 8 h; grave: + {vancomicina}'] },
    ],
    durata: 'Colecistite operata entro 24–48 h: stop entro 24 h dall’intervento. Colangite o colecistite complicata: 4–7 giorni dopo il drenaggio (CPRE, colecistostomia).',
    note: ['Colangite: il drenaggio biliare è la terapia; urgente se grado III'],
  },
  {
    id: 'peritonite', nome: 'Peritonite secondaria / infezione intra-addominale complicata', gruppo: 'Addominali',
    sintesi: 'Comunitaria: ceftriaxone + metronidazolo. Grave: piperacillina/tazobactam o meropenem.',
    blocchi: [
      { titolo: 'Comunitaria, non grave', righe: ['{ceftriaxone} 2 g ev ogni 24 h + {metronidazolo} 500 mg ev ogni 8 h', 'Oppure {amoxclav} 2,2 g ev ogni 8 h'] },
      { titolo: 'Grave (shock, APACHE alto) o nosocomiale/postoperatoria', righe: ['{piptazo} 4,5 g ev ogni 6 h', 'ESBL noto o shock: {meropenem} 1 g ev ogni 8 h', 'Nosocomiale: aggiungere {vancomicina} (enterococco); antimicotico se perforazione gastrica/duodenale in immunodepresso o colonizzazione da Candida'] },
      { titolo: 'Allergia grave ai betalattamici', righe: ['{ciprofloxacina} 400 mg ev ogni 12 h + {metronidazolo} 500 mg ev ogni 8 h ± {vancomicina}'] },
    ],
    durata: '4 giorni dopo il controllo della fonte (STOP-IT).',
  },
  {
    id: 'pbs', nome: 'Peritonite batterica spontanea (cirrosi)', gruppo: 'Addominali',
    sintesi: 'Ceftriaxone + albumina; nosocomiale: piperacillina/tazobactam o meropenem.',
    blocchi: [
      { titolo: 'Diagnosi', righe: ['Neutrofili nell’ascite ≥250/mm³'] },
      { titolo: 'Comunitaria', righe: ['{ceftriaxone} 2 g ev ogni 24 h'] },
      { titolo: 'Nosocomiale o profilassi con chinoloni', righe: ['{piptazo} 4,5 g ev ogni 6 h; ESBL o shock: {meropenem} 1 g ev ogni 8 h ± {vancomicina}'] },
      { titolo: 'Albumina (EASL)', righe: ['1,5 g/kg il giorno 1 (entro 6 h) e 1 g/kg il giorno 3: riduce l’insufficienza renale'] },
      { titolo: 'Allergia grave ai betalattamici', righe: ['{ciprofloxacina} 400 mg ev ogni 12 h (se non in profilassi con chinoloni)'] },
    ],
    durata: '5–7 giorni; paracentesi di controllo a 48 h (neutrofili ridotti di almeno il 25%).',
  },
  // ─── SNC ───
  {
    id: 'meningite', nome: 'Meningite batterica', gruppo: 'SNC',
    sintesi: 'Desametasone + ceftriaxone 2 g ogni 12 h ± ampicillina ± vancomicina. Entro 1 h.',
    blocchi: [
      { titolo: 'Subito (anche prima della TC se ritarda; emocolture prima)', righe: ['{desametasone} 10 mg ev prima o con la prima dose, poi ogni 6 h per 4 giorni', '{ceftriaxone} 2 g ev ogni 12 h'] },
      { titolo: 'Aggiungere', righe: ['Età >50 anni, immunodepressione, alcolismo, gravidanza, diabete, neoplasia (Listeria): {ampicillina} 2 g ev ogni 4 h', 'Pneumococco resistente probabile (viaggi, area con resistenza alla penicillina): {vancomicina} carico 2 g ev = 2 fiale da 1 g (25–30 mg/kg)'] },
      { titolo: 'Postneurochirurgica, derivazione, trauma penetrante', righe: ['{meropenem} 2 g ev ogni 8 h (o {cefepime} 2 g ev ogni 8 h) + {linezolid} 600 mg ev ogni 12 h o {vancomicina}'] },
      { titolo: 'Sospetta encefalite (confusione, crisi, segni focali)', righe: ['Aggiungere {aciclovir} 750 mg ev ogni 8 h = 3 fiale da 250 mg (10 mg/kg)'] },
      { titolo: 'Allergia grave ai betalattamici', righe: ['{vancomicina} + {meropenem} 2 g ev ogni 8 h (reattività crociata <1%) oppure, se anafilassi anche ai carbapenemi, moxifloxacina 400 mg/die + {vancomicina}; Listeria: {cotrimossazolo} 350 mg di trimetoprim ev ogni 6–8 h (5 mg/kg)'] },
    ],
    durata: 'Meningococco 7 giorni; H. influenzae 7–10; pneumococco 10–14; Listeria 21.',
    note: [
      'Profilassi dei contatti stretti (meningococco): {ciprofloxacina} 500 mg os dose singola, oppure {ceftriaxone} 250 mg im dose singola (gravidanza)',
      'Desametasone: continuare solo se pneumococco',
    ],
  },
  {
    id: 'ascesso-cerebrale', nome: 'Ascesso cerebrale', gruppo: 'SNC',
    sintesi: 'Primario: ceftriaxone + metronidazolo; post-traumatico o chirurgico: + anti-MRSA. Neurochirurgo.',
    blocchi: [
      { titolo: 'Subito', righe: ['TC o RM con contrasto, emocolture; neurochirurgo (Careggi) per aspirazione o drenaggio: il materiale guida la terapia'] },
      { titolo: 'Primario (otogeno, sinusale, dentario, ematogeno)', righe: ['{ceftriaxone} 2 g ev ogni 12 h + {metronidazolo} 500 mg ev ogni 8 h', 'Allergia: {meropenem} 2 g ev ogni 8 h'] },
      { titolo: 'Post-traumatico', righe: ['Come il primario + {linezolid} 600 mg ev ogni 12 h o {vancomicina}'] },
      { titolo: 'Postchirurgico', righe: ['{meropenem} 2 g ev ogni 8 h (o {cefepime} 2 g ogni 8 h) + {linezolid} o {vancomicina}'] },
    ],
    durata: '6–8 settimane ev (meno se drenato e in rapido miglioramento), guidata dalle immagini.',
    note: ['Cortisonico solo se edema con effetto massa', 'Antiepilettico se crisi'],
  },
  // ─── Cute ───
  {
    id: 'cellulite', nome: 'Cellulite ed erisipela', gruppo: 'Cute',
    sintesi: 'Non purulenta: cefalexina o amoxicillina/clavulanato; ev: cefazolina.',
    blocchi: [
      { titolo: 'Non purulenta, domicilio', righe: ['{cefalexina} 500 mg os ogni 6 h', 'Oppure {amoxclav} 875/125 mg os ogni 8 h', 'Erisipela tipica: {amoxicillina} 1 g os ogni 8 h'] },
      { titolo: 'Non purulenta, ricovero', righe: ['{cefazolina} 2 g ev ogni 8 h', 'Oppure {amoxclav} 2,2 g ev ogni 8 h'] },
      { titolo: 'Purulenta (ascesso) o rischio MRSA', righe: ['Incisione e drenaggio prima di tutto', 'Os: {cotrimossazolo} 1–2 cp forti os ogni 12 h o {doxiciclina} 100 mg os ogni 12 h', 'Ev: {vancomicina} o {linezolid} 600 mg ev/os ogni 12 h'] },
      { titolo: 'Allergia grave ai betalattamici', righe: ['{clindamicina} 600 mg ev ogni 8 h o 300–450 mg ogni 6–8 h os'] },
      { titolo: 'Morso (cane, gatto, umano)', righe: ['{amoxclav} 875/125 mg os ogni 12 h per 3–5 giorni (profilassi) o 7–14 (infezione)', 'Allergia: {doxiciclina} + {metronidazolo}, oppure {cotrimossazolo} + {clindamicina}'] },
    ],
    durata: '5 giorni, prolungare se non migliora.',
    note: ['Segnare i margini con il pennarello', 'Sollevare l’arto, trattare intertrigine e tinea pedis'],
  },
  {
    id: 'fascite', nome: 'Fascite necrotizzante', gruppo: 'Cute',
    sintesi: 'Chirurgia subito + piperacillina/tazobactam + clindamicina + vancomicina.',
    blocchi: [
      { titolo: 'Segni', righe: ['Dolore sproporzionato, rapida progressione, bolle, crepitio, anestesia cutanea, shock; LRINEC aiuta ma non esclude'] },
      { titolo: 'Terapia', righe: ['Debridement chirurgico urgente', '{piptazo} 4,5 g ev ogni 6 h (o {meropenem} 1 g ev ogni 8 h) + {clindamicina} 900 mg ev ogni 8 h (antitossina) + {vancomicina} carico 2 g ev = 2 fiale da 1 g (25–30 mg/kg) (o {linezolid} 600 mg ev/os ogni 12 h, che è anche antitossina)'] },
      { titolo: 'Allergia grave ai betalattamici', righe: ['{vancomicina} o {linezolid} + {clindamicina} + {ciprofloxacina} 400 mg ev ogni 8 h + {metronidazolo}'] },
    ],
    durata: 'Fino a nessun nuovo debridement necessario + 48–72 h senza febbre.',
  },
  // ─── Sistemiche ───
  {
    id: 'sepsi', nome: 'Sepsi senza focolaio evidente', gruppo: 'Sistemiche',
    sintesi: 'Piperacillina/tazobactam ± vancomicina entro 1 h; meropenem se ESBL o shock.',
    blocchi: [
      { titolo: 'Entro 1 h (shock) o 3 h (sepsi possibile senza shock)', righe: ['Emocolture ×2 prima, senza ritardare l’antibiotico', '{piptazo} 4,5 g ev ogni 6 h (prima dose subito, in 30 min)'] },
      { titolo: 'Aggiungere', righe: ['Nosocomiale (> 48 h) o ≥ 2 fattori di rischio MDR: {meropenem} 2 g ev ogni 8 h in 3–4 h al posto di piperacillina/tazobactam', 'Shock, MRSA noto, catetere venoso, dialisi, cute: {vancomicina} o {linezolid}; {vancomicina} carico 2 g ev = 2 fiale da 1 g (25–30 mg/kg)', 'Shock con rischio di germi resistenti: valutare {amikacina} 1–1,5 g ev (15–20 mg/kg) in dose singola'] },
      { titolo: 'Comunitaria, giovane, sospetta meningococcemia', righe: ['{ceftriaxone} 2 g ev ogni 12 h'] },
      { titolo: 'Colonizzazione nota da CRE o Acinetobacter resistente', righe: ['Vedi le schede «Enterobatteri produttori di carbapenemasi» e «Acinetobacter resistente ai carbapenemi»'] },
      { titolo: 'Allergia grave ai betalattamici', righe: ['{vancomicina} + {amikacina} 1–1,5 g ev (15–20 mg/kg) + {ciprofloxacina} 400 mg ev ogni 8 h; consulenza infettivologica'] },
    ],
    durata: 'Rivalutare a 48–72 h con colture e focolaio.',
  },
  {
    id: 'cre', nome: 'Enterobatteri produttori di carbapenemasi (CRE)', gruppo: 'Sistemiche',
    sintesi: 'KPC e OXA-48: ceftazidime/avibactam. MBL: + aztreonam. Infettivologo subito.',
    blocchi: [
      { titolo: 'KPC (prevalente in ASL Toscana Centro)', righe: ['{ceftazavi} 2,5 g ev ogni 8 h in 2 h, oppure meropenem/vaborbactam 4 g ogni 8 h o imipenem/relebactam 1,25 g ogni 6 h (preferibili se polmonare)', 'Shock: ± fosfomicina ev 4 g ogni 6 h, {gentamicina} 5 mg/kg/die o {amikacina} 15 mg/kg/die', '+ {linezolid} (o {vancomicina} se non si usano aminoglicosidi)'] },
      { titolo: 'OXA-48', righe: ['{ceftazavi} 2,5 g ev ogni 8 h; 2ª scelta {cefiderocol} 2 g ogni 8 h', 'Shock: ± fosfomicina ev o aminoglicoside; + {linezolid}'] },
      { titolo: 'Metallo-β-lattamasi (NDM, VIM; frequenti in Toscana Nord-Ovest e AOU Pisana)', righe: ['{ceftazavi} 2,5 g + {aztreonam} 2 g ev ogni 8 h, in contemporanea', '2ª scelta: {cefiderocol} 2 g ogni 8 h in 3 h', 'Shock: ± fosfomicina ev o {colistina}; + {linezolid}'] },
      { titolo: 'Allergia a penicilline/cefalosporine', righe: ['KPC: meropenem/vaborbactam o imipenem/relebactam + fosfomicina o aminoglicoside', 'OXA-48 e MBL: {colistina} + fosfomicina ev (MBL: + {aztreonam})'] },
    ],
    durata: 'Secondo focolaio e risposta; rivalutare a 48 h con l’infettivologo.',
    note: ['Toscana 2024: Klebsiella delle emocolture resistente ai carbapenemi nel 19,7%', 'Il tipo di carbapenemasi è nel referto del tampone rettale o del test rapido (immunocromatografico o PCR)'],
  },
  {
    id: 'crab', nome: 'Acinetobacter baumannii resistente ai carbapenemi', gruppo: 'Sistemiche',
    sintesi: 'Ampicillina/sulbactam ad alte dosi + cefiderocol o colistina. Infettivologo subito.',
    blocchi: [
      { titolo: 'Terapia', righe: ['{ampisulb} 9 g ev ogni 8 h in 4 h (o in continua)', '+ {cefiderocol} 2 g ogni 8 h; 2ª scelta {colistina}, fosfomicina ev 4 g ogni 6 h o {tigeciclina} 200 mg, poi 100 mg ogni 12 h', '+ {linezolid} (o {vancomicina} se non si usa colistina)'] },
      { titolo: 'Allergia a penicilline/cefalosporine', righe: ['{colistina} + fosfomicina ev o {tigeciclina} + {linezolid}'] },
    ],
    durata: 'Secondo focolaio e risposta; rivalutare a 48 h con l’infettivologo.',
  },
  {
    id: 'neutropenia', nome: 'Neutropenia febbrile', gruppo: 'Sistemiche',
    sintesi: 'Piperacillina/tazobactam o cefepime entro 1 h; meropenem se instabile.',
    blocchi: [
      { titolo: 'Definizione', righe: ['Neutrofili <500/mm³ (o attesi <500) + T ≥38,3 °C o ≥38 °C per 1 h'] },
      { titolo: 'Alto rischio (MASCC <21)', righe: ['{piptazo} 4,5 g ev ogni 6 h o {cefepime} 2 g ev ogni 8 h', 'Instabile o ESBL noto: {meropenem} 1 g ev ogni 8 h ± {amikacina}', 'Aggiungere {vancomicina} se: instabilità, infezione da catetere o cute, polmonite, MRSA noto'] },
      { titolo: 'Basso rischio (MASCC ≥21), domicilio', righe: ['{ciprofloxacina} 750 mg os ogni 12 h + {amoxclav} 875/125 mg os ogni 12 h'] },
      { titolo: 'Allergia grave ai betalattamici', righe: ['Aztreonam 2 g ogni 8 h + {vancomicina} ± {amikacina}'] },
    ],
    durata: 'Fino ad apiressia e neutrofili >500, o secondo il focolaio.',
  },
]

export const REGOLE: { titolo: string; righe: string[] }[] = [
  {
    titolo: 'Resistenze in Toscana (ARS 2024, rete SMART)',
    righe: [
      'E. coli urine: chinoloni 25,3%, amoxicillina/clavulanato 31,9%, cotrimossazolo 26,5%, cefalosporine 3ª gen. 12,8% → per le IVU empiriche niente chinoloni, cotrimossazolo, amoxicillina/clavulanato.',
      'E. coli emocolture: cefalosporine 3ª gen. 27,8%, chinoloni 32,2%, carbapenemi ~0,1%.',
      'K. pneumoniae emocolture: carbapenemi 19,7%, cefalosporine 3ª gen. 64%. Carbapenemasi: KPC prevalente, NDM diffusa in ASL Nord-Ovest e AOU Pisana.',
      'Pseudomonas urine: piperacillina/tazobactam 16,4%, ciprofloxacina 14,4%; carbapenemi nelle emocolture 13,8%.',
      'S. aureus resistente alla meticillina 18,9%. E. faecium resistente alla vancomicina 35,5% (in aumento). Pneumococco: penicillina 1,6%, macrolidi 17,1%.',
      'Sono dati regionali aggregati: l’antibiogramma del proprio laboratorio prevale.',
    ],
  },
  {
    titolo: 'Allergia ai betalattamici',
    righe: [
      'Non grave (rash tardivo non orticarioide, intolleranza, molti anni fa): cefalosporine di 3ª–4ª generazione e carbapenemi utilizzabili.',
      'Immediata/anafilassi: cefalosporine con catena laterale diversa (ceftriaxone, cefepime, cefazolina) possibili con dose test frazionata (1/10, poi il resto dopo 30 min) in ambiente monitorato; carbapenemi rischio <1%; aztreonam sicuro (tranne allergia al ceftazidime).',
      'SJS/TEN, DRESS, anemia emolitica: nessun β-lattamico.',
    ],
  },
  {
    titolo: 'Funzione renale',
    righe: [
      'Le dosi renali sono per CrCl con Cockcroft-Gault (scheda «Clearance creatinina» nei calcolatori), non per eGFR.',
      'La prima dose è sempre piena; si aggiustano solo le successive.',
      'Insufficienza renale acuta in sepsi: per le prime 24–48 h meglio non ridurre i β-lattamici (spesso migliora), poi ricalcolare.',
    ],
  },
  {
    titolo: 'Sempre',
    righe: [
      'Colture prima dell’antibiotico, senza ritardarlo.',
      'Rivalutare a 48–72 h: ridurre lo spettro, passare a os, fissare la data di stop.',
      'Diluente standard SF (0,9%); amoxicillina/clavulanato ed ertapenem mai in glucosata.',
    ],
  },
]

export const farmaco = (id: string) => FARMACI.find((f) => f.id === id)

/** Famiglie di antibiotici con le molecole in commercio in Italia ({id} = scheda nell'app). */
export const FAMIGLIE: { nome: string; spettro: string; molecole: string[] }[] = [
  { nome: 'Penicilline', spettro: 'Streptococchi, enterococco (ampicillina), anaerobi con inibitore; piperacillina anche Pseudomonas.', molecole: ['Benzilpenicillina (penicillina G)', '{benzatina}', '{amoxicillina}', '{ampicillina}', '{amoxclav}', '{ampisulb}', '{piptazo}'] },
  { nome: 'Cefalosporine I–II generazione', spettro: 'Stafilococco sensibile, streptococchi; II: anche H. influenzae.', molecole: ['{cefazolina}', '{cefalexina} (os)', 'Cefuroxima (os, ev)', 'Cefaclor (os)'] },
  { nome: 'Cefalosporine III–IV generazione', spettro: 'Gram-negativi; ceftazidime e cefepime anche Pseudomonas. Non enterococco, non ESBL.', molecole: ['{ceftriaxone}', 'Cefotaxime', 'Ceftazidime', '{cefepime}', '{cefixima} (os)', 'Cefpodoxima (os)', 'Ceftibuten (os)', 'Cefditoren (os)'] },
  { nome: 'Cefalosporine anti-MRSA', spettro: 'MRSA + Gram-negativi comunitari.', molecole: ['Ceftarolina', 'Ceftobiprolo'] },
  { nome: 'Cefalosporine con inibitore e siderofore (riservate)', spettro: 'Gram-negativi multiresistenti (ESBL, KPC, OXA-48, Pseudomonas MDR; cefiderocol anche MBL e Acinetobacter).', molecole: ['{ceftazavi}', '{ceftolozano}', '{cefiderocol}'] },
  { nome: 'Carbapenemi', spettro: 'Ampio spettro, ESBL, anaerobi; ertapenem non Pseudomonas né enterococco.', molecole: ['{meropenem}', '{imipenem}', '{ertapenem}', 'Meropenem/vaborbactam (KPC)', 'Imipenem/relebactam (KPC)'] },
  { nome: 'Monobattami', spettro: 'Solo Gram-negativi aerobi; sicuro nell’allergia alle penicilline.', molecole: ['{aztreonam}'] },
  { nome: 'Glicopeptidi e lipoglicopeptidi', spettro: 'Gram-positivi compreso MRSA.', molecole: ['{vancomicina}', '{vancomicinaos} (C. difficile)', 'Teicoplanina', 'Dalbavancina (dose singola)', 'Oritavancina (dose singola)'] },
  { nome: 'Lipopeptidi', spettro: 'Gram-positivi compreso MRSA e VRE; non nella polmonite.', molecole: ['{daptomicina}'] },
  { nome: 'Ossazolidinoni', spettro: 'Gram-positivi compreso MRSA e VRE; ottima biodisponibilità orale.', molecole: ['{linezolid}', 'Tedizolid'] },
  { nome: 'Aminoglicosidi', spettro: 'Gram-negativi (sinergia); nefro- e ototossici, dose unica giornaliera.', molecole: ['{gentamicina}', '{amikacina}', 'Tobramicina'] },
  { nome: 'Macrolidi', spettro: 'Atipici (Legionella, Mycoplasma, Chlamydia), Campylobacter.', molecole: ['{azitromicina}', '{claritromicina}', 'Eritromicina'] },
  { nome: 'Lincosamidi', spettro: 'Gram-positivi e anaerobi; antitossina.', molecole: ['{clindamicina}'] },
  { nome: 'Tetracicline e glicilcicline', spettro: 'Atipici, MRSA comunitario, rickettsie, Borrelia; tigeciclina: multiresistenti.', molecole: ['{doxiciclina}', 'Minociclina', '{tigeciclina}'] },
  { nome: 'Fluorochinoloni', spettro: 'Gram-negativi (cipro: Pseudomonas); levo e moxi anche respiratori. Avvertenze EMA.', molecole: ['{ciprofloxacina}', '{levofloxacina}', 'Moxifloxacina', 'Prulifloxacina (os)'] },
  { nome: 'Sulfamidici', spettro: 'Gram-negativi urinari, MRSA comunitario, Pneumocystis, Listeria, Stenotrophomonas.', molecole: ['{cotrimossazolo}'] },
  { nome: 'Nitroimidazoli', spettro: 'Anaerobi, protozoi; C. difficile solo se non c’è alternativa.', molecole: ['{metronidazolo}'] },
  { nome: 'Antibiotici urinari e fosfomicina', spettro: 'Cistite; fosfomicina ev nelle associazioni contro i multiresistenti.', molecole: ['{fosfomicina} (os)', 'Fosfomicina disodica (ev)', '{nitrofurantoina}'] },
  { nome: 'Polimixine', spettro: 'Gram-negativi multiresistenti (non Proteus, Serratia); nefrotossica.', molecole: ['{colistina}'] },
  { nome: 'Rifamicine', spettro: 'Stafilococco su protesi (mai da sola), tubercolosi; rifaximina non assorbita.', molecole: ['Rifampicina', 'Rifaximina (os)'] },
  { nome: 'Altri per C. difficile', spettro: 'Solo intestinale.', molecole: ['{fidaxomicina}'] },
  { nome: 'Antimicotici', spettro: 'Echinocandine di prima scelta nella candidemia del paziente critico.', molecole: ['{caspofungina}', 'Anidulafungina', 'Micafungina', 'Fluconazolo', 'Voriconazolo', 'Amfotericina B liposomiale'] },
]

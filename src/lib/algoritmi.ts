/*
 * Algoritmi visivi delle linee guida (diagramma a blocchi verticale).
 * STEMI: ESC 2023 + ACC/AHA 2025, adattato a un PS con emodinamica h24 (Prato): solo PCI primaria, niente fibrinolisi.
 * Dosi per adulto di 70 kg con il numero di fiale/compresse; verificare i formati in reparto.
 */

export type Tono = 'avvio' | 'passo' | 'decisione' | 'allarme' | 'terapia' | 'esito' | 'nota'

export type Nodo =
  | { tipo: Tono; titolo: string; righe?: string[]; tempo?: string }
  | { tipo: 'rami'; rami: Ramo[] }

/** fine: il ramo termina qui (non prosegue nel flusso principale). */
export interface Ramo { etichetta: string; tono?: 'si' | 'no' | 'neutro'; nodi: Nodo[]; fine?: string }

export const ALGORITMI: Record<string, { titolo: string; nota?: string; nodi: Nodo[] }> = {

  'fibrillazione-atriale': {
    titolo: 'Algoritmo FA in PS',
    nota: 'ESC 2024 (percorso AF-CARE). Dosi per 70 kg con il numero di fiale/compresse: verificare i formati in reparto.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'FA all’ECG (QRS stretti, RR irregolari, assenza di onde P)',
        righe: ['Monitor, accesso venoso, elettroliti (K, Mg), TSH, creatinina, troponina se dolore. Ecocardio al letto (FE, valvole, VD).'],
      },
      { tipo: 'decisione', titolo: 'Instabile? (shock, ischemia in atto, edema polmonare, sincope)' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Cardioversione elettrica sincronizzata subito',
                righe: [
                  'In sedazione (scheda Sedazione), bifasica, energia elevata fin dal primo shock.',
                  'Eparina subito (non attendere 3 settimane di OAC).',
                  'FA pre-eccitata (QRS larghi, irregolari, molto veloci): sempre elettrica, niente farmaci nodali.',
                ],
              },
            ],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Cercare la causa',
                righe: ['Infezione, disidratazione, ipertiroidismo, alcol, EP, SCA, scompenso, elettroliti, farmaci.'],
              },
              {
                tipo: 'terapia', titolo: 'Controllo della frequenza (obiettivo FC < 110)',
                righe: [
                  'FE > 40%: metoprololo 2,5–5 mg ev in 2 min (½–1 fiala da 5 mg/5 mL), ripetibile fino a 15 mg; oppure diltiazem 0,25 mg/kg (≈ 18 mg) ev in 5 min.',
                  'FE ≤ 40% o scompenso: digossina 0,5 mg ev = 1 fiala da 0,5 mg/2 mL; beta-bloccante a basse dosi con cautela; amiodarone se refrattaria.',
                  'Niente diltiazem/verapamil se FE ≤ 40%.',
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Esordio certo < 24 h, oppure OAC efficace da ≥ 3 settimane, oppure ETE senza trombi?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Cardioversione possibile',
                righe: [
                  'Prima: iniziare l’anticoagulante (EBPM o DOAC).',
                  'In alternativa: attesa vigile con solo controllo della frequenza e rivalutazione entro 48 h (spesso cardioverte da sola).',
                ],
              },
            ],
          },
          {
            etichetta: 'No / incerto', tono: 'no', nodi: [
              {
                tipo: 'passo', titolo: 'Niente cardioversione elettiva',
                righe: [
                  'Controllo della frequenza e anticoagulazione.',
                  'Cardioversione dopo ≥ 3 settimane di OAC efficace o dopo ETE.',
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Cardiopatia strutturale? (FE ridotta, IVS marcata, coronaropatia)' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'No', tono: 'si', nodi: [
              {
                tipo: 'terapia', titolo: 'Farmacologica',
                righe: [
                  'Flecainide 2 mg/kg ev in 10 min (≈ 140 mg = 14 mL della fiala da 150 mg/15 mL; max 150 mg) o 300 mg per bocca = 3 cp da 100 mg.',
                  'Propafenone 2 mg/kg ev in 10 min (≈ 140 mg = 2 fiale da 70 mg/20 mL) o 600 mg per bocca = 2 cp da 300 mg.',
                  'Con flecainide/propafenone associare un nodale (rischio di flutter 1:1).',
                  'Vernakalant 3 mg/kg (≈ 210 mg) ev in 10 min se disponibile.',
                ],
              },
            ],
          },
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              {
                tipo: 'terapia', titolo: 'Amiodarone o elettrica',
                righe: [
                  'Amiodarone 300 mg = 2 fiale da 150 mg in 250 mL di glucosata 5% in 30–60 min, poi 900–1200 mg nelle 24 h. Conversione lenta (ore).',
                  'Oppure cardioversione elettrica sincronizzata.',
                ],
              },
            ],
          },
        ],
      },
      {
        tipo: 'terapia', titolo: 'Anticoagulazione',
        righe: [
          'Dopo qualunque cardioversione: OAC per almeno 4 settimane, poi secondo CHA₂DS₂-VA.',
          'CHA₂DS₂-VA ≥ 2 raccomandata; = 1 da considerare; 0 nessuna. DOAC preferiti (AVK solo con protesi meccaniche o stenosi mitralica moderata-severa).',
          'Dosi ridotte dei DOAC solo con i criteri della scheda tecnica (CrCl con Cockcroft-Gault). HAS-BLED alto: correggere i fattori, non è un motivo per non anticoagulare.',
        ],
      },
      {
        tipo: 'esito', titolo: 'Dimissione o ricovero',
        righe: [
          'Dimissione se stabile, frequenza controllata, causa non grave, anticoagulazione impostata: controllo cardiologico.',
          'Ricovero se scompenso, ischemia, causa da trattare, frequenza non controllata.',
        ],
      },
    ],
  },
  'scompenso-cardiaco': {
    titolo: 'Algoritmo scompenso decompensato ed edema polmonare acuto',
    nota: 'ESC 2026. Dosi per 70 kg con il numero di fiale; le diluizioni per pompa sono esempi: verificare formati e protocolli del reparto.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Dispnea con sospetto scompenso',
        righe: ['Ortopnea, crepitii, edemi, turgore giugulare, aumento di peso; EPA: dispnea improvvisa, schiuma, sudorazione, ipertensione.'],
      },
      {
        tipo: 'passo', titolo: 'Subito', tempo: 'primi minuti',
        righe: [
          'Paziente seduto; PA, FC, SpO₂, FR, temperatura; ECG.',
          'EGA con lattati; troponina, NT-proBNP, creatinina, elettroliti, emocromo, glicemia.',
          'Ecografia polmonare (linee B, versamento) ed ecocardio al letto (FE, VD, valvole, versamento pericardico, vena cava).',
          'NT-proBNP < 300 pg/mL (BNP < 100) esclude lo scompenso; > 5000 pg/mL = rischio molto alto.',
        ],
      },
      { tipo: 'decisione', titolo: 'Insufficienza respiratoria o shock?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Respiratoria', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Ossigeno e CPAP',
                righe: [
                  'Ossigeno solo se SpO₂ < 90% (a chi non è ipossiemico nuoce).',
                  'CPAP/NIV il prima possibile se distress, FR > 25 o SpO₂ < 90% (es. CPAP 7,5–10 cmH₂O, FiO₂ per SpO₂ 92–96%).',
                  'Cautela se ipoteso o scompenso destro.',
                  'Intubazione se peggiora nonostante NIV.',
                ],
              },
            ],
          },
          {
            etichetta: 'Shock', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'PAS < 90 con ipoperfusione',
                righe: [
                  'Noradrenalina: 2 fiale da 2 mg in SF fino a 50 mL (80 µg/mL), da 0,05 µg/kg/min ≈ 2,5 mL/h.',
                  'Dobutamina se bassa portata: 1 fiala da 250 mg in SF fino a 50 mL (5 mg/mL), 2,5–5 µg/kg/min = 2–4 mL/h (in beta-bloccati meglio levosimendan).',
                  'Bolo di liquidi solo se non congesto.',
                  'Shock team; da STEMI → emodinamica.',
                ],
              },
            ],
          },
        ],
      },
      {
        tipo: 'allarme', titolo: 'Fattore scatenante da trattare subito (CHAMPIT)',
        righe: [
          'C: sindrome coronarica acuta → percorso STEMI/NSTE.',
          'H: emergenza ipertensiva → EPA ipertensivo (sotto).',
          'A: aritmia (FA rapida, TV, bradicardia).',
          'M: causa meccanica acuta (rottura, insufficienza valvolare acuta, endocardite).',
          'P: embolia polmonare.',
          'I: infezione. T: tamponamento.',
        ],
      },
      { tipo: 'decisione', titolo: 'Profilo clinico' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'EPA ipertensivo (PAS > 140)', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Ridistribuzione più che sovraccarico',
                righe: [
                  'CPAP subito.',
                  'Nitroglicerina in pompa: 2 fiale da 5 mg in SF fino a 50 mL (200 µg/mL). Partire da 10–20 µg/min (3–6 mL/h), aumentare ogni 3–5 min fino a 100–200 µg/min (30–60 mL/h), finché PAS ≥ 110 mmHg.',
                  'In attesa della pompa: isosorbide dinitrato 5 mg sublinguale.',
                  'Furosemide a dose bassa (es. 40 mg ev = 2 fiale da 20 mg): spesso il paziente non è in sovraccarico.',
                  'Niente morfina di routine (solo distress grave refrattario).',
                ],
              },
            ],
          },
          {
            etichetta: 'Caldo-umido', tono: 'neutro', nodi: [
              {
                tipo: 'passo', titolo: 'Congesto, ben perfuso (il più frequente)',
                righe: ['Decongestione con diuretico (sotto); nitroglicerina se PAS > 110 e congestione polmonare.'],
              },
            ],
          },
          {
            etichetta: 'Freddo-umido', tono: 'no', nodi: [
              {
                tipo: 'passo', titolo: 'Congesto e ipoperfuso',
                righe: ['Se PAS < 90: inotropo/vasopressore prima, poi diuretico. Se PA conservata: vasodilatatore cauto e diuretico.'],
              },
            ],
          },
          {
            etichetta: 'Freddo-secco', tono: 'neutro', nodi: [
              {
                tipo: 'passo', titolo: 'Ipoperfuso, non congesto',
                righe: ['Bolo cauto di liquidi (250 mL SF), rivalutare; inotropo se persiste ipoperfusione.'],
              },
            ],
          },
        ],
      },
      {
        tipo: 'terapia', titolo: 'Decongestione: furosemide ev',
        righe: [
          'Mai trattato: furosemide 40 mg ev = 2 fiale da 20 mg/2 mL.',
          'Già in diuretico: il doppio della dose orale abituale ev (es. 50 mg/die per bocca → 100 mg ev = 5 fiale da 20 mg o 10 mL della fiala da 250 mg/25 mL). Più alta se insufficienza renale cronica.',
          'Bolo o infusione continua: equivalenti.',
          'Catetere o misura precisa della diuresi; liquidi assunti meno della diuresi.',
        ],
      },
      { tipo: 'decisione', titolo: 'Risposta adeguata? Na urinario ≥ 70 mEq/L a 2 h oppure diuresi ≥ 100 mL/h nelle prime 6 h' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Proseguire',
                righe: ['Ripetere la dose ogni 12 h fino alla decongestione. Controllare K, Mg, creatinina: un piccolo aumento della creatinina è accettabile.'],
              },
            ],
          },
          {
            etichetta: 'No', tono: 'no', nodi: [
              {
                tipo: 'terapia', titolo: 'Potenziare',
                righe: [
                  'Raddoppiare la dose ev di furosemide.',
                  'Aggiungere (IIa) acetazolamide 500 mg ev = 1 fiala da 500 mg una volta al giorno, oppure idroclorotiazide per bocca 25 mg (eGFR > 50), 50 mg (20–50), 100 mg (< 20).',
                  'Massimo abituale 600 mg/die di furosemide.',
                ],
              },
            ],
          },
        ],
      },
      {
        tipo: 'nota', titolo: 'Da non dimenticare',
        righe: [
          'Non sospendere beta-bloccante, ACE-i/ARNI, MRA se non in caso di shock, ipotensione sintomatica, iperkaliemia o insufficienza renale grave.',
          'Profilassi antitrombotica (EBPM). SGLT2-inibitore da iniziare dopo la stabilizzazione.',
        ],
      },
      {
        tipo: 'esito', titolo: 'Destinazione',
        righe: [
          'UTIC/sub-intensiva: NIV che non si stacca, inotropi o vasopressori, shock, SCA, aritmie gravi.',
          'Reparto: risposta al diuretico, stabile.',
        ],
      },
    ],
  },
  'embolia-polmonare': {
    titolo: 'Algoritmo embolia polmonare',
    nota: 'ESC 2019 con le categorie AHA/ACC 2026 (A–E) tra parentesi. Dosi per 70 kg; verificare i formati in reparto.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Sospetta embolia polmonare',
        righe: ['Dispnea, dolore pleuritico, sincope, tachicardia, emottisi, ipossiemia non spiegata; fattori di rischio TEV.'],
      },
      { tipo: 'decisione', titolo: 'Ipotensione persistente, shock o arresto?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì: alto rischio (E)', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Eco al letto',
                righe: ['VD dilatato/disfunzionante con paziente instabile: basta per trattare se la TC non è possibile subito.'],
              },
              {
                tipo: 'terapia', titolo: 'Trattamento immediato',
                righe: [
                  'Eparina non frazionata 80 U/kg ≈ 5.600 UI ev in bolo (≈ 1,1 mL della fiala da 25.000 UI/5 mL), poi 18 U/kg/h ≈ 1.250 UI/h.',
                  'Trombolisi: alteplase 100 mg in 2 h (10 mg in bolo + 90 mg) = 2 flaconi da 50 mg; regime accelerato 0,6 mg/kg in 15 min (≈ 42 mg, max 50 mg).',
                  'Controindicata o fallita: catetere o chirurgia (team PERT).',
                  'Noradrenalina se ipoteso; liquidi al massimo 500 mL; evitare intubazione e sedazione profonda se possibile.',
                ],
              },
              {
                tipo: 'allarme', titolo: 'Arresto cardiaco da EP',
                righe: ['Trombolisi durante la RCP; poi continuare la rianimazione 60–90 minuti. ECMO se disponibile.'],
              },
            ],
            fine: 'terapia intensiva / UTIC',
          },
          {
            etichetta: 'No: stabile', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Probabilità clinica',
                righe: ['Wells EP (o Ginevra); se la probabilità è bassa, PERC.'],
              },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Paziente stabile: quanto è probabile l’EP?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Bassa / improbabile', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'PERC → D-dimero',
                righe: [
                  'Probabilità molto bassa e PERC negativo: EP esclusa senza esami.',
                  'Altrimenti D-dimero con soglia per età dopo i 50 anni (età × 10 µg/L).',
                  'Negativo: EP esclusa. Positivo: angio-TC.',
                ],
              },
            ],
          },
          {
            etichetta: 'Alta / probabile', tono: 'no', nodi: [
              {
                tipo: 'passo', titolo: 'Angio-TC direttamente',
                righe: [
                  'Niente D-dimero.',
                  'Anticoagulare in attesa se il rischio emorragico lo consente.',
                  'Controindicazione al mezzo di contrasto: scintigrafia V/Q o eco-doppler degli arti (TVP = trattare).',
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'EP confermata: gravità (sPESI, VD a TC/eco, troponina)' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Basso rischio (A–B)', tono: 'si', nodi: [
              {
                tipo: 'esito', titolo: 'Domicilio possibile',
                righe: ['sPESI 0 (o Hestia negativo), VD normale, troponina normale, anticoagulante disponibile e controllo programmato.'],
              },
            ],
          },
          {
            etichetta: 'Intermedio-basso (C)', tono: 'neutro', nodi: [
              {
                tipo: 'passo', titolo: 'Ricovero in reparto',
                righe: ['sPESI ≥ 1 oppure solo uno tra VD alterato e troponina alta. EBPM.'],
              },
            ],
          },
          {
            etichetta: 'Intermedio-alto (C3–D)', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Ricovero monitorato',
                righe: [
                  'VD alterato e troponina alta, o ipotensione transitoria/lattati alti (D).',
                  'Eparina non frazionata se è probabile la trombolisi; team PERT.',
                  'Trombolisi non di routine: «di salvataggio» se l’emodinamica peggiora.',
                ],
              },
            ],
          },
        ],
      },
      {
        tipo: 'terapia', titolo: 'Anticoagulazione (paziente stabile)',
        righe: [
          'Enoxaparina 1 mg/kg ogni 12 h: 70 mg sc = 1 siringa da 7.000 UI/0,7 mL ogni 12 h (CrCl < 30: una volta al giorno).',
          'Oppure DOAC: apixaban 10 mg ogni 12 h per 7 giorni (2 cp da 5 mg), poi 5 mg ogni 12 h; rivaroxaban 15 mg ogni 12 h per 21 giorni, poi 20 mg al giorno.',
          'Eparina non frazionata solo se instabile, se è probabile la trombolisi o con insufficienza renale grave.',
          'Durata: almeno 3 mesi.',
        ],
      },
    ],
  },
  stemi: {
    titolo: 'Algoritmo STEMI — PS con emodinamica h24',
    nota: 'ESC 2023 e ACC/AHA 2025. Prato ha l’emodinamica h24: la strategia è sempre la PCI primaria, la fibrinolisi non è prevista.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Dolore toracico o equivalente ischemico',
        righe: [
          'Equivalenti: dispnea, sincope, epigastralgia, sudorazione, arresto cardiaco.',
          'Anziani, donne, diabetici: sintomi spesso atipici.',
        ],
      },
      {
        tipo: 'passo', titolo: 'ECG a 12 derivazioni', tempo: '≤ 10 min',
        righe: [
          'Monitor, defibrillatore a portata di mano, accesso venoso (lasciare libero il polso destro per l’accesso radiale).',
          'Prelievo: troponina hs, emocromo, coagulazione, creatinina, elettroliti. Se lo STEMI è già evidente non aspettare il risultato.',
          'ST↑ inferiore → registrare V3R–V4R. ST↓ V1–V3 → registrare V7–V9.',
          'Confronto con ECG precedenti; ecocardio al letto (acinesia regionale, versamento, valvole).',
        ],
      },
      { tipo: 'decisione', titolo: 'ST sopraslivellato o equivalente di STEMI?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Criteri ECG',
                righe: [
                  'ST↑ al punto J in ≥ 2 derivazioni contigue: ≥ 1 mm; in V2–V3 ≥ 2 mm (uomo ≥ 40 anni), ≥ 2,5 mm (uomo < 40), ≥ 1,5 mm (donna).',
                  'V7–V9 ≥ 0,5 mm (infarto posteriore); V3R–V4R ≥ 0,5 mm (ventricolo destro).',
                  'Equivalenti: blocco di branca sinistro o destro o ritmo da pacemaker con sintomi ischemici in atto (Sgarbossa); onde T iperacute; pattern di de Winter.',
                ],
              },
              {
                tipo: 'allarme', titolo: 'Prima degli antitrombotici: è una dissezione?',
                righe: [
                  'Dolore lacerante o dorsale, PA asimmetrica > 20 mmHg, deficit di polso o neurologico, soffio diastolico, mediastino slargato, versamento pericardico → ecocardio e angio-TC.',
                  'Altri simulatori: pericardite, Takotsubo, ripolarizzazione precoce, aneurisma ventricolare, iperkaliemia.',
                ],
              },
            ],
          },
          {
            etichetta: 'No / dubbio', tono: 'no', nodi: [
              {
                tipo: 'passo', titolo: 'NSTE-SCA o dolore da definire',
                righe: [
                  'ECG ogni 15–30 min se il dolore persiste o cambia.',
                  'Troponina hs 0/1 h (o 0/2 h). HEART score.',
                ],
              },
              {
                tipo: 'allarme', titolo: 'Rischio molto alto → coronarografia immediata (< 2 h): stesso percorso dello STEMI',
                righe: [
                  'Instabilità emodinamica o shock, dolore refrattario, aritmie maligne o arresto cardiaco, complicanze meccaniche, scompenso acuto da ischemia.',
                  'ST↓ > 1 mm in ≥ 6 derivazioni con ST↑ in aVR e/o V1 (malattia del tronco o trivasale), ST↓ ricorrente dinamico.',
                ],
              },
              {
                tipo: 'nota', titolo: 'NSTEMI confermato (troponina) → coronarografia entro 24 h; altrimenti percorso dolore toracico.',
              },
            ],
            fine: 'percorso NSTE-SCA',
          },
        ],
      },
      {
        tipo: 'allarme', titolo: 'STEMI: attivare subito l’emodinamica (PCI primaria)', tempo: 'diagnosi → filo ≤ 60 min',
        righe: [
          'Chiamare cardiologo/emodinamista di guardia appena posta la diagnosi, senza aspettare la troponina.',
          '≤ 90 min se il paziente arriva da un ospedale senza emodinamica.',
          'Annotare gli orari: esordio dei sintomi, primo contatto, ECG diagnostico, attivazione, arrivo in sala.',
        ],
      },
      { tipo: 'decisione', titolo: 'Da quanto sono iniziati i sintomi?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: '≤ 12 ore', tono: 'si', nodi: [
              { tipo: 'esito', titolo: 'PCI primaria', righe: ['Sempre (classe I).'] },
            ],
          },
          {
            etichetta: '12–48 ore', tono: 'neutro', nodi: [
              {
                tipo: 'passo', titolo: 'PCI primaria',
                righe: [
                  'Sempre se dolore persistente, instabilità emodinamica o aritmie gravi (classe I).',
                  'Se asintomatico: PCI primaria da considerare (IIa).',
                ],
              },
            ],
          },
          {
            etichetta: '> 48 ore, asintomatico', tono: 'no', nodi: [
              {
                tipo: 'passo', titolo: 'Niente PCI urgente dell’arteria occlusa',
                righe: ['Coronarografia programmata durante il ricovero; terapia come NSTE-SCA.'],
              },
            ],
          },
        ],
      },
      {
        tipo: 'terapia', titolo: 'Terapia in PS, in attesa della sala (70 kg)',
        righe: [
          'Aspirina 250 mg ev = ½ flacone da 500 mg (o 150–300 mg per bocca, masticata), se non già data dal 118.',
          'Eparina non frazionata 5.000 UI ev in bolo (70–100 U/kg) = 1 mL della fiala da 25.000 UI/5 mL. Se il paziente assume anticoagulanti orali: dose da concordare con l’emodinamista.',
          'Inibitore P2Y12 deciso con l’emodinamista (il pretrattamento «può essere considerato»): prasugrel 60 mg = 6 cp da 10 mg (non se ictus/TIA pregresso; mantenimento 5 mg se ≥ 75 anni o < 60 kg); ticagrelor 180 mg = 2 cp da 90 mg; clopidogrel 600 mg = 8 cp da 75 mg se anticoagulante orale o alto rischio emorragico.',
          'Dolore: morfina 2–4 mg ev (fiala 10 mg/1 mL in 10 mL di SF: 2–4 mL), ripetibile ogni 5–10 min; oppure fentanil 50 µg ev = 1 mL della fiala da 100 µg/2 mL. Gli oppioidi rallentano l’effetto degli antiaggreganti orali.',
          'Isosorbide dinitrato 5 mg sublinguale se PAS > 90 mmHg; no se infarto del ventricolo destro o inibitori della PDE5 nelle 24–48 h. Nitroglicerina in infusione se ipertensione o scompenso.',
          'Ossigeno solo se SpO₂ < 90%.',
          'Nausea: ondansetron 4 mg ev = 1 fiala da 4 mg/2 mL.',
          'Metoprololo 5 mg ev (1 fiala da 5 mg/5 mL), ripetibile fino a 15 mg: da considerare solo se PAS > 120 mmHg e nessun segno di scompenso (meglio decidere con l’emodinamista).',
        ],
      },
      { tipo: 'decisione', titolo: 'Complicanze in attesa della sala?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Shock cardiogeno', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'PAS < 90 mmHg con ipoperfusione',
                righe: [
                  'Noradrenalina in infusione (0,05–0,5 µg/kg/min); niente nitrati e beta-bloccanti.',
                  'Ecocardio: rottura del setto o di parete, insufficienza mitralica acuta, infarto del ventricolo destro.',
                  'Intubazione se necessaria; supporto meccanico da valutare in emodinamica.',
                ],
              },
            ],
          },
          {
            etichetta: 'Arresto cardiaco rianimato', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'ROSC',
                righe: [
                  'ST↑ persistente → coronarografia immediata.',
                  'Senza ST↑ ed emodinamicamente stabile → niente coronarografia immediata di routine: decisione caso per caso.',
                  'PAM ≥ 65 mmHg, SpO₂ 94–98%, normocapnia, evitare la febbre.',
                ],
              },
            ],
          },
          {
            etichetta: 'FV / TV', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Aritmie ventricolari',
                righe: [
                  'Senza polso: defibrillazione e ALS; amiodarone 300 mg ev = 2 fiale da 150 mg/3 mL dopo il 3° shock.',
                  'TV con polso: cardioversione sincronizzata se instabile; altrimenti amiodarone 300 mg in 20–60 min.',
                  'Potassio > 4 mmol/L, magnesio > 2 mg/dL.',
                ],
              },
            ],
          },
          {
            etichetta: 'Bradicardia / BAV', tono: 'neutro', nodi: [
              {
                tipo: 'passo', titolo: 'Frequente nell’inferiore',
                righe: [
                  'Atropina 0,5 mg ev = 1 fiala, ogni 3–5 min fino a 3 mg.',
                  'Inefficace → pacing transcutaneo (scheda Procedure).',
                ],
              },
            ],
          },
          {
            etichetta: 'Ventricolo destro', tono: 'neutro', nodi: [
              {
                tipo: 'passo', titolo: 'Inferiore con ST↑ in V4R',
                righe: [
                  'Niente nitrati, niente diuretici, cautela con la morfina.',
                  'Ipotensione con polmoni liberi: boli di 250 mL di SF.',
                ],
              },
            ],
          },
          {
            etichetta: 'Edema polmonare', tono: 'neutro', nodi: [
              {
                tipo: 'passo', titolo: 'Scompenso acuto',
                righe: [
                  'Furosemide 40 mg ev = 2 fiale da 20 mg.',
                  'Nitroglicerina in infusione se PAS > 110 mmHg; CPAP.',
                ],
              },
            ],
          },
        ],
      },
      {
        tipo: 'esito', titolo: 'Trasferimento in sala di emodinamica',
        righe: [
          'Monitor e defibrillatore, accompagnato da medico/infermiere.',
          'Niente iniezioni intramuscolari. Consegnare ECG, orari e farmaci somministrati.',
        ],
      },
    ],
  },
}

/*
 * PDTA metabolici, endocrini e ambientali. Dosi per adulto di 70 kg.
 */
import type { LineaGuida } from '../lineeGuida'
import type { Nodo } from '../algoritmi'

type Alg = Record<string, { titolo: string; nota?: string; nodi: Nodo[] }>
const OGGI = '2026-11-13'
const ERC = { etichetta: 'ERC 2025: situazioni speciali', url: 'https://cprguidelines.eu' }

export const LG_METABOLISMO: LineaGuida[] = [
  {
    id: 'ipoglicemia',
    titolo: 'Ipoglicemia',
    ente: 'ADA · JBDS',
    anno: 2025,
    area: 'Metabolismo',
    fonte: { etichetta: 'ADA, Standards of Care in Diabetes 2025 (sezione 6)', url: 'https://diabetesjournals.org/care/issue/48/Supplement_1' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Astinenza alcolica (tiamina)', to: '/linee-guida/astinenza-alcolica' }],
    inBreve: [
      'Livello 1 < 70 mg/dL; livello 2 < 54 mg/dL; livello 3 = serve aiuto di altri (qualunque valore).',
      'Vigile e deglutisce: 15–20 g di zuccheri per bocca, ricontrollo a 15 min, poi pasto con carboidrati complessi.',
      'Non collabora: glucosio ev (o glucagone im se senza accesso). Alcolisti/malnutriti: tiamina, ma senza ritardare il glucosio.',
      'Sulfaniluree (glibenclamide, gliclazide, glimepiride) o insulina lenta/sovradosaggio: recidive per molte ore → ricovero/osservazione ≥ 24 h; octreotide nelle sulfaniluree.',
      'Cercare la causa: errore di dose, pasto saltato, insufficienza renale, infezione, alcol, nuovi farmaci, insufficienza surrenalica, insulinoma (se non diabetico).',
      'Dimissione possibile se: causa chiara e corretta, solo insulina rapida o metformina, ha mangiato, glicemia stabile dopo 2–4 h, a casa con qualcuno.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Glucosio 33% 50 mL (16,5 g) ev in 2–3 min, ripetibile ogni 10–15 min finché > 100 mg/dL; poi glucosio 10% a 100 mL/h.',
          'Senza accesso: glucagone (GlucaGen 1 mg) 1 mg im o sc; inefficace se glicogeno esaurito (alcol, digiuno, epatopatia).',
          'Sulfaniluree con recidive: octreotide (Sandostatina) 50 µg sc ogni 6–8 h (o 100 µg).',
          'Tiamina (Benerva) 100 mg ev negli alcolisti e malnutriti.',
          'Glicemia capillare ogni ora per le prime 4–6 h, poi ogni 2–4 h.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2025-01-01', testo: 'ADA 2025: classificazione in 3 livelli; glucagone pronto per tutti gli insulinotrattati.' }],
  },
  {
    id: 'ipernatriemia',
    titolo: 'Ipernatriemia',
    ente: 'Letteratura',
    anno: 2023,
    area: 'Metabolismo',
    fonte: { etichetta: 'PubMed: hypernatremia management review', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=hypernatremia+management+review' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Iponatriemia', to: '/linee-guida/iponatriemia' }, { etichetta: 'Chetoacidosi / iperosmolare', to: '/linee-guida/chetoacidosi' }],
    inBreve: [
      'Na > 145; grave > 160. Quasi sempre perdita d’acqua in chi non può bere: anziano, allettato, demente, febbre, diarrea, diuresi osmotica (iperglicemia).',
      'Prima la volemia: shock o ipovolemia grave → NaCl 0,9% finché stabile, poi acqua.',
      'Poi correggere con acqua libera (G5% ev o acqua per SNG/bocca), aggiungendo le perdite in corso.',
      'Velocità: cronica (> 48 h) circa 8–10 mmol/L in 24 h, controllo Na ogni 4–6 h; acuta (ore, es. sodio esogeno) si può correggere più velocemente.',
      'Poliuria con urine diluite (osmolalità urinaria < 300): diabete insipido (litio, neurochirurgia, trauma cranico) → desmopressina.',
    ],
    sezioni: [
      {
        titolo: 'Calcolo (70 kg)',
        punti: [
          'Deficit di acqua libera = acqua corporea × (Na/140 − 1); acqua corporea 0,5 × peso nell’anziano/donna (0,6 nell’uomo giovane).',
          'Esempio: uomo anziano 70 kg, Na 160 → 35 × (160/140 − 1) = 5 L di deficit; da dare in 48–72 h + perdite in corso (circa 1–1,5 L/die).',
          'Effetto di 1 L di G5% sul Na ≈ (0 − Na) / (acqua corporea + 1) = −160/36 ≈ −4,4 mmol/L.',
          'Desmopressina (Minirin fiale 4 µg) 1–2 µg ev nel diabete insipido centrale, con controllo Na.',
          'Iperglicemia associata: correggerla prima (il Na corretto sale mentre scende la glicemia).',
        ],
      },
    ],
    aggiornamenti: [{ data: OGGI, testo: 'Aggiunto: correzione con acqua libera, calcolo del deficit.' }],
  },
  {
    id: 'ipercalcemia',
    titolo: 'Ipercalcemia',
    ente: 'Endocrine Society',
    anno: 2023,
    area: 'Metabolismo',
    fonte: { etichetta: 'El-Hajj Fuleihan et al., J Clin Endocrinol Metab 2023 (ipercalcemia neoplastica)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=El-Hajj+Fuleihan+hypercalcemia+of+malignancy+guideline+2023' },
    controllata: OGGI,
    inBreve: [
      'Ca corretto = Ca + 0,8 × (4 − albumina g/dL), oppure Ca ionizzato. Lieve < 12, moderata 12–14, grave > 14 mg/dL.',
      'Sintomi: poliuria, disidratazione, stipsi, nausea, confusione, insufficienza renale; ECG con QT corto.',
      'Cause: 90% iperparatiroidismo o neoplasia (metastasi ossee, mieloma, PTHrp); poi vitamina D, tiazidici, litio, granulomatosi.',
      'Prima idratazione con fisiologica, poi bisfosfonato; calcitonina per l’effetto rapido nelle forme gravi.',
      'Furosemide solo dopo idratazione e se sovraccarico, non per abbassare il calcio.',
      'Prelevare prima: PTH, PTHrp, 25-OH vitamina D, elettroforesi proteica, fosforo, creatinina.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'NaCl 0,9% 1–2 L in 1–2 h se disidratato, poi 200–300 mL/h per diuresi 100–150 mL/h (meno se scompenso).',
          'Acido zoledronico (Zometa 4 mg) 4 mg ev in ≥ 15 min (in 100 mL); clearance 30–60: dose ridotta; < 30: evitarlo → denosumab (Xgeva) 120 mg sc su indicazione dell’oncologo.',
          'Calcitonina 4 UI/kg = 280 UI sc o im ogni 12 h per 48 h (effetto in 4–6 h, poi tachifilassi).',
          'Linfomi, granulomatosi, intossicazione da vitamina D: prednisone 40–60 mg/die.',
          'Ca > 18 o insufficienza renale/coma: dialisi (nefrologo).',
        ],
      },
    ],
    aggiornamenti: [{ data: '2023-01-01', testo: 'Endocrine Society 2023: denosumab preferito ai bisfosfonati in alcune situazioni; calcitonina solo per il breve termine.' }],
  },
  {
    id: 'crisi-surrenalica',
    titolo: 'Crisi surrenalica',
    ente: 'ESE / Endocrine Society',
    anno: 2024,
    area: 'Metabolismo',
    fonte: { etichetta: 'Beuschlein et al., Eur J Endocrinol 2024 (ESE/ES, insufficienza surrenalica da glucocorticoidi)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Beuschlein+glucocorticoid-induced+adrenal+insufficiency+guideline+2024' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Sepsi', to: '/linee-guida/sepsi' }],
    inBreve: [
      'Sospettarla in chi ha morbo di Addison, ipopituitarismo o assume cortisone cronico (≥ 5 mg prednisone per > 4 settimane) e arriva con vomito, ipotensione, febbre, dolore addominale, confusione.',
      'Laboratorio: iponatriemia, iperkaliemia (non nel secondario), ipoglicemia, eosinofilia.',
      'Non aspettare gli esami: prelevare cortisolo e ACTH e dare subito idrocortisone.',
      'Shock non responsivo a liquidi e vasopressori in un paziente con cortisone cronico: idrocortisone.',
      'Dopo: cercare il fattore scatenante (infezione, gastroenterite, sospensione del cortisone), educazione «sick day rules» e kit d’emergenza.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Idrocortisone (Flebocortid) 100 mg ev in bolo, poi 200 mg/24 h in infusione continua (o 50 mg ev ogni 6 h).',
          'NaCl 0,9% 1 L in 1 h, poi secondo volemia; glucosio se ipoglicemia (glucosio 33% 50 mL).',
          'Dopo 24–72 h, se stabile: scalare a dosi orali doppie per alcuni giorni.',
          'Con dosi ≥ 50 mg/die di idrocortisone non serve fludrocortisone.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2024-04-01', testo: 'ESE/Endocrine Society 2024: rischio di crisi in tutti gli utilizzatori cronici di glucocorticoidi; idrocortisone 100 mg ev subito, poi 200 mg/24 h.' }],
  },
  {
    id: 'tireotossicosi',
    titolo: 'Crisi tireotossica',
    ente: 'ATA',
    anno: 2016,
    area: 'Metabolismo',
    fonte: { etichetta: 'Ross et al., Thyroid 2016 (ATA, ipertiroidismo)', url: 'https://doi.org/10.1089/thy.2016.0229' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Fibrillazione atriale', to: '/linee-guida/fibrillazione-atriale' }],
    inBreve: [
      'Ipertiroidismo con febbre, tachicardia/FA, scompenso, agitazione/delirium/coma, vomito, diarrea, ittero. Scatenanti: infezione, chirurgia, parto, iodio (mezzo di contrasto, amiodarone), sospensione dei tireostatici.',
      'Diagnosi clinica (punteggio di Burch-Wartofsky ≥ 45 molto suggestivo); TSH soppresso e FT4/FT3 alti confermano ma non distinguono la crisi.',
      'Ordine: beta-bloccante → tionamide → iodio (almeno 1 h dopo la tionamide) → idrocortisone → supporto e causa.',
      'Febbre: paracetamolo e raffreddamento; evitare l’aspirina (sposta T4 dalle proteine).',
      'Scompenso grave con bassa portata: beta-bloccante con cautela (ecocardio). Rianimazione.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Propranololo (Inderal 40 mg) 60–80 mg per bocca/SNG ogni 4–6 h; in alternativa metoprololo (Lopresor) 5 mg ev ripetibile (esmololo non disponibile).',
          'Metimazolo (Tapazole) 20 mg ogni 6 h per bocca/SNG; propiltiouracile (galenico) 500–1.000 mg poi 250 mg ogni 4 h se gravidanza nel primo trimestre o crisi gravissima.',
          'Iodio (soluzione di Lugol, 5 gocce ogni 6 h) almeno 1 h dopo la tionamide.',
          'Idrocortisone (Flebocortid) 300 mg ev, poi 100 mg ogni 8 h.',
          'Liquidi, paracetamolo 1 g, colestiramina 4 g ogni 6 h come aggiunta.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2016-10-01', testo: 'ATA 2016: terapia multimodale della crisi tireotossica; metimazolo preferito salvo eccezioni.' }],
  },
  {
    id: 'mixedema',
    titolo: 'Coma mixedematoso',
    ente: 'ATA',
    anno: 2014,
    area: 'Metabolismo',
    fonte: { etichetta: 'Jonklaas et al., Thyroid 2014 (ATA, ipotiroidismo)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Jonklaas+guidelines+treatment+hypothyroidism+2014' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Ipotermia', to: '/linee-guida/ipotermia' }, { etichetta: 'Iponatriemia', to: '/linee-guida/iponatriemia' }, { etichetta: 'Crisi surrenalica', to: '/linee-guida/crisi-surrenalica' }],
    inBreve: [
      'Anziano (spesso donna, inverno) con alterazione della coscienza, ipotermia, bradicardia, ipoventilazione (ipercapnia), iponatriemia, ipoglicemia, edemi duri.',
      'Scatenanti: infezione, freddo, sedativi/oppioidi, sospensione della levotiroxina, amiodarone, litio.',
      'Idrocortisone prima della levotiroxina (possibile insufficienza surrenalica associata).',
      'Riscaldamento passivo (coperte): quello attivo può dare vasodilatazione e shock.',
      'Ventilazione per l’ipercapnia; liquidi con cautela (iponatriemia); rianimazione.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Idrocortisone (Flebocortid) 100 mg ev ogni 8 h, dopo prelievo per cortisolo.',
          'Levotiroxina ev 200–400 µg in bolo (dose più bassa se anziano, cardiopatico, peso basso), poi 50–100 µg/die ev; se non disponibile ev, per SNG a dosi un po’ più alte. Farmacia ospedaliera.',
          'Glucosio se ipoglicemia; restrizione idrica o NaCl 3% secondo il PDTA iponatriemia.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2014-12-01', testo: 'ATA 2014: levotiroxina ev ad alte dosi con glucocorticoidi nel coma mixedematoso.' }],
  },
  {
    id: 'rabdomiolisi',
    titolo: 'Rabdomiolisi',
    ente: 'Letteratura',
    anno: 2022,
    area: 'Metabolismo',
    fonte: { etichetta: 'PubMed: rhabdomyolysis management review', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=rhabdomyolysis+acute+kidney+injury+management+review' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Iperkaliemia', to: '/linee-guida/iperkaliemia' }, { etichetta: 'Colpo di calore', to: '/linee-guida/colpo-di-calore' }],
    inBreve: [
      'CK > 5 volte il normale (di solito > 5.000 con danno renale); urine scure con stick positivo per sangue senza globuli rossi al sedimento.',
      'Cause: caduta e immobilità prolungata nell’anziano, sforzo estremo, crisi epilettiche, ipertermia, cocaina/alcol, statine, traumi da schiacciamento, ischemia d’arto.',
      'Rischi: iperkaliemia (anche precoce), insufficienza renale, ipocalcemia, CID, sindrome compartimentale.',
      'Terapia: liquidi abbondanti presto; bicarbonato e mannitolo non migliorano gli esiti.',
      'Ipocalcemia: non trattarla se asintomatica (il calcio si deposita nel muscolo); trattarla solo se sintomi o iperkaliemia.',
      'Punteggio di McMahon ≥ 6: rischio alto di dialisi o morte.',
    ],
    sezioni: [
      {
        titolo: 'Terapia (70 kg)',
        punti: [
          'Cristalloidi (NaCl 0,9% o Ringer) 1–2 L in 1 h, poi 200–300 mL/h per diuresi 200–300 mL/h (≈ 3 mL/kg/h) finché CK < 5.000 in calo e urine chiare.',
          'Catetere vescicale per bilancio; attenzione a scompenso e anuria (non insistere coi liquidi se non urina).',
          'CK, creatinina, K, Ca, fosforo, EGA ogni 6–12 h; ECG se K alto.',
          'Dialisi: iperkaliemia refrattaria, acidosi grave, sovraccarico, anuria.',
          'Arto dolente e teso: misurare le pressioni compartimentali, ortopedico/chirurgo.',
        ],
      },
    ],
    aggiornamenti: [{ data: OGGI, testo: 'Aggiunto: liquidi precoci; niente bicarbonato/mannitolo di routine.' }],
  },
  {
    id: 'ipotermia',
    titolo: 'Ipotermia accidentale',
    ente: 'ERC · WMS',
    anno: 2025,
    area: 'Rianimazione',
    fonte: ERC,
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Arresto cardiaco', to: '/acr' }, { etichetta: 'Coma mixedematoso', to: '/linee-guida/mixedema' }],
    approfondimenti: [{ etichetta: 'Wilderness Medical Society 2019: ipotermia', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Wilderness+Medical+Society+accidental+hypothermia+2019' }],
    inBreve: [
      'Temperatura centrale (esofagea o rettale; timpanica solo con sonde adatte). Stadi: I 32–35 °C vigile con brividi; II 28–32 °C confuso, brividi assenti; III < 28 °C incosciente; IV senza segni vitali.',
      'Mobilizzare con delicatezza, in orizzontale (rischio FV). Togliere vestiti bagnati.',
      'Stadio I: riscaldamento passivo e attivo esterno (coperte, aria calda forzata), bevande calde. II–III: aria calda forzata, liquidi caldi 38–42 °C, monitor.',
      'Instabile (PAS < 90, aritmie ventricolari, T < 30 °C) o arresto: ECLS/ECMO (Careggi) — è la terapia che cambia la prognosi.',
      'Arresto: RCP continua; sotto 30 °C massimo 3 shock e niente adrenalina; 30–35 °C adrenalina ogni 6–10 min. Non dichiarare la morte prima del riscaldamento, salvo lesioni incompatibili o K > 12 mmol/L.',
      'Cercare: ipoglicemia, intossicazioni (alcol, sedativi), trauma, ipotiroidismo, sepsi.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci e misure',
        punti: [
          'Liquidi caldi (38–42 °C) 500 mL–1 L; glucosio se ipoglicemia.',
          'Ossigeno caldo umidificato; intubazione se necessaria (non provoca FV se fatta con delicatezza).',
          'Bradicardia dell’ipotermia: fisiologica, non serve pacing se perfuso.',
          'Punteggio HOPE per la probabilità di sopravvivenza con ECLS.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2025-10-22', testo: 'ERC 2025: ECLS per l’ipotermico instabile o in arresto; limite di K > 12 mmol/L per sospendere la rianimazione.' }],
  },
  {
    id: 'colpo-di-calore',
    titolo: 'Colpo di calore',
    ente: 'WMS · ERC',
    anno: 2024,
    area: 'Rianimazione',
    fonte: { etichetta: 'Wilderness Medical Society 2024: malattie da calore', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Wilderness+Medical+Society+heat+illness+guidelines' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Rabdomiolisi', to: '/linee-guida/rabdomiolisi' }, { etichetta: 'Cocaina e simpaticomimetici', to: '/linee-guida/simpaticomimetici' }, { etichetta: 'Ipertermia da farmaci', to: '/linee-guida/serotoninergica-snm' }],
    inBreve: [
      'T centrale > 40 °C + disfunzione neurologica (confusione, convulsioni, coma). Classico (anziano, ondata di calore, farmaci) o da sforzo (giovane, sport).',
      'Mortalità legata al tempo sopra 39 °C: raffreddare subito, prima di qualsiasi esame.',
      'Metodo migliore: immersione in acqua fredda o ghiacciata; in PS alternativa: spruzzare acqua e ventilare + ghiaccio a collo, ascelle, inguine, teli bagnati freddi.',
      'Fermarsi a 38,5–39 °C per evitare l’ipotermia di rimbalzo.',
      'Antipiretici inutili; dantrolene non indicato.',
      'Complicanze da cercare: rabdomiolisi, insufficienza renale ed epatica, CID, ipoglicemia, iperkaliemia.',
    ],
    sezioni: [
      {
        titolo: 'Terapia (70 kg)',
        punti: [
          'Obiettivo: velocità di raffreddamento ≥ 0,15 °C/min; temperatura rettale/esofagea continua.',
          'Brividi o agitazione: diazepam 5–10 mg ev.',
          'Liquidi: 1–2 L a temperatura ambiente o freddi, poi secondo volemia (attenzione negli anziani).',
          'Esami: CK, creatinina, transaminasi, coagulazione, glicemia, EGA, lattati.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2024-01-01', testo: 'WMS 2024: «raffreddare prima, trasportare dopo»; immersione in acqua fredda come metodo di riferimento.' }],
  },
  {
    id: 'annegamento',
    titolo: 'Annegamento',
    ente: 'ERC',
    anno: 2025,
    area: 'Rianimazione',
    fonte: ERC,
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Arresto cardiaco', to: '/acr' }, { etichetta: 'Ipotermia', to: '/linee-guida/ipotermia' }, { etichetta: 'NIV con V60', to: '/procedure?apri=niv-v60' }],
    inBreve: [
      'Il danno è l’ipossia: in arresto 5 ventilazioni iniziali, poi RCP standard. Niente manovre per svuotare i polmoni.',
      'Collare cervicale solo se tuffo, trauma o segni neurologici.',
      'Sintomi respiratori: ossigeno per SpO₂ 94–98%; CPAP/NIV se coscienza conservata; intubazione con PEEP se ipossiemia grave.',
      'Edema polmonare non cardiogeno anche tardivo: osservazione ≥ 6 h anche se migliorato; RX torace, EGA.',
      'Asintomatico, SpO₂ normale, esame del torace normale dopo 6 h: dimissione.',
      'Niente antibiotico profilattico né steroidi; antibiotico se acqua molto contaminata o febbre/infiltrati dopo 48 h.',
    ],
    sezioni: [
      {
        titolo: 'Valutare anche',
        punti: [
          'Temperatura centrale (ipotermia associata).',
          'Causa dell’annegamento: crisi epilettica, sincope/aritmia (QT lungo), alcol, trauma, ipoglicemia.',
          'Elettroliti, glicemia, CK, ECG.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2025-10-22', testo: 'ERC 2025: 5 ventilazioni iniziali nell’annegato in arresto; ossigenoterapia e PEEP per l’ipossiemia.' }],
  },
  {
    id: 'folgorazione',
    titolo: 'Folgorazione ed elettrocuzione',
    ente: 'ERC',
    anno: 2025,
    area: 'Rianimazione',
    fonte: ERC,
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Rabdomiolisi', to: '/linee-guida/rabdomiolisi' }, { etichetta: 'Grande ustionato', to: '/linee-guida/ustioni' }],
    inBreve: [
      'Bassa tensione (< 1.000 V, domestica): se asintomatico con ECG normale, nessun monitoraggio → dimissione.',
      'Monitor ECG 24 h se: alta tensione (≥ 1.000 V), fulmine, perdita di coscienza, ECG anormale o aritmia, dolore toracico, ustioni importanti, tetania, gravidanza (ostetrico).',
      'Alta tensione: lesioni profonde molto più estese di quelle cutanee (punto d’ingresso e uscita), rabdomiolisi, sindrome compartimentale, fratture (contrazioni, cadute).',
      'Fulmine con più vittime: triage invertito, rianimare prima chi sembra morto (arresto respiratorio con cuore che riparte).',
      'Esami: ECG, troponina, CK, creatinina, mioglobina urinaria.',
    ],
    sezioni: [
      {
        titolo: 'Gestione',
        punti: [
          'Rachide: protezione se caduta o fulmine.',
          'Liquidi per diuresi 1–1,5 mL/kg/h se mioglobinuria (le formule delle ustioni sottostimano).',
          'Ustioni da arco, perdita di sostanza, arti tesi: chirurgo/ortopedico; centro ustioni se alta tensione.',
          'Profilassi antitetanica; occhi (cataratta tardiva) e udito (fulmine) da controllare.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2025-10-22', testo: 'ERC 2025: criteri per il monitoraggio dopo elettrocuzione; triage invertito nei fulmini.' }],
  },
  {
    id: 'ustioni',
    titolo: 'Grande ustionato',
    ente: 'ISBI · ABA',
    anno: 2016,
    area: 'Trauma',
    fonte: { etichetta: 'ISBI Practice Guidelines for Burn Care 2016', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=ISBI+practice+guidelines+for+burn+care+2016' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Fumi d’incendio e cianuro', to: '/linee-guida/cianuro-fumi' }, { etichetta: 'Monossido', to: '/linee-guida/monossido' }, { etichetta: 'Rubrica: ustioni', to: '/rubrica' }, { etichetta: 'Dimissione: ustione superficiale', to: '/dimissioni' }],
    inBreve: [
      'Fermare l’ustione: togliere vestiti, acqua corrente a 15–25 °C per 20 min (entro 3 h), poi coprire con teli puliti e scaldare il paziente.',
      'ABCDE come un trauma: vie aeree a rischio (volto, inalazione, stridore, voce rauca, fuliggine, ustioni circonferenziali del collo) → intubazione precoce con tubo ≥ 8.',
      'Estensione (solo 2° e 3° grado; il 1° grado non si conta): regola del 9 (testa 9, ogni arto superiore 9, tronco ant. 18, post. 18, ogni arto inferiore 18, perineo 1) o palmo del paziente con dita = 1%.',
      'Liquidi se > 20%: Ringer lattato 2–4 mL/kg/% nelle 24 h dal momento dell’ustione, metà nelle prime 8 h; poi titolare sulla diuresi 0,5 mL/kg/h (1 mL/kg/h se elettrica/mioglobina).',
      'Escarotomia se ustione circonferenziale a torace (ventilazione) o arti (perfusione).',
      'Analgesia generosa (morfina, ketamina); profilassi antitetanica; niente antibiotici profilattici.',
    ],
    sezioni: [
      {
        titolo: 'Liquidi: esempio 70 kg, 40%',
        punti: [
          'Formula 2 mL × 70 × 40 = 5.600 mL/24 h → 2.800 mL nelle prime 8 h (350 mL/h), 2.800 nelle 16 h successive (175 mL/h). Con 4 mL: il doppio.',
          'Le ore si contano dall’ustione, non dall’arrivo.',
          'Catetere vescicale; diuresi oraria 35–70 mL/h: se meno aumentare del 20–30%, se di più ridurre (evitare il sovraccarico).',
        ],
      },
      {
        titolo: 'Centro grandi ustionati (rubrica)',
        punti: [
          '2° e 3° grado > 20% (> 10% nell’anziano); 3° grado > 5%.',
          'Volto, mani, piedi, genitali, perineo, grandi articolazioni; ustioni circonferenziali.',
          'Inalazione, elettriche (alta tensione), chimiche; traumi associati o comorbidità importanti.',
        ],
      },
    ],
    aggiornamenti: [{ data: OGGI, testo: 'Aggiunto: estensione, formula dei liquidi, criteri per il centro ustioni.' }],
  },
]

export const ALG_METABOLISMO: Alg = {
  ipoglicemia: {
    titolo: 'Algoritmo ipoglicemia',
    nota: 'ADA 2025.',
    nodi: [
      { tipo: 'avvio', titolo: 'Glicemia < 70 mg/dL' },
      { tipo: 'decisione', titolo: 'Vigile e deglutisce?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Zuccheri per bocca', righe: ['15–20 g (succo, 3–4 bustine di zucchero), ricontrollo a 15 min, poi pasto.'] }] },
          { etichetta: 'No', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Glucosio ev', righe: ['Glucosio 33% 50 mL ev, ripetibile; poi glucosio 10% 100 mL/h.', 'Senza accesso: glucagone 1 mg im.', 'Tiamina 100 mg se alcolista.'] }] },
        ],
      },
      { tipo: 'decisione', titolo: 'Sulfaniluree, insulina lenta, sovradosaggio, insufficienza renale?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Osservazione/ricovero ≥ 24 h', righe: ['Glucosio in infusione; glicemia ogni ora.', 'Sulfaniluree: octreotide 50 µg sc ogni 6–8 h.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Dimissione se', righe: ['Causa chiara e corretta, ha mangiato, stabile dopo 2–4 h, accompagnato; rivedere la terapia col curante.'] }] },
        ],
      },
    ],
  },
  ipernatriemia: {
    titolo: 'Algoritmo ipernatriemia',
    nodi: [
      { tipo: 'avvio', titolo: 'Na > 145 mmol/L', righe: ['Volemia, coscienza, perdite (febbre, diarrea, poliuria), glicemia.'] },
      { tipo: 'decisione', titolo: 'Shock o ipovolemia grave?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'NaCl 0,9%', righe: ['500–1.000 mL fino a stabilità emodinamica.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Direttamente all’acqua libera' }] },
        ],
      },
      { tipo: 'terapia', titolo: 'Acqua libera', righe: ['Deficit = 0,5 × peso × (Na/140 − 1) + perdite in corso.', 'G5% ev o acqua per bocca/SNG; −8–10 mmol/L in 24 h se cronica.', 'Na ogni 4–6 h.'] },
      { tipo: 'decisione', titolo: 'Poliuria con urine diluite?', righe: ['Osmolalità urinaria < 300 mOsm/kg.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Diabete insipido', righe: ['Desmopressina 1–2 µg ev (centrale); litio: nefrologo.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Perdite extrarenali o mancato accesso all’acqua', righe: ['Cercare infezione, delirium, disfagia.'] }] },
        ],
      },
    ],
  },
  ipercalcemia: {
    titolo: 'Algoritmo ipercalcemia',
    nota: 'Endocrine Society 2023.',
    nodi: [
      { tipo: 'avvio', titolo: 'Ca corretto > 10,5 mg/dL', righe: ['Ca + 0,8 × (4 − albumina) o Ca ionizzato.'] },
      { tipo: 'checklist', titolo: 'Prelievi prima della terapia', righe: ['PTH, PTHrp, 25-OH vitamina D', 'Fosforo, creatinina, elettroforesi proteica', 'ECG (QT corto)', 'Sospendere tiazidici, calcio, vitamina D, litio'] },
      { tipo: 'decisione', titolo: 'Ca > 14 o sintomatico?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'terapia', titolo: 'Idratazione', righe: ['NaCl 0,9% 1–2 L, poi 200–300 mL/h (diuresi 100–150 mL/h).'] },
              { tipo: 'terapia', titolo: 'Farmaci', righe: ['Calcitonina 280 UI sc ogni 12 h (48 h).', 'Acido zoledronico 4 mg ev in 15 min (rene < 30: denosumab).', 'Linfoma/granulomatosi/vit. D: prednisone 40–60 mg.'] },
              { tipo: 'allarme', titolo: 'Ca > 18, coma o insufficienza renale', righe: ['Nefrologo: dialisi.'] },
            ],
          },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Idratazione orale, sospendere i farmaci', righe: ['Accertamenti ambulatoriali se stabile.'] }] },
        ],
      },
    ],
  },
  'crisi-surrenalica': {
    titolo: 'Algoritmo crisi surrenalica',
    nota: 'ESE/ES 2024. Non attendere gli esami.',
    nodi: [
      { tipo: 'avvio', titolo: 'Addison, ipopituitarismo o cortisone cronico + malessere acuto', righe: ['Vomito, ipotensione, dolore addominale, confusione, febbre; Na basso, K alto, glicemia bassa.'] },
      { tipo: 'checklist', titolo: 'Prelievo', righe: ['Cortisolo e ACTH (non attendere)', 'Elettroliti, glicemia, creatinina', 'Cercare infezione'] },
      { tipo: 'terapia', titolo: 'Subito', righe: ['Idrocortisone 100 mg ev in bolo.', 'NaCl 0,9% 1 L in 1 h; glucosio se ipoglicemia.'] },
      { tipo: 'terapia', titolo: 'Poi', righe: ['Idrocortisone 200 mg/24 h in infusione (o 50 mg ogni 6 h).', 'Trattare lo scatenante.'] },
      { tipo: 'esito', titolo: 'Stabile dopo 24–72 h', righe: ['Dosi orali doppie, poi la dose abituale; regole per i giorni di malattia.'] },
    ],
  },
  tireotossicosi: {
    titolo: 'Algoritmo crisi tireotossica',
    nota: 'ATA 2016.',
    nodi: [
      { tipo: 'avvio', titolo: 'Ipertiroideo con febbre, tachicardia, agitazione o scompenso', righe: ['Burch-Wartofsky ≥ 45: crisi probabile.'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['TSH, FT4, FT3, emocromo, funzione epatica', 'ECG (FA), ecocardio se scompenso', 'Cercare lo scatenante'] },
      { tipo: 'terapia', titolo: '1. Beta-bloccante', righe: ['Propranololo 60–80 mg ogni 4–6 h (o metoprololo 5 mg ev). Cautela se bassa portata.'] },
      { tipo: 'terapia', titolo: '2. Tionamide', righe: ['Metimazolo 20 mg ogni 6 h (PTU se gravidanza I trimestre o crisi gravissima).'] },
      { tipo: 'terapia', titolo: '3. Iodio, ≥ 1 h dopo', righe: ['Lugol 5 gocce ogni 6 h.'] },
      { tipo: 'terapia', titolo: '4. Idrocortisone e supporto', righe: ['300 mg ev, poi 100 mg ogni 8 h; paracetamolo, raffreddamento, liquidi.'] },
      { tipo: 'esito', titolo: 'Rianimazione/Terapia intensiva' },
    ],
  },
  mixedema: {
    titolo: 'Algoritmo coma mixedematoso',
    nota: 'ATA 2014.',
    nodi: [
      { tipo: 'avvio', titolo: 'Coma/confusione + ipotermia + bradicardia', righe: ['Ipotiroideo noto, cicatrice di tiroidectomia, amiodarone, litio.'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['TSH, FT4, cortisolo', 'EGA (ipercapnia), Na, glicemia', 'Temperatura centrale'] },
      { tipo: 'terapia', titolo: 'Prima idrocortisone', righe: ['100 mg ev ogni 8 h.'] },
      { tipo: 'terapia', titolo: 'Poi levotiroxina ev', righe: ['200–400 µg in bolo (meno se anziano o cardiopatico), poi 50–100 µg/die.'] },
      { tipo: 'checklist', titolo: 'Supporto', righe: ['Riscaldamento passivo', 'NIV o intubazione per l’ipercapnia', 'Glucosio, correzione lenta del Na', 'Rianimazione'] },
    ],
  },
  rabdomiolisi: {
    titolo: 'Algoritmo rabdomiolisi',
    nodi: [
      { tipo: 'avvio', titolo: 'CK > 5 volte il normale o urine scure', righe: ['Caduta con lunga immobilità, sforzo, crisi, ipertermia, farmaci, droghe.'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['K e ECG', 'Creatinina, Ca, fosforo, EGA', 'Stick urine + sedimento', 'Arti tesi: sindrome compartimentale?'] },
      { tipo: 'decisione', titolo: 'Iperkaliemia?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'PDTA iperkaliemia', vai: [{ etichetta: 'Iperkaliemia', to: '/linee-guida/iperkaliemia' }] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Proseguire' }] },
        ],
      },
      { tipo: 'terapia', titolo: 'Liquidi', righe: ['Cristalloidi 1–2 L, poi 200–300 mL/h per diuresi ~ 3 mL/kg/h.', 'Niente bicarbonato o mannitolo di routine.'] },
      { tipo: 'decisione', titolo: 'Anuria, sovraccarico, acidosi o K refrattario?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Nefrologo: dialisi' }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Ricovero', righe: ['CK e creatinina ogni 12 h finché in calo.'] }] },
        ],
      },
    ],
  },
  ipotermia: {
    titolo: 'Algoritmo ipotermia accidentale',
    nota: 'ERC 2025. Mobilizzare con delicatezza.',
    nodi: [
      { tipo: 'avvio', titolo: 'Temperatura centrale < 35 °C' },
      { tipo: 'decisione', titolo: 'Segni vitali presenti?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Arresto', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'RCP continua + ECLS', righe: ['< 30 °C: massimo 3 shock, niente adrenalina; 30–35 °C: adrenalina ogni 6–10 min.', 'ECMO Careggi; K > 12 mmol/L o lesioni incompatibili: sospendere.'], vai: [{ etichetta: 'ACR', to: '/acr' }] },
            ],
          },
          {
            etichetta: 'Polso presente', tono: 'si', nodi: [
              { tipo: 'decisione', titolo: 'Instabile?', righe: ['PAS < 90, aritmie ventricolari, T < 30 °C.'] },
              {
                tipo: 'rami', rami: [
                  { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Centro con ECLS (Careggi)', righe: ['Riscaldamento attivo nell’attesa.'] }] },
                  { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Riscaldamento', righe: ['Aria calda forzata, liquidi a 38–42 °C, ambiente caldo.'] }] },
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'checklist', titolo: 'Cercare', righe: ['Glicemia', 'Alcol, farmaci, droghe', 'Trauma', 'TSH, sepsi'] },
    ],
  },
  'colpo-di-calore': {
    titolo: 'Algoritmo colpo di calore',
    nota: 'Raffreddare prima di tutto.',
    nodi: [
      { tipo: 'avvio', titolo: 'T > 40 °C + alterazione neurologica' },
      { tipo: 'allarme', titolo: 'Raffreddare subito', righe: ['Immersione in acqua fredda/ghiacciata; oppure acqua nebulizzata + ventilatore + ghiaccio a collo, ascelle, inguine.', 'Fermarsi a 38,5–39 °C.'] },
      { tipo: 'checklist', titolo: 'Intanto', righe: ['Temperatura centrale continua', 'Glicemia, CK, creatinina, transaminasi, coagulazione, K', 'Liquidi 1–2 L', 'Brividi/agitazione: diazepam 5–10 mg'] },
      { tipo: 'decisione', titolo: 'Farmaci o droghe?', righe: ['Cocaina/anfetamine, serotoninergici, antipsicotici, anticolinergici.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'PDTA specifico', vai: [{ etichetta: 'Simpaticomimetici', to: '/linee-guida/simpaticomimetici' }, { etichetta: 'Ipertermia da farmaci', to: '/linee-guida/serotoninergica-snm' }] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Ricovero', righe: ['Monitorare rabdomiolisi, rene, fegato, CID.'] }] },
        ],
      },
    ],
  },
  annegamento: {
    titolo: 'Algoritmo annegamento',
    nota: 'ERC 2025.',
    nodi: [
      { tipo: 'avvio', titolo: 'Sommersione' },
      { tipo: 'decisione', titolo: 'Respira?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'No', tono: 'no', nodi: [{ tipo: 'allarme', titolo: '5 ventilazioni, poi RCP', vai: [{ etichetta: 'ACR', to: '/acr' }] }] },
          { etichetta: 'Sì', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Ossigeno, temperatura, rachide se tuffo' }] },
        ],
      },
      { tipo: 'decisione', titolo: 'Sintomi respiratori, SpO₂ bassa o RX anormale?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Ossigeno → CPAP/NIV → intubazione con PEEP', righe: ['Ricovero.'], vai: [{ etichetta: 'NIV con V60', to: '/procedure?apri=niv-v60' }] }] },
          { etichetta: 'No', tono: 'si', fine: 'Osservazione 6 h; dimissione se invariato', nodi: [] },
        ],
      },
    ],
  },
  folgorazione: {
    titolo: 'Algoritmo elettrocuzione',
    nota: 'ERC 2025.',
    nodi: [
      { tipo: 'avvio', titolo: 'Elettrocuzione o fulmine', righe: ['Tensione, durata, perdita di coscienza, caduta.'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['ECG a 12 derivazioni', 'Punti d’ingresso e uscita, arti', 'CK, creatinina, troponina, urine'] },
      { tipo: 'decisione', titolo: 'Alta tensione, fulmine, perdita di coscienza, ECG anormale, ustioni, gravidanza?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'No (bassa tensione, asintomatico)', tono: 'si', fine: 'Dimissione', nodi: [] },
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Monitor ECG 24 h', righe: ['Liquidi per diuresi 1–1,5 mL/kg/h se mioglobina; arti: sindrome compartimentale; centro ustioni se alta tensione.'] }] },
        ],
      },
    ],
  },
  ustioni: {
    titolo: 'Algoritmo grande ustionato',
    nota: 'Ore contate dal momento dell’ustione.',
    nodi: [
      { tipo: 'avvio', titolo: 'Ustione', righe: ['Raffreddare con acqua 20 min, togliere vestiti, poi scaldare il paziente.'] },
      { tipo: 'decisione', titolo: 'Vie aeree a rischio?', righe: ['Volto, inalazione, stridore, voce rauca, fuliggine, collo circonferenziale.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Intubazione precoce', righe: ['Tubo ≥ 8; COHb e cianuro.'], vai: [{ etichetta: 'Fumi e cianuro', to: '/linee-guida/cianuro-fumi' }] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Ossigeno, rivalutare' }] },
        ],
      },
      { tipo: 'passo', titolo: 'Estensione (2°–3° grado)', righe: ['Regola del 9 o palmo = 1%; trauma associato?'] },
      { tipo: 'decisione', titolo: '> 20%?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Liquidi', righe: ['Ringer 2–4 mL/kg/% in 24 h, metà nelle prime 8 h.', 'Catetere: diuresi 0,5 mL/kg/h.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Liquidi per bocca/mantenimento' }] },
        ],
      },
      { tipo: 'checklist', titolo: 'Sempre', righe: ['Analgesia (morfina, ketamina)', 'Antitetanica', 'Escarotomia se circonferenziale', 'Criteri per il centro grandi ustionati'] },
    ],
  },
}

/*
 * PDTA tossicologici aggiuntivi. Dosi per adulto di 70 kg.
 * Antidoti rari (fomepizolo, pralidossima, siero antivipera, DigiFab, silibinina): tramite il Centro antiveleni (Tossicologia di Careggi).
 */
import type { LineaGuida } from '../lineeGuida'
import type { Nodo } from '../algoritmi'

type Alg = Record<string, { titolo: string; nota?: string; nodi: Nodo[] }>

const AHA = { etichetta: 'Lavonas et al., Circulation 2023 (AHA, avvelenamenti)', url: 'https://doi.org/10.1161/CIR.0000000000001161' }
const CAV = { etichetta: 'Rubrica: Tossicologia · Antiveleni', to: '/rubrica' }
const OGGI = '2026-11-13'

export const LG_TOSSICOLOGIA: LineaGuida[] = [
  {
    id: 'betabloccanti-calcioantagonisti',
    titolo: 'Intossicazione da beta-bloccanti e calcio-antagonisti',
    ente: 'AHA',
    anno: 2023,
    area: 'Tossicologia',
    fonte: AHA,
    controllata: OGGI,
    vediAnche: [CAV, { etichetta: 'Bradicardia', to: '/linee-guida/bradicardia' }, { etichetta: 'Pacing transcutaneo', to: '/procedure?apri=pacing' }],
    inBreve: [
      'Bradicardia + ipotensione dopo ingestione: monitor, accessi, glicemia (iperglicemia = gravità nei calcio-antagonisti), EGA, lattati, K.',
      'Formulazioni a rilascio prolungato (verapamil, nifedipina, metoprololo RP): sintomi anche dopo 12–24 h → osservazione ≥ 24 h anche se asintomatico.',
      'Carbone attivo 50 g entro 1–2 h se vie aeree protette; irrigazione intestinale totale per le forme a rilascio prolungato.',
      'Sequenza: atropina → calcio → insulina ad alte dosi (terapia cardine) + vasopressori → glucagone (beta-bloccanti) → pacing → emulsione lipidica → ECMO (Careggi).',
      'Insulina ad alte dosi: effetto dopo 15–45 min, iniziarla presto e non aspettare il fallimento dei vasopressori.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Atropina 1 mg ev, ripetibile fino a 3 mg (spesso poco efficace).',
          'Calcio cloruro 10% 1 fiala (1 g/10 mL) in CVC o calcio gluconato 10% 3 fiale (3 g) ev in 5–10 min; ripetibile ogni 10–20 min fino a 3–4 volte, poi infusione; obiettivo Ca ionizzato ~2 volte il normale.',
          'Insulina rapida (Actrapid) 1 U/kg = 70 U ev in bolo, poi 1 U/kg/h (70 U/h) titolabile fino a 10 U/kg/h; glucosio 33% 50 mL in bolo se glicemia < 250, poi glucosio in infusione (G10–20%) per glicemia 100–250 mg/dL; glicemia ogni 15–30 min, K ogni ora (tenere K 2,8–3,5).',
          'Noradrenalina 0,1–1 µg/kg/min (adrenalina se bradicardia prevalente); ecocardio per scegliere (vasoplegia vs pompa).',
          'Glucagone (GlucaGen 1 mg): 5 mg ev in 2 min (5 flaconi), ripetibile 5 mg; se risponde 3–5 mg/h. Dà vomito: antiemetico e protezione vie aeree.',
          'Emulsione lipidica 20% (Intralipid): 100 mL (1,5 mL/kg) in 1 min, poi 0,25 mL/kg/min per 30–60 min; solo se refrattario.',
          'Arresto o shock refrattario: ECMO veno-arteriosa (Careggi); RCP prolungata.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2023-09-18', testo: 'AHA 2023: insulina ad alte dosi raccomandata presto; glucagone e lipidi come terapie di seconda linea; ECMO se refrattario.' }],
  },
  {
    id: 'triciclici',
    titolo: 'Intossicazione da triciclici e bloccanti dei canali del sodio',
    ente: 'AHA',
    anno: 2023,
    area: 'Tossicologia',
    fonte: AHA,
    controllata: OGGI,
    vediAnche: [CAV, { etichetta: 'Stato di male', to: '/linee-guida/stato-di-male' }],
    inBreve: [
      'Triciclici (amitriptilina, clomipramina), ma anche flecainide, propafenone, carbamazepina, difenidramina, cocaina, venlafaxina ad alte dosi.',
      'Peggiora in fretta (1–6 h): coma, convulsioni, ipotensione, aritmie ventricolari. ECG seriati.',
      'ECG: QRS > 100 ms, R in aVR > 3 mm, R/S in aVR > 0,7, onda S profonda in DI e aVL. QRS > 160 = rischio aritmie.',
      'QRS largo o aritmie o ipotensione: bicarbonato di sodio in bolo, ripetuto fino a QRS che si stringe (pH 7,45–7,55).',
      'Convulsioni: benzodiazepine (diazepam). Niente fenitoina, flumazenil, fisostigmina, antiaritmici di classe IA/IC.',
      'Asintomatico con ECG normale dopo 6 h di osservazione: valutazione psichiatrica e dimissione dal punto di vista tossicologico.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Bicarbonato di sodio 8,4% (1 mEq/mL) 1–2 mEq/kg = 70–140 mL ev in bolo (1–3 flaconi da 50 mL), ripetere ogni 3–5 min secondo QRS; poi infusione 150 mEq in 1 L di G5% a 150–250 mL/h.',
          'Controllare K (scende col bicarbonato) e pH ogni 1–2 h; obiettivo pH 7,45–7,55, non oltre 7,60.',
          'Intubato: iperventilare (PaCO₂ 30–35) mantenendo il bicarbonato; evitare l’acidosi in sequenza rapida.',
          'Aritmie ventricolari refrattarie al bicarbonato: lidocaina 1–1,5 mg/kg = 100 mg ev; magnesio solfato 2 g ev se torsioni.',
          'Ipotensione: liquidi 1–2 L, noradrenalina. Arresto refrattario: emulsione lipidica 20% 100 mL; ECMO.',
          'Carbone attivo 50 g se < 1–2 h e vie aeree protette.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2023-09-18', testo: 'AHA 2023: bicarbonato per le aritmie e il QRS largo da bloccanti dei canali del sodio; lidocaina in seconda linea; lipidi ed ECMO se refrattari.' }],
  },
  {
    id: 'salicilati',
    titolo: 'Intossicazione da salicilati',
    ente: 'EXTRIP',
    anno: 2015,
    area: 'Tossicologia',
    fonte: { etichetta: 'Juurlink et al., Ann Emerg Med 2015 (EXTRIP, salicilati)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Juurlink+EXTRIP+salicylate+Ann+Emerg+Med+2015' },
    controllata: OGGI,
    vediAnche: [CAV],
    inBreve: [
      'Acido acetilsalicilico, ma anche olio di gaultheria e preparati topici. Tossica > 150 mg/kg; grave > 300 mg/kg (70 kg: > 10 g e > 21 g).',
      'Quadro: tinnito, vomito, iperpnea, alcalosi respiratoria + acidosi metabolica con gap anionico aumentato; poi confusione, febbre, edema polmonare.',
      'Livelli ogni 2 h finché in calo per due volte (assorbimento irregolare, bezoari); glicemia, K, EGA, creatinina.',
      'Alcalinizzare plasma e urine col bicarbonato (pH urinario 7,5–8); il K va mantenuto normale o le urine non si alcalinizzano.',
      'Evitare l’intubazione se possibile: l’apnea anche breve fa crollare il pH. Se inevitabile: ventilare con volumi/frequenza alti, pari alla PaCO₂ pre-intubazione, bicarbonato in bolo prima.',
      'Confusione o coma con glicemia normale: dare comunque glucosio (ipoglicorrachia).',
    ],
    sezioni: [
      {
        titolo: 'Terapia (70 kg)',
        punti: [
          'Carbone attivo 50 g (anche oltre 1 h se dose alta o compresse gastroresistenti), ripetibile 25 g dopo 4 h.',
          'Bicarbonato di sodio 8,4% 1–2 mEq/kg = 70–140 mL in bolo, poi 150 mEq (150 mL) in 1 L di G5% a 150–250 mL/h; pH ematico non oltre 7,55.',
          'KCl 20–40 mEq per litro di infusione per tenere K 4–4,5.',
          'Liquidi per diuresi 1–2 mL/kg/h; attenzione all’edema polmonare.',
        ],
      },
      {
        titolo: 'Emodialisi (EXTRIP): nefrologo subito se',
        punti: [
          'Salicilemia > 100 mg/dL (7,2 mmol/L), oppure > 90 mg/dL con funzione renale ridotta.',
          'Alterazione dello stato di coscienza, ipossiemia che richiede ossigeno, edema polmonare.',
          'pH ≤ 7,20 o peggioramento nonostante la terapia; insufficienza renale.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2015-06-01', testo: 'EXTRIP 2015: criteri per l’emodialisi (livello, coscienza, ipossiemia, pH, rene).' }],
  },
  {
    id: 'litio',
    titolo: 'Intossicazione da litio',
    ente: 'EXTRIP',
    anno: 2015,
    area: 'Tossicologia',
    fonte: { etichetta: 'Decker et al., Clin J Am Soc Nephrol 2015 (EXTRIP, litio)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Decker+EXTRIP+lithium+2015' },
    controllata: OGGI,
    vediAnche: [CAV],
    inBreve: [
      'Cronica (la più frequente e la più grave per il cervello): disidratazione, diuretici, ACE-inibitori/sartani, FANS, insufficienza renale. Tremore, atassia, confusione, mioclonie, convulsioni.',
      'Acuta: vomito e diarrea prima, neurotossicità più tardi. Livelli ripetuti ogni 2–4 h (rilascio prolungato).',
      'Litiemia > 1,5 mEq/L tossica; ma conta la clinica, soprattutto nella cronica.',
      'Terapia: sospendere, soluzione fisiologica, sospendere i farmaci che lo trattengono. Carbone inutile; irrigazione intestinale per rilascio prolungato.',
      'Dialisi (EXTRIP) se rene compromesso o neurotossicità: nefrologo presto.',
    ],
    sezioni: [
      {
        titolo: 'Terapia',
        punti: [
          'NaCl 0,9% 1–2 L poi 150–200 mL/h per diuresi 1–3 mL/kg/h (attenzione a scompenso e ipernatriemia; il diabete insipido da litio può dare poliuria).',
          'Irrigazione intestinale totale (PEG 1,5–2 L/h per SNG) nelle ingestioni di rilascio prolungato se vigile.',
          'ECG: QT lungo, bradicardia sinusale, onde T piatte.',
        ],
      },
      {
        titolo: 'Emodialisi (EXTRIP)',
        punti: [
          'Raccomandata: litiemia > 4,0 mEq/L con funzione renale ridotta; oppure coma, convulsioni, aritmie pericolose a qualunque livello.',
          'Suggerita: litiemia > 5,0 mEq/L; confusione; tempo previsto per scendere sotto 1,0 > 36 h.',
          'Dopo la dialisi: rebound, ricontrollare a 6 h.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2015-04-01', testo: 'EXTRIP 2015: indicazioni all’emodialisi nell’intossicazione da litio.' }],
  },
  {
    id: 'simpaticomimetici',
    titolo: 'Cocaina, anfetamine e simpaticomimetici',
    ente: 'AHA',
    anno: 2023,
    area: 'Tossicologia',
    fonte: AHA,
    controllata: OGGI,
    vediAnche: [CAV, { etichetta: 'Sedazione: agitato', to: '/sedazione?apri=agitato' }, { etichetta: 'Colpo di calore', to: '/linee-guida/colpo-di-calore' }],
    inBreve: [
      'Agitazione, tachicardia, ipertensione, midriasi, sudorazione, ipertermia. Complicanze: SCA, dissezione, emorragia cerebrale, convulsioni, rabdomiolisi, aritmie.',
      'Benzodiazepine prima di tutto: agitazione, tachicardia, ipertensione e ipertermia migliorano insieme.',
      'Temperatura > 40 °C: raffreddamento aggressivo subito; se refrattaria intubare e curarizzare (rocuronio, non succinilcolina).',
      'Ipertensione persistente dopo le benzodiazepine: nitroglicerina o urapidil; labetalolo accettabile; evitare i beta-bloccanti puri in acuto.',
      'Dolore toracico: come SCA (ASA, nitrati, benzodiazepine); ECG seriati e troponina; pensare alla dissezione.',
      'QRS largo da cocaina: bicarbonato come nei triciclici.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Diazepam (Valium) 10 mg ev (1 fiala da 10 mg/2 mL) ogni 5–10 min fino a sedazione; midazolam 5–10 mg im se senza accesso.',
          'Nitroglicerina (50 mg in 50 mL) da 0,6 mL/h (10 µg/min), aumentare ogni 5 min; urapidil (Ebrantil) 12,5–25 mg ev.',
          'Bicarbonato di sodio 8,4% 100 mL ev se QRS > 120 ms.',
          'Esami: CK, creatinina, troponina, K, EGA, glicemia; TC encefalo se cefalea, deficit o coma.',
        ],
      },
      {
        titolo: 'Ovulatori (body packer)',
        punti: [
          'Asintomatico: TC addome senza contrasto, irrigazione intestinale, osservazione fino a espulsione di tutti gli ovuli.',
          'Sintomi di intossicazione o occlusione: chirurgo subito (laparotomia); niente endoscopia.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2023-09-18', testo: 'AHA 2023: benzodiazepine di prima linea; raffreddamento per l’ipertermia; per l’ipertensione vasodilatatori; i beta-bloccanti non sono più considerati assolutamente controindicati.' }],
  },
  {
    id: 'serotoninergica-snm',
    titolo: 'Sindrome serotoninergica e sindrome neurolettica maligna',
    ente: 'Hunter / consenso internazionale',
    anno: 2011,
    area: 'Tossicologia',
    fonte: { etichetta: 'Dunkley et al., QJM 2003 (criteri di Hunter)', url: 'https://doi.org/10.1093/qjmed/hcg109' },
    controllata: OGGI,
    vediAnche: [CAV, { etichetta: 'Rabdomiolisi', to: '/linee-guida/rabdomiolisi' }, { etichetta: 'Delirium', to: '/linee-guida/delirium' }],
    approfondimenti: [{ etichetta: 'Gurrera et al., J Clin Psychiatry 2011 (criteri SNM, consenso)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Gurrera+neuroleptic+malignant+syndrome+consensus+2011' }],
    inBreve: [
      'Serotoninergica: esordio in ore dopo aumento/associazione di SSRI, SNRI, tramadolo, linezolid, triptani, MDMA, IMAO. Clonie (inducibili, oculari), iperreflessia agli arti inferiori, agitazione, midriasi, diarrea, febbre.',
      'Criteri di Hunter (con farmaco serotoninergico): clono spontaneo; clono inducibile + agitazione o diaforesi; clono oculare + agitazione o diaforesi; tremore + iperreflessia; ipertonia + T > 38 °C + clono oculare o inducibile.',
      'Neurolettica maligna: giorni dopo antipsicotico (o sospensione brusca di levodopa). Rigidità a tubo di piombo, bradicinesia, febbre, disautonomia, confusione, CK molto alta.',
      'Entrambe: sospendere i farmaci, liquidi, raffreddamento, benzodiazepine. Niente antipiretici (inutili), niente contenzione fisica, niente succinilcolina.',
      'T > 41 °C o rigidità grave: intubazione e curaro non depolarizzante, rianimatore.',
      'Diagnosi differenziali: ipertermia maligna, anticolinergici (pelle secca, ritenzione), meningoencefalite, colpo di calore, astinenza, tireotossicosi.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Diazepam (Valium) 10 mg ev ripetibile ogni 10 min fino a controllo di agitazione e clonie.',
          'Serotoninergica: ciproeptadina (Periactin cp 4 mg) 12 mg per bocca o SNG (3 cp), poi 2 mg ogni 2 h se persistono i sintomi; mantenimento 8 mg ogni 6 h.',
          'Neurolettica maligna moderata–grave: dantrolene (Dantrium ev, flaconi 20 mg) 1–2,5 mg/kg = 70–175 mg ev (4–9 flaconi), ripetibile fino a 10 mg/kg/die; bromocriptina 2,5 mg per bocca/SNG ogni 8 h.',
          'Liquidi 1–2 L, CK e creatinina seriate (rabdomiolisi), K.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2011-09-01', testo: 'Consenso internazionale 2011 sui criteri diagnostici della sindrome neurolettica maligna.' }],
  },
  {
    id: 'alcoli-tossici',
    titolo: 'Metanolo e glicole etilenico',
    ente: 'EXTRIP · AACT',
    anno: 2015,
    area: 'Tossicologia',
    fonte: { etichetta: 'Roberts et al., Crit Care Med 2015 (EXTRIP, metanolo)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Roberts+EXTRIP+methanol+Crit+Care+Med+2015' },
    controllata: OGGI,
    vediAnche: [CAV, { etichetta: 'Chetoacidosi', to: '/linee-guida/chetoacidosi' }],
    inBreve: [
      'Metanolo (alcol denaturato, distillati artigianali, lavavetri): disturbi visivi, acidosi grave. Glicole etilenico (antigelo): coma, convulsioni, insufficienza renale, cristalli di ossalato nelle urine.',
      'Sospetto: acidosi metabolica con gap anionico alto senza chetoni né lattati che la spieghino, e gap osmolare > 10–20 (all’inizio c’è il gap osmolare, poi l’acidosi).',
      'Gap osmolare = osmolalità misurata − (2 × Na + glicemia/18 + urea/6 + etanolo/4,6). Un gap normale non esclude.',
      'Bloccare l’alcol deidrogenasi subito, anche solo col sospetto: fomepizolo (CAV) o etanolo ev.',
      'Dialisi (nefrologo) se acidosi grave, disturbi visivi, insufficienza renale o livelli alti.',
      'Il dosaggio dei livelli spesso non è disponibile in urgenza: decidere su clinica, EGA e gap e chiamare il CAV.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Fomepizolo 15 mg/kg = 1.050 mg ev in 30 min, poi 10 mg/kg ogni 12 h (aumentare a 15 mg/kg dopo 48 h; ogni 4 h in dialisi). Tramite CAV.',
          'In alternativa etanolo ev (o per SNG): carico 0,8 g/kg, poi 80–130 mg/kg/h (più alto negli alcolisti e in dialisi); obiettivo etanolemia 100–150 mg/dL; controllare glicemia.',
          'Bicarbonato di sodio se pH < 7,30: 1–2 mEq/kg = 70–140 mL di 8,4%.',
          'Metanolo: acido folinico (o folico) 50 mg ev ogni 6 h. Glicole: tiamina 100 mg e piridossina 50 mg ev ogni 6 h.',
        ],
      },
      {
        titolo: 'Emodialisi (EXTRIP metanolo)',
        punti: [
          'Coma, convulsioni, nuovi disturbi visivi; pH ≤ 7,15 o gap anionico > 24; insufficienza renale.',
          'Metanolemia > 70 mg/dL in terapia con fomepizolo (> 60 con etanolo, > 50 senza blocco dell’ADH).',
        ],
      },
    ],
    aggiornamenti: [{ data: '2015-03-01', testo: 'EXTRIP 2015: criteri per la dialisi nell’intossicazione da metanolo.' }],
  },
  {
    id: 'organofosfati',
    titolo: 'Organofosfati e carbammati',
    ente: 'AHA',
    anno: 2023,
    area: 'Tossicologia',
    fonte: AHA,
    controllata: OGGI,
    vediAnche: [CAV],
    inBreve: [
      'Insetticidi (agricoltura, giardinaggio), gas nervini. Sindrome colinergica: miosi, broncorrea, broncospasmo, bradicardia, scialorrea, lacrimazione, vomito, diarrea, fascicolazioni, debolezza, convulsioni.',
      'Decontaminazione prima di entrare in PS: togliere i vestiti (sacco chiuso), lavare con acqua e sapone; operatori con guanti in nitrile e camice.',
      'Atropina a dosi crescenti finché il torace è asciutto: è la terapia salvavita. Non fermarsi per la tachicardia.',
      'Pralidossima (ossima) negli organofosfati con debolezza muscolare o sintomi gravi, tramite CAV.',
      'Convulsioni: diazepam. Intubazione: rocuronio (la succinilcolina dura ore).',
      'Sindrome intermedia (24–96 h): debolezza dei muscoli respiratori e del collo; monitorare la forza.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Atropina 1–2 mg ev, raddoppiare ogni 5 min (2, 4, 8 mg…) finché: torace asciutto all’auscultazione, FC > 80, PAS > 80, pupille non più miotiche. Poi infusione 10–20% della dose di carico all’ora.',
          'Pralidossima (Contrathion, flaconi 200 mg): 30 mg/kg = 2 g ev in 30 min, poi 8 mg/kg/h (~ 500 mg/h); tramite CAV.',
          'Diazepam 10 mg ev per convulsioni o agitazione.',
          'Ossigeno, aspirazione secrezioni; atropina prima e durante l’intubazione.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2023-09-18', testo: 'AHA 2023: atropina titolata sulle secrezioni bronchiali; ossime negli organofosfati; benzodiazepine per le convulsioni.' }],
  },
  {
    id: 'funghi',
    titolo: 'Intossicazione da funghi',
    ente: 'CAV · letteratura',
    anno: 2024,
    area: 'Tossicologia',
    fonte: { etichetta: 'PubMed: amatoxin poisoning management (revisioni)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=amatoxin+poisoning+management+review' },
    controllata: OGGI,
    vediAnche: [CAV, { etichetta: 'Paracetamolo (NAC)', to: '/linee-guida/paracetamolo' }],
    inBreve: [
      'La domanda chiave è la latenza tra pasto e primi sintomi (vomito, diarrea).',
      'Latenza < 6 h: di solito sindromi benigne (gastroenterica, muscarinica, panterinica) → terapia di supporto, osservazione.',
      'Latenza > 6 h (spesso 8–24 h): sospetta amanitina (Amanita phalloides) → pericolo di insufficienza epatica fulminante. Ricovero e CAV anche se i sintomi migliorano (falsa remissione al giorno 2).',
      'Tutti i commensali vanno richiamati e valutati.',
      'Conservare i resti dei funghi, gli scarti di pulizia e il vomito per il micologo (tramite CAV / ASL).',
      'Altre sindromi gravi tardive: Cortinarius (insufficienza renale dopo giorni), Gyromitra (convulsioni: piridossina).',
    ],
    sezioni: [
      {
        titolo: 'Sospetta amanitina (70 kg)',
        punti: [
          'Esami a 0, 12, 24, 48 h: transaminasi, INR, bilirubina, creatinina, glicemia; amanitina urinaria se disponibile.',
          'Liquidi abbondanti per correggere le perdite e mantenere diuresi > 1–2 mL/kg/h.',
          'Carbone attivo 50 g ogni 4 h (circolo enteroepatico) se tollera.',
          'Silibinina (Legalon SIL) 20 mg/kg/die = 1.400 mg/die ev in infusione continua o in 4 dosi da 5 mg/kg; tramite CAV. In alternativa penicillina G ad alte dosi (meno efficace).',
          'N-acetilcisteina con lo schema del paracetamolo: spesso associata.',
          'INR in salita, encefalopatia, ipoglicemia: contatto precoce con il centro trapianti di fegato (Pisa).',
        ],
      },
    ],
    aggiornamenti: [{ data: OGGI, testo: 'Aggiunto: gestione per latenza, schema per amanitina.' }],
  },
  {
    id: 'vipera',
    titolo: 'Morso di vipera',
    ente: 'CAV · letteratura',
    anno: 2023,
    area: 'Tossicologia',
    fonte: { etichetta: 'PubMed: Vipera aspis envenomation, antivenom', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Vipera+aspis+envenomation+antivenom' },
    controllata: OGGI,
    vediAnche: [CAV, { etichetta: 'Ferite e morsi: tetano', to: '/linee-guida/tetano-rabbia' }, { etichetta: 'Anafilassi', to: '/linee-guida/anafilassi' }],
    inBreve: [
      'In Italia vipere (V. aspis la più comune). Il 30–50% dei morsi è «secco», senza veleno.',
      'No laccio, no incisione, no suzione, no ghiaccio. Immobilizzare l’arto, togliere anelli.',
      'Osservazione almeno 12 h (24 h se edema in progressione o bambino/anziano), con circonferenza dell’arto segnata ogni ora.',
      'Gravità: 0 = solo segni dei denti; 1 = edema locale; 2 = edema esteso alla radice dell’arto, o sintomi generali moderati (vomito, diarrea, ipotensione lieve); 3 = edema oltre l’arto, shock, sanguinamento, sintomi neurologici (ptosi, diplopia).',
      'Grado 2–3: siero antivipera tramite CAV. Premedicazione non obbligatoria; adrenalina pronta.',
      'Profilassi antitetanica; niente antibiotico di routine; analgesia senza FANS se coagulopatia.',
    ],
    sezioni: [
      {
        titolo: 'Esami e terapia',
        punti: [
          'Emocromo, PT/INR, aPTT, fibrinogeno, CK, creatinina, ECG; ripetere a 6 e 12 h.',
          'Siero antivipera: dose e prodotto secondo il CAV (di solito 1 dose ev in 30 min, ripetibile se il quadro progredisce).',
          'Reazione al siero: sospendere, adrenalina 0,5 mg im, poi riprendere più lentamente se indicato.',
          'Sindrome compartimentale vera rara: misurare la pressione prima di qualsiasi fasciotomia (chirurgo).',
        ],
      },
    ],
    aggiornamenti: [{ data: OGGI, testo: 'Aggiunto: gradazione clinica e indicazioni al siero.' }],
  },
  {
    id: 'cianuro-fumi',
    titolo: 'Intossicazione da fumi d’incendio e cianuro',
    ente: 'AHA',
    anno: 2023,
    area: 'Tossicologia',
    fonte: AHA,
    controllata: OGGI,
    vediAnche: [CAV, { etichetta: 'Monossido di carbonio', to: '/linee-guida/monossido' }, { etichetta: 'Grande ustionato', to: '/linee-guida/ustioni' }],
    inBreve: [
      'Incendio in ambiente chiuso: CO e cianuro insieme. Coma, convulsioni, ipotensione, arresto, acidosi lattica.',
      'Lattati > 8 mmol/L in un intossicato da fumo = cianuro probabile (anche senza attendere altro).',
      'Ossigeno 100% in maschera reservoir subito; via aerea precoce se ustioni del volto, stridore, voce rauca, fuliggine nell’orofaringe.',
      'Idrossocobalamina (Cyanokit) empirica se alterazione della coscienza, ipotensione, arresto o lattati alti. Non aspettare conferme.',
      'Colora la pelle e le urine di rosso per giorni e altera alcuni esami (prelevare prima se possibile).',
      'Cianuro anche da nitroprussiato prolungato, sostanze industriali, semi di albicocca/amigdalina.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Idrossocobalamina (Cyanokit 5 g): 5 g ev in 15 min (ricostituire con 200 mL di NaCl 0,9%); seconda dose 5 g in 15–120 min se persiste instabilità.',
          'Usare un accesso dedicato (incompatibile con molti farmaci).',
          'Ossigeno 100%; camera iperbarica per il CO secondo il PDTA monossido, dopo stabilizzazione.',
          'Prelevare prima: COHb, lattati, EGA, metaemoglobina.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2023-09-18', testo: 'AHA 2023: idrossocobalamina preferita nei sospetti di cianuro da fumo; evitare i nitriti nell’intossicazione combinata con CO.' }],
  },
]

export const ALG_TOSSICOLOGIA: Alg = {
  'betabloccanti-calcioantagonisti': {
    titolo: 'Algoritmo beta-bloccanti / calcio-antagonisti',
    nota: 'AHA 2023. Iniziare presto l’insulina ad alte dosi.',
    nodi: [
      { tipo: 'avvio', titolo: 'Ingestione di beta-bloccante o calcio-antagonista', righe: ['Quantità, ora, formulazione (rilascio prolungato?).'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['Monitor, 2 accessi, ECG', 'Glicemia, K, Ca, EGA, lattati, creatinina', 'Carbone 50 g se < 1–2 h e vie aeree protette', 'Rilascio prolungato: irrigazione intestinale, osservazione ≥ 24 h', 'Chiamare il CAV'] },
      { tipo: 'decisione', titolo: 'Bradicardia o ipotensione?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'No', tono: 'si', fine: 'Osservazione con monitor (≥ 24 h se rilascio prolungato)', nodi: [] },
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'terapia', titolo: '1. Atropina e calcio', righe: ['Atropina 1 mg ev (fino a 3 mg).', 'Calcio cloruro 1 g (CVC) o gluconato 3 g ev, ripetibile ogni 10–20 min.', 'Liquidi 1 L.'] },
              { tipo: 'terapia', titolo: '2. Insulina ad alte dosi + vasopressore', righe: ['Actrapid 70 U ev in bolo, poi 70 U/h (fino a 700 U/h).', 'Glucosio in infusione; glicemia ogni 15–30 min, K ogni ora.', 'Noradrenalina (adrenalina se bradicardia); ecocardio.'] },
              { tipo: 'terapia', titolo: '3. Se non basta', righe: ['Beta-bloccante: glucagone 5 mg ev, poi 3–5 mg/h.', 'Pacing se bradicardia.', 'Emulsione lipidica 20% 100 mL.'], vai: [{ etichetta: 'Pacing', to: '/procedure?apri=pacing' }] },
              { tipo: 'allarme', titolo: 'Refrattario o arresto', righe: ['ECMO veno-arteriosa (Careggi); RCP prolungata.'] },
            ],
          },
        ],
      },
    ],
  },
  triciclici: {
    titolo: 'Algoritmo triciclici / bloccanti dei canali del sodio',
    nota: 'AHA 2023.',
    nodi: [
      { tipo: 'avvio', titolo: 'Ingestione di triciclici (o flecainide, carbamazepina…)', righe: ['Può peggiorare in poche ore: monitor sempre.'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['ECG a 12 derivazioni ogni ora: QRS, R in aVR', 'EGA, K, glicemia', 'Carbone 50 g se < 1–2 h e vie aeree protette', 'CAV'] },
      { tipo: 'decisione', titolo: 'QRS > 100 ms, aritmie, ipotensione o convulsioni?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'No', tono: 'si', fine: 'ECG normale e asintomatico dopo 6 h: valutazione psichiatrica', nodi: [] },
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'terapia', titolo: 'Bicarbonato in bolo', righe: ['Bicarbonato 8,4% 70–140 mL ev, ripetere finché il QRS si stringe; poi infusione.', 'Obiettivo pH 7,45–7,55; correggere K.'] },
              { tipo: 'terapia', titolo: 'Convulsioni e ipotensione', righe: ['Diazepam 10 mg ev.', 'Liquidi, noradrenalina.', 'Intubato: iperventilare.'] },
              { tipo: 'allarme', titolo: 'Aritmie refrattarie o arresto', righe: ['Lidocaina 100 mg ev; magnesio 2 g se torsioni.', 'Emulsione lipidica 20% 100 mL; ECMO.', 'NO flecainide, propafenone, procainamide, fisostigmina, flumazenil.'] },
            ],
          },
        ],
      },
    ],
  },
  salicilati: {
    titolo: 'Algoritmo salicilati',
    nota: 'EXTRIP 2015.',
    nodi: [
      { tipo: 'avvio', titolo: 'Ingestione di salicilati', righe: ['> 150 mg/kg tossica; tinnito, vomito, iperpnea.'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['Salicilemia ora e ogni 2 h', 'EGA, gap anionico, K, glicemia, creatinina', 'Carbone 50 g', 'CAV'] },
      { tipo: 'terapia', titolo: 'Alcalinizzare', righe: ['Bicarbonato 8,4% 70–140 mL in bolo, poi 150 mEq in 1 L di G5% a 150–250 mL/h.', 'KCl per tenere K 4–4,5; pH urine 7,5–8, pH ematico ≤ 7,55.'] },
      { tipo: 'decisione', titolo: 'Criteri per la dialisi?', righe: ['> 100 mg/dL (> 90 con rene ridotto), alterazione della coscienza, ipossiemia, pH ≤ 7,20, peggioramento.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Nefrologo: emodialisi urgente', righe: ['Evitare l’intubazione; se inevitabile, iperventilare e bicarbonato prima.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Continuare e ripetere i livelli', righe: ['Fino a due valori in calo e sintomi risolti.'] }] },
        ],
      },
    ],
  },
  litio: {
    titolo: 'Algoritmo litio',
    nota: 'EXTRIP 2015.',
    nodi: [
      { tipo: 'avvio', titolo: 'Sospetta intossicazione da litio', righe: ['Acuta, cronica o acuta su cronica; farmaci associati (diuretici, ACE-inibitori, FANS).'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['Litiemia ogni 2–4 h', 'Creatinina, Na, ECG', 'Sospendere litio e farmaci che lo trattengono', 'Rilascio prolungato: irrigazione intestinale'] },
      { tipo: 'terapia', titolo: 'NaCl 0,9%', righe: ['1–2 L, poi 150–200 mL/h; diuresi 1–3 mL/kg/h.'] },
      { tipo: 'decisione', titolo: 'Criteri EXTRIP?', righe: ['> 4,0 con rene ridotto; coma, convulsioni, aritmie; > 5,0; confusione; discesa lenta (> 36 h).'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Emodialisi', righe: ['Nefrologo; ricontrollare 6 h dopo (rebound).'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Liquidi e livelli seriati', righe: ['Ricovero se sintomi neurologici.'] }] },
        ],
      },
    ],
  },
  simpaticomimetici: {
    titolo: 'Algoritmo cocaina / simpaticomimetici',
    nota: 'AHA 2023.',
    nodi: [
      { tipo: 'avvio', titolo: 'Agitazione, tachicardia, ipertensione, ipertermia', righe: ['Cocaina, anfetamine, MDMA, catinoni.'] },
      { tipo: 'terapia', titolo: 'Benzodiazepine', righe: ['Diazepam 10 mg ev ogni 5–10 min (midazolam 5–10 mg im).'], vai: [{ etichetta: 'Paziente agitato', to: '/sedazione?apri=agitato' }] },
      { tipo: 'decisione', titolo: 'Temperatura > 40 °C?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Raffreddamento rapido', righe: ['Acqua fredda/ghiaccio; se refrattaria: intubare e curarizzare (rocuronio).'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Temperatura ogni 30–60 min' }] },
        ],
      },
      { tipo: 'checklist', titolo: 'Complicanze da cercare', righe: ['ECG e troponina: SCA, QRS largo (→ bicarbonato)', 'Dolore toracico/dorsale: dissezione', 'Cefalea o deficit: TC encefalo', 'CK, creatinina, K: rabdomiolisi'] },
      { tipo: 'terapia', titolo: 'Ipertensione persistente', righe: ['Nitroglicerina in infusione o urapidil 12,5–25 mg ev; labetalolo accettabile.'] },
    ],
  },
  'serotoninergica-snm': {
    titolo: 'Algoritmo ipertermia da farmaci',
    nota: 'Criteri di Hunter; consenso SNM 2011.',
    nodi: [
      { tipo: 'avvio', titolo: 'Febbre, alterazione neuromuscolare e mentale in terapia', righe: ['Farmaci nuovi o aumentati, associazioni, sospensioni.'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['Sospendere i farmaci sospetti', 'Temperatura centrale, CK, creatinina, K, EGA', 'Escludere: meningoencefalite, colpo di calore, tireotossicosi, anticolinergici'] },
      { tipo: 'decisione', titolo: 'Quale quadro?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Clono, iperreflessia, esordio in ore', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Sindrome serotoninergica', righe: ['Diazepam 10 mg ev; ciproeptadina 12 mg per SNG, poi 2 mg ogni 2 h.'] }] },
          { etichetta: 'Rigidità, bradicinesia, esordio in giorni', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Sindrome neurolettica maligna', righe: ['Diazepam; liquidi; dantrolene 70–175 mg ev se grave; bromocriptina 2,5 mg ogni 8 h.'] }] },
        ],
      },
      { tipo: 'allarme', titolo: 'T > 41 °C o rigidità grave', righe: ['Raffreddamento, intubazione con rocuronio (no succinilcolina), rianimatore.'] },
    ],
  },
  'alcoli-tossici': {
    titolo: 'Algoritmo metanolo / glicole etilenico',
    nota: 'EXTRIP 2015. CAV per fomepizolo.',
    nodi: [
      { tipo: 'avvio', titolo: 'Acidosi con gap anionico alto non spiegata, o ingestione nota', righe: ['Disturbi visivi (metanolo); coma, convulsioni, rene (glicole).'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['EGA, gap anionico, lattati, chetoni, etanolemia', 'Osmolalità misurata → gap osmolare', 'Creatinina, Ca, sedimento urinario (ossalati)', 'CAV'] },
      { tipo: 'terapia', titolo: 'Bloccare l’alcol deidrogenasi', righe: ['Fomepizolo 1.050 mg ev in 30 min, poi 700 mg ogni 12 h.', 'Oppure etanolo ev (etanolemia 100–150 mg/dL).'] },
      { tipo: 'terapia', titolo: 'Associare', righe: ['Bicarbonato se pH < 7,30.', 'Metanolo: acido folinico 50 mg ogni 6 h. Glicole: tiamina 100 mg + piridossina 50 mg.'] },
      { tipo: 'decisione', titolo: 'Criteri per la dialisi?', righe: ['Coma, convulsioni, disturbi visivi; pH ≤ 7,15 o gap > 24; insufficienza renale.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Emodialisi urgente', righe: ['Fomepizolo ogni 4 h durante la dialisi.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Proseguire il blocco', righe: ['EGA ogni 2–4 h; ricovero.'] }] },
        ],
      },
    ],
  },
  organofosfati: {
    titolo: 'Algoritmo organofosfati',
    nota: 'AHA 2023.',
    nodi: [
      { tipo: 'avvio', titolo: 'Esposizione a insetticida, sindrome colinergica', righe: ['Miosi, broncorrea, bradicardia, fascicolazioni.'] },
      { tipo: 'allarme', titolo: 'Decontaminazione', righe: ['Spogliare (sacco chiuso), lavare con acqua e sapone; operatori protetti.'] },
      { tipo: 'terapia', titolo: 'Atropina', righe: ['1–2 mg ev, raddoppiare ogni 5 min fino a torace asciutto, FC > 80, PAS > 80.', 'Poi infusione 10–20% della dose totale/h.'] },
      { tipo: 'terapia', titolo: 'Pralidossima', righe: ['2 g ev in 30 min, poi ~ 500 mg/h (CAV).'] },
      { tipo: 'checklist', titolo: 'Inoltre', righe: ['Convulsioni: diazepam 10 mg', 'Intubazione con rocuronio, non succinilcolina', 'Forza dei muscoli del collo e respiratori (sindrome intermedia 24–96 h)', 'Rianimazione'] },
    ],
  },
  funghi: {
    titolo: 'Algoritmo funghi',
    nota: 'Conservare i resti per il micologo.',
    nodi: [
      { tipo: 'avvio', titolo: 'Sintomi dopo pasto con funghi', righe: ['Richiamare tutti i commensali.'] },
      { tipo: 'decisione', titolo: 'Latenza pasto → sintomi?' },
      {
        tipo: 'rami', rami: [
          { etichetta: '< 6 h', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Sindrome precoce', righe: ['Supporto (liquidi, antiemetico); muscarinica: atropina.', 'Ma: pasto misto o più pasti → trattare come tardiva.'] }] },
          {
            etichetta: '> 6 h', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Sospetta amanitina', righe: ['Ricovero e CAV anche se migliora.'] },
              { tipo: 'terapia', titolo: 'Terapia', righe: ['Liquidi, carbone 50 g ogni 4 h, silibinina 1.400 mg/die ev, NAC.', 'Transaminasi, INR, creatinina, glicemia ogni 12 h.'] },
              { tipo: 'esito', titolo: 'INR in salita o encefalopatia', righe: ['Centro trapianti di fegato (Pisa).'] },
            ],
          },
        ],
      },
    ],
  },
  vipera: {
    titolo: 'Algoritmo morso di vipera',
    nodi: [
      { tipo: 'avvio', titolo: 'Morso di serpente', righe: ['Immobilizzare l’arto; no laccio, incisione, ghiaccio.'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['Segnare la circonferenza dell’arto (ogni ora)', 'Emocromo, coagulazione, fibrinogeno, CK, creatinina, ECG', 'Profilassi antitetanica', 'CAV'] },
      { tipo: 'decisione', titolo: 'Grado?', righe: ['0 solo denti; 1 edema locale; 2 edema alla radice dell’arto o sintomi generali moderati; 3 oltre l’arto, shock, sanguinamento, sintomi neurologici.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: '0–1', tono: 'si', fine: 'Osservazione ≥ 12 h; dimissione se stabile', nodi: [] },
          { etichetta: '2–3', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Siero antivipera', righe: ['Prodotto e dose dal CAV; adrenalina pronta.', 'Ricovero; ripetere esami a 6 e 12 h.'] }] },
        ],
      },
    ],
  },
  'cianuro-fumi': {
    titolo: 'Algoritmo fumi d’incendio',
    nota: 'AHA 2023.',
    nodi: [
      { tipo: 'avvio', titolo: 'Esposizione a fumo in ambiente chiuso' },
      { tipo: 'terapia', titolo: 'Ossigeno 100%', righe: ['Maschera reservoir; COHb, lattati, EGA.'] },
      { tipo: 'decisione', titolo: 'Vie aeree a rischio?', righe: ['Ustioni del volto, stridore, voce rauca, fuliggine, edema.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Intubazione precoce', righe: ['Tubo ≥ 8; anestesista.'], vai: [{ etichetta: 'Sequenza rapida', to: '/procedure?apri=rsi' }] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Rivalutare spesso', righe: ['L’edema può progredire nelle prime 24 h.'] }] },
        ],
      },
      { tipo: 'decisione', titolo: 'Coma, ipotensione, arresto o lattati > 8?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Idrossocobalamina', righe: ['Cyanokit 5 g ev in 15 min, ripetibile; accesso dedicato.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'PDTA monossido', vai: [{ etichetta: 'Monossido di carbonio', to: '/linee-guida/monossido' }] }] },
        ],
      },
    ],
  },
}

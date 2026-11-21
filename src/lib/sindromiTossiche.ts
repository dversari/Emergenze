/*
 * Sindromi tossiche (toxidromi), approccio generale e indizi diagnostici.
 * Fonti: Goldfrank's Toxicologic Emergencies (11ª ed.), Lavonas et al. Circulation 2023 (AHA),
 * Dunkley et al. QJM 2003 (Hunter), Gurrera et al. J Clin Psychiatry 2011 (SNM), EXTRIP.
 * Dosi per adulto di 70 kg, coerenti con i PDTA dell'app.
 */

/** su = aumentato, giu = ridotto, norm = normale, var = variabile */
export type Freccia = 'su' | 'giu' | 'norm' | 'var'
export type Pupille = 'miosi' | 'midriasi' | 'normali'
export type Cute = 'sudata' | 'secca' | 'normale'
export type Icona = 'anticolinergico' | 'colinergico' | 'simpaticomimetico' | 'oppioide' | 'sedativo' | 'serotoninergico' | 'neurolettico' | 'astinenza'

export interface Link { etichetta: string; to: string }

export interface Sindrome {
  id: Icona
  nome: string
  /** l'immagine da ricordare, in una riga */
  breve: string
  segni: { pupille: Pupille; cute: Cute; temp: Freccia; fc: Freccia; pa: Freccia; fr: Freccia; peristalsi: Freccia; mente: string; muscoli: string }
  /** il segno che la distingue dalle altre */
  distintivo: string
  mnemonico?: { titolo: string; voci: string[] }
  chiave: string[]
  cause: string
  distinguere: string
  terapia: string[]
  pdta: Link[]
}

export const SINDROMI: Sindrome[] = [
  {
    id: 'anticolinergico',
    nome: 'Anticolinergica',
    breve: 'Caldo, secco, rosso, pupille dilatate, delirante',
    segni: { pupille: 'midriasi', cute: 'secca', temp: 'su', fc: 'su', pa: 'su', fr: 'norm', peristalsi: 'giu', mente: 'Delirium agitato, allucinazioni, afferra oggetti invisibili', muscoli: 'Mioclonie; globo vescicale' },
    distintivo: 'Ascelle asciutte, addome muto, globo',
    mnemonico: {
      titolo: 'La filastrocca',
      voci: ['Rosso come un peperone (vasodilatazione cutanea)', 'Secco come un osso (niente sudore, mucose asciutte)', 'Caldo come una stufa (ipertermia)', 'Cieco come una talpa (midriasi, visione offuscata)', 'Matto come un cappellaio (delirium)', 'Pieno come un fiasco (ritenzione urinaria)'],
    },
    chiave: [
      'Toccare l’ascella: asciutta = anticolinergica; bagnata = simpaticomimetica o serotoninergica.',
      'Peristalsi assente e globo vescicale completano il quadro.',
    ],
    cause: 'Antistaminici (difenidramina, prometazina, idrossizina), triciclici, antipsicotici (quetiapina, clorpromazina, olanzapina), antiparkinson (biperidene, triesifenidile), ossibutinina, scopolamina, atropina; piante (stramonio, belladonna, mandragora in erbe di campo o insalate contaminate).',
    distinguere: 'Simpaticomimetica (sudata), serotoninergica (clono, diarrea), colpo di calore, encefalite, astinenza.',
    terapia: [
      'Agitazione: diazepam (Valium) 10 mg ev (1 fiala da 10 mg/2 mL), ripetibile ogni 5–10 min.',
      'Raffreddamento; catetere vescicale se globo.',
      'Carbone attivo 50 g anche oltre 1 h (motilità rallentata), solo con vie aeree protette.',
      'QRS > 100 ms (triciclici, difenidramina): bicarbonato come nei triciclici.',
      'Fisostigmina (tramite CAV) solo nella forma pura con QRS stretto.',
      'Non sedare con antipsicotici o antistaminici.',
    ],
    pdta: [{ etichetta: 'Triciclici e bloccanti del sodio', to: '/linee-guida/triciclici' }, { etichetta: 'Delirium', to: '/linee-guida/delirium' }],
  },
  {
    id: 'colinergico',
    nome: 'Colinergica',
    breve: 'Bagnato da ogni orifizio, pupille a spillo, bradicardico',
    segni: { pupille: 'miosi', cute: 'sudata', temp: 'norm', fc: 'giu', pa: 'var', fr: 'giu', peristalsi: 'su', mente: 'Confusione, convulsioni, coma', muscoli: 'Fascicolazioni, debolezza fino alla paralisi' },
    distintivo: 'Secrezioni ovunque, fascicolazioni',
    mnemonico: {
      titolo: 'DUMBBELSS (funziona anche in italiano)',
      voci: ['Diarrea', 'Urinazione', 'Miosi', 'Bradicardia', 'Broncorrea', 'Broncospasmo', 'Emesi', 'Lacrimazione', 'Salivazione', 'Sudorazione'],
    },
    chiave: [
      'Le tre B che uccidono: bradicardia, broncorrea, broncospasmo.',
      'Effetti nicotinici (placca e gangli): fascicolazioni, debolezza, a volte tachicardia e midriasi. Non escludono la diagnosi.',
      'Odore di aglio o di solvente sui vestiti.',
    ],
    cause: 'Organofosfati e carbammati (insetticidi), gas nervini, funghi muscarinici (Inocybe, Clitocybe: esordio entro 2 h), neostigmina o piridostigmina in eccesso, pilocarpina.',
    distinguere: 'Oppioide (secco, senza secrezioni), edema polmonare, crisi miastenica o colinergica.',
    terapia: [
      'Decontaminazione prima di entrare: vestiti in sacco chiuso, acqua e sapone; operatori con guanti in nitrile e camice.',
      'Atropina 1–2 mg ev, raddoppiare ogni 5 min (2, 4, 8 mg…) fino a torace asciutto. La tachicardia non è un motivo per fermarsi.',
      'Pralidossima negli organofosfati (tramite CAV).',
      'Convulsioni: diazepam 10 mg ev. Intubazione con rocuronio, non succinilcolina.',
    ],
    pdta: [{ etichetta: 'Organofosfati e carbammati', to: '/linee-guida/organofosfati' }, { etichetta: 'Funghi', to: '/linee-guida/funghi' }],
  },
  {
    id: 'simpaticomimetico',
    nome: 'Simpaticomimetica',
    breve: 'Agitato, sudato, tachicardico, iperteso, pupille dilatate',
    segni: { pupille: 'midriasi', cute: 'sudata', temp: 'su', fc: 'su', pa: 'su', fr: 'su', peristalsi: 'norm', mente: 'Agitazione, paranoia, allucinazioni, convulsioni', muscoli: 'Tremore; rabdomiolisi' },
    distintivo: 'Come l’anticolinergica, ma bagnata',
    mnemonico: {
      titolo: 'Come l’anticolinergica, ma…',
      voci: ['… la cute è sudata', '… la peristalsi c’è', '… la vescica si svuota'],
    },
    chiave: [
      'La temperatura è il parametro che uccide: misurarla subito, centrale.',
      'Complicanze: SCA, dissezione aortica, emorragia cerebrale, convulsioni, aritmie, rabdomiolisi.',
    ],
    cause: 'Cocaina, anfetamine e metanfetamina, MDMA, catinoni sintetici, efedrina e pseudoefedrina. Quadro simile da teofillina e caffeina ad alte dosi.',
    distinguere: 'Anticolinergica (secca), serotoninergica (clono), astinenza, tireotossicosi, ipoglicemia, sepsi.',
    terapia: [
      'Benzodiazepine prima di tutto: diazepam (Valium) 10 mg ev ogni 5–10 min fino a sedazione; midazolam 5–10 mg im se senza accesso.',
      'T > 40 °C: raffreddamento aggressivo; se refrattaria intubare e curarizzare con rocuronio.',
      'Ipertensione residua: isosorbide dinitrato (Diniket) o urapidil (Ebrantil). Niente beta-bloccanti puri.',
      'QRS largo da cocaina: bicarbonato.',
    ],
    pdta: [{ etichetta: 'Cocaina e simpaticomimetici', to: '/linee-guida/simpaticomimetici' }, { etichetta: 'Colpo di calore', to: '/linee-guida/colpo-di-calore' }],
  },
  {
    id: 'oppioide',
    nome: 'Oppioide',
    breve: 'Coma, pupille a spillo, respiro lento',
    segni: { pupille: 'miosi', cute: 'normale', temp: 'giu', fc: 'giu', pa: 'giu', fr: 'giu', peristalsi: 'giu', mente: 'Sopore fino al coma', muscoli: 'Flaccido' },
    distintivo: 'Frequenza respiratoria bassa',
    mnemonico: { titolo: 'La triade', voci: ['Coma', 'Miosi puntiforme', 'FR < 12'] },
    chiave: [
      'La FR è il segno chiave: contarla per un minuto intero.',
      'Pupille non miotiche non lo escludono: tramadolo, petidina, ipossia, co-ingestioni.',
      'Tramadolo: anche convulsioni e sindrome serotoninergica. Metadone: QT lungo e durata lunga.',
    ],
    cause: 'Eroina, morfina, ossicodone, fentanil (anche cerotti), metadone, buprenorfina, tramadolo, codeina; ovuli ingeriti.',
    distinguere: 'Sedativi (FR quasi normale), emorragia pontina (miosi + coma), clonidina, ipoglicemia, ipercapnia.',
    terapia: [
      'Ventilare con pallone e ossigeno prima di tutto.',
      'Naloxone (Narcan 0,4 mg/1 mL): 1 fiala diluita in 10 mL, 1–2,5 mL (0,04–0,1 mg) ev ogni 2–3 min fino a FR ≥ 10. Apnea: 1 fiala (0,4 mg) ev o im.',
      'Il naloxone dura 30–90 min: osservazione 2–4 h, più a lungo con metadone e rilascio prolungato.',
    ],
    pdta: [{ etichetta: 'Oppioidi e benzodiazepine', to: '/linee-guida/oppioidi-benzodiazepine' }],
  },
  {
    id: 'sedativo',
    nome: 'Sedativo-ipnotica',
    breve: 'Addormentato con parametri quasi normali',
    segni: { pupille: 'normali', cute: 'normale', temp: 'norm', fc: 'norm', pa: 'norm', fr: 'norm', peristalsi: 'norm', mente: 'Sopore, disartria, atassia, nistagmo', muscoli: 'Ipotonia, iporeflessia' },
    distintivo: 'Sembra ubriaco, parametri normali',
    mnemonico: { titolo: 'Sembra ubriaco', voci: ['Parla impastato', 'Cammina male', 'Si riaddormenta se non lo stimoli'] },
    chiave: [
      'Le benzodiazepine da sole deprimono poco il respiro: se la FR è bassa cercare oppioidi, alcol o altri sedativi.',
      'GHB/GBL: coma profondo con risveglio brusco dopo poche ore, spesso agitato.',
      'Barbiturici e baclofene: coma lungo, ipotermia.',
    ],
    cause: 'Benzodiazepine, zolpidem e zopiclone, alcol, barbiturici, GHB/GBL, baclofene, gabapentin e pregabalin, antistaminici sedativi.',
    distinguere: 'Oppioide (FR bassa, miosi), ipoglicemia, trauma cranico, encefalopatia, stato di male non convulsivo, fase post-critica.',
    terapia: [
      'Supporto: vie aeree, posizione, glicemia, temperatura.',
      'Flumazenil quasi mai: convulsioni negli abituali e con i triciclici. Solo per sedazione iatrogena in paziente non abituato.',
      'Cercare co-ingestioni: paracetamolemia ed etanolemia.',
    ],
    pdta: [{ etichetta: 'Oppioidi e benzodiazepine', to: '/linee-guida/oppioidi-benzodiazepine' }],
  },
  {
    id: 'serotoninergico',
    nome: 'Serotoninergica',
    breve: 'Clono, agitazione, diarrea, febbre: in poche ore',
    segni: { pupille: 'midriasi', cute: 'sudata', temp: 'su', fc: 'su', pa: 'su', fr: 'su', peristalsi: 'su', mente: 'Agitazione, ansia, confusione', muscoli: 'Clono (inducibile, oculare), iperreflessia agli arti inferiori, tremore' },
    distintivo: 'Clono, soprattutto alle caviglie',
    mnemonico: {
      titolo: 'Criteri di Hunter (con farmaco serotoninergico)',
      voci: ['Clono spontaneo', 'Clono inducibile + agitazione o sudorazione', 'Clono oculare + agitazione o sudorazione', 'Tremore + iperreflessia', 'Ipertonia + T > 38 °C + clono oculare o inducibile'],
    },
    chiave: [
      'Esordio rapido, di solito entro 6–24 h da un aumento di dose o da un’associazione.',
      'I segni prevalgono agli arti inferiori: cercare il clono alla caviglia.',
    ],
    cause: 'SSRI, SNRI, tramadolo, fentanil, linezolid, MDMA, IMAO, litio, triptani, blu di metilene, destrometorfano.',
    distinguere: 'Neurolettica maligna (rigida, lenta, giorni), anticolinergica (secca, addome muto), simpaticomimetica, ipertermia maligna.',
    terapia: [
      'Sospendere i serotoninergici; liquidi; raffreddamento.',
      'Diazepam (Valium) 10 mg ev, ripetibile ogni 10 min.',
      'Ciproeptadina (Periactin cp 4 mg) 12 mg (3 cp) per bocca o SNG, poi 2 mg ogni 2 h se persiste.',
      'T > 41 °C: intubazione e curaro non depolarizzante. Niente antipiretici, niente contenzione.',
    ],
    pdta: [{ etichetta: 'Serotoninergica e neurolettica maligna', to: '/linee-guida/serotoninergica-snm' }],
  },
  {
    id: 'neurolettico',
    nome: 'Neurolettica maligna',
    breve: 'Rigido, febbrile, confuso: in giorni',
    segni: { pupille: 'normali', cute: 'sudata', temp: 'su', fc: 'su', pa: 'var', fr: 'su', peristalsi: 'norm', mente: 'Confusione, mutismo, stupor', muscoli: 'Rigidità «a tubo di piombo», bradicinesia, iporeflessia' },
    distintivo: 'Rigidità a tubo di piombo, CK alta',
    mnemonico: { titolo: 'FEVER', voci: ['Febbre', 'Encefalopatia', 'Vitali instabili (pressione labile)', 'Enzimi alti (CK)', 'Rigidità'] },
    chiave: [
      'Esordio lento (giorni) dopo l’inizio o l’aumento di un antipsicotico, o la sospensione brusca di levodopa.',
      'CK molto alta e leucocitosi; rischio di rabdomiolisi e insufficienza renale.',
    ],
    cause: 'Aloperidolo e antipsicotici (anche di nuova generazione), metoclopramide, prometazina; sospensione di farmaci dopaminergici.',
    distinguere: 'Serotoninergica (clono, rapida), ipertermia maligna (anestesia), meningoencefalite, catatonia, colpo di calore.',
    terapia: [
      'Sospendere l’antipsicotico; liquidi, raffreddamento, diazepam.',
      'Moderata–grave: dantrolene (Dantrium flaconi 20 mg) 1–2,5 mg/kg = 70–175 mg ev (4–9 flaconi); bromocriptina 2,5 mg ogni 8 h per SNG.',
      'CK e creatinina seriate; rianimatore se T > 41 °C o rigidità grave.',
    ],
    pdta: [{ etichetta: 'Serotoninergica e neurolettica maligna', to: '/linee-guida/serotoninergica-snm' }, { etichetta: 'Rabdomiolisi', to: '/linee-guida/rabdomiolisi' }],
  },
  {
    id: 'astinenza',
    nome: 'Astinenza',
    breve: 'Tremore, sudore, tachicardia, allucinazioni: manca la sostanza',
    segni: { pupille: 'midriasi', cute: 'sudata', temp: 'su', fc: 'su', pa: 'su', fr: 'su', peristalsi: 'su', mente: 'Ansia, insonnia, allucinazioni, delirium', muscoli: 'Tremore, convulsioni (alcol, benzodiazepine)' },
    distintivo: 'Tremore e anamnesi di sospensione',
    mnemonico: {
      titolo: 'Il contrario della sostanza',
      voci: [
        'Sedativi (alcol, benzodiazepine, GHB, baclofene) → iperattivazione, convulsioni, delirium: può uccidere.',
        'Oppioidi → sbadigli, rinorrea, lacrimazione, piloerezione, crampi, diarrea, midriasi; coscienza integra, di per sé non pericolosa per la vita.',
      ],
    },
    chiave: [
      'Alcol: tremori 6–24 h, convulsioni 12–48 h, delirium tremens 48–96 h dall’ultimo bicchiere.',
      'Sospensione del baclofene intratecale (pompa): emergenza, con ipertermia e rabdomiolisi.',
    ],
    cause: 'Alcol, benzodiazepine, barbiturici, GHB, baclofene; oppioidi.',
    distinguere: 'Simpaticomimetica, tireotossicosi, sepsi, encefalopatia di Wernicke, ipoglicemia.',
    terapia: [
      'Diazepam (Valium) 10–20 mg ev lento o per bocca ogni 1–2 h finché CIWA-Ar < 10.',
      'Tiamina (Benerva) prima del glucosio: 100–200 mg ev; 500 mg ev 3 volte al giorno se sospetto Wernicke.',
      'Astinenza da oppioidi: terapia sintomatica (antiemetico, loperamide); il SerD per la terapia sostitutiva.',
    ],
    pdta: [{ etichetta: 'Astinenza alcolica', to: '/linee-guida/astinenza-alcolica' }],
  },
]

export const APPROCCIO: { titolo: string; testo: string }[] = [
  { titolo: 'ABC, glicemia, temperatura', testo: 'Glicemia capillare in tutti; temperatura centrale se agitato. Coma con FR bassa e miosi: naloxone. Alcolista o malnutrito: tiamina prima del glucosio.' },
  { titolo: 'ECG a 12 derivazioni, ripetuto', testo: 'QRS > 100 ms o R in aVR > 3 mm: bicarbonato. QTc lungo: magnesio, correggere K. Bradicardie e blocchi: beta-bloccanti, calcio-antagonisti, digossina.' },
  { titolo: 'Riconoscere la sindrome tossica', testo: 'Pupille, cute (toccare l’ascella), temperatura, peristalsi, muscoli e riflessi: vedi le schede qui sotto.' },
  { titolo: 'Decontaminare solo se serve', testo: 'Carbone attivo 50 g per bocca o SNG entro 1 h (anche oltre per rilascio prolungato o anticolinergici), solo con vie aeree protette. Non lega alcoli, ferro, litio, metalli, caustici, idrocarburi. Irrigazione intestinale totale (macrogol 1,5–2 L/h per SNG) per rilascio prolungato, ferro, litio, ovuli. Lavanda gastrica quasi mai, vomito indotto mai.' },
  { titolo: 'Esami', testo: 'In ogni ingestione volontaria: paracetamolemia (a 4 h dall’assunzione) ed etanolemia; test di gravidanza nelle donne in età fertile. EGA con gap anionico, lattati, CK, creatinina, K; osmolalità se sospetti alcoli tossici; dosaggi specifici (digossina, litio, valproato, carbamazepina, salicilati).' },
  { titolo: 'Antidoto, CAV, osservazione', testo: 'Al CAV: nome commerciale, dose, ora, peso, sintomi, ECG. Dializzabili: litio, salicilati, metanolo e glicole etilenico, metformina con acidosi lattica, valproato, teofillina. Gesto volontario: valutazione psichiatrica quando stabile.' },
]

export const INDIZI: { titolo: string; voci: { segno: string; pensa: string; to?: string }[] }[] = [
  {
    titolo: 'Pupille',
    voci: [
      { segno: 'Miosi', pensa: 'Oppioidi, colinergici, clonidina, antipsicotici; emorragia pontina' },
      { segno: 'Midriasi', pensa: 'Anticolinergici, simpaticomimetici, serotoninergici, astinenza; anossia' },
    ],
  },
  {
    titolo: 'Odore',
    voci: [
      { segno: 'Mandorle amare', pensa: 'Cianuro (non tutti lo sentono)', to: '/linee-guida/cianuro-fumi' },
      { segno: 'Aglio', pensa: 'Organofosfati, arsenico', to: '/linee-guida/organofosfati' },
      { segno: 'Acetone, fruttato', pensa: 'Chetoacidosi, isopropanolo' },
      { segno: 'Menta (gaultheria)', pensa: 'Salicilato di metile', to: '/linee-guida/salicilati' },
      { segno: 'Uova marce', pensa: 'Idrogeno solforato' },
    ],
  },
  {
    titolo: 'ECG',
    voci: [
      { segno: 'QRS largo, R in aVR', pensa: 'Bloccanti del sodio: triciclici, flecainide, propafenone, cocaina, difenidramina, carbamazepina', to: '/linee-guida/triciclici' },
      { segno: 'QTc lungo', pensa: 'Antipsicotici, metadone, citalopram ed escitalopram, antiaritmici, macrolidi' },
      { segno: 'Bradicardia, BAV', pensa: 'Beta-bloccanti, calcio-antagonisti, digossina, clonidina, organofosfati', to: '/linee-guida/betabloccanti-calcioantagonisti' },
      { segno: 'TV bidirezionale, tachicardia atriale con blocco', pensa: 'Digossina', to: '/linee-guida/digossina' },
    ],
  },
  {
    titolo: 'Emogas e laboratorio',
    voci: [
      { segno: 'Gap anionico alto + gap osmolare', pensa: 'Metanolo, glicole etilenico', to: '/linee-guida/alcoli-tossici' },
      { segno: 'Alcalosi respiratoria + acidosi metabolica', pensa: 'Salicilati', to: '/linee-guida/salicilati' },
      { segno: 'Lattati molto alti', pensa: 'Cianuro (fumi d’incendio), metformina, ferro, convulsioni', to: '/linee-guida/cianuro-fumi' },
      { segno: 'SpO₂ bassa con PaO₂ normale, sangue color cioccolato', pensa: 'Metaemoglobinemia (dapsone, nitriti e «poppers», anestetici locali): blu di metilene tramite CAV' },
      { segno: 'SpO₂ normale, COHb alta', pensa: 'Monossido di carbonio', to: '/linee-guida/monossido' },
      { segno: 'Ipoglicemia', pensa: 'Insulina, sulfaniluree (lunga durata), alcol, salicilati, beta-bloccanti' },
      { segno: 'Iperglicemia', pensa: 'Calcio-antagonisti (indice di gravità), teofillina' },
      { segno: 'Ipokaliemia', pensa: 'Teofillina, caffeina, beta-agonisti' },
      { segno: 'Iperkaliemia', pensa: 'Digossina (in acuto, prognostica), beta-bloccanti' },
    ],
  },
]

export const sindrome = (id: string) => SINDROMI.find((s) => s.id === id)

/** Sindromi da funghi, per latenza fra pasto e primi sintomi. Fonti: CAV, Goldfrank 11ª ed., Diaz, Crit Care Med 2005. */
export interface SindromeFungo { nome: string; latenza: string; funghi: string; quadro: string; ps: string; breve: boolean; to?: string }

export const SINDROMI_FUNGHI: SindromeFungo[] = [
  { breve: true, nome: 'Gastroenterica', latenza: '30 min – 3 h', funghi: 'Molte specie non commestibili (Entoloma, Boletus satanas, Agaricus xanthodermus, Omphalotus); commestibili crudi, poco cotti o avariati.', quadro: 'Nausea, vomito, diarrea, crampi. La più frequente.', ps: 'Liquidi, elettroliti, antiemetico. Osservazione.' },
  { breve: true, nome: 'Muscarinica (sudoriana)', latenza: '15 min – 2 h', funghi: 'Inocybe, Clitocybe (muscarina).', quadro: 'Sindrome colinergica: sudorazione profusa, lacrimazione, scialorrea, miosi, bradicardia, broncorrea, vomito, diarrea.', ps: 'Atropina 1 mg ev ripetibile fino a torace asciutto e FC > 60.', to: '/linee-guida/tossicologia?apri=colinergico' },
  { breve: true, nome: 'Panterinica', latenza: '30 min – 3 h', funghi: 'Amanita pantherina, A. muscaria (acido ibotenico, muscimolo).', quadro: 'Alternanza di agitazione, confusione, allucinazioni e sopore; atassia, mioclonie, raramente convulsioni. Nonostante il vecchio nome «micoatropinica» non è anticolinergica.', ps: 'Supporto; diazepam per agitazione o convulsioni. Niente atropina né fisostigmina.' },
  { breve: true, nome: 'Psicotropa', latenza: '30 min – 2 h', funghi: 'Psilocybe, Panaeolus (psilocibina).', quadro: 'Allucinazioni visive, distorsioni percettive, ansia, midriasi, tachicardia. Spesso uso voluto.', ps: 'Ambiente tranquillo; diazepam se agitato. Si risolve in 4–6 h.' },
  { breve: true, nome: 'Coprinica (effetto antabuse)', latenza: '15–30 min dall’alcol', funghi: 'Coprinopsis (Coprinus) atramentaria (coprina) + alcol.', quadro: 'Compare se si beve alcol fino a 3 giorni dopo il pasto. Vampate al volto e al tronco, cefalea pulsante, palpitazioni, ipotensione, nausea.', ps: 'Supporto, liquidi; niente alcol per 3 giorni. Forme gravi: CAV.' },
  { breve: true, nome: 'Paxillica', latenza: '1–3 h', funghi: 'Paxillus involutus, dopo consumi ripetuti.', quadro: 'Gastroenterica seguita da emolisi immunomediata e insufficienza renale.', ps: 'Emocromo, LDH, aptoglobina, Coombs, creatinina; ricovero se emolisi.' },
  { breve: false, nome: 'Falloidea', latenza: '6–24 h (talvolta fino a 40 h)', funghi: 'Amanita phalloides, A. verna, A. virosa; Lepiota piccole; Galerina marginata (amatossine).', quadro: 'Diarrea coleriforme e vomito, poi falsa remissione (giorno 2), poi epatite acuta fino all’insufficienza epatica fulminante (giorni 3–5).', ps: 'Ricovero e CAV anche se migliora: liquidi, carbone ripetuto, silibinina, NAC; INR in salita → trapianti (Pisa).', to: '/linee-guida/funghi' },
  { breve: false, nome: 'Orellanica', latenza: '2–20 giorni (in genere 3–4)', funghi: 'Cortinarius orellanus, C. rubellus (orellanina).', quadro: 'Sete, poliuria o oliguria, dolore lombare, poi insufficienza renale acuta tubulo-interstiziale.', ps: 'Creatinina ed esame urine in tutti i commensali; nefrologo, dialisi. Nessun antidoto.' },
  { breve: false, nome: 'Giromitrica', latenza: '6–24 h', funghi: 'Gyromitra esculenta (giromitrina → monometilidrazina).', quadro: 'Gastroenterica, poi vertigini, atassia, convulsioni; possibile danno epatico, emolisi, metaemoglobinemia.', ps: 'Convulsioni: diazepam; se refrattarie piridossina 70 mg/kg ev (max 5 g) tramite CAV.' },
  { breve: false, nome: 'Rabdomiolitica', latenza: '24–72 h, dopo pasti ripetuti', funghi: 'Tricholoma equestre (moscatella gialla), Russula subnigricans.', quadro: 'Mialgie, debolezza, urine scure; CK molto alta; possibile miocardite e insufficienza renale.', ps: 'CK, creatinina, K, troponina; liquidi come nella rabdomiolisi.', to: '/linee-guida/rabdomiolisi' },
]

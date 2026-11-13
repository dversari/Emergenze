/*
 * PDTA chirurgici addominali, toracici, ipertensione e neurologici. Dosi per adulto di 70 kg.
 */
import type { LineaGuida } from '../lineeGuida'
import type { Nodo } from '../algoritmi'

type Alg = Record<string, { titolo: string; nota?: string; nodi: Nodo[] }>
const OGGI = '2026-11-13'

export const LG_ADDOME_TORACE_NEURO: LineaGuida[] = [
  {
    id: 'occlusione-intestinale',
    titolo: 'Occlusione intestinale',
    ente: 'WSES',
    anno: 2018,
    area: 'Gastroenterologia · Chirurgia',
    fonte: { etichetta: 'Ten Broek et al., World J Emerg Surg 2018 (Bologna, occlusione da aderenze)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=ten+Broek+Bologna+guidelines+adhesive+small+bowel+obstruction+2018' },
    controllata: OGGI,
    inBreve: [
      'Dolore crampiforme, vomito, alvo chiuso a feci e gas, distensione. Cause: aderenze (pregressa chirurgia), ernie (controllare sempre le porte erniarie), neoplasie del colon, volvolo.',
      'TC addome con contrasto ev: sede, causa, segni di sofferenza (parete che non prende contrasto, pneumatosi, liquido libero, vortice del mesentere, ansa chiusa).',
      'Strangolamento (chirurgia urgente): febbre, tachicardia, dolore continuo, peritonismo, leucocitosi, lattati alti, segni TC di ischemia o ansa chiusa.',
      'Da aderenze senza segni di sofferenza: trattamento conservativo (SNG, digiuno, liquidi) + mezzo di contrasto idrosolubile (Gastrografin) diagnostico-terapeutico.',
      'Ernia incarcerata: tentare la riduzione solo se < 6 h e senza segni d’ischemia; altrimenti chirurgo.',
      'Volvolo del sigma: detorsione endoscopica se senza ischemia/perforazione; poi chirurgo.',
    ],
    sezioni: [
      {
        titolo: 'Terapia',
        punti: [
          'SNG in aspirazione se vomito/distensione; digiuno; cristalloidi 1–2 L, poi secondo bilancio; correggere K e Mg.',
          'Analgesia: morfina 2–4 mg ev ripetibile o paracetamolo 1 g; antiemetico (metoclopramide controindicata se occlusione meccanica completa: preferire ondansetron 4–8 mg).',
          'Gastrografin 100 mL per SNG (clampare 2–3 h), RX addome a 8–24 h: contrasto nel colon = risoluzione probabile.',
          'Antibiotico solo se segni di ischemia/perforazione (vedi peritonite).',
        ],
      },
    ],
    aggiornamenti: [{ data: '2018-01-01', testo: 'WSES (Bologna) 2017/2018: gestione non operativa fino a 72 h se senza strangolamento, con contrasto idrosolubile.' }],
  },
  {
    id: 'ischemia-mesenterica',
    titolo: 'Ischemia mesenterica acuta',
    ente: 'ESVS · WSES',
    anno: 2022,
    area: 'Gastroenterologia · Chirurgia',
    fonte: { etichetta: 'Bala et al., World J Emerg Surg 2022 (WSES, ischemia mesenterica)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Bala+acute+mesenteric+ischemia+WSES+2022' },
    controllata: OGGI,
    approfondimenti: [{ etichetta: 'ESVS 2017: malattie dell’arteria mesenterica', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Bjorck+ESVS+2017+mesenteric+arterial+disease' }],
    vediAnche: [{ etichetta: 'Fibrillazione atriale', to: '/linee-guida/fibrillazione-atriale' }, { etichetta: 'Rubrica: chirurgia vascolare', to: '/rubrica' }],
    inBreve: [
      'Dolore addominale intenso e sproporzionato all’esame obiettivo in anziano con FA, vasculopatia, scompenso, bassa portata (o trombofilia per la forma venosa).',
      'Lattati e D-dimero non bastano: lattati normali non escludono; D-dimero normale la rende improbabile.',
      'Angio-TC addome (fase arteriosa e venosa) subito, senza aspettare la creatinina.',
      'Eparina non frazionata appena posta la diagnosi; antibiotico ad ampio spettro; liquidi.',
      'Chirurgo generale e vascolare insieme: rivascolarizzazione (endovascolare o aperta) e resezione dell’intestino non vitale; second look.',
      'Forma non occlusiva (shock, vasopressori, dialisi): migliorare la portata, ridurre i vasocostrittori.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Eparina non frazionata 5.000 UI ev in bolo (80 UI/kg), poi 18 UI/kg/h ≈ 1.250 UI/h; aPTT 1,5–2,5 volte.',
          'Piperacillina/tazobactam 4,5 g ev ogni 6 h (allergia: vedi antibiotici, peritonite).',
          'Cristalloidi per perfusione; noradrenalina se necessario (evitare alte dosi).',
        ],
      },
    ],
    aggiornamenti: [{ data: '2022-11-01', testo: 'WSES 2022: angio-TC immediata nel sospetto; approccio combinato endovascolare/chirurgico.' }],
  },
  {
    id: 'cirrosi-scompensata',
    titolo: 'Cirrosi scompensata ed encefalopatia epatica',
    ente: 'EASL',
    anno: 2022,
    area: 'Gastroenterologia',
    fonte: { etichetta: 'EASL Clinical Practice Guidelines on hepatic encephalopathy, J Hepatol 2022', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=EASL+clinical+practice+guidelines+hepatic+encephalopathy+2022' },
    controllata: OGGI,
    approfondimenti: [{ etichetta: 'EASL 2018: cirrosi scompensata', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=EASL+clinical+practice+guidelines+decompensated+cirrhosis+2018' }],
    vediAnche: [
      { etichetta: 'Emorragia digestiva (varici)', to: '/linee-guida/emorragia-digestiva' },
      { etichetta: 'Paracentesi', to: '/procedure?apri=paracentesi' },
      { etichetta: 'Peritonite batterica spontanea', to: '/antibiotici?apri=pbs' },
    ],
    inBreve: [
      'Cirrotico che peggiora: cercare sempre infezione (PBS: paracentesi diagnostica in tutti con ascite), sanguinamento digestivo, insufficienza renale, elettroliti, farmaci (sedativi, diuretici), stipsi, alcol.',
      'Encefalopatia: diagnosi clinica (West Haven 1–4, asterixis); l’ammoniemia serve solo a escluderla se normale.',
      'Glicemia sempre; TC encefalo se trauma, deficit focale o primo episodio.',
      'Grado 3–4: protezione delle vie aeree, rianimazione.',
      'Insufficienza renale acuta: sospendere diuretici, FANS, nefrotossici; albumina per 2 giorni; se non risponde e criteri di sindrome epatorenale: terlipressina + albumina.',
      'Ascite tesa che dà dispnea o dolore: paracentesi evacuativa con albumina.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Lattulosio sciroppo 25 mL ogni 1–2 h per bocca/SNG fino a 2 evacuazioni morbide, poi titolare per 2–3 al giorno; se non può bere: clistere con 300 mL di lattulosio in 700 mL d’acqua.',
          'Rifaximina 550 mg ogni 12 h (o 400 mg ogni 8 h) in aggiunta.',
          'Albumina 20% 1 g/kg = 70 g ev (350 mL) al giorno per 2 giorni nell’insufficienza renale acuta.',
          'Sindrome epatorenale: terlipressina (Glypressin 1 mg) 1 mg ev ogni 4–6 h (o infusione 2 mg/24 h) + albumina 20–40 g/die.',
          'Paracentesi > 5 L: albumina 8 g per litro rimosso.',
          'Tiamina 100 mg se alcol; evitare benzodiazepine (se astinenza: lorazepam o oxazepam a basse dosi).',
        ],
      },
    ],
    aggiornamenti: [{ data: '2022-07-01', testo: 'EASL 2022: lattulosio prima linea, rifaximina in aggiunta; ricercare e trattare i fattori precipitanti.' }],
  },
  {
    id: 'caustici-corpi-estranei',
    cav: true,
    titolo: 'Caustici e corpi estranei ingeriti',
    ente: 'ESGE · WSES',
    anno: 2016,
    area: 'Gastroenterologia',
    fonte: { etichetta: 'Birk et al., Endoscopy 2016 (ESGE, corpi estranei)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Birk+removal+of+foreign+bodies+upper+gastrointestinal+tract+ESGE+2016' },
    controllata: OGGI,
    approfondimenti: [{ etichetta: 'Chirica et al., World J Emerg Surg 2019 (WSES, ingestione di caustici)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Chirica+caustic+ingestion+WSES+2019' }],
    vediAnche: [{ etichetta: 'Rubrica: Tossicologia', to: '/rubrica' }, { etichetta: 'Rubrica: Endoscopia', to: '/rubrica' }],
    inBreve: [
      'Caustici: niente vomito indotto, niente neutralizzanti, niente carbone, niente SNG alla cieca; acqua solo a piccoli sorsi se deglutisce. CAV per il prodotto.',
      'Caustici: vie aeree prima (stridore, disfonia, edema → intubazione con fibroscopio, anestesista/ORL). TC torace-addome con contrasto per perforazione/necrosi; endoscopia entro 12–24 h per la gravità.',
      'Bolo alimentare con ostruzione completa (non deglutisce la saliva): endoscopia urgente entro 6 h; altrimenti entro 24 h.',
      'Batteria a bottone in esofago, oggetti appuntiti in esofago, ostruzione completa: endoscopia emergente (entro 2–6 h). Due o più magneti: endoscopia urgente anche se in stomaco.',
      'Oggetti piccoli e smussi oltre l’esofago, asintomatico: di solito transitano; controllo clinico/RX.',
      'RX collo-torace-addome per i corpi radiopachi; TC se sospetta perforazione o non radiopaco con sintomi.',
    ],
    sezioni: [
      {
        titolo: 'Gestione',
        punti: [
          'Caustici gravi (sangue, perforazione, shock, acidosi): chirurgo; inibitore di pompa ev (pantoprazolo 40 mg) e digiuno.',
          'Bolo alimentare: il glucagone ha scarsa efficacia, non deve ritardare l’endoscopia.',
          'Body packer: vedi cocaina e simpaticomimetici.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2016-02-01', testo: 'ESGE 2016: tempi dell’endoscopia per corpi estranei (emergente, urgente, differita).' }],
  },
  {
    id: 'pneumotorace',
    titolo: 'Pneumotorace spontaneo',
    ente: 'BTS',
    anno: 2023,
    area: 'Pneumologia',
    fonte: { etichetta: 'Roberts et al., Thorax 2023 (BTS, malattie pleuriche)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Roberts+British+Thoracic+Society+guideline+pleural+disease+2023' },
    controllata: OGGI,
    vediAnche: [
      { etichetta: 'Decompressione', to: '/procedure?apri=decompressione' },
      { etichetta: 'Pigtail', to: '/procedure?apri=pigtail' },
      { etichetta: 'Tubo toracico', to: '/procedure?apri=tubo' },
      { etichetta: 'Ecografia polmonare', to: '/procedure' },
    ],
    inBreve: [
      'Iperteso (ipotensione, ipossia grave, deviazione tracheale): decompressione subito, senza attendere l’imaging.',
      'Primario (giovane, polmone sano), pochi sintomi: gestione conservativa possibile qualunque sia la dimensione (BTS 2023), con controllo a 2–4 settimane.',
      'Primario sintomatico: aspirazione con ago o drenaggio piccolo (pigtail) o dispositivo ambulatoriale; se l’aspirazione fallisce → drenaggio.',
      'Secondario (BPCO, fibrosi, > 50 anni fumatore): quasi sempre drenaggio piccolo e ricovero; pneumologo.',
      'Dopo la risoluzione: niente voli per 1 settimana dalla riespansione confermata; niente immersioni subacquee per sempre (salvo chirurgia); smettere di fumare.',
      'Persistente perdita d’aria > 48 h o recidiva: chirurgo toracico (Careggi).',
    ],
    sezioni: [
      {
        titolo: 'Dettagli',
        punti: [
          'Dimensione: distanza interpleurica all’ilo ≥ 2 cm = «grande» (ma oggi decidono i sintomi).',
          'Aspirazione: ago 16–18 G, 2° spazio emiclaveare o 4°–5° ascellare, fino a 2,5 L; RX dopo.',
          'Drenaggio: 8–14 Fr Seldinger, sotto acqua, senza aspirazione all’inizio (rischio edema da riespansione).',
          'Ossigeno ad alti flussi accelera il riassorbimento (attenzione nei BPCO ipercapnici).',
        ],
      },
    ],
    aggiornamenti: [{ data: '2023-07-01', testo: 'BTS 2023: gestione conservativa del primario poco sintomatico; dispositivi ambulatoriali; meno enfasi sulla dimensione.' }],
  },
  {
    id: 'emottisi',
    titolo: 'Emottisi massiva',
    ente: 'Letteratura · ERS',
    anno: 2023,
    area: 'Pneumologia',
    fonte: { etichetta: 'PubMed: massive hemoptysis management review', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=massive+hemoptysis+management+review' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Sequenza rapida', to: '/procedure?apri=rsi' }, { etichetta: 'Anticoagulato che sanguina', to: '/linee-guida/anticoagulato-sanguinamento' }, { etichetta: 'Rubrica: radiologia interventistica', to: '/rubrica' }],
    inBreve: [
      'Pericolosa per asfissia, non per anemia: > 100–200 mL in 24 h, o qualunque quantità con insufficienza respiratoria o instabilità.',
      'Escludere origine dal naso/faringe (epistassi posteriore) o dal tubo digerente (ematemesi).',
      'Paziente sdraiato sul lato che sanguina (se noto); ossigeno; aspirazione; due accessi; gruppo, coagulazione.',
      'Intubazione con tubo largo (≥ 8, per la broncoscopia) se non protegge le vie aeree; eventuale intubazione selettiva del bronco del polmone sano.',
      'Angio-TC torace: sede e arterie bronchiali → embolizzazione (radiologo interventista di Careggi o Torregalli a seconda della fascia oraria).',
      'Broncoscopia (pneumologo) per localizzare e tamponare; chirurgo toracico (Careggi) se fallisce.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Acido tranexamico 1 g ev (2 fiale da 500 mg) in 10 min, poi 1 g in 8 h; oppure nebulizzato 500 mg ogni 8 h.',
          'Correggere la coagulazione (anticoagulanti: antidoti; piastrine se < 50.000).',
          'Tosse: codeina o morfina a basse dosi se non compromette la ventilazione.',
        ],
      },
    ],
    aggiornamenti: [{ data: OGGI, testo: 'Aggiunto: protezione delle vie aeree, angio-TC ed embolizzazione.' }],
  },
  {
    id: 'angioedema',
    titolo: 'Angioedema senza orticaria (bradichininico)',
    ente: 'WAO/EAACI',
    anno: 2021,
    area: 'Allergologia · Emergenze',
    fonte: { etichetta: 'Maurer et al., Allergy 2022 (WAO/EAACI, angioedema ereditario)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Maurer+WAO+EAACI+guideline+hereditary+angioedema+2021' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Anafilassi', to: '/linee-guida/anafilassi' }, { etichetta: 'Cricotirotomia', to: '/procedure?apri=crico' }],
    inBreve: [
      'Due meccanismi. Istaminico: orticaria, prurito, rapido → percorso anafilassi (adrenalina). Bradichininico: senza orticaria né prurito, più lento (ore), non risponde ad adrenalina, cortisone, antistaminici.',
      'Bradichininico: ACE-inibitori (anche dopo anni), sacubitril, gliptine, alteplase; angioedema ereditario (familiarità, episodi addominali); acquisito (linfomi).',
      'Vie aeree: voce, stridore, disfagia, lingua/pavimento orale. Laringoscopia (ORL) precoce; se peggiora intubazione da sveglio con fibroscopio, anestesista; prepararsi alla cricotirotomia.',
      'Edema solo di labbra/viso senza segni di vie aeree: osservazione 6–12 h (24 h se lingua/pavimento).',
      'Sospendere per sempre l’ACE-inibitore (e non passare al sacubitril; sartani con cautela).',
      'Angioedema ereditario: C1-inibitore o icatibant subito.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'In dubbio sul meccanismo: adrenalina 0,5 mg im comunque (non nuoce).',
          'Angioedema ereditario: C1-inibitore (Berinert 500 UI) 20 UI/kg = 1.500 UI ev (3 flaconi); oppure icatibant (Firazyr 30 mg) 30 mg sc.',
          'Da ACE-inibitori: icatibant e C1-inibitore con evidenze deboli; plasma fresco congelato 2 unità se grave e non disponibili.',
          'Acido tranexamico 1 g ev: opzione con evidenza debole.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2022-07-01', testo: 'WAO/EAACI 2021: terapia degli attacchi con C1-inibitore, icatibant o ecallantide; il prima possibile.' }],
  },
  {
    id: 'emergenza-ipertensiva',
    titolo: 'Emergenza ipertensiva',
    ente: 'ESC',
    anno: 2024,
    area: 'Cardiologia',
    fonte: { etichetta: 'McEvoy et al., Eur Heart J 2024 (ESC, pressione arteriosa)', url: 'https://doi.org/10.1093/eurheartj/ehae178' },
    controllata: OGGI,
    approfondimenti: [{ etichetta: 'van den Born et al., Eur Heart J Cardiovasc Pharmacother 2019 (ESC, emergenze ipertensive)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=van+den+Born+ESC+position+document+hypertensive+emergencies+2019' }],
    vediAnche: [
      { etichetta: 'Dimissione: pressione alta', to: '/dimissioni' },
      { etichetta: 'Aorta acuta', to: '/linee-guida/dissezione-aortica' },
      { etichetta: 'Scompenso / EPA', to: '/linee-guida/scompenso-cardiaco' },
      { etichetta: 'Preeclampsia', to: '/linee-guida/preeclampsia' },
    ],
    inBreve: [
      'Emergenza = pressione molto alta (di solito > 180/120) CON danno d’organo acuto: encefalopatia, ictus/emorragia, SCA, edema polmonare, dissezione, insufficienza renale acuta, retinopatia (emorragie, edema papillare), microangiopatia, preeclampsia.',
      'Senza danno d’organo non è un’emergenza: niente farmaci ev; trattare dolore e ansia, riprendere/aggiustare la terapia orale, controllo dal curante.',
      'Esami: ECG, troponina, creatinina, urine, emocromo con LDH/aptoglobina/schistociti, fundus; TC encefalo se sintomi neurologici; test di gravidanza.',
      'Obiettivo e velocità dipendono dal quadro (tabella sotto). In generale ridurre la PAM del 20–25% nelle prime ore, non normalizzare.',
      'In PS a Prato per via ev: labetalolo, urapidil, nitroglicerina.',
    ],
    sezioni: [
      {
        titolo: 'Obiettivi per quadro',
        punti: [
          'Ipertensione maligna / encefalopatia: −20–25% PAM in alcune ore → labetalolo o urapidil.',
          'Dissezione aortica: PAS < 120 e FC < 60 entro 20 min → prima labetalolo (beta), poi urapidil/nitroglicerina.',
          'Edema polmonare: PAS < 140 subito → nitroglicerina + urapidil, diuretico.',
          'SCA: PAS < 140 → nitroglicerina (labetalolo se tachicardia).',
          'Ictus ischemico: < 185/110 se trombolisi (poi < 180/105); senza trombolisi trattare solo se > 220/120.',
          'Emorragia cerebrale: PAS 140–160 (vedi PDTA). Preeclampsia: < 160/110 → labetalolo.',
          'Cocaina/feocromocitoma: benzodiazepine, poi urapidil (alfa) prima di qualunque beta-bloccante.',
        ],
      },
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Labetalolo (Trandate fiale 100 mg/20 mL): 20 mg ev in 2 min (4 mL), poi 20–80 mg ogni 10 min (max 300 mg); oppure infusione 1–2 mg/min (fiale pure in siringa da 50: 0,2–0,4 mL/min = 12–24 mL/h).',
          'Urapidil (Ebrantil fiale 50 mg/10 mL): 12,5–25 mg ev (2,5–5 mL), ripetibile dopo 5 min; poi 5–30 mg/h (es. 100 mg in 50 mL: 2,5–15 mL/h).',
          'Nitroglicerina (50 mg in 50 mL): 10–200 µg/min = 0,6–12 mL/h; iniziare a 1–2 mL/h nell’edema polmonare.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2024-08-30', testo: 'ESC 2024: definizione di emergenza ipertensiva come danno d’organo acuto; obiettivi diversi per quadro.' }],
  },
  {
    id: 'compressione-midollare',
    titolo: 'Compressione midollare e sindrome della cauda equina',
    ente: 'NICE',
    anno: 2023,
    area: 'Neurologia',
    fonte: { etichetta: 'NICE NG234, metastasi vertebrali e compressione midollare (2023)', url: 'https://www.nice.org.uk/guidance/ng234' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Dimissione: lombalgia', to: '/dimissioni' }, { etichetta: 'Rubrica: neurochirurgia', to: '/rubrica' }],
    inBreve: [
      'Bandiere rosse nel mal di schiena: neoplasia nota, dolore notturno/ingravescente o toracico, febbre, tossicodipendenza ev, immunodepressione, deficit neurologici, disturbi sfinterici, anestesia a sella.',
      'Cauda equina: ritenzione urinaria (residuo post-minzionale > 200 mL con ecografia), incontinenza, anestesia perineale, deficit bilaterali, ipotono anale → RM lombare in urgenza.',
      'Compressione midollare metastatica con deficit: RM di tutta la colonna subito (entro 24 h se solo dolore sospetto); desametasone appena sospettata.',
      'Ascesso epidurale (febbre, PCR alta, tossicodipendenza, batteriemia): RM, emocolture, antibiotico dopo le colture, neurochirurgo.',
      'Neurochirurgia: Careggi. Oncologia/radioterapia per le forme metastatiche non chirurgiche.',
      'Paziente allettato in piano finché instabilità esclusa se dolore meccanico importante.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Desametasone 16 mg ev (4 fiale da 4 mg) poi 16 mg/die (8 mg ogni 12 h) con inibitore di pompa; evitarlo se il sospetto è linfoma senza istologia (sentire l’oncologo).',
          'Ascesso epidurale: vancomicina 25 mg/kg = 1.750 mg ev + ceftriaxone 2 g ev (dopo emocolture).',
          'Analgesia multimodale; catetere se ritenzione.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2023-09-06', testo: 'NICE NG234 (2023): RM di tutta la colonna entro 24 h se sospetta compressione metastatica, immediata se deficit neurologici.' }],
  },
  {
    id: 'miastenia',
    titolo: 'Crisi miastenica',
    ente: 'MGFA',
    anno: 2021,
    area: 'Neurologia',
    fonte: { etichetta: 'Narayanaswami et al., Neurology 2021 (consenso internazionale MG, aggiornamento)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Narayanaswami+international+consensus+guidance+myasthenia+gravis+2020+update' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Sindrome di Guillain-Barré', to: '/linee-guida/guillain-barre' }, { etichetta: 'NIV con V60', to: '/procedure?apri=niv-v60' }],
    inBreve: [
      'Debolezza dei muscoli respiratori e bulbari (disfagia, disfonia, testa cadente, tosse debole) in miastenico, o primo esordio.',
      'Scatenanti: infezioni, chirurgia, riduzione della terapia, farmaci (aminoglicosidi, fluorochinoloni, macrolidi, magnesio, beta-bloccanti, mezzo di contrasto iodato, curari, checkpoint inibitori).',
      'L’ossimetria è tardiva: misurare capacità vitale (CV < 20 mL/kg o calo > 30% → intubazione), forza inspiratoria, conta in un respiro (< 20 = debole), EGA.',
      'Rianimazione presto. Intubazione: rocuronio a dose ridotta (0,5 mg/kg) + sugammadex disponibile; evitare succinilcolina.',
      'Terapia: immunoglobuline ev o plasmaferesi (neurologo); steroidi dopo (peggioramento iniziale possibile).',
      'Crisi colinergica (eccesso di piridostigmina) rara: miosi, secrezioni, fascicolazioni. Se intubato, sospendere la piridostigmina.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Immunoglobuline ev 0,4 g/kg/die = 28 g/die per 5 giorni (2 g/kg totali), oppure plasmaferesi 5 sedute.',
          'Steroide (prednisone 60 mg/die) avviato dal neurologo.',
          'NIV possibile nelle forme iniziali senza disfunzione bulbare grave.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2021-01-19', testo: 'Consenso internazionale 2020: immunoglobuline o plasmaferesi nella crisi; nuovi farmaci (eculizumab, efgartigimod) nelle forme refrattarie.' }],
  },
  {
    id: 'guillain-barre',
    titolo: 'Sindrome di Guillain-Barré',
    ente: 'EAN/PNS',
    anno: 2023,
    area: 'Neurologia',
    fonte: { etichetta: 'van Doorn et al., Eur J Neurol 2023 (EAN/PNS, Guillain-Barré)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=van+Doorn+EAN+PNS+guideline+Guillain-Barre+2023' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Crisi miastenica', to: '/linee-guida/miastenia' }, { etichetta: 'Rachicentesi', to: '/procedure?apri=rachicentesi' }],
    inBreve: [
      'Debolezza ascendente simmetrica con riflessi ridotti o assenti, parestesie, dolore lombare; spesso infezione 1–4 settimane prima. Varianti: Miller Fisher (oftalmoplegia, atassia, areflessia), facciale bilaterale.',
      'Bandiere rosse per altre diagnosi: livello sensitivo, disturbi sfinterici all’esordio, asimmetria marcata, febbre all’esordio → RM del midollo.',
      'Rachicentesi: dissociazione albumino-citologica (ma proteine normali nella prima settimana nel 30–50%); cellule > 50 → pensare ad altro.',
      'Rischio respiratorio: regola 20/30/40 (CV < 20 mL/kg, forza inspiratoria meno negativa di −30, espiratoria < 40) → rianimazione; disautonomia (aritmie, pressione instabile).',
      'Immunoglobuline ev o plasmaferesi entro 2 settimane (fino a 4) se non cammina da solo.',
      'Niente steroidi (inefficaci).',
    ],
    sezioni: [
      {
        titolo: 'Farmaci e monitoraggio (70 kg)',
        punti: [
          'Immunoglobuline ev 0,4 g/kg/die = 28 g/die per 5 giorni.',
          'Capacità vitale ogni 2–6 h, ECG continuo, pressione.',
          'Profilassi antitrombotica, analgesia (gabapentin, oppioidi); evitare succinilcolina.',
          'Punteggio EGRIS per il rischio di ventilazione.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2023-12-01', testo: 'EAN/PNS 2023: criteri diagnostici, immunoglobuline o plasmaferesi, nessun ruolo degli steroidi.' }],
  },
  {
    id: 'arterite-temporale',
    titolo: 'Arterite gigantocellulare (temporale)',
    ente: 'EULAR',
    anno: 2023,
    area: 'Neurologia · Oculistica',
    fonte: { etichetta: 'Hellmich et al., Ann Rheum Dis 2024 (EULAR 2023, vasculiti dei grandi vasi)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Hellmich+EULAR+recommendations+large+vessel+vasculitis+2023' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Cefalea acuta', to: '/linee-guida/cefalea' }, { etichetta: 'Occhio rosso', to: '/linee-guida/occhio-rosso' }],
    inBreve: [
      'Età > 50 anni con cefalea nuova (temporale), dolorabilità del cuoio capelluto, claudicatio della mandibola, disturbi visivi (amaurosi fugace, diplopia, perdita della vista), polimialgia, febbre, calo di peso.',
      'VES e PCR alte (normali in < 5%); piastrine alte.',
      'Trattare subito col cortisone se il sospetto è alto, prima di ecografia o biopsia (restano diagnostiche per 1–2 settimane).',
      'Perdita visiva o amaurosi: metilprednisolone ev ad alte dosi e oculista urgente; la vista persa raramente torna, l’altro occhio si protegge.',
      'Ecografia delle arterie temporali e ascellari (segno dell’alone) o biopsia: entro 1–2 settimane, percorso reumatologico rapido.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Senza disturbi visivi: prednisone 40–60 mg/die (1 mg/kg, max 60) per bocca.',
          'Con disturbi visivi: metilprednisolone (Urbason) 500–1.000 mg ev al giorno per 3 giorni, poi prednisone 1 mg/kg.',
          'Gastroprotezione; calcio e vitamina D; glicemia.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2023-12-01', testo: 'EULAR 2023: ecografia come primo esame; glucocorticoidi subito nel sospetto; tocilizumab per risparmiare cortisone.' }],
  },
]

export const ALG_ADDOME_TORACE_NEURO: Alg = {
  'occlusione-intestinale': {
    titolo: 'Algoritmo occlusione intestinale',
    nota: 'WSES (Bologna).',
    nodi: [
      { tipo: 'avvio', titolo: 'Dolore crampiforme, vomito, alvo chiuso, distensione', righe: ['Porte erniarie, cicatrici, esplorazione rettale.'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['Emocromo, elettroliti, creatinina, lattati, EGA', 'SNG se vomito/distensione; digiuno; liquidi', 'TC addome con contrasto'] },
      { tipo: 'decisione', titolo: 'Strangolamento, ansa chiusa, perforazione o ernia incarcerata?', righe: ['Febbre, tachicardia, peritonismo, lattati alti, segni TC di ischemia.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Chirurgo: intervento urgente', righe: ['Antibiotico (peritonite), liquidi.'], vai: [{ etichetta: 'Peritonite', to: '/antibiotici?apri=peritonite' }] }] },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'decisione', titolo: 'Causa?' },
              {
                tipo: 'rami', rami: [
                  { etichetta: 'Aderenze', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Conservativo + Gastrografin', righe: ['100 mL per SNG; RX a 8–24 h.', 'Non si risolve in 72 h: chirurgia.'] }] },
                  { etichetta: 'Volvolo del sigma', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'Detorsione endoscopica', righe: ['Poi chirurgo.'] }] },
                  { etichetta: 'Neoplasia del colon', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'Chirurgo (stent o intervento)' }] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  'ischemia-mesenterica': {
    titolo: 'Algoritmo ischemia mesenterica',
    nota: 'WSES 2022. Non aspettare la creatinina.',
    nodi: [
      { tipo: 'avvio', titolo: 'Dolore sproporzionato all’obiettività', righe: ['FA, vasculopatia, scompenso, bassa portata, trombofilia.'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['Lattati, D-dimero, EGA, emocromo', 'Angio-TC addome (arteriosa + venosa)', 'Chirurgo generale e vascolare'] },
      { tipo: 'decisione', titolo: 'Angio-TC?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Occlusione arteriosa', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Rivascolarizzazione urgente', righe: ['Eparina 5.000 UI ev + infusione; piperacillina/tazobactam 4,5 g; liquidi.', 'Endovascolare o chirurgia; resezione e second look.'] }] },
          { etichetta: 'Trombosi venosa', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Eparina', righe: ['Chirurgia se infarto intestinale/peritonite.'] }] },
          { etichetta: 'Non occlusiva', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Migliorare la portata', righe: ['Ridurre vasocostrittori; chirurgo se peritonite.'] }] },
        ],
      },
    ],
  },
  'cirrosi-scompensata': {
    titolo: 'Algoritmo cirrotico che peggiora',
    nota: 'EASL 2018/2022.',
    nodi: [
      { tipo: 'avvio', titolo: 'Cirrotico con confusione, ascite, ittero o insufficienza renale' },
      { tipo: 'checklist', titolo: 'Cercare i precipitanti', righe: ['Paracentesi diagnostica (PBS) se ascite', 'Emocolture, urine, RX torace', 'Sanguinamento: esplorazione rettale, Hb', 'Glicemia, Na, K, creatinina', 'Farmaci (sedativi, diuretici), alcol, stipsi'] },
      { tipo: 'decisione', titolo: 'Encefalopatia?', righe: ['Grado West Haven, asterixis.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Grado 3–4', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Vie aeree, rianimazione', righe: ['Lattulosio per SNG o clistere.'] }] },
          { etichetta: 'Grado 1–2', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Lattulosio + rifaximina', righe: ['25 mL ogni 1–2 h fino a 2 evacuazioni, poi 2–3 al giorno.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Trattare la causa dello scompenso' }] },
        ],
      },
      { tipo: 'decisione', titolo: 'Creatinina in aumento?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Sospendere diuretici/FANS + albumina', righe: ['Albumina 70 g/die per 2 giorni; se non risponde: terlipressina 1 mg ogni 4–6 h + albumina.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Ricovero in Medicina/Gastroenterologia' }] },
        ],
      },
    ],
  },
  'caustici-corpi-estranei': {
    titolo: 'Algoritmo caustici e corpi estranei',
    nota: 'ESGE 2016, WSES 2019.',
    nodi: [
      { tipo: 'avvio', titolo: 'Ingestione di caustico o corpo estraneo' },
      { tipo: 'decisione', titolo: 'Cosa?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Caustico', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Vie aeree prima', righe: ['Stridore, disfonia, edema: intubazione con fibroscopio.', 'No vomito, neutralizzanti, carbone, SNG alla cieca.'] },
              { tipo: 'passo', titolo: 'TC torace-addome con contrasto + CAV', righe: ['Perforazione/necrosi: chirurgo. Altrimenti endoscopia entro 12–24 h.'] },
            ],
          },
          {
            etichetta: 'Corpo estraneo / bolo', tono: 'neutro', nodi: [
              { tipo: 'passo', titolo: 'RX collo-torace-addome', righe: ['TC se perforazione sospetta o non radiopaco con sintomi.'] },
              { tipo: 'decisione', titolo: 'Emergente?', righe: ['Batteria in esofago, appuntito in esofago, non deglutisce la saliva, ≥ 2 magneti.'] },
              {
                tipo: 'rami', rami: [
                  { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Endoscopia entro 2–6 h' }] },
                  { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Esofago: endoscopia < 24 h; oltre: controllo clinico/RX' }] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  pneumotorace: {
    titolo: 'Algoritmo pneumotorace spontaneo',
    nota: 'BTS 2023.',
    nodi: [
      { tipo: 'avvio', titolo: 'Pneumotorace (RX o ecografia)' },
      { tipo: 'decisione', titolo: 'Iperteso o instabile?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Decompressione subito, poi drenaggio', vai: [{ etichetta: 'Decompressione', to: '/procedure?apri=decompressione' }] }] },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'decisione', titolo: 'Primario o secondario?' },
              {
                tipo: 'rami', rami: [
                  {
                    etichetta: 'Primario', tono: 'si', nodi: [
                      { tipo: 'decisione', titolo: 'Sintomi importanti?' },
                      {
                        tipo: 'rami', rami: [
                          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Conservativo', righe: ['Dimissione, controllo a 2–4 settimane.'] }] },
                          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Aspirazione o pigtail', righe: ['Fallisce → drenaggio e ricovero.'] }] },
                        ],
                      },
                    ],
                  },
                  { etichetta: 'Secondario', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Pigtail 8–14 Fr e ricovero', righe: ['Pneumologo.'], vai: [{ etichetta: 'Pigtail', to: '/procedure?apri=pigtail' }] }] },
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'nota', titolo: 'Perdita d’aria > 48 h o recidiva', righe: ['Chirurgo toracico (Careggi).'] },
    ],
  },
  emottisi: {
    titolo: 'Algoritmo emottisi massiva',
    nodi: [
      { tipo: 'avvio', titolo: 'Emottisi abbondante o con insufficienza respiratoria' },
      { tipo: 'checklist', titolo: 'Subito', righe: ['Sul fianco del lato che sanguina', 'Ossigeno, aspiratore, 2 accessi', 'Emocromo, coagulazione, gruppo', 'Acido tranexamico 1 g ev'] },
      { tipo: 'decisione', titolo: 'Protegge le vie aeree?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'No', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Intubazione con tubo ≥ 8', righe: ['Selettiva nel polmone sano se necessario.'], vai: [{ etichetta: 'Sequenza rapida', to: '/procedure?apri=rsi' }] }] },
          { etichetta: 'Sì', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Monitorare' }] },
        ],
      },
      { tipo: 'passo', titolo: 'Angio-TC torace' },
      { tipo: 'terapia', titolo: 'Embolizzazione delle arterie bronchiali', righe: ['Radiologo interventista di Careggi o Torregalli (fascia oraria); broncoscopia; chirurgo toracico se fallisce.'] },
    ],
  },
  angioedema: {
    titolo: 'Algoritmo angioedema',
    nodi: [
      { tipo: 'avvio', titolo: 'Gonfiore di labbra, lingua, viso o glottide' },
      { tipo: 'decisione', titolo: 'Orticaria, prurito, ipotensione, broncospasmo?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Anafilassi', vai: [{ etichetta: 'Anafilassi', to: '/linee-guida/anafilassi' }] }] },
          {
            etichetta: 'No', tono: 'neutro', nodi: [
              { tipo: 'passo', titolo: 'Bradichininico probabile', righe: ['ACE-inibitore, sacubitril, gliptina, alteplase; familiarità.', 'Adrenalina 0,5 mg im se dubbio.'] },
              { tipo: 'decisione', titolo: 'Vie aeree coinvolte?', righe: ['Voce, stridore, disfagia, lingua/pavimento.'] },
              {
                tipo: 'rami', rami: [
                  { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Anestesista + ORL', righe: ['Intubazione da sveglio con fibroscopio; crico pronta.', 'Ereditario: Berinert 1.500 UI ev o icatibant 30 mg sc.'], vai: [{ etichetta: 'Cricotirotomia', to: '/procedure?apri=crico' }] }] },
                  { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Osservazione 6–24 h', righe: ['Sospendere l’ACE-inibitore per sempre.'] }] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  'emergenza-ipertensiva': {
    titolo: 'Algoritmo pressione molto alta',
    nota: 'ESC 2024. Farmaci ev a Prato: labetalolo, urapidil, nitroglicerina.',
    nodi: [
      { tipo: 'avvio', titolo: 'PA > 180/120', righe: ['Ripetere a riposo, dopo analgesia/ansiolisi.'] },
      { tipo: 'checklist', titolo: 'Danno d’organo?', righe: ['ECG, troponina', 'Creatinina, urine, emocromo, LDH, schistociti', 'Neurologico, fundus', 'Test di gravidanza'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'No danno', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Non è un’emergenza', righe: ['Niente ev; dolore/ansia; terapia orale; curante.'], vai: [{ etichetta: 'Dimissione: pressione alta', to: '/dimissioni' }] }] },
          {
            etichetta: 'Danno acuto', tono: 'no', nodi: [
              { tipo: 'decisione', titolo: 'Quale quadro?' },
              {
                tipo: 'rami', rami: [
                  { etichetta: 'Dissezione', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'PAS < 120, FC < 60 in 20 min', righe: ['Labetalolo, poi urapidil.'] }] },
                  { etichetta: 'Edema polmonare / SCA', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'PAS < 140', righe: ['Nitroglicerina ± urapidil.'] }] },
                  { etichetta: 'Ictus / emorragia', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'Soglie dei PDTA neuro', vai: [{ etichetta: 'Ictus', to: '/linee-guida/ictus' }, { etichetta: 'Emorragia cerebrale', to: '/linee-guida/emorragia-cerebrale' }] }] },
                  { etichetta: 'Encefalopatia / maligna', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: '−20–25% PAM in ore', righe: ['Labetalolo o urapidil.'] }] },
                  { etichetta: 'Gravidanza', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'Preeclampsia', vai: [{ etichetta: 'Preeclampsia', to: '/linee-guida/preeclampsia' }] }] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  'compressione-midollare': {
    titolo: 'Algoritmo mal di schiena con bandiere rosse',
    nota: 'NICE NG234.',
    nodi: [
      { tipo: 'avvio', titolo: 'Mal di schiena con bandiere rosse', righe: ['Neoplasia, febbre, tossicodipendenza ev, deficit, sfinteri, anestesia a sella.'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['Esame neurologico + perineo + tono anale', 'Residuo post-minzionale (eco)', 'PCR, emocromo; emocolture se febbre'] },
      { tipo: 'decisione', titolo: 'Quadro?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Cauda equina', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'RM lombare urgente', righe: ['Neurochirurgo (Careggi).'] }] },
          { etichetta: 'Metastatica con deficit', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Desametasone 16 mg ev + RM tutta la colonna', righe: ['Neurochirurgo, radioterapista, oncologo.'] }] },
          { etichetta: 'Febbre / infezione', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Ascesso epidurale?', righe: ['RM, emocolture, vancomicina + ceftriaxone, neurochirurgo.'] }] },
          { etichetta: 'Solo dolore, neoplasia nota', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'RM entro 24 h' }] },
        ],
      },
    ],
  },
  miastenia: {
    titolo: 'Algoritmo crisi miastenica',
    nodi: [
      { tipo: 'avvio', titolo: 'Miastenico con debolezza respiratoria o bulbare' },
      { tipo: 'checklist', titolo: 'Subito', righe: ['Capacità vitale, conta in un respiro, EGA', 'Deglutizione, tosse', 'Scatenanti: infezione, farmaci, sospensione', 'Neurologo'] },
      { tipo: 'decisione', titolo: 'CV < 20 mL/kg, ipercapnia o disfunzione bulbare grave?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Intubazione e rianimazione', righe: ['Rocuronio 0,5 mg/kg + sugammadex pronto; no succinilcolina.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Monitoraggio intensivo', righe: ['CV ogni 2–4 h; NIV se peggiora senza problemi bulbari.'] }] },
        ],
      },
      { tipo: 'terapia', titolo: 'Immunoglobuline o plasmaferesi', righe: ['Immunoglobuline 28 g/die per 5 giorni; steroide dopo (neurologo).'] },
    ],
  },
  'guillain-barre': {
    titolo: 'Algoritmo Guillain-Barré',
    nota: 'EAN/PNS 2023.',
    nodi: [
      { tipo: 'avvio', titolo: 'Debolezza ascendente con iporeflessia' },
      { tipo: 'decisione', titolo: 'Bandiere rosse?', righe: ['Livello sensitivo, sfinteri all’esordio, asimmetria, febbre.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'RM del midollo urgente' }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Rachicentesi, ENG, neurologo' }] },
        ],
      },
      { tipo: 'decisione', titolo: 'Rischio respiratorio o disautonomia?', righe: ['Regola 20/30/40, bulbare, aritmie.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Rianimazione' }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Ricovero in Neurologia con monitor' }] },
        ],
      },
      { tipo: 'terapia', titolo: 'Non cammina da solo: immunoglobuline', righe: ['28 g/die per 5 giorni (o plasmaferesi). Niente steroidi.'] },
    ],
  },
  'arterite-temporale': {
    titolo: 'Algoritmo sospetta arterite temporale',
    nota: 'EULAR 2023.',
    nodi: [
      { tipo: 'avvio', titolo: '> 50 anni, cefalea nuova', righe: ['Claudicatio mandibolare, cuoio capelluto dolente, polimialgia, sintomi visivi.'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['VES, PCR, emocromo', 'Visus e fundus (oculista)'] },
      { tipo: 'decisione', titolo: 'Disturbi visivi?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Metilprednisolone 500–1.000 mg ev', righe: ['Per 3 giorni; oculista urgente; ricovero.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Prednisone 40–60 mg/die subito', righe: ['Ecografia temporali/ascellari o biopsia entro 1–2 settimane; reumatologo.'] }] },
        ],
      },
    ],
  },
}

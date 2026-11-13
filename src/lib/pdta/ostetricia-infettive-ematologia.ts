/*
 * PDTA ostetrici (adulto), infettivologici ed ematologici. Dosi per adulto di 70 kg.
 */
import type { LineaGuida } from '../lineeGuida'
import type { Nodo } from '../algoritmi'

type Alg = Record<string, { titolo: string; nota?: string; nodi: Nodo[] }>
const OGGI = '2026-11-13'
const GINE = { etichetta: 'Rubrica: Ginecologia · Ostetricia', to: '/rubrica' }
const INF = { etichetta: 'Rubrica: Malattie infettive', to: '/rubrica' }

export const LG_OST_INF_EMA: LineaGuida[] = [
  {
    id: 'metrorragia-primo-trimestre',
    titolo: 'Sanguinamento nel primo trimestre e aborto',
    ente: 'NICE',
    anno: 2023,
    area: 'Ostetricia',
    fonte: { etichetta: 'NICE NG126: gravidanza ectopica e aborto spontaneo', url: 'https://www.nice.org.uk/guidance/ng126' },
    controllata: OGGI,
    vediAnche: [GINE, { etichetta: 'Extrauterina', to: '/linee-guida/extrauterina' }, { etichetta: 'Sepsi', to: '/linee-guida/sepsi' }],
    inBreve: [
      'Ogni donna in età fertile con dolore o sanguinamento: test di gravidanza. Positivo = extrauterina finché non si dimostra una gravidanza intrauterina.',
      'Instabile o dolore importante: due accessi, gruppo, ginecologo subito (extrauterina rotta, aborto con emorragia).',
      'Stabile: β-hCG quantitativa, gruppo e Rh, emocromo; ecografia transvaginale (ginecologo).',
      'Gravidanza di sede non nota con β-hCG < soglia ecografica: β-hCG ripetuta a 48 h (aumento > 63% = probabile evolutiva; calo > 50% = probabile aborto), avvertenze per il ritorno.',
      'Aborto settico (febbre, perdite maleodoranti, dolore uterino): emocolture, antibiotico, evacuazione uterina urgente.',
      'Rh negativa: immunoprofilassi anti-D secondo il protocollo ginecologico (aborto chirurgico, gravidanza > 12 settimane, sanguinamento importante, extrauterina).',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Anti-D 250–300 µg im entro 72 h quando indicata.',
          'Aborto settico: piperacillina/tazobactam 4,5 g ev ogni 6 h (oppure ceftriaxone 2 g + metronidazolo 500 mg ogni 8 h) + clindamicina 900 mg se shock.',
          'Analgesia: paracetamolo 1 g; morfina 2–4 mg ev se dolore forte.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2023-08-01', testo: 'NICE NG126 aggiornata: anti-D non necessaria nella gestione medica dell’aborto < 12 settimane.' }],
  },
  {
    id: 'emorragia-post-partum',
    titolo: 'Emorragia post-partum',
    ente: 'OMS · RCOG',
    anno: 2023,
    area: 'Ostetricia',
    fonte: { etichetta: 'OMS 2023: raccomandazioni sull’emorragia post-partum', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=WHO+recommendations+postpartum+haemorrhage+2023' },
    controllata: OGGI,
    vediAnche: [GINE, { etichetta: 'Anemia e trasfusione', to: '/linee-guida/anemia-acuta' }, { etichetta: 'Modulo trasfusione', to: '/modulo-trasfusione' }],
    inBreve: [
      'Perdita ≥ 500 mL entro 24 h dal parto (o qualunque perdita con instabilità); tardiva fino a 12 settimane (residui, endometrite).',
      'Cause (4 T): Tono (atonia, 70%), Trauma (lacerazioni, rottura d’utero, inversione), Tessuto (placenta ritenuta), Trombina (coagulopatia).',
      'Chiamare subito ginecologo, ostetrica, anestesista; due accessi grossi, gruppo e prove, emocromo, fibrinogeno.',
      'Insieme: massaggio uterino, uterotonici, acido tranexamico entro 3 h dal parto, svuotamento vescicale, ricerca delle lacerazioni.',
      'Il fibrinogeno < 2 g/L predice emorragia grave: correggerlo presto.',
      'Shock index (FC/PAS) > 1 = perdita importante (le giovani compensano a lungo).',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Ossitocina (Syntocinon fiale 5 UI): 5 UI ev lenta (o 10 UI im), poi 40 UI in 500 mL a 125 mL/h.',
          'Acido tranexamico 1 g ev (2 fiale da 500 mg) in 10 min entro 3 h dal parto; seconda dose 1 g se continua dopo 30 min.',
          'Metilergometrina (Methergin fiale 0,2 mg) 0,2 mg im, ripetibile; controindicata se ipertensione/preeclampsia.',
          'Misoprostolo 800 µg sublinguale o rettale.',
          'Sulprostone (Nalador) in infusione su indicazione del ginecologo.',
          'Emorragia massiva: emazie e plasma 1:1–1:2, fibrinogeno 4 g se < 2 g/L, calcio; balloon intrauterino, embolizzazione, chirurgia.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2023-10-01', testo: 'OMS 2023: pacchetto di prima linea (massaggio, ossitocina, tranexamico, liquidi, esame del tratto genitale) avviato insieme appena diagnosticata.' }],
  },
  {
    id: 'parto-precipitoso',
    titolo: 'Parto precipitoso in PS',
    ente: 'RCOG · OMS',
    anno: 2022,
    area: 'Ostetricia',
    fonte: { etichetta: 'RCOG Green-top 42: distocia di spalla', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=RCOG+shoulder+dystocia+green-top+guideline+42' },
    controllata: OGGI,
    vediAnche: [GINE, { etichetta: 'Emorragia post-partum', to: '/linee-guida/emorragia-post-partum' }],
    inBreve: [
      'Chiamare subito ostetrica, ginecologo e neonatologo; preparare kit parto, telini caldi, aspiratore, ossigeno, materiale per la rianimazione neonatale.',
      'Non trattenere la testa e non tirare: accompagnare con la mano sulla testa per evitare un’uscita brusca; controllare il cordone attorno al collo (sfilarlo o, se stretto, clampare e tagliare).',
      'Spalle: abbassare delicatamente la testa per la spalla anteriore, poi alzare per la posteriore.',
      'Distocia di spalla (testa che rientra, «segno della tartaruga»): chiamare aiuto, McRoberts (cosce iperflesse sull’addome) + pressione sovrapubica; no pressione sul fondo, no trazione forte.',
      'Neonato: asciugare, stimolare, contatto pelle a pelle, coprire; clampaggio del cordone dopo 1–3 min se vigoroso.',
      'Dopo: ossitocina 10 UI im, non tirare il cordone in attesa della placenta (ostetrica), controllare le perdite.',
    ],
    sezioni: [
      {
        titolo: 'Dopo la nascita',
        punti: [
          'Ossitocina (Syntocinon) 10 UI im (2 fiale da 5 UI) dopo l’uscita del bambino (escludere un secondo gemello).',
          'Placenta: attendere i segni di distacco; conservarla per l’ostetrica.',
          'Massaggio del fondo se utero molle; vedi emorragia post-partum.',
        ],
      },
    ],
    aggiornamenti: [{ data: OGGI, testo: 'Aggiunto: assistenza al parto in PS e distocia di spalla.' }],
  },
  {
    id: 'gravidanza-trauma-acr',
    titolo: 'Trauma e arresto cardiaco in gravidanza',
    ente: 'ERC · ACOG',
    anno: 2025,
    area: 'Ostetricia',
    fonte: { etichetta: 'ERC 2025: situazioni speciali (gravidanza)', url: 'https://cprguidelines.eu' },
    controllata: OGGI,
    vediAnche: [GINE, { etichetta: 'Trauma maggiore', to: '/linee-guida/trauma-maggiore' }, { etichetta: 'Arresto cardiaco', to: '/acr' }, { etichetta: 'Preeclampsia', to: '/linee-guida/preeclampsia' }],
    inBreve: [
      'Dopo 20 settimane (fondo all’ombelico): spostare manualmente l’utero a sinistra o inclinare 15–30° a sinistra, per liberare la cava.',
      'Il feto si salva salvando la madre: imaging (TC compresa) e farmaci necessari non si negano.',
      'Trauma > 20–24 settimane: monitoraggio cardiotocografico ≥ 4–6 h anche se il trauma è minore (distacco di placenta); ginecologo.',
      'Rh negativa con trauma: anti-D (e test di Kleihauer per la dose).',
      'Arresto > 20 settimane: RCP di qualità con spostamento dell’utero, via aerea precoce (stomaco pieno), accessi sopra il diaframma; cesareo perimortem entro 4–5 min dall’arresto, eseguito sul posto.',
      'Cause specifiche: emorragia, embolia, preeclampsia/eclampsia (magnesio), embolia amniotica, cardiomiopatia, tossicità da anestetici locali, sepsi.',
      'Trauma in gravidanza: chiedere sempre di violenza domestica (Codice Rosa).',
    ],
    sezioni: [
      {
        titolo: 'Dettagli',
        punti: [
          'Esami: emocromo, coagulazione, fibrinogeno, gruppo, Kleihauer-Betke.',
          'Anti-D 300 µg im entro 72 h se Rh negativa.',
          'Eclampsia/overdose di magnesio in arresto: calcio cloruro 1 g ev.',
          'Cesareo perimortem: bisturi, incisione mediana dall’ombelico al pube; ginecologo e neonatologo chiamati all’inizio dell’arresto.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2025-10-22', testo: 'ERC 2025: spostamento manuale dell’utero, cesareo perimortem entro 5 minuti nelle gravidanze oltre 20 settimane.' }],
  },
  {
    id: 'artrite-settica',
    titolo: 'Artrite settica',
    ente: 'BSR · letteratura',
    anno: 2023,
    area: 'Infettivologia · Ortopedia',
    fonte: { etichetta: 'PubMed: septic arthritis adults management review', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=septic+arthritis+adults+diagnosis+management+review' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Antibiotici: sepsi', to: '/antibiotici?apri=sepsi' }],
    inBreve: [
      'Monoartrite acuta calda e dolorosa = settica finché l’artrocentesi non dice altro (anche se c’è gotta o febbre assente).',
      'Artrocentesi prima dell’antibiotico (se il paziente non è settico): leucociti, Gram, coltura, cristalli; emocolture.',
      'Liquido con leucociti > 50.000/µL (> 90% neutrofili) molto suggestivo; i cristalli non escludono l’infezione.',
      'Protesi articolare: non dare antibiotico se stabile, prima l’ortopedico e l’artrocentesi.',
      'Giovane sessualmente attivo, poliartralgie migranti, tenosinovite, pustole: gonococco.',
      'Ortopedico per lavaggio (artroscopico o aperto); osservazione PCR.',
    ],
    sezioni: [
      {
        titolo: 'Antibiotico empirico (70 kg)',
        punti: [
          'Comunitaria, senza rischi: cefazolina 2 g ev ogni 8 h.',
          'Rischio MRSA (MRSA noto, dialisi, tossicodipendenza, ospedalizzazione): vancomicina 25 mg/kg = 1.750 mg ev + ceftriaxone 2 g ev.',
          'Gonococco sospetto: ceftriaxone 1 g ev ogni 24 h.',
          'Anziano, immunodepresso, tossicodipendente: aggiungere copertura per Gram negativi (ceftriaxone 2 g).',
        ],
      },
    ],
    aggiornamenti: [{ data: OGGI, testo: 'Aggiunto: artrocentesi prima dell’antibiotico, empirica per gruppi di rischio.' }],
  },
  {
    id: 'ist-pid',
    titolo: 'Uretrite, cervicite e malattia infiammatoria pelvica',
    ente: 'CDC',
    anno: 2021,
    area: 'Infettivologia · Ginecologia',
    fonte: { etichetta: 'CDC Sexually Transmitted Infections Treatment Guidelines 2021', url: 'https://www.cdc.gov/std/treatment-guidelines/default.htm' },
    controllata: OGGI,
    vediAnche: [GINE, { etichetta: 'Orchiepididimite', to: '/linee-guida/orchiepididimite' }, { etichetta: 'Profilassi post-esposizione', to: '/linee-guida/pep-hiv-hbv' }],
    inBreve: [
      'Uretrite (bruciore, secrezione) o cervicite: tampone/urine per gonococco e clamidia (PCR), poi trattare empiricamente entrambi.',
      'Malattia infiammatoria pelvica: dolore pelvico + dolorabilità alla mobilizzazione della cervice, dell’utero o degli annessi, senza altre cause. Test di gravidanza sempre (extrauterina).',
      'Ricovero se: gravidanza, ascesso tubo-ovarico (ecografia), sepsi, vomito, mancata risposta dopo 72 h, diagnosi incerta con appendicite.',
      'Offrire test per HIV, sifilide, epatite B e C; trattare i partner degli ultimi 60 giorni; niente rapporti per 7 giorni dopo la terapia.',
      'Notifica secondo la normativa (gonorrea, sifilide).',
    ],
    sezioni: [
      {
        titolo: 'Terapia (70 kg)',
        punti: [
          'Gonococco: ceftriaxone 500 mg im in dose unica (1 g se ≥ 150 kg).',
          'Clamidia: doxiciclina 100 mg ogni 12 h per 7 giorni (gravidanza: azitromicina 1 g dose unica).',
          'PID a domicilio: ceftriaxone 500 mg im + doxiciclina 100 mg ogni 12 h + metronidazolo 500 mg ogni 12 h per 14 giorni.',
          'PID ricoverata: ceftriaxone 1 g ev ogni 24 h + doxiciclina 100 mg ogni 12 h + metronidazolo 500 mg ogni 12 h.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2021-07-23', testo: 'CDC 2021: ceftriaxone 500 mg per il gonococco; doxiciclina preferita all’azitromicina per la clamidia; metronidazolo sempre nella PID.' }],
  },
  {
    id: 'endocardite',
    titolo: 'Endocardite infettiva',
    ente: 'ESC',
    anno: 2023,
    area: 'Cardiologia · Infettivologia',
    fonte: { etichetta: 'Delgado et al., Eur Heart J 2023 (ESC, endocardite)', url: 'https://doi.org/10.1093/eurheartj/ehad193' },
    controllata: OGGI,
    vediAnche: [INF, { etichetta: 'Sepsi', to: '/linee-guida/sepsi' }],
    inBreve: [
      'Pensarci in: febbre + soffio nuovo, protesi valvolare o dispositivo, tossicodipendenza ev, endocardite pregressa, embolie (ictus, milza, rene, arti), emocolture positive per stafilococco, streptococchi viridanti, enterococco.',
      'Tre coppie di emocolture a distanza di 30 min PRIMA dell’antibiotico (nel paziente stabile).',
      'Ecocardiogramma transtoracico subito, transesofageo se negativo con sospetto alto o protesi.',
      'Paziente stabile senza sepsi: si può attendere l’esito delle emocolture prima dell’antibiotico; instabile: antibiotico subito dopo le colture.',
      'Cardiochirurgo (Careggi) presto se: scompenso, ascesso/fistola, vegetazioni > 10 mm con embolia, infezione non controllata.',
      'Ictus embolico: niente trombolisi (rischio emorragico); trombectomia possibile.',
    ],
    sezioni: [
      {
        titolo: 'Empirica (70 kg, ESC 2023)',
        punti: [
          'Valvola nativa o protesi tardiva (> 12 mesi), comunitaria: ampicillina 12 g/die ev in 4–6 dosi + ceftriaxone 2 g ogni 12 h + oxacillina 12 g/die in 4–6 dosi (verificare disponibilità).',
          'Allergia ai betalattamici: vancomicina 30 mg/kg/die in 2 dosi + ceftriaxone (se allergia non grave).',
          'Protesi precoce (< 12 mesi) o legata all’assistenza: vancomicina 30 mg/kg/die + gentamicina 3 mg/kg/die; aggiungere rifampicina dopo 3–5 giorni (protesi).',
          'Dosaggi di vancomicina e gentamicina da monitorare (livelli, funzione renale).',
        ],
      },
    ],
    aggiornamenti: [{ data: '2023-08-25', testo: 'ESC 2023: criteri di Duke modificati con PET-TC e TC cardiaca; terapia orale parziale (POET) nei pazienti stabili.' }],
  },
  {
    id: 'febbre-viaggiatore',
    titolo: 'Febbre al rientro da un viaggio e malaria',
    ente: 'OMS',
    anno: 2024,
    area: 'Infettivologia',
    fonte: { etichetta: 'OMS: linee guida sulla malaria', url: 'https://www.who.int/publications/i/item/guidelines-for-malaria' },
    controllata: OGGI,
    vediAnche: [INF, { etichetta: 'Sepsi', to: '/linee-guida/sepsi' }, { etichetta: 'Meningite', to: '/linee-guida/meningite' }],
    inBreve: [
      'Febbre entro 3 mesi (fino a 1 anno) dal rientro da zona malarica = malaria fino a prova contraria: striscio e goccia spessa (o test rapido) SUBITO, ripetuti ogni 12–24 h per 3 volte se negativi.',
      'Anche chi è nato in zona endemica e torna da una visita ai parenti (VFR) perde l’immunità: rischio alto.',
      'Malaria grave (falciparum): alterazione della coscienza, convulsioni, parassitemia > 2–5%, Hb < 7, insufficienza renale, ipoglicemia, acidosi, edema polmonare, shock, ittero, sanguinamento → artesunato ev, rianimazione.',
      'Falciparum anche non grave: ricovero (può peggiorare in ore); infettivologo.',
      'Altre cause da non perdere: dengue (evitare FANS), febbri emorragiche virali (isolamento se rientro < 21 giorni da zone con focolai e sintomi compatibili: chiamare subito infettivi), tifo, rickettsiosi, leptospirosi, meningococco.',
    ],
    sezioni: [
      {
        titolo: 'Terapia (70 kg)',
        punti: [
          'Grave: artesunato 2,4 mg/kg = 168 mg ev a 0, 12, 24 h poi ogni 24 h (tramite Malattie infettive/farmacia), poi terapia orale completa.',
          'Non grave da falciparum: artemetere/lumefantrina (Riamet 20/120 mg) 4 cp a 0, 8, 24, 36, 48, 60 h con cibo grasso; oppure atovaquone/proguanil (Malarone) 4 cp/die per 3 giorni.',
          'Glicemia frequente (ipoglicemia, specie in gravidanza); liquidi con cautela (edema polmonare).',
          'Esami: emocromo (piastrine basse molto frequenti), creatinina, bilirubina, LDH, glicemia, lattati, emocolture.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2024-11-30', testo: 'OMS: artesunato ev prima scelta nella malaria grave; terapie combinate con artemisinina nella non complicata.' }],
  },
  {
    id: 'tubercolosi',
    titolo: 'Sospetta tubercolosi polmonare',
    ente: 'OMS · ECDC',
    anno: 2024,
    area: 'Pneumologia · Infettivologia',
    fonte: { etichetta: 'OMS: consolidated guidelines on tuberculosis', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=WHO+consolidated+guidelines+tuberculosis' },
    controllata: OGGI,
    vediAnche: [INF, { etichetta: 'Polmonite comunitaria', to: '/linee-guida/polmonite' }, { etichetta: 'Emottisi', to: '/linee-guida/emottisi' }],
    inBreve: [
      'Sospetto: tosse > 2–3 settimane, febbricola, sudorazioni notturne, calo di peso, emottisi; provenienza da paesi ad alta incidenza, contatti, HIV, senza fissa dimora, carcere, immunodepressione (biologici, steroidi).',
      'RX torace: infiltrati apicali, cavitazioni, adenopatie ilari, versamento; ma anche quadri atipici negli immunodepressi.',
      'Isolamento respiratorio subito (stanza singola, porta chiusa, idealmente a pressione negativa); FFP2 per gli operatori, mascherina chirurgica al paziente.',
      'Espettorato per microscopia, PCR (Xpert MTB/RIF) e coltura: 3 campioni a distanza di 8–24 h, almeno uno al mattino.',
      'Non iniziare la terapia antitubercolare in PS (salvo forme gravi, miliare, meningite): la decide l’infettivologo/pneumologo.',
      'Evitare i fluorochinoloni nelle polmoniti con sospetto di TBC (mascherano e creano resistenze).',
      'Notifica obbligatoria; test HIV.',
    ],
    sezioni: [
      {
        titolo: 'Contatti e operatori',
        punti: [
          'Segnalazione al servizio di Igiene pubblica per la ricerca dei contatti.',
          'Operatori esposti senza protezione: medico competente.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2024-01-01', testo: 'OMS: test molecolari rapidi (Xpert MTB/RIF Ultra) come test iniziale raccomandato.' }],
  },
  {
    id: 'pep-hiv-hbv',
    titolo: 'Profilassi post-esposizione (HIV, HBV, HCV)',
    ente: 'Ministero della Salute · CDC',
    anno: 2025,
    area: 'Infettivologia',
    fonte: { etichetta: 'Tanner et al., MMWR 2025 (CDC, nPEP)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Tanner+nonoccupational+postexposure+prophylaxis+HIV+MMWR+2025' },
    controllata: OGGI,
    vediAnche: [INF, { etichetta: 'Uretrite e PID', to: '/linee-guida/ist-pid' }],
    inBreve: [
      'Esposizioni: puntura/taglio con materiale biologico (operatori), schizzi su mucose, rapporti a rischio, violenza sessuale (Codice Rosa).',
      'Subito: lavare la ferita con acqua e sapone (non spremere, non disinfettanti caustici); mucose: irrigare con acqua/SF.',
      'PEP HIV il prima possibile (meglio entro 2–4 h), non oltre 72 h; durata 28 giorni. Infettivologo (o medico competente se operatore).',
      'Fonte nota: chiedere il consenso per test HIV, HBV, HCV della fonte; se la fonte è HIV+ con carica non rilevabile da > 6 mesi, rischio sessuale trascurabile.',
      'Esposto: test basali HIV, HBsAg, anti-HBs, anti-HBc, HCV, creatinina, test di gravidanza.',
      'Epatite C: nessuna profilassi; controlli (HCV-RNA) e trattamento precoce se infezione.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci',
        punti: [
          'HIV: tenofovir/emtricitabina (Truvada 245/200 mg) 1 cp/die + dolutegravir (Tivicay 50 mg) 1 cp/die per 28 giorni; alternativa raltegravir 400 mg ogni 12 h. Prima dose in PS, il resto dal centro di Malattie infettive.',
          'Epatite B, esposto non vaccinato o non responder: vaccino + immunoglobuline anti-HBV (HBIG) 0,06 mL/kg im entro 24 h (fino a 7 giorni).',
          'Esposto vaccinato con anti-HBs ≥ 10 noto: niente.',
          'Violenza sessuale: anche profilassi per IST (ceftriaxone 500 mg im, doxiciclina 100 mg ogni 12 h per 7 giorni, metronidazolo 2 g) e contraccezione d’emergenza.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2025-01-01', testo: 'CDC 2025: regimi preferiti basati su inibitori dell’integrasi (bictegravir o dolutegravir) + tenofovir/emtricitabina.' }],
  },
  {
    id: 'tetano-rabbia',
    titolo: 'Ferite e morsi: profilassi antitetanica e antirabbica',
    ente: 'Ministero della Salute · OMS',
    anno: 2024,
    area: 'Infettivologia · Trauma',
    fonte: { etichetta: 'PubMed: profilassi antitetanica nelle ferite', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=tetanus+prophylaxis+wound+management+recommendations' },
    controllata: OGGI,
    vediAnche: [INF, { etichetta: 'Dimissione: morso di animale', to: '/dimissioni' }, { etichetta: 'Dimissione: ferita suturata', to: '/dimissioni' }, { etichetta: 'Antibiotici: cellulite e morso', to: '/antibiotici?apri=cellulite' }],
    approfondimenti: [{ etichetta: 'OMS 2018: profilassi della rabbia (position paper)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=WHO+rabies+post-exposure+prophylaxis+position+paper+2018' }],
    inBreve: [
      'Ferita pulita e minore: vaccino (dT o dTpa) se < 3 dosi/sconosciuto o ultima dose ≥ 10 anni. Niente immunoglobuline.',
      'Ferita a rischio (contaminata con terra/feci/saliva, puntura, lacero-contusa, necrosi, morso, ustione, congelamento, frattura esposta, > 6 h): vaccino se ultima dose ≥ 5 anni; vaccino + immunoglobuline se < 3 dosi o storia sconosciuta.',
      'Immunodepressi gravi con ferita a rischio: immunoglobuline anche se vaccinati.',
      'Rabbia: Italia indenne, ma rischio per pipistrelli (qualunque contatto), animali importati o selvatici da zone a rischio, morsi avvenuti all’estero in paesi endemici → Malattie infettive/Igiene pubblica per la profilassi.',
      'Morso di cane o gatto in Italia: segnalazione al Servizio veterinario della ASL (osservazione dell’animale per 10 giorni).',
      'Morsi: lavaggio abbondante 15 min con acqua e sapone, sbrigliamento; mani e articolazioni a rischio di infezione; sutura primaria possibile al viso.',
    ],
    sezioni: [
      {
        titolo: 'Dosi',
        punti: [
          'Vaccino: dTpa (Boostrix) 0,5 mL im in deltoide; chi non ha il ciclo completo deve completarlo (0, 1, 6–12 mesi) dal curante/ufficio vaccinazioni.',
          'Immunoglobuline antitetaniche (Igantet) 250 UI im in sede diversa dal vaccino; 500 UI se ferita > 24 h, molto contaminata o ustioni estese.',
          'Morso a rischio: amoxicillina/clavulanato 875/125 mg ogni 12 h per 3–5 giorni (profilassi).',
          'Rabbia: vaccino + immunoglobuline antirabbiche infiltrate nella ferita secondo il protocollo dell’infettivologo.',
        ],
      },
    ],
    aggiornamenti: [{ data: OGGI, testo: 'Aggiunta: tabella decisionale per la profilassi antitetanica e indicazioni per la rabbia.' }],
  },
  {
    id: 'lisi-tumorale',
    titolo: 'Sindrome da lisi tumorale',
    ente: 'BSH · letteratura',
    anno: 2015,
    area: 'Ematologia · Nefrologia',
    fonte: { etichetta: 'Jones et al., Br J Haematol 2015 (BSH, sindrome da lisi tumorale)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Jones+guidelines+management+tumour+lysis+syndrome+2015' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Iperkaliemia', to: '/linee-guida/iperkaliemia' }, { etichetta: 'Rubrica: Oncologia · Ematologia', to: '/rubrica' }],
    inBreve: [
      'Dopo chemioterapia (o spontanea) in linfomi aggressivi, leucemie acute con leucociti alti, tumori grandi e chemiosensibili.',
      'Laboratorio (Cairo-Bishop): almeno 2 tra acido urico ≥ 8, K ≥ 6, fosforo ≥ 4,5 mg/dL, Ca corretto ≤ 7 mg/dL. Clinica: insufficienza renale, aritmie, convulsioni.',
      'Idratazione abbondante, rasburicase se acido urico alto, trattamento dell’iperkaliemia, nefrologo per la dialisi.',
      'Ipocalcemia: trattare solo se sintomatica (il calcio con fosforo alto precipita nei tessuti).',
      'Niente diuretici se ipovolemico; niente bicarbonato di routine.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Cristalloidi 3 L/m² al giorno (≈ 200–250 mL/h) per diuresi ≥ 100 mL/h.',
          'Rasburicase (Fasturtec) 0,2 mg/kg = 14 mg ev in 30 min (spesso basta una dose); controindicato nel deficit di G6PD. Prelievi per acido urico in ghiaccio.',
          'Allopurinolo 300 mg/die nella prevenzione (non se rasburicase in corso).',
          'Dialisi: K refrattario, anuria, sovraccarico, fosforo molto alto, ipocalcemia sintomatica.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2015-01-01', testo: 'BSH 2015: rasburicase nei pazienti ad alto rischio o con lisi conclamata.' }],
  },
  {
    id: 'falcemia',
    titolo: 'Crisi nella drepanocitosi (anemia falciforme)',
    ente: 'BSH · NICE',
    anno: 2023,
    area: 'Ematologia · Emergenze',
    fonte: { etichetta: 'NICE CG143: crisi vaso-occlusiva acuta', url: 'https://www.nice.org.uk/guidance/cg143' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Anemia e trasfusione', to: '/linee-guida/anemia-acuta' }, { etichetta: 'Rubrica: Ematologia', to: '/rubrica' }],
    inBreve: [
      'Crisi dolorosa: analgesia entro 30 min dall’arrivo, oppioide se il dolore è forte; credere al dolore del paziente.',
      'Sindrome toracica acuta (dolore toracico, febbre, desaturazione, infiltrato nuovo): grave, rianimazione/ematologo; antibiotico, ossigeno, trasfusione.',
      'Ictus, priapismo > 4 h, sequestro splenico (anemia acuta con milza che cresce), crisi aplastica (reticolociti bassi): emergenze → ematologo.',
      'Febbre: asplenia funzionale → antibiotico rapido dopo le colture.',
      'Ossigeno solo se SpO₂ < 95%; liquidi senza sovraccarico; incentivazione respiratoria.',
      'Trasfusione: non per il solo dolore; scambio (exchange) per ictus e sindrome toracica grave (ematologo).',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Morfina 0,1 mg/kg = 7 mg ev, poi 2–3 mg ogni 5–10 min a effetto (PCA dopo); paracetamolo 1 g; FANS se rene normale.',
          'Sindrome toracica: ceftriaxone 2 g ev + claritromicina 500 mg ogni 12 h.',
          'Profilassi antitrombotica; lassativi con gli oppioidi.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2023-01-01', testo: 'NICE: analgesia entro 30 minuti, rivalutazione ogni 30 minuti nella prima ora.' }],
  },
  {
    id: 'emofilia',
    titolo: 'Emofilia e malattia di von Willebrand: sanguinamento',
    ente: 'WFH',
    anno: 2020,
    area: 'Ematologia · Emergenze',
    fonte: { etichetta: 'Srivastava et al., Haemophilia 2020 (WFH)', url: 'https://doi.org/10.1111/hae.14046' },
    controllata: OGGI,
    vediAnche: [{ etichetta: 'Trauma cranico', to: '/linee-guida/trauma-cranico' }, { etichetta: 'Rubrica: Centro emofilia', to: '/rubrica' }],
    inBreve: [
      'Fattore prima, esami dopo: in un emofilico con sanguinamento importante o trauma cranico, dare il fattore subito, prima della TC.',
      'Il paziente o la famiglia di solito sa il tipo, la gravità, il prodotto e la dose: ascoltarli; spesso ha il farmaco con sé. Chiamare il Centro emofilia (Careggi).',
      'Sanguinamenti gravi: intracranico, collo/gola, addominale/retroperitoneale (ileopsoas), compartimentale, emorragia digestiva, trauma maggiore.',
      'Niente iniezioni im, niente FANS; acido tranexamico utile nei sanguinamenti mucosi (non nell’ematuria).',
      'In profilassi con emicizumab (Hemlibra): gli esami della coagulazione sono falsati; per sanguinamento usare il fattore VIII, evitare il complesso protrombinico attivato (aPCC).',
      'Pazienti con inibitori: agenti bypassanti (fattore VII attivato) secondo il Centro.',
    ],
    sezioni: [
      {
        titolo: 'Dosi (70 kg)',
        punti: [
          'Emofilia A, sanguinamento grave: fattore VIII 50 UI/kg = 3.500 UI ev (obiettivo 80–100%); 1 UI/kg alza di circa il 2%.',
          'Emofilia B, sanguinamento grave: fattore IX 100 UI/kg = 7.000 UI ev (ricombinante: dose più alta secondo prodotto); 1 UI/kg alza di circa l’1%.',
          'Sanguinamento articolare/muscolare minore: metà dose (A: 25 UI/kg; B: 40–50 UI/kg).',
          'Von Willebrand o emofilia A lieve: desmopressina 0,3 µg/kg = 21 µg ev in 30 min (se responsivo noto); oppure concentrato con fattore di von Willebrand.',
          'Acido tranexamico 1 g ev o per bocca ogni 8 h nei sanguinamenti mucosi.',
        ],
      },
    ],
    aggiornamenti: [{ data: '2020-08-01', testo: 'WFH 2020: trattamento immediato prima degli accertamenti; gestione con emicizumab e nei pazienti con inibitori.' }],
  },
]

export const ALG_OST_INF_EMA: Alg = {
  'metrorragia-primo-trimestre': {
    titolo: 'Algoritmo sanguinamento nel primo trimestre',
    nota: 'NICE NG126.',
    nodi: [
      { tipo: 'avvio', titolo: 'Donna in età fertile con sanguinamento o dolore pelvico', righe: ['Test di gravidanza.'] },
      { tipo: 'decisione', titolo: 'Instabile?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Ginecologo subito', righe: ['2 accessi, prove crociate, eco FAST.'], vai: [{ etichetta: 'Extrauterina', to: '/linee-guida/extrauterina' }] }] },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'checklist', titolo: 'Esami', righe: ['β-hCG quantitativa', 'Gruppo e Rh, emocromo', 'Ecografia transvaginale (ginecologo)'] },
              { tipo: 'decisione', titolo: 'Ecografia?' },
              {
                tipo: 'rami', rami: [
                  { etichetta: 'Intrauterina', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Gestione ginecologica', righe: ['Minaccia, aborto in corso/incompleto/completo.'] }] },
                  { etichetta: 'Sede non nota', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'β-hCG a 48 h', righe: ['Avvertenze per il ritorno (dolore, sincope, sangue).'] }] },
                  { etichetta: 'Extrauterina', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'PDTA extrauterina' }] },
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'nota', titolo: 'Rh negativa', righe: ['Anti-D secondo il protocollo ginecologico. Febbre: aborto settico → antibiotico ed evacuazione.'] },
    ],
  },
  'emorragia-post-partum': {
    titolo: 'Algoritmo emorragia post-partum',
    nota: 'OMS 2023. Tutto insieme, non in sequenza.',
    nodi: [
      { tipo: 'avvio', titolo: 'Perdita ≥ 500 mL o instabilità dopo il parto' },
      { tipo: 'checklist', titolo: 'Subito, insieme', righe: ['Chiamare ginecologo, ostetrica, anestesista', '2 accessi grossi, prove crociate, fibrinogeno', 'Massaggio uterino, svuotare la vescica', 'Ossitocina 5 UI ev, poi 40 UI in 500 mL', 'Acido tranexamico 1 g ev'] },
      { tipo: 'decisione', titolo: 'Causa (4 T)?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Tono', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Uterotonici', righe: ['Metilergometrina 0,2 mg im (no se ipertesa), misoprostolo 800 µg, sulprostone (ginecologo).'] }] },
          { etichetta: 'Trauma', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'Sutura delle lacerazioni; inversione: riposizionare' }] },
          { etichetta: 'Tessuto', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'Rimozione della placenta (sala)' }] },
          { etichetta: 'Trombina', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Emocomponenti', righe: ['Fibrinogeno 4 g se < 2 g/L, plasma, piastrine.'] }] },
        ],
      },
      { tipo: 'allarme', titolo: 'Continua', righe: ['Trasfusione massiva, balloon intrauterino, embolizzazione, chirurgia.'], vai: [{ etichetta: 'Modulo trasfusione', to: '/modulo-trasfusione' }] },
    ],
  },
  'parto-precipitoso': {
    titolo: 'Algoritmo parto in PS',
    nodi: [
      { tipo: 'avvio', titolo: 'Parto imminente', righe: ['Chiamare ostetrica, ginecologo, neonatologo; kit parto, telini caldi.'] },
      { tipo: 'passo', titolo: 'Testa', righe: ['Accompagnare senza trattenere né tirare; controllare il cordone attorno al collo.'] },
      { tipo: 'decisione', titolo: 'Le spalle escono?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'No', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Distocia di spalla', righe: ['Aiuto; McRoberts + pressione sovrapubica.', 'No pressione sul fondo, no trazione forte.'] }] },
          { etichetta: 'Sì', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Espulsione', righe: ['Spalla anteriore poi posteriore.'] }] },
        ],
      },
      { tipo: 'checklist', titolo: 'Neonato', righe: ['Asciugare, stimolare, pelle a pelle, coprire', 'Clampaggio dopo 1–3 min se vigoroso', 'Non respira: neonatologo, ventilazione'] },
      { tipo: 'terapia', titolo: 'Madre', righe: ['Ossitocina 10 UI im; non tirare il cordone; controllo delle perdite.'] },
    ],
  },
  'gravidanza-trauma-acr': {
    titolo: 'Algoritmo trauma e arresto in gravidanza',
    nota: 'ERC 2025.',
    nodi: [
      { tipo: 'avvio', titolo: 'Gravida > 20 settimane (fondo all’ombelico)' },
      { tipo: 'passo', titolo: 'Spostare l’utero a sinistra', righe: ['Manualmente o inclinando 15–30°.'] },
      { tipo: 'decisione', titolo: 'Arresto cardiaco?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'RCP + cesareo perimortem entro 4–5 min', righe: ['Via aerea precoce, accessi sopra il diaframma.', 'Cause: emorragia, embolia, eclampsia, LAST, cardiomiopatia.'], vai: [{ etichetta: 'ACR', to: '/acr' }] }] },
          { etichetta: 'No (trauma)', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'ABCDE come sempre', righe: ['Imaging necessario non si nega.'], vai: [{ etichetta: 'Trauma maggiore', to: '/linee-guida/trauma-maggiore' }] }] },
        ],
      },
      { tipo: 'checklist', titolo: 'Dopo il trauma', righe: ['Cardiotocografia ≥ 4–6 h', 'Kleihauer; anti-D se Rh negativa', 'Chiedere di violenza domestica'] },
    ],
  },
  'artrite-settica': {
    titolo: 'Algoritmo monoartrite acuta',
    nodi: [
      { tipo: 'avvio', titolo: 'Articolazione calda, gonfia, dolorosa' },
      { tipo: 'decisione', titolo: 'Settico/instabile?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Emocolture → antibiotico subito', righe: ['Poi artrocentesi.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Artrocentesi prima', righe: ['Leucociti, Gram, coltura, cristalli; emocolture.', 'Protesi: ortopedico prima di tutto.'] }] },
        ],
      },
      { tipo: 'decisione', titolo: 'Leucociti > 50.000 o Gram positivo?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Antibiotico + ortopedico', righe: ['Cefazolina 2 g ogni 8 h; MRSA: vancomicina + ceftriaxone; gonococco: ceftriaxone.', 'Lavaggio articolare.'] }] },
          { etichetta: 'No, cristalli', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'Artrite da cristalli', righe: ['Colchicina/FANS/steroide; dubbio: trattare come settica.'] }] },
        ],
      },
    ],
  },
  'ist-pid': {
    titolo: 'Algoritmo uretrite / PID',
    nota: 'CDC 2021.',
    nodi: [
      { tipo: 'avvio', titolo: 'Secrezione uretrale, cervicite o dolore pelvico', righe: ['Test di gravidanza nella donna.'] },
      { tipo: 'checklist', titolo: 'Esami', righe: ['PCR gonococco e clamidia (urine/tampone)', 'HIV, sifilide, HBV, HCV', 'Ecografia pelvica se PID'] },
      { tipo: 'decisione', titolo: 'Quadro?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Uretrite/cervicite', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Ceftriaxone 500 mg im + doxiciclina 7 giorni' }] },
          { etichetta: 'PID lieve', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Domicilio', righe: ['Ceftriaxone 500 mg im + doxiciclina + metronidazolo 14 giorni; controllo a 72 h.'] }] },
          { etichetta: 'PID grave, ascesso, gravidanza', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Ricovero (ginecologo)', righe: ['Ceftriaxone 1 g ev + doxiciclina + metronidazolo.'] }] },
        ],
      },
      { tipo: 'nota', titolo: 'Sempre', righe: ['Trattare i partner; niente rapporti per 7 giorni; notifica.'] },
    ],
  },
  endocardite: {
    titolo: 'Algoritmo sospetta endocardite',
    nota: 'ESC 2023.',
    nodi: [
      { tipo: 'avvio', titolo: 'Febbre + fattore di rischio', righe: ['Protesi, dispositivo, soffio nuovo, tossicodipendenza ev, embolie.'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['3 coppie di emocolture (30 min)', 'Ecocardio transtoracico', 'ECG (blocchi AV = ascesso)', 'Creatinina, emocromo, PCR, urine'] },
      { tipo: 'decisione', titolo: 'Sepsi o instabile?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Empirica subito dopo le colture', righe: ['Nativa/protesi tardiva: ampicillina + ceftriaxone + oxacillina.', 'Protesi precoce/assistenza: vancomicina + gentamicina.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Si può attendere le colture', righe: ['Infettivologo/cardiologo; ETE.'] }] },
        ],
      },
      { tipo: 'allarme', titolo: 'Cardiochirurgo (Careggi) se', righe: ['Scompenso, ascesso, vegetazione > 10 mm con embolie, infezione non controllata.', 'Ictus embolico: NO trombolisi.'] },
    ],
  },
  'febbre-viaggiatore': {
    titolo: 'Algoritmo febbre al rientro',
    nota: 'Malaria fino a prova contraria.',
    nodi: [
      { tipo: 'avvio', titolo: 'Febbre e viaggio negli ultimi 3–12 mesi', righe: ['Dove, quando, profilassi, punture, acqua, rapporti, animali.'] },
      { tipo: 'decisione', titolo: 'Rientro < 21 giorni da focolaio di febbre emorragica con sintomi compatibili?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Isolamento e Malattie infettive subito', righe: ['Minimo personale, DPI completi.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Proseguire' }] },
        ],
      },
      { tipo: 'checklist', titolo: 'Zona malarica: subito', righe: ['Striscio + goccia spessa o test rapido', 'Emocromo, creatinina, bilirubina, glicemia, lattati', 'Emocolture'] },
      { tipo: 'decisione', titolo: 'Malaria?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Grave', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Artesunato 168 mg ev', righe: ['A 0, 12, 24 h; rianimazione; infettivologo.'] }] },
          { etichetta: 'Falciparum non grave', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Ricovero', righe: ['Riamet 4 cp × 6 dosi o Malarone 4 cp/die × 3.'] }] },
          { etichetta: 'Negativa', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Ripetere a 12–24 h × 3', righe: ['Cercare dengue (no FANS), tifo, rickettsie, leptospira.'] }] },
        ],
      },
    ],
  },
  tubercolosi: {
    titolo: 'Algoritmo sospetta TBC',
    nodi: [
      { tipo: 'avvio', titolo: 'Tosse > 2–3 settimane, febbre, calo di peso, emottisi', righe: ['Provenienza, contatti, HIV, immunodepressione.'] },
      { tipo: 'allarme', titolo: 'Isolamento respiratorio subito', righe: ['Stanza singola; FFP2 agli operatori; mascherina chirurgica al paziente.'] },
      { tipo: 'checklist', titolo: 'Esami', righe: ['RX torace', 'Espettorato × 3: microscopia, PCR, coltura', 'Test HIV', 'Niente fluorochinoloni empirici'] },
      { tipo: 'esito', titolo: 'Infettivologo/pneumologo', righe: ['Terapia decisa da loro; notifica; Igiene pubblica per i contatti.'] },
    ],
  },
  'pep-hiv-hbv': {
    titolo: 'Algoritmo profilassi post-esposizione',
    nodi: [
      { tipo: 'avvio', titolo: 'Esposizione a sangue o liquidi biologici', righe: ['Puntura, mucose, rapporto a rischio, violenza sessuale.'] },
      { tipo: 'passo', titolo: 'Lavare subito', righe: ['Acqua e sapone; mucose con acqua/SF.'] },
      { tipo: 'checklist', titolo: 'Esami', righe: ['Esposto: HIV, HBsAg, anti-HBs, anti-HBc, HCV, creatinina, β-hCG', 'Fonte (con consenso): HIV, HBV, HCV'] },
      { tipo: 'decisione', titolo: 'Rischio HIV significativo ed entro 72 h?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'PEP 28 giorni', righe: ['Truvada 1 cp + Tivicay 50 mg 1 cp/die; prima dose in PS.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Solo controlli' }] },
        ],
      },
      { tipo: 'terapia', titolo: 'HBV', righe: ['Non vaccinato/non responder: vaccino + HBIG entro 24 h.'] },
      { tipo: 'esito', titolo: 'Infettivologo (o medico competente)', righe: ['Controlli a 6 settimane e 3 mesi; violenza: Codice Rosa, profilassi IST, contraccezione.'] },
    ],
  },
  'tetano-rabbia': {
    titolo: 'Algoritmo profilassi antitetanica',
    nodi: [
      { tipo: 'avvio', titolo: 'Ferita, morso o ustione', righe: ['Dosi di vaccino ricevute e data dell’ultima.'] },
      { tipo: 'decisione', titolo: 'Tipo di ferita?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Pulita, minore', tono: 'si', nodi: [
              { tipo: 'passo', titolo: 'Vaccino se', righe: ['< 3 dosi/sconosciuto, o ultima ≥ 10 anni.', 'Niente immunoglobuline.'] },
            ],
          },
          {
            etichetta: 'A rischio', tono: 'no', nodi: [
              { tipo: 'passo', titolo: 'Vaccino se', righe: ['Ultima dose ≥ 5 anni.'] },
              { tipo: 'terapia', titolo: '+ immunoglobuline se', righe: ['< 3 dosi o sconosciuto (o immunodepresso grave).', 'Igantet 250 UI im (500 UI se > 24 h o molto contaminata).'] },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Morso di animale?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Pipistrello, animale estero/selvatico a rischio, morso all’estero', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Profilassi antirabbica', righe: ['Malattie infettive / Igiene pubblica.'] }] },
          { etichetta: 'Cane o gatto in Italia', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'Segnalazione al Servizio veterinario ASL', righe: ['Lavaggio, amoxicillina/clavulanato se a rischio.'] }] },
        ],
      },
    ],
  },
  'lisi-tumorale': {
    titolo: 'Algoritmo sindrome da lisi tumorale',
    nota: 'BSH 2015.',
    nodi: [
      { tipo: 'avvio', titolo: 'Neoplasia ematologica/chemiosensibile con alterazioni elettrolitiche' },
      { tipo: 'checklist', titolo: 'Subito', righe: ['K, fosforo, Ca, acido urico (in ghiaccio), creatinina', 'ECG', 'Diuresi oraria'] },
      { tipo: 'decisione', titolo: 'K ≥ 6 o aritmie?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'PDTA iperkaliemia', vai: [{ etichetta: 'Iperkaliemia', to: '/linee-guida/iperkaliemia' }] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Proseguire' }] },
        ],
      },
      { tipo: 'terapia', titolo: 'Idratazione + rasburicase', righe: ['200–250 mL/h; rasburicase 14 mg ev (no deficit G6PD).', 'Ca solo se ipocalcemia sintomatica.'] },
      { tipo: 'decisione', titolo: 'Anuria, sovraccarico, K refrattario?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Nefrologo: dialisi' }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Ematologia; esami ogni 6–8 h' }] },
        ],
      },
    ],
  },
  falcemia: {
    titolo: 'Algoritmo drepanocitosi',
    nodi: [
      { tipo: 'avvio', titolo: 'Paziente con drepanocitosi', righe: ['Dolore, febbre, dispnea, deficit, priapismo, pallore.'] },
      { tipo: 'terapia', titolo: 'Analgesia entro 30 min', righe: ['Morfina 7 mg ev, poi 2–3 mg ogni 5–10 min; paracetamolo.'] },
      { tipo: 'checklist', titolo: 'Esami', righe: ['Emocromo e reticolociti, gruppo', 'Creatinina, LDH, bilirubina', 'SpO₂, RX torace se sintomi', 'Emocolture se febbre'] },
      { tipo: 'decisione', titolo: 'Complicanza grave?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sindrome toracica', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Ossigeno, antibiotico, trasfusione', righe: ['Ceftriaxone + claritromicina; ematologo/rianimazione.'] }] },
          { etichetta: 'Ictus, priapismo, sequestro, aplasia', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Ematologo subito', righe: ['Exchange per l’ictus.'] }] },
          { etichetta: 'Solo dolore', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Analgesia, liquidi, rivalutare ogni 30 min' }] },
        ],
      },
    ],
  },
  emofilia: {
    titolo: 'Algoritmo emofilico che sanguina',
    nota: 'WFH 2020. Fattore prima degli esami.',
    nodi: [
      { tipo: 'avvio', titolo: 'Emofilico/von Willebrand con trauma o sanguinamento', righe: ['Tipo, gravità, inibitori, prodotto abituale: chiedere al paziente.'] },
      { tipo: 'decisione', titolo: 'Sanguinamento grave o trauma cranico?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Fattore subito, poi TC', righe: ['A: fattore VIII 3.500 UI ev. B: fattore IX 7.000 UI ev.', 'Inibitori: bypassanti secondo il Centro.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Mezza dose', righe: ['A: 25 UI/kg; B: 40–50 UI/kg; tranexamico se mucoso.'] }] },
        ],
      },
      { tipo: 'esito', titolo: 'Centro emofilia (Careggi)', righe: ['No im, no FANS; emicizumab: usare fattore VIII, evitare aPCC.'] },
    ],
  },
}

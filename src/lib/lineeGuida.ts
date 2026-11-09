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
  /** testi completi interrogabili dalla barra delle domande (id come in supabase/functions/emergenze-chiedi) */
  fonti?: { id: string; etichetta: string }[]
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
    fonti: [{ id: 'esc-fa-2024', etichetta: 'ESC 2024' }],
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
  {
    id: 'scompenso-cardiaco',
    titolo: 'Scompenso cardiaco',
    ente: 'ESC',
    anno: 2026,
    area: 'Cardiologia',
    fonte: { etichetta: 'Køber, Adamo et al., Eur Heart J 2026', url: 'https://doi.org/10.1093/eurheartj/ehag100' },
    controllata: '2026-11-09',
    fonti: [{ id: 'esc-sc-2026', etichetta: 'ESC 2026' }],
    calcolatori: [{ id: 'cockcroft', nome: 'Clearance creatinina' }],
    inBreve: [
      'Nuovi nomi: «scompenso decompensato» al posto di «acuto»; solo due fenotipi, HFrEF (FE <50%) e HFpEF (FE ≥50%). HFmrEF non esiste più.',
      'In PS: definire il profilo (congestione sì/no, ipoperfusione sì/no) e cercare subito il fattore scatenante (SCA, ipertensione, aritmia, causa meccanica, embolia polmonare, infezione).',
      'Decongestione con diuretico dell’ansa ev e verifica precoce della risposta (natriuresi e diuresi): se insufficiente, aumentare la dose.',
      'Congestione che resiste in chi prendeva già il diuretico dell’ansa: aggiungere per pochi giorni acetazolamide ev o idroclorotiazide os (IIa).',
      'SGLT2-inibitore da iniziare in ospedale dopo la stabilizzazione (I). MRA raccomandato a qualunque FE (I).',
      'Shock cardiogeno: coinvolgere lo shock team. Il supporto meccanico temporaneo non va usato di routine nello shock da infarto non selezionato (III).',
    ],
    sezioni: [
      {
        titolo: 'Inquadramento in PS',
        punti: [
          'ECG, temperatura e parametri subito; troponina, peptidi natriuretici, creatinina ed elettroliti; lattati subito se instabile con sospetta ipoperfusione; ecocardiogramma precoce, ecografia polmonare utile per la congestione.',
          'Peptidi che escludono lo scompenso (non corretti per età): NT-proBNP <300 pg/mL, BNP <100, MR-proANP <120. Se il sospetto resta, eco e specialista. Soglie per età per renderlo «probabile» nella Figura 11.',
          'NT-proBNP >5000 pg/mL: rischio molto alto, di norma ricovero.',
          'Profili: caldo-umido (il più frequente), freddo-umido, freddo-secco, caldo-secco. L’ipoperfusione (estremità fredde, oliguria, confusione, lattati alti) cambia la terapia più della pressione da sola.',
        ],
      },
      {
        titolo: 'Ossigeno e ventilazione',
        punti: [
          'Ossigeno solo se SpO₂ <90% o PaO₂ <60 mmHg (I): darlo a chi non è ipossiemico può nuocere.',
          'Ventilazione non invasiva da iniziare il prima possibile se distress respiratorio, FR >25 o SpO₂ <90% (IIa). Cautela se ipoteso o con scompenso destro: riduce il precarico.',
          'Intubazione se l’insufficienza respiratoria persiste o peggiora nonostante ossigeno o NIV (I).',
        ],
      },
      {
        titolo: 'Diuretici',
        punti: [
          'Furosemide ev 40 mg se mai trattato con diuretici; se già in terapia, il doppio della dose orale abituale. Dose iniziale più alta se insufficienza renale cronica. Bolo o infusione continua sono equivalenti.',
          'Risposta adeguata: sodio urinario ≥70 mEq/L a 2 h oppure diuresi ≥100 mL/h nelle prime 6 h. Se insufficiente: raddoppiare la dose ev e/o aggiungere un diuretico non dell’ansa.',
          'Dopo 24 h: se la diuresi totale è <3 L e la congestione persiste, aumentare ancora nel secondo giorno. Dose massima abituale furosemide 600 mg/die (fino a 1000 mg se funzione renale molto ridotta).',
          'Già in diuretico dell’ansa con sovraccarico (IIa): acetazolamide 500 mg ev una volta al giorno, oppure idroclorotiazide os 25 mg (eGFR >50), 50 mg (eGFR 20–50), 100 mg (eGFR <20). Nell’IRC avanzata meglio l’acetazolamide. Con l’idroclorotiazide attenzione a ipopotassiemia e funzione renale.',
          'Un piccolo aumento transitorio della creatinina non è un problema se la decongestione procede. Liquidi assunti inferiori alla diuresi; MRA e potassio se ipopotassiemia.',
        ],
      },
      {
        titolo: 'Vasodilatatori, inotropi, vasopressori',
        punti: [
          'Nitroglicerina o nitroprussiato ev utili soprattutto nell’edema polmonare con pressione alta e poca ritenzione di liquidi; monitorare la pressione, l’ipotensione è dannosa. Riducono le intubazioni, non la mortalità. Dosi nella tabella supplementare S14 (uso comune: nitroglicerina da 10–20 µg/min, fino a 200 µg/min).',
          'Inotropi solo se PAS <90 mmHg con ipoperfusione che non risponde al trattamento standard, compreso un carico di liquidi. In chi prende beta-bloccanti meglio levosimendan o inibitori PDE-III rispetto alla dobutamina.',
          'Vasopressore se ipoteso: noradrenalina prima scelta (rispetto a dopamina e adrenalina).',
          'Oppioidi non di routine: solo ansia o distress grave refrattari, con cautela per il rischio respiratorio.',
        ],
      },
      {
        titolo: 'Shock cardiogeno (2026)',
        punti: [
          'Shock team multidisciplinare per i candidati a supporto meccanico temporaneo (I).',
          'Pompa microassiale (es. Impella) da considerare nello shock da STEMI con disfunzione VS e senza rischio di danno cerebrale anossico (IIa).',
          'Supporto meccanico temporaneo come ponte nelle complicanze meccaniche dell’infarto (IIa); non di routine nello shock da infarto non selezionato (III, rischio di danno).',
        ],
      },
      {
        titolo: 'Prima della dimissione (2026)',
        punti: [
          'Terapia fondamentale per tutti gli scompensi, a qualunque FE: SGLT2-inibitore e MRA (classe I).',
          'In più nella HFrEF: ACE-inibitore o ARNI (ARB se non tollerati) e beta-bloccante. Nella HFpEF ACE-i/ARB/ARNI solo «possono essere considerati» (IIb).',
          'Dosi iniziali cambiate nel 2026: ramipril 1,25–2,5 mg x2, spironolattone 12,5–25 mg, losartan (12,5) 25–50 mg. Finerenone 10–20 mg, poi 20–40 mg.',
          'HFpEF con FE ≥45% e BMI ≥30: semaglutide o tirzepatide da considerare, con o senza diabete.',
          'Prima della dimissione escludere congestione residua (I). Avvio rapido e titolazione della terapia fondamentale con controlli frequenti nelle prime 6 settimane (I).',
          'Riabilitazione cardiologica appena sicuro (IIa).',
        ],
      },
    ],
    aggiornamenti: [
      {
        data: '2026-11-09',
        testo: 'Riassunto controllato sul testo completo 2026 (sezione 7, scompenso decompensato, e tabelle delle raccomandazioni).',
      },
      {
        data: '2026-08-28',
        testo: 'Nuova linea guida ESC: sostituisce la 2021 e l’aggiornamento 2023. Stadi A–D, due fenotipi, nuovi nomi delle terapie (fondamentale, aggiuntiva, interventistica), MRA in classe I a qualunque FE, 39 raccomandazioni nuove.',
        link: { etichetta: 'Comunicato ESC', url: 'https://www.escardio.org/news/press/press-releases/major-changes-made-to-the-esc-guidelines-on-heart-failure/' },
      },
    ],
  },
  {
    id: 'embolia-polmonare',
    titolo: 'Embolia polmonare',
    ente: 'AHA/ACC 2026 vs ESC 2019',
    anno: 2026,
    area: 'Cardiologia · Pneumologia',
    fonte: { etichetta: 'Creager et al., Circulation 2026 (AHA/ACC)', url: 'https://doi.org/10.1161/CIR.0000000000001415' },
    controllata: '2026-11-09',
    fonti: [
      { id: 'aha-ep-2026', etichetta: 'AHA/ACC 2026' },
      { id: 'esc-ep-2019', etichetta: 'ESC 2019' },
    ],
    calcolatori: [
      { id: 'wells-ep', nome: 'Wells EP' },
      { id: 'perc', nome: 'PERC' },
      { id: 'spesi', nome: 'sPESI' },
    ],
    inBreve: [
      'Diagnosi (le due linee guida concordano): probabilità clinica (Wells o Ginevra) → se bassa, PERC → D-dimero con soglia per età dopo i 50 anni (età × 10 µg/L) → angio-TC. Se la probabilità è alta: direttamente imaging, e anticoagulare in attesa se il rischio emorragico lo consente.',
      'Gravità: l’AHA 2026 introduce 5 categorie (A–E); l’ESC 2019 usa basso, intermedio-basso, intermedio-alto, alto rischio. Tabella di corrispondenza sotto.',
      'Anticoagulazione: EBPM preferita all’ENF (AHA classe 1; ESC: EBPM o fondaparinux preferiti). ENF se instabile, se è probabile la trombolisi o se l’insufficienza renale è grave. Per la terapia orale DOAC.',
      'Instabile (AHA E / ESC alto rischio): trombolisi sistemica; se controindicata o fallita, trattamento con catetere o chirurgia.',
      'Basso rischio (AHA A–B / ESC basso): trattamento a domicilio ragionevole, con anticoagulante subito disponibile e controllo programmato.',
      'Attenzione al ventricolo destro: sedazione profonda e intubazione possono far precipitare il circolo; liquidi solo con cautela.',
    ],
    sezioni: [
      {
        titolo: 'Categorie AHA/ACC 2026 e corrispondenza ESC',
        punti: [
          'A: EP asintomatica o trovata per caso → nessun ricovero necessario.',
          'B: sintomatica, gravità bassa (sPESI 0, PESI ≤85, Bova ≤4) ≈ ESC basso rischio → di solito domicilio.',
          'C: gravità aumentata (score alto e/o biomarcatori e/o disfunzione VD), emodinamica stabile; C1–C3 secondo quante anomalie ≈ ESC intermedio → ricovero.',
          'D: insufficienza cardiopolmonare incipiente. D1 ipotensione transitoria (es. sincope), D2 shock normoteso (lattati alti, insufficienza renale acuta) ≈ ESC intermedio-alto con segni di peggioramento.',
          'E: insufficienza cardiopolmonare, ipotensione persistente o arresto ≈ ESC alto rischio.',
        ],
      },
      {
        titolo: 'Trombolisi e terapie avanzate',
        punti: [
          'AHA 2026: categoria E → trombolisi sistemica, trattamento con catetere o trombectomia meccanica (2a). Categoria D e C3 → stesse opzioni con beneficio incerto (2b). Categoria C → non di routine. Team PERT multidisciplinare per C–E (classe 1).',
          'ESC 2019: alto rischio → trombolisi sistemica (I). Intermedio-alto → trombolisi non di routine (III); trombolisi «di salvataggio» se l’emodinamica peggiora (I). Chirurgia o catetere se la trombolisi è controindicata o fallita.',
          'Dosi ESC: alteplase 100 mg in 2 h, oppure 0,6 mg/kg in 15 min (max 50 mg) nel regime accelerato. ENF: bolo 80 U/kg, poi 18 U/kg/h.',
          'AHA 2026: la quantità di trombo alla TC non serve a stratificare le categorie A–C (classe 3).',
        ],
      },
      {
        titolo: 'Supporto emodinamico',
        punti: [
          'Liquidi: al massimo un bolo cauto (≤500 mL) se PVC bassa; il VD dilatato peggiora con il sovraccarico.',
          'Noradrenalina come vasopressore di prima scelta; dobutamina se bassa portata.',
          'Ossigeno se SpO₂ <90%. Evitare se possibile intubazione e sedazione profonda: ipotensione e arresto all’induzione (avvertenza esplicita nell’AHA 2026, anche nel paziente normoteso).',
        ],
      },
      {
        titolo: 'Arresto cardiaco da EP (ERC/IRC)',
        punti: [
          'Se l’EP è la causa sospetta: trombolisi durante la rianimazione.',
          'Dopo la trombolisi continuare la RCP per 60–90 minuti prima di interrompere. Valutare ECMO o embolectomia dove disponibili.',
          'Fonte: linee guida ERC 2021 (tradotte da IRC); da ricontrollare sull’edizione ERC 2025.',
        ],
      },
      {
        titolo: 'Dimissione dal PS',
        punti: [
          'ESC: criteri Hestia oppure sPESI 0, senza disfunzione VD né troponina alta, con anticoagulante e controllo assicurati.',
          'AHA 2026: categorie A e B gestibili a domicilio con anticoagulante subito disponibile e controllo strutturato.',
          'Anticoagulazione per almeno 3 mesi; poi decidere sulla prosecuzione secondo il fattore di rischio.',
        ],
      },
    ],
    aggiornamenti: [
      {
        data: '2026-11-09',
        testo: 'Nessuna nuova linea guida ESC sull’EP dopo il 2019. Per il confronto AHA vs Europa ho usato l’ESC 2019 e, per l’arresto cardiaco, le raccomandazioni ERC/IRC.',
      },
      {
        data: '2026-02-19',
        testo: 'Prima linea guida AHA/ACC sull’EP acuta (con ACEP, CHEST, SCAI e altre). Categorie A–E, EBPM preferita all’ENF, PERT in classe 1 per le categorie C–E.',
        link: { etichetta: 'AHA: cosa c’è di nuovo', url: 'https://professional.heart.org/en/science-news/2026-guideline-for-the-evaluation-and-management-of-acute-pulmonary-embolism-in-adults' },
      },
      {
        data: '2019-08-31',
        testo: 'ESC 2019 (con ERS): D-dimero per età e per probabilità clinica, valutazione del VD anche se sPESI 0, DOAC prima scelta, team multidisciplinare.',
        link: { etichetta: 'Testo ESC 2019', url: 'https://doi.org/10.1093/eurheartj/ehz405' },
      },
    ],
  },
  {
    id: 'stemi',
    titolo: 'STEMI',
    ente: 'ESC 2023 · ACC/AHA 2025',
    anno: 2025,
    area: 'Cardiologia',
    fonte: { etichetta: 'Byrne et al., Eur Heart J 2023 (ESC SCA)', url: 'https://doi.org/10.1093/eurheartj/ehad191' },
    controllata: '2026-11-09',
    fonti: [
      { id: 'esc-sca-2023', etichetta: 'ESC 2023' },
      { id: 'aha-sca-2025', etichetta: 'ACC/AHA 2025' },
    ],
    inBreve: [
      'ECG entro 10 minuti dal primo contatto. Trattare come STEMI anche: blocco di branca o ritmo da pacemaker con sintomi ischemici; ST sottoslivellato V1–V3 (registrare V7–V9 per il posteriore).',
      'PCI primaria se dalla diagnosi al passaggio del filo passano ≤120 minuti; altrimenti fibrinolisi entro 10 minuti dalla diagnosi e trasferimento al centro PCI.',
      'Dopo fibrinolisi: PCI di salvataggio se la risoluzione dell’ST è <50% a 60–90 minuti; altrimenti coronarografia entro 2–24 ore.',
      'Subito: aspirina 150–300 mg os (o 75–250 mg ev) ed eparina non frazionata 70–100 U/kg ev. Pretrattamento con inibitore P2Y12 prima della coronarografia: «può essere considerato» nella PCI primaria, non di routine nelle NSTE-SCA.',
      'Ossigeno solo se SpO₂ <90%. Arresto cardiaco rianimato con ST sopraslivellato: PCI primaria.',
    ],
    sezioni: [
      {
        titolo: 'Tempi (ESC 2023)',
        punti: [
          'Primo contatto → ECG e diagnosi: ≤10 min.',
          'Diagnosi → filo: ≤60 min se il paziente arriva in un centro PCI, ≤90 min se trasferito; oltre 120 min previsti → fibrinolisi.',
          'Diagnosi → bolo di fibrinolitico: ≤10 min. Fibrinolisi → valutazione dell’efficacia: 60–90 min. Fibrinolisi → coronarografia: 2–24 h.',
          'I tempi stanno nella figura dei ritardi dell’ESC: dal testo ho verificato solo ECG ≤10 min, soglia di 120 min e coronarografia 2–24 h dopo fibrinolisi.',
        ],
      },
      {
        titolo: 'Fibrinolisi',
        punti: [
          'Tenecteplase bolo unico secondo il peso: <60 kg 30 mg; 60–69 kg 35 mg; 70–79 kg 40 mg; 80–89 kg 45 mg; ≥90 kg 50 mg.',
          'Dosi dalla tabella dei farmaci ESC (non leggibile nel testo web: verificarle). Con: aspirina; clopidogrel 300 mg (75 mg se >75 anni); enoxaparina 30 mg ev poi 1 mg/kg sc ogni 12 h (≥75 anni: niente bolo, 0,75 mg/kg ogni 12 h).',
          'Controindicazioni assolute principali: emorragia cerebrale pregressa, ictus ischemico negli ultimi 6 mesi, lesione o neoplasia del SNC, trauma maggiore, chirurgia o trauma cranico nell’ultimo mese, sanguinamento in atto, dissezione aortica sospetta.',
        ],
      },
      {
        titolo: 'Antitrombotici per la PCI primaria',
        punti: [
          'Inibitore P2Y12: prasugrel preferito (IIa ESC) 60 mg, poi 10 mg (5 mg se ≥75 anni o <60 kg; controindicato se ictus/TIA pregresso); ticagrelor 180 mg, poi 90 mg x2; clopidogrel 600 mg se gli altri non sono disponibili o sono controindicati.',
          'Anticoagulante in sala: ENF; enoxaparina o bivalirudina come alternative.',
        ],
      },
      {
        titolo: 'Altre terapie in acuto',
        punti: [
          'Oppioidi ev per il dolore severo (rallentano l’assorbimento degli antiaggreganti orali).',
          'Beta-bloccante ev (preferibilmente metoprololo) da considerare all’arrivo in PCI primaria se non c’è scompenso acuto e la PAS è >120 mmHg.',
          'Niente nitrati se PAS <90 mmHg, infarto del VD o inibitori della PDE5 nelle 24–48 ore.',
          'Statina ad alta intensità il prima possibile.',
        ],
      },
      {
        titolo: 'Cosa aggiunge l’ACC/AHA 2025',
        punti: [
          'Una sola linea guida per tutte le SCA, che sostituisce la STEMI 2013 e la NSTE-ACS 2014.',
          'Rivascolarizzazione completa raccomandata anche nello STEMI: lesioni non colpevoli trattabili nella stessa procedura o in un secondo tempo, preferibilmente nella stessa procedura.',
          'Statina ad alta intensità per tutti, con ezetimibe da poter iniziare insieme. Imaging intracoronarico per guidare la PCI nelle lesioni complesse.',
        ],
      },
    ],
    aggiornamenti: [
      {
        data: '2026-11-09',
        testo: 'Nessuna nuova linea guida ESC sulle SCA dopo il 2023.',
      },
      {
        data: '2025-02-27',
        testo: 'ACC/AHA/ACEP/NAEMSP/SCAI: nuova linea guida unica per le SCA.',
        link: { etichetta: 'AHA: sintesi', url: 'https://professional.heart.org/en/science-news/2025-guideline-for-the-management-of-patients-with-acute-coronary-syndromes' },
      },
      {
        data: '2023-08-25',
        testo: 'ESC 2023: per la prima volta STEMI e NSTE-SCA in un unico documento; prasugrel preferito al ticagrelor nei pazienti trattati con PCI.',
      },
    ],
  },
]

export const lineaGuida = (id: string) => LINEE_GUIDA.find((l) => l.id === id)

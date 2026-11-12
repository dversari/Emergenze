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
  /** schede dell'app collegate (antibiotici, procedure, dimissioni…) */
  vediAnche?: { etichetta: string; to: string }[]
  /** manovre illustrate da mostrare (id in lib/manovre) */
  manovre?: string[]
  /** testi esterni utili (figure, video, manovre) */
  approfondimenti?: (Collegamento & { nota?: string })[]
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
    vediAnche: [{ etichetta: 'Cardioversione elettrica', to: '/procedure?apri=cve' }, { etichetta: 'Tachicardia', to: '/linee-guida/tachicardia' }],
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
          'FE >40%: beta-bloccante (metoprololo (Lopresor) 2,5–5 mg ev in 2 min, ripetibile fino a 15 mg; esmololo 500 µg/kg in 1 min, poi 50–300 µg/kg/min) oppure diltiazem 0,25 mg/kg ev in 5 min, poi 5–15 mg/h, o verapamil (Isoptin) 2,5–10 mg ev in 5 min.',
          'FE ≤40% o scompenso: beta-bloccante a basse dosi con cautela, digossina (Lanoxin) 0,5 mg ev (fino a 0,75–1,5 mg in 24 h in dosi frazionate), amiodarone (Cordarone) se refrattaria o instabile.',
          'Niente diltiazem/verapamil (Isoptin) con FE ≤40%.',
          'FA pre-eccitata (QRS larghi, irregolari, molto veloci): niente farmaci nodali (beta-bloccanti, calcioantagonisti, digossina (Lanoxin), amiodarone (Cordarone)). Cardioversione elettrica.',
        ],
      },
      {
        titolo: 'Cardioversione farmacologica',
        punti: [
          'Senza cardiopatia strutturale (no IVS marcata, no FE ridotta, no coronaropatia): flecainide (Almarytm) 2 mg/kg ev in 10 min (max 150 mg) o 200–300 mg os; propafenone (Rytmonorm) 1,5–2 mg/kg ev in 10 min o 450–600 mg os.',
          'Con flecainide (Almarytm)/propafenone (Rytmonorm) associare un farmaco nodale: rischio di flutter con conduzione 1:1.',
          'Vernakalant (non disponibile in PS a Prato) 3 mg/kg ev in 10 min, seconda dose 2 mg/kg dopo 15 min. Non con SCA recente, scompenso grave, PAS <100, stenosi aortica severa, QT lungo.',
          'Con cardiopatia strutturale o scompenso: amiodarone (Cordarone) 300 mg ev in 30–60 min, poi 900–1200 mg nelle 24 h. Conversione lenta (ore).',
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
          'Furosemide (Lasix) ev 40 mg se mai trattato con diuretici; se già in terapia, il doppio della dose orale abituale. Dose iniziale più alta se insufficienza renale cronica. Bolo o infusione continua sono equivalenti.',
          'Risposta adeguata: sodio urinario ≥70 mEq/L a 2 h oppure diuresi ≥100 mL/h nelle prime 6 h. Se insufficiente: raddoppiare la dose ev e/o aggiungere un diuretico non dell’ansa.',
          'Dopo 24 h: se la diuresi totale è <3 L e la congestione persiste, aumentare ancora nel secondo giorno. Dose massima abituale furosemide (Lasix) 600 mg/die (fino a 1000 mg se funzione renale molto ridotta).',
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
      'Anticoagulazione: EBPM preferita all’ENF (AHA classe 1; ESC: EBPM o fondaparinux (Arixtra) preferiti). ENF se instabile, se è probabile la trombolisi o se l’insufficienza renale è grave. Per la terapia orale DOAC.',
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
          'Dosi ESC: alteplase (Actilyse) 100 mg in 2 h, oppure 0,6 mg/kg in 15 min (max 50 mg) nel regime accelerato. ENF: bolo 80 U/kg, poi 18 U/kg/h.',
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
      'Prato ha l’emodinamica h24: sempre PCI primaria, attivata appena posta la diagnosi; obiettivo diagnosi → filo ≤60 minuti. Niente fibrinolisi.',
      'Sintomi da >12 h: PCI primaria se dolore persistente, instabilità o aritmie; da considerare fino a 48 h anche se asintomatico.',
      'Subito: aspirina 150–300 mg os (o 75–250 mg ev) ed eparina non frazionata 70–100 U/kg ev. Pretrattamento con inibitore P2Y12 prima della coronarografia: «può essere considerato» nella PCI primaria, non di routine nelle NSTE-SCA.',
      'Ossigeno solo se SpO₂ <90%. Arresto cardiaco rianimato con ST sopraslivellato: coronarografia immediata.',
    ],
    sezioni: [
      {
        titolo: 'Tempi (ESC 2023)',
        punti: [
          'Primo contatto → ECG e diagnosi: ≤10 min.',
          'Diagnosi → filo: ≤60 min se il paziente arriva in un centro PCI (Prato), ≤90 min se trasferito da un altro ospedale.',
          'Esordio >12 h: PCI primaria se ischemia in atto, instabilità o aritmie (I); 12–48 h asintomatico: da considerare (IIa); >48 h asintomatico: niente PCI di routine dell’arteria occlusa (III).',
        ],
      },
      {
        titolo: 'Antitrombotici per la PCI primaria',
        punti: [
          'Inibitore P2Y12: prasugrel (Efient) preferito (IIa ESC) 60 mg, poi 10 mg (5 mg se ≥75 anni o <60 kg; controindicato se ictus/TIA pregresso); ticagrelor (Brilique) 180 mg, poi 90 mg x2; clopidogrel (Plavix) 600 mg se gli altri non sono disponibili o sono controindicati.',
          'Anticoagulante in sala: ENF; enoxaparina (Clexane) o bivalirudina come alternative.',
        ],
      },
      {
        titolo: 'Altre terapie in acuto',
        punti: [
          'Oppioidi ev per il dolore severo (rallentano l’assorbimento degli antiaggreganti orali).',
          'Beta-bloccante ev (preferibilmente metoprololo (Lopresor)) da considerare all’arrivo in PCI primaria se non c’è scompenso acuto e la PAS è >120 mmHg.',
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
  {
    id: 'colica-renale',
    titolo: 'Colica renale',
    ente: 'EAU',
    anno: 2026,
    area: 'Urologia',
    fonte: { etichetta: 'EAU Guidelines on Urolithiasis 2026', url: 'https://uroweb.org/guidelines/urolithiasis' },
    controllata: '2026-11-11',
    vediAnche: [
      { etichetta: 'Dimissione colica renale', to: '/dimissioni?apri=colica-renale' },
      { etichetta: 'Antibiotici: pielonefrite', to: '/antibiotici?apri=pielonefrite' },
      { etichetta: 'Cartella: dolore al fianco', to: '/anamnesi?apri=colica-renale' },
    ],
    inBreve: [
      'Prima l’analgesia: FANS (compreso il metamizolo) di prima scelta, più efficaci degli oppioidi; oppioidi come seconda scelta.',
      'Ecografia come primo esame; TC a basse dosi senza contrasto per confermare se la diagnosi resta dubbia dopo l’ecografia.',
      'Febbre o sepsi con rene ostruito, anuria, rene unico ostruito o dolore che non si controlla: decompressione urgente (stent o nefrostomia) → urologo.',
      'Terapia espulsiva con alfa-litico per i calcoli dell’uretere distale di 5–10 mm (uso off-label). Sul cortisone insieme all’alfa-litico l’EAU non dà raccomandazioni.',
      'Calcoli < 5 mm: espulsione spontanea nella grande maggioranza dei casi.',
      'Anziano senza calcolosi nota: escludere l’aneurisma dell’aorta addominale.',
    ],
    sezioni: [
      {
        titolo: 'Analgesia in PS (70 kg)',
        punti: [
          'Ketorolac 30 mg ev = 1 fiala (indicazione registrata per la colica renale), oppure diclofenac 75 mg im/ev = 1 fiala, oppure metamizolo 1–2 g ev = 1–2 fiale da 1 g; paracetamolo 1 g ev in aggiunta.',
          'FANS da evitare o ridurre: insufficienza renale, eGFR basso, rene unico, terzo trimestre di gravidanza, ulcera attiva, scompenso.',
          'Seconda scelta: oppioidi (morfina 2–4 mg ev ripetibile; tramadolo). Antiemetico se vomito.',
          'Dolore refrattario all’analgesia: decompressione o rimozione del calcolo.',
        ],
      },
      {
        titolo: 'Esami e imaging',
        punti: [
          'Esame urine, creatinina, elettroliti, PCR, emocromo; urinocoltura se febbre o leucocituria; β-hCG nelle donne in età fertile.',
          'Ecografia: idronefrosi, calcoli del giunto e dell’uretere distale; non esclude un calcolo ureterale.',
          'TC a basse dosi senza contrasto: dopo l’ecografia se la diagnosi resta incerta, primo episodio atipico, febbre o insufficienza renale.',
          'Gravidanza: ecografia; RM se necessario.',
        ],
      },
      {
        titolo: 'Quando ricoverare o chiamare l’urologo',
        punti: [
          'Febbre/sepsi con ostruzione (urgenza: drenaggio + antibiotico dopo le colture).',
          'Anuria, rene unico o trapiantato ostruito, ostruzione bilaterale, insufficienza renale acuta.',
          'Dolore o vomito non controllati; calcolo > 10 mm (bassa probabilità di espulsione).',
        ],
      },
      {
        titolo: 'Terapia espulsiva',
        punti: [
          'EAU (forte): alfa-litici come opzione per i calcoli dell’uretere distale > 5 mm; gli studi recenti mostrano efficacia tra 5 e 10 mm.',
          'In Italia la tamsulosina è registrata solo per l’ipertrofia prostatica: per i calcoli è off-label (nelle donne nessuna indicazione autorizzata).',
          'Corticosteroide (es. Deltacortene, usato dagli urologi di Prato) insieme all’alfa-litico: l’EAU non dà raccomandazioni per dati insufficienti.',
          'Controllo urologico/ecografico se il calcolo non è espulso entro 4–6 settimane.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2026-03-01', testo: 'EAU 2026: aggiornamento completo; rivista la sezione sulla terapia espulsiva (efficacia sui calcoli di 5–10 mm) e sulla colica renale. Prossimo aggiornamento completo nel 2028.' },
    ],
  },
  {
    id: 'colica-biliare',
    titolo: 'Colica biliare e colecistite',
    ente: 'Tokyo 2018 · WSES 2020',
    anno: 2020,
    area: 'Gastroenterologia · Chirurgia',
    fonte: { etichetta: 'Pisano et al., World J Emerg Surg 2020 (WSES)', url: 'https://doi.org/10.1186/s13017-020-00336-x' },
    controllata: '2026-11-11',
    vediAnche: [
      { etichetta: 'Antibiotici: colecistite e colangite', to: '/antibiotici?apri=colecistite' },
      { etichetta: 'Dimissione colica biliare', to: '/dimissioni?apri=colica-biliare' },
    ],
    inBreve: [
      'Colica biliare: dolore in ipocondrio destro/epigastrio < 6 h, senza febbre né segni sistemici. FANS come analgesico di prima scelta.',
      'Colecistite (Tokyo 2018): segni locali (Murphy, dolore o massa in ipocondrio destro) + segni sistemici (febbre, PCR, leucocitosi) + imaging tipico.',
      'Ecografia come primo esame (parete > 4 mm, distensione, liquido pericolecistico, Murphy ecografico).',
      'Colecistite: colecistectomia laparoscopica precoce, appena possibile entro 7 giorni dal ricovero e 10 dall’esordio (WSES), anche nell’anziano se operabile.',
      'Colangite (Charcot: febbre, ittero, dolore) e pancreatite biliare con colangite: drenaggio biliare (CPRE), urgente se grave.',
    ],
    sezioni: [
      {
        titolo: 'Gravità secondo Tokyo 2018',
        punti: [
          'Grado III (grave): disfunzione d’organo — cardiovascolare (vasopressori), neurologica, respiratoria (PaO₂/FiO₂ < 300), renale (oliguria o creatinina > 2 mg/dL), epatica (INR > 1,5), ematologica (piastrine < 100.000).',
          'Grado II (moderato): GB > 18.000, massa dolente palpabile in ipocondrio destro, durata > 72 h, infiammazione locale marcata (gangrena, ascesso, peritonite biliare, colecistite enfisematosa).',
          'Grado I (lieve): nessuno dei precedenti.',
        ],
      },
      {
        titolo: 'Terapia in PS',
        punti: [
          'Analgesia: FANS (ketorolac 30 mg ev = 1 fiala, o diclofenac 75 mg) ± paracetamolo; oppioidi se necessario.',
          'Colecistite: digiuno, liquidi, antibiotico (scheda Antibiotici) e chirurgo.',
          'Paziente non operabile o grado III instabile: drenaggio percutaneo della colecisti come alternativa alla chirurgia.',
        ],
      },
      {
        titolo: 'Esami',
        punti: [
          'Emocromo, PCR, bilirubina, AST/ALT, ALP/GGT, lipasi, creatinina, coagulazione.',
          'Colestasi o dilatazione delle vie biliari: sospettare calcolosi della via biliare principale (colangio-RM o eco-endoscopia).',
          'Lipasi > 3 volte il limite: pancreatite biliare (vedi linea guida pancreatite).',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2026-11-11', testo: 'Controllo: le versioni più recenti restano Tokyo 2018 e WSES 2020.' },
      { data: '2020-09-29', testo: 'WSES 2020: colecistectomia laparoscopica precoce anche nei pazienti ad alto rischio; ruolo del drenaggio della colecisti ridotto.' },
    ],
  },
  {
    id: 'pancreatite',
    titolo: 'Pancreatite acuta',
    ente: 'ACG',
    anno: 2024,
    area: 'Gastroenterologia · Chirurgia',
    fonte: { etichetta: 'Tenner et al., Am J Gastroenterol 2024 (ACG)', url: 'https://doi.org/10.14309/ajg.0000000000002645' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'bisap', nome: 'BISAP' }],
    inBreve: [
      'Diagnosi con 2 criteri su 3: dolore tipico, lipasi (o amilasi) > 3 volte il limite, imaging compatibile. TC subito solo se la diagnosi è incerta.',
      'Ecografia addominale a tutti per cercare l’origine biliare; trigliceridi, calcio, alcol, farmaci se non è biliare.',
      'Liquidi «moderatamente aggressivi» con Ringer lattato (preferito alla fisiologica), rivalutando entro 6 h e nelle 24–48 h; più liquidi non aiutano dopo le prime 48 h.',
      'Niente antibiotici profilattici, nemmeno nella forma grave. Alimentazione orale precoce (24–48 h) con dieta solida povera di grassi nella forma lieve.',
      'Biliare senza colangite: niente CPRE precoce. Con colangite: CPRE. Lieve biliare: colecistectomia nello stesso ricovero.',
    ],
    sezioni: [
      {
        titolo: 'Liquidi (ACG 2024)',
        punti: [
          'Ringer lattato 1,5 mL/kg/h ≈ 100 mL/h per 70 kg, con bolo di 10 mL/kg (≈ 700 mL) solo se ipovolemico.',
          'Rivalutare a intervalli frequenti entro 6 h e per 24–48 h: segni vitali, diuresi, urea (obiettivo: urea in calo) ed ematocrito.',
          'Evitare il sovraccarico (rischio di edema polmonare e sindrome compartimentale addominale).',
        ],
      },
      {
        titolo: 'Gravità (Atlanta rivista)',
        punti: [
          'Lieve: niente insufficienza d’organo né complicanze locali.',
          'Moderata: insufficienza d’organo transitoria (< 48 h) o complicanze locali.',
          'Grave: insufficienza d’organo persistente (> 48 h) → terapia intensiva.',
          'Nelle prime ore: SIRS persistente, urea in aumento, ematocrito alto, età, obesità, comorbidità indicano rischio. BISAP ≥ 3 = mortalità > 15%.',
        ],
      },
      {
        titolo: 'Altro',
        punti: [
          'Analgesia adeguata (anche oppioidi).',
          'TC con contrasto dopo 72 h se non migliora, per necrosi e complicanze.',
          'Necrosi infetta sospetta: niente agoaspirato di routine; drenaggio/necrosectomia ritardati e mininvasivi in centro esperto.',
          'Ipertrigliceridemia (> 1.000 mg/dL) e ipercalcemia: trattare la causa.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2024-03-05', testo: 'ACG 2024: liquidi moderatamente aggressivi con Ringer lattato, niente antibiotici profilattici, alimentazione orale precoce, niente CPRE precoce senza colangite.' },
    ],
  },
  {
    id: 'emorragia-digestiva',
    titolo: 'Emorragia digestiva',
    ente: 'ESGE 2021–2022',
    anno: 2022,
    area: 'Gastroenterologia · Chirurgia',
    fonte: { etichetta: 'Gralnek et al., Endoscopy 2021 (ESGE, non varicosa)', url: 'https://doi.org/10.1055/a-1369-5274' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'gbs', nome: 'Glasgow-Blatchford' }],
    vediAnche: [{ etichetta: 'Cartella: sanguinamento digestivo', to: '/anamnesi?apri=emorragia-digestiva' }],
    approfondimenti: [
      { etichetta: 'ESGE 2022: emorragia da varici esofago-gastriche', url: 'https://doi.org/10.1055/a-1939-4887' },
    ],
    inBreve: [
      'Stabilizzare prima: due accessi, cristalloidi se instabile, trasfusione restrittiva (Hb ≤ 7 g/dL; ≤ 8 se cardiopatia).',
      'Glasgow-Blatchford ≤ 1: gestione ambulatoriale con endoscopia programmata.',
      'Non varicosa: endoscopia entro 24 h dopo la stabilizzazione; IPP ad alte dosi prima, senza ritardare l’endoscopia; eritromicina 250 mg ev 30–120 min prima se sanguinamento importante.',
      'Sospetta varicosa (cirrosi): vasoattivo subito (terlipressina (Glypressin), somatostatina o octreotide (Sandostatin)), ceftriaxone 1 g/die fino a 7 giorni, eritromicina ed endoscopia entro 12 h.',
      'Niente sondino naso-gastrico di routine. Acido tranexamico non raccomandato.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'IPP: esomeprazolo o pantoprazolo 80 mg ev in bolo = 2 fiale da 40 mg, poi 8 mg/h (o 40 mg ogni 12 h); dopo emostasi endoscopica ad alto rischio, alte dosi per 72 h.',
          'Eritromicina 250 mg ev in 20–30 min, 30–120 min prima dell’endoscopia (controllare QT).',
          'Terlipressina (Glypressin) 2 mg ev ogni 4 h (2 fiale da 1 mg) fino al controllo, poi 1 mg ogni 4 h, per 2–5 giorni. Alternativa: somatostatina 250 µg in bolo poi 250–500 µg/h.',
          'Ceftriaxone 1 g ev al giorno fino a 7 giorni in tutti i cirrotici con emorragia.',
        ],
      },
      {
        titolo: 'Anticoagulanti e antiaggreganti',
        punti: [
          'AVK con emorragia grave/instabile: complesso protrombinico (4 fattori) + vitamina K (Konakion) ev.',
          'DOAC: sospendere; con emorragia pericolosa per la vita, antidoto o complesso protrombinico secondo il farmaco e l’ultima dose.',
          'ASA in prevenzione secondaria: non sospendere o riprendere subito dopo l’endoscopia se basso rischio di risanguinamento.',
        ],
      },
      {
        titolo: 'Emorragia digestiva bassa',
        punti: [
          'Instabile o shock index (FC/PAS) > 1: escludere una fonte alta (ematochezia massiva) e angio-TC per localizzare, poi embolizzazione o endoscopia.',
          'Stabile: colonscopia nel ricovero; i pazienti a basso rischio possono fare esami ambulatoriali.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2026-11-11', testo: 'Controllo: l’ESGE aveva previsto di rivalutare la linea guida non varicosa nel 2025; non ho trovato una versione nuova.' },
      { data: '2022-09-29', testo: 'ESGE 2022 sulle varici: vasoattivo alla presentazione, ceftriaxone 1 g/die fino a 7 giorni, eritromicina, endoscopia entro 12 h, TIPS precoce nei pazienti ad alto rischio.' },
      { data: '2021-02-10', testo: 'ESGE 2021 non varicosa: Glasgow-Blatchford ≤ 1 dimissibile, trasfusione restrittiva, endoscopia entro 24 h (non entro 12 h di routine).' },
    ],
  },
  {
    id: 'vertigine',
    titolo: 'Vertigine acuta',
    manovre: ['hit', 'roll-test', 'dix-hallpike', 'epley', 'semont', 'gufoni-geo', 'gufoni-apo', 'lempert'],
    ente: 'STANDING · GRACE-3 2023',
    anno: 2023,
    area: 'Neurologia · ORL',
    fonte: { etichetta: 'Edlow et al., Acad Emerg Med 2023 (GRACE-3)', url: 'https://doi.org/10.1111/acem.14728' },
    controllata: '2026-11-11',
    vediAnche: [
      { etichetta: 'Cartella: vertigine', to: '/anamnesi?apri=vertigine' },
      { etichetta: 'Dimissione VPPB', to: '/dimissioni?apri=vppb' },
    ],
    approfondimenti: [
      { etichetta: 'STANDING: studio di validazione (Vanni, Front Neurol 2017)', url: 'https://doi.org/10.3389/fneur.2017.00590', nota: 'Algoritmo nato a Firenze (Careggi); figura del percorso e video delle manovre nel materiale supplementare.' },
      { etichetta: 'AAO-HNS 2017: VPPB, testo completo con figure', url: 'https://doi.org/10.1177/0194599816689667', nota: 'Disegni di Dix-Hallpike, supine roll test, Epley, Semont, Lempert (barbecue) e Gufoni, con le tabelle passo per passo.' },
      { etichetta: 'GRACE-3: testo completo (open access)', url: 'https://doi.org/10.1111/acem.14728', nota: 'Algoritmi per sindrome vestibolare acuta, episodica spontanea e posizionale; figure su HINTS e finger rub.' },
    ],
    inBreve: [
      'Prima il tipo di vertigine (GRACE-3): continua da ore con nistagmo spontaneo (sindrome vestibolare acuta), episodica spontanea (sospetto TIA) o posizionale (VPPB).',
      'STANDING, 4 passi al letto: nistagmo spontaneo o posizionale → direzione → head impulse test → stazione eretta e marcia. Usato da medici di PS non specialisti esclude ictus e cause gravi con alta sensibilità.',
      'Segni centrali: nistagmo che cambia direzione, verticale o torsionale puro, head impulse normale con nistagmo spontaneo, skew, impossibilità a stare in piedi o camminare, deficit neurologici, ipoacusia improvvisa.',
      'La TC non esclude l’ictus del circolo posteriore: non usarla per questo. RM con diffusione se sospetto centrale (può essere falsamente negativa nelle prime 48 h).',
      'VPPB: diagnosi con Dix-Hallpike / supine roll test e terapia con la manovra, non con i farmaci. Neurite vestibolare: cortisone breve da considerare.',
    ],
    sezioni: [
      {
        titolo: 'Manovre diagnostiche',
        punti: [
          'Nistagmo spontaneo: guardare in posizione primaria e nelle 4 direzioni di sguardo, meglio con occhiali di Frenzel (o bloccando la fissazione con un foglio).',
          'Head impulse test: solo con nistagmo spontaneo. Paziente fissa il naso dell’esaminatore; rotazione rapida e breve (10–20°) della testa. Saccade di correzione = patologico = periferico.',
          'Skew: coprire alternativamente un occhio; un movimento verticale di riallineamento è segno centrale.',
          'Dix-Hallpike (canale posteriore): seduto, testa ruotata di 45° verso il lato da testare, portarlo rapidamente supino con la testa estesa 20° oltre il bordo del lettino. Positivo: dopo pochi secondi nistagmo torsionale verso il basso e verticale verso l’alto, < 60 s, che si esaurisce ripetendo.',
          'Supine roll test (Pagnini-McClure, canale laterale): supino con testa flessa 30°, ruotare la testa di 90° a destra, poi a sinistra. Nistagmo orizzontale geotropo: lato malato = quello con nistagmo più intenso; apogeotropo: lato malato = quello con nistagmo meno intenso.',
        ],
      },
      {
        titolo: 'Manovre terapeutiche',
        punti: [
          'Epley (canale posteriore destro): dalla Dix-Hallpike a destra (30–60 s) → ruotare la testa di 90° verso sinistra (30–60 s) → girare il paziente sul fianco sinistro con il naso verso il pavimento (30–60 s) → seduto con il mento flesso. A sinistra speculare.',
          'Semont (canale posteriore destro): seduto, testa ruotata di 45° a sinistra; coricarlo rapidamente sul fianco destro (1–2 min), poi ribaltarlo di 180° sul fianco sinistro senza cambiare la rotazione della testa (naso verso il basso, 1–2 min), poi seduto.',
          'Gufoni, canale laterale geotropo (lato destro malato): seduto, coricarlo rapidamente sul fianco sano (sinistro) per 1–2 min, ruotare la testa di 45° verso il pavimento per 2 min, poi seduto. Forma apogeotropa: coricarlo sul fianco malato e ruotare la testa di 45° verso il soffitto.',
          'Lempert / barbecue (canale laterale geotropo): supino con la testa verso il lato malato, poi rotazioni di 90° ogni 30–60 s verso il lato sano (testa al centro, testa verso il lato sano, prono), fino a 270–360°, poi seduto.',
        ],
      },
      {
        titolo: 'Terapia',
        punti: [
          'Sintomatici solo per pochi giorni (antiemetici: metoclopramide (Plasil), ondansetron (Zofran); dimenidrinato): rallentano il compenso vestibolare. Evitare le benzodiazepine prolungate.',
          'Neurite vestibolare: cortisone breve da considerare (GRACE-3), es. prednisone (Deltacortene) 50–60 mg/die per 5 giorni a scalare; riabilitazione vestibolare precoce.',
          'VPPB: manovra di riposizionamento; nessun farmaco anti-vertigine di routine (AAO-HNS).',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2026-11-11', testo: 'Controllo: nessun aggiornamento di GRACE-3 (2023) né della linea guida AAO-HNS sulla VPPB (2017).' },
      { data: '2023-05-11', testo: 'GRACE-3 (SAEM): 15 raccomandazioni; HINTS per medici formati, finger rub, niente TC per escludere l’ictus; cita lo STANDING come alternativa.' },
      { data: '2017-11-07', testo: 'STANDING: validazione prospettica a Careggi (Vanni et al.).' },
    ],
  },
  {
    id: 'pericardite',
    titolo: 'Pericardite',
    ente: 'ESC',
    anno: 2025,
    area: 'Cardiologia',
    fonte: { etichetta: 'Schulz-Menger et al., Eur Heart J 2025 (ESC)', url: 'https://doi.org/10.1093/eurheartj/ehaf192' },
    controllata: '2026-11-11',
    vediAnche: [{ etichetta: 'Procedura: pericardiocentesi', to: '/procedure?apri=pericardiocentesi' }],
    inBreve: [
      'ESC 2025: prima linea guida unica per miocardite e pericardite, riunite nella «sindrome infiammatoria miopericardica».',
      'Diagnosi con almeno 2 tra: dolore toracico pericarditico, sfregamento, alterazioni ECG (ST sopraslivellato diffuso o PR sottoslivellato), versamento pericardico nuovo o in aumento. PCR alta e imaging a supporto.',
      'Troponina alta = coinvolgimento miocardico (miopericardite): ricovero e valutazione.',
      'Terapia: FANS o aspirina ad alte dosi + colchicina (non più opzionale) + riposo fisico fino alla remissione. Cortisone solo in seconda linea.',
      'Ricovero se c’è anche un solo criterio di rischio, maggiore (febbre > 38 °C, esordio subacuto, versamento > 20 mm o tamponamento, mancata risposta ai FANS dopo 1 settimana) o minore (miopericardite, immunodepressione, trauma, anticoagulanti).',
    ],
    sezioni: [
      {
        titolo: 'Terapia della pericardite acuta',
        punti: [
          'Ibuprofene 600 mg ogni 8 h per 1–2 settimane, poi scalare (riduzione di 200–400 mg ogni 1–2 settimane) guidati da sintomi e PCR; oppure aspirina 750–1000 mg ogni 8 h (preferita dopo infarto o in cardiopatia ischemica).',
          'Colchicina 0,5 mg ogni 12 h (0,5 mg una volta al giorno se < 70 kg o con interazioni/insufficienza renale) per 3 mesi; 6 mesi nelle recidive.',
          'Gastroprotezione con IPP durante il FANS.',
          'Seconda linea (controindicazioni o mancata risposta, esclusa l’infezione): prednisone (Deltacortene) a basse dosi 0,2–0,5 mg/kg/die. Recidive refrattarie: anti-IL-1 (specialista).',
          'Riposo: niente attività fisica intensa fino alla remissione; negli atleti almeno 1–3 mesi.',
        ],
      },
      {
        titolo: 'Criteri di rischio',
        punti: [
          'Quanti ne servono: ne basta uno solo, maggiore o minore, per considerare il caso ad alto rischio → ricovero e ricerca della causa.',
          'Maggiori (4): febbre > 38 °C; esordio subacuto (giorni-settimane, senza dolore acuto netto); versamento pericardico importante (> 20 mm in diastole) o tamponamento; mancata risposta a FANS/aspirina dopo almeno 1 settimana.',
          'Minori (4): miopericardite (troponina alta); immunodepressione; trauma; terapia anticoagulante orale.',
          'Nessun criterio (basso rischio): domicilio con FANS + colchicina, senza ricerca estesa della causa, controllo a 1 settimana con PCR.',
          'Fonte: triage dell’ESC 2015, ripreso nella linea guida 2025 (non verificato sul testo completo 2025).',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2025-08-29', testo: 'ESC 2025: prima linea guida unica miocardite-pericardite; colchicina parte integrante della terapia; risonanza cardiaca centrale; ritorno all’attività personalizzato.' },
    ],
  },
  {
    id: 'miocardite',
    titolo: 'Miocardite',
    ente: 'ESC',
    anno: 2025,
    area: 'Cardiologia',
    fonte: { etichetta: 'Schulz-Menger et al., Eur Heart J 2025 (ESC)', url: 'https://doi.org/10.1093/eurheartj/ehaf192' },
    controllata: '2026-11-11',
    approfondimenti: [{ etichetta: 'ESC 2025: messaggi essenziali (PDF)', url: 'https://www.escardio.org/static-file/Escardio/Guidelines/Products/Essential%20Messages/2025%20Gls/2025%20Essential%20Messages_MyoPeri.pdf' }],
    inBreve: [
      'Sospetto: dolore toracico, dispnea, palpitazioni o sincope, spesso dopo infezione virale, con troponina alta e alterazioni ECG.',
      'Prima escludere la sindrome coronarica acuta (coronarografia o angio-TC coronarica se il sospetto è ragionevole).',
      'La troponina alta da sola non basta per la diagnosi: risonanza cardiaca (criteri di Lake Louise) come esame centrale e precoce.',
      'Alto rischio → ricovero monitorato in centro con terapia intensiva cardiologica: FE ridotta, scompenso, aritmie ventricolari sostenute, BAV avanzato, shock (miocardite fulminante: supporto meccanico e biopsia).',
      'Riposo dall’attività fisica nella fase acuta; ritorno al lavoro e allo sport personalizzato.',
    ],
    sezioni: [
      {
        titolo: 'In PS',
        punti: [
          'ECG, troponina ripetuta, PCR, NT-proBNP, ecocardio (FE, cinetica, versamento).',
          'Monitoraggio ECG continuo: le aritmie possono comparire anche con FE normale.',
          'Miocardite da inibitori dei checkpoint immunitari (oncologici): sospettarla presto, sospendere il farmaco, cortisone ad alte dosi (specialista).',
          'Componente pericarditica: colchicina suggerita nella miopericardite; FANS solo per il dolore pericarditico, a dosi più basse.',
        ],
      },
      {
        titolo: 'Dopo',
        punti: [
          'Scompenso: terapia standard dello scompenso.',
          'Visita con ECG entro 6 mesi; sorveglianza a lungo termine nelle forme complicate o con cicatrice estesa alla risonanza.',
          'Sport: restrizione di solito 3–6 mesi, rivalutazione prima del ritorno all’attività agonistica.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2025-08-29', testo: 'ESC 2025: prima linea guida ESC sulla miocardite (prima c’era solo un documento di consenso del 2013).' },
    ],
  },
  {
    id: 'polmonite',
    titolo: 'Polmonite comunitaria',
    ente: 'ATS 2025 · ATS/IDSA 2019',
    anno: 2025,
    area: 'Pneumologia · Infettivologia',
    fonte: { etichetta: 'Jones et al., Am J Respir Crit Care Med 2025 (ATS)', url: 'https://doi.org/10.1164/rccm.202507-1692ST' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'curb65', nome: 'CURB-65' }],
    vediAnche: [
      { etichetta: 'Antibiotici: polmonite comunitaria', to: '/antibiotici?apri=cap' },
      { etichetta: 'Antibiotici: polmonite nosocomiale', to: '/antibiotici?apri=hap' },
    ],
    approfondimenti: [{ etichetta: 'ATS/IDSA 2019: linea guida completa', url: 'https://doi.org/10.1164/rccm.201908-1581ST' }],
    inBreve: [
      'Diagnosi: RX torace, oppure ecografia polmonare considerata equivalente dove c’è esperienza (ATS 2025).',
      'Dove curarla: CURB-65 / PSI aiutano, ma decide il giudizio clinico (ipossiemia, comorbidità, contesto sociale).',
      'CAP grave (ATS: 1 criterio maggiore — shock con vasopressori o ventilazione meccanica — oppure ≥ 3 minori): terapia intensiva.',
      'Cortisone: suggerito nella CAP grave dei ricoverati (non se influenza); sconsigliato nella CAP non grave.',
      'Durata breve: almeno 3 giorni nel paziente non grave che si è stabilizzato (ATS 2025); di più se grave o Pseudomonas/MRSA.',
    ],
    sezioni: [
      {
        titolo: 'Criteri minori ATS/IDSA (≥ 3 = grave)',
        punti: [
          'FR ≥ 30; PaO₂/FiO₂ ≤ 250; infiltrati multilobari; confusione; urea ≥ 20 mg/dL di BUN (≈ 43 mg/dL di urea); GB < 4.000; piastrine < 100.000; temperatura < 36 °C; ipotensione che richiede liquidi aggressivi.',
        ],
      },
      {
        titolo: 'Esami',
        punti: [
          'Grave o rischio Pseudomonas/MRSA: emocolture ed espettorato prima dell’antibiotico; antigeni urinari per pneumococco e Legionella nei gravi.',
          'Test per influenza e virus respiratori; con influenza: oseltamivir.',
          'Ambulatoriale con virus respiratorio positivo e senza comorbidità: si può non dare l’antibiotico (ATS 2025, condizionale).',
          'Procalcitonina: non usarla per decidere se iniziare l’antibiotico.',
        ],
      },
      {
        titolo: 'Cortisone nella CAP grave',
        punti: [
          'Idrocortisone (Flebocortid) 200 mg/die ev (es. infusione) per 4–7 giorni, poi a scalare (schema CAPE COD), entro 24 h dall’ingresso.',
          'No se influenza, aspergillosi, diabete scompensato, sanguinamento digestivo recente.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2025-07-18', testo: 'ATS 2025 (aggiornamento parziale della ATS/IDSA 2019, non approvato dall’IDSA): ecografia polmonare equivalente alla RX, antibiotico non sempre necessario con virus positivo, durata breve, cortisone nella CAP grave.' },
      { data: '2019-10-01', testo: 'ATS/IDSA 2019: terapia empirica secondo gravità e fattori di rischio per Pseudomonas e MRSA.' },
    ],
  },
  {
    id: 'sepsi',
    titolo: 'Sepsi e shock settico',
    ente: 'Surviving Sepsis Campaign',
    anno: 2026,
    area: 'Infettivologia · Terapia intensiva',
    fonte: { etichetta: 'Prescott et al., Crit Care Med 2026 (SSC)', url: 'https://doi.org/10.1097/CCM.0000000000007075' },
    controllata: '2026-11-11',
    vediAnche: [
      { etichetta: 'Antibiotici: sepsi senza focolaio', to: '/antibiotici?apri=sepsi' },
      { etichetta: 'Antibiotici: neutropenia febbrile', to: '/antibiotici?apri=neutropenia' },
      { etichetta: 'Cartella: febbre', to: '/anamnesi?apri=febbre' },
    ],
    inBreve: [
      'Sepsi e shock settico sono emergenze: il trattamento comincia subito.',
      'Screening con NEWS2, MEWS o SIRS e non con il solo qSOFA (poco sensibile). Lattato in tutti i sospetti.',
      'Antibiotico entro 1 ora se sepsi probabile/certa o possibile shock; se la sepsi è solo possibile e senza shock, indagini rapide e antibiotico entro 3 ore se l’infezione resta probabile.',
      'Ipoperfusione o shock: almeno 30 mL/kg di cristalloidi bilanciati nelle prime 3 ore (valutando il singolo paziente), noradrenalina anche da vena periferica senza aspettare, PAM 65 (60–65 se ≥ 65 anni).',
      'Controllo della fonte entro 6 ore se serve. Idrocortisone (Flebocortid) nello shock che richiede vasopressori.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Ringer lattato/acetato 30 mL/kg ≈ 2.100 mL nelle prime 3 h (boli da 500 mL rivalutando); peso ideale/aggiustato se BMI > 30.',
          'Noradrenalina: 2 fiale da 2 mg in SF fino a 50 mL (80 µg/mL), partire da 0,05 µg/kg/min ≈ 2,5 mL/h; da vena periferica grossa e controllata (verificare il formato in reparto).',
          'Idrocortisone (Flebocortid) 200 mg/die: 50 mg ev ogni 6 h (o infusione) se servono vasopressori; senza fludrocortisone di routine.',
          'Vasopressina da aggiungere se noradrenalina 0,25–0,5 µg/kg/min senza raggiungere la PAM (terapia intensiva).',
        ],
      },
      {
        titolo: 'Rivalutazione',
        punti: [
          'Refill capillare, PAM, diuresi, stato mentale; lattato ripetuto entro 2–4 h se alto.',
          'Misure dinamiche (sollevamento passivo degli arti, bolo di prova) per guidare altri liquidi.',
          'Dopo la fase di rianimazione: togliere attivamente i liquidi in eccesso (diuretici).',
          'De-escalation dell’antibiotico appena disponibili colture e antibiogramma.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2026-03-23', testo: 'SSC 2026: 129 raccomandazioni (46 nuove). Antibiotico entro 1 h se probabile, entro 3 h dopo indagini se solo possibile; cristalloidi bilanciati; PAM 60–65 negli anziani; noradrenalina periferica; NEWS2/SIRS invece del qSOFA.' },
    ],
  },
  {
    id: 'ictus',
    titolo: 'Ictus ischemico acuto',
    ente: 'AHA/ASA',
    anno: 2026,
    area: 'Neurologia',
    fonte: { etichetta: 'Prabhakaran et al., Stroke 2026 (AHA/ASA)', url: 'https://doi.org/10.1161/STR.0000000000000513' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'nihss', nome: 'NIHSS' }, { id: 'gcs', nome: 'GCS' }],
    vediAnche: [{ etichetta: 'TIA', to: '/linee-guida/tia' }, { etichetta: 'Cartella: deficit neurologico', to: '/anamnesi?apri=deficit-neurologico' }],
    inBreve: [
      'Codice ictus: ora dell’ultima volta visto bene, glicemia subito, NIHSS, TC + angio-TC senza ritardi.',
      'Trombolisi entro 4,5 h nei deficit invalidanti, qualunque sia il NIHSS: tenecteplase (Metalyse) 0,25 mg/kg (max 25 mg) in bolo oppure alteplase (Actilyse) 0,9 mg/kg. Prima è meglio.',
      'Esordio ignoto/al risveglio: trombolisi possibile tra 4,5 e 9 h con penombra alla perfusione (o mismatch DWI-FLAIR alla RM).',
      'Occlusione di grosso vaso: trombectomia fino a 24 h, anche nei core estesi selezionati e nell’occlusione basilare; non aspettare la risposta alla trombolisi.',
      'PA < 185/110 prima e < 180/105 dopo la trombolisi; abbassarla sotto 140 non serve e dopo trombectomia riuscita peggiora l’esito.',
    ],
    sezioni: [
      {
        titolo: 'Trombolisi (70 kg)',
        punti: [
          'Tenecteplase (Metalyse) 0,25 mg/kg = 17,5 mg in bolo in 5–10 s (flacone da 50 mg = 10.000 UI ricostituito in 10 mL a 5 mg/mL: 3,5 mL). Non usare 0,4 mg/kg.',
          'Alteplase (Actilyse) 0,9 mg/kg = 63 mg: 6,3 mg in bolo, poi 56,7 mg in 60 min (flaconi da 50 mg; massimo 90 mg).',
          'Controlli neurologici e PA ogni 15 min per 2 h, poi ogni 30 min per 6 h, poi ogni ora fino a 24 h. Niente antiaggreganti/anticoagulanti per 24 h.',
          'Peggioramento, cefalea, vomito, ipertensione improvvisa: sospendere l’infusione e TC urgente.',
        ],
      },
      {
        titolo: 'Controindicazioni principali',
        punti: [
          'Emorragia intracranica alla TC; ipodensità estesa già evidente.',
          'Trauma cranico grave o ictus ischemico negli ultimi 3 mesi; chirurgia intracranica/spinale recente; neoplasia intracranica intra-assiale.',
          'Sanguinamento attivo; piastrine < 100.000; INR > 1,7; eparina a dosi terapeutiche nelle 24 h; DOAC nelle ultime 48 h (se non dosati o antagonizzati).',
          'PA che non scende sotto 185/110 con la terapia; glicemia < 50 mg/dL (correggere e rivalutare).',
          'Dissezione aortica sospetta, endocardite.',
        ],
      },
      {
        titolo: 'Pressione arteriosa',
        punti: [
          'Prima della trombolisi: se > 185/110, labetalolo (Trandate) 10–20 mg ev (2–4 mL della fiala 100 mg/20 mL) o urapidil (Ebrantil) 12,5–25 mg ev (2,5–5 mL della fiala 50 mg/10 mL).',
          'Senza riperfusione: trattare solo se > 220/120.',
          'Glicemia 140–180 mg/dL; evitare ipertermia e ipossia (SpO₂ > 94%).',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2026-01-26', testo: 'AHA/ASA 2026: tenecteplase equivalente all’alteplase; finestra estesa 4,5–9 h con imaging; trombectomia nei core estesi e nella basilare; niente PA < 140 dopo riperfusione; prime raccomandazioni pediatriche.' },
    ],
  },
  {
    id: 'chetoacidosi',
    titolo: 'Chetoacidosi e stato iperosmolare',
    ente: 'ADA/EASD/JBDS',
    anno: 2024,
    area: 'Metabolismo',
    fonte: { etichetta: 'Umpierrez et al., Diabetologia 2024 (consenso)', url: 'https://doi.org/10.1007/s00125-024-05979-4' },
    controllata: '2026-11-11',
    inBreve: [
      'Chetoacidosi (DKA) = D + K + A: glicemia ≥ 200 mg/dL o diabete noto; β-idrossibutirrato ≥ 3,0 mmol/L (o chetonuria ≥ 2+); pH < 7,3 e/o bicarbonati < 18.',
      'Stato iperosmolare (HHS): glicemia ≥ 600, osmolalità efficace > 300, β-OHB < 3, pH ≥ 7,3 e bicarbonati ≥ 15.',
      'Ordine: liquidi → potassio → insulina. Insulina solo con K ≥ 3,5.',
      'Insulina ev a dose fissa 0,1 U/kg/h (DKA moderata-grave); con glicemia < 250 aggiungere glucosata e ridurre a 0,05 U/kg/h.',
      'Risoluzione DKA: β-OHB < 0,6 e pH ≥ 7,3 o bicarbonati ≥ 18. Prima di sospendere l’insulina ev, iniziare la basale sottocute.',
    ],
    sezioni: [
      {
        titolo: 'Insulina e potassio (70 kg)',
        punti: [
          'Insulina rapida (Actrapid) 50 UI in SF fino a 50 mL = 1 UI/mL: 0,1 U/kg/h = 7 mL/h; 0,05 U/kg/h = 3,5 mL/h. Bolo solo se la pompa ritarda.',
          'K < 3,5: niente insulina; KCl 10–20 mEq/h (fiale 2 mEq/mL da 10 mL = 20 mEq) con monitor, fino a K ≥ 3,5.',
          'K 3,5–5: 10–20 mEq di KCl in ogni litro di liquidi.',
          'K > 5: niente potassio, ricontrollare ogni 1–2 h.',
          'Bicarbonato solo se pH < 7,0.',
        ],
      },
      {
        titolo: 'Liquidi',
        punti: [
          'SF 0,9% o Ringer: 1–1,5 L nella prima ora (boli da 250 mL negli anziani, cardiopatici, nefropatici), poi 250–500 mL/h secondo idratazione e sodio corretto.',
          'Glicemia < 250 mg/dL: aggiungere glucosata 5–10%, obiettivo 150–200 (DKA) o 200–250 (HHS).',
          'Chetoacidosi euglicemica (SGLT2-inibitori): glucosata fin dall’inizio insieme all’insulina.',
          'HHS: calo della glicemia ≤ 90–120 mg/dL/h, del sodio ≤ 10 mmol/L in 24 h, dell’osmolalità 3–8 mOsm/kg/h; insulina 0,05 U/kg/h.',
        ],
      },
      {
        titolo: 'Monitoraggio',
        punti: [
          'Glicemia capillare ogni ora; β-OHB, EGA venoso, potassio ogni 2–4 h.',
          'Cercare la causa: infezione, infarto, sospensione dell’insulina, pancreatite, farmaci (SGLT2-inibitori, cortisone).',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2024-06-22', testo: 'Consenso ADA/EASD/JBDS/AACE/DTS 2024: soglia glicemica 200 (prima 250), β-idrossibutirrato centrale per diagnosi e risoluzione, primi criteri di risoluzione dell’HHS.' },
    ],
  },
  {
    id: 'iperkaliemia',
    titolo: 'Iperkaliemia',
    ente: 'UK Kidney Association',
    anno: 2023,
    area: 'Metabolismo',
    fonte: { etichetta: 'UKKA, Treatment of acute hyperkalaemia in adults 2023', url: 'https://www.ukkidney.org/sites/renal.org/files/UKKA%20HYPERKALAEMIA%20GUIDELINE%20-%202023%20-%20Draft%20for%20public%20consultation_1.pdf' },
    controllata: '2026-11-11',
    vediAnche: [{ etichetta: 'Timer ACR', to: '/acr' }],
    inBreve: [
      'Lieve 5,5–5,9; moderata 6,0–6,4; grave ≥ 6,5 mmol/L. ECG e monitor se ≥ 6,0. Escludere la pseudoiperkaliemia (emolisi): ricontrollo su EGA.',
      'Proteggere il cuore se ci sono alterazioni ECG: calcio gluconato 10% 30 mL ev in 10 min (calcio cloruro 10 mL nell’arresto).',
      'Spostare il potassio: insulina 10 UI + 25 g di glucosio in 15 min; salbutamolo (Broncovaleas) 10–20 mg nebulizzato in aggiunta.',
      'Eliminare il potassio: in PS c’è il sodio polistirene sulfonato (Kayexalate), lento e poco efficace in acuto; la linea guida preferisce lo zirconio ciclosilicato (Lokelma). Dialisi se refrattaria o insufficienza renale grave.',
      'Glicemia controllata per 6 ore dopo l’insulina: l’ipoglicemia tardiva è frequente.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (adulto)',
        punti: [
          'Calcio gluconato 10%: 30 mL = 3 fiale da 10 mL in 10 min; ripetere se l’ECG non migliora dopo 5–10 min (dura 30–60 min).',
          'Insulina rapida 10 UI + 25 g di glucosio in 15 min: 250 mL di glucosata 10% oppure 50 mL al 50%. Se glicemia di partenza < 126 mg/dL: poi glucosata 10% 50 mL/h per 5 h. Se glicemia > 250: solo insulina.',
          'Salbutamolo (Broncovaleas) 10–20 mg nebulizzato (10 mg = 2 mL della soluzione 5 mg/mL); 10 mg se cardiopatia ischemica.',
          'Sodio polistirene sulfonato (Kayexalate) 15 g per bocca 3–4 volte al giorno o 30 g per clistere; agisce in ore, rischio di necrosi intestinale (no se ileo o dopo chirurgia addominale). La linea guida preferisce lo zirconio ciclosilicato (Lokelma) 10 g ogni 8 h, non disponibile in PS.',
          'Bicarbonato 8,4% 50 mL solo se acidosi metabolica.',
          'Furosemide (Lasix) 40–80 mg ev se diuresi conservata e non disidratato.',
        ],
      },
      {
        titolo: 'Monitoraggio e prevenzione',
        punti: [
          'Glicemia a 0, 15, 30, 60 min poi ogni ora fino a 6 h dall’insulina.',
          'Potassio a 1, 2, 4, 6 e 24 h; obiettivo < 6 entro 2 h.',
          'Sospendere i farmaci che lo aumentano: ACE-i/sartani, antialdosteronici, FANS, trimetoprim, integratori di potassio, diuretici risparmiatori.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2023-10-01', testo: 'UKKA 2023: calcio gluconato 30 mL in 10 min, calcio cloruro in rianimazione, protocollo insulina-glucosio in due tempi, zirconio ciclosilicato nelle forme gravi, resine al calcio tolte dall’acuto.' },
    ],
  },
  {
    id: 'iponatriemia',
    titolo: 'Iponatriemia',
    ente: 'ESE/ERA/ESICM',
    anno: 2014,
    area: 'Metabolismo',
    fonte: { etichetta: 'Spasovski et al., Eur J Endocrinol 2014', url: 'https://doi.org/10.1530/EJE-13-1020' },
    controllata: '2026-11-11',
    inBreve: [
      'Prima escludere pseudo-iponatriemia e iperglicemia (osmolalità plasmatica).',
      'Sintomi gravi (vomito, convulsioni, sopore, coma, arresto) qualunque sia la causa: 150 mL di NaCl 3% in 20 min, ripetibile 2 volte, fino a +5 mmol/L.',
      'Sintomi moderati (nausea, confusione, cefalea): un solo bolo di 150 mL di NaCl 3%, poi cercare la causa.',
      'Limite di correzione: ≤ 10 mmol/L nelle prime 24 h (≤ 8 se a rischio di demielinizzazione) e ≤ 8 ogni 24 h successive.',
      'Ipercorrezione: sospendere, glucosata 5% e/o desmopressina, con specialista.',
    ],
    sezioni: [
      {
        titolo: 'Preparare la NaCl 3%',
        punti: [
          '150 mL di NaCl 3% contengono circa 77 mEq di sodio.',
          'Se non c’è la soluzione pronta: SF 0,9% 100 mL + 30 mL di NaCl 2 mEq/mL (3 fiale da 10 mL) ≈ 130 mL con 75 mEq (≈ 3,4%), da infondere in 20 min (verificare con la farmacia).',
          'Sodio ricontrollato dopo ogni bolo, poi a 6, 12, 24 h.',
        ],
      },
      {
        titolo: 'Inquadramento (senza sintomi gravi)',
        punti: [
          'Osmolalità urinaria < 100: eccesso di acqua (polidipsia, birra, «tea and toast»).',
          'Sodio urinario < 30 con osmolalità urinaria > 100: ipovolemia vera o efficace (vomito, diarrea, scompenso, cirrosi).',
          'Sodio urinario ≥ 30: diuretici, SIADH, insufficienza surrenalica, ipotiroidismo, nefropatia.',
          'Ipovolemia: SF 0,9% 0,5–1 mL/kg/h; SIADH: restrizione idrica; scompenso/cirrosi: restrizione, diuretico dell’ansa.',
          'Rischio di demielinizzazione: Na ≤ 120, alcolismo, malnutrizione, ipokaliemia, cirrosi, tiazidici.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2026-11-11', testo: 'Controllo: la linea guida europea del 2014 resta il riferimento; la Society for Endocrinology britannica (2022) usa lo stesso schema a boli.' },
      { data: '2014-02-25', testo: 'Linea guida europea: boli di 150 mL di NaCl 3% nei sintomi gravi, limite 10 mmol/L nelle prime 24 h.' },
    ],
  },
  {
    id: 'stato-di-male',
    titolo: 'Stato di male epilettico',
    ente: 'ACEP 2024 · ESETT',
    anno: 2024,
    area: 'Neurologia',
    fonte: { etichetta: 'Kapur et al., N Engl J Med 2019 (ESETT)', url: 'https://doi.org/10.1056/NEJMoa1905795' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'gcs', nome: 'GCS' }],
    vediAnche: [
      { etichetta: 'Sedazione: intubazione', to: '/sedazione?apri=intubazione' },
      { etichetta: 'Cartella: crisi convulsiva', to: '/anamnesi?apri=convulsione' },
    ],
    inBreve: [
      'Stato di male: crisi ≥ 5 minuti o crisi ripetute senza ripresa della coscienza.',
      'A 5 minuti: benzodiazepina a dose piena (l’errore più frequente è sottodosarla), ripetibile una volta.',
      'Se continua: seconda linea con levetiracetam (Keppra), valproato (Depakin) o fenitoina (Dintoina) — efficacia simile (ESETT, ACEP 2024).',
      'Refrattario: intubazione e anestetico in infusione, EEG, terapia intensiva.',
      'Glicemia subito; cercare la causa (sospensione dei farmaci, alcol, tossici, ipo-Na, infezione, lesione cerebrale).',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Diazepam (Valium) 10 mg ev = 1 fiala da 10 mg/2 mL in 2 min, ripetibile una volta dopo 5 min (0,15–0,2 mg/kg per dose, max 10 mg).',
          'Senza vena: midazolam (Ipnovel) 10 mg im = 2 fiale da 5 mg/1 mL (o buccale/intranasale); diazepam (Valium) 10 mg rettale (Micropam).',
          'Levetiracetam (Keppra) 60 mg/kg (max 4.500 mg) = 4.200 mg = 42 mL (8,4 fiale da 500 mg/5 mL) in 100 mL di SF in 10 min.',
          'Valproato (Depakin) 40 mg/kg (max 3.000 mg) = 2.800 mg = 7 flaconi da 400 mg in 100 mL di SF in 10 min (no in gravidanza, epatopatia, malattie mitocondriali).',
          'Fenitoina (Dintoina) 20 mg/kg = 1.400 mg = 5,6 fiale da 250 mg/5 mL, non più di 50 mg/min (≈ 28 min) con monitor (ipotensione, aritmie).',
          'Alternativa: lacosamide (Vimpat) 200–400 mg ev in 15–30 min (no se BAV).',
        ],
      },
      {
        titolo: 'Cause da cercare e trattare',
        punti: [
          'Ipoglicemia: tiamina 100 mg ev poi glucosio 33% 50 mL (5 fiale da 10 mL).',
          'Iponatriemia grave: NaCl 3% (PDTA iponatriemia).',
          'Eclampsia (gravidanza > 20 settimane o puerperio): magnesio solfato 4 g ev (4 fiale da 1 g/10 mL) in 15–20 min.',
          'Intossicazioni (triciclici, isoniazide: piridossina), astinenza da alcol o benzodiazepine.',
          'TC encefalo; rachicentesi se febbre o sospetta infezione (antibiotico prima, se ritardata).',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2024-04-18', testo: 'ACEP 2024: dopo benzodiazepine adeguate, fosfenitoina, levetiracetam o valproato con efficacia simile.' },
      { data: '2019-11-28', testo: 'ESETT: levetiracetam 60 mg/kg, valproato 40 mg/kg e fosfenitoina 20 mg/kg equivalenti (circa metà dei pazienti risponde).' },
    ],
  },
  {
    id: 'anafilassi',
    titolo: 'Anafilassi',
    ente: 'Resuscitation Council UK · EAACI',
    anno: 2021,
    area: 'Allergologia · Emergenze',
    fonte: { etichetta: 'RCUK, Emergency treatment of anaphylaxis 2021', url: 'https://resus.org.uk/media/337/download' },
    controllata: '2026-11-11',
    vediAnche: [
      { etichetta: 'Dimissione orticaria', to: '/dimissioni?apri=orticaria' },
      { etichetta: 'Cartella: reazione allergica', to: '/anamnesi?apri=allergia' },
    ],
    inBreve: [
      'Adrenalina im subito: 0,5 mg (0,5 mL della fiala da 1 mg/mL) nella coscia anterolaterale; ripetere dopo 5 min se i problemi A, B o C persistono.',
      'Paziente sdraiato con le gambe sollevate (seduto se dispnoico); non farlo alzare in piedi. Ossigeno, liquidi in bolo se ipoteso.',
      'Refrattaria (nessun miglioramento dopo 2 dosi im): adrenalina in infusione ev e aiuto esperto.',
      'Antistaminici e cortisone NON sono terapia d’emergenza: antistaminico solo per i sintomi cutanei dopo la stabilizzazione; cortisone solo nelle forme refrattarie o con asma/shock persistente.',
      'Dimissione con 2 autoiniettori, istruzioni e visita allergologica.',
    ],
    sezioni: [
      {
        titolo: 'Forma refrattaria (70 kg)',
        punti: [
          'Adrenalina 1 mg (1 fiala da 1 mg/mL) in 100 mL di SF (10 µg/mL): partire da 0,5–1 mL/kg/h = 35–70 mL/h, titolare; monitor e PA invasiva se possibile.',
          'Liquidi: cristalloidi 500–1.000 mL in bolo, ripetibili (anche diversi litri).',
          'Beta-bloccati: glucagone (GlucaGen) 1–2 mg ev ogni 5 min.',
          'Broncospasmo: salbutamolo (Broncovaleas) nebulizzato; edema laringeo: adrenalina nebulizzata 5 mg (5 fiale), intubazione precoce da parte di esperto.',
          'Arresto: ALS con adrenalina ev 1 mg (timer ACR).',
        ],
      },
      {
        titolo: 'Osservazione e dimissione',
        punti: [
          'Almeno 6 h dopo la risoluzione se sono servite 2 dosi di adrenalina o reazioni bifasiche precedenti.',
          'Almeno 12 h se forma grave (> 2 dosi), asma grave, arrivo tardivo, possibile assorbimento continuo dell’allergene, o paziente che vive solo/lontano.',
          'Triptasi: subito dopo il trattamento iniziale, poi a 1–2 h (non oltre 4 h).',
          'Due autoiniettori di adrenalina prescritti e spiegati; segnalare l’allergene; visita allergologica.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2026-11-11', testo: 'Controllo: RCUK 2021 ed EAACI 2021 restano le versioni in vigore.' },
      { data: '2021-05-01', testo: 'RCUK 2021: ripetere l’adrenalina im dopo 5 min, algoritmo per la forma refrattaria, niente antistaminici né cortisone di routine nell’emergenza.' },
    ],
  },
  {
    id: 'paracetamolo',
    titolo: 'Intossicazione da paracetamolo',
    ente: 'Australia e Nuova Zelanda',
    anno: 2019,
    area: 'Tossicologia',
    fonte: { etichetta: 'Chiew et al., Med J Aust 2020', url: 'https://doi.org/10.5694/mja2.50428' },
    controllata: '2026-11-11',
    vediAnche: [
      { etichetta: 'Rubrica: Tossicologia Careggi', to: '/rubrica' },
      { etichetta: 'Cartella: intossicazione', to: '/anamnesi?apri=intossicazione' },
    ],
    inBreve: [
      'Dose potenzialmente tossica: ≥ 10 g o ≥ 200 mg/kg (la minore) in un’unica assunzione.',
      'Carbone attivo 50 g entro 2 h dall’ingestione (entro 4 h se ≥ 30 g o rilascio modificato), se vigile e collaborante.',
      'Paracetamolemia a 4 h (o appena possibile dopo): sopra la linea del nomogramma → N-acetilcisteina (Hidonac).',
      'Ora sconosciuta, assunzioni ripetute nel tempo, rilascio modificato o arrivo dopo 8 h con dose tossica: N-acetilcisteina (Hidonac) subito, senza aspettare il dosaggio.',
      'N-acetilcisteina (Hidonac) a due sacche: 200 mg/kg in 4 h, poi 100 mg/kg in 16 h. Intossicazione massiva: seconda sacca raddoppiata. Sentire il Centro Antiveleni.',
    ],
    sezioni: [
      {
        titolo: 'N-acetilcisteina (70 kg)',
        punti: [
          '1ª sacca: 200 mg/kg = 14 g = 70 mL di N-acetilcisteina (Hidonac) 200 mg/mL = 2,8 fiale da 5 g/25 mL in 500 mL di glucosata 5% in 4 h.',
          '2ª sacca: 100 mg/kg = 7 g = 35 mL (1,4 fiale) in 1.000 mL di glucosata 5% in 16 h.',
          'Massiva (≥ 30 g o paracetamolemia > doppio della linea): 2ª sacca 200 mg/kg = 14 g in 16 h.',
          'Reazioni anafilattoidi (rash, broncospasmo): sospendere, antistaminico, poi riprendere a velocità più bassa. Non sono una vera allergia.',
          'Fine terapia: paracetamolo < 20 mg/L e ALT normali o in calo; altrimenti continuare alla velocità della 2ª sacca.',
        ],
      },
      {
        titolo: 'Linea di trattamento del nomogramma',
        punti: [
          'Linea 150 mg/L a 4 h, che si dimezza ogni 4 h: 4 h → 150; 6 h → 106; 8 h → 75; 10 h → 53; 12 h → 38; 14 h → 27; 16 h → 19 mg/L.',
          'Il nomogramma vale solo per un’assunzione unica di paracetamolo a rilascio immediato con orario noto. (Il Regno Unito usa una linea più bassa, 100 mg/L a 4 h.)',
          'Esami: paracetamolemia, ALT, INR, creatinina, glicemia, EGA con lattati; ripetere a fine infusione.',
          'Gravità: INR > 3 a 48 h o > 4,5, creatinina > 2,3 mg/dL, pH < 7,3, lattati > 3, encefalopatia → epatologo/centro trapianti.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2019-12-01', testo: 'Linee guida Australia/NZ: N-acetilcisteina a due sacche (meno reazioni), dose aumentata nelle intossicazioni massive, rilascio modificato sempre trattato.' },
    ],
  },
  {
    id: 'emorragia-cerebrale',
    titolo: 'Emorragia cerebrale spontanea',
    ente: 'AHA/ASA',
    anno: 2022,
    area: 'Neurologia',
    fonte: { etichetta: 'Greenberg et al., Stroke 2022 (AHA/ASA)', url: 'https://doi.org/10.1161/STR.0000000000000407' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'ich', nome: 'ICH score' }, { id: 'gcs', nome: 'GCS' }],
    vediAnche: [{ etichetta: 'Anticoagulato che sanguina', to: '/linee-guida/anticoagulato-sanguinamento' }, { etichetta: 'Codice ictus', to: '/linee-guida/ictus' }],
    inBreve: [
      'TC senza contrasto subito; angio-TC per spot sign e lesioni sottostanti (soprattutto se < 70 anni, lobare, senza ipertensione).',
      'PAS 150–220: portarla a 140 e mantenerla 130–150, in modo graduale e senza oscillazioni; iniziare entro 2 h dall’esordio e arrivare all’obiettivo entro 1 h. Evitare PAS < 130.',
      'Anticoagulante: sospendere e antagonizzare subito (PCC + vitamina K (Konakion) per i dicumarolici, idarucizumab (Praxbind) per dabigatran (Pradaxa), PCC per gli anti-Xa).',
      'Antiaggregante: niente trasfusione di piastrine se non va in sala operatoria.',
      'Neurochirurgo subito per emorragia cerebellare con compressione del tronco o idrocefalo, o deterioramento.',
      'No corticosteroidi, no antiepilettici in profilassi, no acido tranexamico di routine.',
    ],
    sezioni: [
      {
        titolo: 'Pressione arteriosa (70 kg)',
        punti: [
          'Labetalolo (Trandate 100 mg/20 mL): 10–20 mg ev in 2 min, ripetibile ogni 10 min fino a 300 mg; poi 0,5–2 mg/min.',
          'Urapidil (Ebrantil 50 mg/10 mL): 10–25 mg ev lento, ripetibile dopo 5 min; poi 5–30 mg/h.',
          'PAS > 220: infusione continua con controllo ravvicinato (ogni 5–10 min o arteriosa).',
        ],
      },
      {
        titolo: 'Antagonizzare (70 kg)',
        punti: [
          'Dicumarolico con INR ≥ 2: complesso protrombinico (PCC) 25–50 UI/kg secondo INR (INR 2–4: 25 UI/kg = 1.750 UI ≈ 4 flaconi da 500; 4–6: 35 UI/kg = 2.450 UI = 5 flaconi; > 6: 50 UI/kg = 3.500 UI = 7 flaconi) + vitamina K (Konakion) 10 mg ev lenta (1 fiala). INR 1,3–1,9: PCC da considerare.',
          'Dabigatran (Pradaxa): idarucizumab (Praxbind) 5 g ev (2 flaconi da 2,5 g).',
          'Apixaban (Eliquis), rivaroxaban (Xarelto), edoxaban (Lixiana): PCC 50 UI/kg = 3.500 UI = 7 flaconi da 500 UI. Andexanet alfa: ritirato negli USA nel 2025 per eventi trombotici; in Europa autorizzazione condizionata.',
          'Eparina non frazionata: protamina 1 mg ogni 100 UI somministrate nelle ultime 2–3 h (max 50 mg). Enoxaparina (Clexane) < 8 h: protamina 1 mg per mg (effetto parziale).',
          'Ultima assunzione < 2 h di un anticoagulante orale: carbone attivo 50 g se protegge le vie aeree.',
        ],
      },
      {
        titolo: 'Altro',
        punti: [
          'Testa a 30°, glicemia 80–180 mg/dL, normotermia, trattare le crisi solo se presenti.',
          'TC di controllo entro 24 h o subito se peggiora.',
          'L’ICH score stima la prognosi ma non deve far limitare le cure nelle prime 24 h.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2022-05-17', testo: 'AHA/ASA 2022: obiettivo PAS 140 (130–150) con controllo graduale, PCC preferito al plasma, andexanet ragionevole per gli anti-Xa, no piastrine se non chirurgico.' },
      { data: '2025-12-22', testo: 'Andexanet alfa ritirato dal mercato USA (FDA: rischi trombotici superiori ai benefici); in Europa resta con autorizzazione condizionata. PCC prima scelta pratica per gli anti-Xa.' },
    ],
  },
  {
    id: 'esa',
    titolo: 'Emorragia subaracnoidea',
    ente: 'AHA/ASA',
    anno: 2023,
    area: 'Neurologia',
    fonte: { etichetta: 'Hoh et al., Stroke 2023 (AHA/ASA)', url: 'https://doi.org/10.1161/STR.0000000000000436' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'ottawa-esa', nome: 'Regola di Ottawa per ESA' }, { id: 'gcs', nome: 'GCS' }],
    vediAnche: [{ etichetta: 'Emorragia cerebrale', to: '/linee-guida/emorragia-cerebrale' }, { etichetta: 'Dimissione cefalea', to: '/dimissioni?apri=cefalea' }],
    inBreve: [
      'Cefalea improvvisa che raggiunge il massimo in meno di 1 ora: pensarci. La regola di Ottawa aiuta a escluderla nei pazienti vigili.',
      'TC entro 6 h dall’esordio, letta da un radiologo esperto e negativa: ESA esclusa. Oltre 6 h: rachicentesi (xantocromia, almeno 12 h dall’esordio) o angio-TC.',
      'ESA confermata: neurochirurgia/neuroradiologia di Careggi per trattare l’aneurisma il prima possibile.',
      'Nimodipina (Nimotop) 60 mg per bocca ogni 4 h; antagonizzare gli anticoagulanti; controllare la PA (obiettivo esatto non definito; spesso PAS < 160).',
      'Idrocefalo acuto con peggioramento: derivazione ventricolare esterna.',
      'No acido tranexamico, no antiepilettici in profilassi di routine.',
    ],
    sezioni: [
      {
        titolo: 'Regola di Ottawa',
        punti: [
          'Per: vigili (GCS 15), > 15 anni, cefalea nuova, grave, non traumatica, al massimo entro 1 h.',
          'Non escludibile se uno qualsiasi: età ≥ 40; dolore o rigidità al collo; perdita di coscienza testimoniata; esordio sotto sforzo; esordio a colpo di tuono (massimo istantaneo); flessione del collo limitata alla visita.',
          'Non vale per: deficit neurologici nuovi, aneurisma o ESA o tumore cerebrale noti, cefalee ricorrenti simili.',
        ],
      },
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Nimodipina (Nimotop) 60 mg = 2 compresse da 30 mg ogni 4 h per 21 giorni; se ipotensione, 30 mg ogni 2 h.',
          'Pressione: labetalolo (Trandate) 10–20 mg ev o urapidil (Ebrantil) 10–25 mg ev, evitando ipotensione.',
          'Analgesia: paracetamolo 1 g ev; oppioide a basse dosi se serve. Antiemetico.',
          'Anticoagulanti: vedi il PDTA «Anticoagulato che sanguina».',
        ],
      },
      {
        titolo: 'Gravità e trasferimento',
        punti: [
          'WFNS (basata su GCS e deficit motorio) o Hunt-Hess per descrivere la gravità al centro di riferimento.',
          'Intubazione se GCS ≤ 8 o vie aeree non protette; evitare iper- e ipocapnia, ipotensione, ipossia.',
          'Glicemia, sodio (rischio di iponatriemia), temperatura.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2023-05-22', testo: 'AHA/ASA 2023: trattamento precoce dell’aneurisma, nimodipina, no acido tranexamico (studio ULTRA), no statine/magnesio per il vasospasmo.' },
    ],
  },
  {
    id: 'anticoagulato-sanguinamento',
    titolo: 'Anticoagulato che sanguina',
    ente: 'ACC',
    anno: 2020,
    area: 'Ematologia · Emergenze',
    fonte: { etichetta: 'Tomaselli et al., J Am Coll Cardiol 2020 (ACC ECDP)', url: 'https://doi.org/10.1016/j.jacc.2020.04.053' },
    controllata: '2026-11-11',
    vediAnche: [
      { etichetta: 'Emorragia cerebrale', to: '/linee-guida/emorragia-cerebrale' },
      { etichetta: 'Emorragia digestiva', to: '/linee-guida/emorragia-digestiva' },
      { etichetta: 'Trauma cranico in TAO', to: '/dimissioni?apri=trauma-cranico-tao' },
    ],
    inBreve: [
      'Sanguinamento maggiore: instabilità emodinamica, sede critica (cranio, rachide, pericardio, occhio, retroperitoneo, articolazione, muscolo con sindrome compartimentale), Hb ↓ ≥ 2 g/dL o ≥ 2 unità di emazie.',
      'Maggiore: sospendere anticoagulante e antiaggreganti, emostasi locale, trasfondere, antagonizzare (se c’è un antidoto) senza ritardare la rianimazione.',
      'Non maggiore: niente antagonista; sospensione temporanea fino all’emostasi, emostasi locale.',
      'Sempre: quale farmaco, dose, ora dell’ultima assunzione, funzione renale.',
      'Ripresa dell’anticoagulante: decisione condivisa dopo l’emostasi (digestivo spesso entro 1–2 settimane; intracranico dopo almeno 4 settimane).',
    ],
    sezioni: [
      {
        titolo: 'Antidoti (70 kg)',
        punti: [
          'Dicumarolico (warfarin (Coumadin), acenocumarolo (Sintrom)): PCC 25–50 UI/kg secondo INR (1.750–3.500 UI = 4–7 flaconi da 500 UI) + vitamina K (Konakion) 5–10 mg ev lenta.',
          'Dabigatran (Pradaxa): idarucizumab (Praxbind) 5 g ev (2 flaconi da 2,5 g); dialisi se non disponibile.',
          'Apixaban (Eliquis), rivaroxaban (Xarelto), edoxaban (Lixiana): PCC 50 UI/kg = 3.500 UI = 7 flaconi da 500 UI (alternativa a dose fissa 2.000 UI). Andexanet alfa solo dove disponibile: segnale di trombosi, ritirato negli USA.',
          'Eparina non frazionata: protamina 1 mg ogni 100 UI delle ultime 2–3 h (max 50 mg).',
          'Enoxaparina (Clexane): protamina 1 mg per mg se < 8 h (0,5 mg per mg se 8–12 h); neutralizzazione parziale.',
          'Assunzione dell’anticoagulante orale < 2–4 h: carbone attivo 50 g.',
        ],
      },
      {
        titolo: 'INR alto senza sanguinamento (dicumarolici)',
        punti: [
          'INR sopra il range e < 10: sospendere 1–2 dosi, ridurre la dose; niente vitamina K (Konakion) di routine.',
          'INR > 10: sospendere e vitamina K (Konakion) 2–5 mg per bocca; ricontrollo a 24 h.',
        ],
      },
      {
        titolo: 'Misure generali',
        punti: [
          'Due accessi venosi grossi, emocromo, PT/INR, aPTT, fibrinogeno, creatinina, gruppo e prove crociate.',
          'Acido tranexamico 1 g ev in 10 min (2 fiale da 500 mg) nel trauma entro 3 h; non nel sanguinamento digestivo (HALT-IT).',
          'Antiaggreganti: trasfusione di piastrine solo se procedura urgente o sanguinamento critico, con specialista.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2020-07-14', testo: 'ACC 2020: algoritmi per sanguinamento maggiore/non maggiore, antidoti per DOAC e dicumarolici, criteri di ripresa.' },
      { data: '2025-12-22', testo: 'Andexanet alfa ritirato dal mercato USA per eventi trombotici; PCC prima scelta pratica per gli anti-Xa.' },
    ],
  },
  {
    id: 'nste-sca',
    titolo: 'SCA senza sopraslivellamento ST (NSTE-SCA)',
    ente: 'ESC',
    anno: 2023,
    area: 'Cardiologia',
    fonte: { etichetta: 'Byrne et al., Eur Heart J 2023 (ESC)', url: 'https://doi.org/10.1093/eurheartj/ehad191' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'heart', nome: 'HEART' }],
    vediAnche: [
      { etichetta: 'STEMI', to: '/linee-guida/stemi' },
      { etichetta: 'Dissezione aortica', to: '/linee-guida/dissezione-aortica' },
      { etichetta: 'Dimissione dolore toracico', to: '/dimissioni?apri=dolore-toracico' },
    ],
    inBreve: [
      'ECG entro 10 min. Troponina ad alta sensibilità: a Prato il dosaggio è validato con prelievi a 0 e 3 h (l’ESC 2023 preferisce 0/1 h o 0/2 h, ma vanno usati i tempi e le soglie validati per il proprio dosaggio).',
      'Invasiva immediata (< 2 h) se rischio molto alto: instabilità o shock, dolore refrattario, aritmie maligne o arresto, complicanze meccaniche, scompenso acuto, sopraslivellamenti ST intermittenti.',
      'Invasiva precoce (< 24 h) se rischio alto: NSTEMI confermato, alterazioni ST-T dinamiche, sopraslivellamento ST transitorio, GRACE > 140.',
      'ASA a tutti; pretrattamento con inibitore P2Y12 non di routine se la coronarografia è prevista entro 24 h.',
      'Anticoagulante: eparina non frazionata se coronarografia subito; enoxaparina (Clexane) in alternativa; fondaparinux (Arixtra) se la coronarografia non è precoce.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'ASA: 150–300 mg per bocca masticata o 75–250 mg ev (Flectadol 500 mg: mezzo flacone = 250 mg).',
          'Eparina non frazionata: 70–100 UI/kg = 5.000–7.000 UI ev = 1–1,4 mL della fiala da 25.000 UI/5 mL.',
          'Enoxaparina (Clexane) 1 mg/kg = 70 mg sc ogni 12 h (dimezzare la frequenza se clearance < 30).',
          'Fondaparinux (Arixtra) 2,5 mg sc al giorno (se coronarografia non precoce).',
          'P2Y12 (con il cardiologo): ticagrelor (Brilique) 180 mg, prasugrel (Efient) 60 mg (se anatomia nota; no se ictus/TIA pregresso), clopidogrel (Plavix) 300–600 mg se anticoagulato o gli altri non indicati.',
          'Nitrati se dolore o ipertensione (no se PAS < 90, infarto del ventricolo destro, inibitori PDE5 recenti); metoprololo (Lopresor) 5 mg ev se tachicardia e ipertensione senza scompenso; morfina 2–4 mg ev se dolore forte; ossigeno solo se SpO₂ < 90%.',
        ],
      },
      {
        titolo: 'Troponina 0/3 h (protocollo di Prato)',
        punti: [
          'Prelievo all’arrivo e a 3 h (dall’arrivo; se il dolore è iniziato da più di 6 h può bastare il primo prelievo, secondo il laboratorio).',
          'Esclusione: entrambi i valori sotto il 99° percentile del dosaggio, senza variazione significativa, paziente senza dolore e con rischio basso (HEART, GRACE < 140).',
          'Conferma: valore sopra il 99° percentile con aumento o calo significativo tra 0 e 3 h (dinamica), in un quadro clinico compatibile.',
          'Valori alti e stabili: danno miocardico cronico (insufficienza renale, scompenso) più che infarto; valutare con il cardiologo.',
          'Soglie (99° percentile e variazione significativa): quelle del laboratorio di Prato per il dosaggio in uso.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2023-08-25', testo: 'ESC 2023: unica linea guida per tutte le SCA, pretrattamento P2Y12 non di routine nella strategia invasiva precoce, terapia antitrombotica personalizzata.' },
    ],
  },
  {
    id: 'dissezione-aortica',
    titolo: 'Dissezione aortica e sindromi aortiche acute',
    ente: 'ESC',
    anno: 2024,
    area: 'Cardiologia · Chirurgia vascolare',
    fonte: { etichetta: 'Mazzolai et al., Eur Heart J 2024 (ESC)', url: 'https://academic.oup.com/eurheartj/article/45/36/3538/7738955' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'addrs', nome: 'ADD-RS' }],
    vediAnche: [{ etichetta: 'Pericardiocentesi', to: '/procedure?apri=pericardiocentesi' }, { etichetta: 'NSTE-SCA', to: '/linee-guida/nste-sca' }],
    inBreve: [
      'Sospetto con ADD-RS: 0–1 → D-dimero (e eco); ≥ 2 → angio-TC aorta subito.',
      'ADD-RS ≤ 1 e D-dimero < 500 ng/mL: sindrome aortica acuta improbabile.',
      'Terapia: analgesia con oppioide, poi beta-bloccante ev per FC ≤ 60, poi vasodilatatore per PAS < 120 (100–120).',
      'Tipo A (aorta ascendente): cardiochirurgia di Careggi d’urgenza. Tipo B complicato (malperfusione, rottura, dolore o ipertensione refrattari): endoprotesi.',
      'Niente anticoagulanti, antiaggreganti o fibrinolitici finché il sospetto non è escluso.',
    ],
    sezioni: [
      {
        titolo: 'ADD-RS (1 punto per categoria)',
        punti: [
          'Condizioni ad alto rischio: Marfan o altra connettivopatia, familiarità per patologia aortica, valvulopatia aortica nota, manipolazione aortica recente, aneurisma toracico noto.',
          'Dolore ad alto rischio: improvviso, intenso, lacerante.',
          'Esame ad alto rischio: deficit di polso o differenza di PAS tra le braccia, deficit neurologico con dolore, soffio nuovo di insufficienza aortica con dolore, ipotensione o shock.',
        ],
      },
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Morfina 2–4 mg ev ripetibile o fentanil (Fentanest) 50 µg ev.',
          'Labetalolo (Trandate) 20 mg ev in 2 min, poi 20–80 mg ogni 10 min (max 300 mg) o 0,5–2 mg/min.',
          'Metoprololo (Lopresor) 5 mg ev ogni 5 min fino a 15 mg.',
          'Beta-bloccante controindicato: diltiazem 0,25 mg/kg = 17,5 mg ev in 2 min.',
          'Dopo il controllo della FC: urapidil (Ebrantil) 10–25 mg ev poi 5–30 mg/h. Esmololo e nitroprussiato non disponibili in PS.',
        ],
      },
      {
        titolo: 'Ipotensione o shock',
        punti: [
          'Cercare con l’eco: tamponamento, insufficienza aortica acuta, rottura, ischemia miocardica.',
          'Liquidi e emoderivati; cardiochirurgo subito.',
          'Tamponamento senza chirurgia immediata: drenaggio pericardico controllato di piccoli volumi solo per mantenere la perfusione.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2024-08-30', testo: 'ESC 2024 (malattie arteriose periferiche e aortiche): percorso diagnostico con ADD-RS e D-dimero, obiettivi FC ≤ 60 e PAS 100–120.' },
    ],
  },
  {
    id: 'asma',
    titolo: 'Asma acuto',
    ente: 'GINA',
    anno: 2025,
    area: 'Pneumologia',
    fonte: { etichetta: 'GINA 2025 Report', url: 'https://ginasthma.org/reports/' },
    controllata: '2026-11-11',
    vediAnche: [{ etichetta: 'Sedazione: intubazione', to: '/sedazione?apri=intubazione' }, { etichetta: 'Anafilassi', to: '/linee-guida/anafilassi' }],
    inBreve: [
      'Grave: parla a parole, seduto in avanti, agitato, FR > 30, muscoli accessori, FC > 120, SpO₂ < 90%, PEF ≤ 50%.',
      'Pericolo di vita: sopore, confusione, torace silente → rianimatore, preparare l’intubazione.',
      'Salbutamolo (Broncovaleas) ripetuto nella prima ora + ipratropio (Atem) nelle forme gravi; ossigeno per SpO₂ 93–95%; cortisone sistemico entro 1 h.',
      'Magnesio solfato ev nelle forme gravi che non rispondono.',
      'Niente antibiotici di routine, niente sedativi.',
      'Dimissione: iniziare o aumentare la terapia inalatoria con cortisone, prednisone (Deltacortene) 5–7 giorni, controllo entro 2–7 giorni.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Salbutamolo (Broncovaleas) spray 100 µg: 4–10 puff con distanziatore ogni 20 min per 1 h; oppure nebulizzato 2,5–5 mg (0,5–1 mL della soluzione 5 mg/mL) ogni 20 min.',
          'Ipratropio (Atem) 0,5 mg nebulizzato (1 fiala) ogni 20 min per 1 h, nelle forme gravi.',
          'Prednisone (Deltacortene) 50 mg per bocca (2 compresse da 25 mg) oppure metilprednisolone (Urbason) 40 mg ev se non deglutisce.',
          'Magnesio solfato 2 g = 2 fiale da 1 g/10 mL in 100 mL di SF in 20 min.',
          'Adrenalina im 0,5 mg solo se anafilassi o asma quasi fatale senza risposta.',
        ],
      },
      {
        titolo: 'Ricovero o dimissione',
        punti: [
          'Rivalutare a 1 h: sintomi, SpO₂, PEF.',
          'Ricovero se PEF < 60% dopo il trattamento, SpO₂ bassa, peggioramento o fattori di rischio di asma fatale (intubazioni precedenti, ricoveri recenti, uso eccessivo di salbutamolo (Broncovaleas)).',
          'Dimissione se PEF > 60–80%, SpO₂ > 94% in aria e sintomi migliorati.',
          'RX torace solo se sospetto di complicanza (pneumotorace, polmonite) o mancata risposta.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2025-05-01', testo: 'GINA 2025: terapia con cortisone inalatorio sempre (no salbutamolo da solo); in acuto salbutamolo, ipratropio se grave, cortisone sistemico, magnesio ev nelle forme gravi.' },
    ],
  },
  {
    id: 'bpco',
    titolo: 'BPCO riacutizzata',
    ente: 'GOLD',
    anno: 2026,
    area: 'Pneumologia',
    fonte: { etichetta: 'GOLD 2026 Report', url: 'https://goldcopd.org/' },
    controllata: '2026-11-11',
    vediAnche: [
      { etichetta: 'Antibiotici: BPCO', to: '/antibiotici?apri=bpco' },
      { etichetta: 'Dimissione BPCO', to: '/dimissioni?apri=bpco' },
      { etichetta: 'Scompenso', to: '/linee-guida/scompenso-cardiaco' },
      { etichetta: 'Embolia polmonare', to: '/linee-guida/embolia-polmonare' },
    ],
    inBreve: [
      'Escludere ciò che la imita: polmonite, scompenso, embolia polmonare, pneumotorace, SCA, aritmie.',
      'Ossigeno con obiettivo SpO₂ 88–92%; EGA all’arrivo e dopo 30–60 min.',
      'Broncodilatatori a breve durata (salbutamolo (Broncovaleas) ± ipratropio (Atem)); prednisone (Deltacortene) 40 mg per 5 giorni.',
      'Antibiotico se espettorato purulento con aumento del volume o della dispnea, o se serve la ventilazione; 5–7 giorni.',
      'NIV se acidosi respiratoria (pH ≤ 7,35 e PaCO₂ ≥ 45) o dispnea grave con fatica; alti flussi nasali come alternativa in casi selezionati.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Salbutamolo (Broncovaleas) 2,5–5 mg nebulizzato (0,5–1 mL) ogni 20 min per 1 h, poi ogni 4–6 h; con aria compressa se ipercapnia (o ossigeno a basso flusso a parte).',
          'Ipratropio (Atem) 0,5 mg nebulizzato (1 fiala) ogni 6–8 h.',
          'Prednisone (Deltacortene) 40 mg (1 compressa da 25 mg + 3 da 5 mg) per 5 giorni, o metilprednisolone (Urbason) 40 mg ev.',
        ],
      },
      {
        titolo: 'Ventilazione e destinazione',
        punti: [
          'NIV: partire con IPAP 12–15 e EPAP 4–5 cmH₂O, salire con l’IPAP secondo la PaCO₂; EGA dopo 1 h.',
          'Intubazione se NIV fallisce o non tollerata, arresto respiratorio, coma, instabilità, aspirazione.',
          'Ricovero se dispnea grave, cianosi o edemi nuovi, mancata risposta, comorbidità gravi, insufficienza respiratoria.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2025-11-10', testo: 'GOLD 2026: capitolo sulle riacutizzazioni riscritto (diagnosi differenziale, sede di cura, indicazioni ad alti flussi e NIV); una sola riacutizzazione moderata basta per intensificare la terapia di fondo.' },
    ],
  },
  {
    id: 'bradicardia',
    titolo: 'Bradicardia',
    ente: 'ERC',
    anno: 2025,
    area: 'Cardiologia',
    fonte: { etichetta: 'ERC Guidelines 2025 Adult ALS, Resuscitation 2025', url: 'https://doi.org/10.1016/j.resuscitation.2025.110769' },
    controllata: '2026-11-11',
    vediAnche: [{ etichetta: 'Pacing', to: '/procedure?apri=pacing' }, { etichetta: 'Iperkaliemia', to: '/linee-guida/iperkaliemia' }, { etichetta: 'Timer ACR', to: '/acr' }],
    inBreve: [
      'Segni di pericolo: shock, sincope, ischemia miocardica, scompenso.',
      'Con segni di pericolo: atropina 0,5 mg ev ogni 3–5 min fino a 3 mg.',
      'Se non risponde: isoprenalina 5 µg/min o adrenalina 2–10 µg/min, pacing transcutaneo come ponte al transvenoso.',
      'Anche senza segni di pericolo, rischio di asistolia: BAV Mobitz II, BAV completo con QRS largo, pause > 3 s, asistolia recente → pacing.',
      'Atropina inefficace (e può peggiorare) nel BAV avanzato a QRS largo e nel trapiantato cardiaco.',
      'Cause: iperkaliemia, farmaci (beta-bloccanti, calcio-antagonisti, digossina (Lanoxin)), ischemia inferiore, ipotermia, ipotiroidismo.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Atropina 0,5 mg ev (1 fiala da 0,5 mg) ogni 3–5 min, massimo 3 mg.',
          'Isoprenalina: 1 fiala da 0,2 mg in 50 mL di glucosata 5% (4 µg/mL): 5 µg/min = 75 mL/h, titolare.',
          'Adrenalina: 1 mg in 50 mL di SF (20 µg/mL): 2–10 µg/min = 6–30 mL/h.',
          'Beta-bloccante o calcio-antagonista: glucagone (GlucaGen) 2–10 mg ev (con calcio e insulina ad alte dosi su consiglio del tossicologo).',
          'Digossina (Lanoxin): anticorpi antidigossina (Tossicologia).',
          'Trapiantato o lesione midollare: aminofillina 100–200 mg ev lenta.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2025-10-22', testo: 'ERC 2025: atropina 0,5 mg fino a 3 mg, poi isoprenalina o adrenalina; pacing transvenoso precoce nella bradicardia instabile refrattaria, transcutaneo come ponte.' },
    ],
  },
  {
    id: 'tachicardia',
    titolo: 'Tachicardia con polso',
    ente: 'ERC',
    anno: 2025,
    area: 'Cardiologia',
    fonte: { etichetta: 'ERC Guidelines 2025 Adult ALS, Resuscitation 2025', url: 'https://doi.org/10.1016/j.resuscitation.2025.110769' },
    controllata: '2026-11-11',
    vediAnche: [{ etichetta: 'Cardioversione elettrica', to: '/procedure?apri=cve' }, { etichetta: 'Fibrillazione atriale', to: '/linee-guida/fibrillazione-atriale' }, { etichetta: 'Sedazione procedurale', to: '/sedazione?apri=procedurale' }, { etichetta: 'Timer ACR', to: '/acr' }],
    inBreve: [
      'Instabile (shock, sincope, ischemia, scompenso): cardioversione sincronizzata in sedazione, fino a 3 tentativi; se fallisce, amiodarone (Cordarone) 300 mg in 10–20 min e ritentare.',
      'Stabile, QRS stretto regolare: manovra vagale (Valsalva modificata), poi adenosina (Krenosin) 6–12–18 mg.',
      'Stabile, QRS stretto irregolare: probabile FA → controllo della frequenza (vedi PDTA FA).',
      'Stabile, QRS largo regolare: considerarla TV → amiodarone (Cordarone) 300 mg in 10–60 min (o procainamide), o cardioversione elettiva.',
      'Torsione di punta: magnesio solfato 2 g ev (2 fiale da 1 g/10 mL) in 10 min; correggere K e Mg, sospendere i farmaci che allungano il QT.',
    ],
    sezioni: [
      {
        titolo: 'Cardioversione sincronizzata',
        punti: [
          'Fibrillazione atriale: primo shock all’energia massima.',
          'Flutter e tachicardia sopraventricolare: 70–120 J, poi a salire.',
          'TV con polso: 120–150 J, poi a salire.',
          'TV polimorfa instabile: defibrillazione (non sincronizzata).',
          'Amiodarone (Cordarone) dopo la cardioversione fallita: 300 mg in 10–20 min, poi 900 mg in 24 h.',
        ],
      },
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Valsalva modificata: soffiare 15 s in una siringa da 10 mL (40 mmHg) da semiseduto, poi subito supino con gambe sollevate a 45° per 15 s.',
          'Adenosina (Krenosin) 6 mg (1 fiala) in bolo rapido + 20 mL di SF in vena grossa; poi 12 mg, poi 18 mg. Avvisare del malessere; evitare nell’asma grave e nella preeccitazione con FA.',
          'Alternativa nella TPSV: verapamil (Isoptin) 5 mg ev in 2 min (no se QRS largo o scompenso) o metoprololo (Lopresor) 5 mg ev.',
          'Amiodarone (Cordarone) 300 mg = 2 fiale da 150 mg in 250 mL di glucosata 5%.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2025-10-22', testo: 'ERC 2025: FA instabile con primo shock all’energia massima; amiodarone 300 mg dopo cardioversione fallita; adenosina e manovre vagali nella tachicardia a QRS stretto regolare.' },
    ],
  },
  {
    id: 'trauma-maggiore',
    titolo: 'Trauma maggiore',
    ente: 'Task Force europea / ATLS',
    anno: 2023,
    area: 'Trauma',
    fonte: { etichetta: 'Rossaint et al., Crit Care 2023 (linea guida europea, 6ª ed.)', url: 'https://doi.org/10.1186/s13054-023-04327-7' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'gcs', nome: 'GCS' }, { id: 'nexus', nome: 'NEXUS cervicale' }, { id: 'ccsr', nome: 'Canadian C-spine' }],
    vediAnche: [
      { etichetta: 'Decompressione', to: '/procedure?apri=decompressione' },
      { etichetta: 'Drenaggio toracico', to: '/procedure?apri=tubo' },
      { etichetta: 'Intraossea', to: '/procedure?apri=io' },
      { etichetta: 'Sedazione: intubazione', to: '/sedazione?apri=intubazione' },
      { etichetta: 'Anticoagulato che sanguina', to: '/linee-guida/anticoagulato-sanguinamento' },
    ],
    inBreve: [
      '<C>ABCDE: prima l’emorragia esterna massiva (compressione, laccio emostatico), poi vie aeree con protezione del rachide.',
      'Ipotensione permissiva finché il sanguinamento non è controllato: PAS 80–90 mmHg; PAM ≥ 80 se trauma cranico grave.',
      'Acido tranexamico entro 3 h: 1 g in 10 min, poi 1 g in 8 h.',
      'Emoderivati presto; fibrinogeno se < 1,5 g/L; calcio ionizzato nella norma; prevenire l’ipotermia.',
      'Fascia pelvica se sospetta frattura di bacino con instabilità. eFAST; TC total body se stabile o rispondente.',
      'Instabile con sanguinamento in cavità: chirurgia di controllo del danno o radiologia interventistica, senza aspettare la TC.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci ed emoderivati (70 kg)',
        punti: [
          'Acido tranexamico (Tranex 500 mg/5 mL): 1 g = 2 fiale in 100 mL di SF in 10 min, poi 1 g in 8 h. Non dopo 3 h dal trauma.',
          'Fibrinogeno concentrato (Haemocomplettan o Fibryga 1 g): 3–4 g se fibrinogeno < 1,5 g/L o sanguinamento massivo.',
          'Emazie e plasma presto (rapporto almeno 1:2) se emorragia massiva; poi guidati da esami o test viscoelastici.',
          'Calcio cloruro 10% 10 mL o calcio gluconato 10% 30 mL se calcio ionizzato < 1,15 mmol/L.',
          'Anticoagulanti: complesso protrombinico (PCC) e vitamina K (Konakion) per i dicumarolici; vedi PDTA dedicato.',
        ],
      },
      {
        titolo: 'Primary survey',
        punti: [
          '<C>: emorragia esterna catastrofica → compressione, laccio, agenti emostatici.',
          'A: vie aeree con collare/immobilizzazione in linea; intubazione se GCS ≤ 8 o vie aeree a rischio.',
          'B: pneumotorace iperteso → decompressione; emotorace massivo → drenaggio.',
          'C: due accessi grossi (o intraossea), eFAST, fascia pelvica, emoderivati.',
          'D: GCS, pupille, glicemia. E: esporre e riscaldare.',
        ],
      },
      {
        titolo: 'Trauma cranico grave',
        punti: [
          'Evitare ipossia (SpO₂ > 94%) e ipotensione (PAS ≥ 100–110, PAM ≥ 80).',
          'Normocapnia (PaCO₂ 35–40); iperventilazione solo come ponte se segni di erniazione.',
          'Testa a 30°; mannitolo o soluzione ipertonica se segni di erniazione, con il neurochirurgo di Careggi.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2023-03-01', testo: 'Linea guida europea 6ª edizione: 39 raccomandazioni; ipotensione permissiva, acido tranexamico precoce, gestione guidata dai test della coagulazione.' },
    ],
  },
  {
    id: 'post-rosc',
    titolo: 'Dopo il ritorno del circolo (post-ROSC)',
    ente: 'ERC-ESICM',
    anno: 2025,
    area: 'Rianimazione',
    fonte: { etichetta: 'Nolan et al., Resuscitation 2025 (ERC-ESICM)', url: 'https://doi.org/10.1016/j.resuscitation.2025.110809' },
    controllata: '2026-11-11',
    vediAnche: [{ etichetta: 'Timer ACR', to: '/acr' }, { etichetta: 'STEMI', to: '/linee-guida/stemi' }, { etichetta: 'Sedazione: intubazione', to: '/sedazione?apri=intubazione' }],
    inBreve: [
      'Ossigeno al 100% finché la SpO₂ non è affidabile, poi SpO₂ 94–98% (PaO₂ 75–100 mmHg); normocapnia.',
      'PAS > 100 mmHg o PAM > 60–65; diuresi > 0,5 mL/kg/h e lattato in calo.',
      'ECG a 12 derivazioni: STEMI → coronarografia subito. Senza sopraslivellamento: coronarografia urgente solo se alta probabilità di occlusione o instabilità.',
      'Nessuna causa cardiaca evidente: TC encefalo e torace (anche angio-TC).',
      'Prevenire la febbre: temperatura ≤ 37,5 °C per almeno 72 h nei pazienti in coma.',
      'Glicemia controllata; trattare le crisi epilettiche (EEG); niente prognosi in PS.',
    ],
    sezioni: [
      {
        titolo: 'Ventilazione e circolo (70 kg)',
        punti: [
          'Volume corrente 6–8 mL/kg di peso ideale (420–560 mL per 70 kg), PEEP 5–8.',
          'Noradrenalina: 2 fiale da 2 mg in SF fino a 50 mL (80 µg/mL), partenza 0,05 µg/kg/min ≈ 2,5 mL/h.',
          'Sedazione con propofol (Diprivan) o midazolam (Ipnovel) + fentanil (Fentanest).',
        ],
      },
      {
        titolo: 'Cause da cercare',
        punti: [
          '4 H: ipossia, ipovolemia, ipo/iperkaliemia e altri disturbi metabolici, ipotermia.',
          '4 T: trombosi coronarica o polmonare, pneumotorace iperteso, tamponamento, tossici.',
          'Eco al letto, EGA con lattato ed elettroliti, troponina.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2025-10-22', testo: 'ERC-ESICM 2025: «controllo della temperatura» con prevenzione attiva della febbre (≤ 37,5 °C per 72 h), PAM > 60–65, SpO₂ 94–98%, nuova sezione sulle aritmie dopo la ROSC.' },
    ],
  },
  {
    id: 'oppioidi-benzodiazepine',
    titolo: 'Intossicazione da oppioidi e benzodiazepine',
    ente: 'AHA',
    anno: 2023,
    area: 'Tossicologia',
    fonte: { etichetta: 'Lavonas et al., Circulation 2023 (AHA, avvelenamenti)', url: 'https://doi.org/10.1161/CIR.0000000000001161' },
    controllata: '2026-11-11',
    vediAnche: [{ etichetta: 'Rubrica: Tossicologia', to: '/rubrica' }, { etichetta: 'Timer ACR', to: '/acr' }],
    inBreve: [
      'Priorità: ventilare. Il naloxone serve a far respirare, non a svegliare del tutto.',
      'Naloxone a piccole dosi nei dipendenti (rischio di astinenza acuta e agitazione); dosi piene se apnea o arresto imminente.',
      'Durata del naloxone (30–90 min) inferiore a quella di molti oppioidi (metadone, rilascio prolungato): osservazione o infusione.',
      'Flumazenil non di routine: rischio di convulsioni (uso cronico di benzodiazepine, triciclici, epilessia). Solo nella sedazione iatrogena in paziente non abituato.',
      'Cercare co-ingestioni (paracetamolo, alcol), ipoglicemia, trauma.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Naloxone (Narcan 0,4 mg/1 mL): 0,04–0,1 mg ev (fiala diluita in 10 mL: 1–2,5 mL) ripetuti ogni 2–3 min fino a FR ≥ 10; apnea: 0,4 mg ev o im; fino a 2 mg e oltre per oppioidi sintetici.',
          'Infusione: ogni ora 2/3 della dose che ha fatto respirare.',
          'Flumazenil (Anexate 0,5 mg/5 mL): 0,2 mg ev (2 mL) in 30 s, poi 0,1 mg ogni minuto fino a 1 mg; solo se nessuna controindicazione.',
        ],
      },
      {
        titolo: 'Osservazione',
        punti: [
          'Dopo naloxone: almeno 2–4 h; più a lungo per metadone, buprenorfina e rilascio prolungato.',
          'Ingestione di ovuli («body packer»): ricovero e chirurgo.',
          'Intenzionale: valutazione psichiatrica.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2023-09-18', testo: 'AHA 2023 avvelenamenti: naloxone per l’arresto respiratorio da oppioidi; flumazenil sconsigliato nel coma indifferenziato.' },
    ],
  },
  {
    id: 'monossido',
    titolo: 'Intossicazione da monossido di carbonio',
    ente: 'ACEP / UHMS',
    anno: 2017,
    area: 'Tossicologia',
    fonte: { etichetta: 'ACEP Clinical Policy, Ann Emerg Med 2017', url: 'https://doi.org/10.1016/j.annemergmed.2016.11.003' },
    controllata: '2026-11-11',
    vediAnche: [{ etichetta: 'Rubrica: Tossicologia', to: '/rubrica' }],
    inBreve: [
      'Sospettarla con cefalea, nausea, vertigini, sincope in più persone della stessa casa, braciere, stufa, caldaia, incendio.',
      'La SpO₂ del saturimetro è falsamente normale: misurare la carbossiemoglobina (COHb) su EGA.',
      'Ossigeno al 100% con maschera con reservoir subito, senza aspettare l’EGA.',
      'Ossigeno iperbarico da discutere con la Tossicologia se: perdita di coscienza, deficit neurologici, COHb > 25% (> 15% in gravidanza), ischemia miocardica, acidosi grave.',
      'Incendio con coma o acidosi lattica grave: pensare anche al cianuro (idrossocobalamina).',
    ],
    sezioni: [
      {
        titolo: 'Esami e trattamento',
        punti: [
          'EGA con COHb e lattati, ECG, troponina, CK; test di gravidanza.',
          'Ossigeno 15 L/min con reservoir (o ventilazione) fino a COHb < 3% e sintomi risolti (di solito 6 h).',
          'Idrossocobalamina (Cyanokit 5 g) in 15 min se sospetto cianuro nel fumo d’incendio.',
          'Avvisare dei sintomi neurologici tardivi (settimane) e programmare il controllo.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2017-01-01', testo: 'ACEP 2017: l’iperbarica può migliorare l’esito neurologico in casi selezionati; la COHb non predice da sola la gravità.' },
    ],
  },
  {
    id: 'digossina',
    titolo: 'Intossicazione da digossina',
    ente: 'AHA',
    anno: 2023,
    area: 'Tossicologia',
    fonte: { etichetta: 'Lavonas et al., Circulation 2023 (AHA, avvelenamenti)', url: 'https://doi.org/10.1161/CIR.0000000000001161' },
    controllata: '2026-11-11',
    vediAnche: [{ etichetta: 'Rubrica: Tossicologia', to: '/rubrica' }, { etichetta: 'Bradicardia', to: '/linee-guida/bradicardia' }, { etichetta: 'Iperkaliemia', to: '/linee-guida/iperkaliemia' }],
    inBreve: [
      'Cronica (anziano, insufficienza renale, diuretici): nausea, disturbi visivi, confusione, bradiaritmie. Acuta: vomito, iperkaliemia, aritmie gravi.',
      'Digossinemia almeno 6 h dopo l’ultima dose; potassio, magnesio, creatinina.',
      'Anticorpi antidigossina (Fab) se aritmie pericolose, K > 5,0 nell’acuta, insufficienza d’organo da ipoperfusione o arresto.',
      'Iperkaliemia: i Fab sono la terapia; il calcio non è più controindicato ma non è prioritario.',
      'Correggere ipokaliemia e ipomagnesiemia; atropina per la bradicardia in attesa dei Fab.',
    ],
    sezioni: [
      {
        titolo: 'Anticorpi antidigossina (DigiFab 40 mg)',
        punti: [
          'Arresto o ingestione acuta di dose ignota: 10 flaconi (fino a 20).',
          'Cronica con tossicità: 3–6 flaconi.',
          'Calcolo: flaconi = digossinemia (ng/mL) × peso (kg) / 100 → 70 kg con 3 ng/mL ≈ 2–3 flaconi.',
          'Reperibilità: tramite la Tossicologia di Careggi.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2023-09-18', testo: 'AHA 2023: anticorpi antidigossina per aritmie gravi; il calcio per l’iperkaliemia non è più considerato pericoloso.' },
    ],
  },
  {
    id: 'astinenza-alcolica',
    titolo: 'Astinenza alcolica',
    ente: 'ASAM',
    anno: 2020,
    area: 'Tossicologia',
    fonte: { etichetta: 'ASAM Clinical Practice Guideline on Alcohol Withdrawal Management 2020', url: 'https://doi.org/10.1097/ADM.0000000000000668' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'ciwa', nome: 'CIWA-Ar' }],
    vediAnche: [{ etichetta: 'Stato di male', to: '/linee-guida/stato-di-male' }, { etichetta: 'Sedazione: agitato', to: '/sedazione?apri=agitato' }],
    inBreve: [
      'Inizio 6–24 h dopo l’ultimo bicchiere; convulsioni 12–48 h; delirium tremens 48–96 h.',
      'Gravità con CIWA-Ar: < 10 lieve, 10–18 moderata, ≥ 19 grave.',
      'Benzodiazepine prima scelta, a sintomi (CIWA-Ar) o a dosi fisse se il monitoraggio non è possibile.',
      'Tiamina prima del glucosio; alte dosi se sospetta encefalopatia di Wernicke (confusione, atassia, oftalmoplegia).',
      'Escludere: ipoglicemia, trauma cranico, infezione, encefalopatia epatica, altre sostanze.',
      'Delirium tremens o benzodiazepine a dosi crescenti senza effetto: terapia intensiva (fenobarbital o propofol).',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Diazepam (Valium) 10–20 mg ev lento o per bocca ogni 1–2 h finché CIWA-Ar < 10 (fino a sedazione leggera).',
          'Epatopatia grave o anziano: lorazepam (Tavor) 1–2 mg per bocca o oxazepam (Serpax) 15–30 mg.',
          'Tiamina (Benerva 100 mg) 100–200 mg ev; se sospetto Wernicke 500 mg ev 3 volte al giorno.',
          'Correggere magnesio, potassio, fosforo; glucosata dopo la tiamina.',
          'Convulsione da astinenza: diazepam 10 mg ev; non serve l’antiepilettico a lungo termine.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2020-01-01', testo: 'ASAM 2020: benzodiazepine prima scelta, approccio a sintomi con CIWA-Ar, fenobarbital come alternativa da parte di esperti, tiamina a tutti.' },
    ],
  },
  {
    id: 'meningite',
    titolo: 'Meningite batterica',
    ente: 'ESCMID / NICE',
    anno: 2024,
    area: 'Neurologia · Infettivologia',
    fonte: { etichetta: 'NICE NG240, 2024', url: 'https://www.nice.org.uk/guidance/ng240' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'gcs', nome: 'GCS' }],
    vediAnche: [{ etichetta: 'Antibiotici: meningite', to: '/antibiotici?apri=meningite' }, { etichetta: 'Rachicentesi', to: '/procedure?apri=rachicentesi' }, { etichetta: 'Sepsi', to: '/linee-guida/sepsi' }],
    inBreve: [
      'Febbre, cefalea, rigidità nucale, alterazione della coscienza: spesso non tutti presenti. Petecchie che non scompaiono alla pressione = meningococco finché non escluso.',
      'Antibiotico entro 1 ora; non ritardarlo per TC o rachicentesi.',
      'Desametasone prima o insieme alla prima dose di antibiotico.',
      'TC prima della rachicentesi solo se: deficit focali, crisi nuove, GCS < 10, immunodepressione grave, papilledema.',
      'Sospetta encefalite (confusione, comportamento alterato, crisi focali): aggiungere aciclovir.',
      'Avvisare la Direzione sanitaria/igiene per la profilassi dei contatti stretti (meningococco).',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Ceftriaxone (Rocefin) 2 g ev ogni 12 h.',
          'Età > 50 anni, immunodepressione, alcolismo, gravidanza: + ampicillina (Amplital) 2 g ev ogni 4 h (Listeria).',
          'Dove il pneumococco resistente è possibile: + vancomicina (Vancocina) 15–20 mg/kg ev ogni 8–12 h.',
          'Desametasone (Soldesam) 10 mg ev ogni 6 h per 4 giorni; sospendere se non pneumococco/Haemophilus.',
          'Aciclovir (Zovirax) 10 mg/kg = 700 mg ev ogni 8 h se sospetta encefalite.',
          'Profilassi dei contatti: ciprofloxacina (Ciproxin) 500 mg per bocca una volta.',
        ],
      },
      {
        titolo: 'Liquor tipico',
        punti: [
          'Batterica: torbido, cellule > 1.000 (neutrofili), proteine > 1 g/L, glucosio liquor/sangue < 0,4.',
          'Virale: limpido, 10–1.000 cellule (linfociti), proteine 0,4–1 g/L, rapporto glucosio > 0,6.',
          'Sempre: colorazione di Gram, coltura, PCR; glicemia contemporanea.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2024-03-19', testo: 'NICE NG240: antibiotico entro 1 h, ceftriaxone in ospedale, desametasone sopra i 3 mesi, rachicentesi senza ritardare l’antibiotico.' },
    ],
  },
  {
    id: 'cefalea',
    titolo: 'Cefalea acuta in PS',
    ente: 'ACEP',
    anno: 2019,
    area: 'Neurologia',
    fonte: { etichetta: 'ACEP Clinical Policy, Ann Emerg Med 2019', url: 'https://doi.org/10.1016/j.annemergmed.2019.07.009' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'ottawa-esa', nome: 'Regola di Ottawa per ESA' }],
    vediAnche: [{ etichetta: 'ESA', to: '/linee-guida/esa' }, { etichetta: 'Meningite', to: '/linee-guida/meningite' }, { etichetta: 'Dimissione cefalea', to: '/dimissioni?apri=cefalea' }],
    inBreve: [
      'Segni d’allarme (SNOOP): sistemici (febbre, calo di peso, tumore, immunodepressione), neurologici, esordio improvviso, > 50 anni con cefalea nuova, cambio di caratteristiche, postura, gravidanza, Valsalva, papilledema.',
      'Esordio improvviso: regola di Ottawa e PDTA ESA.',
      'Febbre e meningismo: PDTA meningite.',
      'Primaria tipica: metoclopramide ev (± FANS), idratazione; evitare gli oppioidi.',
      'Emicrania: desametasone riduce le recidive a 72 h.',
      'Altre cause da non perdere: trombosi venosa cerebrale, dissezione carotidea o vertebrale, intossicazione da CO, arterite temporale (> 50 anni, VES/PCR), glaucoma acuto, crisi ipertensiva, preeclampsia.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'Metoclopramide (Plasil) 10 mg ev in 15 min (1 fiala da 10 mg/2 mL); acatisia: difenidramina o benzodiazepina.',
          'Ketorolac (Toradol) 30 mg ev o ibuprofene (Brufen) 600 mg per bocca.',
          'Paracetamolo 1 g ev.',
          'Desametasone (Soldesam) 8–10 mg ev per ridurre le recidive dell’emicrania.',
          'Sumatriptan (Imigran) 6 mg sc se emicrania senza controindicazioni cardiovascolari.',
          'Cefalea a grappolo: ossigeno 12–15 L/min con reservoir per 15 min; sumatriptan 6 mg sc.',
        ],
      },
      {
        titolo: 'Quando la TC',
        punti: [
          'Esordio improvviso, deficit neurologici, alterazione della coscienza, papilledema, trauma, anticoagulante, immunodepressione, tumore noto, > 50 anni con cefalea nuova, cefalea da sforzo/Valsalva.',
          'Angio-TC (o angio-RM) se sospetta dissezione o trombosi venosa (dopo la TC senza contrasto).',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2019-10-01', testo: 'ACEP 2019: ESA esclusa con TC negativa entro 6 h; metoclopramide e FANS di prima scelta; oppioidi da evitare.' },
    ],
  },
  {
    id: 'delirium',
    titolo: 'Delirium',
    ente: 'NICE',
    anno: 2023,
    area: 'Neurologia · Geriatria',
    fonte: { etichetta: 'NICE CG103 (aggiornata 2023)', url: 'https://www.nice.org.uk/guidance/cg103' },
    controllata: '2026-11-11',
    calcolatori: [{ id: '4at', nome: '4AT' }],
    vediAnche: [{ etichetta: 'Sedazione: agitato', to: '/sedazione?apri=agitato' }, { etichetta: 'Astinenza alcolica', to: '/linee-guida/astinenza-alcolica' }],
    inBreve: [
      'Esordio acuto, fluttuante, con disattenzione: screening con 4AT (≥ 4 probabile delirium).',
      'È un sintomo: cercare la causa (infezione, farmaci, ritenzione urinaria, stipsi, dolore, ipossia, disidratazione, alterazioni elettrolitiche, glicemia, astinenza, ictus).',
      'Prima i rimedi non farmacologici: orientamento, familiari, occhiali e apparecchi acustici, luce, sonno, mobilizzazione, niente contenzioni.',
      'Farmaci solo se agitazione pericolosa o grave sofferenza: aloperidolo a basse dosi, per il tempo più breve.',
      'Niente benzodiazepine, salvo astinenza alcolica o da benzodiazepine.',
      'Parkinson o demenza a corpi di Lewy: evitare l’aloperidolo (quetiapina a basse dosi, con specialista).',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (anziano)',
        punti: [
          'Aloperidolo (Serenase 5 mg/1 mL): 0,5–1 mg ev o im (0,1–0,2 mL), ripetibile dopo 30–60 min; massimo 5 mg/die. ECG per il QT.',
          'Quetiapina (Seroquel) 12,5–25 mg per bocca se Parkinson o Lewy.',
        ],
      },
      {
        titolo: 'Esami per la causa',
        punti: [
          'Glicemia, emocromo, elettroliti con calcio, creatinina, funzione epatica, PCR, EGA, esame urine (ma batteriuria ≠ causa), ECG.',
          'Revisione dei farmaci: anticolinergici, oppioidi, benzodiazepine, antistaminici, steroidi, antiparkinsoniani.',
          'Vescica (ecografia per ritenzione), alvo, dolore, saturazione.',
          'TC encefalo se trauma, anticoagulanti, segni focali o nessuna altra causa.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2023-01-18', testo: 'NICE CG103 aggiornata: 4AT come strumento di valutazione; prevenzione multicomponente; antipsicotico solo per breve tempo se sofferenza o rischio.' },
    ],
  },
  {
    id: 'sincope',
    titolo: 'Sincope',
    ente: 'ESC',
    anno: 2018,
    area: 'Cardiologia',
    fonte: { etichetta: 'Brignole et al., Eur Heart J 2018 (ESC)', url: 'https://doi.org/10.1093/eurheartj/ehy037' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'csrs', nome: 'Canadian Syncope Risk Score' }],
    vediAnche: [
      { etichetta: 'Dimissione sincope vasovagale', to: '/dimissioni?apri=sincope-vasovagale' },
      { etichetta: 'Dimissione sincope ortostatica', to: '/dimissioni?apri=sincope-ortostatica' },
      { etichetta: 'Bradicardia', to: '/linee-guida/bradicardia' },
      { etichetta: 'Embolia polmonare', to: '/linee-guida/embolia-polmonare' },
    ],
    inBreve: [
      'Era sincope? Perdita di coscienza transitoria, rapida, con ripresa spontanea e completa. Distinguere da crisi epilettica, trauma, intossicazione.',
      'A tutti: anamnesi, esame obiettivo, PA in clinostatismo e in piedi (3 min), ECG a 12 derivazioni.',
      'Alto rischio (ESC): dolore toracico, dispnea, sincope da sforzo o da sdraiato, palpitazioni prima, cardiopatia o FE ridotta, familiarità per morte improvvisa, ECG patologico, PAS < 90, sanguinamento → monitor e ricovero/osservazione.',
      'Basso rischio (prodromi tipici, trigger, in piedi a lungo, dopo il pasto, senza cardiopatia, ECG normale): dimissione.',
      'Né alto né basso: osservazione in PS con monitor (fino a 6 h) o percorso rapido ambulatoriale.',
    ],
    sezioni: [
      {
        titolo: 'ECG ad alto rischio',
        punti: [
          'Ischemia acuta; BAV II grado Mobitz II o III grado; bradicardia sinusale < 40 o pause > 3 s da sveglio; blocco di branca o QRS > 120 ms; TV non sostenuta.',
          'QT lungo o corto, Brugada tipo 1, preeccitazione, onde epsilon o T negative in V1–V3 (cardiomiopatia aritmogena), ipertrofia (cardiomiopatia ipertrofica).',
        ],
      },
      {
        titolo: 'Esami mirati',
        punti: [
          'Emocromo se sospetto sanguinamento; troponina e BNP se sospetto cardiaco; D-dimero se sospetta embolia; test di gravidanza.',
          'Massaggio del seno carotideo > 40 anni se sospetto (no se soffio carotideo o ictus/TIA recente).',
          'Ecocardiogramma se cardiopatia nota o sospetta.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2018-03-19', testo: 'ESC 2018: stratificazione in PS ad alto/basso rischio, unità di osservazione, ecocardiogramma e monitor mirati. Nuova linea guida ESC su sincope prevista per il 2028.' },
    ],
  },
  {
    id: 'extrauterina',
    titolo: 'Gravidanza extrauterina',
    ente: 'NICE',
    anno: 2023,
    area: 'Ostetricia',
    fonte: { etichetta: 'NICE NG126 (aggiornata 2023)', url: 'https://www.nice.org.uk/guidance/ng126' },
    controllata: '2026-11-11',
    vediAnche: [{ etichetta: 'Rubrica: ginecologia', to: '/rubrica' }, { etichetta: 'Trauma maggiore (emoderivati)', to: '/linee-guida/trauma-maggiore' }],
    inBreve: [
      'Test di gravidanza a ogni donna in età fertile con dolore addominale, sanguinamento vaginale, sincope o shock.',
      'Instabile o liquido libero abbondante all’eFAST: rianimazione, emoderivati, ginecologo di guardia per la sala operatoria subito.',
      'Stabile: β-hCG quantitativa, gruppo sanguigno, ecografia transvaginale dal ginecologo.',
      'Gravidanza di sede sconosciuta (β-hCG positiva, utero vuoto): β-hCG ripetuta a 48 h con il ginecologo.',
      'Rh negativo con trattamento chirurgico: immunoglobuline anti-D 250 UI.',
    ],
    sezioni: [
      {
        titolo: 'Trattamento (decide il ginecologo)',
        punti: [
          'Metotrexato se: niente dolore importante, non rotta, massa < 35 mm senza battito, β-hCG < 1.500 UI/L (fino a 5.000 con scelta condivisa), niente gravidanza intrauterina, follow-up possibile.',
          'Chirurgia (salpingectomia di solito): dolore importante, massa ≥ 35 mm, battito visibile, β-hCG ≥ 5.000, rottura.',
          'Attesa: stabile, senza dolore, β-hCG < 1.500 in calo.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2023-08-01', testo: 'NICE NG126 aggiornata: anti-D solo con trattamento chirurgico; criteri per metotrexato e trattamento in attesa.' },
    ],
  },
  {
    id: 'preeclampsia',
    titolo: 'Preeclampsia ed eclampsia',
    ente: 'NICE',
    anno: 2023,
    area: 'Ostetricia',
    fonte: { etichetta: 'NICE NG133 (aggiornata 2023)', url: 'https://www.nice.org.uk/guidance/ng133' },
    controllata: '2026-11-11',
    vediAnche: [{ etichetta: 'Rubrica: ginecologia', to: '/rubrica' }, { etichetta: 'Stato di male', to: '/linee-guida/stato-di-male' }],
    inBreve: [
      'Gravidanza ≥ 20 settimane o puerperio (fino a 6 settimane) con PA ≥ 140/90 + proteinuria o danno d’organo (cefalea, disturbi visivi, dolore epigastrico, piastrine basse, transaminasi, creatinina, edema polmonare).',
      'PA ≥ 160/110: grave, trattare entro 1 ora; obiettivo ≤ 135/85.',
      'Eclampsia (convulsioni): magnesio solfato, non benzodiazepine come prima scelta.',
      'Magnesio solfato anche nella preeclampsia grave per prevenire le convulsioni.',
      'Ginecologo di guardia subito: la cura definitiva è il parto.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci',
        punti: [
          'Labetalolo (Trandate) 20 mg ev in 2 min, poi 40 e 80 mg ogni 10 min (max 300 mg); o per bocca 200 mg.',
          'Nifedipina (Adalat) 10 mg per bocca (non sublinguale), ripetibile dopo 30 min, se labetalolo controindicato (asma).',
          'Magnesio solfato: carico 4 g ev (4 fiale da 1 g/10 mL in 100 mL) in 5–15 min, poi 1 g/h per 24 h.',
          'Recidiva di convulsione: altri 2 g ev in 5 min.',
          'Tossicità da magnesio (riflessi assenti, FR < 12, oliguria): sospendere; calcio gluconato 10% 10 mL ev in 10 min.',
        ],
      },
      {
        titolo: 'Monitoraggio',
        punti: [
          'PA ogni 15 min fino all’obiettivo; riflessi rotulei, FR e SpO₂ ogni ora con il magnesio; diuresi (catetere).',
          'Esami: emocromo, transaminasi, LDH, creatinina, acido urico, coagulazione, proteinuria (rapporto proteine/creatinina).',
          'Liquidi limitati (80 mL/h): rischio di edema polmonare.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2023-04-17', testo: 'NICE NG133 aggiornata: obiettivo PA ≤ 135/85; labetalolo prima scelta, nifedipina alternativa; magnesio solfato nella preeclampsia grave e nell’eclampsia.' },
    ],
  },
  {
    id: 'otite',
    titolo: 'Otite esterna e otite media (adulto)',
    ente: 'AAO-HNS / NICE',
    anno: 2014,
    area: 'ORL',
    fonte: { etichetta: 'Rosenfeld et al., Otolaryngol Head Neck Surg 2014 (otite esterna)', url: 'https://doi.org/10.1177/0194599813517083' },
    controllata: '2026-11-11',
    vediAnche: [
      { etichetta: 'Dimissione otite esterna', to: '/dimissioni?apri=otite-esterna' },
      { etichetta: 'Dimissione otite media', to: '/dimissioni?apri=otite-media' },
      { etichetta: 'Cartella: otalgia', to: '/anamnesi?apri=otalgia' },
      { etichetta: 'Paralisi di Bell', to: '/linee-guida/paralisi-bell' },
    ],
    inBreve: [
      'Esterna: dolore alla trazione del padiglione o alla pressione sul trago, condotto edematoso e arrossato, timpano normale se visibile.',
      'Esterna non complicata: solo gocce (antibiotico ± cortisone) per 7 giorni e analgesia; niente antibiotico per bocca.',
      'Antibiotico per bocca solo se l’infezione supera il condotto (cellulite del padiglione) o in diabete/immunodepressione.',
      'Otite esterna necrotizzante (anziano diabetico, dolore notturno intenso, tessuto di granulazione, paralisi di nervi cranici): TC, ORL, antibiotico ev anti-Pseudomonas.',
      'Media dell’adulto: analgesia; antibiotico se forma grave, febbre alta o nessun miglioramento in 3 giorni (amoxicillina).',
      'Complicanze della media: mastoidite (gonfiore dietro l’orecchio, padiglione spostato), paralisi del facciale, meningite → TC e ORL.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (adulto)',
        punti: [
          'Esterna: gocce di chinolonico ± cortisone (ciprofloxacina ± desametasone o fluocinolone) 3–4 gocce 2 volte al giorno per 7 giorni; con timpano perforato o non visibile solo chinolonico (no aminoglicosidi).',
          'Condotto molto edematoso: pulizia delicata e stuello (garza) per far entrare le gocce.',
          'Media: amoxicillina (Zimox) 1 g ogni 8 h per 5–7 giorni; allergia: claritromicina (Klacid) 500 mg ogni 12 h. Fallimento: amoxicillina/clavulanato (Augmentin) 875/125 mg ogni 8–12 h.',
          'Dolore: paracetamolo 1 g fino a 3 volte al giorno o ibuprofene (Brufen) 600 mg ogni 8 h.',
        ],
      },
      {
        titolo: 'Quando l’ORL',
        punti: [
          'Necrotizzante sospetta, complicanze, paralisi del facciale, vertigine o sordità improvvisa.',
          'Otite media unilaterale o versamento persistente nell’adulto: visita ORL per escludere una massa del rinofaringe.',
          'Otorrea che non guarisce in 2 settimane.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2014-02-01', testo: 'AAO-HNS 2014 (otite esterna): solo terapia topica nei casi non complicati, analgesia adeguata, niente antibiotico sistemico di routine. NICE NG91 (2018): nella media acuta antibiotico non di routine.' },
    ],
  },
  {
    id: 'sinusite',
    titolo: 'Rinosinusite acuta',
    ente: 'EPOS',
    anno: 2020,
    area: 'ORL',
    fonte: { etichetta: 'Fokkens et al., Rhinology 2020 (EPOS)', url: 'https://doi.org/10.4193/Rhin20.600' },
    controllata: '2026-11-11',
    vediAnche: [{ etichetta: 'Dimissione sinusite', to: '/dimissioni?apri=sinusite' }, { etichetta: 'Meningite', to: '/linee-guida/meningite' }],
    inBreve: [
      'Quasi sempre virale: sintomi < 10 giorni, guarisce da sola.',
      'Batterica probabile se almeno 3 tra: secrezione purulenta (soprattutto monolaterale), dolore locale intenso, febbre > 38 °C, PCR o VES alte, peggioramento dopo un iniziale miglioramento.',
      'Terapia: lavaggi nasali, cortisone spray, analgesici. Antibiotico solo nella forma batterica probabile o grave.',
      'Complicanze orbitarie (edema periorbitario, diplopia, calo del visus, oftalmoplegia, proptosi) o intracraniche (cefalea intensa, meningismo, deficit, confusione): TC con contrasto, ORL e oculista, antibiotico ev.',
      'Niente TC nella sinusite non complicata.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (adulto)',
        punti: [
          'Lavaggi nasali con soluzione fisiologica o ipertonica 2–3 volte al giorno.',
          'Mometasone spray (Nasonex) 2 spruzzi per narice 1–2 volte al giorno per 14 giorni.',
          'Paracetamolo 1 g fino a 3 volte al giorno o ibuprofene (Brufen) 400–600 mg ogni 8 h.',
          'Antibiotico: amoxicillina/clavulanato (Augmentin) 875/125 mg ogni 12 h per 5–7 giorni; allergia: doxiciclina (Bassado) 100 mg ogni 12 h.',
          'Complicata (ricovero): ceftriaxone (Rocefin) 2 g ev ogni 24 h ± metronidazolo (Flagyl) 500 mg ogni 8 h.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2020-02-20', testo: 'EPOS 2020: distinzione virale, post-virale e batterica; antibiotico solo con criteri di batterica; cortisone nasale nella post-virale.' },
    ],
  },
  {
    id: 'paralisi-bell',
    titolo: 'Paralisi del facciale (di Bell)',
    ente: 'AAO-HNS',
    anno: 2013,
    area: 'Neurologia · ORL',
    fonte: { etichetta: 'Baugh et al., Otolaryngol Head Neck Surg 2013 (AAO-HNS)', url: 'https://doi.org/10.1177/0194599813505967' },
    controllata: '2026-11-11',
    vediAnche: [
      { etichetta: 'Cartella: paralisi facciale', to: '/anamnesi?apri=paralisi-faciale' },
      { etichetta: 'Dimissione paralisi di Bell', to: '/dimissioni?apri=paralisi-bell' },
      { etichetta: 'Codice ictus', to: '/linee-guida/ictus' },
    ],
    inBreve: [
      'Periferica: tutta l’emifaccia, fronte compresa (non corruga la fronte, non chiude l’occhio). Fronte risparmiata = centrale → percorso ictus.',
      'Di Bell = periferica, esordio in < 72 h, senza altra causa. Escludere: zoster (vescicole all’orecchio o in bocca: Ramsay Hunt), otite, Lyme, parotide, trauma, altri nervi cranici, bilaterale.',
      'Prednisone entro 72 h dall’esordio, a tutti gli adulti senza controindicazioni.',
      'Antivirale da solo no; insieme al cortisone solo come opzione nelle forme gravi (e sempre se Ramsay Hunt).',
      'Proteggere l’occhio: lacrime di giorno, gel e occlusione la notte.',
      'Niente esami o TC di routine. Visita ORL/neurologica se non migliora entro 3 mesi, se peggiora, o se ricorre.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (adulto)',
        punti: [
          'Prednisone (Deltacortene) 60 mg al mattino per 5 giorni (2 compresse da 25 mg + 2 da 5 mg), poi scalare di 10 mg al giorno in 5 giorni. In alternativa prednisolone 50 mg per 10 giorni.',
          'Ramsay Hunt o forma grave: + valaciclovir (Zelitrex) 1 g ogni 8 h per 7 giorni.',
          'Diabetici: controllo glicemico durante il cortisone.',
          'Occhio: lacrime artificiali ogni 1–2 h di giorno, gel o unguento oftalmico la notte, chiusura con cerotto o occhiali; oculista se dolore, arrossamento o calo del visus.',
        ],
      },
      {
        titolo: 'Segni d’allarme (non è Bell)',
        punti: [
          'Fronte risparmiata, altri deficit neurologici, cefalea grave, confusione.',
          'Esordio lento in settimane, paralisi di singoli rami, recidiva omolaterale, bilaterale.',
          'Massa parotidea, otorrea, febbre, vescicole, tumore noto.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2013-11-01', testo: 'AAO-HNS 2013: cortisone entro 72 h; antivirale solo come opzione insieme al cortisone; niente esami e imaging di routine; protezione oculare.' },
    ],
  },
  {
    id: 'occhio-rosso',
    titolo: 'Occhio rosso',
    ente: 'AAO',
    anno: 2018,
    area: 'Oculistica',
    fonte: { etichetta: 'AAO Preferred Practice Pattern Conjunctivitis, Ophthalmology 2019', url: 'https://doi.org/10.1016/j.ophtha.2018.10.020' },
    controllata: '2026-11-11',
    vediAnche: [
      { etichetta: 'Cartella: occhio rosso', to: '/anamnesi?apri=occhio-rosso' },
      { etichetta: 'Dimissione congiuntivite', to: '/dimissioni?apri=congiuntivite' },
      { etichetta: 'Dimissione corpo estraneo', to: '/dimissioni?apri=corpo-estraneo-occhio' },
    ],
    inBreve: [
      'Prima domanda: il visus è calato? Misurarlo sempre (ottotipo o conta dita).',
      'Invio oculistico urgente: calo del visus, dolore vero (non bruciore), fotofobia, iperemia perilimbare, pupilla anomala, opacità corneale, trauma penetrante o chimico, portatore di lenti con lesione corneale, zoster oftalmico.',
      'Ustione chimica: irrigare subito e a lungo (almeno 30 min, fino a pH 7–7,5), poi oculista.',
      'Glaucoma acuto: occhio rosso dolente, visus calato, pupilla media fissa, cornea opaca, cefalea e vomito → acetazolamide e oculista subito.',
      'Congiuntivite (secrezione, visus normale, niente dolore): virale la più frequente; antibiotico collirio solo se secrezione purulenta.',
      'Emorragia sottocongiuntivale isolata: benigna; controllare PA e anticoagulanti.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci',
        punti: [
          'Congiuntivite batterica: tobramicina collirio (Tobral) 1–2 gocce ogni 4–6 h per 5–7 giorni. Portatore di lenti: chinolonico (ofloxacina, Exocin) e oculista.',
          'Allergica: antistaminico collirio (ketotifene, Zaditen) 2 volte al giorno.',
          'Abrasione corneale: antibiotico collirio o unguento; niente anestetico collirio a domicilio; niente bendaggio nei portatori di lenti.',
          'Glaucoma acuto: acetazolamide (Diamox) 500 mg ev o per bocca; timololo 0,5% (Timoptol) 1 goccia; oculista subito.',
          'Cortisone collirio: mai senza visita oculistica.',
        ],
      },
      {
        titolo: 'Diagnosi differenziale',
        punti: [
          'Congiuntivite: iperemia diffusa, secrezione, visus normale.',
          'Episclerite: settoriale, poco dolore. Sclerite: dolore profondo che sveglia la notte, colore violaceo → oculista.',
          'Cheratite: dolore, fotofobia, fluoresceina positiva; dendritica = herpes.',
          'Uveite anteriore: dolore, fotofobia, miosi, iperemia ciliare.',
          'Glaucoma acuto ad angolo chiuso: pupilla media areflessica, cornea opaca, occhio duro.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2018-10-01', testo: 'AAO PPP Congiuntivite: maggior parte virale; antibiotico topico nelle forme batteriche; segni d’allarme per invio urgente.' },
    ],
  },
  {
    id: 'orchiepididimite',
    titolo: 'Orchiepididimite',
    ente: 'EAU',
    anno: 2025,
    area: 'Urologia',
    fonte: { etichetta: 'EAU Guidelines on Urological Infections 2025', url: 'https://uroweb.org/guidelines/urological-infections' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'twist', nome: 'TWIST' }],
    vediAnche: [
      { etichetta: 'Antibiotici: orchiepididimite', to: '/antibiotici?apri=orchiepididimite' },
      { etichetta: 'Cartella: dolore scrotale', to: '/anamnesi?apri=scroto' },
      { etichetta: 'Dimissione orchiepididimite', to: '/dimissioni?apri=orchiepididimite' },
    ],
    inBreve: [
      'Prima escludere la torsione: esordio improvviso, vomito, testicolo alto o orizzontale, cremasterico assente. TWIST alto → urologo subito, l’ecodoppler non deve ritardare.',
      'Orchiepididimite: esordio graduale, epididimo dolente e ingrossato, spesso febbre e sintomi urinari; Prehn positivo non è affidabile.',
      'Esame urine e urinocoltura; < 35 anni o rapporti a rischio: test per gonococco e clamidia (urine di primo getto).',
      'Probabile infezione sessuale: ceftriaxone + doxiciclina. Probabile origine urinaria (> 35 anni, uropatia, catetere): chinolonico.',
      'Ricovero se sepsi, ascesso, dolore incontrollabile; ecografia se dubbio o non migliora in 3 giorni.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (adulto)',
        punti: [
          'Da trasmissione sessuale: ceftriaxone (Rocefin) 1 g im dose unica + doxiciclina (Bassado) 100 mg ogni 12 h per 10–14 giorni.',
          'Origine urinaria: levofloxacina (Tavanic) 500 mg al giorno per 10 giorni (o ciprofloxacina 500 mg ogni 12 h).',
          'Sostegno scrotale, ghiaccio, ibuprofene (Brufen) 600 mg ogni 8 h.',
          'Partner degli ultimi 60 giorni da valutare e trattare se infezione sessuale; niente rapporti fino a fine terapia.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2025-03-01', testo: 'EAU 2025: scelta dell’antibiotico secondo il rischio di infezione sessuale o urinaria; torsione da escludere sempre.' },
    ],
  },
  {
    id: 'infezione-urinaria',
    titolo: 'Infezioni delle vie urinarie',
    ente: 'EAU',
    anno: 2025,
    area: 'Urologia · Infettivologia',
    fonte: { etichetta: 'EAU Guidelines on Urological Infections 2025', url: 'https://uroweb.org/guidelines/urological-infections' },
    controllata: '2026-11-11',
    vediAnche: [
      { etichetta: 'Antibiotici: cistite', to: '/antibiotici?apri=cistite' },
      { etichetta: 'Antibiotici: pielonefrite', to: '/antibiotici?apri=pielonefrite' },
      { etichetta: 'Antibiotici: prostatite', to: '/antibiotici?apri=prostatite' },
      { etichetta: 'Dimissione cistite', to: '/dimissioni?apri=cistite' },
      { etichetta: 'Dimissione pielonefrite', to: '/dimissioni?apri=pielonefrite' },
      { etichetta: 'Sepsi', to: '/linee-guida/sepsi' },
    ],
    inBreve: [
      'Cistite non complicata (donna non gravida, senza anomalie): diagnosi clinica, niente urinocoltura; fosfomicina dose unica o nitrofurantoina 5 giorni.',
      'Batteriuria asintomatica: non trattare (tranne gravidanza e prima di interventi urologici). Nell’anziano lo stick positivo senza sintomi urinari non spiega febbre o confusione.',
      'Uomo con sintomi urinari: infezione complicata, urinocoltura, 7 giorni; febbre o dolore perineale → prostatite.',
      'Pielonefrite: urinocoltura (ed emocolture se grave); ecografia se dolore colico, calcoli noti, monorene, mancata risposta in 72 h.',
      'Idronefrosi infetta: drenaggio urgente (urologo). Sepsi: PDTA sepsi.',
      'Gravidanza: urinocoltura sempre; niente chinoloni.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (adulto)',
        punti: [
          'Cistite: fosfomicina (Monuril) 3 g dose unica la sera a vescica vuota, oppure nitrofurantoina (Neofuradantin) 100 mg ogni 12 h per 5 giorni (no se clearance < 30).',
          'Cistite nell’uomo: secondo coltura, 7 giorni (es. nitrofurantoina; chinolonico se sospetta prostatite).',
          'Pielonefrite a domicilio: ciprofloxacina (Ciproxin) 500 mg ogni 12 h per 7 giorni (se resistenze locali < 10%) o ceftriaxone (Rocefin) 1–2 g dose iniziale poi terapia orale secondo coltura.',
          'Pielonefrite ricoverata: ceftriaxone 2 g ev ogni 24 h; shock o rischio di resistenze: piperacillina/tazobactam (Tazocin) 4,5 g ogni 6 h.',
        ],
      },
      {
        titolo: 'Ricovero se',
        punti: [
          'Sepsi o instabilità, vomito che impedisce la terapia orale, ostruzione, gravidanza con pielonefrite, immunodepressione, mancata risposta.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2025-03-01', testo: 'EAU 2025: niente urinocoltura nella cistite non complicata della donna; batteriuria asintomatica non trattata; chinoloni solo se necessari.' },
    ],
  },
  {
    id: 'gastrite-dispepsia',
    titolo: 'Gastrite e dispepsia',
    ente: 'ACG/CAG',
    anno: 2017,
    area: 'Gastroenterologia',
    fonte: { etichetta: 'Moayyedi et al., Am J Gastroenterol 2017 (ACG/CAG)', url: 'https://doi.org/10.1038/ajg.2017.154' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'heart', nome: 'HEART' }],
    vediAnche: [
      { etichetta: 'Reflusso', to: '/linee-guida/reflusso' },
      { etichetta: 'Emorragia digestiva', to: '/linee-guida/emorragia-digestiva' },
      { etichetta: 'Dimissione gastrite', to: '/dimissioni?apri=gastrite' },
    ],
    inBreve: [
      'Dolore epigastrico: prima escludere SCA (ECG, troponina se dubbio), colica biliare, pancreatite (lipasi), ulcera perforata, aneurisma aortico.',
      'Segni d’allarme: sanguinamento (ematemesi, melena), anemia, calo di peso, disfagia, vomito persistente, massa, ittero, ≥ 60 anni con sintomi nuovi → gastroscopia.',
      'Sotto i 60 anni senza allarme: test per Helicobacter pylori (breath test o antigene fecale, a 2 settimane dallo stop dell’inibitore di pompa) ed eradicazione se positivo.',
      'Negativo o senza Helicobacter: inibitore di pompa per 4–8 settimane.',
      'Sospendere FANS e aspirina se possibile; alcol e fumo.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (adulto)',
        punti: [
          'Pantoprazolo (Pantorc) 40 mg al mattino a digiuno, 30 min prima della colazione, per 4–8 settimane.',
          'Alginato/antiacido (Gaviscon) dopo i pasti e la sera al bisogno.',
          'Helicobacter: quadruplice con bismuto (Pylera 3 capsule 4 volte al giorno + omeprazolo 20 mg 2 volte al giorno per 10 giorni) dal curante.',
          'In PS: pantoprazolo 40 mg ev; per il dolore paracetamolo, non FANS.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2017-07-01', testo: 'ACG/CAG 2017: endoscopia dai 60 anni; sotto i 60 test-and-treat per H. pylori e poi inibitore di pompa. Maastricht VI (2022): quadruplice con bismuto in prima linea.' },
    ],
  },
  {
    id: 'reflusso',
    titolo: 'Malattia da reflusso gastroesofageo',
    ente: 'ACG',
    anno: 2022,
    area: 'Gastroenterologia',
    fonte: { etichetta: 'Katz et al., Am J Gastroenterol 2022 (ACG)', url: 'https://doi.org/10.14309/ajg.0000000000001538' },
    controllata: '2026-11-11',
    calcolatori: [{ id: 'heart', nome: 'HEART' }],
    vediAnche: [
      { etichetta: 'Gastrite e dispepsia', to: '/linee-guida/gastrite-dispepsia' },
      { etichetta: 'NSTE-SCA', to: '/linee-guida/nste-sca' },
      { etichetta: 'Dimissione reflusso', to: '/dimissioni?apri=reflusso' },
    ],
    inBreve: [
      'Sintomi tipici: pirosi retrosternale e rigurgito, dopo i pasti o da sdraiati.',
      'Dolore toracico: prima escludere la causa cardiaca, anche se «sembra reflusso».',
      'Sintomi tipici senza allarme: inibitore di pompa per 8 settimane, 30–60 min prima del pasto; poi provare a sospendere o ridurre alla dose minima efficace.',
      'Allarme → gastroscopia: disfagia, odinofagia, sanguinamento, anemia, calo di peso, vomito ricorrente.',
      'Misure di stile di vita: calo di peso, testata del letto rialzata se sintomi notturni, niente pasti 2–3 h prima di coricarsi.',
      'Corpo estraneo o bolo alimentare impattato (non deglutisce la saliva): gastroscopia urgente.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (adulto)',
        punti: [
          'Pantoprazolo (Pantorc) 40 mg o omeprazolo (Omeprazen) 20 mg al mattino, 30–60 min prima della colazione, per 8 settimane.',
          'Sintomi notturni o risposta parziale: dose 2 volte al giorno (prima di colazione e cena).',
          'Alginato (Gaviscon) dopo i pasti e la sera per i sintomi al bisogno.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2021-11-22', testo: 'ACG 2022: 8 settimane di inibitore di pompa per i sintomi tipici, poi tentativo di sospensione; endoscopia per sintomi d’allarme o mancata risposta.' },
    ],
  },
  {
    id: 'trauma-cranico',
    titolo: 'Trauma cranico lieve (PDTA aziendale)',
    ente: 'PDTA ASL Toscana Centro / NICE 2023',
    anno: 2023,
    area: 'Trauma · Neurologia',
    fonte: { etichetta: 'NICE NG232 Head injury (2023) — integra il PDTA aziendale di Prato', url: 'https://www.nice.org.uk/guidance/ng232' },
    controllata: '2026-11-12',
    calcolatori: [{ id: 'gcs', nome: 'GCS' }, { id: 'ccthr', nome: 'Canadian CT Head Rule' }, { id: 'nexus2', nome: 'NEXUS II' }, { id: 'ccsr', nome: 'Canadian C-spine' }, { id: 'nexus', nome: 'NEXUS cervicale' }],
    vediAnche: [
      { etichetta: 'Cartella: trauma cranico', to: '/anamnesi?apri=trauma-cranico' },
      { etichetta: 'Dimissione trauma cranico', to: '/dimissioni?apri=trauma-cranico' },
      { etichetta: 'Dimissione in anticoagulante', to: '/dimissioni?apri=trauma-cranico-tao' },
      { etichetta: 'Anticoagulato che sanguina', to: '/linee-guida/anticoagulato-sanguinamento' },
      { etichetta: 'Trauma maggiore', to: '/linee-guida/trauma-maggiore' },
    ],
    inBreve: [
      'Lieve = GCS 14–15 (il PDTA aziendale, come le linee guida italiane SINCh, considera il GCS 13 già moderato). Commotivo se perdita di coscienza o amnesia.',
      'TC entro 1 ora: GCS < 15, segni di frattura cranica, convulsioni, deficit neurologico, vomito ripetuto.',
      'TC entro 8 ore: perdita di coscienza, amnesia o stato confusionale; cefalea diffusa, coagulopatia, intossicazione da alcol o sostanze, dinamica maggiore, età > 65; antiaggreganti (esclusa ASA 100 mg), anticoagulanti, pregresso intervento neurochirurgico, difficoltà di osservazione.',
      'Nessun criterio: trauma cranico lieve non commotivo a basso rischio, dimissione con il modulo di osservazione domiciliare, senza TC.',
      'TC positiva: neurochirurgo di Careggi; anticoagulato → antagonizzare. TC dubbia: osservazione o ricovero.',
      'TC di controllo dopo 24 h di osservazione se GCS 14 o sintomi neurologici persistenti; subito se peggiora.',
    ],
    sezioni: [
      {
        titolo: 'Esame obiettivo mirato',
        punti: [
          'GCS ripetuto; pupille e motilità oculare; esame neurologico completo.',
          'Segni di frattura: infossamento o ferita penetrante, ecchimosi periorbitarie bilaterali («occhi di panda»), segno di Battle, emotimpano, oto- o rinoliquorrea.',
          'Rachide cervicale: Canadian C-spine rule; altri traumi (sopra le clavicole, torace, addome, bacino).',
          'Perché è caduto? Escludere sincope, aritmia, ipoglicemia, intossicazione.',
        ],
      },
      {
        titolo: 'Anticoagulati e antiaggregati',
        punti: [
          'PDTA aziendale: anticoagulanti e antiaggreganti (tranne ASA 100 mg) = TC entro 8 h; nel testo si suggerisce entro 1 h per la terapia anticoagulante (TAO): nella pratica, TC il prima possibile se TAO.',
          'Prelievi: emocromo, PT/INR, aPTT; ora dell’ultima dose del DOAC.',
          'TC positiva: antagonizzare subito (vedi PDTA «Anticoagulato che sanguina») e neurochirurgo.',
          'TC negativa, GCS 15, senza altri problemi: il rischio di emorragia tardiva è basso (circa 1%, più con dicumarolici che con DOAC); la TC di controllo non è indicata di routine (NICE 2023). Dimissione con caregiver e foglio informativo, oppure osservazione se dubbi o niente caregiver.',
        ],
      },
      {
        titolo: 'Dimissione',
        punti: [
          'GCS tornato a 15 (o al valore abituale), nessun sintomo d’allarme (vomito persistente, cefalea grave, crisi), nessun altro motivo di ricovero (intossicazione, altre lesioni, liquorrea, meningismo).',
          'Una persona adulta presente a casa per almeno 24 h; foglio informativo dato a voce e per scritto al paziente e a chi lo assiste (protocollo di osservazione domiciliare).',
          'Senza caregiver: la TC normale permette comunque la dimissione dei pazienti senza segni neurologici (basso rischio di peggioramento).',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2023-05-18', testo: 'NICE NG232 (2023): TC entro 1 h per GCS < 13 all’arrivo o < 15 a 2 h, frattura, crisi, deficit, vomito ripetuto; entro 8 h per anticoagulanti; antiaggreganti da soli non sono più un criterio automatico.' },
      { data: '2026-11-12', testo: 'Inserito il PDTA aziendale del trauma cranico lieve con il protocollo di osservazione domiciliare, integrato con NICE 2023 ed EFNS 2012.' },
    ],
  },
  {
    id: 'tia',
    titolo: 'Attacco ischemico transitorio (TIA)',
    ente: 'ESO / AHA',
    anno: 2021,
    area: 'Neurologia',
    fonte: { etichetta: 'Fonseca et al., Eur Stroke J 2021 (ESO, gestione del TIA)', url: 'https://doi.org/10.1177/2396987321992905' },
    controllata: '2026-11-12',
    calcolatori: [{ id: 'abcd2', nome: 'ABCD²' }],
    vediAnche: [
      { etichetta: 'Codice ictus', to: '/linee-guida/ictus' },
      { etichetta: 'Fibrillazione atriale', to: '/linee-guida/fibrillazione-atriale' },
      { etichetta: 'Cartella: deficit neurologico', to: '/anamnesi?apri=deficit-neurologico' },
    ],
    inBreve: [
      'Deficit neurologico focale acuto risolto completamente; se il deficit è ancora presente è un ictus: codice ictus.',
      'È un’urgenza: il rischio di ictus è massimo nelle prime 48 ore. Valutazione specialistica e accertamenti entro 24 h (osservazione, ricovero o ambulatorio TIA rapido).',
      'L’ABCD² aiuta ma non va usato da solo per decidere chi dimettere (ESO 2021): conta soprattutto la causa (stenosi carotidea, FA).',
      'Subito: TC encefalo con angio-TC dei vasi del collo e intracranici (o RM con DWI + angio), ECG e monitor per la FA, glicemia, emocromo, coagulazione, lipidi.',
      'Doppia antiaggregazione per 21 giorni nel TIA ad alto rischio (ABCD² ≥ 4) se non cardioembolico e senza indicazione all’anticoagulante.',
      'Stenosi carotidea sintomatica 50–99%: endoarteriectomia entro 2 settimane. FA: anticoagulante. Statina ad alta intensità.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (adulto)',
        punti: [
          'Doppia antiaggregazione: ASA 300 mg + clopidogrel (Plavix) 300–600 mg di carico, poi ASA 100 mg + clopidogrel 75 mg al giorno per 21 giorni, poi un solo antiaggregante.',
          'Alternativa: ticagrelor (Brilique) 180 mg poi 90 mg ogni 12 h + ASA per 30 giorni.',
          'Basso rischio: un solo antiaggregante (ASA 100 mg o clopidogrel 75 mg).',
          'FA: anticoagulante (DOAC) da iniziare presto dopo il TIA, se l’imaging esclude emorragia.',
          'Atorvastatina (Torvast) 40–80 mg; obiettivo LDL < 70 mg/dL (o < 55 secondo ESC).',
        ],
      },
      {
        titolo: 'Imitatori del TIA',
        punti: [
          'Ipoglicemia, aura emicranica (sintomi positivi che si spostano), crisi epilettica con paralisi di Todd, sincope, vertigine periferica isolata, amnesia globale transitoria.',
          'Sintomi isolati poco suggestivi: vertigine, confusione, perdita di coscienza, incontinenza.',
        ],
      },
      {
        titolo: 'Indicazioni alla dimissione',
        punti: [
          'Non guidare fino alla valutazione specialistica (di norma almeno 1 mese dopo il TIA, secondo la normativa).',
          'Tornare subito (112) se ricompaiono i sintomi.',
          'Visita neurologica/ambulatorio TIA ed esami prenotati prima della dimissione.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2021-02-01', testo: 'ESO 2021: valutazione entro 24 h in centro dedicato; ABCD² da solo non sufficiente per il triage; doppia antiaggregazione breve nel TIA ad alto rischio.' },
    ],
  },
  {
    id: 'anemia-acuta',
    titolo: 'Anemia acuta e trasfusione',
    ente: 'AABB / NICE',
    anno: 2023,
    area: 'Ematologia · Emergenze',
    fonte: { etichetta: 'Carson et al., JAMA 2023 (AABB, soglie trasfusionali)', url: 'https://doi.org/10.1001/jama.2023.12914' },
    controllata: '2026-11-12',
    vediAnche: [
      { etichetta: 'Modulo richiesta trasfusione', to: '/modulo-trasfusione' },
      { etichetta: 'Emorragia digestiva', to: '/linee-guida/emorragia-digestiva' },
      { etichetta: 'Trauma maggiore', to: '/linee-guida/trauma-maggiore' },
      { etichetta: 'Anticoagulato che sanguina', to: '/linee-guida/anticoagulato-sanguinamento' },
      { etichetta: 'Extrauterina', to: '/linee-guida/extrauterina' },
    ],
    inBreve: [
      'Prima domanda: sta sanguinando ed è instabile? Allora si tratta l’emorragia (accessi, emoderivati, controllo della fonte), non il valore di Hb.',
      'Prima di trasfondere: gruppo e prove crociate (2 provette EDTA etichettate al letto), e i prelievi per la causa (reticolociti, ferro, B12/folati, emolisi) che dopo la trasfusione non sono più interpretabili.',
      'Soglie (paziente stabile): Hb < 7 g/dL; < 8 g/dL se cardiopatia ischemica/vascolare nota o chirurgia ortopedica; nella SCA in atto soglia più alta (8–10, dati in evoluzione).',
      'Paziente stabile non sanguinante: 1 unità alla volta, poi rivalutare clinica e Hb (1 unità ≈ +1 g/dL).',
      'Urgentissima (senza prove di compatibilità): emazie 0 Rh negativo (donne in età fertile) o 0 positivo, poi prove appena possibile.',
      'Anemia sideropenica stabile: ferro (orale o ev) invece della trasfusione.',
    ],
    sezioni: [
      {
        titolo: 'Emocomponenti (70 kg)',
        punti: [
          'Emazie concentrate: 1 unità ≈ +1 g/dL di Hb; in 1–2 h (più lenta se scompenso: considerare furosemide 20 mg ev tra le unità).',
          'Piastrine: < 10.000 profilassi; < 50.000 se sanguinamento o procedura invasiva; < 100.000 se sanguinamento cerebrale o neurochirurgia. 1 pool ≈ +20–30.000.',
          'Plasma fresco congelato: sanguinamento con PT/INR > 1,5 o aPTT > 1,5 volte: 15 mL/kg ≈ 1.000 mL (4 unità). Dicumarolici: complesso protrombinico, non plasma.',
          'Fibrinogeno < 1,5 g/L con sanguinamento: fibrinogeno concentrato 3–4 g.',
          'Emorragia massiva: emazie e plasma presto (almeno 1:2), acido tranexamico, calcio; vedi PDTA trauma maggiore.',
        ],
      },
      {
        titolo: 'Esami prima della trasfusione',
        punti: [
          'Emocromo con MCV, reticolociti, striscio periferico.',
          'Ferritina, sideremia, transferrina; vitamina B12 e folati.',
          'Emolisi: LDH, bilirubina indiretta, aptoglobina, test di Coombs diretto.',
          'Creatinina, funzione epatica, PT/INR, aPTT, fibrinogeno.',
          'Esplorazione rettale (melena); test di gravidanza; gruppo e prove crociate.',
        ],
      },
      {
        titolo: 'Reazioni trasfusionali',
        punti: [
          'Febbre, brividi, orticaria, dispnea, ipotensione, dolore lombare, urine scure: fermare subito la trasfusione, mantenere l’accesso con SF, controllare identità e sacca.',
          'Anafilassi: adrenalina 0,5 mg im. Sovraccarico (TACO): diuretico, ossigeno. Sospetta emolisi o TRALI: rianimatore e Medicina trasfusionale.',
          'Rimandare la sacca e le provette al Centro trasfusionale con la segnalazione.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2023-11-01', testo: 'AABB 2023: strategia restrittiva (Hb 7 g/dL) per la maggior parte dei ricoverati; 7,5 in cardiochirurgia, 8 in ortopedia o con malattia cardiovascolare; evidenze insufficienti per la SCA (trial MINT a favore di soglie più alte).' },
      { data: '2026-11-12', testo: 'Aggiunto il modulo aziendale di richiesta di sangue e emocomponenti compilabile e stampabile.' },
    ],
  },
  {
    id: 'microangiopatie-cid',
    titolo: 'Piastrinopenia acuta: PTT (Moschcowitz), SEU e CID',
    ente: 'ISTH 2020/2025 · ISTH 2025 (CID)',
    anno: 2025,
    area: 'Ematologia · Nefrologia',
    fonte: { etichetta: 'Zheng et al., J Thromb Haemost 2025 (ISTH, aggiornamento PTT)', url: 'https://doi.org/10.1016/j.jtha.2025.06.002' },
    controllata: '2026-11-12',
    calcolatori: [{ id: 'plasmic', nome: 'PLASMIC' }, { id: 'isth-dic', nome: 'ISTH DIC' }],
    vediAnche: [
      { etichetta: 'Anemia acuta e trasfusione', to: '/linee-guida/anemia-acuta' },
      { etichetta: 'Modulo richiesta trasfusione', to: '/modulo-trasfusione' },
      { etichetta: 'Sepsi', to: '/linee-guida/sepsi' },
    ],
    approfondimenti: [
      { etichetta: 'ISTH 2020: diagnosi della PTT', url: 'https://doi.org/10.1111/jth.15006' },
      { etichetta: 'ISTH 2025: nuova definizione e criteri di CID (Iba et al.)', url: 'https://scholars.duke.edu/publication/1685059' },
    ],
    inBreve: [
      'Piastrine basse + anemia: striscio periferico subito. Schistociti + emolisi con Coombs negativo = microangiopatia trombotica (MAT): PTT o SEU finché non si dimostra altro.',
      'Coagulazione (PT/INR, aPTT, fibrinogeno, D-dimero) normale o quasi → MAT; coagulazione alterata con fibrinogeno in calo → CID.',
      'PTT (Moschcowitz): piastrine spesso < 30.000, sintomi neurologici, creatinina poco alterata. Punteggio PLASMIC 6–7 = alta probabilità: prelevare ADAMTS-13 PRIMA di plasma o terapie, ematologo e plasmaferesi subito.',
      'SEU: insufficienza renale in primo piano. Con diarrea (spesso ematica) = da Shiga-tossina (STEC): niente antibiotici né antidiarroici, terapia di supporto, dialisi se serve. Senza diarrea = atipica (complemento): nefrologo, plasmaferesi in attesa di ADAMTS-13, poi eculizumab o ravulizumab.',
      'CID: sempre secondaria (sepsi, trauma, ostetricia, neoplasie, leucemia promielocitica). Si cura la causa; emocomponenti solo se sanguina o deve fare procedure.',
      'Nella PTT e nella SEU NON trasfondere piastrine se non per emorragia grave: possono peggiorare le trombosi.',
    ],
    sezioni: [
      {
        titolo: 'Esami da fare subito',
        punti: [
          'Emocromo con reticolociti e striscio (schistociti > 1%), LDH, bilirubina indiretta, aptoglobina, Coombs diretto.',
          'PT/INR, aPTT, fibrinogeno, D-dimero; creatinina, elettroliti, esame urine; troponina (coinvolgimento cardiaco nella PTT).',
          'ADAMTS-13 (attività e anticorpi) su provetta citrato PRIMA di plasma o plasmaferesi.',
          'Test di gravidanza; HIV, epatiti; coprocoltura e ricerca Shiga-tossina se diarrea; emocolture se febbre.',
        ],
      },
      {
        titolo: 'PTT (porpora trombotica trombocitopenica, Moschcowitz)',
        punti: [
          'Causa: deficit grave di ADAMTS-13 (attività < 10%), quasi sempre autoimmune. Senza terapia mortale nella grande maggioranza dei casi.',
          'Plasmaferesi (scambio plasmatico) urgente con Medicina trasfusionale; se ritarda: plasma fresco congelato 15–20 mL/kg (≈ 4–5 unità) nell’attesa.',
          'Steroide: metilprednisolone (Urbason) 1 mg/kg/die = 70 mg ev (oppure 1 g/die per 3 giorni nei casi gravi).',
          'Caplacizumab (Cablivi) e rituximab: decisione dell’ematologo (il caplacizumab si sospende se ADAMTS-13 ≥ 20%).',
          'Acido folico; profilassi antitrombotica solo quando le piastrine superano 50.000.',
        ],
      },
      {
        titolo: 'SEU (sindrome emolitico-uremica)',
        punti: [
          'STEC (diarrea ematica 5–10 giorni prima): idratazione, controllo della pressione, emazie se Hb < 7, dialisi se necessaria; evitare antibiotici, antidiarroici, FANS.',
          'Atipica (complemento) o con ADAMTS-13 normale e senza diarrea: plasmaferesi finché non arriva ADAMTS-13, poi inibitore del C5 (eculizumab o ravulizumab) con profilassi antimeningococcica (vaccino + antibiotico).',
          'Altre MAT: farmaci (gemcitabina, inibitori della calcineurina, chinino), ipertensione maligna, gravidanza (HELLP), lupus/antifosfolipidi, neoplasie.',
        ],
      },
      {
        titolo: 'CID (coagulazione intravascolare disseminata)',
        punti: [
          'Punteggio ISTH ≥ 5 = CID conclamata (piastrine, D-dimero, PT, fibrinogeno); ripetere ogni giorno.',
          'Trattare la causa: antibiotico e controllo della fonte nella sepsi, evacuazione uterina nell’emorragia ostetrica, ATRA subito se leucemia promielocitica sospetta.',
          'Se sanguina o deve fare procedure: piastrine se < 50.000; plasma 15 mL/kg se PT o aPTT > 1,5 volte; fibrinogeno < 1,5 g/L: fibrinogeno concentrato 3–4 g (o crioprecipitato).',
          'Senza sanguinamento: piastrine solo se < 10–20.000; non correggere numeri.',
          'Fenotipo trombotico (sepsi, neoplasie, porpora fulminante): profilassi eparinica se non sanguina. Acido tranexamico solo nelle forme iperfibrinolitiche (trauma, ostetricia), non nella CID trombotica.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2025-06-01', testo: 'ISTH 2025, aggiornamento sulla PTT: confermato il caplacizumab con plasmaferesi, steroidi e rituximab nella PTT immunomediata.' },
      { data: '2025-08-19', testo: 'ISTH 2025, CID: fasi pre-CID, precoce e conclamata; nuove soglie del D-dimero (> 3 e > 7 volte il normale) nel punteggio; fenotipi trombotico ed emorragico.' },
    ],
  },
]

export const lineaGuida = (id: string) => LINEE_GUIDA.find((l) => l.id === id)

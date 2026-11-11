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
      { etichetta: 'Anamnesi: dolore al fianco', to: '/anamnesi?apri=colica-renale' },
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
    vediAnche: [{ etichetta: 'Anamnesi: sanguinamento digestivo', to: '/anamnesi?apri=emorragia-digestiva' }],
    approfondimenti: [
      { etichetta: 'ESGE 2022: emorragia da varici esofago-gastriche', url: 'https://doi.org/10.1055/a-1939-4887' },
    ],
    inBreve: [
      'Stabilizzare prima: due accessi, cristalloidi se instabile, trasfusione restrittiva (Hb ≤ 7 g/dL; ≤ 8 se cardiopatia).',
      'Glasgow-Blatchford ≤ 1: gestione ambulatoriale con endoscopia programmata.',
      'Non varicosa: endoscopia entro 24 h dopo la stabilizzazione; IPP ad alte dosi prima, senza ritardare l’endoscopia; eritromicina 250 mg ev 30–120 min prima se sanguinamento importante.',
      'Sospetta varicosa (cirrosi): vasoattivo subito (terlipressina, somatostatina o octreotide), ceftriaxone 1 g/die fino a 7 giorni, eritromicina ed endoscopia entro 12 h.',
      'Niente sondino naso-gastrico di routine. Acido tranexamico non raccomandato.',
    ],
    sezioni: [
      {
        titolo: 'Farmaci (70 kg)',
        punti: [
          'IPP: esomeprazolo o pantoprazolo 80 mg ev in bolo = 2 fiale da 40 mg, poi 8 mg/h (o 40 mg ogni 12 h); dopo emostasi endoscopica ad alto rischio, alte dosi per 72 h.',
          'Eritromicina 250 mg ev in 20–30 min, 30–120 min prima dell’endoscopia (controllare QT).',
          'Terlipressina 2 mg ev ogni 4 h (2 fiale da 1 mg) fino al controllo, poi 1 mg ogni 4 h, per 2–5 giorni. Alternativa: somatostatina 250 µg in bolo poi 250–500 µg/h.',
          'Ceftriaxone 1 g ev al giorno fino a 7 giorni in tutti i cirrotici con emorragia.',
        ],
      },
      {
        titolo: 'Anticoagulanti e antiaggreganti',
        punti: [
          'AVK con emorragia grave/instabile: complesso protrombinico (4 fattori) + vitamina K ev.',
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
      { etichetta: 'Anamnesi: vertigine', to: '/anamnesi?apri=vertigine' },
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
          'Sintomatici solo per pochi giorni (antiemetici: metoclopramide, ondansetron; dimenidrinato): rallentano il compenso vestibolare. Evitare le benzodiazepine prolungate.',
          'Neurite vestibolare: cortisone breve da considerare (GRACE-3), es. prednisone 50–60 mg/die per 5 giorni a scalare; riabilitazione vestibolare precoce.',
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
          'Seconda linea (controindicazioni o mancata risposta, esclusa l’infezione): prednisone a basse dosi 0,2–0,5 mg/kg/die. Recidive refrattarie: anti-IL-1 (specialista).',
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
          'Idrocortisone 200 mg/die ev (es. infusione) per 4–7 giorni, poi a scalare (schema CAPE COD), entro 24 h dall’ingresso.',
          'No se influenza, aspergillosi, diabete scompensato, sanguinamento digestivo recente.',
        ],
      },
    ],
    aggiornamenti: [
      { data: '2025-07-18', testo: 'ATS 2025 (aggiornamento parziale della ATS/IDSA 2019, non approvato dall’IDSA): ecografia polmonare equivalente alla RX, antibiotico non sempre necessario con virus positivo, durata breve, cortisone nella CAP grave.' },
      { data: '2019-10-01', testo: 'ATS/IDSA 2019: terapia empirica secondo gravità e fattori di rischio per Pseudomonas e MRSA.' },
    ],
  },
]

export const lineaGuida = (id: string) => LINEE_GUIDA.find((l) => l.id === id)

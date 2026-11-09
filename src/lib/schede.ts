/*
 * Schede «Procedure» e «Sedazione»: card che si aprono sui passaggi.
 * Un blocco con numerato: true mostra i passaggi in sequenza numerata.
 * Riferimenti principali: BTS 2023 (pleura), EASL 2018 (ascite), ESC 2025 (pericardio),
 * IDSA 2004/ESCMID 2016 (rachicentesi), DAS 2015/2025 e Vortex (vie aeree), ATLS 10ª ed.,
 * ACEP 2014 (sedazione procedurale), Project BETA (agitazione), EAPC 2023 e SICP (sedazione palliativa).
 */

export interface Scheda {
  id: string
  nome: string
  gruppo: string
  sintesi: string
  blocchi: { titolo: string; righe: string[]; numerato?: boolean }[]
  fonte?: string
}

export const PROCEDURE: Scheda[] = [
  // ─── Vie aeree ───
  {
    id: 'rsi', nome: 'Intubazione in sequenza rapida', gruppo: 'Vie aeree',
    sintesi: 'Preparare, preossigenare, ottimizzare l’emodinamica, induzione + curaro, conferma con capnografia.',
    blocchi: [
      { titolo: 'Preparazione (checklist ad alta voce)', righe: [
        'Ruoli assegnati; piano A–B–C–D detto ad alta voce (tubo → sopraglottico → maschera → cricotirotomia).',
        'Monitor: SpO₂, PA ogni 3 min, ECG, capnografia a onda pronta. Due accessi venosi funzionanti.',
        'Aspiratore acceso sotto il cuscino; videolaringoscopio + laringoscopio diretto; tubi 7,0–8,0 con mandrino, cuffia provata; bougie; sopraglottico (i-gel 3–4–5); kit cricotirotomia (bisturi n. 10, bougie, tubo 6,0).',
        'Farmaci aspirati ed etichettati: induttore, curaro, vasopressore (noradrenalina in infusione o adrenalina 10 µg/mL per boli), sedazione post-intubazione.',
      ] },
      { titolo: 'Sequenza', numerato: true, righe: [
        'Posizione: orecchio allineato allo sterno (rampa se obeso), testa sollevata di 20–30° se possibile.',
        'Preossigenazione 3 min con FiO₂ ~100%: reservoir a flusso massimo («flush») o NIV/CPAP se ipossiemico; obiettivo ETO₂ >85%.',
        'Ossigenazione apneica: cannula nasale a 15 L/min lasciata in sede per tutta la procedura.',
        'Ottimizzare: shock index >0,8 o PAS <90 → liquidi e/o noradrenalina prima dell’induzione; ridurre la dose di induttore.',
        'Induzione + curaro in rapida successione (dosi nella scheda «Sedoanalgesia per intubazione»).',
        'Attendere 45–60 s (fascicolazioni finite o rocuronio pieno) senza ventilare, salvo SpO₂ <93%: allora ventilare con maschera a basse pressioni.',
        'Videolaringoscopia, bougie se visione parziale; tubo a 21 cm (donna) / 23 cm (uomo) all’arcata.',
        'Cuffiare (20–30 cmH₂O) e confermare con capnografia a onda per ≥5 atti: niente onda = tubo fuori finché non è provato il contrario.',
        'Fissare, Rx torace, ventilatore e sedazione subito (il rocuronio dura 45–60 min).',
      ] },
      { titolo: 'Se non riesce', righe: [
        'Massimo 3 tentativi (il 4° solo da un operatore più esperto), cambiando ogni volta qualcosa (posizione, lama, bougie, operatore).',
        'Fallimento: sopraglottico di 2ª generazione e ossigenare; poi decidere se svegliare, intubare attraverso il sopraglottico o via chirurgica.',
        'CICO (non intubo, non ossigeno) con curaro dato: cricotirotomia scalpel–bougie–tubo subito.',
      ] },
      { titolo: 'Ventilatore iniziale', righe: [
        'Volume corrente 6–8 mL/kg di peso ideale; PEEP 5; FiO₂ 100% poi ridurre per SpO₂ 92–96%.',
        'FR 14–18; più alta se acidosi metabolica (mantenere la compensazione che il paziente faceva da solo).',
        'Pressione di plateau <30 cmH₂O; EGA a 20–30 min.',
      ] },
    ],
    fonte: 'DAS 2015, linee guida di intubazione del paziente critico (DAS/ICS/FICM/RCoA 2018)',
  },
  {
    id: 'crico', nome: 'Cricotirotomia scalpel–bougie–tubo', gruppo: 'Vie aeree',
    sintesi: 'CICO: estensione del collo, bisturi trasversale, rotazione, bougie, tubo 6,0.',
    blocchi: [
      { titolo: 'Materiale', righe: ['Bisturi lama n. 10 (larga), bougie, tubo cuffiato 6,0, siringa per la cuffia'] },
      { titolo: 'Membrana palpabile', numerato: true, righe: [
        'Collo esteso (cuscino sotto le spalle o testa oltre il bordo del letto).',
        'Mano non dominante: «stretta di mano laringea», trovare la membrana cricotiroidea tra tiroide e cricoide.',
        'Incisione trasversale attraverso cute e membrana, lama perpendicolare con il taglio verso l’operatore.',
        'Ruotare la lama di 90° (taglio verso i piedi), trazione laterale verso di sé.',
        'Far scivolare la punta del bougie lungo la lama dentro la trachea (10–15 cm).',
        'Togliere il bisturi; inserire il tubo 6,0 lubrificato sul bougie, ruotandolo; togliere il bougie.',
        'Cuffiare, ventilare, confermare con capnografia; fissare.',
      ] },
      { titolo: 'Membrana non palpabile', righe: ['Incisione verticale mediana di 8–10 cm, dissezione digitale smussa fino alla laringe, poi come sopra.'] },
    ],
    fonte: 'Difficult Airway Society 2015',
  },
  // ─── Torace ───
  {
    id: 'toracentesi', nome: 'Toracentesi diagnostica ed evacuativa', gruppo: 'Torace',
    sintesi: 'Sempre eco-guidata; sopra il margine superiore della costa; evacuare al massimo 1,5 L.',
    blocchi: [
      { titolo: 'Prima', righe: [
        'Controindicazioni relative: anticoagulanti a dose piena, piastrine <50.000, INR >1,5, cute infetta. Non serve correggere la coagulazione di routine nella diagnostica.',
        'Consenso; paziente seduto, braccia appoggiate in avanti (o supino a 30° se critico, linea ascellare media).',
      ] },
      { titolo: 'Passaggi', numerato: true, righe: [
        'Eco: punto con la falda più spessa (>1 cm), senza polmone né diaframma nell’escursione respiratoria; 1–2 spazi sotto il limite superiore del versamento, di solito tra linea scapolare e ascellare posteriore. Segnare.',
        'Clorexidina 2% alcolica, telo sterile.',
        'Lidocaina 1% (massimo 3 mg/kg): pomfo, poi in profondità sopra il margine superiore della costa inferiore, aspirando: il liquido conferma la profondità.',
        'Ago-cannula 14–18 G (o kit dedicato) con siringa, aspirando, lungo lo stesso tragitto; al liquido avanzare la cannula e togliere l’ago.',
        'Prelievi: pH (siringa da emogas, eparinata), proteine, LDH, glucosio, colture in flaconi da emocoltura + provetta sterile, Gram, citologia (≥25–50 mL); con il siero contemporaneo (proteine, LDH).',
        'Evacuativa: rubinetto a tre vie o sacca; fermarsi a 1,5 L o prima se tosse, oppressione toracica, dolore, desaturazione.',
        'Togliere la cannula in espirazione, medicazione.',
        'Eco (sliding) o Rx solo se sintomi, aria aspirata o più punture.',
      ] },
      { titolo: 'Interpretazione', righe: [
        'Essudato (Light) se almeno uno: proteine pleura/siero >0,5; LDH pleura/siero >0,6; LDH pleurico >2/3 del limite superiore del siero.',
        'Versamento parapneumonico: pH <7,2 (o glucosio <40 mg/dL, pus, Gram/coltura positivi) → drenaggio.',
      ] },
      { titolo: 'Complicanze', righe: ['Pneumotorace, emotorace (arteria intercostale), edema da riespansione, lesione di fegato o milza (puntura troppo bassa), reazione vagale.'] },
    ],
    fonte: 'BTS Guideline for Pleural Disease 2023',
  },
  {
    id: 'pigtail', nome: 'Drenaggio toracico con pigtail (Seldinger)', gruppo: 'Torace',
    sintesi: '8–14 Fr nel triangolo di sicurezza; dilatatore solo fino alla pleura.',
    blocchi: [
      { titolo: 'Indicazioni', righe: ['Pneumotorace che richiede drenaggio, versamento recidivante o parapneumonico complicato, empiema (14 Fr + lavaggi), versamento maligno.'] },
      { titolo: 'Sede', righe: ['Triangolo di sicurezza: margine laterale del grande pettorale, margine anteriore del gran dorsale, linea orizzontale al 5° spazio (capezzolo); apice sotto l’ascella. Braccio dietro la testa.', 'Versamento: il punto migliore all’eco anche fuori dal triangolo se sicuro.'] },
      { titolo: 'Passaggi', numerato: true, righe: [
        'Eco, segnare; asepsi completa (cuffia, mascherina, camice e guanti sterili, telo).',
        'Lidocaina 1% fino alla pleura sopra il margine superiore della costa, aspirando (aria o liquido).',
        'Ago introduttore con siringa, aspirando, stesso tragitto, finché arriva aria/liquido.',
        'Togliere la siringa (dito sul cono), introdurre la guida a J verso l’alto per l’aria o verso il basso-dietro per il liquido, senza forzare.',
        'Togliere l’ago tenendo la guida; piccola incisione cutanea.',
        'Dilatatore sulla guida con rotazione, solo per pochi cm (non più di 1 cm oltre la profondità della pleura): tenerlo afferrato vicino alla cute.',
        'Pigtail con stiletto sulla guida fino a che tutti i fori laterali sono in cavità; togliere stiletto e guida insieme.',
        'Collegare subito a valvola unidirezionale o drenaggio sotto acqua (sotto il livello del torace); verificare oscillazione/gorgogliamento.',
        'Fissare con punto e medicazione; Rx torace.',
      ] },
      { titolo: 'Dopo', righe: [
        'Versamento abbondante: drenare al massimo 1,5 L nella prima ora, poi clampare 1 h.',
        'Lavaggi del pigtail ogni 6–8 h con 20 mL di SF (si occlude facilmente).',
        'Mai clampare un drenaggio che gorgoglia (pneumotorace in atto).',
      ] },
    ],
    fonte: 'BTS 2023',
  },
  {
    id: 'tubo', nome: 'Tubo toracico grosso calibro (dissezione e trocar)', gruppo: 'Torace',
    sintesi: '24–32 Fr, 4°–5° spazio ascellare media, dissezione smussa e dito in cavità; trocar mai forzato.',
    blocchi: [
      { titolo: 'Indicazioni', righe: ['Emotorace, trauma con pneumo/emotorace, empiema denso, perdita aerea importante, paziente ventilato con pneumotorace grande.', 'Emotorace: 28–32 Fr.'] },
      { titolo: 'Dissezione smussa (tecnica raccomandata)', numerato: true, righe: [
        'Triangolo di sicurezza, 4°–5° spazio tra ascellare anteriore e media; asepsi completa; analgesia (lidocaina abbondante ± oppioide/ketamina).',
        'Incisione cutanea di 2–3 cm parallela alla costa, sopra la costa inferiore.',
        'Dissezione smussa con pinza di Kelly aperta e chiusa sopra il margine superiore della costa, fino alla pleura parietale.',
        'Perforare la pleura con la Kelly chiusa (controllandola con l’altra mano per non affondare), poi aprirla e allargare.',
        'Dito in cavità: conferma che è pleura, libera aderenze, esclude visceri (diaframma, fegato, milza).',
        'Inserire il tubo guidato dalla Kelly o dal dito: verso apice-anteriore per l’aria, posteriore-basale per il liquido; tutti i fori dentro.',
        'Collegare al drenaggio sotto acqua; condensa nel tubo e oscillazione confermano la posizione.',
        'Punto di ancoraggio + punto a U per la chiusura alla rimozione; medicazione; Rx torace.',
      ] },
      { titolo: 'Con trocar', righe: [
        'Le linee guida (BTS) sconsigliano il trocar appuntito: rischio di lesione polmonare, cardiaca, epatica, splenica.',
        'Se è l’unico disponibile: incisione e dissezione smussa fino alla pleura come sopra; trocar arretrato di 1–2 cm dentro il tubo così che la punta non sporga; entrare in pleura con la Kelly, poi far scivolare il tubo usando il trocar solo come guida rigida; mai spingere con forza.',
      ] },
      { titolo: 'Complicanze', righe: ['Posizione extrapleurica o in scissura, lesione di organi, sanguinamento intercostale, edema da riespansione, enfisema sottocutaneo, infezione.'] },
    ],
    fonte: 'BTS 2023; ATLS 10ª edizione',
  },
  {
    id: 'decompressione', nome: 'Decompressione del pneumotorace iperteso', gruppo: 'Torace',
    sintesi: 'Ago 14 G lungo 8 cm al 4°–5° spazio ascellare anteriore-media, poi toracostomia.',
    blocchi: [
      { titolo: 'Passaggi', numerato: true, righe: [
        'Diagnosi clinica (ipotensione, ipossia, assenza di murmure, turgore giugulare) o eco: non aspettare la Rx.',
        'Ago-cannula 14 G lungo almeno 8 cm, al 4°–5° spazio appena davanti alla linea ascellare media (adulto; nel bambino 2° spazio emiclaveare), sopra il margine superiore della costa.',
        'Togliere l’ago lasciando la cannula; sibilo d’aria e miglioramento confermano.',
        'Nel paziente ventilato o in arresto: toracostomia digitale (incisione e dissezione come per il tubo, dito in cavità) è più efficace dell’ago.',
        'Sempre tubo toracico subito dopo.',
      ] },
    ],
    fonte: 'ATLS 10ª edizione',
  },
  {
    id: 'pericardiocentesi', nome: 'Pericardiocentesi', gruppo: 'Torace',
    sintesi: 'Eco-guidata, accesso dove il liquido è più vicino; conferma con soluzione agitata; pigtail.',
    blocchi: [
      { titolo: 'Indicazioni', righe: [
        'Tamponamento con instabilità emodinamica: subito.',
        'Non è la terapia (o solo ponte) nel tamponamento da trauma o da dissezione aortica: chirurgia.',
      ] },
      { titolo: 'Passaggi', numerato: true, righe: [
        'Paziente a 30–45°; monitor ECG; atropina pronta (vagale). Asepsi.',
        'Eco: scegliere il punto con la distanza minore dal liquido e senza strutture in mezzo (subxifoideo, apicale o parasternale sinistro; attenzione all’arteria mammaria interna 1–2 cm dallo sterno).',
        'Subxifoideo classico: ago 16–18 G con siringa, 1 cm sotto e a sinistra dello xifoide, 30–45° rispetto alla cute, diretto verso la spalla sinistra, aspirando sempre.',
        'Al liquido: confermare con l’eco iniettando 5–10 mL di SF agitato (bolle nel pericardio, non nel ventricolo).',
        'Guida a J, togliere l’ago, dilatatore, pigtail 6–8 Fr sulla guida.',
        'Aspirare: già 50–100 mL migliorano l’emodinamica. Evitare di drenare più di ~1 L in pochi minuti (sindrome da decompressione).',
        'Lasciare il pigtail collegato a sacca; Rx torace; campioni (chimica, colture, citologia).',
      ] },
      { titolo: 'Complicanze', righe: ['Puntura del ventricolo destro o di una coronaria, pneumotorace, aritmie, lesione epatica, reazione vagale.', 'Sangue aspirato che coagula = probabile cavità cardiaca; il sangue pericardico di solito non coagula.'] },
    ],
    fonte: 'ESC 2015 e 2025 (malattie del pericardio)',
  },
  // ─── Addome e SNC ───
  {
    id: 'paracentesi', nome: 'Paracentesi diagnostica ed evacuativa', gruppo: 'Addome e SNC',
    sintesi: 'Quadrante inferiore sinistro, tecnica a Z; albumina 8 g per litro se si tolgono >5 L.',
    blocchi: [
      { titolo: 'Prima', righe: ['Non serve correggere INR o piastrine (EASL); evitare in CID clinica.', 'Svuotare la vescica.'] },
      { titolo: 'Passaggi', numerato: true, righe: [
        'Eco: tasca più ampia, di solito 2 dita mediali e craniali alla spina iliaca antero-superiore sinistra; lontano dai vasi epigastrici (laterali ai retti), cicatrici, collaterali.',
        'Asepsi; lidocaina 1% fino al peritoneo.',
        'Tecnica a Z: tirare la cute di 2 cm in basso, pungere, rilasciare dopo l’ingresso (riduce la fuoriuscita).',
        'Ago o catetere da paracentesi aspirando; al liquido avanzare la cannula.',
        'Diagnostica (30–60 mL): neutrofili (≥250/mm³ = peritonite batterica spontanea), albumina con albumina sierica (gradiente ≥1,1 g/dL = ipertensione portale), proteine totali, colture nei flaconi da emocoltura al letto (10 mL per flacone), glucosio e LDH se sospetta secondaria.',
        'Evacuativa: collegare a sacca o vuoto; rimuovere tutto in una seduta se tollerato.',
        'Togliere, medicazione compressiva; se fuoriuscita, punto a borsa di tabacco.',
      ] },
      { titolo: 'Albumina (EASL)', righe: ['>5 L rimossi: albumina 20% 8 g per ogni litro (es. 8 L → 64 g = 320 mL di albumina 20%), metà durante e metà dopo.'] },
    ],
    fonte: 'EASL 2018 (ascite)',
  },
  {
    id: 'rachicentesi', nome: 'Rachicentesi', gruppo: 'Addome e SNC',
    sintesi: 'TC prima solo se indicata; L3–L4 o L4–L5; ago atraumatico; pressione di apertura in decubito laterale.',
    blocchi: [
      { titolo: 'TC encefalo prima se', righe: ['Immunodepressione, malattia del SNC nota, crisi nell’ultima settimana, papilledema, GCS <10 o alterato, deficit focali.', 'Se la TC ritarda: emocolture + desametasone + antibiotico prima.'] },
      { titolo: 'Controindicazioni', righe: ['Effetto massa o segni di erniazione, infezione cutanea nel sito, piastrine <40–50.000, INR >1,5, anticoagulanti (intervalli come per l’anestesia neurassiale).'] },
      { titolo: 'Passaggi', numerato: true, righe: [
        'Decubito laterale in posizione fetale (necessario per la pressione di apertura) o seduto; spalle e anche allineate, perpendicolari al letto.',
        'Linea intercrestale (creste iliache) = L4: pungere L3–L4 o L4–L5. Eco se difficile (obesità).',
        'Asepsi; lidocaina 1% sottocute e lungo il tragitto.',
        'Ago spinale 20–22 G, preferibilmente atraumatico (Sprotte/Whitacre, con introduttore): meno cefalea post-puntura. Ago tagliente: bisello parallelo alle fibre durali (rivolto di lato con paziente sul fianco).',
        'Avanzare sulla linea mediana diretti verso l’ombelico; due «scatti» (legamento giallo, dura); togliere spesso il mandrino per controllare.',
        'Al liquor: manometro, pressione di apertura a gambe distese (normale 6–20 cmH₂O, patologica >25).',
        'Raccolta: 4 provette da 1–2 mL (8–10 mL totali, di più se citologia/micobatteri): 1 chimica (glucosio con glicemia contemporanea, proteine, lattato); 2 Gram, coltura, PCR multiplex; 3 conta cellulare; 4 da conservare.',
        'Reintrodurre il mandrino prima di estrarre l’ago. Non serve riposo a letto.',
      ] },
      { titolo: 'Complicanze', righe: ['Cefalea post-puntura (ortostatica): idratazione, caffeina, analgesici; blood patch se persiste.', 'Puntura traumatica: cellule in calo dalla 1ª alla 4ª provetta; ematoma spinale (anticoagulati); erniazione.'] },
    ],
    fonte: 'IDSA 2004, ESCMID 2016',
  },
  // ─── Accessi ───
  {
    id: 'cvc', nome: 'Catetere venoso centrale (eco-guidato)', gruppo: 'Accessi',
    sintesi: 'Giugulare interna destra eco-guidata; barriera massima; guida sempre in mano; conferma prima di dilatare.',
    blocchi: [
      { titolo: 'Sede', righe: ['Giugulare interna destra: prima scelta in PS (eco facile, comprimibile). Femorale: in arresto o coagulopatia (più infezioni e trombosi). Succlavia/ascellare: meno infezioni, solo se esperti con eco.'] },
      { titolo: 'Passaggi', numerato: true, righe: [
        'Checklist; consenso; monitor ECG. Trendelenburg 10–15° (giugulare, succlavia).',
        'Eco preliminare: vena comprimibile, non pulsatile, pervia; arteria a fianco. Scegliere il punto con meno sovrapposizione.',
        'Barriera massima: cuffia, mascherina, camice e guanti sterili, telo grande; clorexidina 2% alcolica, lasciar asciugare 30 s; sonda in guaina sterile.',
        'Lidocaina 1% sottocute.',
        'Ago con siringa, aspirando, sotto eco in tempo reale (asse corto o lungo), punta sempre visibile.',
        'Sangue scuro non pulsatile: togliere la siringa, tappare il cono col dito.',
        'Guida a J dolcemente, 15–20 cm al massimo; extrasistoli → ritirare qualche cm.',
        'Togliere l’ago; CONFERMARE con l’eco la guida dentro la vena (asse corto e lungo) prima di dilatare.',
        'Piccola incisione sulla guida (lama verso l’alto); dilatatore solo fino alla profondità della vena; tenere sempre la guida.',
        'Catetere sulla guida finché la guida esce dalla via distale; avanzare il catetere fino alla profondità prevista; togliere la guida (verificare che sia intera).',
        'Aspirare e lavare ogni via con SF; tappare.',
        'Fissare (sutura o dispositivo senza sutura), medicazione trasparente con clorexidina.',
        'Conferma: eco (bolle di SF agitato in atrio destro entro 2 s; pneumotorace escluso) o Rx.',
      ] },
      { titolo: 'Profondità indicative', righe: ['Giugulare destra 15–16 cm, sinistra 17–18 cm; succlavia destra 16–17 cm, sinistra 18–19 cm; femorale tutto il catetere (20 cm).'] },
      { titolo: 'Se si incannula l’arteria', righe: ['Con ago: togliere e comprimere 10 min.', 'Con dilatatore o catetere: NON rimuovere; lasciare in sede e chiamare il chirurgo vascolare/radiologo interventista.'] },
    ],
    fonte: 'Linee guida ASA 2020 per l’accesso venoso centrale; WoCoVA',
  },
  {
    id: 'io', nome: 'Accesso intraosseo', gruppo: 'Accessi',
    sintesi: 'Tibia prossimale o omero; ago blu 25 mm (giallo 45 mm omero/obesi); lavaggio con 10 mL.',
    blocchi: [
      { titolo: 'Sedi', righe: [
        'Tibia prossimale: 2 cm sotto la tuberosità tibiale e 1–2 cm medialmente, sulla superficie piatta.',
        'Omero prossimale: braccio addotto, mano sull’ombelico; grande tuberosità, ago a 45° in direzione postero-mediale. Flussi più alti.',
        'Controindicazioni: frattura dell’osso, protesi, infezione locale, tentativo IO nelle 48 h sullo stesso osso.',
      ] },
      { titolo: 'Passaggi', numerato: true, righe: [
        'Ago: almeno una tacca nera visibile fuori dalla cute dopo aver toccato l’osso (altrimenti ago più lungo).',
        'Disinfezione; ago perpendicolare all’osso (45° nell’omero).',
        'Trapano fino alla perdita di resistenza; non premere troppo.',
        'Togliere lo stiletto; prolunga già lavata.',
        'Paziente cosciente: lidocaina 2% senza conservanti 40 mg in 2 min, attendere 60 s.',
        'Lavaggio rapido con 10 mL di SF (senza lavaggio il flusso è scarso); se cosciente, poi altri 20 mg di lidocaina in 60 s.',
        'Infondere sotto pressione (spremisacca a 300 mmHg); fissare.',
        'Rimuovere entro 24 h.',
      ] },
    ],
    fonte: 'Indicazioni del produttore (EZ-IO), ERC 2025',
  },
  {
    id: 'pacing', nome: 'Pacing transcutaneo', gruppo: 'Accessi',
    sintesi: 'Piastre antero-posteriori, frequenza 70, energia in salita fino a cattura, +10 mA.',
    blocchi: [
      { titolo: 'Passaggi', numerato: true, righe: [
        'Bradicardia instabile non responsiva ad atropina 1 mg ev (ripetibile fino a 3 mg) o adrenalina 2–10 µg/min.',
        'Piastre: anteriore sul precordio (sinistra dello sterno), posteriore tra le scapole a sinistra; elettrodi ECG del defibrillatore collegati.',
        'Analgesia/sedazione: fentanil 25–50 µg ev ± midazolam 1–2 mg ev.',
        'Modalità demand, frequenza 60–70/min.',
        'Aumentare la corrente da 0 mA a passi di 5–10 mA fino alla cattura elettrica (QRS largo dopo ogni spike).',
        'Verificare la cattura meccanica: polso femorale o eco (non il carotideo, alterato dalle contrazioni muscolari).',
        'Impostare 10 mA sopra la soglia di cattura.',
        'Ponte verso il pacing transvenoso.',
      ] },
    ],
    fonte: 'ERC 2025',
  },
]

export const SEDAZIONE: Scheda[] = [
  {
    id: 'farmaci-sed', nome: 'Farmaci: confezioni e diluizioni', gruppo: 'Riferimento',
    sintesi: 'Come preparare le siringhe dei farmaci usati nelle schede.',
    blocchi: [
      { titolo: 'Ipnotici e sedativi', righe: [
        'Ketamina fl 50 mg/mL (10 mL = 500 mg): per i boli diluire 200 mg in 20 mL → 10 mg/mL.',
        'Propofol 1% = 10 mg/mL (fiale da 20 mL, flaconi da 50–100 mL), pronto all’uso.',
        'Etomidate fl 20 mg/10 mL = 2 mg/mL, pronto all’uso.',
        'Midazolam fl 15 mg/3 mL o 5 mg/1 mL: diluire 5 mg in 5 mL → 1 mg/mL.',
        'Dexmedetomidina fl 200 µg/2 mL: diluire in 50 mL di SF → 4 µg/mL.',
      ] },
      { titolo: 'Oppioidi', righe: [
        'Fentanil fl 100 µg/2 mL = 50 µg/mL: boli diretti, o 100 µg in 10 mL → 10 µg/mL per titolare.',
        'Morfina fl 10 mg/1 mL: diluire in 10 mL → 1 mg/mL.',
      ] },
      { titolo: 'Curari e antagonisti', righe: [
        'Rocuronio fl 50 mg/5 mL = 10 mg/mL.',
        'Succinilcolina fl 100 mg/2 mL = 50 mg/mL (in frigorifero).',
        'Sugammadex fl 200 mg/2 mL e 500 mg/5 mL = 100 mg/mL.',
        'Naloxone fl 0,4 mg/1 mL: diluire in 10 mL → 0,04 mg/mL.',
        'Flumazenil fl 0,5 mg/5 mL e 1 mg/10 mL = 0,1 mg/mL.',
      ] },
      { titolo: 'Vasopressori «push-dose»', righe: [
        'Adrenalina 10 µg/mL: 1 mg (1 mL di 1 mg/mL) in 100 mL di SF; poi siringa da 10 mL. Boli da 0,5–2 mL (5–20 µg).',
        'Noradrenalina in infusione: 4 mg in 50 mL (80 µg/mL), da 0,05 µg/kg/min.',
      ] },
    ],
  },
  {
    id: 'procedurale', nome: 'Sedazione procedurale (PSA)', gruppo: 'Schemi',
    sintesi: 'Ketamina, propofol o ketofol; capnografia; due operatori; antidoti pronti.',
    blocchi: [
      { titolo: 'Prima', righe: [
        'Valutazione: ASA, vie aeree (difficili? apnee notturne? obesità?), ultima assunzione (il digiuno non è un requisito per rimandare in urgenza, ACEP).',
        'Due operatori: uno fa la procedura, uno solo per la sedazione. Monitor SpO₂, PA, ECG, capnografia; O₂; aspiratore; pallone-maschera; antidoti.',
      ] },
      { titolo: 'Ketamina (dissociativa: riduzioni, ascessi, ustioni, bambini)', righe: [
        'Ev 1–1,5 mg/kg in 30–60 s; supplementi 0,5 mg/kg ogni 5–10 min.',
        'Im 4–5 mg/kg (se niente accesso venoso).',
        'Laringospasmo raro: ventilare con pressione positiva; se persiste succinilcolina.',
        'Agitazione al risveglio negli adulti: midazolam 1–2 mg ev se necessario (non di routine). Vomito: ondansetron 4 mg ev.',
        'Evitare: schizofrenia attiva, ipertensione grave, SCA, età <3 mesi.',
      ] },
      { titolo: 'Propofol (breve: cardioversione, lussazione di spalla)', righe: [
        'Ev 0,5–1 mg/kg, poi 0,25–0,5 mg/kg ogni 1–3 min fino all’effetto.',
        'Anziano o fragile: 0,25–0,5 mg/kg, lentamente.',
        'Ipotensione e apnea dose-dipendenti; nessuna analgesia (aggiungere fentanil 0,5–1 µg/kg per procedure dolorose).',
      ] },
      { titolo: 'Ketofol', righe: ['Ketamina e propofol 1:1: 0,5 mg/kg di ciascuno ev (siringhe separate o miscela 10 mg/mL + 10 mg/mL); supplementi 0,25 mg/kg di ciascuno. Meno ipotensione del propofol, meno vomito della ketamina.'] },
      { titolo: 'Etomidate (paziente instabile)', righe: ['Ev 0,1–0,15 mg/kg, supplementi 0,05 mg/kg. Mioclonie frequenti.'] },
      { titolo: 'Midazolam + fentanil (procedure minori, ansiolisi)', righe: ['Fentanil 0,5–1 µg/kg ev, poi midazolam 0,02–0,05 mg/kg ev (1–2 mg nell’adulto), titolati ogni 2–3 min. Depressione respiratoria sinergica: dosi ridotte negli anziani.'] },
      { titolo: 'Antidoti', righe: [
        'Naloxone 0,04–0,1 mg ev ogni 2 min (fino a 0,4 mg); durata breve, osservare.',
        'Flumazenil 0,2 mg ev, ripetibile ogni minuto fino a 1 mg; non in uso cronico di benzodiazepine o epilessia (crisi).',
      ] },
      { titolo: 'Dimissione', righe: ['Ritorno allo stato mentale di base, parametri stabili, almeno 30 min dopo l’ultima dose (di più dopo antidoti), accompagnatore; niente guida per 12–24 h.'] },
    ],
    fonte: 'ACEP Clinical Policy 2014; ICEM/SIMEU',
  },
  {
    id: 'agitato', nome: 'Paziente agitato', gruppo: 'Schemi',
    sintesi: 'De-escalation, poi per via orale se collabora; im se pericoloso; ketamina se estrema.',
    blocchi: [
      { titolo: 'Sempre', righe: [
        'De-escalation verbale; escludere glicemia, ipossia, intossicazione, astinenza, trauma cranico, infezione, ritenzione urinaria, dolore.',
        'Dopo la sedazione: monitor SpO₂ e ECG (QT con antipsicotici), contenzione fisica il meno possibile e mai senza sedazione.',
      ] },
      { titolo: 'Lieve, collabora (per bocca)', righe: [
        'Olanzapina 5–10 mg os (orodispersibile).',
        'Oppure lorazepam 1–2 mg os/sublinguale (se astinenza o intossicazione da stimolanti).',
        'Psicosi nota: aloperidolo 5 mg os + lorazepam 1–2 mg os.',
      ] },
      { titolo: 'Moderata–grave, non collabora (im)', righe: [
        'Aloperidolo 5 mg + midazolam 5 mg im (o lorazepam 2 mg im).',
        'Oppure olanzapina 10 mg im (non entro 1 h da benzodiazepine parenterali: depressione respiratoria).',
        'Oppure midazolam 5–10 mg im (intossicazione da stimolanti, astinenza alcolica).',
        'Ripetibile dopo 15–30 min.',
      ] },
      { titolo: 'Estrema, pericolosa (delirium iperattivo, eccitato)', righe: [
        'Ketamina 4–5 mg/kg im (es. 300–400 mg) o 1–2 mg/kg ev: effetto in 2–5 min.',
        'Poi monitor completo, capnografia, pronti a gestire vie aeree; controllare temperatura, CK, potassio.',
      ] },
      { titolo: 'Situazioni particolari', righe: [
        'Astinenza alcolica: benzodiazepine (diazepam 10–20 mg ev ogni 5–10 min fino al controllo, o lorazepam 2–4 mg ev); tiamina 200–500 mg ev prima del glucosio.',
        'Anziano con delirium: aloperidolo 0,5–1 mg os/im, ripetibile; evitare benzodiazepine (salvo astinenza).',
        'Parkinson o demenza a corpi di Lewy: niente aloperidolo; quetiapina 12,5–25 mg os o lorazepam a basse dosi.',
        'QT >500 ms: evitare aloperidolo e olanzapina im; preferire benzodiazepine.',
      ] },
    ],
    fonte: 'Project BETA (American Association for Emergency Psychiatry); NICE NG10',
  },
  {
    id: 'intubazione', nome: 'Sedoanalgesia per intubazione', gruppo: 'Schemi',
    sintesi: 'Induttore secondo l’emodinamica + rocuronio 1,2 mg/kg; sedazione subito dopo.',
    blocchi: [
      { titolo: 'Induttore (mg/kg di peso reale; nell’obeso peso magro; in shock dose ridotta)', righe: [
        'Ketamina 1–2 mg/kg ev (shock 0,5–1 mg/kg): prima scelta nell’instabile e nel broncospasmo.',
        'Etomidate 0,3 mg/kg ev (shock 0,15 mg/kg): neutro sull’emodinamica; soppressione surrenalica transitoria.',
        'Propofol 1–2 mg/kg ev (0,5–1 nell’anziano): solo se emodinamica stabile; utile in stato di male epilettico.',
        'Midazolam 0,1–0,3 mg/kg ev: induzione lenta e ipotensione, ultima scelta.',
      ] },
      { titolo: 'Curaro', righe: [
        'Rocuronio 1,2 mg/kg ev (peso reale; 1,6 mg/kg in shock): condizioni in 45–60 s, durata 45–60 min. Antagonista: sugammadex 16 mg/kg ev subito.',
        'Succinilcolina 1,5 mg/kg ev (peso reale): 45 s, durata 8–10 min. Controindicata: iperkaliemia nota o sospetta (IRC, rabdomiolisi), ustioni o schiacciamento >24 h, malattie neuromuscolari, immobilizzazione prolungata, ipertermia maligna.',
      ] },
      { titolo: 'Aggiunte', righe: [
        'Fentanil 1–3 µg/kg ev 3 min prima, se serve attenuare la risposta pressoria (emorragia cerebrale, dissezione aortica, SCA); NON nello shock.',
        'Shock: vasopressore pronto o già in corso; adrenalina 10–20 µg in bolo se crolla.',
      ] },
      { titolo: 'Senza curaro: intubazione da sveglio / sequenza ritardata', righe: [
        'Intubazione a sequenza ritardata (paziente agitato che non tollera la preossigenazione): ketamina 1 mg/kg ev (poi 0,5 mg/kg se serve) → preossigenazione 3 min con NIV o reservoir → curaro → intubazione.',
        'Fibroscopia o videolaringoscopia da sveglio (via aerea difficile prevista): anestesia topica (lidocaina 4% spray, massimo 9 mg/kg) + sedazione leggera: ketamina 0,25–0,5 mg/kg ev o dexmedetomidina 0,5–1 µg/kg in 10 min; respiro spontaneo conservato.',
      ] },
      { titolo: 'Dopo l’intubazione (prima l’analgesia)', righe: [
        'Fentanil 0,5–2 µg/kg/h (25–150 µg/h) ev in infusione.',
        '+ propofol 1–3 mg/kg/h ev (attenzione PA e trigliceridi oltre 48 h), oppure midazolam 0,02–0,1 mg/kg/h ev, oppure ketamina 0,5–2 mg/kg/h ev se instabile.',
        'Iniziare entro 10 min dall’intubazione se si è usato il rocuronio (paziente paralizzato ma sveglio).',
        'Obiettivo RASS da −2 a 0 (più profondo se ARDS grave, ipertensione endocranica, stato di male).',
      ] },
    ],
    fonte: 'Linee guida DAS/ICS 2018 per l’intubazione del critico; SIAARTI',
  },
  {
    id: 'palliativa', nome: 'Sedazione palliativa (fine vita)', gruppo: 'Schemi',
    sintesi: 'Sintomo refrattario + morte attesa in ore-giorni; midazolam sc/ev titolato; continuare l’oppioide.',
    blocchi: [
      { titolo: 'Condizioni', righe: [
        'Sintomo refrattario (dispnea, delirium, dolore, emorragia massiva, distress) non controllabile con altri mezzi, prognosi di ore-giorni.',
        'Decisione condivisa con paziente (se possibile) e familiari; documentare in cartella indicazione, consenso, farmaci, monitoraggio (Legge 219/2017).',
        'Continuare l’oppioide in corso: la sedazione non lo sostituisce.',
      ] },
      { titolo: 'Midazolam (prima scelta)', numerato: true, righe: [
        'Bolo 2,5–5 mg sc o ev (1–2,5 mg se anziano o fragile; 5–10 mg se già in benzodiazepine).',
        'Ripetere ogni 5 min (ev) o 20 min (sc) fino al livello di sedazione desiderato.',
        'Infusione continua: dose dei boli serviti nelle prime ore ripartita sulle 24 h; di solito 0,5–1 mg/h sc o ev, aumentando del 25–50% se necessario (abituale fino a 2–5 mg/h; oltre 20 mg/h raramente utile).',
        'Obiettivo: comfort, scala di Ramsay 4–5 o RASS da −2 a −4, rivalutare ogni ora all’inizio.',
      ] },
      { titolo: 'Se il midazolam non basta', righe: [
        'Aggiungere clorpromazina 12,5–25 mg ev ogni 4–8 h (o levomepromazina 12,5–25 mg sc, poi 50–100 mg/24 h).',
        'Delirium terminale: aloperidolo 2,5–5 mg sc/ev, poi 5–15 mg/24 h.',
        'Ultima linea (ambiente ospedaliero, esperti): propofol 0,5–1 mg/kg/h ev.',
      ] },
      { titolo: 'Sintomi associati', righe: [
        'Dispnea/dolore: morfina 2–5 mg ev/sc al bisogno (se naïve); infusione 0,5–1 mg/h; se già in oppioide aumentare del 25–50%.',
        'Rantolo terminale: butilscopolamina 20 mg sc ogni 6–8 h (o 60–120 mg/24 h in infusione); riposizionare, ridurre i liquidi.',
        'Emorragia massiva: midazolam 5–10 mg ev/sc in bolo, teli scuri.',
        'Sospendere farmaci ed esami inutili; idratazione solo se utile al comfort.',
      ] },
    ],
    fonte: 'EAPC 2023; SICP-SIAARTI «Sedazione palliativa nell’adulto»',
  },
]

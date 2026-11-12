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
  /** scheda d'urgenza: bordo rosso e etichetta */
  urgente?: boolean
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
        'Farmaci aspirati ed etichettati: induttore, curaro, vasopressore (noradrenalina in infusione o adrenalina 10 µg/mL per boli: 1 fiala da 1 mg in 100 mL di SF), sedazione post-intubazione.',
      ] },
      { titolo: 'Sequenza', numerato: true, righe: [
        'Posizione: orecchio allineato allo sterno (rampa se obeso), testa sollevata di 20–30° se possibile.',
        'Preossigenazione 3 min con FiO₂ ~100%: reservoir a flusso massimo («flush») o NIV/CPAP se ipossiemico; obiettivo ETO₂ >85%.',
        'Ossigenazione apneica: cannula nasale a 15 L/min lasciata in sede per tutta la procedura.',
        'Ottimizzare: shock index >0,8 o PAS <90 → liquidi e/o noradrenalina prima dell’induzione; ridurre la dose di induttore.',
        'Induzione + curaro in rapida successione. Per 70 kg: ketamina 100 mg = 1 fiala da 100 mg/2 mL (shock 50 mg = mezza fiala), poi rocuronio 85 mg = 8,5 mL (1 fiala da 50 mg + 3,5 mL della seconda). Dettagli nella scheda «Sedoanalgesia per intubazione» in Sedazione.',
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
        'Lidocaina 1% (fiala da 100 mg in 10 mL; massimo 2 fiale = 20 mL = 200 mg; 3 mg/kg): pomfo, poi in profondità sopra il margine superiore della costa inferiore, aspirando: il liquido conferma la profondità.',
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
        'Paziente a 30–45°; monitor ECG; atropina 0,5–1 mg pronta (1–2 fiale da 0,5 mg) per la reazione vagale. Asepsi.',
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
        'Paziente cosciente: lidocaina 2% senza conservanti 40 mg = 2 mL (1/5 della fiala da 200 mg/10 mL) in 2 min, attendere 60 s.',
        'Lavaggio rapido con 10 mL di SF (senza lavaggio il flusso è scarso); se cosciente, poi altri 20 mg = 1 mL di lidocaina in 60 s.',
        'Infondere sotto pressione (spremisacca a 300 mmHg); fissare.',
        'Rimuovere entro 24 h.',
      ] },
    ],
    fonte: 'Indicazioni del produttore (EZ-IO), ERC 2025',
  },
  {
    id: 'pacing', nome: 'Pacing transcutaneo', gruppo: 'Terapia elettrica',
    sintesi: 'Piastre antero-posteriori, frequenza 70, energia in salita fino a cattura, +10 mA.',
    blocchi: [
      { titolo: 'Passaggi', numerato: true, righe: [
        'Bradicardia instabile non responsiva ad atropina 0,5 mg ev = 1 fiala (ripetibile ogni 3–5 min fino a 3 mg = 6 fiale), isoprenalina o adrenalina 2–10 µg/min.',
        'Piastre: anteriore sul precordio (sinistra dello sterno), posteriore tra le scapole a sinistra; elettrodi ECG del defibrillatore collegati.',
        'Analgesia/sedazione: fentanil 25–50 µg ev = 1/4–1/2 fiala da 100 µg (0,5–1 mL) ± midazolam 1–2 mg ev (1–2 mL di 1 fiala da 5 mg diluita a 5 mL).',
        'Modalità demand, frequenza 60–70/min.',
        'Aumentare la corrente da 0 mA a passi di 5–10 mA fino alla cattura elettrica (QRS largo dopo ogni spike).',
        'Verificare la cattura meccanica: polso femorale o eco (non il carotideo, alterato dalle contrazioni muscolari).',
        'Impostare 10 mA sopra la soglia di cattura.',
        'Ponte verso il pacing transvenoso.',
      ] },
      { titolo: 'Comandi sui nostri apparecchi', righe: [
        'TEC-5600: manopola PACING DEMAND → FREQUENZA ▲▼ → START/STOP → CORRENTE ▲.',
        'TEC-5531K: solo con placche adesive; manopola STIMOLAZIONE DEMAND → FREQUENZA → START/STOP → CORRENTE.',
        'DFM100: manopola Pacer → «Impostazioni pacer» (frequenza, corrente) → «Avvia pacing».',
        'Dettagli e disegni nelle schede dei singoli defibrillatori.',
      ] },
    ],
    fonte: 'ERC 2025; manuali Nihon Kohden e Philips',
  },
  // ─── Blocchi nervosi ecoguidati ───
  {
    id: 'last', nome: 'LAST: tossicità da anestetici locali', gruppo: 'Blocchi nervosi ecoguidati', urgente: true,
    sintesi: 'Stop iniezione, aiuto, ossigeno; convulsioni: midazolam; Intralipid 20% 100 mL in bolo poi 1.000 mL/h; RCP prolungata.',
    blocchi: [
      { titolo: 'Riconoscere', righe: [
        'Sintomi precoci: sapore metallico, formicolio intorno alla bocca, acufeni, vertigini, agitazione o sopore.',
        'Poi: convulsioni, coma; bradicardia, ipotensione, aritmie (anche FV), arresto. Può comparire subito o fino a 30–60 min dopo il blocco.',
      ] },
      { titolo: 'Cosa fare subito', numerato: true, righe: [
        'Sospendere l’iniezione, chiamare aiuto (rianimatore), monitor completo.',
        'Vie aeree: ossigeno 100%, ventilare se serve; evitare ipossia, ipercapnia e acidosi (peggiorano la tossicità).',
        'Convulsioni: midazolam (Ipnovel) 2–5 mg ev; evitare il propofol se il circolo è instabile.',
        'Emulsione lipidica 20% (Intralipid) per 70 kg: bolo 100 mL (1,5 mL/kg) in 2–3 min, poi infusione 0,25 mL/kg/min = circa 1.000 mL/h (17,5 mL/min).',
        'Se resta instabile: ripetere il bolo fino a 2 volte (a 5 min di distanza) e raddoppiare l’infusione (0,5 mL/kg/min). Dose massima totale 12 mL/kg (circa 840 mL nei primi 30 min).',
        'Proseguire l’infusione almeno 10 min dopo la stabilizzazione.',
        'Arresto: ALS con RCP prolungata (anche oltre 1 h); adrenalina a dosi ridotte (≤ 1 µg/kg = 70 µg a bolo); evitare lidocaina, beta-bloccanti, calcio-antagonisti e vasopressina; considerare ECMO.',
        'Osservazione in area monitorata per almeno 4–6 h (12 h se ci sono stati segni cardiovascolari).',
      ] },
      { titolo: 'Prevenire', righe: [
        'Ropivacaina entro la dose massima (3 mg/kg); ridurre nell’anziano e nei fragili.',
        'Ecoguida, aspirazione prima di ogni iniezione, boli da 3–5 mL guardando la diffusione, paziente sveglio e monitorato.',
        'Intralipid 20% e kit LAST pronti dove si fanno i blocchi.',
      ] },
    ],
    fonte: 'ASRA 2020 (Neal et al., checklist LAST); AAGBI 2010/2020',
  },
  {
    id: 'ropivacaina', nome: 'Ropivacaina: dosi e preparazione', gruppo: 'Blocchi nervosi ecoguidati',
    sintesi: 'Unico anestetico per i blocchi: max 3 mg/kg (≈ 200 mg a 70 kg); 0,375% per 30–40 mL.',
    blocchi: [
      { titolo: 'Dose massima (70 kg)', righe: [
        'Ropivacaina (Naropina): 3 mg/kg = 210 mg; nell’anziano o fragile non oltre 150 mg. Più blocchi insieme: le dosi si sommano.',
        'Fiale da 7,5 mg/mL (10 mL = 75 mg) e da 10 mg/mL; sacche da 2 mg/mL (100–200 mL).',
      ] },
      { titolo: 'Preparazioni pronte', righe: [
        '0,375% (3,75 mg/mL): 2 fiale da 7,5 mg/mL (20 mL) + 20 mL di SF = 40 mL = 150 mg. Va bene per fascia iliaca, ESP, serrato.',
        '0,25% (2,5 mg/mL): 2 fiale da 7,5 mg/mL (20 mL) + 40 mL di SF = 60 mL = 150 mg; usarne 30–40 mL. Per volumi grandi (soprainguinale) o bilaterale.',
        '0,2%: sacca pronta da 2 mg/mL; 40 mL = 80 mg.',
        'Effetto in 15–30 min, durata 8–12 h. Annotare in cartella ora, farmaco, concentrazione e volume.',
      ] },
      { titolo: 'Prima di iniziare', righe: [
        'Monitor (ECG, SpO₂, PA), accesso venoso, Intralipid 20% e materiale per le vie aeree pronti: vedi scheda «LAST».',
        'Consenso; anticoagulati: fascia iliaca e serrato di solito accettabili (compressibili), ESP considerato a basso rischio ma da valutare.',
      ] },
    ],
    fonte: 'Scheda tecnica Naropina; ASRA 2020',
  },
  {
    id: 'fascia-iliaca', nome: 'Blocco della fascia iliaca infrainguinale', gruppo: 'Blocchi nervosi ecoguidati',
    sintesi: 'Frattura di femore: sonda trasversale sotto il legamento, ago sotto la fascia iliaca; 30–40 mL di ropivacaina 0,2–0,375%.',
    blocchi: [
      { titolo: 'Indicazioni', righe: [
        'Frattura del collo o della diafisi del femore (raccomandato in PS dalle linee guida sulla frattura di femore), dolore all’anca o alla coscia.',
        'Copre soprattutto il nervo femorale; il cutaneo laterale e l’otturatorio in modo variabile.',
      ] },
      { titolo: 'Passaggi', numerato: true, righe: [
        'Supino; disinfezione; sonda lineare trasversale sotto il legamento inguinale, si individua l’arteria femorale e si scorre lateralmente fino al terzo laterale.',
        'Identificare fascia lata, fascia iliaca (linea iperecogena sopra l’ileopsoas) e sartorio.',
        'Ago da blocco (80–100 mm) in piano da laterale a mediale, fino sotto la fascia iliaca.',
        'Iniettare a piccoli boli dopo aspirazione: l’anestetico deve scollare la fascia dal muscolo e diffondersi verso il nervo femorale e lateralmente.',
        'Dose: 30–40 mL di ropivacaina (Naropina) 0,375% (2 fiale da 7,5 mg/mL + 20 mL di SF = 40 mL = 150 mg). Segni di tossicità: scheda «LAST».',
        'Effetto in 15–30 min; durata 8–12 h. Annotare ora e dose in cartella.',
      ] },
    ],
    fonte: 'NYSORA; AAGBI/BOA 2020 (fratture di femore)',
  },
  {
    id: 'fascia-iliaca-sopra', nome: 'Blocco della fascia iliaca soprainguinale', gruppo: 'Blocchi nervosi ecoguidati',
    sintesi: 'Più prossimale: diffusione craniale verso il plesso lombare; 40 mL di ropivacaina 0,2–0,25%.',
    blocchi: [
      { titolo: 'Indicazioni', righe: [
        'Frattura di femore prossimale e anca: copre in modo più affidabile femorale e cutaneo laterale della coscia rispetto all’infrainguinale.',
      ] },
      { titolo: 'Passaggi', numerato: true, righe: [
        'Supino; sonda lineare parasagittale appena medialmente alla SIAS, sopra il legamento inguinale, ruotata verso l’ombelico.',
        'Cercare l’immagine a «papillon»: sartorio (caudale) e obliquo interno (craniale) che si incontrano; sotto, la fascia iliaca e il muscolo iliaco; l’arteria circonflessa iliaca profonda come repere.',
        'Ago in piano da caudale a craniale, sotto la fascia iliaca sopra il muscolo iliaco.',
        'Iniettare: la fascia si solleva e l’anestetico scorre cranialmente sotto l’obliquo interno.',
        'Dose: 40 mL di ropivacaina (Naropina) 0,2–0,25% (80–100 mg). Segni di tossicità: scheda «LAST».',
      ] },
    ],
    fonte: 'NYSORA; Hebbard 2011',
  },
  {
    id: 'esp', nome: 'Blocco del piano dell’erettore della spina (ESP)', gruppo: 'Blocchi nervosi ecoguidati',
    sintesi: 'Fratture costali posteriori e laterali, dolore toracico o lombare: 20–30 mL sul processo trasverso.',
    blocchi: [
      { titolo: 'Indicazioni', righe: [
        'Fratture costali multiple (anche posteriori), herpes zoster toracico, dolore lombare acuto, drenaggio toracico.',
        'Effetto su più metameri (di solito 3–6) dal livello dell’iniezione; meno potente di un’epidurale ma molto sicuro.',
      ] },
      { titolo: 'Passaggi', numerato: true, righe: [
        'Seduto o sul fianco; contare le vertebre (T4–T5 per le coste medie, livello della frattura centrale).',
        'Sonda lineare (o convex se obeso) parasagittale a 3 cm dalla linea mediana: si vedono i processi trasversi «a dente» e sopra il muscolo erettore.',
        'Ago in piano da craniale a caudale fino a toccare il processo trasverso.',
        'Iniettare 2–3 mL di prova: l’anestetico deve sollevare l’erettore e stendersi in senso craniocaudale.',
        'Dose: 20–30 mL di ropivacaina (Naropina) 0,25–0,375% per lato (bilaterale: rispettare la dose massima totale). Segni di tossicità: scheda «LAST».',
      ] },
    ],
    fonte: 'NYSORA; Forero 2016',
  },
  {
    id: 'serrato', nome: 'Blocco del piano del serrato anteriore', gruppo: 'Blocchi nervosi ecoguidati',
    sintesi: 'Fratture costali antero-laterali e drenaggio toracico: 20–30 mL sopra o sotto il serrato, ascellare media.',
    blocchi: [
      { titolo: 'Indicazioni', righe: [
        'Fratture costali laterali e anteriori, posizionamento di drenaggio toracico, dolore della parete toracica laterale.',
        'Non copre bene le coste posteriori (per quelle: ESP).',
      ] },
      { titolo: 'Passaggi', numerato: true, righe: [
        'Supino o sul fianco con il braccio abdotto; sonda lineare sulla linea ascellare media, 4ª–5ª costa.',
        'Identificare gran dorsale (in alto, posteriore), serrato anteriore, costa e pleura.',
        'Ago in piano verso la costa: iniezione sopra il serrato (tra gran dorsale e serrato) o sotto il serrato (sulla costa, più semplice).',
        'Dose: 20–30 mL di ropivacaina (Naropina) 0,25–0,375%. Segni di tossicità: scheda «LAST».',
        'Attenzione alla pleura: vedere sempre la punta dell’ago; dopo, controllare la SpO₂ e l’eco polmonare.',
      ] },
    ],
    fonte: 'NYSORA; Blanco 2013',
  },
  {
    id: 'cve', nome: 'Cardioversione elettrica sincronizzata', gruppo: 'Terapia elettrica',
    sintesi: 'Sedazione, placche, SYNC verificato prima di ogni shock; FA all’energia massima, flutter/TPSV 70–120 J, TV 120–150 J.',
    blocchi: [
      { titolo: 'Prima', righe: [
        'Urgente se instabile (shock, sincope, ischemia, scompenso): non aspettare digiuno né anticoagulazione.',
        'Elettiva per FA/flutter: durata < 24 h, oppure anticoagulante efficace da ≥ 3 settimane, oppure ecocardiogramma transesofageo che esclude trombi (ESC 2024). Eparina o DOAC prima, se non già in terapia.',
        'Potassio e magnesio nella norma; escludere intossicazione digitalica. Digiuno se possibile, consenso, monitor, SpO₂, capnografia, accesso venoso, aspiratore e pallone pronti.',
        'Pacemaker/ICD: placche ad almeno 8 cm dal generatore, preferire antero-posteriori; controllo del dispositivo dopo.',
      ] },
      { titolo: 'Passaggi', numerato: true, righe: [
        'Placche antero-laterali (sottoclaveare destra + apice) o antero-posteriori; cute asciutta, rasata se serve.',
        'Sedazione procedurale: propofol 0,5–1 mg/kg = 35–70 mg (3,5–7 mL di 1%) a boli lenti; con ipotensione dosi ridotte o ketamina 0,5–1 mg/kg (35–70 mg). Vedi scheda «Sedazione procedurale».',
        'Premere SINC (TEC-5600/5531K) o Sync (DFM100, si illumina di blu) e verificare i marcatori su ogni onda R; se non compaiono, cambiare derivazione o aumentare l’ampiezza.',
        'Energia (bifasico): FA all’energia massima (TEC 270 J, DFM100 200 J); flutter e TPSV 70–120 J; TV monomorfa con polso 120–150 J, poi a salire (tabella nella scheda «Defibrillazione»).',
        '«Tutti lontani, ossigeno via», tenere premuto il pulsante finché lo shock parte (il ritardo è normale).',
        'Controllare ritmo e polso; se serve ripetere: riattivare SYNC (molti defibrillatori lo tolgono dopo lo shock), al massimo 3 tentativi.',
        'Fallimento in instabile: amiodarone 300 mg in 10–20 min e ritentare. TV polimorfa o FV: defibrillazione NON sincronizzata.',
      ] },
      { titolo: 'Dopo', righe: [
        'ECG a 12 derivazioni, monitor fino al risveglio completo (almeno 1–2 h), PA e saturazione.',
        'FA/flutter: anticoagulante per almeno 4 settimane dopo la cardioversione, poi secondo CHA₂DS₂-VA.',
        'Ustioni cutanee lievi possibili: crema idratante.',
      ] },
    ],
    fonte: 'ERC 2025; ESC 2024 (fibrillazione atriale)',
  },
  // ─── Terapia elettrica (nostri defibrillatori) ───
  {
    id: 'defibrillazione', nome: 'Defibrillazione (FV/TV senza polso)', gruppo: 'Terapia elettrica',
    sintesi: 'Shock NON sincronizzato 150 J, poi a salire; carica durante le compressioni, pausa < 5 s, RCP subito dopo lo shock.',
    blocchi: [
      { titolo: 'Sequenza', numerato: true, righe: [
        'RCP in corso; placche adesive antero-laterali (sottoclaveare destra + apice sulla linea ascellare media) o antero-posteriori. Piastre solo se mancano le placche.',
        'Manopola sull’energia: 150 J (vedi tabella per il secondo shock e i successivi).',
        'CARICA mentre si continuano le compressioni.',
        'Pausa breve (< 5 s) per leggere il ritmo: se FV/TV senza polso → «tutti lontani, ossigeno via» → SCARICA.',
        'Riprendere subito le compressioni per 2 minuti, senza controllare il polso.',
        'Ritmo non defibrillabile con energia carica: annullare la carica (TEC-5600 manopola su DISARMA, TEC-5531K su AZZERA, DFM100 tasto «Annulla carica»).',
      ] },
      { titolo: 'Energie e FV refrattaria', righe: [
        'Primo shock 150 J; i successivi a salire se l’apparecchio lo consente (TEC 200 → 270 J; DFM100 170 → 200 J).',
        'Arresto testimoniato al monitor con FV/TV: fino a 3 shock in rapida sequenza, poi RCP.',
        'FV refrattaria (≥ 3 shock): cambiare vettore portando le placche in antero-posteriore; amiodarone 300 mg ev dopo il 3° shock, 150 mg dopo il 5°.',
      ] },
      { titolo: 'Comandi rapidi', righe: [
        'TEC-5600: manopola su 150 → 2 CARICA → 3 SCARICA (o i due pulsanti delle piastre insieme).',
        'TEC-5531K: manopola su 150 → 2 CARICA (o sulla piastra) → premere INSIEME i pulsanti di scarica delle due piastre.',
        'DFM100: manopola su 150 → 2 Carica (giallo) → 3 Scarica (arancio).',
      ] },
      { titolo: 'DAE e bambini', righe: [
        'Modalità DAE: manopola su DAE (TEC) o AED (DFM100) e seguire i messaggi vocali.',
        'Bambino: TEC-5600 tenere premuto DAE PEDIATRICA e girare su DAE; DFM100 tasto categoria paziente (icona adulto/bambino) a sinistra dello schermo. In manuale 4 J/kg.',
      ] },
      { titolo: 'Sicurezza', righe: [
        'Ossigeno ad almeno 1 m durante la scarica; torace asciutto; rimuovere cerotti di nitroglicerina; placche ad almeno 8 cm da pacemaker/ICD.',
      ] },
    ],
    fonte: 'ERC 2025; manuali Nihon Kohden TEC-5600/TEC-5500 e Philips Efficia DFM100',
  },
  {
    id: 'nk-5600', nome: 'Nihon Kohden TEC-5600 (con pacing): comandi', gruppo: 'Terapia elettrica',
    sintesi: 'Manopola unica per energia, DAE, monitor e pacing; tasti 2 CARICA e 3 SCARICA sul pannello, SINC in alto, pacing a sinistra.',
    blocchi: [
      { titolo: 'Defibrillazione', numerato: true, righe: [
        'Collegare le placche (o usare le piastre).',
        'Manopola sull’energia (150 J segnato in arancio).',
        '2 CARICA/DAE (o il tasto di carica sulla piastra); segnale acustico a carica completata.',
        '3 SCARICA (lampeggia quando è carico) oppure i pulsanti delle due piastre premuti insieme.',
        'Annullare la carica: manopola su DISARMA.',
      ] },
      { titolo: 'Cardioversione', numerato: true, righe: [
        'Elettrodi ECG collegati (traccia più pulita) e placche.',
        'Manopola sull’energia (vedi tabella in «Defibrillazione»).',
        'Premere SINC: compare SYNC sullo schermo e un marcatore su ogni onda R. Se manca, cambiare derivazione o aumentare l’ampiezza.',
        '2 CARICA, poi tenere premuto 3 SCARICA finché lo shock parte (attende l’onda R).',
        'Prima di un nuovo shock controllare che SYNC sia ancora attivo.',
      ] },
      { titolo: 'Pacing', numerato: true, righe: [
        'Placche adesive (antero-posteriori) + elettrodi ECG collegati.',
        'Manopola su PACING DEMAND (FISSO solo se l’ECG è disturbato o inaffidabile).',
        'FREQUENZA STIMOLAZIONE ▲▼: 70 ppm.',
        'START/STOP per avviare: la spia STIMOLO lampeggia a ogni impulso.',
        'CORRENTE STIMOLAZIONE ▲: salire fino alla cattura elettrica, verificare il polso femorale, poi +10 mA.',
        'Stop: START/STOP (o corrente a 0 mA).',
      ] },
      { titolo: 'Controlli', righe: [
        'VERIFICA BASE sulla manopola = test giornaliero; spia di stato verde = pronto, rossa = da controllare.',
      ] },
    ],
    fonte: 'Nihon Kohden Cardiolife TEC-5600: scheda tecnica e guida rapida',
  },
  {
    id: 'nk-5531', nome: 'Nihon Kohden TEC-5531K (piastre): comandi', gruppo: 'Terapia elettrica',
    sintesi: 'Carrello con piastre: lo shock si dà premendo insieme i pulsanti delle due piastre; pacing dal pannello in alto.',
    blocchi: [
      { titolo: 'Defibrillazione con le piastre', numerato: true, righe: [
        'Gel sulle piastre: STERNUM sotto la clavicola destra, APEX sull’apice; premere con forza (circa 10 kg).',
        'Manopola sull’energia (150 J).',
        '2 CARICA/DAE sul pannello o il tasto di carica sulla piastra.',
        'Premere INSIEME i pulsanti di scarica delle due piastre.',
        'Annullare la carica: manopola su AZZERA.',
      ] },
      { titolo: 'Cardioversione', numerato: true, righe: [
        'Elettrodi ECG e placche/piastre.',
        'Manopola sull’energia; premere SINC (marcatore sulle onde R).',
        '2 CARICA, poi tenere premuti insieme i pulsanti delle piastre finché lo shock parte.',
        'Controllare che SINC sia ancora attivo prima di un nuovo shock.',
      ] },
      { titolo: 'Pacing (solo con placche adesive)', numerato: true, righe: [
        'Placche adesive antero-posteriori (con le piastre non si stimola) + elettrodi ECG.',
        'Manopola su STIMOLAZIONE DEMAND (FISSO solo se ECG inaffidabile).',
        'FREQUENZA STIMOLAZIONE ▲▼ a 70 ppm, START/STOP per avviare (spia STIMOLO).',
        'CORRENTE STIMOLAZIONE ▲ fino alla cattura; polso femorale; +10 mA.',
      ] },
      { titolo: 'Attenzione', righe: [
        'Con le placche adesive: verificare sul vostro apparecchio dove si trova il pulsante di scarica (sul pannello non è visibile nella foto).',
        'IMPOSTAZIONE e VERIFICA BASE sulla manopola: menu e test giornaliero.',
      ] },
    ],
    fonte: 'Nihon Kohden Cardiolife TEC-5500: manuale di servizio e caratteristiche',
  },
  {
    id: 'dfm100', nome: 'Philips Efficia DFM100: comandi', gruppo: 'Terapia elettrica',
    sintesi: 'Manopola verde (AED a sinistra, Monitor/energie/Pacer a destra), 1-2-3: energia, Carica gialla, Scarica arancio; Sync blu.',
    blocchi: [
      { titolo: 'Defibrillazione', numerato: true, righe: [
        'Placche collegate; manopola sull’energia (150 J).',
        '2 Carica (giallo).',
        '3 Scarica (arancio). Energia massima 200 J.',
        'Annullare: tasto funzione «Annulla carica».',
      ] },
      { titolo: 'Cardioversione', numerato: true, righe: [
        'Elettrodi ECG e placche; con il tasto a sinistra dello schermo scegliere la derivazione con l’onda R più ampia.',
        'Manopola sull’energia, poi premere Sync: il tasto si illumina di blu e compaiono frecce sulle onde R.',
        '2 Carica, poi tenere premuto 3 Scarica fino allo shock.',
        'Prima di un nuovo shock verificare che Sync sia ancora acceso (blu).',
      ] },
      { titolo: 'Pacing', numerato: true, righe: [
        'Placche antero-posteriori + elettrodi ECG (in demand servono per riconoscere le onde R).',
        'Manopola su Pacer; scegliere la derivazione migliore con il tasto a sinistra dello schermo.',
        'Tasto funzione «Impostazioni pacer» → Frequenza (70 ppm), poi Corrente (output).',
        '«Avvia pacing»: controllare i marcatori di stimolo e le frecce sulle onde R.',
        'Aumentare la corrente fino alla cattura, polso femorale, poi +10 mA.',
        'Modalità fissa: «Pausa pacing», manopola Smart Select → Modalità pacer → Fissa, poi «Riprendi pacing».',
        'Se il pacing si interrompe (es. elettrodo staccato in demand) va riavviato con il tasto funzione.',
      ] },
    ],
    fonte: 'Philips Efficia DFM100, Istruzioni per l’uso e nota applicativa sul pacing transcutaneo',
  },
  // ─── Ventilazione non invasiva (Philips V60) ───
  {
    id: 'niv-v60', nome: 'NIV/CPAP con Philips V60: montaggio e avvio', gruppo: 'Ventilazione non invasiva',
    sintesi: 'Circuito monotubo con una sola perdita intenzionale, maschera oronasale della misura giusta, impostare in standby, applicare la maschera a ventilatore acceso, EGA a 1 ora.',
    blocchi: [
      { titolo: 'Indicazioni (ERS/ATS 2017, BTS 2016)', righe: [
        'BPCO riacutizzata con acidosi respiratoria: pH ≤ 7,35 e PaCO₂ > 45 mmHg nonostante terapia medica e O₂ controllato → NIV (prima scelta, raccomandazione forte).',
        'Edema polmonare acuto cardiogeno con distress o ipossiemia → CPAP o NIV (forte), insieme a nitrati e diuretico.',
        'Sindrome obesità-ipoventilazione, malattie neuromuscolari, cifoscoliosi con ipercapnia acuta → NIV.',
        'Insufficienza ipossiemica de novo (polmonite, ARDS): preferire alti flussi nasali (HFNC); NIV/CPAP solo come prova breve, sorvegliata, con intubazione pronta. Immunodepressi e trauma toracico (dopo analgesia, PNX drenato): NIV utile.',
        'Asma: nessuna raccomandazione; solo prova breve in ambiente protetto.',
      ] },
      { titolo: 'Controindicazioni', righe: [
        'Arresto respiratorio o necessità di intubazione immediata; shock non controllato; aritmie maligne.',
        'GCS < 8 se non dovuto a ipercapnia; agitazione non collaborante; incapacità di proteggere le vie aeree, vomito, ematemesi, secrezioni abbondanti.',
        'Traumi, ustioni o chirurgia recente del volto e delle prime vie aeree; chirurgia esofago-gastrica recente; PNX non drenato; ostruzione delle alte vie.',
      ] },
      { titolo: 'Montaggio della V60', numerato: true, righe: [
        'Alimentazione di rete (batteria interna per il trasporto) e tubo dell’ossigeno ad alta pressione alla presa a muro: la FiO₂ si imposta sul ventilatore (O₂ 21–100%), non con un flussimetro.',
        'Filtro antibatterico sull’uscita del ventilatore, poi circuito monotubo.',
        'Una sola perdita intenzionale: da noi maschera NON ventilata con valvola antisoffocamento (gomito arancio) + porta espiratoria sul circuito (Whisper Swivel/DEP). Una maschera ventilata (gomito trasparente) va usata senza porta aggiuntiva. Due perdite = ventilazione inefficace; nessuna perdita = rirespirazione di CO₂.',
        'Tubicino di sensing (linea della pressione prossimale): dal raccordo vicino alla maschera alla presa sul frontale della V60. Staccato, piegato o con condensa = pressioni lette male, trigger errati e allarmi; controllarlo a ogni allarme.',
        'Menu Maschera/Porta: selezionare tipo di maschera e di porta espiratoria; eseguire il test della porta espiratoria (circuito chiuso con la mano quando richiesto).',
        'Maschera oronasale (full face) scelta con il calibro: dal ponte del naso a sotto il labbro inferiore. Casco solo per CPAP nell’ipossiemico.',
        'In standby: modalità e parametri (vedi scheda «NIV: impostazione per patologia ed EGA»), allarmi.',
        'Paziente seduto a 30–45°, spiegare. Avviare la ventilazione, poi appoggiare la maschera tenendola con la mano per 1–2 min; solo dopo fissare le cinghie (due dita sotto le cinghie).',
        'Ramp (5–45 min) solo se il paziente non tollera le pressioni piene; tasto «100% O₂» = 2 minuti di O₂ puro (es. prima di aspirare o mobilizzare).',
      ] },
      { titolo: 'Allarmi da impostare', righe: [
        'Vt basso: circa 4–5 mL/kg di peso ideale (≈ 250–300 mL nell’adulto medio).',
        'FR alta 35/min; FR bassa 8/min; apnea 20 s; VE bassa 4 L/min.',
        'Pressione alta: IPAP + 5–10 cmH₂O; pressione bassa: IPAP − 5 cmH₂O, ritardo 20 s (scatta con le grandi perdite o il distacco).',
      ] },
      { titolo: 'Comfort e sicurezza', righe: [
        'Protezione del ponte nasale (idrocolloide) fin dall’inizio; pause brevi per bere e per la cute dopo le prime ore se il paziente migliora.',
        'Sondino naso-gastrico se distensione gastrica o vomito; umidificazione se NIV prolungata.',
        'Ansia o dispnea che impediscono l’adattamento: morfina 2 mg ev (1/5 di fiala da 10 mg diluita a 10 mL), ripetibile con cautela, solo se vigile e con monitoraggio di FR e capnia. Niente sedazione nell’ipercapnico soporoso.',
        'Ordine di non intubare: decidere e scrivere PRIMA di iniziare se la NIV è il tetto terapeutico.',
      ] },
    ],
    fonte: 'ERS/ATS 2017 (NIV nell’insufficienza respiratoria acuta); BTS/ICS 2016 (ipercapnica); Philips Respironics V60, pocket guide e specifiche',
  },
  {
    id: 'niv-parametri', nome: 'NIV: impostazione per patologia ed EGA', gruppo: 'Ventilazione non invasiva',
    sintesi: 'Ipercapnico → S/T con EPAP bassa e pressione di supporto alta; ipossiemico → CPAP/EPAP alta e supporto basso. Si sale ogni 5–10 minuti guardando Vte, FR e comfort.',
    blocchi: [
      { titolo: 'Come leggere i parametri della V60', righe: [
        'IPAP ed EPAP sono pressioni ASSOLUTE: la pressione di supporto (PS) è IPAP − EPAP. Esempio IPAP 15 / EPAP 5 = PS 10.',
        'EPAP (o CPAP) recluta alveoli, migliora l’ossigenazione, contrasta la PEEP intrinseca e tiene aperte le alte vie. Minimo 4 cmH₂O (lavaggio della CO₂ dalla porta).',
        'PS aumenta il volume corrente: è la leva per la CO₂ e per la fatica.',
        'Modalità: CPAP (solo pressione continua); S/T (spontanea con frequenza di sicurezza: la standard); PCV (frequenza e Ti fissi, per pazienti con drive scarso); AVAPS (la V60 varia l’IPAP fino a 2,5 cmH₂O/min tra Min P e Max P per garantire il Vt impostato).',
        'Rise 1–5: 1 = più veloce. Rate e I-Time valgono solo per gli atti di backup; trigger e ciclaggio sono automatici (Auto-Trak), personalizzabili solo con l’opzione Auto-Trak+.',
      ] },
      { titolo: 'Decidere dall’EGA e dalla clinica', numerato: true, righe: [
        'Distress (FR > 25–30, muscoli accessori, respiro paradosso) + EGA. Peso ideale (PBW): uomo 50 + 0,91 × (altezza cm − 152,4); donna 45,5 + 0,91 × (altezza − 152,4). 170 cm ≈ 66 kg (uomo) → Vt 6–8 mL/kg ≈ 400–530 mL.',
        'pH < 7,35 con PaCO₂ > 45 → S/T. pH < 7,25: ancora NIV, ma con medico al letto e intubazione pronta; sotto 7,20 il fallimento è frequente.',
        'pH ≥ 7,35 con ipercapnia compensata → niente NIV di routine: terapia medica e O₂ controllato (SpO₂ 88–92%), ripetere l’EGA.',
        'Ipossiemia con PaCO₂ normale o bassa: EPA cardiogeno → CPAP; polmonite/ARDS → HFNC, oppure CPAP/NIV con EPAP alta e PS bassa in prova di 1 ora.',
        'Ipossiemia + ipercapnia (EPA con fatica, BPCO con polmonite, obeso): S/T con EPAP più alta (8–10).',
        'Ogni 5–10 min: aumentare la PS di 2–3 cmH₂O fino a Vte e FR al bersaglio; aumentare l’EPAP di 1–2 per l’ossigenazione o per gli sforzi inefficaci; O₂ per SpO₂ 88–92% (ipercapnico) o 92–96%.',
      ] },
      { titolo: 'Parametri di partenza per patologia (V60)', righe: [
        'BPCO riacutizzata: S/T, IPAP 12–15 → salire fino a 20–25 (raramente 30), EPAP 4–5 (6–8 se sforzi inefficaci/PEEP intrinseca), Rate 12–16, I-Time 0,8–1,0 s, Rise 1–2. SpO₂ 88–92%.',
        'EPA cardiogeno: CPAP 8–10 cmH₂O (partire da 5 se ipoteso o intollerante), O₂ 50–100% poi scalare; se ipercapnia o fatica S/T IPAP 12–15 / EPAP 8–10. Attenzione a PAS < 90.',
        'Obesità-ipoventilazione / OSAS: S/T con EPAP 8–10 (ostruzione delle alte vie), IPAP 18–25, Rate 14–16, I-Time 1,0–1,2 s; utile AVAPS con Vt 8 mL/kg di peso ideale, Min P 15, Max P 30.',
        'Neuromuscolari, cifoscoliosi: S/T o PCV, IPAP 15–20, EPAP 4–5, Rate 14–18, I-Time 1,2 s; frequenza di backup vicina a quella spontanea.',
        'Polmonite/ARDS (prova): CPAP 8–10 oppure S/T con EPAP 8–10 e PS bassa (IPAP = EPAP + 4–6). Vte > 9–9,5 mL/kg di peso ideale nonostante PS bassa = alto rischio di fallimento.',
        'Asma: S/T IPAP 10–12, EPAP 4–5, Rise 1, I-Time breve (0,8 s); salire con prudenza.',
        'Trauma toracico: dopo analgesia efficace e PNX escluso o drenato, CPAP 5–10 o S/T con PS bassa.',
      ] },
    ],
    fonte: 'ERS/ATS 2017; BTS/ICS 2016; Carteaux 2016 (Vt > 9,5 mL/kg); manuale Philips V60',
  },
  {
    id: 'niv-monitor', nome: 'NIV: cosa monitorare e ottimizzare', gruppo: 'Ventilazione non invasiva',
    sintesi: 'Nella prima ora al letto: FR, SpO₂, Vte, perdite, sincronia e coscienza; EGA a 1 ora. Nessun miglioramento in 1–2 ore = intubare, non insistere.',
    blocchi: [
      { titolo: 'Cosa leggere sullo schermo della V60', righe: [
        'Vte (volume espirato): bersaglio 6–8 mL/kg di peso ideale. Basso → aumentare IPAP (PS) o ridurre le perdite; troppo alto nell’ipossiemico → ridurre PS.',
        'FR: obiettivo < 25/min in calo nella prima ora. VE (volume minuto): sale con il lavoro di ventilare la CO₂.',
        'Tot Leak / Pt Leak: perdita totale (compresa la porta) e non intenzionale. Mirare a Pt Leak il più basso possibile: valori alti e variabili disturbano il trigger e falsano i volumi. Il simbolo della maschera sullo schermo segnala la perdita eccessiva.',
        'Pt Trig: % di atti iniziati dal paziente. Basso = sta lavorando il backup (apnea, sedazione, ipercapnia che peggiora) oppure sforzi non riconosciuti.',
        'PIP e curve pressione/flusso: la pressione deve raggiungere l’IPAP con un plateau; il flusso espiratorio deve tornare a zero prima dell’atto successivo (se no: PEEP intrinseca, air trapping).',
      ] },
      { titolo: 'Asincronie: cosa cambiare', righe: [
        'Sforzi inefficaci (il paziente respira, la macchina non parte; tipico della BPCO): aumentare EPAP di 1–2 cmH₂O, ridurre PS se Vte eccessivo, ridurre le perdite.',
        'Fame d’aria all’inizio dell’atto: Rise più veloce (da 3 a 1–2).',
        'Ciclaggio tardivo (espira contro la macchina, atti lunghi): ridurre le perdite (maschera, cinghie), ridurre PS; con Auto-Trak+ anticipare il ciclaggio.',
        'Doppio trigger: tempo inspiratorio troppo breve rispetto alla richiesta: aumentare PS; con Auto-Trak+ ritardare il ciclaggio.',
        'Autotrigger (FR del ventilatore alta senza sforzi visibili): perdite, acqua nel circuito o condensa nel tubicino di sensing.',
      ] },
      { titolo: 'Perdite e maschera', righe: [
        'Valvola antisoffocamento del gomito arancio: deve chiudersi quando il ventilatore spinge; se resta aperta (pressione bassa, ventilatore spento) il paziente respira aria ambiente attraverso di essa. Non coprirla.',
        'Riposizionare prima di stringere: la perdita sugli occhi è la più dannosa (congiuntiviti) e la più frequente.',
        'Maschera troppo grande o troppo stretta perde di più; con protesi dentarie spesso meglio tenerle.',
        'Barba, sondino naso-gastrico, cachessia: cuscinetti/medicazioni, cambio di misura o di interfaccia.',
      ] },
      { titolo: 'Sorveglianza e criteri di fallimento', numerato: true, righe: [
        'Prima ora al letto del paziente: FR, SpO₂, FC, PA, coscienza, uso dei muscoli accessori, tolleranza; monitor continuo.',
        'EGA a 1 ora (e a 4 ore, o dopo ogni cambio importante): pH e PaCO₂ devono migliorare; ipossiemico: P/F in aumento.',
        'HACOR a 1 ora (FC, pH, GCS, P/F, FR; calcolatore nella scheda Calcolatori) > 5 nell’ipossiemico = alto rischio di fallimento: decidere presto.',
        'Intubare (se non c’è limitazione terapeutica): pH o PaCO₂ che peggiorano o non migliorano in 1–2 ore; FR > 35; coscienza che peggiora; intolleranza; secrezioni non gestibili; instabilità emodinamica o aritmie; arresto. Ritardare l’intubazione peggiora la prognosi.',
        'Successo: continuare per gran parte delle prime 24 ore nell’ipercapnico, poi svezzare riducendo prima le ore di giorno; nell’EPA spesso bastano poche ore.',
      ] },
    ],
    fonte: 'ERS/ATS 2017; BTS/ICS 2016; Duan 2017 (HACOR); Vignaux 2009 (asincronie in NIV); manuale Philips V60',
  },
]

/*
 * Sedazione: dosi scritte come ordine pratico per un adulto di 70 kg, con il numero
 * (o la frazione) di fiale e i mL; la dose per kg è tra parentesi in fondo.
 * Le confezioni sono quelle della card «Fiale e siringhe» (ketamina: fiala 100 mg/2 mL, indicata da Daniele): se in reparto sono diverse, cambiarle lì e nelle righe.
 */
export const SEDAZIONE: Scheda[] = [
  {
    id: 'farmaci-sed', nome: 'Fiale e siringhe', gruppo: 'Riferimento',
    sintesi: 'Quanto c’è in ogni fiala e come si preparano le siringhe usate nelle schede.',
    blocchi: [
      { titolo: 'Ipnotici e sedativi', righe: [
        'Ketamina: fiala da 100 mg in 2 mL (50 mg/mL). 1 mL = 50 mg. Per titolare: 2 fiale (200 mg, 4 mL) + 16 mL SF in siringa da 20 mL → 1 mL = 10 mg.',
        'Propofol 1%: fiala da 200 mg in 20 mL; flacone da 500 mg in 50 mL (10 mg/mL). 1 mL = 10 mg.',
        'Midazolam: fiala da 5 mg in 1 mL, oppure fiala da 15 mg in 3 mL (5 mg/mL). Per ev: 1 fiala da 5 mg + 4 mL SF in siringa da 5 mL → 1 mL = 1 mg.',
      ] },
      { titolo: 'Oppioidi', righe: [
        'Fentanil: fiala da 100 µg in 2 mL. 1 mL = 50 µg.',
        'Morfina: fiala da 10 mg in 1 mL. Per ev: 1 fiala + 9 mL SF in siringa da 10 mL → 1 mL = 1 mg.',
      ] },
      { titolo: 'Curari e antagonisti', righe: [
        'Rocuronio: fiala da 50 mg in 5 mL. 1 mL = 10 mg.',
        'Succinilcolina: fiala da 100 mg in 2 mL (in frigorifero). 1 mL = 50 mg.',
        'Sugammadex: fiala da 200 mg in 2 mL e da 500 mg in 5 mL. 1 mL = 100 mg.',
        'Naloxone: fiala da 0,4 mg in 1 mL. Per titolare: 1 fiala + 9 mL SF → 1 mL = 0,04 mg.',
        'Flumazenil: fiala da 0,5 mg in 5 mL. 1 mL = 0,1 mg.',
      ] },
      { titolo: 'Altri', righe: [
        'Aloperidolo: fiala da 5 mg in 1 mL. Lorazepam: fiala da 4 mg in 1 mL. Diazepam: fiala da 10 mg in 2 mL.',
        'Clorpromazina: fiala da 50 mg in 2 mL. Butilscopolamina: fiala da 20 mg in 1 mL. Ondansetron: fiala da 4 mg in 2 mL.',
        'Adrenalina: fiala da 1 mg in 1 mL. Noradrenalina: fiala da 2 mg in 2 mL (verificare il formato in reparto).',
      ] },
      { titolo: 'Infusioni (siringa da 50 mL)', righe: [
        'Fentanil: 5 fiale da 100 µg (10 mL) + 40 mL SF = 500 µg in 50 mL → 1 mL = 10 µg.',
        'Midazolam: 10 fiale da 5 mg (o 3 fiale da 15 mg + 1 da 5 mg) = 50 mg, SF fino a 50 mL → 1 mL = 1 mg.',
        'Ketamina: 5 fiale da 100 mg (10 mL) + 40 mL SF = 500 mg in 50 mL → 1 mL = 10 mg.',
        'Propofol 1%: 1 flacone da 500 mg (50 mL) puro → 1 mL = 10 mg.',
        'Noradrenalina: 2 fiale da 2 mg (4 mL) + 46 mL SF = 4 mg in 50 mL → 1 mL = 80 µg.',
      ] },
      { titolo: 'Adrenalina in bolo («push-dose»)', righe: [
        '1 fiala da 1 mg in una sacca da 100 mL di SF → 10 µg/mL; aspirare 10 mL in siringa. Bolo 1–2 mL (10–20 µg) ogni 2–5 min.',
      ] },
    ],
  },
  {
    id: 'procedurale', nome: 'Sedazione procedurale (PSA)', gruppo: 'Schemi (adulto 70 kg)',
    sintesi: 'Ketamina 70–100 mg ev (3/4–1 fiala), propofol 40–70 mg ev (4–7 mL), ketofol; capnografia; antidoti pronti.',
    blocchi: [
      { titolo: 'Prima', righe: [
        'Valutazione: ASA, vie aeree (difficili? apnee notturne? obesità?), ultima assunzione (il digiuno non è un motivo per rimandare in urgenza, ACEP).',
        'Due operatori: uno fa la procedura, uno solo per la sedazione. Monitor SpO₂, PA, ECG, capnografia; O₂; aspiratore; pallone-maschera; antidoti aspirati.',
      ] },
      { titolo: 'Ketamina (riduzioni, ascessi, ustioni)', righe: [
        'Ev: 70–100 mg = da 3/4 a 1 fiala da 100 mg (1,4–2 mL), in 30–60 s (1–1,5 mg/kg). Più comodo: 1 fiala portata a 10 mL con SF (1 mL = 10 mg) e dare 7–10 mL.',
        'Se serve: 35 mg = 1/3 abbondante di fiala (0,7 mL; 3,5 mL della fiala diluita a 10 mL) ogni 5–10 min (0,5 mg/kg).',
        'Im (senza vena): 300 mg = 3 fiale da 100 mg (6 mL), in due sedi da 3 mL (4–5 mg/kg).',
        'Laringospasmo (raro): ventilare a pressione positiva; se persiste succinilcolina 100 mg ev = 1 fiala (2 mL).',
        'Agitazione al risveglio: midazolam 1–2 mg ev (1–2 mL della siringa diluita). Vomito: ondansetron 4 mg ev = 1 fiala.',
        'Evitare: schizofrenia attiva, ipertensione grave, SCA.',
      ] },
      { titolo: 'Propofol (cardioversione, lussazione di spalla)', righe: [
        'Ev: 40–70 mg = 4–7 mL (fiala da 200 mg/20 mL: circa 1/3 di fiala) (0,5–1 mg/kg); poi 20–30 mg = 2–3 mL ogni 1–3 min fino all’effetto (0,25–0,5 mg/kg).',
        'Anziano o fragile: 20–30 mg = 2–3 mL lentamente, poi 10–20 mg = 1–2 mL.',
        'Non è analgesico: per procedure dolorose prima fentanil 50 µg ev = mezza fiala da 100 µg (1 mL) (0,7 µg/kg).',
      ] },
      { titolo: 'Ketofol', righe: ['Ketamina 35 mg = 3,5 mL di 1 fiala da 100 mg portata a 10 mL + propofol 35 mg = 3,5 mL, ev (0,5 + 0,5 mg/kg). Se serve: 20 mg + 20 mg (2 mL + 2 mL). Meno ipotensione del propofol, meno vomito della ketamina.'] },
      { titolo: 'Paziente instabile (cardioversione in ipotensione)', righe: ['Ketamina 35–50 mg ev = 1/3–1/2 fiala da 100 mg (0,7–1 mL) (0,5–0,7 mg/kg), oppure propofol a dose ridotta 20 mg = 2 mL ripetuto con prudenza.'] },
      { titolo: 'Midazolam + fentanil (procedure minori, ansiolisi)', righe: [
        'Fentanil 50 µg ev = mezza fiala (1 mL), poi midazolam 1–2 mg ev = 1–2 mL della siringa diluita (1 fiala da 5 mg portata a 5 mL).',
        'Ripetere metà dose ogni 2–3 min; massimo midazolam 3,5 mg (0,05 mg/kg) e fentanil 100 µg = 1 fiala. Anziano: metà dosi.',
      ] },
      { titolo: 'Antidoti', righe: [
        'Naloxone 0,04–0,1 mg ev = 1–2,5 mL della diluizione (1 fiala da 0,4 mg portata a 10 mL), ogni 2 min fino a 0,4 mg = tutta la fiala. Dura meno degli oppioidi: osservare.',
        'Flumazenil 0,2 mg ev = 2 mL (2/5 della fiala da 0,5 mg/5 mL), ripetibile ogni minuto fino a 1 mg = 2 fiale. Non se uso cronico di benzodiazepine o epilessia.',
      ] },
      { titolo: 'Dimissione', righe: ['Stato mentale di base, parametri stabili, almeno 30 min dall’ultima dose (di più dopo antidoti), accompagnatore, niente guida per 12–24 h.'] },
    ],
    fonte: 'ACEP Clinical Policy 2014; SIMEU',
  },
  {
    id: 'agitato', nome: 'Paziente agitato', gruppo: 'Schemi (adulto 70 kg)',
    sintesi: 'Per bocca se collabora; im se non collabora; ketamina 300 mg im (3 fiale) se estremo.',
    blocchi: [
      { titolo: 'Sempre', righe: [
        'De-escalation verbale; escludere glicemia, ipossia, intossicazione, astinenza, trauma cranico, infezione, ritenzione urinaria, dolore.',
        'Dopo la sedazione: SpO₂ ed ECG (QT con antipsicotici); contenzione fisica il meno possibile e mai senza sedazione.',
      ] },
      { titolo: 'Lieve, collabora (per bocca)', righe: [
        'Olanzapina 10 mg os (1 compressa orodispersibile da 10 mg).',
        'Oppure lorazepam 2 mg os/sublinguale (astinenza, stimolanti).',
        'Psicosi nota: aloperidolo 5 mg os + lorazepam 2 mg os.',
      ] },
      { titolo: 'Moderata–grave, non collabora (im)', righe: [
        'Aloperidolo 5 mg im = 1 fiala (1 mL) + midazolam 5 mg im = 1 fiala da 5 mg/1 mL, nella stessa siringa.',
        'Oppure olanzapina 10 mg im = 1 fiala in polvere ricostituita con 2,1 mL di acqua ppi. Non entro 1 h da benzodiazepine im/ev.',
        'Oppure midazolam 5–10 mg im = 1–2 fiale da 5 mg (1–2 mL) (stimolanti, astinenza alcolica).',
        'Ripetibile una volta dopo 15–30 min.',
      ] },
      { titolo: 'Estrema, pericolosa (delirium iperattivo)', righe: [
        'Ketamina 300 mg im = 3 fiale da 100 mg (6 mL), in due sedi da 3 mL (4–5 mg/kg); effetto in 2–5 min.',
        'Con accesso venoso: ketamina 70–140 mg ev = da 3/4 di fiala a 1 fiala e mezza (1,4–2,8 mL) (1–2 mg/kg).',
        'Poi monitor completo e capnografia, pronti per le vie aeree; controllare temperatura, CK, potassio.',
      ] },
      { titolo: 'Situazioni particolari', righe: [
        'Astinenza alcolica: diazepam 10 mg ev = 1 fiala (2 mL) ogni 5–10 min fino al controllo; oppure lorazepam 2 mg ev = mezza fiala da 4 mg (0,5 mL). Tiamina 200–500 mg ev prima del glucosio.',
        'Anziano con delirium: aloperidolo 0,5–1 mg os o im = 1/10–1/5 di fiala (0,1–0,2 mL); evitare benzodiazepine (salvo astinenza).',
        'Parkinson o demenza a corpi di Lewy: niente aloperidolo; quetiapina 12,5–25 mg os.',
        'QT >500 ms: niente aloperidolo né olanzapina im; benzodiazepine.',
      ] },
    ],
    fonte: 'Project BETA (American Association for Emergency Psychiatry); NICE NG10',
  },
  {
    id: 'intubazione', nome: 'Sedoanalgesia per intubazione', gruppo: 'Schemi (adulto 70 kg)',
    sintesi: 'Ketamina 100 mg (1 fiala) o propofol 100 mg (10 mL) + rocuronio 85 mg (quasi 2 fiale); infusione subito dopo.',
    blocchi: [
      { titolo: 'Induttore (scegliere uno)', righe: [
        'Ketamina 100 mg ev = 1 fiala da 100 mg/2 mL (1,5 mg/kg; range 1–2). Shock: 50 mg = mezza fiala, 1 mL (0,5–1 mg/kg). Prima scelta nell’instabile e nel broncospasmo.',
        'Propofol 100 mg ev = 10 mL, mezza fiala da 200 mg/20 mL (1,5 mg/kg; range 1–2). Anziano: 50 mg = 5 mL. Solo se la pressione è stabile; utile nello stato di male.',
        'Midazolam 10–20 mg ev = 2–4 fiale da 5 mg (0,15–0,3 mg/kg): lento e ipotensivo, ultima scelta.',
        'Obeso: dosare l’induttore sul peso magro.',
      ] },
      { titolo: 'Curaro', righe: [
        'Rocuronio 85 mg ev = 8,5 mL: 1 fiala da 50 mg (5 mL) + 3,5 mL della seconda (1,2 mg/kg di peso reale). Shock: 110 mg = 11 mL, 2 fiale + 1 mL della terza (1,6 mg/kg). Condizioni in 45–60 s, dura 45–60 min.',
        'Antagonista immediato: sugammadex 1100 mg ev = 11 mL: 2 fiale da 500 mg/5 mL + 1 mL di una fiala da 200 mg/2 mL (16 mg/kg).',
        'Succinilcolina 100 mg ev = 1 fiala da 100 mg/2 mL (1,5 mg/kg di peso reale). In 45 s, dura 8–10 min.',
        'Succinilcolina controindicata: iperkaliemia nota o sospetta (IRC, rabdomiolisi), ustioni o schiacciamento >24 h, malattie neuromuscolari, immobilizzazione prolungata, ipertermia maligna.',
      ] },
      { titolo: 'Aggiunte', righe: [
        'Fentanil 100–200 µg ev = 1–2 fiale da 100 µg (2–4 mL), 3 min prima (1,5–3 µg/kg): solo per attenuare la risposta pressoria (emorragia cerebrale, dissezione aortica, SCA). NON nello shock.',
        'Shock: noradrenalina già in infusione o pronta; adrenalina 10–20 µg = 1–2 mL della siringa push-dose se la pressione crolla.',
      ] },
      { titolo: 'Senza curaro', righe: [
        'Sequenza ritardata (agitato che non tollera la preossigenazione): ketamina 70 mg ev = 3/4 di fiala da 100 mg (1,4 mL) (1 mg/kg), poi 35 mg = 1/3 di fiala (0,7 mL) se serve → preossigenare 3 min (NIV o reservoir) → curaro → intubazione.',
        'Da sveglio con fibroscopio o videolaringoscopio: lidocaina 4% spray/nebulizzata, massimo 15 mL in totale (600 mg; 9 mg/kg) + ketamina 20–35 mg ev = 2–3,5 mL di 1 fiala da 100 mg portata a 10 mL (0,25–0,5 mg/kg), titolata; respiro spontaneo conservato.',
      ] },
      { titolo: 'Dopo l’intubazione (prima l’analgesia)', righe: [
        'Fentanil 50–100 µg/h = 5–10 mL/h della siringa 500 µg/50 mL (5 fiale) (0,7–1,5 µg/kg/h).',
        '+ propofol 70–210 mg/h = 7–21 mL/h di propofol 1% puro (1–3 mg/kg/h); attenzione a PA e trigliceridi oltre 48 h.',
        'Oppure midazolam 2–5 mg/h = 2–5 mL/h della siringa 50 mg/50 mL (10 fiale da 5 mg) (0,03–0,07 mg/kg/h).',
        'Oppure, se instabile, ketamina 35–140 mg/h = 3,5–14 mL/h della siringa 500 mg/50 mL (5 fiale) (0,5–2 mg/kg/h).',
        'Partire entro 10 min se si è usato il rocuronio (paralizzato ma sveglio). Obiettivo RASS da −2 a 0.',
      ] },
    ],
    fonte: 'Linee guida DAS/ICS 2018 per l’intubazione del critico; SIAARTI',
  },
  {
    id: 'palliativa', nome: 'Sedazione palliativa (fine vita)', gruppo: 'Schemi (adulto 70 kg)',
    sintesi: 'Sintomo refrattario + morte attesa in ore-giorni; midazolam 2,5–5 mg poi infusione; continuare l’oppioide.',
    blocchi: [
      { titolo: 'Condizioni', righe: [
        'Sintomo refrattario (dispnea, delirium, dolore, emorragia massiva, distress), prognosi di ore-giorni.',
        'Decisione condivisa con paziente (se possibile) e familiari; in cartella indicazione, consenso, farmaci, monitoraggio (Legge 219/2017).',
        'Continuare l’oppioide in corso: la sedazione non lo sostituisce.',
      ] },
      { titolo: 'Midazolam (prima scelta)', numerato: true, righe: [
        'Bolo 2,5–5 mg: ev = 2,5–5 mL della siringa diluita (1 fiala da 5 mg portata a 5 mL); sc = mezza o 1 fiala da 5 mg/1 mL pura. Anziano o fragile 1–2,5 mg; già in benzodiazepine 5–10 mg (1–2 fiale).',
        'Ripetere ogni 5 min (ev) o 20 min (sc) fino alla sedazione voluta.',
        'Infusione: siringa 50 mg in 50 mL (10 fiale da 5 mg + SF) a 0,5–1 mL/h = 0,5–1 mg/h ev o sc; aumentare del 25–50% se serve (di solito fino a 2–5 mL/h).',
        'Obiettivo comfort, RASS da −2 a −4 (Ramsay 4–5); rivalutare ogni ora all’inizio.',
      ] },
      { titolo: 'Se il midazolam non basta', righe: [
        'Aggiungere clorpromazina 25 mg ev = mezza fiala da 50 mg/2 mL (1 mL), in 100 mL di SF in 30 min, ogni 6–8 h (anziano 12,5 mg = 1/4 di fiala).',
        'Delirium terminale: aloperidolo 2,5–5 mg sc/ev = mezza–1 fiala da 5 mg; poi 5–15 mg/24 h (1–3 fiale).',
        'Ultima linea (in ospedale, con esperti): propofol 35–70 mg/h = 3,5–7 mL/h di propofol 1% puro (0,5–1 mg/kg/h).',
      ] },
      { titolo: 'Sintomi associati', righe: [
        'Dispnea o dolore (non in oppioidi): morfina 2–5 mg ev/sc = 2–5 mL della diluizione (1 fiala da 10 mg portata a 10 mL); sc anche 0,2–0,5 mL della fiala pura. Infusione 0,5–1 mg/h. Se già in oppioide: aumentare la dose del 25–50%.',
        'Rantolo terminale: butilscopolamina 20 mg sc = 1 fiala, ogni 6–8 h; riposizionare, ridurre i liquidi.',
        'Emorragia massiva: midazolam 5–10 mg ev o sc = 1–2 fiale da 5 mg in bolo; teli scuri.',
        'Sospendere farmaci ed esami inutili; idratazione solo se utile al comfort.',
      ] },
    ],
    fonte: 'EAPC 2023; SICP-SIAARTI «Sedazione palliativa nell’adulto»',
  },
]

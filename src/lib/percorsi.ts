/*
 * «Percorsi»: adempimenti medico-legali, percorsi protetti, sanità pubblica, maxiemergenza.
 * BOZZA: riferimenti normativi nazionali; i dettagli operativi vanno allineati alle procedure
 * aziendali dell'ASL Toscana Centro (PEIMAF e maxiemergenza in attesa del protocollo aziendale).
 */
import type { Scheda } from './schede'

export const PERCORSI: Scheda[] = [
  // ─── Medico-legale ───
  {
    id: 'referto', nome: 'Referto all’autorità giudiziaria', gruppo: 'Medico-legale', urgente: true,
    sintesi: 'Obbligatorio per i delitti procedibili d’ufficio: entro 48 h, subito se c’è pericolo nel ritardo.',
    fonte: 'Art. 365 c.p., art. 334 c.p.p.',
    blocchi: [
      { titolo: 'Quando', righe: [
        'Ogni volta che si presta assistenza in casi che possono presentare i caratteri di un delitto procedibile d’ufficio.',
        'Esempi: lesioni gravi o gravissime (malattia > 40 giorni, pericolo di vita, indebolimento permanente di un senso o organo), lesioni da arma, lesioni stradali gravi o gravissime, infortuni sul lavoro con lesioni gravi o morte, maltrattamenti in famiglia, atti persecutori con lesioni, violenza su minori o incapaci, tentato omicidio, morte violenta o sospetta, aborto clandestino, cessione di stupefacenti con danno.',
        'Le lesioni lievi (fino a 40 giorni) sono di norma a querela della persona offesa, salvo aggravanti (es. arma, contesto familiare, persona incapace): nel dubbio, fare il referto.',
        'Non è dovuto se esporrebbe la persona assistita a procedimento penale (es. paziente che si è fatto male commettendo un reato).',
      ] },
      { titolo: 'Come', numerato: true, righe: [
        'Modulo aziendale di referto (verificare dove si trova in FirstAid / modulistica DEA).',
        'Contenuto: generalità del paziente (se note), luogo, giorno e ora dell’intervento, circostanze, descrizione obiettiva delle lesioni, mezzo che le ha prodotte (se noto), prognosi, eventuali persone presenti che possono riferire.',
        'Descrivere, non interpretare: sede, forma, dimensioni, colore delle lesioni; foto con consenso secondo procedura.',
        'Invio al PM presso la Procura o all’ufficiale di polizia giudiziaria più vicino (posto di polizia del PS): entro 48 h; subito se c’è pericolo nel ritardo.',
        'Copia nella documentazione; annotare in cartella che il referto è stato fatto.',
        'Più medici sullo stesso caso: possono firmare un unico referto.',
      ] },
    ],
  },
  {
    id: 'inail', nome: 'Infortunio sul lavoro (INAIL)', gruppo: 'Medico-legale',
    sintesi: 'Certificato medico di infortunio trasmesso per via telematica da chi presta la prima assistenza; anche in itinere.',
    fonte: 'DPR 1124/1965 art. 53; D.lgs 151/2015',
    blocchi: [
      { titolo: 'Quando', righe: [
        'Lesione da causa violenta in occasione di lavoro, compreso il tragitto casa–lavoro (in itinere), per lavoratori assicurati INAIL (dipendenti, parasubordinati, alcuni autonomi, studenti in alcune attività).',
        'Anche malattia professionale sospetta: certificato di malattia professionale e denuncia/segnalazione secondo normativa.',
      ] },
      { titolo: 'Come', numerato: true, righe: [
        'Raccogliere: datore di lavoro, mansione, luogo, data e ora, dinamica riferita dal paziente.',
        'Compilare il certificato medico di infortunio con diagnosi, prognosi (giorni) e se la prognosi è riservata.',
        'Trasmissione telematica all’INAIL secondo la procedura del PS (FirstAid / portale INAIL); consegnare copia al lavoratore con il numero identificativo per il datore di lavoro.',
        'Infortunio grave (lesioni gravi o gravissime, morte) o con possibile violazione di norme di sicurezza: anche referto all’autorità giudiziaria.',
        'Prognosi successive: dal medico curante o dall’INAIL.',
      ] },
    ],
  },
  {
    id: 'decesso', nome: 'Constatazione di decesso in PS', gruppo: 'Medico-legale',
    sintesi: 'Accertamento con ECG continuo per almeno 20 minuti; morte violenta o sospetta: salma a disposizione dell’autorità giudiziaria.',
    fonte: 'Legge 578/1993; DM 11 aprile 2008; DPR 285/1990',
    blocchi: [
      { titolo: 'Accertamento (criteri cardiaci)', numerato: true, righe: [
        'Assenza di attività elettrica cardiaca documentata con ECG continuo per non meno di 20 minuti (tracciato da allegare/conservare).',
        'Annotare in cartella ora di inizio e fine registrazione e ora del decesso.',
        'Comunicazione ai familiari in luogo riservato; offrire di vedere il defunto.',
      ] },
      { titolo: 'Documenti', righe: [
        'Scheda ISTAT di morte (causa iniziale, intermedia, finale; condizioni concomitanti).',
        'Avviso al medico necroscopo/Direzione sanitaria secondo procedura per la visita necroscopica e il periodo di osservazione.',
        'Possibile donazione di tessuti (cornee, ecc.): segnalare al coordinamento aziendale trapianti anche dopo arresto cardiaco.',
      ] },
      { titolo: 'Morte violenta o sospetta', righe: [
        'Traumi, intossicazioni, morte improvvisa inspiegata di giovane, sospetto di maltrattamento, infortunio sul lavoro, morte in custodia.',
        'Non rimuovere tubi, cannule, cateteri, indumenti; non lavare la salma; conservare oggetti e materiali.',
        'Referto/comunicazione all’autorità giudiziaria; la salma resta a disposizione dell’AG (niente riscontro diagnostico ospedaliero senza autorizzazione).',
      ] },
    ],
  },
  {
    id: 'rifiuto-cure', nome: 'Rifiuto delle cure e dimissione contro parere', gruppo: 'Medico-legale',
    sintesi: 'Il paziente capace può rifiutare qualunque trattamento: verificare la capacità, informare, documentare.',
    fonte: 'Legge 219/2017 (consenso informato)',
    blocchi: [
      { titolo: 'Passaggi', numerato: true, righe: [
        'Valutare la capacità decisionale: capisce le informazioni, le trattiene, le valuta, comunica una scelta (escludere intossicazione, delirium, ipoglicemia, trauma cranico).',
        'Spiegare in modo comprensibile diagnosi sospetta, rischi concreti del rifiuto (compreso il rischio di morte se reale), alternative possibili.',
        'Offrire soluzioni parziali: esami di base, terapia orale, controllo a breve, rientro in qualunque momento.',
        'Far firmare il modulo di dimissione contro parere / rifiuto; se rifiuta di firmare: annotarlo con un testimone (infermiere).',
        'Documentare in cartella: capacità, informazioni date, domande del paziente, scelta, eventuali familiari presenti.',
        'Consegnare comunque la lettera di dimissione con le indicazioni e i segni d’allarme.',
      ] },
      { titolo: 'Se non è capace', righe: [
        'Pericolo imminente per la salute: trattamento in stato di necessità (art. 54 c.p.), coinvolgendo i familiari e, se esiste, l’amministratore di sostegno o il fiduciario.',
        'Disturbo psichico con rifiuto delle cure: valutare TSO.',
        'Paziente che si allontana senza avvisare: annotare ora e circostanze; se a rischio per sé o altri, avvisare le forze dell’ordine e i familiari.',
      ] },
    ],
  },
  {
    id: 'alcol-cds', nome: 'Alcol e droghe su richiesta della polizia (Codice della strada)', gruppo: 'Medico-legale',
    sintesi: 'Dopo incidente stradale gli organi di polizia possono chiedere alla struttura gli accertamenti per alcol e stupefacenti.',
    fonte: 'Artt. 186 e 187 Codice della strada',
    blocchi: [
      { titolo: 'Passaggi', righe: [
        'Richiesta scritta (verbale) degli organi di polizia stradale, con generalità del conducente e ora dell’incidente.',
        'Informare il paziente dello scopo del prelievo e chiedere il consenso; il rifiuto va documentato e comunicato alla polizia (le conseguenze sono a carico del conducente).',
        'Prelievo con la catena di custodia prevista dalla procedura aziendale/laboratorio (provette dedicate, sigilli, verbale).',
        'Prelievi già eseguiti per motivi clinici: i risultati possono essere richiesti dall’autorità secondo le regole sulla documentazione sanitaria.',
        'Verificare la procedura aziendale per modulistica e laboratorio di riferimento.',
      ] },
    ],
  },

  // ─── Percorsi protetti ───
  {
    id: 'codice-rosa', nome: 'Codice Rosa (violenza)', gruppo: 'Percorsi protetti', urgente: true,
    sintesi: 'Percorso regionale toscano per le vittime di violenza: stanza dedicata, task force, prove conservate, centro antiviolenza.',
    fonte: 'Rete regionale Codice Rosa (DGR Toscana); Legge 69/2019 «Codice rosso»',
    blocchi: [
      { titolo: 'Accoglienza', numerato: true, righe: [
        'Codice di priorità adeguato e attivazione del percorso Codice Rosa al triage; stanza Rosa dedicata, la persona non resta sola né con il presunto autore.',
        'Domande dirette e non giudicanti; valutazione del rischio (screening di rischio di recidiva/letalità previsto dal percorso).',
        'Cure delle lesioni prima di tutto; documentazione accurata: descrizione, misure, foto con consenso e righello.',
      ] },
      { titolo: 'Violenza sessuale', righe: [
        'Ginecologo (o urologo/chirurgo) del percorso; kit per la raccolta delle prove; non far lavare né urinare prima dei prelievi se possibile.',
        'Indumenti in buste di carta separate, sigillate ed etichettate; catena di custodia.',
        'Profilassi: IST, HIV (PEP entro 72 h), HBV, contraccezione d’emergenza; prelievi tossicologici se sospetta sostanza (urine e sangue).',
      ] },
      { titolo: 'Dopo', righe: [
        'Referto all’autorità giudiziaria se il reato è procedibile d’ufficio (maltrattamenti, minori, lesioni gravi, ecc.); negli altri casi informare la persona della possibilità di querela.',
        'Contatto con il centro antiviolenza (rubrica) e, se necessario, ospitalità protetta; servizi sociali.',
        'Dimissione solo in sicurezza: dove va, con chi; numero 1522 (antiviolenza e stalking, 24 h).',
      ] },
    ],
  },
  {
    id: 'tso', nome: 'TSO e ASO (trattamento e accertamento sanitario obbligatorio)', gruppo: 'Percorsi protetti',
    sintesi: 'TSO per malattia mentale: tre condizioni insieme, proposta + convalida di due medici, ordinanza del sindaco.',
    fonte: 'Legge 180/1978; Legge 833/1978 artt. 33–35',
    blocchi: [
      { titolo: 'Condizioni (tutte e tre)', righe: [
        'Alterazioni psichiche tali da richiedere urgenti interventi terapeutici.',
        'Rifiuto degli interventi da parte del paziente.',
        'Impossibilità di adottare tempestive e idonee misure sanitarie extraospedaliere.',
        'Non si fa TSO per patologie organiche (delirium, intossicazione, trauma): lì vale lo stato di necessità.',
      ] },
      { titolo: 'Iter', numerato: true, righe: [
        'Escludere cause organiche (glicemia, intossicazioni, trauma, infezione) e chiamare lo psichiatra di guardia.',
        'Proposta motivata di TSO da parte di un medico.',
        'Convalida da parte di un medico della struttura pubblica (di norma lo psichiatra).',
        'Ordinanza del Sindaco del comune in cui si trova il paziente, entro 48 h dalla convalida; notifica al Giudice tutelare entro 48 h.',
        'Ricovero in SPDC; durata 7 giorni, prorogabile con comunicazione al Sindaco.',
        'Esecuzione con la Polizia municipale; il personale sanitario si occupa delle cure.',
      ] },
      { titolo: 'ASO', righe: [
        'Accertamento sanitario obbligatorio: quando non è possibile visitare il paziente che rifiuta, per verificare se servono le condizioni del TSO; proposta medica e ordinanza del Sindaco.',
        'Nell’attesa, in pericolo immediato per sé o altri: stato di necessità e sedazione secondo la scheda «Paziente agitato».',
      ] },
    ],
  },

  // ─── Sanità pubblica ───
  {
    id: 'notifica-infettive', nome: 'Notifica delle malattie infettive', gruppo: 'Sanità pubblica', urgente: true,
    sintesi: 'Scheda unica regionale (DM 7 marzo 2022), anche per il solo sospetto: entro 12 h o 48 h secondo la malattia, per email all’Igiene pubblica di Prato.',
    fonte: 'Scheda unica di segnalazione delle malattie infettive, Regione Toscana (prot. AOOGRT 0623609 dell’1/8/2025); modulo PDF editabile inviato dal DEU ASL TC il 15/1/2026',
    link: [
      { etichetta: '📄 Scheda di notifica (PDF editabile)', href: 'docs/asl/scheda-notifica-malattie-infettive-2026.pdf', primario: true },
      { etichetta: '✉ Invia all’Igiene pubblica', href: 'mailto:malattieinfettiveigiene.prato@uslcentro.toscana.it,infezionicorrelate.prato@uslcentro.toscana.it?subject=Notifica%20malattia%20infettiva' },
      { etichetta: 'Documenti ASL', href: '/documenti' },
    ],
    blocchi: [
      { titolo: 'Come', numerato: true, righe: [
        'Si notifica il caso SOSPETTO o CONFERMATO: non aspettare la conferma di laboratorio.',
        'Compilare la scheda unica (PDF editabile): malattia, dati anagrafici e recapiti, inizio sintomi, viaggi, ricovero, gravidanza, vaccinazione, criteri diagnostici (clinici, epidemiologici, laboratorio), origine del contagio, comunità frequentate (scuola, RSA), sospetta origine alimentare, altre persone coinvolte, dati del medico.',
        'Firmare (autografa o digitale) e inviare per email a malattieinfettiveigiene.prato@uslcentro.toscana.it e infezionicorrelate.prato@uslcentro.toscana.it.',
        'Malattie entro 12 h fuori orario e casi gravi (meningococco, morbillo, febbri emorragiche, rabbia, botulismo, difterite…): oltre alla scheda, telefonare all’Igiene pubblica reperibile (rubrica) per la profilassi dei contatti.',
        'Sospetta tossinfezione alimentare: raccogliere feci/vomito PRIMA di antibiotici e disinfettanti.',
        'Annotare in cartella data e ora dell’invio.',
      ] },
      { titolo: '☎ Entro 12 ore', righe: [
        'Antrace · Botulismo* · Chikungunya* · Colera · Dengue* · Difterite · Encefalite virale da zecche* · Encefalite virale trasmessa da artropodi* · Epatite A · Febbre emorragica virale · Febbre gialla · Febbre West Nile*',
        'Influenza grave* · Influenza aviaria* · Legionellosi* · Malaria* · Malattia batterica invasiva (meningococco, pneumococco, emofilo)* · Creutzfeldt-Jakob* · Morbillo* · Peste · Poliomielite* · Rabbia',
        'Rosolia* · Rosolia congenita* · Rosolia in gravidanza* · MERS-CoV* · Tetano · Tifo esantematico · Tossinfezioni alimentari · Trichinellosi · Vaiolo · Mpox* · Varicella · Zika* · Zika congenita*',
      ] },
      { titolo: '✉ Entro 48 ore', righe: [
        'Borreliosi · Brucellosi · Criptosporidiosi · Dermatofitosi · Echinococcosi · Epatiti B, C, D, E e altre acute · Febbre Q · Febbre tifoide e paratifoide · Giardiasi · Herpes zoster',
        'Infezione correlata all’assistenza (ICA)* · Chlamydia · Gonorrea · Campylobacter · STEC/VTEC compresa SEU · Enterobatteri produttori di carbapenemasi (CPE)* · Yersinia · Salmonella',
        'Lebbra · Leishmaniosi cutanea e viscerale · Leptospirosi · Linfogranuloma venereo · Listeriosi · Meningiti virali · Micobatteriosi non tubercolare* · Parotite · Pediculosi e ftiriasi · Pertosse · Psittacosi · Rickettsiosi',
        'Scabbia · Scarlattina · Shigellosi · Sifilide e sifilide congenita · Toxoplasmosi e toxoplasmosi congenita · Tubercolosi* · Tularemia · Altro (specificare)',
        '* = sorveglianza speciale (schede aggiuntive dedicate, di solito curate da Malattie infettive/Igiene pubblica).',
      ] },
    ],
  },
  {
    id: 'morsi-animali', nome: 'Morso di animale: segnalazione veterinaria', gruppo: 'Sanità pubblica',
    sintesi: 'Morso di cane o gatto: segnalazione al Servizio veterinario dell’ASL per l’osservazione dell’animale.',
    blocchi: [
      { titolo: 'Passaggi', righe: [
        'Raccogliere: specie, proprietario/recapiti, luogo, stato vaccinale dell’animale, animale randagio o selvatico.',
        'Segnalazione al Servizio veterinario della ASL (modulo/procedura aziendale); osservazione dell’animale per 10 giorni.',
        'Rischio rabbia (pipistrelli, animali importati o da zone endemiche, morso all’estero): anche Igiene pubblica/Malattie infettive.',
        'Terapia della ferita e profilassi antitetanica: vedi PDTA «Ferite e morsi».',
      ] },
    ],
  },
  {
    id: 'esposizione-operatore', nome: 'Infortunio biologico dell’operatore', gruppo: 'Sanità pubblica',
    sintesi: 'Puntura o schizzo con materiale biologico: lavare, testare fonte ed esposto, PEP se indicata entro poche ore, denuncia di infortunio.',
    blocchi: [
      { titolo: 'Passaggi', numerato: true, righe: [
        'Lavare con acqua e sapone (mucose: acqua/SF); non spremere.',
        'Prelievo all’esposto (HIV, HBV, HCV, anti-HBs) e alla fonte con consenso.',
        'Valutazione della profilassi (HIV entro 2–4 h, HBV entro 24 h): vedi PDTA «Profilassi post-esposizione».',
        'Segnalazione al medico competente e denuncia di infortunio sul lavoro secondo la procedura aziendale.',
      ] },
    ],
  },

  // ─── Maxiemergenza ───
  {
    id: 'peimaf', nome: 'PEIMAF (massiccio afflusso di feriti)', gruppo: 'Maxiemergenza', urgente: true,
    sintesi: 'IN ATTESA DEL PROTOCOLLO AZIENDALE. Piano di emergenza interno per il massiccio afflusso di feriti.',
    blocchi: [
      { titolo: 'Da inserire dal protocollo aziendale', righe: [
        'Chi attiva il piano e come (allerta dalla Centrale 118, livelli di attivazione).',
        'Catena di comando: responsabile del PS, direzione sanitaria, ruoli (scheda di azione per ruolo).',
        'Aree: triage di maxiemergenza, area rossa/gialla/verde, area decessi, area familiari e stampa.',
        'Richiamo del personale, liberazione dei letti, blocco delle attività programmate.',
        'Materiali, numeri da chiamare, cartellini di triage, registrazione dei pazienti.',
        'Disattivazione e debriefing.',
      ] },
    ],
  },
  {
    id: 'maxiemergenza', nome: 'Maxiemergenza: triage e principi', gruppo: 'Maxiemergenza',
    sintesi: 'IN ATTESA DEL PROTOCOLLO AZIENDALE. Principi generali di triage di massa.',
    blocchi: [
      { titolo: 'Principi generali (da allineare al protocollo)', righe: [
        'Obiettivo: il massimo beneficio per il maggior numero di persone, non il massimo per il singolo.',
        'Triage START (adulti): cammina → verde; non respira dopo apertura delle vie aeree → nero; FR > 30, refill > 2 s/polso radiale assente, non esegue ordini semplici → rosso; altrimenti giallo.',
        'Solo manovre salvavita durante il triage: apertura delle vie aeree, controllo delle emorragie (tourniquet), posizione laterale.',
        'Ritriage continuo; registrare ogni paziente con il cartellino.',
        'Eventi NBCR (chimico, biologico, radiologico): decontaminazione prima dell’ingresso, DPI; procedura dedicata.',
      ] },
    ],
  },
]
